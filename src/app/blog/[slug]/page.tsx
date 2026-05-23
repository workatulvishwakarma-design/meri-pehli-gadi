import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { db } from '@/lib/db'
import { BlogPage } from '@/components/pages/BlogPage'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  try {
    // Try by slug first
    let blog = await db.blogPost.findUnique({
      where: { slug },
      include: { author: true, category: true },
    })
    // Fallback: try by ID
    if (!blog) {
      blog = await db.blogPost.findUnique({
        where: { id: slug },
        include: { author: true, category: true },
      })
    }
    return blog
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params
  const blog = await getBlog(p.slug)

  if (!blog) {
    return { title: 'Article Not Found | MeriPehli Gadi' }
  }

  return {
    title: blog.seoTitle || `${blog.title} | MeriPehli Gadi Blog`,
    description: blog.seoDescription || blog.excerpt || `Read ${blog.title} on MeriPehli Gadi blog.`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || '',
      type: 'article',
      publishedTime: blog.createdAt.toISOString(),
      ...(blog.coverImage && { images: [{ url: blog.coverImage }] }),
    },
  }
}

export default async function BlogDetailRoute({ params }: PageProps) {
  const p = await params
  const blog = await getBlog(p.slug)

  if (!blog) {
    notFound()
  }

  // Increment views
  try {
    await db.blogPost.update({
      where: { id: blog.id },
      data: { viewsCount: { increment: 1 } },
    })
  } catch {}

  // For now, render the BlogPage component which handles its own detail view
  // Pass the blog data via a script tag for the client component to pick up
  return (
    <>
      <script
        id="blog-detail-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            blog: {
              ...blog,
              createdAt: blog.createdAt.toISOString(),
              updatedAt: blog.updatedAt.toISOString(),
              author: blog.author ? { id: blog.author.id, name: blog.author.name, avatar: blog.author.avatar } : null,
              category: blog.category ? { id: blog.category.id, name: blog.category.name, slug: blog.category.slug } : null,
            },
          }),
        }}
      />
      <BlogPage />
    </>
  )
}
