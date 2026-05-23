import { db } from '@/lib/db';
import { Routes } from '@/lib/routes';

export type InternalLink = {
  label: string;
  url: string;
};

/**
 * Dynamic Internal Linking Generator
 * Scans the database and generates SEO-friendly internal links for the footer and navigation.
 */
export const InternalLinkGenerator = {
  
  /**
   * Generates links for all popular cities in the database.
   */
  async getPopularCityLinks(limit = 12): Promise<InternalLink[]> {
    try {
      const cities = await db.city.findMany({
        where: { isPopular: true },
        orderBy: { sortOrder: 'asc' },
        take: limit,
      });
      
      return cities.map(city => ({
        label: `Used Cars in ${city.name}`,
        url: Routes.city(city.slug),
      }));
    } catch (e) {
      console.error('Error generating city links:', e);
      return [];
    }
  },

  /**
   * Generates links for the most popular brands.
   */
  async getPopularBrandLinks(limit = 10): Promise<InternalLink[]> {
    try {
      const brands = await db.brand.findMany({
        where: { isPopular: true },
        orderBy: { sortOrder: 'asc' },
        take: limit,
      });
      
      return brands.map(brand => ({
        label: `Used ${brand.name} Cars in Assam`,
        url: Routes.brand(brand.slug),
      }));
    } catch (e) {
      console.error('Error generating brand links:', e);
      return [];
    }
  },

  /**
   * Generates links for popular budget brackets.
   */
  getBudgetLinks(): InternalLink[] {
    return [
      { label: 'Used Cars Under 2 Lakh', url: Routes.budget('under-2-lakh') },
      { label: 'Used Cars Under 5 Lakh', url: Routes.budget('under-5-lakh') },
      { label: 'Used Cars Under 10 Lakh', url: Routes.budget('under-10-lakh') },
      { label: 'Used Cars Under 15 Lakh', url: Routes.budget('under-15-lakh') },
      { label: 'Used Cars Under 20 Lakh', url: Routes.budget('under-20-lakh') },
    ];
  },
  
  /**
   * Generates links for body types.
   */
  getBodyTypeLinks(): InternalLink[] {
    return [
      { label: 'Used SUV Cars', url: Routes.bodyType('suv') },
      { label: 'Used Sedan Cars', url: Routes.bodyType('sedan') },
      { label: 'Used Hatchback Cars', url: Routes.bodyType('hatchback') },
      { label: 'Used MUV/MPV Cars', url: Routes.bodyType('mpv') },
    ];
  }
};
