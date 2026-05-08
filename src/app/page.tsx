import React from 'react'
import type { Metadata } from 'next'
import { getCachedFeaturedCars, getCachedTrendingCars, getCachedCars } from '@/lib/cache/cars-cache'
import HomePage from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: 'MeriPehli Gadi - Buy, Sell, Finance & Insure Used Cars in Assam',
  description: 'Find the best verified used cars in Assam. Certified pre-owned cars with easy finance, insurance, and test drive support. Powered by Shani Finserve.',
  keywords: [
    'used cars Assam', 'buy used car Guwahati', 'sell car Dibrugarh',
    'used car loan Assam', 'car insurance Assam', 'MeriPehli Gadi',
    'certified used cars Assam', 'second hand cars Guwahati',
  ],
}

// Server-side data fetching for SEO
async function getHomePageData() {
  const [featuredCars, trendingCars, guwahatiData, dibrugarhData, tezpurData, tinsukiaData] = await Promise.all([
    getCachedFeaturedCars(8),
    getCachedTrendingCars(8),
    getCachedCars({ citySlug: 'guwahati', limit: 4 }),
    getCachedCars({ citySlug: 'dibrugarh', limit: 4 }),
    getCachedCars({ citySlug: 'tezpur', limit: 4 }),
    getCachedCars({ citySlug: 'tinsukia', limit: 4 }),
  ])

  return {
    featuredCars,
    trendingCars,
    cityData: {
      guwahati: guwahatiData.cars,
      dibrugarh: dibrugarhData.cars,
      tezpur: tezpurData.cars,
      tinsukia: tinsukiaData.cars,
    }
  }
}

export default async function Home() {
  const data = await getHomePageData()
  
  return <HomePage ssrData={data} />
}
