import { Metadata } from 'next'
import { getCachedCars, getCachedCityData, getCachedTrendingCars } from '@/lib/cache/cars-cache'
import { URLFilterSidebar } from '@/components/seo/URLFilterSidebar'
import MarketplacePageShell from '@/components/shared/MarketplacePageShell'
import {
  QuickAnswerBox,
  LocalTrustBlock,
  FinanceCTA,
  InsuranceCTA,
  AIReadableSummary
} from '@/components/seo/SEOComponents'
import { CAR_BRANDS, BUDGET_RANGES, getQuickAnswer } from '@/lib/seo-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const p = await params
  const citySlug = p.city
  const cityData = await getCachedCityData(citySlug)

  const cityName = cityData ? cityData.name : citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  
  const title = citySlug === 'assam' 
    ? "Used Cars in Assam | Buy Verified Second Hand Cars | MeriPehli Gadi"
    : `Used Cars in ${cityName}, Assam | Buy Verified Second Hand Cars`
  
  const description = cityData?.metaDescription || 
    `Buy verified used cars in ${cityName}, Assam with easy finance, insurance, test drive and local guidance. MeriPehli Gadi — Assam's trusted car marketplace powered by Shani Finserve.`

  return {
    title,
    description,
    keywords: [
      'used cars assam',
      `used cars ${cityName}`,
      `second hand cars ${cityName}`,
      `car finance ${cityName}`,
      'meri pehli gadi',
      'verified used cars',
      'Shani Finserve',
    ],
  }
}

export default async function UsedCarsInCityPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const p = await params
  const s = await searchParams
  
  const citySlug = p.city
  
  // Parse Search Params
  const budgetMin = Number(s.budgetMin) || undefined
  const budgetMax = Number(s.budgetMax) || undefined
  const fuel = typeof s.fuel === 'string' ? s.fuel : Array.isArray(s.fuel) ? s.fuel[0] : undefined
  const transmission = typeof s.transmission === 'string' ? s.transmission : Array.isArray(s.transmission) ? s.transmission[0] : undefined
  const bodyType = typeof s.bodyType === 'string' ? s.bodyType : Array.isArray(s.bodyType) ? s.bodyType[0] : undefined
  const page = Number(s.page) || 1
  const sort = typeof s.sort === 'string' ? s.sort : 'newest'

  // Fetch Cached Data
  const { cars, total, totalPages } = await getCachedCars({
    citySlug,
    budgetMin,
    budgetMax,
    fuelType: fuel,
    transmission,
    bodyType,
    page,
    sort,
    limit: 12,
  })

  // Fallback Engine
  let displayCars = cars
  let isFallback = false
  if (total === 0 && citySlug !== 'assam') {
    const fallback = await getCachedCars({
      citySlug: 'assam',
      limit: 6,
    })
    displayCars = fallback.cars
    isFallback = true
  }

  // Fetch trending cars for the explore section
  const trendingCars = await getCachedTrendingCars(8)

  const cityNameFormatted = citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  // Generate SEO Content
  const quickAnswer = getQuickAnswer('used-cars', citySlug) || 
    `MeriPehli Gadi lists ${total}+ verified used cars in ${cityNameFormatted} across all brands, budgets and body types with easy finance, insurance and test drive support.`

  const baseUrl = `/used-cars/in/${citySlug}`
  const plainSearchParams = Object.fromEntries(
    Object.entries(s).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
  ) as Record<string, string | undefined>

  return (
    <MarketplacePageShell
      pageSlug={citySlug}
      pageTitle={`Used Cars in ${citySlug === 'assam' ? 'Assam' : cityNameFormatted}`}
      pageSubtitle="100% Verified Cars"
      cars={displayCars}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      isFallback={isFallback}
      trendingCars={trendingCars}
      baseUrl={baseUrl}
      searchParams={plainSearchParams}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* URL-driven Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 -mt-2">
          <URLFilterSidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="mb-6">
            <QuickAnswerBox text={quickAnswer} />
          </div>

          {/* Children content renders before grid inside Shell, but here we want grid after, 
              wait Shell puts children before grid. That's fine. */}
          
          {/* SEO & Trust Blocks */}
          <div className="mt-12 space-y-8 pb-10">
            <LocalTrustBlock cityName={cityNameFormatted} />
            <div className="grid md:grid-cols-2 gap-6">
              <FinanceCTA />
              <InsuranceCTA />
            </div>
            <AIReadableSummary
              title={`Used Cars in ${cityNameFormatted}`}
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
