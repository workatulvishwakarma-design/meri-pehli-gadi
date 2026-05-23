import { Metadata } from 'next'
import { getCachedCars, getCachedBrandData, getCachedTrendingCars } from '@/lib/cache/cars-cache'
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

// Prevent static prerendering — this is a dynamic route
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>
}): Promise<Metadata> {
  const p = await params
  const brandSlug = p.brand || ''
  const brandData = await getCachedBrandData(brandSlug)

  const brandName = brandData ? brandData.name : brandSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  
  return {
    title: `Used ${brandName} Cars in Assam | Certified Second Hand ${brandName} | MeriPehli Gadi`,
    description: `Find certified used ${brandName} cars in Assam. Compare prices, explore finance options, and get easy insurance with MeriPehli Gadi powered by Shani Finserve.`,
    keywords: [
      `used ${brandName} cars assam`,
      `second hand ${brandName} assam`,
      `buy used ${brandName}`,
      'car finance assam',
      'meri pehli gadi',
    ],
  }
}

export default async function UsedBrandCarsInAssamPage({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const p = await params
  const s = await searchParams
  
  const brandSlug = p.brand || ''
  
  // Parse Search Params
  const budgetMin = Number(s.budgetMin) || undefined
  const budgetMax = Number(s.budgetMax) || undefined
  const fuel = typeof s.fuel === 'string' ? s.fuel : Array.isArray(s.fuel) ? s.fuel[0] : undefined
  const transmission = typeof s.transmission === 'string' ? s.transmission : Array.isArray(s.transmission) ? s.transmission[0] : undefined
  const bodyType = typeof s.bodyType === 'string' ? s.bodyType : Array.isArray(s.bodyType) ? s.bodyType[0] : undefined
  const page = Number(s.page) || 1
  const sort = typeof s.sort === 'string' ? s.sort : 'newest'

  // Fetch Cached Data specifically for this brand across Assam
  const { cars, total, totalPages } = await getCachedCars({
    citySlug: 'assam',
    brandSlug,
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
  if (total === 0) {
    const fallback = await getCachedCars({
      citySlug: 'assam',
      limit: 6,
    })
    displayCars = fallback.cars
    isFallback = true
  }

  // Fetch trending cars for the explore section
  const trendingCars = await getCachedTrendingCars(8)

  const brandNameFormatted = brandSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  // Generate SEO Content
  const quickAnswer = `MeriPehli Gadi currently has ${total} verified used ${brandNameFormatted} cars available across Assam. Filter by your budget, test drive, and easily secure a car loan through Shani Finserve.`

  const baseUrl = `/used-cars/brand/${brandSlug}/assam`
  const plainSearchParams = Object.fromEntries(
    Object.entries(s).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
  ) as Record<string, string | undefined>

  return (
    <MarketplacePageShell
      pageSlug={`brand-${brandSlug}`}
      pageTitle={`Used ${brandNameFormatted} Cars in Assam`}
      pageSubtitle="Certified by Experts"
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
              title={`Used ${brandNameFormatted} Cars in Assam`}
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
