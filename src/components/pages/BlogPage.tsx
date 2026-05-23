'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Calendar, Clock, ArrowLeft, ArrowUpRight, Share2, Facebook,
  Twitter, Link2, BookOpen, User, Eye, Tag, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAppStore } from '@/lib/store'

// ─── Animation Helpers ──────────────────────────────────────────────

function FadeInSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Types ──────────────────────────────────────────────────────────

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  coverImage: string | null
  status: string
  viewsCount: number
  createdAt: string
  author?: { id: string; name: string; avatar?: string | null } | null
  category?: { id: string; name: string; slug: string } | null
}

interface RelatedBlog extends BlogPost {
  categoryId?: string
}

// ─── Blog Listing Component ─────────────────────────────────────────

function BlogListing() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const navigateTo = useAppStore((s) => s.navigateTo)

  useEffect(() => {
    fetch('/api/blogs?limit=12')
      .then((r) => r.json())
      .then((d) => {
        setBlogs(d.blogs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleReadBlog = (blog: BlogPost) => {
    useAppStore.getState().navigateTo('blog-detail', { id: blog.id })
  }

  const handleCopyLink = (e: React.MouseEvent, title: string) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/blog/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)
  }

  return (
    <>
      {/* Blog Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">Latest Articles</h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Stay updated with the latest news, tips, and guides about cars and the automobile industry
              </p>
            </div>
          </FadeInSection>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="rounded-2xl overflow-hidden border-slate-200/60">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="size-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand mb-2">No Articles Yet</h3>
              <p className="text-slate-500 mb-6">We&apos;re working on some great content. Check back soon!</p>
              <Button
                onClick={() => navigateTo('home')}
                variant="outline"
                className="rounded-xl"
              >
                Back to Home
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <FadeInSection key={blog.id} delay={i * 0.05}>
                  <Card
                    className="rounded-2xl overflow-hidden border-slate-200/60 hover:shadow-lg transition-all duration-300 group cursor-pointer car-card-hover"
                    onClick={() => handleReadBlog(blog)}
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                          <img
                            src="/images/blog/blog-default.svg"
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                              ;(e.target as HTMLImageElement).parentElement!.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand/30"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                                </div>
                              `
                            }}
                          />
                        </div>
                      )}
                      {/* Category Badge */}
                      {blog.category && (
                        <Badge className="absolute top-3 left-3 bg-white/90 text-brand border-0 text-xs font-medium shadow-sm">
                          <Tag className="size-3 mr-1" />
                          {blog.category.name}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(blog.createdAt)}
                        </span>
                        {blog.viewsCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="size-3" />
                            {blog.viewsCount}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-brand text-base mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {blog.excerpt || 'Read this article to learn more about cars and the automobile industry.'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="size-7 bg-brand rounded-full flex items-center justify-center">
                            {blog.author?.avatar ? (
                              <img src={blog.author.avatar} alt={blog.author.name} className="size-full rounded-full" />
                            ) : (
                              <User className="size-3.5 text-white" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {blog.author?.name || 'MeriPehli Gadi'}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-accent-orange flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More
                          <ChevronRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// ─── Blog Detail Component ──────────────────────────────────────────

function BlogDetail() {
  const { pageParams, goBack } = useAppStore()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([])
  const [loading, setLoading] = useState(true)
  const blogId = pageParams.id

  useEffect(() => {
    if (!blogId) return

    fetch(`/api/blogs/${blogId}`)
      .then((r) => r.json())
      .then((d) => {
        setBlog(d.blog || null)
        setRelatedBlogs(d.relatedBlogs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [blogId])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog?.title || '')}`, '_blank')
  }

  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-6 w-2/3 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!blog) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="size-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-brand mb-2">Article Not Found</h3>
          <p className="text-slate-500 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={goBack} variant="outline" className="rounded-xl">
            <ArrowLeft className="size-4 mr-2" />
            Go Back
          </Button>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <FadeInSection>
            <Button
              variant="ghost"
              onClick={goBack}
              className="mb-6 rounded-xl text-slate-500 hover:text-brand"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to Blog
            </Button>
          </FadeInSection>

          {/* Breadcrumb */}
          <FadeInSection>
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => useAppStore.getState().navigateTo('home')} className="cursor-pointer hover:text-brand">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => useAppStore.getState().navigateTo('blog')} className="cursor-pointer hover:text-brand">
                    Blog
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-brand font-medium line-clamp-1 max-w-[200px]">{blog.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </FadeInSection>

          {/* Title & Meta */}
          <FadeInSection delay={0.05}>
            {blog.category && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
                <Tag className="size-3 mr-1" />
                {blog.category.name}
              </Badge>
            )}

            <h1 className="text-2xl md:text-4xl font-extrabold text-brand mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-brand rounded-full flex items-center justify-center">
                  {blog.author?.avatar ? (
                    <img src={blog.author.avatar} alt={blog.author.name} className="size-full rounded-full" />
                  ) : (
                    <User className="size-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-700">{blog.author?.name || 'MeriPehli Gadi'}</p>
                </div>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDate(blog.createdAt)}
              </span>
              {blog.viewsCount > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {blog.viewsCount} views
                </span>
              )}
            </div>
          </FadeInSection>

          {/* Cover Image */}
          <FadeInSection delay={0.1}>
            <div className="rounded-2xl overflow-hidden mb-8 bg-slate-100">
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
                  <img
                    src="/images/blog/blog-default.svg"
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      ;(e.target as HTMLImageElement).parentElement!.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand/20"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                        </div>
                      `
                    }}
                  />
                </div>
              )}
            </div>
          </FadeInSection>

          {/* Content */}
          <FadeInSection delay={0.15}>
            <div className="prose prose-slate max-w-none mb-8">
              {blog.content ? (
                <div
                  className="text-slate-600 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <div className="text-slate-500 leading-relaxed">
                  <p>This article is currently being written. Please check back soon for the full content.</p>
                </div>
              )}
            </div>
          </FadeInSection>

          {/* Share Buttons */}
          <FadeInSection delay={0.2}>
            <div className="border-t border-slate-200 pt-6 mt-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Share2 className="size-4" />
                  Share this article
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareFacebook}
                    className="rounded-xl gap-1.5"
                  >
                    <Facebook className="size-4 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareTwitter}
                    className="rounded-xl gap-1.5"
                  >
                    <Twitter className="size-4 text-sky-500" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="rounded-xl gap-1.5"
                  >
                    <Link2 className="size-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <FadeInSection delay={0.25}>
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h2 className="text-xl font-bold text-brand mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <Card
                      key={relatedBlog.id}
                      className="rounded-xl overflow-hidden border-slate-200/60 hover:shadow-md transition-all duration-300 cursor-pointer group"
                      onClick={() => useAppStore.getState().navigateTo('blog-detail', { id: relatedBlog.id })}
                    >
                      <div className="flex gap-4 p-4">
                        <div className="size-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {relatedBlog.coverImage ? (
                            <img src={relatedBlog.coverImage} alt={relatedBlog.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
                              <BookOpen className="size-5 text-brand/30" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-brand text-sm line-clamp-2 group-hover:text-accent-blue transition-colors mb-1">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(relatedBlog.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </FadeInSection>
          )}
        </div>
      </section>
    </>
  )
}

// ─── Main BlogPage Component ────────────────────────────────────────

export function BlogPage() {
  const { currentPage } = useAppStore()
  const isBlogDetail = currentPage === 'blog-detail'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand via-brand-light to-purple-900 py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyem0wLTE2aC0ydi00aDJ2Mmg0djJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                <BookOpen className="size-3.5 mr-1.5" />
                Blog & Articles
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                {isBlogDetail ? 'Article' : <>Our <span className="text-purple-300">Blog</span></>}
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                {isBlogDetail
                  ? 'Read the latest articles and insights from MeriPehli Gadi'
                  : 'Stay updated with car tips, industry news, and expert guides'
                }
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      {isBlogDetail ? <BlogDetail /> : <BlogListing />}

      {/* CTA Section - Only for listing */}
      {!isBlogDetail && (
        <section className="py-12 md:py-16 px-4 bg-slate-50/50">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <Card className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-brand to-brand-light text-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Ready to Find Your Dream Car?
                </h2>
                <p className="text-white/80 mb-6 max-w-lg mx-auto">
                  Explore our wide collection of verified used and new cars across Northeast India.
                </p>
                <Button
                  onClick={() => useAppStore.getState().navigateTo('used-cars')}
                  className="bg-white text-brand hover:bg-slate-100 rounded-xl h-12 px-8 text-base font-semibold"
                >
                  Browse Cars
                  <ArrowUpRight className="size-4 ml-2" />
                </Button>
              </Card>
            </FadeInSection>
          </div>
        </section>
      )}
    </div>
  )
}
