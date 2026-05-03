'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAppStore, PageName } from '@/lib/store'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CityModal } from '@/components/layout/CityModal'
import { AuthModal } from '@/components/layout/AuthModal'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'

// Lazy load all page components to reduce initial compilation memory
const HomePage = dynamic(() => import('@/components/pages/HomePage'))
const UsedCarsPage = dynamic(() => import('@/components/pages/UsedCarsPage').then(m => ({ default: m.UsedCarsPage })))
const CarDetailsPage = dynamic(() => import('@/components/pages/CarDetailsPage').then(m => ({ default: m.CarDetailsPage })))
const SellCarPage = dynamic(() => import('@/components/pages/SellCarPage').then(m => ({ default: m.SellCarPage })))
const FinancePage = dynamic(() => import('@/components/pages/FinancePage').then(m => ({ default: m.FinancePage })))
const InsurancePage = dynamic(() => import('@/components/pages/InsurancePage').then(m => ({ default: m.InsurancePage })))
const AboutPage = dynamic(() => import('@/components/pages/AboutPage').then(m => ({ default: m.AboutPage })))
const ContactPage = dynamic(() => import('@/components/pages/ContactPage').then(m => ({ default: m.ContactPage })))
const FAQPage = dynamic(() => import('@/components/pages/FAQPage').then(m => ({ default: m.FAQPage })))
const BlogPage = dynamic(() => import('@/components/pages/BlogPage').then(m => ({ default: m.BlogPage })))
const AdminDashboard = dynamic(() => import('@/components/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const UserDashboard = dynamic(() => import('@/components/pages/UserDashboard').then(m => ({ default: m.UserDashboard })))

const pageComponents: Record<PageName, React.ComponentType> = {
  home: HomePage,
  'used-cars': UsedCarsPage,
  'new-cars': UsedCarsPage,
  'sell-car': SellCarPage,
  'car-valuation': SellCarPage,
  'car-details': CarDetailsPage,
  'used-cars-city': UsedCarsPage,
  'used-cars-brand': UsedCarsPage,
  'used-cars-budget': UsedCarsPage,
  'certified-cars': UsedCarsPage,
  'electric-cars': UsedCarsPage,
  'luxury-cars': UsedCarsPage,
  finance: FinancePage,
  insurance: InsurancePage,
  'compare-cars': UsedCarsPage,
  'dealer-details': CarDetailsPage,
  blog: BlogPage,
  'blog-detail': BlogPage,
  about: AboutPage,
  contact: ContactPage,
  faq: FAQPage,
  'privacy-policy': AboutPage,
  terms: AboutPage,
  'refund-policy': AboutPage,
  'user-dashboard': UserDashboard,
  'seller-dashboard': UserDashboard,
  'dealer-dashboard': AdminDashboard,
  'admin-dashboard': AdminDashboard,
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  )
}

export default function AppRouter() {
  const { currentPage, showCityModal, showAuthModal, showMobileMenu, setShowMobileMenu } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setShowMobileMenu(false)
  }, [currentPage, setShowMobileMenu])

  const PageComponent = pageComponents[currentPage] || HomePage

  const isAdminPage = ['admin-dashboard', 'dealer-dashboard'].includes(currentPage)

  if (!mounted) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Header />}
      <main className="flex-1">
        <div key={currentPage} className="page-enter">
          <React.Suspense fallback={<LoadingSpinner />}>
            <PageComponent />
          </React.Suspense>
        </div>
      </main>
      {!isAdminPage && <Footer />}
      <CityModal />
      <AuthModal />
      {!isAdminPage && <WhatsAppButton />}
    </div>
  )
}
