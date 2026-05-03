'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Gauge,
  Fuel,
  Settings2,
  Calendar,
  Car,
  Shield,
  Star,
  Phone,
  MessageCircle,
  CheckCircle,
  Check,
  Banknote,
  AlertTriangle,
  Building2,
  User,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { useAppStore } from '@/lib/store'
import CarCard from '@/components/shared/CarCard'

// ─── Helpers ─────────────────────────────────────────────────────────
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
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  )
}

function formatEnum(val: string): string {
  return val.charAt(0) + val.slice(1).toLowerCase()
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
  city?: { id: string; name: string; slug: string; state?: string | null } | null
  images: CarImageData[]
  features: { id: string; name: string; carId: string }[]
  dealer?: {
    id: string
    name: string
    slug?: string
    phone?: string | null
    address?: string | null
    logo?: string | null
    rating: number
    totalCars: number
  } | null
  seller?: { id: string; name: string; phone?: string | null; avatar?: string | null } | null
}

interface SimilarCarItem {
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

// ─── Skeleton ────────────────────────────────────────────────────────
function CarDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Skeleton className="h-4 w-48 mb-4" />
      <Skeleton className="h-4 w-72 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-24 h-16 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
        {/* Right column */}
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ─── Image Gallery ───────────────────────────────────────────────────
function ImageGallery({ images, title }: { images: CarImageData[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const fallbackImage = `https://placehold.co/800x450/1e293b/f8fafc?text=${encodeURIComponent(title)}`

  const hasImages = images.length > 0
  const galleryImages = hasImages
    ? images.map((img) => img.url || fallbackImage)
    : []

  const goTo = (idx: number) =>
    setCurrentIndex(Math.max(0, Math.min(idx, galleryImages.length - 1)))

  const goPrev = () => goTo(currentIndex - 1)
  const goNext = () => goTo(currentIndex + 1)

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 group">
        {hasImages ? (
          <Image
            src={galleryImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 flex items-center justify-center">
            <Car className="size-20 text-white/60" />
          </div>
        )}

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasImages && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md font-medium">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 custom-scrollbar">
          {galleryImages.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? 'border-brand ring-2 ring-brand/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
          {galleryImages.length > 4 && (
            <button
              type="button"
              className="shrink-0 w-20 h-14 rounded-lg bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-xs text-slate-600 font-medium"
            >
              +{galleryImages.length - 4}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Key Spec Card ───────────────────────────────────────────────────
function SpecCard({
  icon: Icon,
  label,
  value,
  bgColor,
  textColor,
}: {
  icon: React.ElementType
  label: string
  value: string
  bgColor: string
  textColor: string
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand/20 hover:bg-brand/5 transition-colors">
      <div
        className={`size-10 rounded-xl flex items-center justify-center ${bgColor} ${textColor}`}
      >
        <Icon className="size-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  )
}

// ─── EMI Calculator Widget ───────────────────────────────────────────
function EmiCalculator({ carPrice }: { carPrice: number }) {
  const [loanAmount, setLoanAmount] = useState(Math.round(carPrice * 0.8))
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenure, setTenure] = useState(60)

  const emi = useMemo(
    () => calculateEmi(loanAmount, interestRate, tenure),
    [loanAmount, interestRate, tenure]
  )
  const totalPayment = emi * tenure
  const totalInterest = totalPayment - loanAmount

  return (
    <Card className="p-5 border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Banknote className="size-4 text-brand" />
        EMI Calculator
      </h3>

      <div className="space-y-4">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Loan Amount</span>
            <span className="font-semibold text-slate-700">
              {formatPrice(loanAmount)}
            </span>
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
          <Slider
            min={5}
            max={20}
            step={0.5}
            value={[interestRate]}
            onValueChange={([v]) => setInterestRate(v)}
          />
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Tenure</span>
            <span className="font-semibold text-slate-700">
              {tenure} months ({Math.floor(tenure / 12)}y {tenure % 12}m)
            </span>
          </div>
          <Slider
            min={12}
            max={84}
            step={6}
            value={[tenure]}
            onValueChange={([v]) => setTenure(v)}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
        <p className="text-xs text-slate-300 mb-1">Monthly EMI</p>
        <p className="text-2xl font-bold">
          {formatEmi(emi)}
          <span className="text-sm font-normal text-slate-400">/month</span>
        </p>
        <div className="flex gap-4 mt-3 text-xs text-slate-300">
          <span>
            Principal:{' '}
            <span className="text-white font-medium">
              {formatPrice(loanAmount)}
            </span>
          </span>
          <span>
            Interest:{' '}
            <span className="text-amber-400 font-medium">
              {formatPrice(totalInterest)}
            </span>
          </span>
        </div>
        <div className="mt-1 text-xs text-slate-300">
          Total:{' '}
          <span className="text-white font-medium">
            {formatPrice(totalPayment)}
          </span>
        </div>
      </div>
    </Card>
  )
}

// ─── Rating Stars ────────────────────────────────────────────────────
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────
export function CarDetailsPage() {
  const { pageParams, navigateTo, goBack } = useAppStore()
  const carId = pageParams.id

  const hasCarId = !!carId
  const [car, setCar] = useState<CarData | null>(null)
  const [similarCars, setSimilarCars] = useState<SimilarCarItem[]>([])
  const [loading, setLoading] = useState(hasCarId)
  const [error, setError] = useState(!hasCarId)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // ─── Fetch Car Data ────────────────────────────────────────────────
  useEffect(() => {
    if (!hasCarId) return

    let cancelled = false
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/cars/${carId}`, {
          signal: controller.signal,
        })
        if (cancelled) return
        if (!res.ok) throw new Error('Car not found')
        const data = await res.json()
        if (cancelled) return
        setCar(data.car)
        const similar: SimilarCarItem[] = (
          data.similarCars || []
        ).map((c: Record<string, unknown>) => ({
          ...c,
          images: ((c.images || []) as Record<string, unknown>[]).map(
            (img) => img.url as string
          ),
          brand:
            (c.brand as Record<string, unknown>)?.name || c.brand || '',
          brandSlug:
            (c.brand as Record<string, unknown>)?.slug || '',
          model:
            (c.model as Record<string, unknown>)?.name || c.model || '',
          modelSlug:
            (c.model as Record<string, unknown>)?.slug || '',
          city:
            (c.city as Record<string, unknown>)?.name || c.city || '',
          citySlug:
            (c.city as Record<string, unknown>)?.slug || '',
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
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [carId, hasCarId])

  // ─── Loading / Error States ────────────────────────────────────────
  if (loading) return <CarDetailSkeleton />

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-10 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">
          Car Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The car you are looking for may have been sold or removed.
        </p>
        <Button
          className="bg-brand hover:bg-brand-light"
          onClick={() => navigateTo('used-cars')}
        >
          <Car className="size-4 mr-2" />
          Browse All Cars
        </Button>
      </div>
    )
  }

  // ─── Derived Data ──────────────────────────────────────────────────
  const carImage =
    car.images?.[0]?.url ||
    `https://placehold.co/800x450/1e293b/f8fafc?text=${encodeURIComponent(car.title)}`

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${car.title} listed at ${formatPrice(car.price)} on MeriPehli Gadi. Please share more details.`
  )
  const whatsappLink = `https://wa.me/?text=${whatsappMessage}`

  const defaultFeatures = [
    'Air Conditioning',
    'Power Steering',
    'Power Windows',
    'Anti-Lock Braking System (ABS)',
    'Airbags',
    'Central Locking',
    'Rear Parking Sensors',
    'Touchscreen Infotainment',
    'Rear Camera',
    'Cruise Control',
    'Sunroof',
    'Alloy Wheels',
    'LED Headlights',
    'Keyless Entry',
    'Push Button Start',
  ]
  const carFeatures =
    car.features?.length > 0
      ? car.features.map((f) => f.name)
      : defaultFeatures

  const specTable = [
    {
      label: 'Engine',
      value:
        car.fuelType === 'ELECTRIC'
          ? 'Electric Motor'
          : car.bodyType === 'SUV'
            ? '1.5L Turbo'
            : '1.2L K-Series',
    },
    {
      label: 'Displacement',
      value: car.fuelType === 'ELECTRIC' ? '-' : '1197 cc',
    },
    {
      label: 'Max Power',
      value:
        car.fuelType === 'ELECTRIC' ? '75 kW' : '89 bhp @ 6000 rpm',
    },
    {
      label: 'Max Torque',
      value:
        car.fuelType === 'ELECTRIC'
          ? '180 Nm'
          : '113 Nm @ 4400 rpm',
    },
    {
      label: 'Mileage (ARAI)',
      value:
        car.fuelType === 'ELECTRIC'
          ? '250 km/charge'
          : car.fuelType === 'DIESEL'
            ? '24 kmpl'
            : '20 kmpl',
    },
    {
      label: 'Fuel Tank',
      value: car.fuelType === 'ELECTRIC' ? '-' : '37 Litres',
    },
    {
      label: 'Seating Capacity',
      value: car.bodyType === 'SUV' || car.bodyType === 'MPV' ? '7' : '5',
    },
    {
      label: 'Body Type',
      value: car.bodyType,
    },
    {
      label: 'Transmission',
      value: formatEnum(car.transmission),
    },
    {
      label: 'Color',
      value: car.color || '-',
    },
    {
      label: 'RTO',
      value: car.rto || '-',
    },
    {
      label: 'Insurance Valid Till',
      value: car.insuranceValidTill
        ? new Date(car.insuranceValidTill).toLocaleDateString('en-IN', {
            month: 'short',
            year: 'numeric',
          })
        : '-',
    },
  ]

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* ─── Back Button ───────────────────────────────────────────── */}
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand transition-colors mb-3 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Results
        </button>

        {/* ─── Breadcrumb ────────────────────────────────────────────── */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-slate-500 hover:text-brand"
                onClick={() => navigateTo('home')}
              >
                <Home className="size-3" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-slate-500 hover:text-brand"
                onClick={() => navigateTo('used-cars')}
              >
                Used Cars
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-slate-500 hover:text-brand"
                onClick={() =>
                  navigateTo('used-cars-brand', { brand: car.brand.slug })
                }
              >
                {car.brand.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-slate-800">
                {car.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ─── Main Two-Column Layout (7/5) ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ─── LEFT COLUMN (7 cols) ──────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Image Gallery */}
            <ImageGallery images={car.images} title={car.title} />

            {/* Key Specs: 6 cards in 3x2 grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SpecCard
                icon={Gauge}
                label="KM Driven"
                value={formatKm(car.kmDriven)}
                bgColor="bg-blue-50"
                textColor="text-blue-600"
              />
              <SpecCard
                icon={Fuel}
                label="Fuel Type"
                value={formatEnum(car.fuelType)}
                bgColor="bg-amber-50"
                textColor="text-amber-600"
              />
              <SpecCard
                icon={Settings2}
                label="Transmission"
                value={formatEnum(car.transmission)}
                bgColor="bg-purple-50"
                textColor="text-purple-600"
              />
              <SpecCard
                icon={User}
                label="Owner Type"
                value={`${formatEnum(car.ownerType)} Owner`}
                bgColor="bg-emerald-50"
                textColor="text-emerald-600"
              />
              <SpecCard
                icon={Calendar}
                label="Year"
                value={String(car.year)}
                bgColor="bg-orange-50"
                textColor="text-orange-600"
              />
              <SpecCard
                icon={Car}
                label="Body Type"
                value={car.bodyType}
                bgColor="bg-rose-50"
                textColor="text-rose-600"
              />
            </div>

            {/* Tabs Section */}
            <Card className="border-slate-100 overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-slate-100 px-4 pt-1">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    {['overview', 'features', 'specifications'].map(
                      (tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm capitalize"
                        >
                          {tab}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="p-5">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    About this {car.brand.name} {car.model.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {car.description ||
                      `This ${car.year} ${car.brand.name} ${car.model.name} is a well-maintained ${car.ownerType.toLowerCase()} owner vehicle with only ${formatKm(car.kmDriven)} on the odometer. Powered by a reliable ${car.fuelType.toLowerCase()} engine paired with ${car.transmission.toLowerCase()} transmission, this ${car.bodyType.toLowerCase()} offers a great balance of performance and fuel efficiency.

The car features a sleek ${car.color || 'elegant'} exterior and a comfortable interior with modern amenities. Regular maintenance has been performed, and all service records are available. The vehicle is registered under RTO ${car.rto || 'AS-01'} and all documents are up to date.
${
  car.isCertified
    ? '\n\nThis vehicle has passed our rigorous 150-point inspection and comes with a certified pre-owned warranty for your peace of mind.'
    : ''
}
Located in ${car.city?.name || 'Dibrugarh'}${car.city?.state ? `, ${car.city.state}` : ''}, this car is available for immediate viewing and test drive. Contact us today to schedule a visit!`}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand">
                        {formatKm(car.kmDriven)}
                      </p>
                      <p className="text-xs text-slate-500">KM Driven</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand">{car.year}</p>
                      <p className="text-xs text-slate-500">Year</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-brand">
                        {formatPrice(car.price)}
                      </p>
                      <p className="text-xs text-slate-500">Price</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="p-5">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Features & Accessories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {carFeatures.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-slate-600 py-1.5"
                      >
                        <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Specifications Tab */}
                <TabsContent value="specifications" className="p-5">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Technical Specifications
                  </h3>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {specTable.map((spec, i) => (
                          <tr
                            key={i}
                            className={
                              i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                            }
                          >
                            <td className="py-3 px-4 text-slate-500 font-medium w-2/5">
                              {spec.label}
                            </td>
                            <td className="py-3 px-4 text-slate-800">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Similar Cars */}
            {similarCars.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3">
                  Similar Cars
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarCars.slice(0, 4).map((c) => (
                    <CarCard key={c.id} car={c} variant="default" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT COLUMN (5 cols) ─────────────────────────────── */}
          <div className="lg:col-span-5 space-y-4">
            {/* ─── Price Card (Sticky) ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-0 border-slate-100 shadow-xl rounded-2xl overflow-hidden sticky top-20">
                {/* Price Header */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
                  {/* Certified Badge */}
                  {car.isCertified && (
                    <Badge className="bg-emerald-500 text-white border-0 gap-1 text-xs font-semibold mb-3">
                      <Shield className="size-3" />
                      Certified Pre-Owned
                    </Badge>
                  )}
                  <p className="text-3xl font-bold">{formatPrice(car.price)}</p>
                  {car.emiPrice && (
                    <p className="text-sm text-sky-300 mt-1.5 flex items-center gap-1">
                      <Banknote className="size-3.5" />
                      EMI from{' '}
                      <span className="font-semibold text-white">
                        {formatEmi(car.emiPrice)}/mo
                      </span>
                    </p>
                  )}
                </div>

                {/* Location */}
                {car.city && (
                  <div className="flex items-center gap-1.5 px-5 pt-3 text-sm text-slate-500">
                    <MapPin className="size-3.5" />
                    {car.city.name}
                    {car.city.state ? `, ${car.city.state}` : ''}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-5 space-y-2.5">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11 text-sm font-semibold">
                    <Phone className="size-4" />
                    Contact Seller
                  </Button>
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white gap-2 h-11 text-sm font-semibold">
                    <Calendar className="size-4" />
                    Book Test Drive
                  </Button>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2 h-11 text-sm font-semibold">
                    <Star className="size-4" />
                    Get Best Price
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 h-11 text-sm font-semibold"
                    asChild
                  >
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                </div>

                {/* Dealer Info */}
                {(car.dealer || car.seller) && (
                  <>
                    <Separator />
                    <div className="px-5 pb-4 pt-1">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2.5">
                        {car.dealer ? 'Dealer' : 'Seller'} Information
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="size-11 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                          {(car.dealer?.name || car.seller?.name || 'S').charAt(
                            0
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {car.dealer?.name || car.seller?.name}
                          </p>
                          {car.dealer?.rating ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <RatingStars rating={car.dealer.rating} />
                              <span className="text-xs text-slate-500">
                                {car.dealer.rating.toFixed(1)}
                              </span>
                              {car.dealer.totalCars > 0 && (
                                <span className="text-xs text-slate-400">
                                  · {car.dealer.totalCars} cars
                                </span>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

            {/* ─── Trust Score Section ───────────────────────────────── */}
            {(car.trustScore || car.conditionScore) && (
              <Card className="p-4 border-slate-100 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  {car.conditionScore != null && (
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-3.5 border border-emerald-100 text-center">
                      <p className="text-xs text-emerald-600 font-medium mb-1">
                        Condition
                      </p>
                      <p className="text-3xl font-bold text-emerald-600">
                        {car.conditionScore}
                        <span className="text-sm font-normal text-emerald-500">
                          /10
                        </span>
                      </p>
                    </div>
                  )}
                  {car.trustScore != null && (
                    <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-3.5 border border-sky-100 text-center">
                      <p className="text-xs text-sky-600 font-medium mb-1">
                        Trust Score
                      </p>
                      <p className="text-3xl font-bold text-sky-600">
                        {car.trustScore}
                        <span className="text-sm font-normal text-sky-500">
                          /100
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* ─── EMI Calculator ────────────────────────────────────── */}
            <EmiCalculator carPrice={car.price} />

            {/* ─── Quick Details ─────────────────────────────────────── */}
            <Card className="p-4 border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Building2 className="size-4 text-brand" />
                Quick Details
              </h3>
              <div className="text-xs text-slate-400 space-y-2">
                <p className="flex justify-between">
                  <span>Listed on</span>
                  <span className="text-slate-600">
                    {new Date(car.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Views</span>
                  <span className="text-slate-600">
                    {car.viewsCount} views
                  </span>
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
                {car.insuranceValidTill && (
                  <p className="flex justify-between">
                    <span>Insurance</span>
                    <span className="text-emerald-600 font-medium">Active</span>
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
