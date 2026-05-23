import React from 'react'
import type { Metadata } from 'next'
import { CarService } from '@/lib/services/car.service'
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

// Server-side data fetching for SEO — gracefully degrades if DB is unavailable
async function getHomePageData() {
  try {
    const [
      featuredCars, 
      trendingCars, 
      guwahatiData, 
      dibrugarhData, 
      tezpurData, 
      tinsukiaData,
      budgetCars
    ] = await Promise.all([
      CarService.getFeaturedCars(8),
      CarService.getTrendingCars(8),
      CarService.getCars({ citySlug: 'guwahati', limit: 4 }),
      CarService.getCars({ citySlug: 'dibrugarh', limit: 4 }),
      CarService.getCars({ citySlug: 'tezpur', limit: 4 }),
      CarService.getCars({ citySlug: 'tinsukia', limit: 4 }),
      CarService.getCars({ budgetMax: 500000, limit: 8 }),
    ])

    return {
      featuredCars,
      trendingCars,
      budgetCars: budgetCars.cars,
      cityData: {
        guwahati: guwahatiData.cars,
        dibrugarh: dibrugarhData.cars,
        tezpur: tezpurData.cars,
        tinsukia: tinsukiaData.cars,
      }
    }
  } catch (error) {
    console.error('[homepage] Database unavailable:', error)
    return {
      featuredCars: [],
      trendingCars: [],
      budgetCars: [],
      cityData: {},
    }
  }
}

export default async function Home() {
  const data = await getHomePageData()
  
  return <HomePage ssrData={data} />
}
