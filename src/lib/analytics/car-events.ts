// Centralized tracking utility for MeriPehli Gadi

type EventCategory = 'car_view' | 'lead_generated' | 'finance_check' | 'whatsapp_click' | 'call_click' | 'search'

interface TrackingEvent {
  eventName: EventCategory
  carId?: string
  carBrand?: string
  carModel?: string
  carPrice?: number
  city?: string
  leadSource?: string
}

export const trackEvent = (event: TrackingEvent) => {
  // In a real application, this would push to GTM, Mixpanel, or custom backend
  // e.g., window.dataLayer.push({ event: event.eventName, ...event })
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Tracked: ${event.eventName}`, event)
  }

  // Example integration with generic API endpoint (fire and forget)
  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
      }),
      keepalive: true // Ensures the request completes even if the user navigates away
    }).catch(() => { /* Silent fail for analytics */ })
  } catch (error) {
    // Ignore errors
  }
}
