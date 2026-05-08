import { Metadata } from 'next'
import { getCachedCars, getCachedTrendingCars } from '@/lib/cache/cars-cache'
import { URLFilterSidebar } from '@/components/seo/URLFilterSidebar'
import MarketplacePageShell from '@/components/shared/MarketplacePageShell'
import {
  QuickAnswerBox,
  LocalTrustBlock,
  FinanceCTA,
  InsuranceCTA,
  AIReadableSummary
} from '@/components/seo/SEOComponents'
import { CAR_BRANDS, BUDGET_RANGES } from '@/lib/seo-data'

export const metadata: Metadata = {
  title: 'Used Cars in Assam | Certified Pre-Owned Cars | MeriPehli Gadi',
  description: 'Browse thousands of verified used cars across Assam. Find the best deals on second-hand cars with easy EMI, trusted inspection, and warranties at MeriPehli Gadi.',
}

export default async function UsedCarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const s = await searchParams
  
  // Parse Search Params
  const budgetMin = Number(s.budgetMin) || undefined
  const budgetMax = Number(s.budgetMax) || undefined
  const fuel = typeof s.fuel === 'string' ? s.fuel : Array.isArray(s.fuel) ? s.fuel[0] : undefined
  const transmission = typeof s.transmission === 'string' ? s.transmission : Array.isArray(s.transmission) ? s.transmission[0] : undefined
  const bodyType = typeof s.bodyType === 'string' ? s.bodyType : Array.isArray(s.bodyType) ? s.bodyType[0] : undefined
  const page = Number(s.page) || 1
  const sort = typeof s.sort === 'string' ? s.sort : 'newest'
  const brand = typeof s.brand === 'string' ? s.brand : undefined

  // Fetch Cached Data
  const { cars, total, totalPages } = await getCachedCars({
    citySlug: 'assam',
    budgetMin,
    budgetMax,
    fuelType: fuel,
    transmission,
    bodyType,
    brandSlug: brand,
    page,
    sort,
    limit: 12,
  })

  // Fetch trending cars for the explore section if empty
  const trendingCars = await getCachedTrendingCars(8)

  const quickAnswer = `MeriPehli Gadi lists ${total}+ verified used cars across Assam with easy finance, insurance and test drive support.`

  const baseUrl = '/used-cars'
  const plainSearchParams = Object.fromEntries(
    Object.entries(s).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
  ) as Record<string, string | undefined>

  return (
    <MarketplacePageShell
      pageSlug="used-cars-main"
      pageTitle="Used Cars in Assam"
      pageSubtitle="Certified Pre-Owned Cars"
      cars={cars}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      trendingCars={trendingCars}
      baseUrl={baseUrl}
      searchParams={plainSearchParams}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block w-64 shrink-0 -mt-2">
          <URLFilterSidebar />
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <QuickAnswerBox text={quickAnswer} />
          </div>

          <div className="mt-12 space-y-8 pb-10">
            <LocalTrustBlock cityName="Assam" />
            <div className="grid md:grid-cols-2 gap-6">
              <FinanceCTA />
              <InsuranceCTA />
            </div>
            <AIReadableSummary
              title="Used Cars in Assam"
              totalCars={total}
              brands={CAR_BRANDS.map((b) => b.name)}
              budgetRanges={BUDGET_RANGES.map((b) => b.label)}
            />
          </div>
        </main>
      </div>
    </MarketplacePageShell>
  )
}
