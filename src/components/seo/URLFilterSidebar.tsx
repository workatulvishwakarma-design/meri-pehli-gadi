'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const FUEL_OPTIONS = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID']
const TRANSMISSION_OPTIONS = ['MANUAL', 'AUTOMATIC']
const BODY_OPTIONS = ['SUV', 'SEDAN', 'HATCHBACK', 'MPV', 'COUPE', 'CONVERTIBLE']
const YEAR_RANGE = Array.from({ length: 2024 - 2015 + 1 }, (_, i) => 2024 - i)

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price Low-High' },
  { value: 'price-desc', label: 'Price High-Low' },
  { value: 'km-driven-asc', label: 'KM Low-High' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'popular', label: 'Most Popular' },
]

function formatLabel(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase()
}

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

export function URLFilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [fuelTypes, setFuelTypes] = useState<string[]>([])
  const [transmissions, setTransmissions] = useState<string[]>([])
  const [bodyTypes, setBodyTypes] = useState<string[]>([])
  const [budgetMin, setBudgetMin] = useState<string>('')
  const [budgetMax, setBudgetMax] = useState<string>('')
  const [yearMin, setYearMin] = useState<number>(2015)
  const [yearMax, setYearMax] = useState<number>(2024)
  const [sort, setSort] = useState<string>('newest')

  // Sync state with URL params on mount and when URL changes
  useEffect(() => {
    setFuelTypes(searchParams.getAll('fuel'))
    setTransmissions(searchParams.getAll('transmission'))
    setBodyTypes(searchParams.getAll('bodyType'))
    setBudgetMin(searchParams.get('budgetMin') || '')
    setBudgetMax(searchParams.get('budgetMax') || '')
    setYearMin(Number(searchParams.get('yearMin')) || 2015)
    setYearMax(Number(searchParams.get('yearMax')) || 2024)
    setSort(searchParams.get('sort') || 'newest')
  }, [searchParams])

  // Update URL function
  const updateFilters = (key: string, value: string | string[] | number, isArray = false) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Always reset page to 1 when filtering
    params.delete('page')

    if (isArray && Array.isArray(value)) {
      params.delete(key)
      value.forEach(v => params.append(key, v))
    } else if (value) {
      params.set(key, String(value))
    } else {
      params.delete(key)
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const toggleArrayFilter = (key: 'fuel' | 'transmission' | 'bodyType', value: string, currentArr: string[]) => {
    const updated = currentArr.includes(value)
      ? currentArr.filter((v) => v !== value)
      : [...currentArr, value]
    updateFilters(key, updated, true)
  }

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false })
  }

  const activeFilterCount = fuelTypes.length + transmissions.length + bodyTypes.length + 
    (budgetMin ? 1 : 0) + (budgetMax ? 1 : 0) + (yearMin !== 2015 ? 1 : 0) + (yearMax !== 2024 ? 1 : 0)

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
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
      </div>

      <div className="space-y-0">
        {/* Fuel Type */}
        <FilterSection title="Fuel Type">
          <div className="space-y-1.5">
            {FUEL_OPTIONS.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
                <Checkbox checked={fuelTypes.includes(f)} onCheckedChange={() => toggleArrayFilter('fuel', f, fuelTypes)} />
                {formatLabel(f)}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Transmission */}
        <FilterSection title="Transmission" defaultOpen={false}>
          <div className="space-y-1.5">
            {TRANSMISSION_OPTIONS.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
                <Checkbox checked={transmissions.includes(t)} onCheckedChange={() => toggleArrayFilter('transmission', t, transmissions)} />
                {formatLabel(t)}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Body Type */}
        <FilterSection title="Body Type" defaultOpen={false}>
          <div className="space-y-1.5">
            {BODY_OPTIONS.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 py-0.5">
                <Checkbox checked={bodyTypes.includes(b)} onCheckedChange={() => toggleArrayFilter('bodyType', b, bodyTypes)} />
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
              value={budgetMin ? String(Math.round(parseFloat(budgetMin) / 100000)) : ''}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, '')
                const val = v ? String(parseFloat(v) * 100000) : ''
                updateFilters('budgetMin', val)
              }}
            />
            <span className="text-slate-400 text-sm">—</span>
            <Input
              type="number"
              placeholder="Max"
              className="h-9 text-sm"
              value={budgetMax ? String(Math.round(parseFloat(budgetMax) / 100000)) : ''}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, '')
                const val = v ? String(parseFloat(v) * 100000) : ''
                updateFilters('budgetMax', val)
              }}
            />
          </div>
        </FilterSection>

        {/* Sort */}
        <FilterSection title="Sort By" defaultOpen={false}>
          <Select value={sort} onValueChange={(v) => updateFilters('sort', v)}>
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
    </div>
  )
}
