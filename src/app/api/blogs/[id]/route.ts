import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/blogs/[id] - Get single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const blog = await db.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: true,
      },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Increment views
    await db.blogPost.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    })

    // Get related blogs
    const relatedBlogs = await db.blogPost.findMany({
      where: {
        id: { not: id },
        status: 'PUBLISHED',
        ...(blog.categoryId ? { categoryId: blog.categoryId } : {}),
      },
      take: 4,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ blog, relatedBlogs })
  } catch (error) {
    console.error('Get blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/blogs/[id] - Update blog
const updateBlogSchema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateBlogSchema.parse(body)

    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const blog = await db.blogPost.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: true,
      },
    })

    return NextResponse.json({ blog })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Update blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[id] - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    await db.blogPost.delete({ where: { id } })

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Delete blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
