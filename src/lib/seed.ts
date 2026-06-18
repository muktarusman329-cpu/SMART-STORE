import connectDB from './mongodb';
import bcrypt from 'bcryptjs';
import { User, Category, Product, Customer, Supplier, Expense, Employee, Branch, Notification } from '@/models';

export async function seedDatabase() {
  await connectDB();

  console.log('Starting database seed...');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Customer.deleteMany({});
  await Supplier.deleteMany({});
  await Expense.deleteMany({});
  await Employee.deleteMany({});
  await Branch.deleteMany({});
  await Notification.deleteMany({});

  console.log('Cleared existing data');

  // Create Branch
  const branch = await Branch.create({
    name: 'Main Store',
    code: 'MAIN',
    address: '123 Main Street, City',
    phone: '+1 234 567 8900',
    email: 'main@smartmart.com',
    managerId: null, // Will be updated after creating admin
    isActive: true,
    settings: {
      currency: 'USD',
      taxRate: 0,
      lowStockThreshold: 10,
      expiryWarningDays: 15,
    },
  });

  console.log('Created branch');

  // Create Users
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@smartmart.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    phone: '+1 234 567 8901',
    branchId: branch._id,
    isActive: true,
  });

  const managerUser = await User.create({
    name: 'Manager User',
    email: 'manager@smartmart.com',
    password: await bcrypt.hash('manager123', 10),
    role: 'manager',
    phone: '+1 234 567 8902',
    branchId: branch._id,
    isActive: true,
  });

  const cashierUser = await User.create({
    name: 'Cashier User',
    email: 'cashier@smartmart.com',
    password: await bcrypt.hash('cashier123', 10),
    role: 'cashier',
    phone: '+1 234 567 8903',
    branchId: branch._id,
    isActive: true,
  });

  // Update branch manager
  await Branch.findByIdAndUpdate(branch._id, { managerId: adminUser._id });

  console.log('Created users');

  // Create Categories
  const categories = await Category.create([
    { name: 'Beverages', description: 'All types of drinks', isActive: true },
    { name: 'Groceries', description: 'Food items and groceries', isActive: true },
    { name: 'Dairy', description: 'Milk, cheese, and dairy products', isActive: true },
    { name: 'Snacks', description: 'Chips, cookies, and snacks', isActive: true },
    { name: 'Personal Care', description: 'Personal hygiene products', isActive: true },
    { name: 'Household', description: 'Cleaning and household items', isActive: true },
  ]);

  console.log('Created categories');

  // Create Products
  const products = await Product.create([
    {
      name: 'Rice 10kg',
      sku: 'SKU-RICE-001',
      barcode: '1234567890123',
      description: 'Premium quality rice',
      categoryId: categories[1]._id,
      branchId: branch._id,
      images: [],
      buyingPrice: 25,
      sellingPrice: 30,
      stockQuantity: 50,
      minStockLevel: 10,
      unit: 'kg',
      supplierId: null,
      isActive: true,
    },
    {
      name: 'Cooking Oil 5L',
      sku: 'SKU-OIL-001',
      barcode: '1234567890124',
      description: 'Pure vegetable oil',
      categoryId: categories[1]._id,
      branchId: branch._id,
      images: [],
      buyingPrice: 20,
      sellingPrice: 25,
      stockQuantity: 30,
      minStockLevel: 10,
      unit: 'L',
      supplierId: null,
      isActive: true,
    },
    {
      name: 'Sugar 5kg',
      sku: 'SKU-SUGAR-001',
      barcode: '1234567890125',
      description: 'White refined sugar',
      categoryId: categories[1]._id,
      branchId: branch._id,
      images: [],
      buyingPrice: 15,
      sellingPrice: 20,
      stockQuantity: 40,
      minStockLevel: 10,
      unit: 'kg',
      supplierId: null,
      isActive: true,
    },
    {
      name: 'Milk 1L',
      sku: 'SKU-MILK-001',
      barcode: '1234567890126',
      description: 'Fresh whole milk',
      categoryId: categories[2]._id,
      branchId: branch._id,
      images: [],
      buyingPrice: 8,
      sellingPrice: 10,
      stockQuantity: 60,
      minStockLevel: 15,
      unit: 'L',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      supplierId: null,
      isActive: true,
    },
    {
      name: 'Coca Cola 2L',
      sku: 'SKU-COKE-001',
      barcode: '1234567890127',
      description: 'Carbonated soft drink',
      categoryId: categories[0]._id,
      branchId: branch._id,
      images: [],
      buyingPrice: 12,
      sellingPrice: 15,
      stockQuantity: 8,
      minStockLevel: 10,
      unit: 'bottle',
      supplierId: null,
      isActive: true,
    },
    {
      name: 'Bread Loaf',
      sku: 'SKU-BREAD-001',
      barcode: '1234567890128',
      description: 'Fresh white bread',
      categoryId: categories[1]._id,
      branchId: branch._id,
      images: [],
      buyingPrice: 18,
      sellingPrice: 22,
      stockQuantity: 20,
      minStockLevel: 10,
      unit: 'loaf',
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      supplierId: null,
      isActive: true,
    },
  ]);

  console.log('Created products');

  // Create Customers
  const customers = await Customer.create([
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8904',
      address: '456 Oak Street',
      loyaltyPoints: 150,
      totalSpent: 500,
      purchaseCount: 15,
      notes: 'Regular customer',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8905',
      address: '789 Pine Avenue',
      loyaltyPoints: 300,
      totalSpent: 1000,
      purchaseCount: 25,
      notes: 'VIP customer',
    },
  ]);

  console.log('Created customers');

  // Create Suppliers
  const suppliers = await Supplier.create([
    {
      name: 'Food Corp',
      company: 'Food Corporation Ltd',
      email: 'orders@foodcorp.com',
      phone: '+1 234 567 8906',
      address: '321 Industrial Park',
      productsSupplied: [products[0]._id, products[1]._id],
      totalPurchases: 5000,
      outstandingDebt: 1000,
      paymentTerms: 'Net 30',
      notes: 'Primary supplier',
      isActive: true,
    },
    {
      name: 'Dairy Farms',
      company: 'Fresh Dairy Farms',
      email: 'supply@dairyfarms.com',
      phone: '+1 234 567 8907',
      address: '654 Farm Road',
      productsSupplied: [products[3]._id],
      totalPurchases: 3000,
      outstandingDebt: 500,
      paymentTerms: 'Net 15',
      notes: 'Dairy supplier',
      isActive: true,
    },
  ]);

  // Update products with supplier IDs
  await Product.findByIdAndUpdate(products[0]._id, { supplierId: suppliers[0]._id });
  await Product.findByIdAndUpdate(products[1]._id, { supplierId: suppliers[0]._id });
  await Product.findByIdAndUpdate(products[3]._id, { supplierId: suppliers[1]._id });

  console.log('Created suppliers');

  // Create Expenses
  const expenses = await Expense.create([
    {
      title: 'Monthly Rent',
      description: 'Store rent for the month',
      category: 'rent',
      amount: 2000,
      date: new Date(),
      branchId: branch._id,
      paidTo: 'Landlord',
      notes: 'Monthly payment',
      createdBy: adminUser._id,
    },
    {
      title: 'Electricity Bill',
      description: 'Monthly electricity consumption',
      category: 'electricity',
      amount: 500,
      date: new Date(),
      branchId: branch._id,
      paidTo: 'Power Company',
      notes: 'Monthly payment',
      createdBy: adminUser._id,
    },
    {
      title: 'Staff Salary',
      description: 'Monthly salary payments',
      category: 'salary',
      amount: 3000,
      date: new Date(),
      branchId: branch._id,
      paidTo: 'Staff',
      notes: 'Monthly payment',
      createdBy: adminUser._id,
    },
  ]);

  console.log('Created expenses');

  // Create Employees
  const employees = await Employee.create([
    {
      userId: managerUser._id,
      employeeId: 'EMP-001',
      position: 'Store Manager',
      department: 'Management',
      salary: 5000,
      hireDate: new Date('2023-01-01'),
      branchId: branch._id,
      isActive: true,
      performance: {
        totalSales: 50000,
        totalTransactions: 500,
        averageTransactionValue: 100,
        lastMonthSales: 5000,
      },
      attendance: {
        present: 100,
        absent: 5,
        late: 3,
      },
    },
    {
      userId: cashierUser._id,
      employeeId: 'EMP-002',
      position: 'Cashier',
      department: 'Sales',
      salary: 2500,
      hireDate: new Date('2023-06-01'),
      branchId: branch._id,
      isActive: true,
      performance: {
        totalSales: 30000,
        totalTransactions: 400,
        averageTransactionValue: 75,
        lastMonthSales: 3000,
      },
      attendance: {
        present: 80,
        absent: 8,
        late: 5,
      },
    },
  ]);

  console.log('Created employees');

  // Create Notifications
  await Notification.create([
    {
      title: 'Low Stock Alert',
      message: 'Coca Cola 2L is running low on stock (8 remaining)',
      type: 'warning',
      category: 'stock',
      priority: 'high',
      userId: adminUser._id,
      branchId: branch._id,
      isRead: false,
      metadata: { productId: products[4]._id, stockQuantity: 8 },
    },
    {
      title: 'Expiring Products',
      message: 'Bread Loaf expires in 3 days',
      type: 'warning',
      category: 'expiry',
      priority: 'high',
      userId: adminUser._id,
      branchId: branch._id,
      isRead: false,
      metadata: { productId: products[5]._id, expiryDate: products[5].expiryDate },
    },
    {
      title: 'Supplier Payment Due',
      message: 'Food Corp payment of $1000 is due soon',
      type: 'warning',
      category: 'payment',
      priority: 'medium',
      userId: adminUser._id,
      branchId: branch._id,
      isRead: true,
      metadata: { supplierId: suppliers[0]._id, amount: 1000 },
    },
  ]);

  console.log('Created notifications');

  console.log('Database seed completed successfully!');
  console.log('\nDemo Credentials:');
  console.log('Admin: admin@smartmart.com / admin123');
  console.log('Manager: manager@smartmart.com / manager123');
  console.log('Cashier: cashier@smartmart.com / cashier123');
}

// Run seed if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
