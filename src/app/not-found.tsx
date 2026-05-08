import React from 'react'
import Link from 'next/link'
import { Car, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8">
        <Car className="w-12 h-12 text-orange-600" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
        404 - Page Not Found
      </h1>
      
      <p className="text-lg text-slate-600 max-w-md text-center mb-8">
        Oops! The page or car you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-brand hover:bg-brand-dark text-white rounded-full px-8">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-slate-300 text-slate-700 hover:bg-slate-100">
          <Link href="/used-cars">
            <Search className="w-4 h-4 mr-2" />
            Explore Cars in Assam
          </Link>
        </Button>
      </div>
    </div>
  )
}
