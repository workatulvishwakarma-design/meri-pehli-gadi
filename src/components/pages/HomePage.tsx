'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  Car, Shield, Banknote, MapPin, Fuel, Search, ChevronRight, ChevronLeft,
  CarFront, Truck, Gem, ArrowRight, Star, Zap, CheckCircle2,
  ShieldCheck, FileText, Sparkles, ArrowUpRight,
  Calculator, Calendar, ShieldHalf,
  Users, BadgeCheck, Award, HeadphonesIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from '@/components/ui/carousel'
import { useAppStore } from '@/lib/store'
import CarCard from '@/components/shared/CarCard'

// ─── API Data Mapping Helper ─────────────────────────────────────
// The /api/cars endpoint returns nested objects (brand: {name, ...}, city: {name, ...}, images: [{url, ...}])
// but CarCard expects flat strings and string arrays. This helper normalizes the data.
function mapApiCarToCardProps(car: Record<string, unknown>): Parameters<typeof CarCard>[0]['car'] {
  const raw = car as Record<string, any>
  return {
    ...raw,
    brand: raw.brand?.name || raw.brand || '',
    model: raw.model?.name || raw.model || '',
    city: raw.city?.name || raw.city || '',
    images: Array.isArray(raw.images)
      ? raw.images.map((img: any) => (typeof img === 'string' ? img : img.url || ''))
      : [],
  } as any
}

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

function SectionHeading({ title, subtitle, light = false, className = '' }: {
  title: string; subtitle?: string; light?: boolean; className?: string
}) {
  return (
    <div className={`text-center mb-10 md:mb-12 ${className}`}>
      <FadeInSection>
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 ${light ? 'text-white' : 'text-brand'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${light ? 'text-white/80' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        )}
      </FadeInSection>
    </div>
  )
}

// ─── Section 1: Hero ────────────────────────────────────────────────

function HeroSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [carType, setCarType] = useState('used')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [brands, setBrands] = useState<{ id: string; name: string; slug: string }[]>([])
  const [models, setModels] = useState<{ id: string; name: string }[]>([])
  const [cities, setCities] = useState<{ id: string; name: string; slug: string }[]>([])

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || []))
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.cities || []))
  }, [])

  useEffect(() => {
    if (selectedBrand) {
      fetch(`/api/models?brandId=${selectedBrand}`).then(r => r.json()).then(d => setModels(d.models || []))
    }
  }, [selectedBrand])

  const handleSearch = () => {
    const params: Record<string, string> = {}
    if (carType) params.type = carType
    if (selectedBrand) params.brand = selectedBrand
    if (selectedModel) params.model = selectedModel
    if (selectedBudget) params.budget = selectedBudget
    if (selectedCity) params.city = selectedCity
    navigateTo('used-cars', params)
  }

  const budgets = [
    { value: '0-200000', label: 'Under ₹2 Lakh' },
    { value: '200000-500000', label: '₹2 - 5 Lakh' },
    { value: '500000-800000', label: '₹5 - 8 Lakh' },
    { value: '800000-1200000', label: '₹8 - 12 Lakh' },
    { value: '1200000-2000000', label: '₹12 - 20 Lakh' },
    { value: '2000000-99999999', label: 'Above ₹20 Lakh' },
  ]

  const floatingStats = [
    { value: '500+', label: 'Verified Cars', delay: 0 },
    { value: '16+', label: 'Brands', delay: 0.3 },
    { value: '16+', label: 'Cities', delay: 0.6 },
    { value: '200+', label: 'Happy Customers', delay: 0.9 },
  ]

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-banner.png"
          alt="MeriPehli Gadi Dealership"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/90 via-brand/70 to-brand/40" />
      </div>

      {/* Floating Stats Badges - desktop only */}
      <div className="absolute top-6 right-6 hidden lg:flex flex-col gap-3 z-20">
        {floatingStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 + stat.delay }}
          >
            <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-2.5 text-white border border-white/20 shadow-lg">
              <p className="text-lg font-bold leading-tight">{stat.value}</p>
              <p className="text-[11px] text-white/80">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 py-16 md:py-24 lg:py-28">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Image src="/logo.png" alt="MeriPehli Gadi" width={140} height={46} className="h-12 w-auto drop-shadow-lg" unoptimized />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight text-white drop-shadow-sm">
            Find Your Perfect Car
          </h1>
          <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
            Buy, sell, finance and insure your car with trusted support from{' '}
            <span className="font-semibold text-white">MeriPehli Gadi</span> and{' '}
            <span className="font-semibold text-orange-300">Shani Finserve</span>.
          </p>
        </motion.div>

        {/* Search Module */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6">
            {/* Car Type Toggle */}
            <div className="flex gap-2 mb-5">
              {['used', 'new'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCarType(type)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    carType === type
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {type === 'used' ? '🚗 Used Cars' : '✨ New Cars'}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel('') }}>
                <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 text-sm">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 text-sm">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 text-sm">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((b) => (
                    <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 text-sm">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleSearch}
                className="bg-accent-orange hover:bg-orange-600 text-white h-11 rounded-xl font-semibold col-span-2 md:col-span-1 btn-shine shadow-lg shadow-orange-200"
              >
                <Search className="size-4 mr-1.5" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats - Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10 text-center lg:hidden"
        >
          {floatingStats.map((stat) => (
            <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
              <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[11px] text-white/70">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 2: Browse by Body Type ─────────────────────────────────

function BrowseByTypeSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const scrollRef = useRef<HTMLDivElement>(null)

  const bodyTypes = [
    { label: 'SUV', icon: Car, count: 45, gradient: 'from-amber-400 to-orange-500' },
    { label: 'Sedan', icon: CarFront, count: 32, gradient: 'from-sky-400 to-blue-500' },
    { label: 'Hatchback', icon: Car, count: 55, gradient: 'from-emerald-400 to-green-500' },
    { label: 'Coupe', icon: Gem, count: 12, gradient: 'from-purple-400 to-violet-500' },
    { label: 'MUV/MPV', icon: Car, count: 18, gradient: 'from-rose-400 to-pink-500' },
    { label: 'Convertible', icon: Car, count: 8, gradient: 'from-pink-400 to-fuchsia-500' },
    { label: 'Van', icon: Car, count: 15, gradient: 'from-cyan-400 to-teal-500' },
    { label: 'Electric', icon: Zap, count: 20, gradient: 'from-lime-400 to-emerald-500' },
    { label: 'Pickup', icon: Truck, count: 10, gradient: 'from-red-400 to-orange-500' },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="Browse by Type" subtitle="Find your ideal car by body type" />

        <FadeInSection>
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white shadow-xl border border-slate-100 hover:bg-slate-50 hidden md:flex transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5 text-slate-600" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1"
            >
              {bodyTypes.map((bt) => (
                <motion.button
                  key={bt.label}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigateTo('used-cars', { bodyType: bt.label.toLowerCase() })}
                  className="flex-shrink-0 w-28 md:w-32 flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100"
                >
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${bt.gradient} flex items-center justify-center shadow-md`}>
                    <bt.icon className="size-7 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-brand">{bt.label}</p>
                    <p className="text-[11px] text-slate-400">{bt.count}+ Cars</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-10 flex items-center justify-center rounded-full bg-white shadow-xl border border-slate-100 hover:bg-slate-50 hidden md:flex transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5 text-slate-600" />
            </button>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 3: Browse by Budget ────────────────────────────────────

function BrowseByBudgetSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const budgetRanges = [
    { label: 'Under ₹2 Lakh', value: '0-200000', cars: 35, gradient: 'from-emerald-500 to-green-600' },
    { label: '₹2 - 5 Lakh', value: '200000-500000', cars: 65, gradient: 'from-sky-500 to-blue-600' },
    { label: '₹5 - 8 Lakh', value: '500000-800000', cars: 50, gradient: 'from-violet-500 to-purple-600' },
    { label: '₹8 - 12 Lakh', value: '800000-1200000', cars: 40, gradient: 'from-orange-500 to-amber-600' },
    { label: '₹12 - 20 Lakh', value: '1200000-2000000', cars: 25, gradient: 'from-rose-500 to-red-600' },
    { label: 'Above ₹20 Lakh', value: '2000000-99999999', cars: 15, gradient: 'from-brand to-brand-light' },
  ]

  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Browse by Budget" subtitle="Explore cars that fit your budget" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {budgetRanges.map((b, i) => (
            <FadeInSection key={b.value} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateTo('used-cars-budget', { range: b.value })}
                className="cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${b.gradient} rounded-2xl p-5 text-center text-white shadow-lg hover:shadow-2xl transition-shadow`}>
                  <p className="text-base md:text-lg font-bold mb-1 leading-tight">{b.label}</p>
                  <p className="text-xs opacity-90">{b.cars}+ Cars</p>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 4: Popular Brands ──────────────────────────────────────

function PopularBrandsSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const popularBrands = [
    { name: 'Maruti Suzuki', slug: 'maruti-suzuki', count: 85 },
    { name: 'Hyundai', slug: 'hyundai', count: 72 },
    { name: 'Tata', slug: 'tata', count: 45 },
    { name: 'Mahindra', slug: 'mahindra', count: 38 },
    { name: 'Honda', slug: 'honda', count: 30 },
    { name: 'Toyota', slug: 'toyota', count: 28 },
    { name: 'Kia', slug: 'kia', count: 22 },
    { name: 'Skoda', slug: 'skoda', count: 15 },
    { name: 'Volkswagen', slug: 'volkswagen', count: 12 },
    { name: 'MG', slug: 'mg', count: 10 },
    { name: 'BMW', slug: 'bmw', count: 8 },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', count: 6 },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="Popular Brands" subtitle="Choose from India's most trusted car brands" />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {popularBrands.map((brand, i) => (
            <FadeInSection key={brand.slug} delay={i * 0.03}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateTo('used-cars-brand', { brand: brand.slug })}
                className="cursor-pointer"
              >
                <div className="rounded-xl border border-slate-100 bg-white p-4 text-center transition-all hover:shadow-lg hover:border-slate-200">
                  <div className="w-12 h-12 mx-auto mb-2.5 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm flex items-center justify-center border border-slate-100">
                    <Car className="size-5 text-brand/50" />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-brand leading-tight">{brand.name}</p>
                  <Badge variant="secondary" className="mt-1.5 text-[10px] px-1.5 py-0">
                    {brand.count}+
                  </Badge>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 5: Recently Added Cars ─────────────────────────────────

function RecentlyAddedCarsSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars?sort=newest&limit=8')
      .then(r => r.json())
      .then(d => {
        const mapped = (d.cars || []).map((c: Record<string, unknown>) => mapApiCarToCardProps(c))
        setCars(mapped as any)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 md:py-20 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <FadeInSection>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand">Recently Added Cars</h2>
            <p className="text-slate-500 text-sm mt-2">Fresh listings updated daily</p>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <Button
              variant="ghost"
              className="text-accent-orange hover:text-orange-600 gap-1 text-sm font-medium"
              onClick={() => navigateTo('used-cars')}
            >
              View All <ArrowRight className="size-4" />
            </Button>
          </FadeInSection>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-xl p-0 overflow-hidden">
                <div className="aspect-[16/10] bg-slate-200 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Car className="size-14 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No cars found yet</p>
            <p className="text-sm mt-1">Check back soon for new listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {cars.map((car, i) => (
              <FadeInSection key={car.id} delay={i * 0.05}>
                <CarCard car={car} />
              </FadeInSection>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Section 6: Certified Cars ──────────────────────────────────────

function CertifiedCarsSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars?certified=true&limit=4')
      .then(r => r.json())
      .then(d => {
        const mapped = (d.cars || []).map((c: Record<string, unknown>) => mapApiCarToCardProps(c))
        setCars(mapped as any)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Certified Pre-Owned Cars"
          subtitle="200-point inspection, verified history, and warranty on every certified car"
        />

        {/* Trust Badges */}
        <FadeInSection>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
            {[
              { icon: ShieldCheck, label: '200-Point Inspection' },
              { icon: Award, label: '6-Month Warranty' },
              { icon: BadgeCheck, label: 'Verified History' },
              { icon: HeadphonesIcon, label: '24/7 Support' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-emerald-100">
                <badge.icon className="size-4 text-emerald-500" />
                <span className="text-xs font-medium text-slate-600">{badge.label}</span>
              </div>
            ))}
          </div>
        </FadeInSection>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-xl p-0 overflow-hidden">
                <div className="aspect-[16/10] bg-slate-200 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">Certified cars coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cars.map((car, i) => (
              <FadeInSection key={car.id} delay={i * 0.05}>
                <CarCard car={car} />
              </FadeInSection>
            ))}
          </div>
        )}

        <FadeInSection>
          <div className="text-center mt-10">
            <Button
              onClick={() => navigateTo('certified-cars')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-11 font-semibold shadow-lg shadow-emerald-200"
            >
              View All Certified Cars <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 7: Sell Your Car CTA ───────────────────────────────────

function SellCarCTASection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  return (
    <section className="py-16 md:py-20 gradient-orange relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 size-40 rounded-full bg-white" />
        <div className="absolute bottom-10 right-10 size-60 rounded-full bg-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-white" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-white/20 text-white border-0 mb-5 text-xs font-medium">
                <Sparkles className="size-3 mr-1" />
                Zero Hassle Selling
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Apni car bechna ab{' '}
                <span className="relative">
                  tension-free
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                </span>
              </h2>
              <p className="text-white/90 mb-8 max-w-lg text-sm md:text-base leading-relaxed">
                Best price, verified buyers aur fast payment support. Kisi bhi brand ki car ko easily sell karein.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigateTo('sell-car')}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl px-8 h-12 shadow-xl"
                >
                  Sell Your Car <ArrowUpRight className="size-5 ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigateTo('car-valuation')}
                  className="border-white/40 text-white hover:bg-white/10 rounded-xl px-8 h-12"
                >
                  Check Valuation
                </Button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="size-52 md:size-64 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Car className="size-28 md:size-36 text-white/80" />
                </div>
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -right-3 bg-white rounded-xl px-4 py-2 shadow-xl"
                >
                  <p className="text-xs font-bold text-orange-600">💰 Best Price</p>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-3 -left-3 bg-white rounded-xl px-4 py-2 shadow-xl"
                >
                  <p className="text-xs font-bold text-emerald-600">⚡ Fast Payment</p>
                </motion.div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 8: Finance CTA ─────────────────────────────────────────

function CarLoanCTASection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenure, setTenure] = useState(5)

  const calculateEMI = () => {
    const principal = loanAmount
    const monthlyRate = interestRate / 12 / 100
    const months = tenure * 12
    if (monthlyRate === 0) return principal / months
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    return emi
  }

  const emi = calculateEMI()
  const totalPayment = emi * tenure * 12
  const totalInterest = totalPayment - loanAmount

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#0f1f3d] via-[#1e3a5f] to-[#2d5a8e] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-20 -right-20 size-96 rounded-full bg-accent-blue" />
        <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-accent-orange" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <FadeInSection>
              <Badge className="bg-white/15 text-white border-0 mb-5 text-xs font-medium">
                <Banknote className="size-3 mr-1" />
                Powered by Shani Finserve
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Easy Car Finance
              </h2>
              <p className="text-blue-100/80 mb-8 max-w-lg text-sm md:text-base leading-relaxed">
                Low EMI starting ₹8,999/month. Quick approval in 24 hours. Get pre-approved for your dream car today.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Zap, label: '24hr Approval' },
                  { icon: ShieldCheck, label: 'Low Interest' },
                  { icon: FileText, label: 'Minimal Docs' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="size-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <item.icon className="size-5 text-white" />
                    </div>
                    <p className="text-xs text-blue-100/80">{item.label}</p>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                onClick={() => navigateTo('finance')}
                className="bg-accent-orange hover:bg-orange-600 text-white font-bold rounded-xl px-8 h-12 shadow-xl shadow-orange-900/30 btn-shine"
              >
                Apply Now <ArrowUpRight className="size-5 ml-1" />
              </Button>
            </FadeInSection>
          </div>

          {/* EMI Calculator */}
          <FadeInSection delay={0.2}>
            <Card className="w-full max-w-md p-6 rounded-2xl shadow-2xl border-0 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="size-5 text-accent-blue" />
                <h3 className="font-bold text-brand text-lg">EMI Calculator</h3>
              </div>

              {/* Loan Amount */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-600 mb-2 block">
                  Loan Amount: <span className="text-brand font-bold">₹{(loanAmount / 100000).toFixed(1)}L</span>
                </label>
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹1L</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-600 mb-2 block">
                  Interest Rate: <span className="text-brand font-bold">{interestRate}%</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-600 mb-2 block">
                  Tenure: <span className="text-brand font-bold">{tenure} Years</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 Yr</span>
                  <span>7 Yr</span>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                <p className="text-xs text-slate-500 mb-1">Monthly EMI</p>
                <p className="text-3xl font-bold text-brand">
                  ₹{Math.round(emi).toLocaleString('en-IN')}
                </p>
                <div className="flex justify-between mt-4 text-xs">
                  <div>
                    <p className="text-slate-400">Principal</p>
                    <p className="font-semibold text-slate-600">₹{(loanAmount / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Interest</p>
                    <p className="font-semibold text-red-500">₹{(totalInterest / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Total</p>
                    <p className="font-semibold text-brand">₹{(totalPayment / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}

// ─── Section 9: Insurance CTA ───────────────────────────────────────

function InsuranceCTASection() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const coverages = [
    { label: 'Third Party', icon: Shield },
    { label: 'Comprehensive', icon: ShieldCheck },
    { label: 'Zero Depreciation', icon: ShieldHalf },
    { label: 'Roadside Assist', icon: HeadphonesIcon },
  ]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 size-64 rounded-full bg-white" />
        <div className="absolute bottom-10 left-10 size-40 rounded-full bg-white" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-white/20 text-white border-0 mb-5 text-xs font-medium">
                <ShieldHalf className="size-3 mr-1" />
                Insurance Partner: Shani Finserve
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Secure your car before your first drive.
              </h2>
              <p className="text-green-100/90 mb-8 max-w-lg text-sm md:text-base leading-relaxed">
                Comprehensive insurance support by Shani Finserve. Get the best quotes from top insurers in minutes.
              </p>

              {/* Coverage Types */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {coverages.map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-xl px-4 py-3 text-center backdrop-blur-sm border border-white/10">
                    <item.icon className="size-5 text-white/80 mx-auto mb-1.5" />
                    <p className="text-xs text-white font-medium">{item.label}</p>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigateTo('insurance')}
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl px-8 h-12 shadow-xl"
              >
                Get Insurance Quote <ArrowUpRight className="size-5 ml-1" />
              </Button>
            </div>

            <div className="flex-shrink-0 hidden md:block">
              <div className="relative">
                <div className="size-56 lg:size-64 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <ShieldHalf className="size-28 lg:size-32 text-white/80" />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -right-3 bg-white rounded-xl px-4 py-2 shadow-xl"
                >
                  <p className="text-xs font-bold text-emerald-600">Save up to 30%</p>
                </motion.div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 10: Why Choose Us ──────────────────────────────────────

function WhyChooseUsSection() {
  const features = [
    {
      icon: Shield,
      title: 'Certified Cars',
      description: '200-point inspection on every car. Thorough quality check ensures you drive home a reliable vehicle.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Banknote,
      title: 'Easy Finance',
      description: 'Low EMI loans by Shani Finserve. Get pre-approved in 24 hours with minimal documentation.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: ShieldCheck,
      title: 'Insurance Support',
      description: 'Complete insurance solutions with comprehensive coverage from trusted partners.',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: FileText,
      title: 'Paperwork Assistance',
      description: 'RTO transfer & documentation handled end-to-end. No paperwork headaches for you.',
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Why Choose MeriPehli Gadi" subtitle="We make buying a car easy, transparent, and trustworthy" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FadeInSection key={feature.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="p-6 rounded-2xl border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all h-full text-center">
                  <div className={`size-14 mx-auto mb-5 rounded-2xl ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="font-bold text-brand mb-2 text-base">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 11: How It Works ───────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Search & Select',
      description: 'Browse thousands of verified cars. Filter by brand, budget, city and more.',
    },
    {
      num: '02',
      icon: Calendar,
      title: 'Book Test Drive',
      description: 'Experience the car before you buy. Book a convenient test drive slot.',
    },
    {
      num: '03',
      icon: Banknote,
      title: 'Easy Finance',
      description: 'Get loan approval in 24 hours. Low EMI options from Shani Finserve.',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Drive Home Happy',
      description: 'Complete paperwork & drive away. Full support from start to finish.',
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="How It Works" subtitle="Simple 4-step process to buy your dream car" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
          {/* Connecting line - desktop */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-orange-200 via-blue-200 to-emerald-200" />

          {steps.map((step, i) => (
            <FadeInSection key={step.num} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                {/* Numbered circle */}
                <div className="relative z-10 size-14 rounded-full bg-gradient-to-br from-accent-orange to-orange-600 flex items-center justify-center mb-5 shadow-lg shadow-orange-200">
                  <step.icon className="size-6 text-white" />
                </div>

                <span className="text-xs font-bold text-accent-orange mb-1">{step.num}</span>
                <h3 className="font-bold text-brand mb-2 text-sm md:text-base">{step.title}</h3>
                <p className="text-xs md:text-sm text-slate-500 max-w-[220px] leading-relaxed">{step.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 12: Customer Testimonials ──────────────────────────────

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => setTestimonials(d.testimonials || []))
  }, [])

  const defaultTestimonials = [
    { name: 'Rahul Sharma', designation: 'Car Buyer', city: 'Dibrugarh', content: 'Best experience buying a used car! The certified inspection gave me complete confidence in my purchase. Highly recommend MeriPehli Gadi.', rating: 5 },
    { name: 'Priya Dutta', designation: 'First-time Buyer', city: 'Guwahati', content: 'MeriPehli Gadi made buying my first car so easy. The EMI options from Shani Finserve were very affordable and the team was supportive throughout.', rating: 5 },
    { name: 'Amit Koch', designation: 'Car Enthusiast', city: 'Jorhat', content: 'Great selection of cars and the finance process was incredibly smooth. The team went above and beyond to help me find the perfect match!', rating: 5 },
    { name: 'Sneha Borah', designation: 'Business Owner', city: 'Tinsukia', content: 'Sold my old car through MeriPehli Gadi. Got the best price and the payment was fast. Excellent service from start to finish.', rating: 4 },
    { name: 'Deepak Gogoi', designation: 'Software Engineer', city: 'Dibrugarh', content: 'The entire process was transparent. From browsing to financing to insurance - everything was handled professionally. Will definitely buy again!', rating: 5 },
    { name: 'Neha Agarwal', designation: 'Teacher', city: 'Guwahati', content: 'As a first-time car buyer, I was nervous. But the team at MeriPehli Gadi made it so simple. Love my new car!', rating: 5 },
  ]

  const items = testimonials.length > 0 ? testimonials : defaultTestimonials

  return (
    <section className="py-16 md:py-20 gradient-hero">
      <div className="container mx-auto px-4">
        <SectionHeading title="What Our Customers Say" subtitle="Real experiences from real buyers across Assam" />
        <FadeInSection>
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {items.map((t, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="p-6 rounded-2xl h-full border-slate-100 hover:shadow-lg transition-shadow">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`size-4 ${
                            j < (t.rating as number) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-4">
                      &ldquo;{t.content as string}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="size-10 rounded-full bg-gradient-to-br from-accent-orange to-orange-500 flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">
                          {(t.name as string)?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand">{t.name as string}</p>
                        <p className="text-xs text-slate-400">
                          {t.designation as string} {t.city ? `• ${t.city as string}` : ''}
                        </p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 size-10" />
            <CarouselNext className="hidden md:flex -right-4 size-10" />
          </Carousel>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 13: FAQ ────────────────────────────────────────────────

function FAQSection() {
  const [faqs, setFaqs] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetch('/api/faqs').then(r => r.json()).then(d => setFaqs(d.faqs || []))
  }, [])

  const defaultFaqs = [
    { question: 'How do I buy a car on MeriPehli Gadi?', answer: 'Simply browse our listings, select a car, book a test drive, and complete the purchase with our assistance. We handle documentation and finance.' },
    { question: 'Are all cars inspected before listing?', answer: 'Yes! Every car goes through a thorough inspection. Our certified cars undergo a 200-point quality check before being listed on the platform.' },
    { question: 'How does car financing work?', answer: 'We partner with Shani Finserve to offer easy car loans. You can get pre-approved online in 24 hours with minimal documentation and competitive interest rates.' },
    { question: 'Can I sell my car on MeriPehli Gadi?', answer: 'Absolutely! Simply submit your car details, get a free valuation, and we will connect you with verified buyers. We handle the entire process for you.' },
    { question: 'What is the return policy?', answer: 'We offer a 7-day return policy on certified cars. If you are not satisfied, we will refund your money or help you find a better car.' },
    { question: 'Do you provide insurance?', answer: 'Yes, we partner with Shani Finserve to provide comprehensive car insurance. Get instant quotes from top insurers and choose the best plan.' },
  ]

  const items = faqs.length > 0 ? faqs : defaultFaqs

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="Frequently Asked Questions" subtitle="Quick answers to common questions" />
        <FadeInSection>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {items.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-slate-50 rounded-xl border border-slate-100 px-6 shadow-sm data-[state=open]:shadow-md data-[state=open]:bg-white transition-all"
                >
                  <AccordionTrigger className="text-sm md:text-base font-semibold text-brand hover:no-underline py-5">
                    {faq.question as string}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-5">
                    {faq.answer as string}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Main HomePage Component ────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="page-enter">
      <HeroSection />
      <BrowseByTypeSection />
      <BrowseByBudgetSection />
      <PopularBrandsSection />
      <RecentlyAddedCarsSection />
      <CertifiedCarsSection />
      <SellCarCTASection />
      <CarLoanCTASection />
      <InsuranceCTASection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  )
}
