'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Gauge, Fuel, Settings2, Shield, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ──────────────────────────────────────────────────────────────

interface CarCardProps {
  car: {
    id: string
    title: string
    brand: string
    model: string
    year: number
    price: number
    emiPrice?: number | null
    kmDriven: number
    fuelType: string
    transmission: string
    ownerType: string
    city: string
    badge?: string | null
    images: string[]
    isCertified: boolean
    conditionScore?: number | null
    trustScore?: number | null
    color?: string | null
    bodyType?: string | null
    isFinanceAvailable?: boolean
    viewsCount?: number
    dealerName?: string | null
  }
  variant?: 'default' | 'compact'
  priority?: boolean
}

// ─── Helpers ────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`
  }
  return `₹${price.toLocaleString('en-IN')}`
}

function capitalize(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function formatOwner(owner: string): string {
  if (!owner) return ''
  const lower = owner.toLowerCase()
  if (lower === 'first') return '1st Owner'
  if (lower === 'second') return '2nd Owner'
  if (lower === 'third') return '3rd Owner'
  return '4th+ Owner'
}

function formatKm(km: number): string {
  if (km >= 100000) {
    return `${(km / 1000).toFixed(0)}k km`
  }
  return `${(km / 1000).toFixed(1)}k km`
}

function formatEmi(emi: number): string {
  return `₹${Math.round(emi).toLocaleString('en-IN')}`
}

function getBadgeStyles(badge: string | null | undefined): string {
  if (!badge) return ''
  const lower = badge.toLowerCase()
  if (lower.includes('certified')) return 'bg-emerald-500 text-white'
  if (lower.includes('new arrival')) return 'bg-blue-500 text-white'
  if (lower.includes('great price')) return 'bg-amber-500 text-white'
  if (lower.includes('low mileage')) return 'bg-teal-500 text-white'
  if (lower.includes('finance')) return 'bg-purple-500 text-white'
  if (lower.includes('luxury')) return 'bg-slate-700 text-white'
  if (lower.includes('best family')) return 'bg-rose-500 text-white'
  if (lower.includes('budget')) return 'bg-green-500 text-white'
  if (lower.includes('hot') || lower.includes('top')) return 'bg-red-500 text-white'
  return 'bg-violet-500 text-white'
}

// ─── Component ─────────────────────────────────────────────────────────

export default function CarCard({ car, variant = 'default', priority = false }: CarCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const carImage = car.images?.[0] || ''
  const isCompact = variant === 'compact'

  return (
    <motion.div
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="h-full group relative"
    >
      <Card className="relative overflow-hidden rounded-16 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-soft hover:shadow-premium hover:bg-white transition-all duration-300 h-full flex flex-col p-0 gap-0">
        <Link href={`/car/${car.id}`} className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">View {car.title}</span>
        </Link>
        {/* ─── Image Section ─── */}
        <div className="relative overflow-hidden">
          {/* 16:10 Aspect Ratio Container */}
          <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
            {carImage ? (
              <Image
                src={carImage}
                alt={car.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                loading={priority ? undefined : 'lazy'}
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-300">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M7 17v2m10-2v2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Badge - Top Left */}
          {(car.badge || car.isCertified) && (
            <div className="absolute top-3 left-3 z-10">
              {car.isCertified ? (
                <Badge className="bg-emerald-500 text-white border-0 gap-1 text-[11px] font-semibold px-2.5 py-0.5 shadow-sm">
                  <Shield className="size-3" />
                  Certified
                </Badge>
              ) : (
                <Badge className={`border-0 text-[11px] font-semibold px-2.5 py-0.5 shadow-sm ${getBadgeStyles(car.badge)}`}>
                  {car.badge}
                </Badge>
              )}
            </div>
          )}

          {/* Heart Icon - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 z-20 size-8 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white hover:shadow-lg transition-all"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`size-4 transition-all duration-200 ${
                isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-400'
              }`}
            />
          </button>

          {/* Image overlay gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>

        {/* ─── Content Body ─── */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-slate-800 leading-tight line-clamp-2">
              {car.title}
            </h3>
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0 mt-0.5">
              {car.year}
            </span>
          </div>

          {/* Specs Row with dot separators */}
          <div className="flex items-center gap-0 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Gauge className="size-3 text-slate-400" />
              {formatKm(car.kmDriven)}
            </span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Fuel className="size-3 text-slate-400" />
              {capitalize(car.fuelType)}
            </span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Settings2 className="size-3 text-slate-400" />
              {capitalize(car.transmission)}
            </span>
          </div>

          {/* Location + Owner */}
          <div className="flex items-center gap-0 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {car.city}
            </span>
            {car.ownerType && (
              <>
                <span className="mx-1.5 text-slate-200">•</span>
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {formatOwner(car.ownerType)}
                </span>
              </>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price Section */}
          <div className="pt-2.5 border-t border-slate-100">
            <p className="text-lg font-bold text-brand leading-tight">
              {formatPrice(car.price)}
            </p>
            {car.emiPrice && (
              <p className="text-xs text-slate-500 mt-0.5">
                EMI starts {formatEmi(car.emiPrice)}/month
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {!isCompact && (
            <div className="flex gap-2 pt-1 relative z-20">
              <Button
                size="sm"
                className="flex-1 bg-brand hover:bg-brand-light text-white text-xs h-8 rounded-lg pointer-events-none"
                tabIndex={-1}
              >
                View Details
              </Button>
              {car.isFinanceAvailable && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 rounded-lg border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigateTo('finance', { carId: car.id })
                  }}
                >
                  Get Finance
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
