import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, Search } from 'lucide-react'

export default function CarNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="bg-brand/10 p-6 rounded-full mb-6">
        <Car className="size-16 text-brand" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Car Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We couldn't find the car you're looking for. It may have been sold or removed from our inventory.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/used-cars">
          <Button 
            className="bg-brand hover:bg-brand/90 text-white font-bold h-12 px-8 rounded-12 shadow-md flex items-center gap-2 w-full"
          >
            <Search className="size-4" />
            Browse Other Cars
          </Button>
        </Link>
      </div>
    </div>
  )
}
