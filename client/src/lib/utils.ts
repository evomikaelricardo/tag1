import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a Unicode-safe hash from any object.
 * This replaces the problematic btoa() approach that crashes on non-ASCII characters.
 */
export function createStableHash(obj: any): string {
  const jsonString = JSON.stringify(obj);
  
  // Use TextEncoder for proper Unicode handling
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);
  
  // Convert to base64 safely
  let base64 = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
  for (let i = 0; i < data.length; i += 3) {
    const a = data[i];
    const b = data[i + 1] || 0;
    const c = data[i + 2] || 0;
    
    const n = (a << 16) | (b << 8) | c;
    
    base64 += chars[(n >> 18) & 63];
    base64 += chars[(n >> 12) & 63];
    base64 += i + 1 < data.length ? chars[(n >> 6) & 63] : '=';
    base64 += i + 2 < data.length ? chars[n & 63] : '=';
  }
  
  return base64;
}
