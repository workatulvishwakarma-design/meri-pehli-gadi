'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle className="size-16 text-red-500" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Something went wrong!</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error occurred while loading this page. Our team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          className="bg-brand hover:bg-brand/90 text-white font-bold h-12 px-8 rounded-12 shadow-md"
        >
          Try again
        </Button>
        <Link href="/">
          <Button 
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold h-12 px-8 rounded-12 flex items-center gap-2 w-full"
          >
            <Home className="size-4" />
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  )
}
