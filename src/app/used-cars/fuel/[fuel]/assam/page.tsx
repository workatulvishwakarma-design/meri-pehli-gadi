import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCachedCars } from '@/lib/cache/cars-cache'
import { URLFilterSidebar } from '@/components/seo/URLFilterSidebar'
import CarCard from '@/components/shared/CarCard'
import {
  QuickAnswerBox,
  LocalTrustBlock,
  FinanceCTA,
  InsuranceCTA,
  AIReadableSummary
} from '@/components/seo/SEOComponents'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fuel: string }>
}): Promise<Metadata> {
  const p = await params
  const fuelParam = p.fuel
  const fuelName = fuelParam.toUpperCase()
  
  return {
    title: `Used ${fuelName} Cars in Assam | Certified Second Hand ${fuelName} Cars | MeriPehli Gadi`,
    description: `Find top verified used ${fuelName} cars in Assam. Get flexible finance options through Shani Finserve.`,
    keywords: [
      `used ${fuelName.toLowerCase()} cars assam`,
      `second hand ${fuelName.toLowerCase()} cars`,
      'car finance assam',
    ],
  }
}

export default async function UsedCarsByFuelInAssamPage({
  params,
  searchParams,
}: {
  params: Promise<{ fuel: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const p = await params
  const s = await searchParams
  
  const fuelParam = p.fuel.toUpperCase()
  
  // Parse Search Params
  const budgetMin = Number(s.budgetMin) || undefined
  const budgetMax = Number(s.budgetMax) || undefined
  const transmission = typeof s.transmission === 'string' ? s.transmission : Array.isArray(s.transmission) ? s.transmission[0] : undefined
  const bodyType = typeof s.bodyType === 'string' ? s.bodyType : Array.isArray(s.bodyType) ? s.bodyType[0] : undefined
  const page = Number(s.page) || 1
  const sort = typeof s.sort === 'string' ? s.sort : 'newest'

  // Fetch Cached Data
  const { cars, total, totalPages } = await getCachedCars({
    citySlug: 'assam',
    fuelType: fuelParam,
    budgetMin,
    budgetMax,
    transmission,
    bodyType,
    page,
    sort,
    limit: 12,
  })

  const quickAnswer = `MeriPehli Gadi currently has ${total} verified used ${fuelParam} cars available across Assam. Easily filter by brand or budget and secure an instant car loan.`

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Used {fuelParam} Cars in Assam
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {total} {total === 1 ? 'car' : 'cars'} found matching your criteria
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <URLFilterSidebar />
          </aside>

          <main className="flex-1">
            <div className="mb-8">
              <QuickAnswerBox text={quickAnswer} />
            </div>

            {total > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car: any) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No {fuelParam} cars found</h3>
                  <p className="text-slate-500 mb-6">
                    We couldn't find cars matching this fuel type. Check out other cars in Assam.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <a href="/used-cars/in/assam" className="inline-flex justify-center items-center px-4 py-2 bg-brand text-white rounded-md font-medium hover:bg-brand/90 transition-colors">
                      Browse All Cars in Assam
                    </a>
                  </div>
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <a
                    key={i}
                    href={`?page=${i + 1}`}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${page === i + 1 ? 'bg-brand text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-12 space-y-8">
              <LocalTrustBlock cityName="Assam" />
              <div className="grid md:grid-cols-2 gap-6">
                <FinanceCTA />
                <InsuranceCTA />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
