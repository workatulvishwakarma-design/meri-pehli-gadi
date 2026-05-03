// ─────────────────────────────────────────────────────────────────────────────
// MeriPehli Gadi — Event Tracking System
// Ready for Google Analytics 4, Meta Pixel, Google Tag Manager, Microsoft Clarity
// ─────────────────────────────────────────────────────────────────────────────

type EventParams = Record<string, string | number | boolean>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
    clarity?: (event: string, ...args: unknown[]) => void
  }
}

// ─── Core Event Tracker ─────────────────────────────────────────────────────

function trackEvent(eventName: string, params?: EventParams) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }

  // Google Tag Manager dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    })
  }

  // Microsoft Clarity
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', eventName)
  }

  // Console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Track] ${eventName}`, params || '')
  }
}

// ─── Predefined Tracking Events ─────────────────────────────────────────────

export const TrackEvents = {
  // WhatsApp
  whatsappClick: (source: string) =>
    trackEvent('whatsapp_click', { source, page_url: typeof window !== 'undefined' ? window.location.href : '' }),

  // Phone Call
  callClick: (source: string) =>
    trackEvent('call_click', { source }),

  // Navigation
  pageView: (pageName: string, pageParams?: Record<string, string>) =>
    trackEvent('page_view', { page_name: pageName, ...pageParams }),

  cityChange: (city: string) =>
    trackEvent('city_change', { city }),

  // Car Interactions
  carDetailView: (carId: string, carTitle: string, carPrice: number) =>
    trackEvent('car_detail_view', { car_id: carId, car_title: carTitle, car_price: carPrice }),

  carCompare: (carIds: string[]) =>
    trackEvent('car_compare', { car_count: carIds.length, car_ids: carIds.join(',') }),

  wishlistAdd: (carId: string, carTitle: string) =>
    trackEvent('wishlist_add', { car_id: carId, car_title: carTitle }),

  wishlistRemove: (carId: string) =>
    trackEvent('wishlist_remove', { car_id: carId }),

  searchSubmit: (query: string, filters?: Record<string, string>) =>
    trackEvent('search_submit', { search_query: query, ...filters }),

  // Lead Conversions
  financeLeadSubmit: (city: string, loanAmount?: number) =>
    trackEvent('finance_lead_submit', { city, loan_amount: loanAmount || 0 }),

  insuranceLeadSubmit: (carBrand: string) =>
    trackEvent('insurance_lead_submit', { car_brand: carBrand }),

  sellCarLeadSubmit: (city: string) =>
    trackEvent('sell_car_lead_submit', { city }),

  testDriveSubmit: (carId: string, carTitle: string) =>
    trackEvent('test_drive_submit', { car_id: carId, car_title: carTitle }),

  valuationSubmit: (carBrand: string, carModel: string) =>
    trackEvent('valuation_submit', { car_brand: carBrand, car_model: carModel }),

  contactFormSubmit: () =>
    trackEvent('contact_form_submit', {}),

  // CTA Clicks
  ctaClick: (ctaName: string, page: string) =>
    trackEvent('cta_click', { cta_name: ctaName, page }),

  // Auth
  loginSuccess: () => trackEvent('login_success', {}),
  registerSuccess: () => trackEvent('register_success', {}),
  loginFail: (reason: string) => trackEvent('login_fail', { reason }),
}

// ─── E-commerce Enhanced Events ─────────────────────────────────────────────

export const TrackEcommerce = {
  beginCheckout: (carId: string, carTitle: string, carPrice: number) =>
    trackEvent('begin_checkout', {
      currency: 'INR',
      value: carPrice,
      items: [{ item_id: carId, item_name: carTitle, price: carPrice, currency: 'INR' }],
    }),

  generateLead: (leadType: string, value?: number) =>
    trackEvent('generate_lead', {
      currency: 'INR',
      value: value || 0,
      lead_type: leadType,
    }),
}

// ─── Meta Pixel Helper ──────────────────────────────────────────────────────

export function trackMetaPixel(event: string, params?: EventParams) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params)
  }
}

export const MetaEvents = {
  pageView: () => trackMetaPixel('PageView'),
  viewContent: (carTitle: string, carPrice?: number) =>
    trackMetaPixel('ViewContent', { content_name: carTitle, currency: 'INR', value: carPrice }),
  lead: (leadType: string) =>
    trackMetaPixel('Lead', { content_name: leadType }),
  contact: () => trackMetaPixel('Contact'),
  initiateCheckout: () => trackMetaPixel('InitiateCheckout'),
}
