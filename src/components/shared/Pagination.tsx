import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

function buildUrl(base: string, page: number, params?: Record<string, string | undefined>) {
  const sp = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val && key !== 'page') sp.set(key, val)
    })
  }
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `${base}?${qs}` : base
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  
  const pages: (number | '...')[] = [1]
  
  if (current > 3) pages.push('...')
  
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  
  for (let i = start; i <= end; i++) pages.push(i)
  
  if (current < total - 2) pages.push('...')
  
  pages.push(total)
  return pages
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10 mb-4" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(baseUrl, currentPage - 1, searchParams)}
          className="inline-flex items-center justify-center h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4 mr-1" />
          Prev
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-sm font-medium cursor-not-allowed">
          <ChevronLeft className="size-4 mr-1" />
          Prev
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-slate-400 text-sm select-none">
            •••
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(baseUrl, p, searchParams)}
            className={cn(
              'inline-flex items-center justify-center size-10 rounded-xl text-sm font-semibold transition-all',
              currentPage === p
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
            )}
            aria-current={currentPage === p ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(baseUrl, currentPage + 1, searchParams)}
          className="inline-flex items-center justify-center h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="size-4 ml-1" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-sm font-medium cursor-not-allowed">
          Next
          <ChevronRight className="size-4 ml-1" />
        </span>
      )}
    </nav>
  )
}
