'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  Car, Shield, Banknote, MapPin, Fuel, Search, ChevronRight, ChevronLeft,
  CarFront, Truck, Gem, ArrowRight, Star, Zap, CheckCircle2,
  ShieldCheck, FileText, Heart, Sparkles, Phone, ArrowUpRight,
  CircleDollarSign, Calculator, Calendar, ShieldHalf, Quote,
  BookOpen, Clock, Users, BadgeCheck, Award, HeadphonesIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

function SectionHeading({ title, subtitle, className = '' }: {
  title: string; subtitle?: string; className?: string
}) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <FadeInSection>
        <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">{subtitle}</p>}
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

  const floatingIcons = [
    { Icon: Car, className: 'top-[15%] left-[8%] text-blue-400/20', delay: 0 },
    { Icon: Shield, className: 'top-[20%] right-[10%] text-orange-400/20', delay: 0.5 },
    { Icon: Banknote, className: 'bottom-[25%] left-[12%] text-green-400/20', delay: 1 },
    { Icon: MapPin, className: 'bottom-[20%] right-[8%] text-purple-400/20', delay: 1.5 },
    { Icon: Fuel, className: 'top-[45%] left-[3%] text-amber-400/20', delay: 2 },
  ]

  const budgets = [
    { value: '0-200000', label: 'Under ₹2 Lakh' },
    { value: '200000-500000', label: '₹2 - 5 Lakh' },
    { value: '500000-800000', label: '₹5 - 8 Lakh' },
    { value: '800000-1200000', label: '₹8 - 12 Lakh' },
    { value: '1200000-2000000', label: '₹12 - 20 Lakh' },
    { value: '2000000-99999999', label: 'Above ₹20 Lakh' },
  ]

  return (
    <section className="relative gradient-hero overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, className, delay }, i) => (
        <div key={i} className={`absolute hidden md:block ${className}`}>
          <div className={delay > 1 ? 'animate-float-delay' : 'animate-float'}>
            <Icon className="size-10 md:size-14" />
          </div>
        </div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <Image src="/logo.png" alt="MeriPehli Gadi" width={120} height={40} className="h-10 w-auto" unoptimized />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-brand via-accent-blue to-accent-orange bg-clip-text text-transparent">
              Find Your Perfect Car
            </span>
          </h1>
          <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Buy, sell, finance and insure your car with trusted support from{' '}
            <span className="font-semibold text-brand">MeriPehli Gadi</span> and{' '}
            <span className="font-semibold text-accent-orange">Shani Finserve</span>.
          </p>
        </motion.div>

        {/* Search Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="p-4 md:p-6 rounded-2xl shadow-lg border-slate-200/50 bg-white/80 backdrop-blur-sm">
            {/* Car Type Toggle */}
            <div className="flex gap-2 mb-4">
              {['used', 'new'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCarType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    carType === type
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {type === 'used' ? 'Used Cars' : 'New Cars'}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel('') }}>
                <SelectTrigger className="w-full h-10 rounded-lg border-slate-200 text-sm">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                <SelectTrigger className="w-full h-10 rounded-lg border-slate-200 text-sm">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="w-full h-10 rounded-lg border-slate-200 text-sm">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((b) => (
                    <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full h-10 rounded-lg border-slate-200 text-sm">
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
                className="bg-accent-orange hover:bg-orange-600 text-white h-10 rounded-lg font-semibold col-span-2 md:col-span-1 btn-shine"
              >
                <Search className="size-4" />
                Search
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8 text-center"
        >
          {[
            { value: '500+', label: 'Verified Cars' },
            { value: '16+', label: 'Brands' },
            { value: '16+', label: 'Cities' },
            { value: '200+', label: 'Happy Customers' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl md:text-2xl font-bold text-brand">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
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
  const bodyTypes = [
    { label: 'SUV', icon: Car, count: 45, color: 'from-amber-500 to-orange-500' },
    { label: 'Sedan', icon: CarFront, count: 32, color: 'from-blue-500 to-indigo-500' },
    { label: 'Hatchback', icon: Car, count: 55, color: 'from-green-500 to-emerald-500' },
    { label: 'Coupe', icon: Gem, count: 12, color: 'from-purple-500 to-violet-500' },
    { label: 'Convertible', icon: Car, count: 8, color: 'from-pink-500 to-rose-500' },
    { label: 'Van', icon: Car, count: 15, color: 'from-cyan-500 to-teal-500' },
    { label: 'Truck', icon: Truck, count: 10, color: 'from-red-500 to-orange-500' },
    { label: 'Electric', icon: Zap, count: 20, color: 'from-lime-500 to-green-500' },
    { label: 'MUV/MPV', icon: Car, count: 18, color: 'from-slate-500 to-gray-600' },
  ]

  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="Browse by Type" subtitle="Find your ideal car by body type" />
        <FadeInSection>
          <div className="relative">
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 hover:bg-slate-50 hidden md:flex"
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
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('used-cars', { bodyType: bt.label.toLowerCase() })}
                  className="flex-shrink-0 w-32 md:w-36 flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100"
                >
                  <div className={`size-14 rounded-xl bg-gradient-to-br ${bt.color} flex items-center justify-center`}>
                    <bt.icon className="size-7 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-brand">{bt.label}</p>
                    <p className="text-xs text-slate-400">{bt.count}+ Cars</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 hover:bg-slate-50 hidden md:flex"
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
    { label: 'Under ₹2 Lakh', value: '0-200000', cars: 35, gradient: 'from-emerald-400 to-green-500' },
    { label: '₹2 - 5 Lakh', value: '200000-500000', cars: 65, gradient: 'from-blue-400 to-blue-600' },
    { label: '₹5 - 8 Lakh', value: '500000-800000', cars: 50, gradient: 'from-violet-400 to-purple-600' },
    { label: '₹8 - 12 Lakh', value: '800000-1200000', cars: 40, gradient: 'from-orange-400 to-orange-600' },
    { label: '₹12 - 20 Lakh', value: '1200000-2000000', cars: 25, gradient: 'from-rose-400 to-red-600' },
    { label: 'Above ₹20 Lakh', value: '2000000-99999999', cars: 15, gradient: 'from-brand to-brand-light' },
  ]

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Browse by Budget" subtitle="Explore cars that fit your budget" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {budgetRanges.map((b, i) => (
            <FadeInSection key={b.value} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateTo('used-cars-budget', { range: b.value })}
                className="cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${b.gradient} rounded-2xl p-5 text-center text-white shadow-md hover:shadow-xl transition-shadow`}>
                  <p className="text-lg md:text-xl font-bold mb-1">{b.label}</p>
                  <p className="text-xs md:text-sm opacity-90">{b.cars}+ Cars</p>
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
  const [brands, setBrands] = useState<{ id: string; name: string; slug: string; carCount: number }[]>([])

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || []))
  }, [])

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
    { name: 'Audi', slug: 'audi', count: 5 },
  ]

  const brandColors: Record<string, string> = {
    'maruti-suzuki': 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    'hyundai': 'bg-sky-50 border-sky-200 hover:bg-sky-100',
    'tata': 'bg-red-50 border-red-200 hover:bg-red-100',
    'mahindra': 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    'honda': 'bg-slate-50 border-slate-200 hover:bg-slate-100',
    'toyota': 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    'kia': 'bg-rose-50 border-rose-200 hover:bg-rose-100',
    'skoda': 'bg-green-50 border-green-200 hover:bg-green-100',
    'volkswagen': 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    'mg': 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    'bmw': 'bg-blue-50 border-blue-300 hover:bg-blue-100',
    'mercedes-benz': 'bg-slate-100 border-slate-300 hover:bg-slate-200',
    'audi': 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100',
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="Explore Used Cars by Brand" subtitle="Choose from India's top car brands" />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularBrands.map((brand, i) => (
            <FadeInSection key={brand.slug} delay={i * 0.03}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateTo('used-cars-brand', { brand: brand.slug })}
                className="cursor-pointer"
              >
                <div className={`rounded-xl border p-4 text-center transition-all ${brandColors[brand.slug] || 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Car className="size-5 text-brand/60" />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-brand leading-tight">{brand.name}</p>
                  <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
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

// ─── Section 5: Most Searched Cars ──────────────────────────────────

function MostSearchedCarsSection() {
  const [cars, setCars] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars?sort=popular&limit=8')
      .then(r => r.json())
      .then(d => { setCars(d.cars || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Most Searched Cars" subtitle="Popular choices among our buyers" />
        <FadeInSection>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="rounded-xl p-0 overflow-hidden">
                  <div className="aspect-[16/10] bg-slate-200 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                    <div className="h-5 bg-slate-200 rounded animate-pulse w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Car className="size-12 mx-auto mb-3 opacity-50" />
              <p>No popular cars found yet</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {cars.map((car: Record<string, unknown>) => (
                <div key={car.id as string} className="min-w-[260px] md:min-w-[280px] max-w-[300px] flex-shrink-0">
                  <CarCard car={car as Parameters<typeof CarCard>[0]['car']} variant="default" />
                </div>
              ))}
            </div>
          )}
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 6: Recently Added Cars ─────────────────────────────────

function RecentlyAddedCarsSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [cars, setCars] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars?sort=newest&limit=8')
      .then(r => r.json())
      .then(d => { setCars(d.cars || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <FadeInSection>
            <h2 className="text-2xl md:text-3xl font-bold text-brand">Recently Added Cars</h2>
            <p className="text-slate-500 text-sm mt-1">Fresh listings updated daily</p>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <Button
              variant="ghost"
              className="text-accent-blue hover:text-blue-700 gap-1 text-sm"
              onClick={() => navigateTo('used-cars')}
            >
              View All <ArrowRight className="size-4" />
            </Button>
          </FadeInSection>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-xl p-0 overflow-hidden">
                <div className="aspect-[16/10] bg-slate-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Car className="size-12 mx-auto mb-3 opacity-50" />
            <p>No cars found yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cars.map((car: Record<string, unknown>, i) => (
              <FadeInSection key={car.id as string} delay={i * 0.05}>
                <CarCard car={car as Parameters<typeof CarCard>[0]['car']} />
              </FadeInSection>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Section 7: Certified Cars ──────────────────────────────────────

function CertifiedCarsSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [cars, setCars] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars?certified=true&limit=4')
      .then(r => r.json())
      .then(d => { setCars(d.cars || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Certified Pre-Owned Cars"
          subtitle="200-point inspection, verified history, and warranty on every certified car"
        />

        {/* Trust Badges */}
        <FadeInSection>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
            {[
              { icon: ShieldCheck, label: '200-Point Inspection' },
              { icon: Award, label: '6-Month Warranty' },
              { icon: BadgeCheck, label: 'Verified History' },
              { icon: HeadphonesIcon, label: '24/7 Support' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-emerald-100">
                <badge.icon className="size-4 text-emerald-500" />
                <span className="text-xs font-medium text-slate-600">{badge.label}</span>
              </div>
            ))}
          </div>
        </FadeInSection>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-xl p-0 overflow-hidden">
                <div className="aspect-[16/10] bg-slate-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">Certified cars coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cars.map((car: Record<string, unknown>, i) => (
              <FadeInSection key={car.id as string} delay={i * 0.05}>
                <CarCard car={car as Parameters<typeof CarCard>[0]['car']} />
              </FadeInSection>
            ))}
          </div>
        )}

        <FadeInSection>
          <div className="text-center mt-8">
            <Button
              onClick={() => navigateTo('certified-cars')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-11 font-semibold"
            >
              View All Certified Cars <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 8: Sell Your Car CTA ───────────────────────────────────

function SellCarCTASection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  return (
    <section className="py-12 md:py-16 gradient-orange">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-white/20 text-white border-0 mb-4 text-xs">
                <Sparkles className="size-3 mr-1" />
                Zero Hassle Selling
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Apni car bechna ab tension-free.
              </h2>
              <p className="text-white/90 mb-6 max-w-lg text-sm md:text-base">
                Best price, verified buyers aur fast payment support. Kisi bhi brand ki car ko easily sell karein.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigateTo('sell-car')}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl px-8 h-12 shadow-lg"
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
                <div className="size-48 md:size-56 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <Car className="size-24 md:size-32 text-white/80" />
                </div>
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 -right-2 bg-white rounded-xl px-3 py-1.5 shadow-lg"
                >
                  <p className="text-xs font-bold text-orange-600">Best Price</p>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-2 -left-2 bg-white rounded-xl px-3 py-1.5 shadow-lg"
                >
                  <p className="text-xs font-bold text-green-600">Fast Payment</p>
                </motion.div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 9: Car Loan CTA ────────────────────────────────────────

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
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8e] to-[#3b82f6]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <FadeInSection>
              <Badge className="bg-white/15 text-white border-0 mb-4 text-xs">
                <Banknote className="size-3 mr-1" />
                Powered by Shani Finserve
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Easy Car Finance by Shani Finserve
              </h2>
              <p className="text-blue-100/90 mb-6 max-w-lg text-sm md:text-base">
                Low EMI starting ₹8,999/month. Quick approval in 24 hours. Get pre-approved for your dream car today.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Zap, label: '24hr Approval' },
                  { icon: ShieldCheck, label: 'Low Interest' },
                  { icon: FileText, label: 'Minimal Docs' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="size-10 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                      <item.icon className="size-5 text-white" />
                    </div>
                    <p className="text-xs text-blue-100/80">{item.label}</p>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                onClick={() => navigateTo('finance')}
                className="bg-accent-orange hover:bg-orange-600 text-white font-bold rounded-xl px-8 h-12 shadow-lg btn-shine"
              >
                Apply Now <ArrowUpRight className="size-5 ml-1" />
              </Button>
            </FadeInSection>
          </div>

          {/* EMI Calculator */}
          <FadeInSection delay={0.2}>
            <Card className="w-full max-w-md p-6 rounded-2xl shadow-2xl border-0 bg-white">
              <div className="flex items-center gap-2 mb-5">
                <Calculator className="size-5 text-accent-blue" />
                <h3 className="font-bold text-brand text-lg">EMI Calculator</h3>
              </div>

              {/* Loan Amount */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-600 mb-1 block">
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
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>₹1L</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-600 mb-1 block">
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
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-600 mb-1 block">
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
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1 Yr</span>
                  <span>7 Yr</span>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold text-brand">
                  ₹{Math.round(emi).toLocaleString('en-IN')}
                </p>
                <div className="flex justify-between mt-3 text-xs">
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

// ─── Section 10: Insurance CTA ──────────────────────────────────────

function InsuranceCTASection() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-white/20 text-white border-0 mb-4 text-xs">
                <ShieldHalf className="size-3 mr-1" />
                Insurance Partner: Shani Finserve
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Secure your car before your first drive.
              </h2>
              <p className="text-green-100/90 mb-6 max-w-lg text-sm md:text-base">
                Comprehensive insurance support by Shani Finserve. Get the best quotes from top insurers in minutes.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  'Third Party', 'Comprehensive', 'Zero Depreciation', 'Roadside Assistance',
                ].map((item) => (
                  <div key={item} className="bg-white/10 rounded-lg px-3 py-2 text-center backdrop-blur-sm">
                    <p className="text-xs text-white font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigateTo('insurance')}
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl px-8 h-12 shadow-lg"
              >
                Get Insurance Quote <ArrowUpRight className="size-5 ml-1" />
              </Button>
            </div>

            <div className="flex-shrink-0">
              <div className="relative">
                <div className="size-48 md:size-56 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <ShieldHalf className="size-24 md:size-32 text-white/80" />
                </div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 -right-2 bg-white rounded-xl px-3 py-1.5 shadow-lg"
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

// ─── Section 11: Why Choose Us ──────────────────────────────────────

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
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Why Choose MeriPehli Gadi" subtitle="We make buying a car easy, transparent, and trustworthy" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FadeInSection key={feature.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="p-6 rounded-2xl border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all h-full text-center">
                  <div className={`size-14 mx-auto mb-4 rounded-2xl ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="font-bold text-brand mb-2">{feature.title}</h3>
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

// ─── Section 12: How It Works ───────────────────────────────────────

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
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="How It Works" subtitle="Simple 4-step process to buy your dream car" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, i) => (
            <FadeInSection key={step.num} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                {/* Connecting line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-blue-100" />
                )}

                <div className="relative z-10 size-14 rounded-full bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <step.icon className="size-6 text-white" />
                </div>

                <span className="text-xs font-bold text-accent-blue mb-1">{step.num}</span>
                <h3 className="font-bold text-brand mb-1">{step.title}</h3>
                <p className="text-sm text-slate-500 max-w-[200px]">{step.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 13: Customer Testimonials ──────────────────────────────

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => setTestimonials(d.testimonials || []))
  }, [])

  // Fallback testimonials
  const defaultTestimonials = [
    { name: 'Rahul Sharma', designation: 'Car Buyer', city: 'Dibrugarh', content: 'Best experience buying a used car! The certified inspection gave me complete confidence in my purchase.', rating: 5 },
    { name: 'Priya Dutta', designation: 'First-time Buyer', city: 'Guwahati', content: 'MeriPehli Gadi made buying my first car so easy. The EMI options from Shani Finserve were very affordable.', rating: 5 },
    { name: 'Amit Koch', designation: 'Car Enthusiast', city: 'Jorhat', content: 'Great selection of cars and the finance process was incredibly smooth. Highly recommend to everyone!', rating: 5 },
    { name: 'Sneha Borah', designation: 'Business Owner', city: 'Tinsukia', content: 'Sold my old car through MeriPehli Gadi. Got the best price and the payment was fast. Excellent service!', rating: 4 },
  ]

  const items = testimonials.length > 0 ? testimonials : defaultTestimonials

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="What Our Customers Say" subtitle="Real experiences from real buyers" />
        <FadeInSection>
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {items.map((t, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="p-6 rounded-2xl h-full border-slate-100">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating as number }).map((_, j) => (
                        <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-4">
                      &ldquo;{t.content as string}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="size-10 rounded-full bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center">
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
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 14: Latest Blog Posts ──────────────────────────────────

function BlogPostsSection() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const posts = [
    {
      title: '10 Tips for Buying Your First Used Car',
      excerpt: 'A comprehensive guide for first-time car buyers covering inspection, negotiation, and paperwork.',
      date: '2025-01-15',
      image: 'https://placehold.co/600x300/e2e8f0/64748b?text=Buying+Guide',
      slug: 'tips-for-buying-first-used-car',
    },
    {
      title: 'How to Get the Best Car Loan in 2025',
      excerpt: 'Compare interest rates, understand EMI calculations, and find the best financing options.',
      date: '2025-01-10',
      image: 'https://placehold.co/600x300/e2e8f0/64748b?text=Car+Loan+Guide',
      slug: 'best-car-loan-2025',
    },
    {
      title: 'Top 5 Budget-Friendly SUVs Under ₹10 Lakh',
      excerpt: 'Looking for an SUV that fits your budget? Here are our top picks with detailed reviews.',
      date: '2025-01-05',
      image: 'https://placehold.co/600x300/e2e8f0/64748b?text=Best+SUVs',
      slug: 'budget-friendly-suvs-under-10-lakh',
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading title="Latest from Our Blog" subtitle="Tips, guides, and insights for car buyers" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <FadeInSection key={post.slug} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card
                  className="overflow-hidden rounded-2xl border-slate-100 hover:shadow-lg transition-all cursor-pointer p-0 gap-0"
                  onClick={() => navigateTo('blog-detail', { slug: post.slug })}
                >
                  <div className="relative aspect-[2/1]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-3 text-slate-400" />
                      <span className="text-xs text-slate-400">
                        {new Date(post.date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="font-bold text-brand mb-2 line-clamp-2 text-sm leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{post.excerpt}</p>
                    <span className="text-xs font-semibold text-accent-blue flex items-center gap-1 hover:gap-2 transition-all">
                      Read More <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Card>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
        <FadeInSection>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigateTo('blog')}
              className="rounded-xl px-8 border-brand/20 text-brand hover:bg-brand/5"
            >
              <BookOpen className="size-4 mr-1" />
              View All Posts
            </Button>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Section 15: FAQ Section ────────────────────────────────────────

function FAQSection() {
  const [faqs, setFaqs] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetch('/api/faqs').then(r => r.json()).then(d => setFaqs(d.faqs || []))
  }, [])

  // Default FAQs
  const defaultFaqs = [
    { question: 'How do I buy a car on MeriPehli Gadi?', answer: 'Simply browse our listings, select a car, book a test drive, and complete the purchase with our assistance. We handle documentation and finance.' },
    { question: 'Are all cars inspected before listing?', answer: 'Yes! Every car goes through a thorough inspection. Our certified cars undergo a 200-point quality check before being listed.' },
    { question: 'How does car financing work?', answer: 'We partner with Shani Finserve to offer easy car loans. You can get pre-approved online in 24 hours with minimal documentation and competitive interest rates.' },
    { question: 'Can I sell my car on MeriPehli Gadi?', answer: 'Absolutely! Simply submit your car details, get a free valuation, and we will connect you with verified buyers. We handle the entire process for you.' },
    { question: 'What is the return policy?', answer: 'We offer a 7-day return policy on certified cars. If you are not satisfied, we will refund your money or help you find a better car.' },
    { question: 'Do you provide insurance?', answer: 'Yes, we partner with Shani Finserve to provide comprehensive car insurance. Get instant quotes from top insurers and choose the best plan.' },
  ]

  const items = faqs.length > 0 ? faqs : defaultFaqs

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Frequently Asked Questions" subtitle="Quick answers to common questions" />
        <FadeInSection>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {items.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-xl border border-slate-100 px-5 shadow-sm"
                >
                  <AccordionTrigger className="text-sm md:text-base font-semibold text-brand hover:no-underline py-4">
                    {faq.question as string}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-500 leading-relaxed">
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
      <MostSearchedCarsSection />
      <RecentlyAddedCarsSection />
      <CertifiedCarsSection />
      <SellCarCTASection />
      <CarLoanCTASection />
      <InsuranceCTASection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogPostsSection />
      <FAQSection />
    </div>
  )
}
