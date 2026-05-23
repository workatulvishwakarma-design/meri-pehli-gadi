// Route Registry System
// Ensures all links in the application are type-safe and never break

export const Routes = {
  // Main Static Pages
  home: '/',
  search: '/search',
  contact: '/contact',
  sellCar: '/sell-car',
  finance: '/finance',
  insurance: '/insurance',
  blog: '/blog',
  about: '/about',
  faq: '/faq',
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
  refundPolicy: '/refund-policy',
  
  // Dynamic Catalog Pages
  usedCars: '/used-cars',
  city: (citySlug: string) => `/used-cars/in/${citySlug}`,
  brand: (brandSlug: string) => `/used-cars/brand/${brandSlug}/assam`,
  budget: (budgetSlug: string) => `/used-cars/budget/${budgetSlug}/assam`,
  bodyType: (typeSlug: string) => `/used-cars/body-type/${typeSlug}/assam`,
  
  // Single Entity Pages
  carDetail: (carSlug: string) => `/car/${carSlug}`,
  blogDetail: (blogSlug: string) => `/blog/${blogSlug}`,
  
  // Admin Routes
  admin: {
    dashboard: '/admin',
    cars: '/admin/cars',
    leads: '/admin/leads',
    blog: '/admin/blog',
    settings: '/admin/settings',
    login: '/admin/login',
  }
} as const;

export type AppRoutes = typeof Routes;
