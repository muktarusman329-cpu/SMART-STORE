'use server';

import connectDB from '@/lib/mongodb';
import { Product, Category } from '@/models';
import { generateSKU, generateBarcode } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function getProducts(filters?: {
  category?: string;
  search?: string;
  lowStock?: boolean;
  expiring?: boolean;
}) {
  await connectDB();

  const query: any = { isActive: true };

  if (filters?.category) {
    query.categoryId = filters.category;
  }

  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { sku: { $regex: filters.search, $options: 'i' } },
      { barcode: { $regex: filters.search, $options: 'i' } },
    ];
  }

  if (filters?.lowStock) {
    query.stockQuantity = { $lte: 10 };
  }

  if (filters?.expiring) {
    const fifteenDaysFromNow = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    query.expiryDate = { $lte: fifteenDaysFromNow, $gte: new Date() };
  }

  const products = await Product.find(query)
    .populate('categoryId', 'name')
    .populate('supplierId', 'name')
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string) {
  await connectDB();

  const product = await Product.findById(id)
    .populate('categoryId', 'name')
    .populate('supplierId', 'name');

  return JSON.parse(JSON.stringify(product));
}

export async function createProduct(data: any) {
  await connectDB();

  const sku = data.sku || generateSKU();
  const barcode = data.barcode || generateBarcode();

  const product = await Product.create({
    ...data,
    sku,
    barcode,
  });

  revalidatePath('/dashboard/inventory');
  return JSON.parse(JSON.stringify(product));
}

export async function updateProduct(id: string, data: any) {
  await connectDB();

  const product = await Product.findByIdAndUpdate(
    id,
    { ...data },
    { new: true, runValidators: true }
  );

  revalidatePath('/dashboard/inventory');
  return JSON.parse(JSON.stringify(product));
}

export async function deleteProduct(id: string) {
  await connectDB();

  await Product.findByIdAndUpdate(id, { isActive: false });

  revalidatePath('/dashboard/inventory');
  return { success: true };
}

export async function updateStock(id: string, quantity: number, operation: 'add' | 'subtract') {
  await connectDB();

  const product = await Product.findById(id);

  if (!product) {
    throw new Error('Product not found');
  }

  if (operation === 'add') {
    product.stockQuantity += quantity;
  } else {
    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }
    product.stockQuantity -= quantity;
  }

  await product.save();

  // Check if stock is low and create notification
  if (product.stockQuantity <= product.minStockLevel) {
    const { Notification } = await import('@/models');
    await Notification.create({
      title: 'Low Stock Alert',
      message: `${product.name} is running low on stock (${product.stockQuantity} remaining)`,
      type: 'warning',
      category: 'stock',
      priority: 'high',
    });
  }

  revalidatePath('/dashboard/inventory');
  return JSON.parse(JSON.stringify(product));
}

export async function getCategories() {
  await connectDB();

  const categories = await Category.find({ isActive: true }).sort({ name: 1 });

  return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(data: any) {
  await connectDB();

  const category = await Category.create(data);

  revalidatePath('/dashboard/inventory');
  return JSON.parse(JSON.stringify(category));
}

export async function updateCategory(id: string, data: any) {
  await connectDB();

  const category = await Category.findByIdAndUpdate(
    id,
    { ...data },
    { new: true, runValidators: true }
  );

  revalidatePath('/dashboard/inventory');
  return JSON.parse(JSON.stringify(category));
}

export async function deleteCategory(id: string) {
  await connectDB();

  await Category.findByIdAndUpdate(id, { isActive: false });

  revalidatePath('/dashboard/inventory');
  return { success: true };
}

export async function getLowStockProducts() {
  await connectDB();

  const products = await Product.find({
    isActive: true,
    stockQuantity: { $lte: 10 },
  })
    .populate('categoryId', 'name')
    .sort({ stockQuantity: 1 });

  return JSON.parse(JSON.stringify(products));
}

export async function getExpiringProducts() {
  await connectDB();

  const fifteenDaysFromNow = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  const products = await Product.find({
    isActive: true,
    expiryDate: { $lte: fifteenDaysFromNow, $gte: new Date() },
  })
    .populate('categoryId', 'name')
    .sort({ expiryDate: 1 });

  return JSON.parse(JSON.stringify(products));
}
