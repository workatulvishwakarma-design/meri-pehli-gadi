import { db } from '@/lib/db';

/**
 * CMS Service for Static Pages (About, Terms, Privacy, etc.)
 */
export const PagesService = {
  async getPageBySlug(slug: string) {
    try {
      return await db.page.findUnique({
        where: { slug, isActive: true },
      });
    } catch (e) {
      console.error(`Error fetching page ${slug}:`, e);
      return null;
    }
  },
  
  async getAllPages() {
    try {
      return await db.page.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.error('Error fetching all pages:', e);
      return [];
    }
  }
};
