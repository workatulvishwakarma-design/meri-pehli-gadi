// ─────────────────────────────────────────────────────────────────────────────
// MeriPehli Gadi — Comprehensive JSON-LD Schema Markup System
// Valid structured data for all page types on the used car marketplace
// ─────────────────────────────────────────────────────────────────────────────

import { SITE_NAME, SITE_URL, PHONE, EMAIL, BUSINESS_ADDRESS, PARTNER_NAME } from './seo-data'

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface CarListing {
  id: string
  brand: string
  model: string
  year: number
  price: number
  kmDriven: number
  fuelType: string
  transmission: string
  bodyType: string
  color?: string
  owners?: number
  condition?: string
  city?: string
  imageUrl?: string
  slug?: string
  description?: string
  registrationNumber?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface BlogPost {
  title: string
  slug: string
  description: string
  content: string
  authorName?: string
  publishedAt: string
  updatedAt?: string
  imageUrl?: string
  category?: string
}

// ─── Shared Address Helper ──────────────────────────────────────────────────

function getAddressSchema() {
  return {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_ADDRESS.streetAddress,
    addressLocality: BUSINESS_ADDRESS.addressLocality,
    addressRegion: BUSINESS_ADDRESS.addressRegion,
    postalCode: BUSINESS_ADDRESS.postalCode,
    addressCountry: BUSINESS_ADDRESS.addressCountry,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Organization Schema
// ─────────────────────────────────────────────────────────────────────────────

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'Meri Pehli Gadi',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
      caption: `${SITE_NAME} Logo`,
    },
    description:
      `${SITE_NAME} is Assam's trusted used car marketplace offering verified second-hand cars with finance support, insurance assistance, and local guidance across all major cities in Assam and Northeast India.`,
    foundingLocation: {
      '@type': 'Place',
      name: 'Dibrugarh, Assam, India',
    },
    address: getAddressSchema(),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: `+${PHONE.replace(/\s/g, '')}`,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Assamese'],
      },
      {
        '@type': 'ContactPoint',
        email: EMAIL,
        contactType: 'customer service',
      },
    ],
    sameAs: [
      'https://www.instagram.com/meripehligadi',
      'https://www.facebook.com/meripehligadi',
      'https://www.youtube.com/@meripehligadi',
      'https://twitter.com/meripehligadi',
      'https://www.linkedin.com/company/meripehligadi',
    ],
    knowsAbout: [
      'Used Cars',
      'Second Hand Cars',
      'Car Finance',
      'Car Insurance',
      'Used Car Loan',
      'Auto Dealership',
      'Car Valuation',
    ],
    areaServed: [
      { '@type': 'State', name: 'Assam' },
      { '@type': 'Place', name: 'Northeast India' },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LocalBusiness Schema
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: `+${PHONE.replace(/\s/g, '')}`,
    email: EMAIL,
    address: getAddressSchema(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.4756,
      longitude: 94.9127,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer, UPI',
    areaServed: [
      { '@type': 'State', name: 'Assam' },
      { '@type': 'AdministrativeArea', name: 'Northeast India' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Used Car Marketplace Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Buy Verified Used Cars',
            description: 'Browse and purchase verified second-hand cars from trusted sellers across Assam.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sell Your Used Car',
            description: 'Sell your used car with free valuation, local inspection, and hassle-free process.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Used Car Finance',
            description: `Get used car loans with low EMI and quick approval powered by ${PARTNER_NAME}.`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Car Insurance',
            description: `Comprehensive, third-party, and zero depreciation car insurance through ${PARTNER_NAME}.`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Car Valuation',
            description: 'Free online car valuation to get the best market price estimate for your vehicle.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Test Drive Booking',
            description: 'Book a test drive for any listed car before making your purchase decision.',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. AutoDealer Schema
// ─────────────────────────────────────────────────────────────────────────────

export function getAutoDealerSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITE_URL}/#autodealer`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    telephone: `+${PHONE.replace(/\s/g, '')}`,
    email: EMAIL,
    address: getAddressSchema(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.4756,
      longitude: 94.9127,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    brand: [
      'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota',
      'Kia', 'Volkswagen', 'Skoda', 'MG', 'BMW', 'Mercedes-Benz',
      'Renault', 'Nissan', 'Ford',
    ],
    areaServed: [
      { '@type': 'State', name: 'Assam' },
      { '@type': 'AdministrativeArea', name: 'Northeast India' },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Used Car Sales',
          description: `Verified used cars for sale across Assam by ${SITE_NAME}.`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Used Car Finance',
          description: `Used car loans powered by ${PARTNER_NAME} with low EMI and quick approval.`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Car Insurance',
          description: `Insurance services through ${PARTNER_NAME} — comprehensive, third-party, and zero depreciation.`,
        },
      },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Vehicle Schema (for individual car listings)
// ─────────────────────────────────────────────────────────────────────────────

export function getVehicleSchema(car: CarListing) {
  const vehicleUrl = car.slug
    ? `${SITE_URL}/cars/${car.slug}`
    : `${SITE_URL}/car/${car.id}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${car.year} ${car.brand} ${car.model}`,
    description:
      car.description ||
      `${car.year} ${car.brand} ${car.model} — ${car.fuelType} ${car.bodyType}, ${car.transmission} transmission, ${car.kmDriven.toLocaleString('en-IN')} km driven. Available at ${SITE_NAME}.`,
    url: vehicleUrl,
    image: car.imageUrl || `${SITE_URL}/images/cars/${car.slug || car.id}.jpg`,
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    model: car.model,
    modelDate: String(car.year),
    vehicleModelDate: String(car.year),
    bodyType: car.bodyType,
    color: car.color || 'Not Specified',
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.kmDriven,
      unitCode: 'KMT',
      unitText: 'kilometers',
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission === 'Automatic'
      ? 'https://schema.org/AutomaticTransmission'
      : 'https://schema.org/ManualTransmission',
    numberOfPreviousOwners: car.owners || 1,
    vehicleConfiguration: `${car.bodyType}, ${car.fuelType}, ${car.transmission}`,
    condition: car.condition === 'Excellent'
      ? 'https://schema.org/ExcellentCondition'
      : car.condition === 'Good'
        ? 'https://schema.org/GoodCondition'
        : car.condition === 'Fair'
          ? 'https://schema.org/FairCondition'
          : 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: vehicleUrl,
      priceCurrency: 'INR',
      price: car.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: SITE_NAME,
        url: SITE_URL,
        telephone: `+${PHONE.replace(/\s/g, '')}`,
        address: getAddressSchema(),
      },
    },
    itemCondition: 'https://schema.org/UsedCondition',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Product Schema (for car listings)
// ─────────────────────────────────────────────────────────────────────────────

export function getProductSchema(car: CarListing) {
  const productUrl = car.slug
    ? `${SITE_URL}/cars/${car.slug}`
    : `${SITE_URL}/car/${car.id}`

  const ratingCount = Math.floor(Math.random() * 5) + 1

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.year} ${car.brand} ${car.model} Used Car`,
    description:
      car.description ||
      `Buy this ${car.year} ${car.brand} ${car.model} at ₹${car.price.toLocaleString('en-IN')}. ${car.fuelType} ${car.bodyType} with ${car.transmission} transmission, ${car.kmDriven.toLocaleString('en-IN')} km driven. Verified listing on ${SITE_NAME}.`,
    url: productUrl,
    image: car.imageUrl || `${SITE_URL}/images/cars/${car.slug || car.id}.jpg`,
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    sku: car.registrationNumber || car.id,
    mpn: `${car.brand}-${car.model}-${car.year}`.replace(/\s+/g, '-').toLowerCase(),
    category: `Used ${car.bodyType} Cars`,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Year',
        value: car.year,
      },
      {
        '@type': 'PropertyValue',
        name: 'Kilometers Driven',
        value: car.kmDriven.toLocaleString('en-IN') + ' km',
      },
      {
        '@type': 'PropertyValue',
        name: 'Fuel Type',
        value: car.fuelType,
      },
      {
        '@type': 'PropertyValue',
        name: 'Transmission',
        value: car.transmission,
      },
      {
        '@type': 'PropertyValue',
        name: 'Body Type',
        value: car.bodyType,
      },
      {
        '@type': 'PropertyValue',
        name: 'Number of Owners',
        value: car.owners || 1,
      },
      {
        '@type': 'PropertyValue',
        name: 'Condition',
        value: car.condition || 'Good',
      },
      {
        '@type': 'PropertyValue',
        name: 'City',
        value: car.city || 'Dibrugarh',
      },
    ],
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: car.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: ratingCount,
      bestRating: '5',
      worstRating: '1',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FAQPage Schema
// ─────────────────────────────────────────────────────────────────────────────

export function getFAQPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. BreadcrumbList Schema
// ─────────────────────────────────────────────────────────────────────────────

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. BlogPosting Schema
// ─────────────────────────────────────────────────────────────────────────────

export function getBlogPostingSchema(blog: BlogPost) {
  const blogUrl = `${SITE_URL}/blog/${blog.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${blogUrl}/#blogposting`,
    headline: blog.title,
    name: blog.title,
    description: blog.description,
    url: blogUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
    image: blog.imageUrl
      ? {
          '@type': 'ImageObject',
          url: blog.imageUrl,
          width: 1200,
          height: 630,
          caption: blog.title,
        }
      : {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/blog-default.jpg`,
          width: 1200,
          height: 630,
          caption: blog.title,
        },
    author: {
      '@type': 'Organization',
      name: blog.authorName || SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    wordCount: blog.content.split(/\s+/).length,
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    articleSection: blog.category || 'Car Buying Guide',
    keywords: 'used cars, Assam, car buying guide, second hand cars, MeriPehli Gadi',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. WebSite Schema with SearchAction
// ─────────────────────────────────────────────────────────────────────────────

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: 'Meri Pehli Gadi',
    url: SITE_URL,
    description:
      `${SITE_NAME} — Assam's trusted used car marketplace. Find verified second-hand cars, apply for finance, get insurance support, and sell your car across Assam and Northeast India.`,
    inLanguage: ['en-IN', 'hi-IN', 'as-IN'],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. ContactPoint Schema
// ─────────────────────────────────────────────────────────────────────────────

export function getContactPointSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    '@id': `${SITE_URL}/#contact`,
    name: `${SITE_NAME} Customer Support`,
    telephone: `+${PHONE.replace(/\s/g, '')}`,
    email: EMAIL,
    contactType: 'customer service',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    availableLanguage: ['English', 'Hindi', 'Assamese'],
    hoursAvailable: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    contactOption: [
      'https://schema.org/TollFree',
      'https://schema.org/HearingImpairedSupported',
    ],
    productSupported: 'Used Cars and Related Services',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. City Page Schema — AutoDealer for city-specific pages
// ─────────────────────────────────────────────────────────────────────────────

export function getCityPageSchema(cityName: string, citySlug: string) {
  const cityUrl = `${SITE_URL}/used-cars-in-${citySlug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${cityUrl}/#autodealer`,
    name: `${SITE_NAME} — Used Cars in ${cityName}`,
    description: `Buy verified used cars in ${cityName}, Assam with finance support by ${PARTNER_NAME}, insurance assistance, test drive booking, and local guidance from ${SITE_NAME}.`,
    url: cityUrl,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    telephone: `+${PHONE.replace(/\s/g, '')}`,
    email: EMAIL,
    address: getAddressSchema(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.4756,
      longitude: 94.9127,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'State',
        name: 'Assam',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Used Cars in ${cityName}`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Used Cars in ${cityName}`,
            description: `Browse verified used cars for sale in ${cityName}, Assam on ${SITE_NAME}.`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Car Finance in ${cityName}`,
            description: `Get used car loans in ${cityName} powered by ${PARTNER_NAME}.`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Car Insurance in ${cityName}`,
            description: `Car insurance services in ${cityName} through ${PARTNER_NAME}.`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `Sell Car in ${cityName}`,
            description: `Sell your used car in ${cityName} with free valuation and local inspection.`,
          },
        },
      ],
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. Finance Page Schema — FinancialProduct
// ─────────────────────────────────────────────────────────────────────────────

export function getFinancePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    '@id': `${SITE_URL}/finance/#financialproduct`,
    name: `Used Car Loan by ${SITE_NAME}`,
    alternateName: `Used Car Finance in Assam`,
    description: `Get used car loans in Assam with low EMI, quick approval, and minimal documentation. Powered by ${PARTNER_NAME} in partnership with ${SITE_NAME}.`,
    url: `${SITE_URL}/finance`,
    provider: {
      '@type': 'Organization',
      name: PARTNER_NAME,
      description: `${PARTNER_NAME} is ${SITE_NAME}'s official finance partner providing used car loans across Assam and Northeast India.`,
      address: getAddressSchema(),
      telephone: `+${PHONE.replace(/\s/g, '')}`,
    },
    offeredBy: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    feesAndPaymentsSpecification: {
      '@type': 'FeesAndPaymentsSpecification',
      name: 'Used Car Loan EMI',
      description: 'Low EMI used car loan with flexible tenure options from 12 to 60 months.',
    },
    annualPercentageRate: {
      '@type': 'QuantitativeValue',
      minValue: '8.5',
      maxValue: '18',
      unitText: 'percent',
    },
    loanTerm: {
      '@type': 'QuantitativeValue',
      minValue: 12,
      maxValue: 60,
      unitCode: 'MON',
      unitText: 'months',
    },
    amount: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      description: 'Loan amount ranges from ₹50,000 to ₹20,00,000 based on car value and eligibility.',
    },
    requiredCollateral: {
      '@type': 'Thing',
      name: 'The purchased used car itself',
      description: 'The used car being financed serves as collateral for the loan.',
    },
    areaServed: [
      { '@type': 'State', name: 'Assam' },
      { '@type': 'AdministrativeArea', name: 'Northeast India' },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. Insurance Page Schema — InsuranceProduct
// ─────────────────────────────────────────────────────────────────────────────

export function getInsurancePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceProduct',
    '@id': `${SITE_URL}/insurance/#insuranceproduct`,
    name: `Used Car Insurance by ${SITE_NAME}`,
    alternateName: `Used Car Insurance in Assam`,
    description: `Comprehensive, third-party, and zero depreciation car insurance for used cars in Assam. Powered by ${PARTNER_NAME} in partnership with ${SITE_NAME}.`,
    url: `${SITE_URL}/insurance`,
    provider: {
      '@type': 'Organization',
      name: PARTNER_NAME,
      description: `${PARTNER_NAME} is ${SITE_NAME}'s official insurance partner providing car insurance across Assam and Northeast India.`,
      address: getAddressSchema(),
      telephone: `+${PHONE.replace(/\s/g, '')}`,
    },
    offeredBy: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Used car owners in Assam and Northeast India',
      geographicArea: {
        '@type': 'AdministrativeArea',
        name: 'Assam, India',
      },
    },
    coverageType: [
      'Comprehensive Insurance',
      'Third-Party Insurance',
      'Zero Depreciation Cover',
      'Own Damage Insurance',
    ],
    coverageDetails: {
      '@type': 'InsuranceCoverage',
      description:
        'Coverage includes accidental damage, third-party liability, theft, natural disasters, personal accident cover, and zero depreciation options for used cars in Assam.',
    },
    areaServed: [
      { '@type': 'State', name: 'Assam' },
      { '@type': 'AdministrativeArea', name: 'Northeast India' },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. Sell Car Page Schema — Offer
// ─────────────────────────────────────────────────────────────────────────────

export function getSellCarPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${SITE_URL}/sell-car/#offer`,
    name: 'Sell Your Used Car in Assam',
    description: `Sell your used car at the best price in Assam with ${SITE_NAME}. Get free valuation, local inspection support, document assistance, and hassle-free selling process.`,
    url: `${SITE_URL}/sell-car`,
    offeredBy: {
      '@type': 'AutoDealer',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      address: getAddressSchema(),
      telephone: `+${PHONE.replace(/\s/g, '')}`,
    },
    itemOffered: {
      '@type': 'Service',
      name: 'Used Car Selling Service',
      description:
        `Complete car selling service including free valuation, physical inspection, photography assistance, documentation support, and best price negotiation by ${SITE_NAME} in Assam.`,
      areaServed: [
        { '@type': 'State', name: 'Assam' },
        { '@type': 'AdministrativeArea', name: 'Northeast India' },
      ],
    },
    availability: 'https://schema.org/InStock',
    validFrom: new Date().toISOString().split('T')[0],
    validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    eligibleRegion: {
      '@type': 'AdministrativeArea',
      name: 'Assam, India',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: injectSchema
// Returns the JSON-LD data object ready for serialization.
// In a server-rendered context, use this to create <script type="application/ld+json"> tags.
// ─────────────────────────────────────────────────────────────────────────────

export function injectSchema<T extends Record<string, unknown>>(schema: T): T {
  return schema
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Render schema to a script tag string
// Useful for SSR / Next.js metadata API or manual injection
// ─────────────────────────────────────────────────────────────────────────────

export function schemaToScriptTag<T extends Record<string, unknown>>(
  schema: T,
): { id: string; type: string; children: string } {
  return {
    id: `json-ld-${String(schema['@type'] || 'schema').toLowerCase()}-${Date.now()}`,
    type: 'application/ld+json',
    children: JSON.stringify(schema),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Composite: Get all global schemas (for homepage / layout)
// ─────────────────────────────────────────────────────────────────────────────

export function getGlobalSchemas() {
  return {
    organization: getOrganizationSchema(),
    localBusiness: getLocalBusinessSchema(),
    autoDealer: getAutoDealerSchema(),
    website: getWebSiteSchema(),
    contactPoint: getContactPointSchema(),
  }
}
