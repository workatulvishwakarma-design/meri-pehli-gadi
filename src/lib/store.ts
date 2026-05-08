import { create } from 'zustand'

// ─── Navigation / Page State ──────────────────────────────────
export type PageName =
  | 'home'
  | 'used-cars'
  | 'new-cars'
  | 'sell-car'
  | 'car-valuation'
  | 'car-details'
  | 'used-cars-city'
  | 'used-cars-brand'
  | 'used-cars-budget'
  | 'certified-cars'
  | 'electric-cars'
  | 'luxury-cars'
  | 'finance'
  | 'insurance'
  | 'compare-cars'
  | 'dealer-details'
  | 'blog'
  | 'blog-detail'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy-policy'
  | 'terms'
  | 'refund-policy'
  | 'user-dashboard'
  | 'seller-dashboard'
  | 'dealer-dashboard'
  | 'admin-dashboard'

interface AppState {
  // Navigation
  currentPage: PageName
  pageParams: Record<string, string>
  previousPage: PageName | null
  navigateTo: (page: PageName, params?: Record<string, string>) => void
  goBack: () => void

  // City
  selectedCity: string
  setSelectedCity: (city: string) => void
  showCityModal: boolean
  setShowCityModal: (show: boolean) => void

  // Auth
  isAuthenticated: boolean
  user: { id: string; name: string; email: string; role: string; avatar?: string } | null
  setAuth: (user: { id: string; name: string; email: string; role: string; avatar?: string } | null) => void
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  authMode: 'login' | 'register' | 'forgot'
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Mobile menu
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
}

// SSR-safe localStorage access helper
function getSavedCity(): string {
  if (typeof window === 'undefined') return 'dibrugarh'
  try {
    return localStorage.getItem('meripehli-city') || 'dibrugarh'
  } catch {
    return 'dibrugarh'
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentPage: 'home',
  pageParams: {},
  previousPage: null,
  navigateTo: (page, params = {}) => {
    // ─── Intercept SEO pages to use native browser routing ───
    if (typeof window !== 'undefined') {
      if (page === 'used-cars-city' && params.city) {
        window.location.href = `/used-cars/in/${params.city}`
        return
      }
      if (page === 'used-cars-brand' && params.brand) {
        window.location.href = `/used-cars/brand/${params.brand}/assam`
        return
      }
      if ((page === 'used-cars-budget' && params.budget) || params.range) {
        const budgetVal = params.budget || params.range
        window.location.href = `/used-cars/budget/${budgetVal}/assam`
        return
      }
      if (page === 'used-cars' || (page === 'used-cars-city' && !params.city)) {
        let url = '/used-cars/in/assam'
        const queryParams = new URLSearchParams()
        
        if (params.search) queryParams.set('search', params.search)
        if (params.bodyType) queryParams.set('bodyType', params.bodyType)
        if (params.transmission) queryParams.set('transmission', params.transmission)
        if (params.fuel) queryParams.set('fuel', params.fuel)
        
        if (Array.from(queryParams.keys()).length > 0) {
          url += `?${queryParams.toString()}`
        }
        window.location.href = url
        return
      }
      if (page === 'finance') {
        const qp = new URLSearchParams()
        if (params.carId) qp.set('carId', params.carId)
        window.location.href = `/finance${qp.toString() ? '?' + qp.toString() : ''}`
        return
      }
      if (page === 'insurance') {
        window.location.href = '/insurance'
        return
      }
      if (page === 'sell-car' || page === 'car-valuation') {
        window.location.href = '/sell-car'
        return
      }
      if (page === 'contact') {
        window.location.href = '/contact'
        return
      }
    }

    const state = get()
    set({
      previousPage: state.currentPage,
      currentPage: page,
      pageParams: params,
      showMobileMenu: false,
    })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  goBack: () => {
    const state = get()
    if (state.previousPage) {
      set({
        currentPage: state.previousPage,
        previousPage: null,
      })
    } else {
      set({ currentPage: 'home' })
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },

  // City — SSR-safe initialization
  selectedCity: 'dibrugarh',
  setSelectedCity: (city) => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('meripehli-city', city) } catch {}
    }
    set({ selectedCity: city, showCityModal: false })
  },
  showCityModal: false,
  setShowCityModal: (show) => set({ showCityModal: show }),

  // Auth
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ isAuthenticated: !!user, user }),
  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  authMode: 'login',
  setAuthMode: (mode) => set({ authMode: mode }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Mobile menu
  showMobileMenu: false,
  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
}))
