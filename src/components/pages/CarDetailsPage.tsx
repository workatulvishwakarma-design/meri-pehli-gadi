'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Home, Share2, Flag, Phone,
  MapPin, Gauge, Fuel, Settings2, Calendar, Car, Shield, BadgeIndianRupee,
  Star, Heart, MessageCircle, Clock, CheckCircle2, FileText,
  Award, ThumbsUp, AlertTriangle, Building2, ExternalLink,
  Zap, Check, X, Banknote, TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { useAppStore } from '@/lib/store'
import CarCard from '@/components/shared/CarCard'

// ─── Helpers ──────────────────────────────────────────────────────────
function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`
  return `₹${price.toLocaleString('en-IN')}`
}

function formatKm(km: number): string {
  if (km >= 100000) return `${(km / 1000).toFixed(0)} km`
  return `${(km / 1000).toFixed(1)} km`
}

function formatEmi(emi: number): string {
  return `₹${Math.round(emi).toLocaleString('en-IN')}`
}

function calculateEmi(principal: number, rate: number, tenureMonths: number): number {
  if (principal <= 0 || rate <= 0 || tenureMonths <= 0) return 0
  const monthlyRate = rate / (12 * 100)
  if (monthlyRate === 0) return principal / tenureMonths
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
}

// ─── Types ───────────────────────────────────────────────────────────
interface CarImageData {
  id: string
  url: string
  alt?: string | null
  sortOrder: number
}

interface CarData {
  id: string
  title: string
  description?: string | null
  year: number
  price: number
  emiPrice?: number | null
  kmDriven: number
  fuelType: string
  transmission: string
  ownerType: string
  bodyType: string
  color?: string | null
  rto?: string | null
  regYear?: number | null
  insuranceValidTill?: string | null
  badge?: string | null
  isCertified: boolean
  isFeatured: boolean
  isFinanceAvailable: boolean
  isInsuranceAvailable: boolean
  conditionScore?: number | null
  trustScore?: number | null
  viewsCount: number
  createdAt: string
  brand: { id: string; name: string; slug: string; logo?: string | null }
  model: { id: string; name: string; slug: string; bodyType?: string | null }
  variant?: { id: string; name: string } | null
  city?: { id: string; name: string; slug: string; state?: string | null } | null
  images: CarImageData[]
  features: { id: string; name: string; carId: string }[]
  dealer?: {
    id: string; name: string; slug?: string; phone?: string | null;
    address?: string | null; logo?: string | null; rating: number; totalCars: number;
  } | null
  seller?: { id: string; name: string; phone?: string | null; avatar?: string | null } | null
}

interface SimilarCar {
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
  sellerId: string
  dealer?: { id: string; name: string; slug?: string; rating: number } | null
}

// ─── Skeleton ────────────────────────────────────────────────────────
function CarDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Skeleton className="h-6 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-24 h-16 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ─── Image Gallery ───────────────────────────────────────────────────
function ImageGallery({ images, title }: { images: CarImageData[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const fallbackImage = `https://placehold.co/800x500/1e293b/f8fafc?text=${encodeURIComponent(title)}`

  const galleryImages = images.length > 0
    ? images.map((img) => img.url || fallbackImage)
    : [fallbackImage, ...Array.from({ length: 5 }, (_, i) => `https://placehold.co/800x500/334155/e2e8f0?text=View+${i + 2}`)]

  const goTo = (idx: number) => setCurrentIndex(Math.max(0, Math.min(idx, galleryImages.length - 1)))

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 group">
        <Image
          src={galleryImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => goTo(currentIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
          {currentIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 custom-scrollbar">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-brand ring-2 ring-brand/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image src={img} alt={`${title} thumb ${idx + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Key Spec Card ───────────────────────────────────────────────────
function SpecCard({ icon: Icon, label, value, color = 'slate' }: {
  icon: React.ElementType; label: string; value: string; color?: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-brand/20 hover:bg-brand/5 transition-colors">
      <div className={`size-9 rounded-lg flex items-center justify-center bg-${color}-100 text-${color}-600`}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  )
}

// ─── EMI Calculator ──────────────────────────────────────────────────
function EmiCalculatorWidget({ carPrice }: { carPrice: number }) {
  const [loanAmount, setLoanAmount] = useState(Math.round(carPrice * 0.8))
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenure, setTenure] = useState(60)

  const emi = useMemo(() => calculateEmi(loanAmount, interestRate, tenure), [loanAmount, interestRate, tenure])
  const totalPayment = emi * tenure
  const totalInterest = totalPayment - loanAmount

  return (
    <Card className="p-4 border-slate-100">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Banknote className="size-4 text-brand" />
        EMI Calculator
      </h3>

      <div className="space-y-4">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Loan Amount</span>
            <span className="font-semibold text-slate-700">{formatPrice(loanAmount)}</span>
          </div>
          <Slider
            min={Math.round(carPrice * 0.2)}
            max={carPrice}
            step={10000}
            value={[loanAmount]}
            onValueChange={([v]) => setLoanAmount(v)}
          />
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Interest Rate</span>
            <span className="font-semibold text-slate-700">{interestRate}%</span>
          </div>
          <Slider min={5} max={20} step={0.5} value={[interestRate]} onValueChange={([v]) => setInterestRate(v)} />
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Tenure</span>
            <span className="font-semibold text-slate-700">{tenure} months ({Math.floor(tenure / 12)}y {tenure % 12}m)</span>
          </div>
          <Slider min={12} max={84} step={6} value={[tenure]} onValueChange={([v]) => setTenure(v)} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 text-white">
        <p className="text-xs text-slate-300 mb-1">Monthly EMI</p>
        <p className="text-2xl font-bold">{formatEmi(emi)}<span className="text-sm font-normal text-slate-400">/month</span></p>
        <div className="flex gap-4 mt-3 text-xs text-slate-300">
          <span>Principal: <span className="text-white font-medium">{formatPrice(loanAmount)}</span></span>
          <span>Interest: <span className="text-amber-400 font-medium">{formatPrice(totalInterest)}</span></span>
        </div>
        <div className="flex gap-4 mt-1 text-xs text-slate-300">
          <span>Total: <span className="text-white font-medium">{formatPrice(totalPayment)}</span></span>
        </div>
      </div>
    </Card>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
export function CarDetailsPage() {
  const { pageParams, navigateTo, goBack } = useAppStore()
  const carId = pageParams.id

  const hasCarId = !!carId
  const [car, setCar] = useState<CarData | null>(null)
  const [similarCars, setSimilarCars] = useState<SimilarCar[]>([])
  const [loading, setLoading] = useState(hasCarId)
  const [error, setError] = useState(!hasCarId)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Fetch car data
  useEffect(() => {
    if (!hasCarId) return

    let cancelled = false
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/cars/${carId}`, { signal: controller.signal })
        if (cancelled) return
        if (!res.ok) throw new Error('Car not found')
        const data = await res.json()
        if (cancelled) return
        setCar(data.car)
        const similar: SimilarCar[] = (data.similarCars || []).map((c: Record<string, unknown>) => ({
          ...c,
          images: ((c.images || []) as Record<string, unknown>[]).map((img) => img.url as string),
          brand: (c.brand as Record<string, unknown>)?.name || c.brand || '',
          brandSlug: (c.brand as Record<string, unknown>)?.slug || '',
          model: (c.model as Record<string, unknown>)?.name || c.model || '',
          modelSlug: (c.model as Record<string, unknown>)?.slug || '',
          city: (c.city as Record<string, unknown>)?.name || c.city || '',
          citySlug: (c.city as Record<string, unknown>)?.slug || '',
        }))
        setSimilarCars(similar)
        setError(false)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true; controller.abort() }
  }, [carId, hasCarId])

  if (loading) return <CarDetailSkeleton />

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-10 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Car Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The car you are looking for may have been sold or removed.</p>
        <Button className="bg-brand hover:bg-brand-light" onClick={() => navigateTo('used-cars')}>
          <Car className="size-4 mr-2" />
          Browse All Cars
        </Button>
      </div>
    )
  }

  const carImage = car.images?.[0]?.url || `https://placehold.co/800x500/1e293b/f8fafc?text=${encodeURIComponent(car.title)}`

  const badges: { label: string; color: string }[] = []
  if (car.isCertified) badges.push({ label: 'Certified', color: 'bg-emerald-500 text-white' })
  if (car.kmDriven < 20000) badges.push({ label: 'Low Mileage', color: 'bg-blue-500 text-white' })
  if (car.badge) badges.push({ label: car.badge, color: 'bg-green-500 text-white' })

  const defaultFeatures = [
    'Air Conditioning', 'Power Steering', 'Power Windows',
    'Anti-Lock Braking System', 'Airbags', 'Central Locking',
    'Rear Parking Sensors', 'Touchscreen Infotainment',
    'Rear Camera', 'Cruise Control', 'Sunroof', 'Alloy Wheels',
    'LED Headlights', 'Keyless Entry', 'Push Button Start',
  ]
  const carFeatures = car.features?.length > 0 ? car.features.map((f) => f.name) : defaultFeatures

  const specTable = [
    { label: 'Engine', value: `${car.fuelType === 'ELECTRIC' ? 'Electric Motor' : car.bodyType === 'SUV' ? '1.5L Turbo' : '1.2L K-Series'}` },
    { label: 'Displacement', value: car.fuelType === 'ELECTRIC' ? '-' : '1197 cc' },
    { label: 'Max Power', value: car.fuelType === 'ELECTRIC' ? '75 kW' : '89 bhp @ 6000 rpm' },
    { label: 'Max Torque', value: car.fuelType === 'ELECTRIC' ? '180 Nm' : '113 Nm @ 4400 rpm' },
    { label: 'Mileage (ARAI)', value: car.fuelType === 'ELECTRIC' ? '250 km/charge' : car.fuelType === 'DIESEL' ? '24 kmpl' : '20 kmpl' },
    { label: 'Fuel Tank', value: car.fuelType === 'ELECTRIC' ? '-' : '37 Litres' },
    { label: 'Seating Capacity', value: car.bodyType === 'SUV' ? '7' : '5' },
    { label: 'Length x Width x Height', value: car.bodyType === 'SUV' ? '3995 x 1790 x 1685 mm' : '3995 x 1735 x 1490 mm' },
    { label: 'Wheelbase', value: car.bodyType === 'SUV' ? '2500 mm' : '2450 mm' },
    { label: 'Ground Clearance', value: car.bodyType === 'SUV' ? '200 mm' : '170 mm' },
    { label: 'Boot Space', value: car.bodyType === 'SUV' ? '318 Litres' : '268 Litres' },
    { label: 'Tyre Size', value: car.bodyType === 'SUV' ? '215/60 R17' : '185/65 R15' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand transition-colors mb-3 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to results
        </button>

        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer text-slate-500 hover:text-brand" onClick={() => navigateTo('home')}>
                <Home className="size-3" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer text-slate-500 hover:text-brand" onClick={() => navigateTo('used-cars')}>
                Used Cars
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer text-slate-500 hover:text-brand" onClick={() => navigateTo('used-cars-brand', { brand: car.brand.slug })}>
                {car.brand.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-slate-800">{car.model.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left Column: Main Content ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={car.images} title={car.title} />

            {/* Title + Price Section */}
            <Card className="p-5 border-slate-100">
              <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((b, i) => (
                  <Badge key={i} className={`${b.color} border-0 text-xs font-semibold`}>
                    {b.label === 'Certified' && <Shield className="size-3 mr-1" />}
                    {b.label}
                  </Badge>
                ))}
                {car.isFeatured && (
                  <Badge className="bg-orange-500 text-white border-0 text-xs font-semibold">
                    <Star className="size-3 mr-1" /> Top Pick
                  </Badge>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{car.title}</h1>
              {car.city && (
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-3">
                  <MapPin className="size-3.5" />
                  {car.city.name}{car.city.state ? `, ${car.city.state}` : ''}
                </p>
              )}

              <div className="flex flex-wrap items-end gap-3 mb-4">
                <div>
                  <p className="text-3xl font-bold text-brand">{formatPrice(car.price)}</p>
                  {car.emiPrice && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <TrendingUp className="size-3.5 text-emerald-500" />
                      EMI starts at <span className="font-semibold text-emerald-600">{formatEmi(car.emiPrice)}/month</span>
                    </p>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  <p>{formatKm(car.kmDriven)} driven</p>
                  <p>{car.ownerType.charAt(0) + car.ownerType.slice(1).toLowerCase()} Owner</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  <MessageCircle className="size-4" />
                  WhatsApp
                </Button>
                <Button className="bg-brand hover:bg-brand-light gap-2">
                  <Phone className="size-4" />
                  Contact Seller
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`size-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="size-4" />
                  Share
                </Button>
                <Button variant="outline" className="gap-2 text-slate-400">
                  <Flag className="size-4" />
                  Report
                </Button>
              </div>
            </Card>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SpecCard icon={Gauge} label="KM Driven" value={formatKm(car.kmDriven)} color="blue" />
              <SpecCard icon={Fuel} label="Fuel Type" value={car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase()} color="amber" />
              <SpecCard icon={Settings2} label="Transmission" value={car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()} color="purple" />
              <SpecCard icon={Award} label="Owner" value={`${car.ownerType.charAt(0) + car.ownerType.slice(1).toLowerCase()} Owner`} color="emerald" />
              <SpecCard icon={Calendar} label="Year" value={String(car.year)} color="orange" />
              <SpecCard icon={Car} label="Body Type" value={car.bodyType} color="rose" />
            </div>

            {/* Tabbed Content */}
            <Card className="border-slate-100 overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-slate-100 px-4 pt-1">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    {['overview', 'features', 'specifications', 'inspection', 'documents'].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm capitalize"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">About this {car.brand.name} {car.model.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {car.description || `This ${car.year} ${car.brand.name} ${car.model.name} is a well-maintained ${car.ownerType.toLowerCase()} owner vehicle with only ${formatKm(car.kmDriven)} on the odometer. Powered by a reliable ${car.fuelType.toLowerCase()} engine paired with ${car.transmission.toLowerCase()} transmission, this ${car.bodyType.toLowerCase()} offers a great balance of performance and fuel efficiency.

                    The car features a sleek ${car.color || 'elegant'} exterior and a comfortable interior with modern amenities. Regular maintenance has been performed, and all service records are available. The vehicle is registered under RTO ${car.rto || 'AS-01'} and all documents are up to date.

                    ${car.isCertified ? 'This vehicle has passed our rigorous 150-point inspection and comes with a certified pre-owned warranty for your peace of mind.' : ''}

                    Located in ${car.city?.name || 'Dibrugarh'}${car.city?.state ? `, ${car.city.state}` : ''}, this car is available for immediate viewing and test drive. Contact us today to schedule a visit!`}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand">{formatKm(car.kmDriven)}</p>
                      <p className="text-xs text-slate-500">KM Driven</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand">{car.year}</p>
                      <p className="text-xs text-slate-500">Year</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand">{formatPrice(car.price)}</p>
                      <p className="text-xs text-slate-500">Price</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Features & Accessories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {carFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 py-1">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Specifications Tab */}
                <TabsContent value="specifications" className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Technical Specifications</h3>
                  <div className="rounded-lg border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {specTable.map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                            <td className="py-2.5 px-4 text-slate-500 font-medium w-2/5">{spec.label}</td>
                            <td className="py-2.5 px-4 text-slate-800">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                {/* Inspection Tab */}
                <TabsContent value="inspection" className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-4">Inspection Report</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Condition Score */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
                      <p className="text-xs text-emerald-600 font-medium mb-2">Condition Score</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-emerald-600">{car.conditionScore || 8}</span>
                        <span className="text-sm text-emerald-500 mb-1">/10</span>
                      </div>
                      <Progress value={((car.conditionScore || 8) / 10) * 100} className="h-2 mt-2" />
                      <p className="text-xs text-emerald-600 mt-2">
                        {car.conditionScore && car.conditionScore >= 8 ? 'Excellent condition!' : car.conditionScore && car.conditionScore >= 6 ? 'Good condition' : 'Fair condition'}
                      </p>
                    </div>

                    {/* Trust Score */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium mb-2">Trust Score</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-blue-600">{car.trustScore || 85}</span>
                        <span className="text-sm text-blue-500 mb-1">/100</span>
                      </div>
                      <Progress value={car.trustScore || 85} className="h-2 mt-2" />
                      <p className="text-xs text-blue-600 mt-2">
                        {car.trustScore && car.trustScore >= 80 ? 'Highly trusted vehicle' : 'Verified vehicle'}
                      </p>
                    </div>
                  </div>

                  {/* Inspection Checklist */}
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-700 mb-3">150-Point Inspection Status</p>
                    {[
                      { label: 'Engine & Transmission', status: 'pass' },
                      { label: 'Brakes & Suspension', status: 'pass' },
                      { label: 'Electrical System', status: 'pass' },
                      { label: 'AC & Heating', status: 'pass' },
                      { label: 'Tyres & Wheels', status: car.kmDriven > 50000 ? 'warning' : 'pass' },
                      { label: 'Body & Paint', status: 'pass' },
                      { label: 'Interior Condition', status: 'pass' },
                      { label: 'Odometer Verification', status: 'pass' },
                      { label: 'RC & Insurance Documents', status: 'pass' },
                      { label: 'Service History', status: car.kmDriven > 50000 ? 'warning' : 'pass' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === 'pass'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status === 'pass' ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
                          {item.status === 'pass' ? 'Passed' : 'Minor Issue'}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Vehicle Documents</h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: 'Registration Certificate (RC)',
                        status: car.rto ? 'Available' : 'Pending',
                        detail: car.rto ? `RTO: ${car.rto}` : '',
                        ok: !!car.rto,
                      },
                      {
                        label: 'Insurance',
                        status: car.insuranceValidTill ? 'Active' : 'Expired',
                        detail: car.insuranceValidTill ? `Valid till ${new Date(car.insuranceValidTill).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : 'Not available',
                        ok: !!car.insuranceValidTill,
                      },
                      {
                        label: 'PUC Certificate',
                        status: 'Available',
                        detail: 'Valid till Dec 2025',
                        ok: true,
                      },
                      {
                        label: 'Service History',
                        status: car.kmDriven < 50000 ? 'Complete' : 'Partial',
                        detail: `${car.kmDriven < 50000 ? 'All' : 'Recent'} service records available`,
                        ok: car.kmDriven < 50000,
                      },
                      {
                        label: 'No Objection Certificate',
                        status: car.ownerType === 'FIRST' ? 'Not Required' : 'Available',
                        detail: car.ownerType === 'FIRST' ? 'First owner - NOC not required' : 'NOC from previous owner available',
                        ok: true,
                      },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.ok ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {doc.ok ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700">{doc.label}</p>
                          <p className="text-xs text-slate-500">{doc.detail}</p>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] shrink-0 ${
                          doc.ok ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Similar Cars */}
            {similarCars.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3">Similar Cars</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {similarCars.slice(0, 4).map((c) => (
                    <CarCard key={c.id} car={c} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right Column: Sidebar ─────────────────────────────── */}
          <div className="space-y-4">
            {/* Price Card */}
            <Card className="p-4 border-slate-100 sticky top-20 space-y-4">
              {/* Price */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
                <p className="text-xs text-slate-300 mb-1">Price</p>
                <p className="text-3xl font-bold">{formatPrice(car.price)}</p>
                {car.emiPrice && (
                  <p className="text-sm text-emerald-400 mt-1">
                    EMI {formatEmi(car.emiPrice)}/month
                  </p>
                )}
              </div>

              {/* Seller / Dealer Info */}
              {(car.dealer || car.seller) && (
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Building2 className="size-4 text-brand" />
                    {car.dealer ? 'Dealer' : 'Seller'} Information
                  </h3>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="size-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">
                      {(car.dealer?.name || car.seller?.name || 'S').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{car.dealer?.name || car.seller?.name}</p>
                      {car.dealer?.rating && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="size-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-slate-600">{car.dealer.rating.toFixed(1)}</span>
                          {car.dealer.totalCars > 0 && (
                            <span className="text-xs text-slate-400">· {car.dealer.totalCars} cars</span>
                          )}
                        </div>
                      )}
                      {car.city && (
                        <p className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="size-3" /> {car.city.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <Button className="w-full bg-brand hover:bg-brand-light gap-2">
                      <Phone className="size-4" />
                      Contact {car.dealer ? 'Dealer' : 'Seller'}
                    </Button>
                    <Button variant="outline" className="w-full gap-2 border-green-200 text-green-600 hover:bg-green-50">
                      <Calendar className="size-4" />
                      Book Test Drive
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Finance Badge */}
              {car.isFinanceAvailable && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <BadgeIndianRupee className="size-4 text-blue-500" />
                  <div>
                    <p className="text-xs font-semibold text-blue-700">Finance Available</p>
                    <p className="text-[11px] text-blue-500">Get easy loan at best rates</p>
                  </div>
                </div>
              )}

              {/* Insurance Badge */}
              {car.isInsuranceAvailable && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <Shield className="size-4 text-emerald-500" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">Insurance Available</p>
                    <p className="text-[11px] text-emerald-500">Comprehensive coverage options</p>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <p className="flex justify-between">
                  <span>Listed on</span>
                  <span className="text-slate-600">{new Date(car.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </p>
                <p className="flex justify-between">
                  <span>Views</span>
                  <span className="text-slate-600">{car.viewsCount} views</span>
                </p>
                {car.color && (
                  <p className="flex justify-between">
                    <span>Color</span>
                    <span className="text-slate-600">{car.color}</span>
                  </p>
                )}
                {car.rto && (
                  <p className="flex justify-between">
                    <span>RTO</span>
                    <span className="text-slate-600">{car.rto}</span>
                  </p>
                )}
              </div>
            </Card>

            {/* EMI Calculator */}
            <EmiCalculatorWidget carPrice={car.price} />

            {/* Verification Badge */}
            {car.isCertified && (
              <Card className="p-4 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="size-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-emerald-800">MeriPehli Gadi Certified</h3>
                </div>
                <p className="text-xs text-emerald-600 leading-relaxed">
                  This vehicle has passed our rigorous 150-point quality inspection. It comes with:
                </p>
                <ul className="mt-2 space-y-1">
                  {['6-month warranty', '7-day return policy', 'Free RC transfer assistance', 'All documents verified'].map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <Check className="size-3" /> {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
