import React from 'react'
import { Car } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="relative">
        <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Car className="w-10 h-10 text-brand" />
        </div>
        {/* Spinner ring around the car */}
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-brand rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Loading...
      </h2>
      <p className="text-sm text-slate-500">
        Finding the best cars for you
      </p>
    </div>
  )
}
