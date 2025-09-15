/**
 * Format price to Indonesian Rupiah currency format
 * @param price - Price as string or number
 * @returns Formatted price as "Rp 150.000"
 */
export function formatIDR(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format with dots as thousand separators
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
  
  return `Rp ${formatted}`;
}