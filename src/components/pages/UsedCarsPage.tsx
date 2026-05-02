'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal, Grid3X3, List, ChevronDown, ChevronUp,
  Search, X, ChevronLeft, ChevronRight, Home, Car,
  Zap, Crown, BadgeIndianRupee, Shield, Star, RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
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
import { useAppStore } from '@/lib/store'
import CarCard from '@/components/shared/CarCard'

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
  sellerId?: string
  dealer?: { id: string; name: string; slug?: string; rating: number } | null
}

interface BrandItem { id: string; name: string; slug: string; logo?: string | null; _count: { cars: number } }
interface ModelItem { id: string; name: string; slug: string; _count: { cars: number } }
interface CityItem { id: string; name: string; slug: string; state?: string | null; _count: { cars: number } }

interface Filters {
  city: string
  brandIds: string[]
  modelIds: string[]
  budgetMin: string
  budgetMax: string
  yearMin: number
  yearMax: number
  kmDrivenOptions: string[]
  fuelTypes: string[]
  transmissions: string[]
  bodyTypes: string[]
  ownerTypes: string[]
  isCertified: boolean
  isFinanceAvailable: boolean
  isInsuranceAvailable: boolean
  search: string
}

const FUEL_OPTIONS = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID']
const TRANSMISSION_OPTIONS = ['MANUAL', 'AUTOMATIC']
const BODY_OPTIONS = ['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'MPV', 'WAGON', 'VAN']
const OWNER_OPTIONS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH_PLUS']
const KM_OPTIONS = [
  { value: '0-10000', label: '< 10K km' },
  { value: '10000-30000', label: '10K - 30K km' },
  { value: '30000-50000', label: '30K - 50K km' },
  { value: '50000-100000', label: '50K - 1L km' },
  { value: '100000-9999999', label: '> 1L km' },
]

const LUXURY_BRANDS = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Volvo', 'Jaguar', 'Land Rover', 'Porsche']

function formatLabel(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/Plus/g, '+')
}

function formatPriceLakhs(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

// ─── Skeleton Loader ─────────────────────────────────────────────────
function CarCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/5" />
        <div className="pt-2 border-t border-slate-100">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-2/5 mt-1" />
        </div>
      </div>
    </div>
  )
}

// ─── Filter Section Wrapper ──────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
      <button
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
  const { currentPage, pageParams, navigateTo, goBack } = useAppStore()

  // Data
  const [cars, setCars] = useState<CarItem[]>([])
  const [totalCars, setTotalCars] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [models, setModels] = useState<ModelItem[]>([])
  const [cities, setCities] = useState<CityItem[]>([])

  // Filters
  const [filters, setFilters] = useState<Filters>({
    city: '', brandIds: [], modelIds: [], budgetMin: '', budgetMax: '',
    yearMin: 2015, yearMax: 2024, kmDrivenOptions: [], fuelTypes: [],
    transmissions: [], bodyTypes: [], ownerTypes: [],
    isCertified: false, isFinanceAvailable: false, isInsuranceAvailable: false,
    search: '',
  })

  // UI
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const limit = 12

  // Derive title & breadcrumb
  const pageTitle = (() => {
    switch (currentPage) {
      case 'used-cars': return 'Used Cars'
      case 'used-cars-city': return pageParams.city ? `Used Cars in ${pageParams.city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}` : 'Used Cars'
      case 'used-cars-brand': return pageParams.brand ? `Used ${pageParams.brand.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Cars` : 'Used Cars'
      case 'used-cars-budget': return pageParams.budget ? `Used Cars Under ₹${pageParams.budget} Lakh` : 'Used Cars'
      case 'certified-cars': return 'Certified Pre-Owned Cars'
      case 'electric-cars': return 'Electric Cars'
      case 'luxury-cars': return 'Luxury Cars'
      case 'new-cars': return 'Explore New Cars'
      case 'compare-cars': return 'Compare Cars'
      default: return 'Used Cars'
    }
  })()

  // Fetch brands and cities
  useEffect(() => {
    Promise.all([
      fetch('/api/brands').then((r) => r.json()),
      fetch('/api/cities').then((r) => r.json()),
    ]).then(([brandsData, citiesData]) => {
      if (brandsData.brands) setBrands(brandsData.brands)
      if (citiesData.cities) setCities(citiesData.cities)
    })
  }, [])

  // Fetch models when brand selected
  useEffect(() => {
    if (filters.brandIds.length > 0) {
      Promise.all(
        filters.brandIds.map((bid) => fetch(`/api/models?brandId=${bid}`).then((r) => r.json()))
      ).then((results) => {
        const allModels = results.flatMap((r) => r.models || [])
        setModels(allModels)
      })
    } else {
      setModels([])
    }
  }, [filters.brandIds])

  // Apply page-specific defaults
  useEffect(() => {
    setFilters((prev) => {
      const updated = { ...prev }
      switch (currentPage) {
        case 'used-cars-city':
          updated.city = pageParams.city || ''
          break
        case 'used-cars-brand': {
          const brand = brands.find((b) => b.slug === pageParams.brand || b.name.toLowerCase().replace(/\s+/g, '-') === pageParams.brand)
          if (brand && !updated.brandIds.includes(brand.id)) updated.brandIds = [brand.id]
          break
        }
        case 'used-cars-budget': {
          const bVal = parseFloat(pageParams.budget || '0')
          if (bVal > 0) {
            updated.budgetMax = String(bVal * 100000)
          }
          break
        }
        case 'certified-cars':
          updated.isCertified = true
          break
        case 'electric-cars':
          updated.fuelTypes = ['ELECTRIC']
          break
        case 'luxury-cars': {
          const luxuryIds = brands.filter((b) => LUXURY_BRANDS.includes(b.name)).map((b) => b.id)
          updated.brandIds = luxuryIds
          break
        }
      }
      return updated
    })
    setPage(1)
  }, [currentPage, pageParams, brands])

  // Build query and fetch cars
  const fetchCars = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    params.set('sort', sort)

    if (filters.city) params.set('city', filters.city)
    if (filters.brandIds.length > 0) params.set('brandId', filters.brandIds[0])
    if (filters.modelIds.length > 0) params.set('modelId', filters.modelIds[0])
    if (filters.budgetMin) params.set('budgetMin', filters.budgetMin)
    if (filters.budgetMax) params.set('budgetMax', filters.budgetMax)
    if (filters.yearMin > 2015) params.set('year', String(filters.yearMin))
    if (filters.fuelTypes.length === 1) params.set('fuelType', filters.fuelTypes[0])
    if (filters.transmissions.length === 1) params.set('transmission', filters.transmissions[0])
    if (filters.bodyTypes.length === 1) params.set('bodyType', filters.bodyTypes[0])
    if (filters.search) params.set('search', filters.search)
    if (filters.isCertified) params.set('isCertified', 'true')
    if (filters.isFinanceAvailable) params.set('isFinanceAvailable', 'true')

    try {
      const res = await fetch(`/api/cars?${params.toString()}`)
      const data = await res.json()
      const carItems: CarItem[] = (data.cars || []).map((car: Record<string, unknown>) => ({
        ...car,
        images: ((car.images || []) as Record<string, unknown>[]).map((img) => img.url as string),
        brand: (car.brand as Record<string, unknown>)?.name || car.brand || '',
        brandSlug: (car.brand as Record<string, unknown>)?.slug || '',
        model: (car.model as Record<string, unknown>)?.name || car.model || '',
        modelSlug: (car.model as Record<string, unknown>)?.slug || '',
        city: (car.city as Record<string, unknown>)?.name || car.city || '',
        citySlug: (car.city as Record<string, unknown>)?.slug || '',
      }))
      setCars(carItems)
      setTotalCars(data.pagination?.total || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching cars:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, sort, page, limit])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  // Filter helpers
  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[]
      const updated = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...prev, [key]: updated }
    })
    setPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      city: '', brandIds: [], modelIds: [], budgetMin: '', budgetMax: '',
      yearMin: 2015, yearMax: 2024, kmDrivenOptions: [], fuelTypes: [],
      transmissions: [], bodyTypes: [], ownerTypes: [],
      isCertified: false, isFinanceAvailable: false, isInsuranceAvailable: false,
      search: '',
    })
    setPage(1)
    setSort('newest')
  }

  const activeFilterCount = [
    filters.city,
    filters.brandIds.length > 0,
    filters.budgetMin || filters.budgetMax,
    filters.yearMin !== 2015 || filters.yearMax !== 2024,
    filters.kmDrivenOptions.length > 0,
    filters.fuelTypes.length > 0,
    filters.transmissions.length > 0,
    filters.bodyTypes.length > 0,
    filters.ownerTypes.length > 0,
    filters.isCertified,
    filters.isFinanceAvailable,
    filters.isInsuranceAvailable,
  ].filter(Boolean).length

  // ─── Filter Sidebar ──────────────────────────────────────────────
  const filterContent = (
    <div className="space-y-1">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
        <Input
          placeholder="Search cars..."
          className="pl-9 h-9 text-sm"
          value={filters.search}
          onChange={(e) => { setFilters((p) => ({ ...p, search: e.target.value })); setPage(1) }}
        />
      </div>

      {/* City */}
      <FilterSection title="City">
        <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
          {cities.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
              <Checkbox
                checked={filters.city === c.slug}
                onCheckedChange={() => setFilters((p) => ({ ...p, city: p.city === c.slug ? '' : c.slug }))}
              />
              <span className="flex-1">{c.name}</span>
              {c._count.cars > 0 && <span className="text-xs text-slate-400">({c._count.cars})</span>}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Budget */}
      <FilterSection title="Budget (Lakhs)">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Min"
            className="h-8 text-sm"
            value={filters.budgetMin ? String(Math.round(parseFloat(filters.budgetMin) / 100000)) : ''}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '')
              setFilters((p) => ({ ...p, budgetMin: v ? String(parseFloat(v) * 100000) : '' }))
              setPage(1)
            }}
          />
          <span className="text-slate-400 text-sm">-</span>
          <Input
            placeholder="Max"
            className="h-8 text-sm"
            value={filters.budgetMax ? String(Math.round(parseFloat(filters.budgetMax) / 100000)) : ''}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '')
              setFilters((p) => ({ ...p, budgetMax: v ? String(parseFloat(v) * 100000) : '' }))
              setPage(1)
            }}
          />
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" defaultOpen={false}>
        <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
          {brands.filter((b) => b._count.cars > 0).map((b) => (
            <label key={b.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
              <Checkbox
                checked={filters.brandIds.includes(b.id)}
                onCheckedChange={() => toggleArrayFilter('brandIds', b.id)}
              />
              <span className="flex-1">{b.name}</span>
              <span className="text-xs text-slate-400">({b._count.cars})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Model */}
      {models.length > 0 && (
        <FilterSection title="Model">
          <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
            {models.map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
                <Checkbox
                  checked={filters.modelIds.includes(m.id)}
                  onCheckedChange={() => toggleArrayFilter('modelIds', m.id)}
                />
                <span className="flex-1">{m.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Year */}
      <FilterSection title="Year">
        <div className="px-1">
          <Slider
            min={2010}
            max={2024}
            step={1}
            value={[filters.yearMin, filters.yearMax]}
            onValueChange={([min, max]) => {
              setFilters((p) => ({ ...p, yearMin: min, yearMax: max }))
              setPage(1)
            }}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{filters.yearMin}</span>
            <span>{filters.yearMax}</span>
          </div>
        </div>
      </FilterSection>

      {/* KM Driven */}
      <FilterSection title="KM Driven" defaultOpen={false}>
        <div className="space-y-1">
          {KM_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
              <Checkbox
                checked={filters.kmDrivenOptions.includes(opt.value)}
                onCheckedChange={() => toggleArrayFilter('kmDrivenOptions', opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type">
        <div className="space-y-1">
          {FUEL_OPTIONS.map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
              <Checkbox
                checked={filters.fuelTypes.includes(f)}
                onCheckedChange={() => toggleArrayFilter('fuelTypes', f)}
              />
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission" defaultOpen={false}>
        <div className="space-y-1">
          {TRANSMISSION_OPTIONS.map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
              <Checkbox
                checked={filters.transmissions.includes(t)}
                onCheckedChange={() => toggleArrayFilter('transmissions', t)}
              />
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Body Type */}
      <FilterSection title="Body Type" defaultOpen={false}>
        <div className="space-y-1">
          {BODY_OPTIONS.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
              <Checkbox
                checked={filters.bodyTypes.includes(b)}
                onCheckedChange={() => toggleArrayFilter('bodyTypes', b)}
              />
              {b.charAt(0) + b.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Owner */}
      <FilterSection title="Owner" defaultOpen={false}>
        <div className="space-y-1">
          {OWNER_OPTIONS.map((o) => (
            <label key={o} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
              <Checkbox
                checked={filters.ownerTypes.includes(o)}
                onCheckedChange={() => toggleArrayFilter('ownerTypes', o)}
              />
              {formatLabel(o)} Owner
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Quick Filters */}
      <FilterSection title="Quick Filters">
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
            <Checkbox
              checked={filters.isCertified}
              onCheckedChange={() => { setFilters((p) => ({ ...p, isCertified: !p.isCertified })); setPage(1) }}
            />
            <Shield className="size-3.5 text-emerald-500" />
            Certified
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
            <Checkbox
              checked={filters.isFinanceAvailable}
              onCheckedChange={() => { setFilters((p) => ({ ...p, isFinanceAvailable: !p.isFinanceAvailable })); setPage(1) }}
            />
            <BadgeIndianRupee className="size-3.5 text-blue-500" />
            Finance Available
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
            <Checkbox
              checked={filters.isInsuranceAvailable}
              onCheckedChange={() => { setFilters((p) => ({ ...p, isInsuranceAvailable: !p.isInsuranceAvailable })); setPage(1) }}
            />
            <Shield className="size-3.5 text-purple-500" />
            Insurance Available
          </label>
        </div>
      </FilterSection>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
          onClick={clearAllFilters}
        >
          <RotateCcw className="size-3.5 mr-1.5" />
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  )

  // Pagination
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink className="cursor-pointer text-slate-500 hover:text-brand" onClick={() => navigateTo('home')}>
                  <Home className="size-3" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {currentPage === 'used-cars-city' || currentPage === 'used-cars-brand' || currentPage === 'used-cars-budget' ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="cursor-pointer text-slate-500 hover:text-brand" onClick={() => navigateTo('used-cars')}>
                      Used Cars
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-slate-800">{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : currentPage === 'certified-cars' ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="cursor-pointer text-slate-500 hover:text-brand" onClick={() => navigateTo('used-cars')}>
                      Used Cars
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-slate-800">Certified</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-slate-800">{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">{pageTitle}</h1>
              {!loading && <p className="text-sm text-slate-500 mt-0.5">{totalCars} cars available</p>}
            </div>
            <div className="flex items-center gap-2">
              {/* Sort */}
              <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
                <SelectTrigger className="h-9 w-40 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="year-desc">Year: Newest</SelectItem>
                  <SelectItem value="km-driven-asc">KM: Low to High</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle - hidden on mobile */}
              <div className="hidden sm:flex items-center border border-slate-200 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-md transition-colors ${viewMode === 'grid' ? 'bg-brand text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-md transition-colors ${viewMode === 'list' ? 'bg-brand text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="bg-brand text-white text-[10px] px-1.5 py-0">{activeFilterCount}</Badge>
                )}
              </h3>
              {filterContent}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter bar */}
            <div className="flex items-center gap-2 mb-3 lg:hidden">
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="bg-brand text-white text-[10px] px-1.5 py-0 rounded-full">{activeFilterCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
                  <SheetHeader className="p-4 pb-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                    <SheetTitle className="text-white flex items-center gap-2">
                      <SlidersHorizontal className="size-4" />
                      All Filters
                    </SheetTitle>
                    <SheetDescription className="text-slate-300">Refine your car search</SheetDescription>
                  </SheetHeader>
                  <div className="p-4">
                    {filterContent}
                  </div>
                  <SheetHeader className="p-4 border-t border-slate-100">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1" onClick={clearAllFilters}>Clear All</Button>
                      <Button className="flex-1 bg-brand hover:bg-brand-light" onClick={() => setShowMobileFilters(false)}>Apply</Button>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              {/* Mobile sort */}
              <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
                <SelectTrigger className="h-9 w-auto text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low</SelectItem>
                  <SelectItem value="price-desc">Price: High</SelectItem>
                  <SelectItem value="km-driven-asc">KM: Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile view toggle */}
              <div className="flex items-center border border-slate-200 rounded-md ml-auto">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-l-md transition-colors ${viewMode === 'grid' ? 'bg-brand text-white' : 'text-slate-500'}`}>
                  <Grid3X3 className="size-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-r-md transition-colors ${viewMode === 'list' ? 'bg-brand text-white' : 'text-slate-500'}`}>
                  <List className="size-4" />
                </button>
              </div>
            </div>

            {/* Active filter badges */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {filters.city && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    City: {filters.city}
                    <X className="size-3 cursor-pointer" onClick={() => { setFilters((p) => ({ ...p, city: '' })); setPage(1) }} />
                  </Badge>
                )}
                {filters.brandIds.map((bid) => {
                  const b = brands.find((br) => br.id === bid)
                  return b ? (
                    <Badge key={bid} variant="secondary" className="gap-1 text-xs">
                      {b.name}
                      <X className="size-3 cursor-pointer" onClick={() => toggleArrayFilter('brandIds', bid)} />
                    </Badge>
                  ) : null
                })}
                {(filters.budgetMin || filters.budgetMax) && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    Budget: {filters.budgetMin ? formatPriceLakhs(parseFloat(filters.budgetMin)) : '₹0'} - {filters.budgetMax ? formatPriceLakhs(parseFloat(filters.budgetMax)) : 'Any'}
                    <X className="size-3 cursor-pointer" onClick={() => { setFilters((p) => ({ ...p, budgetMin: '', budgetMax: '' })); setPage(1) }} />
                  </Badge>
                )}
                {filters.fuelTypes.map((f) => (
                  <Badge key={f} variant="secondary" className="gap-1 text-xs">
                    {f}
                    <X className="size-3 cursor-pointer" onClick={() => toggleArrayFilter('fuelTypes', f)} />
                  </Badge>
                ))}
                {filters.transmissions.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1 text-xs">
                    {t}
                    <X className="size-3 cursor-pointer" onClick={() => toggleArrayFilter('transmissions', t)} />
                  </Badge>
                ))}
                {filters.bodyTypes.map((b) => (
                  <Badge key={b} variant="secondary" className="gap-1 text-xs">
                    {b}
                    <X className="size-3 cursor-pointer" onClick={() => toggleArrayFilter('bodyTypes', b)} />
                  </Badge>
                ))}
                {filters.isCertified && (
                  <Badge variant="secondary" className="gap-1 text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                    <Shield className="size-3" /> Certified
                    <X className="size-3 cursor-pointer" onClick={() => { setFilters((p) => ({ ...p, isCertified: false })); setPage(1) }} />
                  </Badge>
                )}
                <button
                  className="text-xs text-red-500 hover:text-red-600 font-medium px-1"
                  onClick={clearAllFilters}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'space-y-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : cars.length === 0 ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Car className="size-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No cars found</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any cars matching your filters. Try adjusting your criteria or explore all available cars.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={clearAllFilters}>
                    <RotateCcw className="size-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button className="bg-brand hover:bg-brand-light" onClick={() => navigateTo('used-cars')}>
                    <Car className="size-4 mr-2" />
                    View All Cars
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Car Grid / List */
              <>
                <p className="text-sm text-slate-500 mb-3">Showing <span className="font-semibold text-slate-700">{Math.min((page - 1) * limit + 1, totalCars)}-{Math.min(page * limit, totalCars)}</span> of <span className="font-semibold text-slate-700">{totalCars}</span> cars</p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${sort}-${page}-${filters.city}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                      : 'space-y-4'
                    }
                  >
                    {cars.map((car) => (
                      <CarCard key={car.id} car={car} variant={viewMode === 'list' ? 'default' : 'default'} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="h-9 w-9 p-0"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    {getPageNumbers().map((p, idx) =>
                      typeof p === 'string' ? (
                        <span key={`dots-${idx}`} className="px-1 text-slate-400">...</span>
                      ) : (
                        <Button
                          key={p}
                          variant={page === p ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(p)}
                          className={`h-9 w-9 p-0 ${page === p ? 'bg-brand hover:bg-brand-light text-white' : ''}`}
                        >
                          {p}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="h-9 w-9 p-0"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
