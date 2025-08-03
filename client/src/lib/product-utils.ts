// Utility functions for product selection and sampling

/**
 * Sample N distinct items from an array using a date-based seed for stability
 * @param items Array of items to sample from
 * @param count Number of items to sample
 * @param seed Optional seed string, defaults to current date YYYY-MM-DD
 * @returns Array of sampled items
 */
export function sampleDistinct<T>(items: T[], count: number, seed?: string): T[] {
  if (items.length <= count) return [...items];
  
  const dateString = seed || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const shuffled = [...items];
  
  // Simple seeded shuffle using date string as seed
  let seedValue = 0;
  for (let i = 0; i < dateString.length; i++) {
    seedValue += dateString.charCodeAt(i);
  }
  
  // Fisher-Yates shuffle with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    seedValue = (seedValue * 9301 + 49297) % 233280; // Simple LCG
    const j = Math.floor((seedValue / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}

/**
 * Get carousel products (8 random products with valid images and buyUrl)
 * @param products Array of all products
 * @returns Array of 8 products for carousel
 */
export function getCarouselProducts<T extends { image: string; buyUrl: string }>(products: T[]): T[] {
  const validProducts = products.filter(p => p.image && p.image.trim() !== '' && p.buyUrl && p.buyUrl.trim() !== '');
  return sampleDistinct(validProducts, 8);
}

/**
 * Get best seller products (12 random products with valid images and buyUrl, excluding carousel products)
 * @param products Array of all products
 * @param excludeProducts Products to exclude (e.g., carousel products)
 * @returns Array of 12 products for best sellers
 */
export function getBestSellerProducts<T extends { image: string; buyUrl: string; id?: number }>(
  products: T[], 
  excludeProducts: T[] = []
): T[] {
  const excludeIds = new Set(excludeProducts.map(p => p.id || JSON.stringify(p)));
  const validProducts = products.filter(p => 
    p.image && p.image.trim() !== '' && 
    p.buyUrl && p.buyUrl.trim() !== '' &&
    !excludeIds.has(p.id || JSON.stringify(p))
  );
  return sampleDistinct(validProducts, 12);
}