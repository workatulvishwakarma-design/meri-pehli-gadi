'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Gauge, Fuel, Settings2, Shield, BadgeIndianRupee } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import Image from 'next/image'

interface CarCardProps {
  car: {
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
  variant?: 'default' | 'compact' | 'featured'
}

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`
  }
  return `₹${price.toLocaleString('en-IN')}`
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

function getBadgeColor(badge: string | null | undefined): string {
  if (!badge) return ''
  const lower = badge.toLowerCase()
  if (lower.includes('certified')) return 'bg-emerald-500 text-white'
  if (lower.includes('low') && lower.includes('mileage')) return 'bg-blue-500 text-white'
  if (lower.includes('great') && lower.includes('price')) return 'bg-green-500 text-white'
  if (lower.includes('top')) return 'bg-orange-500 text-white'
  if (lower.includes('hot')) return 'bg-red-500 text-white'
  if (lower.includes('new')) return 'bg-sky-500 text-white'
  return 'bg-purple-500 text-white'
}

export default function CarCard({ car, variant = 'default' }: CarCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const carImage = car.images?.[0] || `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(car.title)}`

  const isCompact = variant === 'compact'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm car-card-hover h-full flex flex-col p-0 gap-0">
        {/* Image Section */}
        <div className="relative group">
          <div className="relative overflow-hidden aspect-[16/10]">
            <Image
              src={carImage}
              alt={car.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>

          {/* Certified Overlay */}
          {car.isCertified && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-emerald-500 text-white border-0 gap-1 text-[11px] font-semibold px-2 py-0.5">
                <Shield className="size-3" />
                Certified
              </Badge>
            </div>
          )}

          {/* Badge */}
          {car.badge && !car.isCertified && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className={`border-0 text-[11px] font-semibold px-2 py-0.5 ${getBadgeColor(car.badge)}`}>
                {car.badge}
              </Badge>
            </div>
          )}

          {/* Finance Badge */}
          {car.isFinanceAvailable && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge className="bg-blue-500 text-white border-0 gap-1 text-[10px] px-1.5 py-0.5">
                <BadgeIndianRupee className="size-3" />
                Finance Available
              </Badge>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-2 right-2 z-10 size-8 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
          >
            <Heart
              className={`size-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
          </button>

          {/* Featured ribbon for featured cars */}
          {car.isFeatured && (
            <div className="absolute top-0 right-0 z-0">
              <div className="w-0 h-0 border-t-[40px] border-t-orange-500 border-l-[40px] border-l-transparent" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 gap-2">
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-slate-800 leading-tight line-clamp-2">
              {car.title}
            </h3>
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0">
              {car.year}
            </span>
          </div>

          {/* Specs Row */}
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Gauge className="size-3 text-slate-400" />
              {formatKm(car.kmDriven)}
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="size-3 text-slate-400" />
              {car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}
            </span>
            <span className="flex items-center gap-1">
              <Settings2 className="size-3 text-slate-400" />
              {car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}
            </span>
          </div>

          {/* Owner Type */}
          {car.ownerType && (
            <span className="text-[11px] text-slate-400 capitalize">
              {car.ownerType} Owner
            </span>
          )}

          {/* City */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="size-3" />
            <span>{car.city}</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="pt-1 border-t border-slate-100">
            <p className="text-lg font-bold text-brand">
              {formatPrice(car.price)}
            </p>
            {car.emiPrice && (
              <p className="text-[11px] text-slate-500">
                EMI starts {formatEmi(car.emiPrice)}/month
              </p>
            )}
          </div>

          {/* Actions */}
          {!isCompact && (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 bg-brand hover:bg-brand-light text-white text-xs h-8 rounded-lg"
                onClick={() => navigateTo('car-details', { id: car.id })}
              >
                View Details
              </Button>
              {car.isFinanceAvailable && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={(e) => {
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
