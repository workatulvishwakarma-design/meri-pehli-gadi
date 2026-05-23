import { getCachedTrendingCars, getCachedFeaturedCars } from '@/lib/cache/cars-cache';
import { safeArray } from '@/lib/safe';

export type FallbackResult = {
  cars: any[];
  isFallback: boolean;
  fallbackReason: string;
};

/**
 * Fallback Data Engine
 * Ensures that if a list query (city, brand, budget) yields 0 results,
 * the user is presented with alternative popular inventory instead of an empty screen.
 */
export const FallbackService = {
  
  /**
   * Provides fallback cars when a city search yields 0 results.
   */
  async getCityFallback(citySlug: string): Promise<FallbackResult> {
    console.log(`[FallbackService] Triggered for empty city: ${citySlug}`);
    // If a specific city has no cars, fallback to state-wide trending cars.
    const trendingCars = await getCachedTrendingCars(12);
    
    return {
      cars: safeArray(trendingCars),
      isFallback: true,
      fallbackReason: `No cars found in ${citySlug.replace('-', ' ')} right now. Check out these trending cars across Assam instead!`,
    };
  },

  /**
   * Provides fallback cars when a brand search yields 0 results.
   */
  async getBrandFallback(brandSlug: string): Promise<FallbackResult> {
    console.log(`[FallbackService] Triggered for empty brand: ${brandSlug}`);
    // If a brand has no cars, fallback to premium/featured cars.
    const featuredCars = await getCachedFeaturedCars(12);
    
    return {
      cars: safeArray(featuredCars),
      isFallback: true,
      fallbackReason: `We currently don't have any ${brandSlug.replace('-', ' ')} cars in stock. Here are some featured premium cars you might love.`,
    };
  },

  /**
   * General fallback for any other empty search (budget, body type, etc).
   */
  async getGeneralFallback(): Promise<FallbackResult> {
    console.log(`[FallbackService] Triggered general fallback`);
    const trendingCars = await getCachedTrendingCars(12);
    
    return {
      cars: safeArray(trendingCars),
      isFallback: true,
      fallbackReason: `No exact matches found. Here are our most popular cars right now.`,
    };
  }
};
