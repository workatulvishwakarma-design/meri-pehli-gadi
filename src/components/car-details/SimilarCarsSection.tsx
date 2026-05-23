'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import CarCard from '@/components/shared/CarCard'

// ─── Types ──────────────────────────────────────────────────────────────

interface SimilarCarsSectionProps {
  cars: {
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
    images: string[]
    isCertified: boolean
    badge?: string | null
    isFinanceAvailable?: boolean
  }[]
}

// ─── Component ─────────────────────────────────────────────────────────

export function SimilarCarsSection({ cars }: SimilarCarsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!cars || cars.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">
          Similar Cars You May Like
        </h3>
        <Link
          href="/buy"
          className="text-sm font-semibold text-accent-orange hover:text-orange-600 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* ─── Scroll Container ─── */}
      <div className="relative group/scroll">
        {/* Navigation Arrows — desktop only */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:bg-white hover:shadow-xl transition-all opacity-0 group-hover/scroll:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-5 text-slate-600" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:bg-white hover:shadow-xl transition-all opacity-0 group-hover/scroll:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5 text-slate-600" />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {cars.map((car) => (
            <div
              key={car.id}
              className="snap-start shrink-0 min-w-[280px] max-w-[300px]"
            >
              <CarCard car={car} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
