import Image from 'next/image'
import Link from 'next/link'
import CarCard from '@/components/shared/CarCard'
import Pagination from '@/components/shared/Pagination'
import { getBannerForPage, FALLBACK_CAR_IMAGE } from '@/lib/images/car-image-map'
import {
  Search, MapPin, ShieldCheck, Sparkles, ArrowRight, Car, Eye,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────

interface MarketplacePageShellProps {
  // Page identity
  pageSlug: string
  pageTitle: string
  pageSubtitle?: string

  // Data
  cars: any[]
  total: number
  totalPages: number
  currentPage: number
  fallbackCars?: any[]
  isFallback?: boolean
  trendingCars?: any[]

  // URLs
  baseUrl: string
  searchParams?: Record<string, string | undefined>

  // Config
  showBanner?: boolean
  children?: React.ReactNode
}

// ─── Banner Component ───────────────────────────────────────────────

function PremiumBanner({ pageSlug, alt }: { pageSlug: string; alt: string }) {
  const banner = getBannerForPage(pageSlug)
  return (
    <section className="px-4 pt-4 max-w-7xl mx-auto">
      <div className="relative h-[200px] md:h-[300px] rounded-[20px] overflow-hidden shadow-xl group">
        <Image
          src={banner}
          alt={alt}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        {/* Subtle gradient at bottom for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </section>
  )
}

// ─── Car Grid ───────────────────────────────────────────────────────

function CarGrid({ cars }: { cars: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cars.map((car: any) => (
        <div key={car.id} className="relative group">
          {/* Views badge */}
          {car.viewsCount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-slate-100/50 flex items-center gap-1.5">
              <Eye className="size-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-600">
                {car.viewsCount.toLocaleString()} views
              </span>
            </div>
          )}
          <CarCard car={car} />
        </div>
      ))}
    </div>
  )
}

// ─── Empty State ────────────────────────────────────────────────────

function EmptyState({ pageTitle, fallbackCars, isFallback }: { pageTitle: string; fallbackCars?: any[]; isFallback?: boolean }) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[20px] border border-slate-200 p-10 text-center shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="size-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
            <Search className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            No exact matches found
          </h3>
          <p className="text-slate-500 mb-6">
            We couldn&apos;t find cars matching your filters for &quot;{pageTitle}&quot;.
            Try adjusting your criteria or explore trending cars below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/used-cars/in/assam"
              className="inline-flex justify-center items-center px-6 py-3 bg-brand text-white rounded-xl font-bold shadow-md hover:bg-brand/90 transition-colors"
            >
              Browse All Cars
            </Link>
            <Link
              href="https://wa.me/918721932757"
              className="inline-flex justify-center items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Request a Specific Car
            </Link>
          </div>
        </div>
      </div>

      {/* Fallback cars */}
      {isFallback && fallbackCars && fallbackCars.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            Popular Cars across Assam
          </h2>
          <CarGrid cars={fallbackCars} />
        </div>
      )}
    </div>
  )
}

// ─── Explore More Section ───────────────────────────────────────────

function ExploreMoreSection({ cars }: { cars: any[] }) {
  if (!cars || cars.length === 0) return null

  return (
    <div className="mt-12 pt-10 border-t border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            Explore More Cars
          </h2>
          <p className="text-sm text-slate-500 mt-1">Trending and popular picks across Assam</p>
        </div>
        <Link
          href="/used-cars/in/assam"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
        >
          View All <ArrowRight className="size-4" />
        </Link>
      </div>
      <CarGrid cars={cars} />
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────

export default function MarketplacePageShell({
  pageSlug,
  pageTitle,
  pageSubtitle,
  cars,
  total,
  totalPages,
  currentPage,
  fallbackCars,
  isFallback,
  trendingCars,
  baseUrl,
  searchParams,
  showBanner = true,
  children,
}: MarketplacePageShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner — full image, no text overlay */}
      {showBanner && (
        <PremiumBanner pageSlug={pageSlug} alt={pageTitle} />
      )}

      {/* Page heading */}
      <div className="bg-white border-b border-slate-100 mt-4">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-brand font-bold text-lg">{total}</span>
            <span className="text-slate-500 text-sm">
              {total === 1 ? 'car' : 'cars'} available
            </span>
            {pageSubtitle && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 text-sm">{pageSubtitle}</span>
              </>
            )}
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>200+ Point Inspection</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Easy Finance & Test Drive</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="size-3.5 text-brand" />
              <span>Local Assam Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Custom children (like QuickAnswerBox, sidebar, etc.) */}
        {children}

        {/* Car Grid or Empty State */}
        {total > 0 ? (
          <>
            <CarGrid cars={cars} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={baseUrl}
              searchParams={searchParams}
            />
          </>
        ) : (
          <EmptyState
            pageTitle={pageTitle}
            fallbackCars={fallbackCars || isFallback ? cars : undefined}
            isFallback={isFallback}
          />
        )}

        {/* Explore More — trending cars */}
        <ExploreMoreSection cars={trendingCars || []} />
      </div>
    </div>
  )
}
