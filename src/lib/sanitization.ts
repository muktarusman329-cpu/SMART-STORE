/**
 * Input sanitization utilities to prevent NoSQL injection and other attacks
 */

// Sanitize string input by removing potentially dangerous characters
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove MongoDB operators and special characters
  return input
    .replace(/[{}$]/g, '') // Remove MongoDB operators
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
}

// Sanitize email input
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  
  // Allow only valid email characters
  const sanitized = email
    .toLowerCase()
    .replace(/[{}$]/g, '')
    .trim();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
}

// Sanitize search queries to prevent regex injection
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  
  // Escape regex special characters
  return query
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/[{}$]/g, '')
    .trim();
}

// Validate and sanitize ObjectId
export function sanitizeObjectId(id: string): string | null {
  if (typeof id !== 'string') return null;
  
  // Remove any MongoDB operators
  const sanitized = id.replace(/[{}$]/g, '').trim();
  
  // Basic ObjectId validation (24 hex characters)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(sanitized) ? sanitized : null;
}

// Sanitize phone number
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return '';
  
  // Keep only digits and common phone number characters
  return phone
    .replace(/[{}$]/g, '')
    .replace(/[^\d+\-\s()]/g, '')
    .trim();
}

// Validate numeric input
export function sanitizeNumber(value: any, min?: number, max?: number): number | null {
  const num = Number(value);
  
  if (isNaN(num)) return null;
  
  if (min !== undefined && num < min) return null;
  if (max !== undefined && num > max) return null;
  
  return num;
}

// Sanitize object by recursively cleaning all string values
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

// Validate role enum
export function validateRole(role: string): boolean {
  const validRoles = ['admin', 'manager', 'cashier'];
  return validRoles.includes(role);
}

// Validate category enum
export function validateCategory(category: string): boolean {
  const validCategories = ['stock', 'expiry', 'payment', 'system', 'ai_insight'];
  return validCategories.includes(category);
}
