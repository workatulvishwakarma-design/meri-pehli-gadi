// Safe Rendering Layer
// Prevents application crashes from malformed data or missing images.

/**
 * Safely access an image URL with a fallback mechanism
 */
export function safeImage(url: string | null | undefined, fallbackType: 'car' | 'brand' | 'avatar' | 'banner' = 'car'): string {
  if (url && url.trim() !== '') return url;
  
  const fallbacks = {
    car: '/assets/images/fallback-car.jpg', // Ensure this exists in public/
    brand: '/assets/images/fallback-brand.png',
    avatar: '/assets/images/fallback-avatar.png',
    banner: '/assets/images/fallback-banner.jpg',
  };
  
  return fallbacks[fallbackType];
}

/**
 * Safely parse JSON strings
 */
export function safeParseJSON<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Safe parsing failed:', e);
    return fallback;
  }
}

/**
 * Ensures an array is never undefined
 */
export function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : [];
}

/**
 * Format currency safely
 */
export function safeCurrency(amount: number | null | undefined, locale = 'en-IN', currency = 'INR'): string {
  if (amount == null || isNaN(amount)) return 'Price on Request';
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

/**
 * Generate a safe slug from a string
 */
export function safeSlug(text: string | null | undefined): string {
  if (!text) return 'unknown';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
