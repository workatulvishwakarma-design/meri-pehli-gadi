import { Metadata } from 'next'
import { CarService } from '@/lib/services/car.service'
import CarGrid from '@/components/shared/CarGrid'
import InternalLinks from '@/components/seo/InternalLinks'
import { Search as SearchIcon } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    q?: string
    brand?: string
    city?: string
    budget?: string
    bodyType?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: 'Search Used Cars in Assam | MeriPehli Gadi',
  description: 'Search and filter the best certified used cars in Assam. Find cars by budget, brand, body type, and city.',
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams
  
  const page = Number(sp.page) || 1
  const search = sp.q
  const brandSlug = sp.brand
  const citySlug = sp.city
  const bodyType = sp.bodyType
  
  let budgetMin = undefined
  let budgetMax = undefined
  
  if (sp.budget === 'under-2-lakh') budgetMax = 200000
  if (sp.budget === 'under-5-lakh') budgetMax = 500000
  if (sp.budget === 'under-10-lakh') budgetMax = 1000000

  const { cars, total, totalPages } = await CarService.getCars({ 
    search,
    brandSlug,
    citySlug,
    bodyType,
    budgetMin,
    budgetMax,
    page, 
    limit: 12 
  })

  return (
    <main className="bg-slate-50 min-h-screen pb-12 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
              <SearchIcon className="w-6 h-6 text-brand" />
              Search Results
            </h1>
            <p className="text-slate-500 mt-1">
              {search && `Results for "${search}"`}
            </p>
          </div>
          <div className="text-sm font-semibold bg-slate-100 text-slate-600 px-4 py-2 rounded-lg">
            {total} Cars Found
          </div>
        </div>

        <CarGrid 
          cars={cars} 
          totalPages={totalPages} 
          currentPage={page} 
          emptyMessage="No cars matched your exact search criteria. Try adjusting your filters or search terms."
        />
      </div>

      <InternalLinks />
    </main>
  )
}
