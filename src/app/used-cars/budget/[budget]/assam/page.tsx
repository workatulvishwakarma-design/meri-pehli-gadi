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

// Prevent static prerendering — this is a dynamic route
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ budget: string }>
}): Promise<Metadata> {
  const p = await params
  const budgetParam = p.budget || ''
  const budgetVal = budgetParam.replace('-lakh', '')
  
  return {
    title: `Used Cars Under ₹${budgetVal} Lakh in Assam | MeriPehli Gadi`,
    description: `Find top verified used cars under ₹${budgetVal} Lakh in Assam. Get flexible finance options through Shani Finserve.`,
    keywords: [
      `used cars under ${budgetVal} lakh assam`,
      `budget cars assam`,
      `second hand cars under ${budgetVal} lakh`,
      'car finance assam',
    ],
  }
}

export default async function UsedCarsByBudgetInAssamPage({
  params,
  searchParams,
}: {
  params: Promise<{ budget: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const p = await params
  const s = await searchParams
  
  const budgetParam = p.budget || ''
  const budgetNum = parseInt(budgetParam.replace('-lakh', ''), 10)
  const budgetMax = !isNaN(budgetNum) ? budgetNum * 100000 : undefined
  
  // Parse Search Params
  const fuel = typeof s.fuel === 'string' ? s.fuel : Array.isArray(s.fuel) ? s.fuel[0] : undefined
  const transmission = typeof s.transmission === 'string' ? s.transmission : Array.isArray(s.transmission) ? s.transmission[0] : undefined
  const bodyType = typeof s.bodyType === 'string' ? s.bodyType : Array.isArray(s.bodyType) ? s.bodyType[0] : undefined
  const page = Number(s.page) || 1
  const sort = typeof s.sort === 'string' ? s.sort : 'newest'

  // Fetch Cached Data
  const { cars, total, totalPages } = await getCachedCars({
    citySlug: 'assam',
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

  const quickAnswer = `MeriPehli Gadi currently has ${total} verified used cars under ₹${budgetNum} Lakh available across Assam. Easily filter by brand or fuel type and secure an instant car loan.`

  const baseUrl = `/used-cars/budget/${budgetParam}/assam`
  const plainSearchParams = Object.fromEntries(
    Object.entries(s).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
  ) as Record<string, string | undefined>

  return (
    <MarketplacePageShell
      pageSlug={`budget-${budgetParam}`}
      pageTitle={`Used Cars Under ₹${budgetNum} Lakh in Assam`}
      pageSubtitle="Best Value Deals"
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
              title={`Used Cars Under ₹${budgetNum} Lakh in Assam`}
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
