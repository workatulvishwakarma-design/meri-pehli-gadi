import { db } from '@/lib/db';
import { safeArray } from '@/lib/safe';

/**
 * CMS Service for Blog Posts
 */
export const BlogService = {
  async getAllBlogs(limit = 10, page = 1) {
    const skip = (page - 1) * limit;
    
    try {
      const [blogs, total] = await Promise.all([
        db.blogPost.findMany({
          where: { status: 'PUBLISHED' },
          include: {
            author: { select: { name: true, avatar: true } },
            category: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        db.blogPost.count({ where: { status: 'PUBLISHED' } })
      ]);
      
      return {
        blogs: safeArray(blogs),
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (e) {
      console.error('Error fetching blogs:', e);
      return { blogs: [], total: 0, totalPages: 0 };
    }
  },

  async getBlogBySlug(slug: string) {
    try {
      const blog = await db.blogPost.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
          author: { select: { name: true, avatar: true, id: true } },
          category: true,
        }
      });
      
      if (blog) {
        // Optimistically increment views
        await db.blogPost.update({
          where: { id: blog.id },
          data: { viewsCount: { increment: 1 } }
        });
      }
      
      return blog;
    } catch (e) {
      console.error(`Error fetching blog ${slug}:`, e);
      return null;
    }
  },
  
  async getLatestBlogs(limit = 3) {
    try {
      return await db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        include: { author: { select: { name: true } }, category: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (e) {
      console.error('Error fetching latest blogs:', e);
      return [];
    }
  }
};
