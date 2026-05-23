'use client'

import React, { useState } from 'react'
import CarCard from './CarCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Car } from 'lucide-react'

interface CarGridProps {
  cars: any[]
  total?: number
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  emptyMessage?: string
}

export default function CarGrid({
  cars,
  total,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  emptyMessage = 'No cars found matching your criteria.'
}: CarGridProps) {
  if (!cars || cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <Car className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">No Cars Found</h3>
        <p className="text-slate-500 max-w-md">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car, index) => (
          <CarCard 
            key={car.id || index} 
            car={car} 
            priority={index < 4} // priority load first 4 images 
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-100">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-full w-10 h-10 border-slate-200 text-slate-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              // Simple pagination display logic
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 rounded-full font-semibold ${
                      currentPage === pageNum 
                        ? 'bg-brand text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="px-2 text-slate-400">...</span>
              }
              return null
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-full w-10 h-10 border-slate-200 text-slate-600"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
