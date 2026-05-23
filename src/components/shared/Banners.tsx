import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BANNER_IMAGES } from '@/lib/images/car-image-map'

interface BannerProps {
  type?: 'home' | 'city' | 'finance' | 'insurance'
  index?: number // To force a specific banner
  className?: string
}

export default function Banner({ type = 'home', index, className = '' }: BannerProps) {
  // Use specific banner based on type if needed, otherwise random/index
  let imageIndex = index !== undefined ? index % BANNER_IMAGES.length : 0
  
  if (type === 'finance') imageIndex = 3 // Assuming 4th banner is finance related
  if (type === 'insurance') imageIndex = 4
  if (type === 'city') imageIndex = 1

  const bannerSrc = BANNER_IMAGES[imageIndex]

  return (
    <div className={`relative w-full overflow-hidden rounded-[20px] shadow-lg ${className}`}>
      <div className="relative aspect-[21/9] md:aspect-[32/9] bg-slate-900 w-full h-full">
        <Image
          src={bannerSrc}
          alt={`Promotional Banner for ${type}`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Soft shadow overlay for premium feel without text */}
        <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />
      </div>
    </div>
  )
}
