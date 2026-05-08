'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  if (!images || images.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div 
        className={cn(
          "relative w-full overflow-hidden bg-slate-100 rounded-20 group cursor-pointer",
          isFullscreen ? "fixed inset-0 z-50 rounded-none bg-black flex items-center justify-center" : "aspect-[16/10] md:aspect-[21/9]"
        )}
        onClick={() => !isFullscreen && setIsFullscreen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className={cn("object-cover", isFullscreen && "object-contain")}
              priority={currentIndex === 0}
              sizes={isFullscreen ? "100vw" : "(max-width: 1200px) 100vw, 1200px"}
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Overlays */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        {/* Fullscreen Toggle & Close */}
        {isFullscreen ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFullscreen(false)
            }}
            className="absolute top-6 right-6 size-12 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <X className="size-6" />
          </button>
        ) : (
          <button className="absolute top-4 right-4 size-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100">
            <Maximize2 className="size-5" />
          </button>
        )}

        {/* Badge */}
        {!isFullscreen && (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-xs font-semibold tracking-wider">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {!isFullscreen && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative h-20 w-32 shrink-0 rounded-12 overflow-hidden border-2 snap-start transition-all",
                currentIndex === idx ? "border-brand shadow-soft" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="128px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
