'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal, Grid3X3, List, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Home, Car, X, RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useAppStore, type PageName } from '@/lib/store'
import CarCard from '@/components/shared/CarCard'
import {
  QuickAnswerBox,
  FAQSchemaBlock,
  LocalTrustBlock,
  RelatedSearchesBlock,
  PopularCityLinks,
  PopularBrandLinks,
  BudgetLinks,
  FinanceCTA,
  InsuranceCTA,
  SellCarCTA,
  DynamicMeta,
  AIReadableSummary,
} from '@/components/seo/SEOComponents'
import {
  ASSAM_CITIES,
  GENERAL_FAQS,
  CAR_BRANDS,
  BUDGET_RANGES,
  getCityBySlug,
  getQuickAnswer,
} from '@/lib/seo-data'

// ─── Constants ───────────────────────────────────────────────────────
const FUEL_OPTIONS = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'] as const
const TRANSMISSION_OPTIONS = ['MANUAL', 'AUTOMATIC'] as const
const BODY_OPTIONS = ['SUV', 'SEDAN', 'HATCHBACK', 'MPV', 'COUPE', 'CONVERTIBLE'] as const
const YEAR_RANGE = Array.from({ length: 2024 - 2015 + 1 }, (_, i) => 2024 - i)
const LUXURY_BRAND_SLUGS = ['bmw', 'mercedes-benz', 'audi']

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price Low-High' },
  { value: 'price-desc', label: 'Price High-Low' },
  { value: 'km-driven-asc', label: 'KM Low-High' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'popular', label: 'Most Popular' },
] as const

// ─── Types ───────────────────────────────────────────────────────────
interface CarItem {
  id: string
  title: string
  brand: string
  brandSlug?: string
  model: string
  modelSlug?: string
  year: number
  price: number
  emiPrice?: number | null
  kmDriven: number
  fuelType: string
  transmission: string
  ownerType: string
  bodyType?: string
  city: string
  citySlug?: string
  badge?: string | null
  images: string[]
  isCertified: boolean
  isFinanceAvailable: boolean
  isInsuranceAvailable?: boolean
  isFeatured?: boolean
  conditionScore?: number | null
  trustScore?: number | null
  viewsCount?: number
  color?: string | null
}

interface Filters {
  fuelTypes: string[]
  transmissions: string[]
  bodyTypes: string[]
  budgetMin: string
  budgetMax: string
  yearMin: number
  yearMax: number
  sort: string
}

const DEFAULT_FILTERS: Filters = {
  fuelTypes: [],
  transmissions: [],
  bodyTypes: [],
  budgetMin: '',
  budgetMax: '',
  yearMin: 2015,
  yearMax: 2024,
  sort: 'newest',
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatLabel(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase()
}

function formatPriceLakhs(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

function getActiveFilterCount(filters: Filters): number {
  let count = 0
  if (filters.fuelTypes.length > 0) count++
  if (filters.transmissions.length > 0) count++
  if (filters.bodyTypes.length > 0) count++
  if (filters.budgetMin || filters.budgetMax) count++
  if (filters.yearMin !== 2015 || filters.yearMax !== 2024) count++
  return count
}

// ─── Skeleton Loader ─────────────────────────────────────────────────
function CarCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-3 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-14" />
        <div className="pt-2 border-t border-slate-100">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-2/5 mt-1" />
        </div>
      </div>
    </div>
  )
}

// ─── Filter Section Component ────────────────────────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-slate-700 mb-2 hover:text-brand transition-colors"
      >
        {title}
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
export function UsedCarsPage() {
  const { currentPage, pageParams, navigateTo } = useAppStore()

  // ─── State ──────────────────────────────────────────────────────────
  const [cars, setCars] = useState<CarItem[]>([])
  const [totalCars, setTotalCars] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS })
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const limit = 12

  // ─── Page Title & Breadcrumb ────────────────────────────────────────
  const pageTitle = useMemo(() => {
    const citySlug = pageParams.city || ''
    const cityName = citySlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    const brandSlug = pageParams.brand || ''
    const brandName = brandSlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    const budget = pageParams.budget || ''

    switch (currentPage) {
      case 'used-cars':
        return 'Used Cars in Assam'
      case 'used-cars-city':
        return `Used Cars in ${cityName}, Assam`
      case 'used-cars-brand':
        return `Used ${brandName} Cars in Assam`
      case 'used-cars-budget':
        return `Used Cars Under ₹${budget} Lakh in Assam`
      case 'certified-cars':
        return 'Certified Pre-Owned Cars'
      case 'electric-cars':
        return 'Electric Cars'
      case 'luxury-cars':
        return 'Luxury Cars'
      case 'new-cars':
        return 'Explore New Cars'
      case 'compare-cars':
        return 'Compare Cars'
      default:
        return 'Used Cars in Assam'
    }
  }, [currentPage, pageParams])

  // ─── Apply page-specific initial filters ────────────────────────────
  useEffect(() => {
    const newFilters: Filters = { ...DEFAULT_FILTERS }
    const budgetVal = pageParams.budget ? parseFloat(pageParams.budget) : 0

    switch (currentPage) {
      case 'used-cars':
        break
      case 'used-cars-city':
        // city slug is passed as pageParams.city
        break
      case 'used-cars-brand':
        // brand slug is passed as pageParams.brand
        break
      case 'used-cars-budget':
        if (budgetVal > 0) {
          newFilters.budgetMax = String(budgetVal * 100000)
        }
        break
      case 'certified-cars':
        // handled in fetch via certified=true
        break
      case 'electric-cars':
        newFilters.fuelTypes = ['ELECTRIC']
        break
      case 'luxury-cars':
        // handled in fetch via brand filtering
        break
      case 'new-cars':
        break
    }

    setFilters(newFilters)
    setPage(1)
  }, [currentPage, pageParams])

  // ─── Fetch Cars ─────────────────────────────────────────────────────
  const fetchCars = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    params.set('sort', filters.sort)

    // City filter
    if (currentPage === 'used-cars-city' && pageParams.city) {
      params.set('city', pageParams.city)
    }

    // Brand filter (for brand page)
    if (currentPage === 'used-cars-brand' && pageParams.brand) {
      // API expects brandId, but we only have slug — use search as fallback
      params.set('search', pageParams.brand.replace(/-/g, ' '))
    }

    // Luxury brands
    if (currentPage === 'luxury-cars') {
      params.set('search', 'BMW')
      // Note: API doesn't support multi-brand slug filtering directly.
      // We'll rely on the luxury brands being fetchable.
    }

    // Certified
    if (currentPage === 'certified-cars') {
      params.set('isCertified', 'true')
    }

    // Budget
    if (filters.budgetMin) params.set('budgetMin', filters.budgetMin)
    if (filters.budgetMax) params.set('budgetMax', filters.budgetMax)

    // Year
    if (filters.yearMin > 2015) params.set('year', String(filters.yearMin))

    // Fuel type (only first selected)
    if (filters.fuelTypes.length === 1) params.set('fuelType', filters.fuelTypes[0])

    // Transmission
    if (filters.transmissions.length === 1) params.set('transmission', filters.transmissions[0])

    // Body type
    if (filters.bodyTypes.length === 1) params.set('bodyType', filters.bodyTypes[0])

    try {
      const res = await fetch(`/api/cars?${params.toString()}`)
      const data = await res.json()

      const mappedCars: CarItem[] = (data.cars || []).map(
        (car: Record<string, unknown>) => ({
          ...car,
          images: ((car.images || []) as Record<string, unknown>[]).map(
            (img) => img.url as string
          ),
          brand: (car.brand as Record<string, unknown>)?.name || car.brand || '',
          brandSlug: (car.brand as Record<string, unknown>)?.slug || '',
          model: (car.model as Record<string, unknown>)?.name || car.model || '',
          modelSlug: (car.model as Record<string, unknown>)?.slug || '',
          city: (car.city as Record<string, unknown>)?.name || car.city || '',
          citySlug: (car.city as Record<string, unknown>)?.slug || '',
        })
      )
      setCars(mappedCars)
      setTotalCars(data.pagination?.total || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching cars:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, page, currentPage, pageParams])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  // ─── Filter Helpers ─────────────────────────────────────────────────
  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const arr = (prev[key] as string[]) || []
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value]
      return { ...prev, [key]: updated }
    })
    setPage(1)
  }

  const clearAllFilters = () => {
    setFilters({ ...DEFAULT_FILTERS })
    setPage(1)
  }

  const activeFilterCount = getActiveFilterCount(filters)

  // ─── SEO Data ───────────────────────────────────────────────────────
  const citySlug = pageParams.city || ''
  const cityNameFormatted = citySlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  const brandSlug = pageParams.brand || ''
  const brandNameFormatted = brandSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  const budget = pageParams.budget || ''

  const cityData = useMemo(() => getCityBySlug(citySlug), [citySlug])

  const seoQuickAnswer = useMemo(() => {
    const pageType = currentPage === 'used-cars-city' ? 'used-cars' : 'used-cars'
    return getQuickAnswer(pageType, citySlug) || `Find ${totalCars} verified used cars ${cityNameFormatted ? `in ${cityNameFormatted}` : 'across Assam'} with finance, insurance and local support on MeriPehli Gadi.`
  }, [currentPage, citySlug, cityNameFormatted, totalCars])

  const seoMetaDescription = useMemo(() => {
    if (cityData) return cityData.metaDescription
    if (currentPage === 'used-cars') return 'Buy verified used cars in Assam with easy finance, insurance, test drive and local guidance. MeriPehli Gadi — Assam\'s trusted car marketplace powered by Shani Finserve.'
    if (currentPage === 'used-cars-brand') return `Explore verified used ${brandNameFormatted} cars in Assam with finance and insurance support on MeriPehli Gadi.`
    if (currentPage === 'used-cars-budget') return `Find used cars under ₹${budget} lakh in Assam with easy EMI and insurance on MeriPehli Gadi.`
    return 'Buy verified used cars in Assam — finance, insurance, test drive and local support. MeriPehli Gadi.'
  }, [cityData, currentPage, brandNameFormatted, budget])

  const seoRelatedSearches = useMemo(() => {
    const base: string[] = []
    if (cityNameFormatted) {
      base.push(`used cars in ${cityNameFormatted}`)
      base.push(`second hand cars ${cityNameFormatted}`)
      base.push(`cheap cars ${cityNameFormatted}`)
    }
    if (brandNameFormatted) base.push(`used ${brandNameFormatted} cars Assam`)
    if (budget) base.push(`used cars under ${budget} lakh Assam`)
    base.push('used car loan Assam', 'car insurance Assam', 'sell car Assam')
    if (cityNameFormatted) base.push(`car finance ${cityNameFormatted}`)
    return [...new Set(base)]
  }, [cityNameFormatted, brandNameFormatted, budget])

  const seoLocalContent = useMemo(() => {
    if (cityData) return cityData.localContent
    return 'Assam is one of the fastest-growing used car markets in Northeast India. From the bustling streets of Guwahati to the tea gardens of Dibrugarh and the cultural hub of Jorhat, the demand for reliable personal vehicles continues to grow across the state. MeriPehli Gadi serves as Assam\'s trusted local car marketplace, connecting buyers with verified used car listings from all major cities including Guwahati, Dibrugarh, Tinsukia, Jorhat, Tezpur, Silchar, Sivasagar, Nagaon and more. Whether you are a first-time buyer looking for an affordable hatchback, a family in need of a spacious SUV, or a business owner seeking a reliable sedan, our platform offers transparent pricing, easy finance through Shani Finserve, insurance support and local guidance throughout the buying process. Every listing is verified to ensure quality and trust, making MeriPehli Gadi the preferred choice for used car buyers across Assam.'
  }, [cityData])

  const seoAIReadableSummary = useMemo(() => {
    return `MeriPehli Gadi is Assam's trusted used car marketplace. ${pageTitle}. ${!loading ? `${totalCars} verified cars available` : ''}. Features: finance by Shani Finserve, insurance support, verified listings, local Assam support in ${ASSAM_CITIES.length}+ cities. Popular brands: ${CAR_BRANDS.map(b => b.name).join(', ')}. Budget ranges: ${BUDGET_RANGES.map(b => b.label).join(', ')}.`
  }, [pageTitle, totalCars, loading])

  // ─── Breadcrumb Data ────────────────────────────────────────────────
  const breadcrumbItems = useMemo(() => {
    const base: { label: string; page?: PageName; params?: Record<string, string>; isCurrent?: boolean }[] = []

    if (currentPage === 'used-cars') {
      base.push({ label: 'Used Cars', isCurrent: true })
    } else if (
      currentPage === 'used-cars-city' ||
      currentPage === 'used-cars-brand' ||
      currentPage === 'used-cars-budget'
    ) {
      base.push({ label: 'Used Cars', page: 'used-cars' })
      const citySlug = pageParams.city || ''
      const cityName = citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      const brandSlug = pageParams.brand || ''
      const brandName = brandSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      const budget = pageParams.budget || ''

      if (currentPage === 'used-cars-city') base.push({ label: cityName, isCurrent: true })
      if (currentPage === 'used-cars-brand') base.push({ label: brandName, isCurrent: true })
      if (currentPage === 'used-cars-budget') base.push({ label: `Under ₹${budget} Lakh`, isCurrent: true })
    } else if (currentPage === 'certified-cars') {
      base.push({ label: 'Used Cars', page: 'used-cars' })
      base.push({ label: 'Certified', isCurrent: true })
    } else if (currentPage === 'electric-cars') {
      base.push({ label: 'Electric Cars', isCurrent: true })
    } else if (currentPage === 'luxury-cars') {
      base.push({ label: 'Luxury Cars', isCurrent: true })
    } else if (currentPage === 'new-cars') {
      base.push({ label: 'Explore New Cars', isCurrent: true })
    } else {
      base.push({ label: 'Used Cars', isCurrent: true })
    }

    return base
  }, [currentPage, pageParams])

  // ─── Pagination ─────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    start = Math.max(1, end - maxVisible + 1)

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  // ─── Filter Sidebar Content ─────────────────────────────────────────
  const filterContent = (
    <div className="space-y-0">
      {/* Fuel Type */}
      <FilterSection title="Fuel Type">
        <div className="space-y-1.5">
          {FUEL_OPTIONS.map((f) => (
            <label
              key={f}
              className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5"
            >
              <Checkbox
                checked={filters.fuelTypes.includes(f)}
                onCheckedChange={() => toggleArrayFilter('fuelTypes', f)}
              />
              {formatLabel(f)}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission" defaultOpen={false}>
        <div className="space-y-1.5">
          {TRANSMISSION_OPTIONS.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5"
            >
              <Checkbox
                checked={filters.transmissions.includes(t)}
                onCheckedChange={() => toggleArrayFilter('transmissions', t)}
              />
              {formatLabel(t)}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Body Type */}
      <FilterSection title="Body Type" defaultOpen={false}>
        <div className="space-y-1.5">
          {BODY_OPTIONS.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5"
            >
              <Checkbox
                checked={filters.bodyTypes.includes(b)}
                onCheckedChange={() => toggleArrayFilter('bodyTypes', b)}
              />
              {formatLabel(b)}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Budget */}
      <FilterSection title="Budget (Lakhs)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-9 text-sm"
            value={filters.budgetMin ? String(Math.round(parseFloat(filters.budgetMin) / 100000)) : ''}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '')
              setFilters((p) => ({
                ...p,
                budgetMin: v ? String(parseFloat(v) * 100000) : '',
              }))
              setPage(1)
            }}
          />
          <span className="text-slate-400 text-sm">—</span>
          <Input
            type="number"
            placeholder="Max"
            className="h-9 text-sm"
            value={filters.budgetMax ? String(Math.round(parseFloat(filters.budgetMax) / 100000)) : ''}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '')
              setFilters((p) => ({
                ...p,
                budgetMax: v ? String(parseFloat(v) * 100000) : '',
              }))
              setPage(1)
            }}
          />
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Year" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <Select
            value={String(filters.yearMin)}
            onValueChange={(v) => {
              setFilters((p) => ({ ...p, yearMin: parseInt(v) }))
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 text-sm flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_RANGE.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-slate-400 text-sm">to</span>
          <Select
            value={String(filters.yearMax)}
            onValueChange={(v) => {
              setFilters((p) => ({ ...p, yearMax: parseInt(v) }))
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 text-sm flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_RANGE.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort By" defaultOpen={false}>
        <Select
          value={filters.sort}
          onValueChange={(v) => {
            setFilters((p) => ({ ...p, sort: v }))
            setPage(1)
          }}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 mt-3"
          onClick={clearAllFilters}
        >
          <RotateCcw className="size-3.5 mr-1.5" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Meta for SEO */}
      <DynamicMeta
        title={`${pageTitle} | MeriPehli Gadi`}
        description={seoMetaDescription}
        keywords={[
          pageTitle.toLowerCase(),
          'used cars assam',
          'second hand cars assam',
          cityNameFormatted ? `${cityNameFormatted.toLowerCase()} used cars` : '',
          brandNameFormatted ? `used ${brandNameFormatted.toLowerCase()} cars` : '',
          'car finance assam',
          'car insurance assam',
          'meri pehli gadi',
          'verified used cars',
        ].filter(Boolean)}
      />

      {/* Top Bar: Breadcrumb + Title */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList className="text-xs flex-wrap">
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer text-slate-500 hover:text-brand"
                  onClick={() => navigateTo('home')}
                >
                  <Home className="size-3" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {breadcrumbItems.map((item, idx) => (
                <span key={idx} className="contents">
                  <BreadcrumbItem>
                    {item.isCurrent ? (
                      <BreadcrumbPage className="font-medium text-slate-800">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className="cursor-pointer text-slate-500 hover:text-brand"
                        onClick={() =>
                          item.page && navigateTo(item.page, item.params)
                        }
                      >
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title + Sort + View Toggle */}
          <div className="flex items-center justify-between mt-2 gap-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">
                {pageTitle}
              </h1>
              {!loading && (
                <p className="text-sm text-slate-500 mt-0.5">
                  {totalCars} {totalCars === 1 ? 'car' : 'cars'} found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Sort Dropdown (desktop) */}
              <div className="hidden md:block">
                <Select
                  value={filters.sort}
                  onValueChange={(v) => {
                    setFilters((p) => ({ ...p, sort: v }))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-44 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle (desktop) */}
              <div className="hidden sm:flex items-center border border-slate-200 rounded-md">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-brand text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-brand text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  aria-label="List view"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* ─── Desktop Sidebar ─────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="bg-brand text-white text-[10px] px-1.5 py-0">
                      {activeFilterCount}
                    </Badge>
                  )}
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* ─── Main Content ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Bar */}
            <div className="flex items-center gap-2 mb-3 lg:hidden">
              <Sheet
                open={showMobileFilters}
                onOpenChange={setShowMobileFilters}
              >
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2"
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="bg-brand text-white text-[10px] px-1.5 py-0 rounded-full">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-80 p-0 overflow-y-auto"
                >
                  <SheetHeader className="p-4 pb-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-b-none">
                    <SheetTitle className="text-white flex items-center gap-2">
                      <SlidersHorizontal className="size-4" />
                      All Filters
                    </SheetTitle>
                    <SheetDescription className="text-slate-300">
                      Refine your car search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-4">{filterContent}</div>
                  <div className="p-4 border-t border-slate-100 sticky bottom-0 bg-white">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-brand hover:bg-brand-light"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Sort */}
              <Select
                value={filters.sort}
                onValueChange={(v) => {
                  setFilters((p) => ({ ...p, sort: v }))
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-9 flex-1 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile View Toggle */}
              <div className="flex items-center border border-slate-200 rounded-md ml-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-l-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-brand text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-r-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-brand text-white'
                      : 'text-slate-500'
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>

            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {filters.fuelTypes.map((f) => (
                  <Badge
                    key={f}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    {formatLabel(f)}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => toggleArrayFilter('fuelTypes', f)}
                    />
                  </Badge>
                ))}
                {filters.transmissions.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    {formatLabel(t)}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => toggleArrayFilter('transmissions', t)}
                    />
                  </Badge>
                ))}
                {filters.bodyTypes.map((b) => (
                  <Badge
                    key={b}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    {formatLabel(b)}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => toggleArrayFilter('bodyTypes', b)}
                    />
                  </Badge>
                ))}
                {(filters.budgetMin || filters.budgetMax) && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    Budget:{' '}
                    {filters.budgetMin
                      ? formatPriceLakhs(parseFloat(filters.budgetMin))
                      : '₹0'}{' '}
                    —{' '}
                    {filters.budgetMax
                      ? formatPriceLakhs(parseFloat(filters.budgetMax))
                      : 'Any'}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => {
                        setFilters((p) => ({
                          ...p,
                          budgetMin: '',
                          budgetMax: '',
                        }))
                        setPage(1)
                      }}
                    />
                  </Badge>
                )}
                {(filters.yearMin !== 2015 || filters.yearMax !== 2024) && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    Year: {filters.yearMin}–{filters.yearMax}
                    <X
                      className="size-3 cursor-pointer"
                      onClick={() => {
                        setFilters((p) => ({
                          ...p,
                          yearMin: 2015,
                          yearMax: 2024,
                        }))
                        setPage(1)
                      }}
                    />
                  </Badge>
                )}
                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-600 font-medium px-1"
                  onClick={clearAllFilters}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* ─── Loading Skeletons ──────────────────────────────────── */}
            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                    : 'space-y-4'
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : cars.length === 0 ? (
              /* ─── Empty State ────────────────────────────────────────── */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Car className="size-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No cars found
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any cars matching your filters. Try
                  adjusting your criteria or explore all available cars.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={clearAllFilters}>
                    <RotateCcw className="size-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button
                    className="bg-brand hover:bg-brand-light"
                    onClick={() => navigateTo('used-cars')}
                  >
                    <Car className="size-4 mr-2" />
                    View All Cars
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* ─── Car Grid / List ────────────────────────────────────── */
              <>
                <p className="text-sm text-slate-500 mb-3">
                  Showing{' '}
                  <span className="font-semibold text-slate-700">
                    {Math.min((page - 1) * limit + 1, totalCars)}–
                    {Math.min(page * limit, totalCars)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-700">
                    {totalCars}
                  </span>{' '}
                  cars
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${filters.sort}-${page}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                        : 'space-y-4'
                    }
                  >
                    {cars.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        variant={viewMode === 'list' ? 'default' : 'default'}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* ─── Pagination ──────────────────────────────────────── */}
                {totalPages > 1 && (
                  <nav
                    className="flex items-center justify-center gap-1.5 mt-8 mb-4"
                    aria-label="Pagination"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="h-9 w-9 p-0"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    {getPageNumbers().map((p, idx) =>
                      typeof p === 'string' ? (
                        <span
                          key={`dots-${idx}`}
                          className="px-1 text-slate-400"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={p}
                          type="button"
                          variant={page === p ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(p)}
                          className={`h-9 w-9 p-0 ${
                            page === p
                              ? 'bg-brand hover:bg-brand-light text-white'
                              : ''
                          }`}
                          aria-label={`Page ${p}`}
                          aria-current={page === p ? 'page' : undefined}
                        >
                          {p}
                        </Button>
                      )
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="h-9 w-9 p-0"
                      aria-label="Next page"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </nav>
                )}
              </>
            )}
          </div>

          {/* ─── SEO Content Sections (visible when not loading) ──── */}
          {!loading && (
            <div className="mt-8 space-y-8">
              {/* Quick Answer Box — AIO optimized */}
              <QuickAnswerBox answer={seoQuickAnswer} />

              {/* Local Trust Block */}
              <LocalTrustBlock />

              {/* Popular Brands */}
              <PopularBrandLinks />

              {/* Budget Ranges */}
              <BudgetLinks />

              {/* Finance CTA */}
              <FinanceCTA />

              {/* Insurance CTA */}
              <InsuranceCTA />

              {/* Sell Car CTA */}
              <SellCarCTA />

              {/* Long-form Local SEO Content — desktop only collapsible */}
              <section className="hidden lg:block">
                <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                  <h2 className="text-xl font-bold text-foreground p-5 pb-0">
                    {cityNameFormatted
                      ? `About Used Cars in ${cityNameFormatted}, Assam`
                      : 'About the Used Car Market in Assam'}
                  </h2>
                  <div className="p-5 pt-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {seoLocalContent}
                    </p>
                  </div>
                </div>
              </section>

              {/* Nearby Cities Navigation — shown when on a city page */}
              {cityData && cityData.nearbyCities.length > 0 && (
                <section className="hidden lg:block">
                  <div className="rounded-xl border border-slate-100 bg-white shadow-sm p-5">
                    <h2 className="text-lg font-bold text-foreground mb-3">
                      Also Explore Used Cars Near {cityNameFormatted}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {cityData.nearbyCities.map((nc) => {
                        const ncData = ASSAM_CITIES.find(c => c.name === nc)
                        return (
                          <button
                            key={nc}
                            type="button"
                            onClick={() =>
                              ncData && navigateTo('used-cars-city', { city: ncData.slug })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:border-accent-blue hover:text-accent-blue hover:bg-accent-blue/5 transition-colors cursor-pointer"
                          >
                            {nc}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* FAQ Section */}
              <FAQSchemaBlock faqs={GENERAL_FAQS} />

              {/* Related Searches */}
              <RelatedSearchesBlock searches={seoRelatedSearches} />

              {/* Popular Cities */}
              <PopularCityLinks />

              {/* AI-readable hidden summary */}
              <AIReadableSummary text={seoAIReadableSummary} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
