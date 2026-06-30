import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

function generateId(prefix: string, randomLength: number = 6): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 2 + randomLength).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateSKU(): string {
  return generateId('SKU', 4);
}

export function generateBarcode(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${timestamp}${random}`;
}

export function generateCustomerId(): string {
  return generateId('CUST');
}

export function generateTransactionId(): string {
  return generateId('TXN');
}
