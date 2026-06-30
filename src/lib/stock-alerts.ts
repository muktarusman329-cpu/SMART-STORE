import { Notification } from '@/models';

export async function createLowStockAlert(productName: string, stockQuantity: number) {
  await Notification.create({
    title: 'Low Stock Alert',
    message: `${productName} is running low on stock (${stockQuantity} remaining)`,
    type: 'warning',
    category: 'stock',
    priority: 'high',
  });
}

export function isLowStock(stockQuantity: number, minStockLevel: number): boolean {
  return stockQuantity <= minStockLevel;
}
