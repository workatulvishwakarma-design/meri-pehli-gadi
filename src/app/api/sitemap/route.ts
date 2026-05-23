import { NextResponse } from 'next/server'
import {
  SITE_URL,
  ASSAM_CITIES,
  CAR_BRANDS,
  BUDGET_RANGES,
  FUEL_SLUGS,
  BODY_SLUGS,
  TRANSMISSION_SLUGS,
  FINANCE_PAGES,
  INSURANCE_PAGES,
  SELL_CAR_PAGES,
} from '@/lib/seo-data'

interface SitemapEntry {
  loc: string
  lastmod: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: string
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function entry(path: string, changefreq: SitemapEntry['changefreq'], priority: string): SitemapEntry {
  return {
    loc: `${SITE_URL}/${path}`,
    lastmod: today(),
    changefreq,
    priority,
  }
}

export async function GET() {
  const urls: SitemapEntry[] = []

  // ─── Homepage ────────────────────────────────────────
  urls.push({ ...entry('', 'daily', '1.0'), loc: SITE_URL })

  // ─── Used Cars in Cities (22 cities) ─────────────────
  for (const city of ASSAM_CITIES) {
    urls.push(entry(`used-cars/in/${city.slug}`, 'weekly', '0.9'))
  }

  // ─── Used Cars by Brand (15 brands) ──────────────────
  for (const brand of CAR_BRANDS) {
    urls.push(entry(`used-cars/brand/${brand.slug}/assam`, 'weekly', '0.8'))
  }

  // ─── Used Cars by Budget (8 ranges) ──────────────────
  for (const budget of BUDGET_RANGES) {
    urls.push(entry(`used-cars/budget/${budget.slug}/assam`, 'weekly', '0.8'))
  }

  // ─── Finance Pages (5 pages) ─────────────────────────
  for (const page of FINANCE_PAGES) {
    urls.push(entry(`finance/${page.slug}`, 'monthly', '0.7'))
  }

  // ─── Insurance Pages (4 pages) ───────────────────────
  for (const page of INSURANCE_PAGES) {
    urls.push(entry(`insurance/${page.slug}`, 'monthly', '0.7'))
  }

  // ─── Sell Car Pages (4 pages) ────────────────────────
  for (const page of SELL_CAR_PAGES) {
    urls.push(entry(`sell-car/${page.slug}`, 'monthly', '0.7'))
  }

  // ─── Fuel Type Pages (5 types) ───────────────────────
  for (const fuel of FUEL_SLUGS) {
    urls.push(entry(`used-cars/fuel/${fuel}/assam`, 'weekly', '0.7'))
  }

  // ─── Body Type Pages (8 types) ───────────────────────
  for (const body of BODY_SLUGS) {
    urls.push(entry(`used-cars/type/${body}/assam`, 'weekly', '0.7'))
  }

  // ─── Transmission Pages (2 types) ────────────────────
  for (const trans of TRANSMISSION_SLUGS) {
    urls.push(entry(`used-cars/transmission/${trans}/assam`, 'weekly', '0.7'))
  }

  // ─── Blog ────────────────────────────────────────────
  urls.push(entry('blog', 'weekly', '0.7'))

  // ─── Static Pages ────────────────────────────────────
  urls.push(entry('about', 'monthly', '0.6'))
  urls.push(entry('contact', 'monthly', '0.6'))
  urls.push(entry('faq', 'monthly', '0.6'))

  // ─── Build XML ───────────────────────────────────────
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  })
}
