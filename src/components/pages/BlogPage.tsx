'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  BookOpen, Calendar, User, ArrowRight, ChevronLeft, Clock, Tag,
  Share2, Facebook, Twitter, Linkedin, Link2, Eye, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
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

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  author: string
  status: string
  viewsCount: number
  createdAt: string
  updatedAt: string
}

// ─── Blog Listing Page ──────────────────────────────────────────────

function BlogListingPage() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalBlogs, setTotalBlogs] = useState(0)
  const pageSize = 9

  const categories = ['All', 'Buying Guide', 'Selling Tips', 'Finance', 'Insurance', 'Industry News', 'Car Maintenance']

  const fetchBlogs = (showLoader: boolean) => {
    if (showLoader) setLoading(true)
    const params = new URLSearchParams({
      status: 'PUBLISHED',
      page: page.toString(),
      limit: pageSize.toString(),
    })
    if (searchQuery) params.set('search', searchQuery)

    fetch(`/api/blogs?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setBlogs(d.blogs || [])
        setTotalBlogs(d.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs(true)
  }, [page, searchQuery])

  const filteredBlogs = useMemo(() => {
    if (activeCategory === 'All') return blogs
    return blogs.filter((b) => b.category === activeCategory)
  }, [blogs, activeCategory])

  const totalPages = Math.ceil(totalBlogs / pageSize)

  const getCategoryColor = (cat: string): string => {
    const colors: Record<string, string> = {
      'Buying Guide': 'bg-blue-100 text-blue-700',
      'Selling Tips': 'bg-emerald-100 text-emerald-700',
      'Finance': 'bg-orange-100 text-orange-700',
      'Insurance': 'bg-purple-100 text-purple-700',
      'Industry News': 'bg-rose-100 text-rose-700',
      'Car Maintenance': 'bg-amber-100 text-amber-700',
    }
    return colors[cat] || 'bg-slate-100 text-slate-700'
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${slug}`)
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628] py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-[10%] size-40 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute bottom-10 right-[10%] size-60 rounded-full bg-blue-500 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-white/10 text-white border-0 mb-4 text-xs">
              <BookOpen className="size-3 mr-1" />
              Knowledge Hub
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-200 to-orange-300 bg-clip-text text-transparent">
                Blog & News
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-8">
              Stay updated with the latest car buying tips, industry news, and guides from MeriPehli Gadi.
            </p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:border-accent-orange focus-visible:ring-accent-orange/30"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveCategory(cat); setPage(1) }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="rounded-xl overflow-hidden">
                  <Skeleton className="aspect-[16/9] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="size-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No Articles Found</h3>
              <p className="text-slate-400 text-sm">
                {searchQuery
                  ? `No articles matching "${searchQuery}". Try a different search.`
                  : `No articles in "${activeCategory}" yet. Check back soon!`}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog, i) => (
                  <FadeInSection key={blog.id} delay={i * 0.05}>
                    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                      <Card className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                        {/* Cover Image */}
                        <div className="relative aspect-[16/9] bg-slate-200 overflow-hidden group cursor-pointer"
                          onClick={() => navigateTo('blog-detail', { id: blog.id })}
                        >
                          {blog.coverImage ? (
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                              <BookOpen className="size-10 text-slate-400" />
                            </div>
                          )}
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(blog.category)}`}>
                              {blog.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-4">
                          <h3
                            className="font-bold text-brand text-base leading-tight line-clamp-2 mb-2 cursor-pointer hover:text-accent-blue transition-colors"
                            onClick={() => navigateTo('blog-detail', { id: blog.id })}
                          >
                            {blog.title}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                            {blog.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {formatDate(blog.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="size-3" />
                                {blog.viewsCount}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent-blue hover:text-blue-700 p-0 h-auto text-xs font-semibold"
                              onClick={() => navigateTo('blog-detail', { id: blog.id })}
                            >
                              Read More <ArrowRight className="size-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </FadeInSection>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <FadeInSection delay={0.2}>
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-lg"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .map((p, i, arr) => (
                          <span key={p} className="flex items-center gap-1">
                            {i > 0 && arr[i - 1] !== p - 1 && (
                              <span className="text-slate-400 text-xs px-1">...</span>
                            )}
                            <Button
                              variant={page === p ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPage(p)}
                              className={`rounded-lg w-9 h-9 ${page === p ? 'bg-brand hover:bg-brand-light text-white' : ''}`}
                            >
                              {p}
                            </Button>
                          </span>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="rounded-lg"
                    >
                      Next
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </FadeInSection>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

// ─── Blog Detail Page ───────────────────────────────────────────────

function BlogDetailPage() {
  const { pageParams, navigateTo, goBack } = useAppStore()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pageParams.id) return
    const controller = new AbortController()
    fetch(`/api/blogs/${pageParams.id}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        setBlog(d.blog || null)
        setRelatedBlogs(d.relatedBlogs || [])
        setLoading(false)
      })
      .catch((err) => { if (err.name !== 'AbortError') setLoading(false) })
    return () => controller.abort()
  }, [pageParams.id])

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryColor = (cat: string): string => {
    const colors: Record<string, string> = {
      'Buying Guide': 'bg-blue-100 text-blue-700',
      'Selling Tips': 'bg-emerald-100 text-emerald-700',
      'Finance': 'bg-orange-100 text-orange-700',
      'Insurance': 'bg-purple-100 text-purple-700',
      'Industry News': 'bg-rose-100 text-rose-700',
      'Car Maintenance': 'bg-amber-100 text-amber-700',
    }
    return colors[cat] || 'bg-slate-100 text-slate-700'
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = blog?.title || ''
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
  }

  if (loading) {
    return (
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-4 w-40 mb-6" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-3/4 mb-6" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="py-16 md:py-24 text-center">
        <BookOpen className="size-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-600 mb-2">Article Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => navigateTo('blog')} className="rounded-lg bg-brand hover:bg-brand-light text-white">
          <ArrowRight className="size-4 mr-2" />
          Back to Blog
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb + Back */}
      <section className="py-4 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-slate-500 hover:text-brand transition-colors"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => navigateTo('blog')}
              className="text-slate-500 hover:text-brand transition-colors"
            >
              Blog
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-brand font-medium truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Category Badge */}
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${getCategoryColor(blog.category)}`}>
              {blog.category}
            </span>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-extrabold text-brand mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <User className="size-4" />
                {blog.author || 'MeriPehli Gadi Team'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="size-4" />
                {blog.viewsCount} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                5 min read
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 pb-6 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500 mr-1">Share:</span>
              {[
                { icon: Facebook, platform: 'facebook', label: 'Facebook' },
                { icon: Twitter, platform: 'twitter', label: 'Twitter' },
                { icon: Linkedin, platform: 'linkedin', label: 'LinkedIn' },
                { icon: Link2, platform: 'copy', label: 'Copy Link' },
              ].map((share) => (
                <motion.button
                  key={share.platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare(share.platform)}
                  className="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                  aria-label={share.label}
                >
                  <share.icon className="size-3.5" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="bg-white pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200">
              {blog.coverImage ? (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 720px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <BookOpen className="size-16 text-slate-400" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeInSection>
            <div className="prose prose-slate max-w-none prose-headings:text-brand prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-accent-blue prose-strong:text-brand prose-li:text-slate-600 prose-img:rounded-xl">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p className="text-slate-600 leading-relaxed">{blog.excerpt}</p>
              )}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Share Again + Tags */}
      <section className="py-8 bg-slate-50 border-t border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="size-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Share this article</span>
              {[
                { icon: Facebook, platform: 'facebook' },
                { icon: Twitter, platform: 'twitter' },
                { icon: Linkedin, platform: 'linkedin' },
                { icon: Link2, platform: 'copy' },
              ].map((share) => (
                <motion.button
                  key={share.platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare(share.platform)}
                  className="size-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <share.icon className="size-3.5" />
                </motion.button>
              ))}
            </div>
            <Badge variant="secondary" className="gap-1">
              <Tag className="size-3" />
              {blog.category}
            </Badge>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <FadeInSection>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-brand mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedBlogs.slice(0, 3).map((relBlog) => (
                    <motion.div
                      key={relBlog.id}
                      whileHover={{ y: -3 }}
                      onClick={() => navigateTo('blog-detail', { id: relBlog.id })}
                      className="cursor-pointer"
                    >
                      <Card className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow h-full">
                        <div className="relative aspect-[16/9] bg-slate-200 overflow-hidden">
                          {relBlog.coverImage ? (
                            <Image
                              src={relBlog.coverImage}
                              alt={relBlog.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 240px"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                              <BookOpen className="size-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(relBlog.category)}`}>
                            {relBlog.category}
                          </span>
                          <h3 className="font-semibold text-brand text-sm leading-tight mt-1.5 line-clamp-2">
                            {relBlog.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1.5">
                            {formatDate(relBlog.createdAt)}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Main Export ────────────────────────────────────────────────────

export function BlogPage() {
  const currentPage = useAppStore((s) => s.currentPage)

  switch (currentPage) {
    case 'blog-detail':
      return <BlogDetailPage />
    default:
      return <BlogListingPage />
  }
}
