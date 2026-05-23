'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, isFullscreen])

  // Body scroll lock in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) handleNext()
      else handlePrev()
    }
  }

  const handleImageError = (idx: number) => {
    setFailedImages(prev => new Set(prev).add(idx))
  }

  if (!images || images.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-slate-100 group cursor-pointer select-none",
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none bg-black flex items-center justify-center"
            : "aspect-[16/10] md:aspect-[21/9] rounded-2xl"
        )}
        onClick={() => !isFullscreen && setIsFullscreen(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {failedImages.has(currentIndex) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-2">
                <ImageOff className="size-12 text-slate-300" />
                <span className="text-sm text-slate-400 font-medium">Image unavailable</span>
              </div>
            ) : (
              <Image
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className={cn("object-cover", isFullscreen && "object-contain")}
                priority={currentIndex === 0}
                sizes={isFullscreen ? "100vw" : "(max-width: 1200px) 100vw, 1200px"}
                onError={() => handleImageError(currentIndex)}
                unoptimized
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Overlays */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {/* Fullscreen Toggle & Close */}
        {isFullscreen ? (
          <button
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false) }}
            className="absolute top-6 right-6 size-12 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors z-20"
            aria-label="Close fullscreen"
          >
            <X className="size-6" />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(true) }}
            className="absolute top-4 right-4 size-10 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Fullscreen"
          >
            <Maximize2 className="size-5" />
          </button>
        )}

        {/* Badge */}
        {!isFullscreen && (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-xs font-semibold tracking-wider z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Swipe indicator (mobile) */}
        {!isFullscreen && images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1 z-10 md:hidden">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === currentIndex ? "w-4 bg-white" : "w-1 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {!isFullscreen && images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative h-16 w-24 md:h-20 md:w-32 shrink-0 rounded-xl overflow-hidden border-2 snap-start transition-all duration-200",
                currentIndex === idx
                  ? "border-brand shadow-md ring-1 ring-brand/30"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-200"
              )}
            >
              {failedImages.has(idx) ? (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                  <ImageOff className="size-4 text-slate-300" />
                </div>
              ) : (
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                  onError={() => handleImageError(idx)}
                  unoptimized
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
