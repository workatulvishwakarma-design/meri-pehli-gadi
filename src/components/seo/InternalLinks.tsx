import React from 'react'
import Link from 'next/link'
import { MapPin, Tag, Banknote, Car } from 'lucide-react'

// Hardcoded for MVP, but normally this would be fetched from DB/cache in a server component
const TOP_CITIES = ['Guwahati', 'Dibrugarh', 'Tezpur', 'Tinsukia']
const TOP_BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Toyota', 'Mahindra']
const BUDGETS = [
  { label: 'Under ₹2 Lakh', slug: 'under-2-lakh' },
  { label: 'Under ₹5 Lakh', slug: 'under-5-lakh' },
  { label: 'Under ₹10 Lakh', slug: 'under-10-lakh' },
]

export default function InternalLinks() {
  return (
    <section className="bg-white py-12 mt-12 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Popular Searches in Assam</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cities */}
          <div>
            <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-brand" />
              Used Cars by City
            </h3>
            <ul className="space-y-2">
              {TOP_CITIES.map(city => (
                <li key={city}>
                  <Link 
                    href={`/used-cars/in/${city.toLowerCase()}`}
                    className="text-sm text-slate-500 hover:text-brand transition-colors"
                  >
                    Used Cars in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-brand" />
              Used Cars by Brand
            </h3>
            <ul className="space-y-2">
              {TOP_BRANDS.map(brand => (
                <li key={brand}>
                  <Link 
                    href={`/used-cars/brand/${brand.toLowerCase().replace(' ', '-')}/assam`}
                    className="text-sm text-slate-500 hover:text-brand transition-colors"
                  >
                    Used {brand} Cars in Assam
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget */}
          <div>
            <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
              <Banknote className="w-4 h-4 text-brand" />
              Used Cars by Budget
            </h3>
            <ul className="space-y-2">
              {BUDGETS.map(budget => (
                <li key={budget.slug}>
                  <Link 
                    href={`/used-cars/budget/${budget.slug}/assam`}
                    className="text-sm text-slate-500 hover:text-brand transition-colors"
                  >
                    Used Cars {budget.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Body Type */}
          <div>
            <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
              <Car className="w-4 h-4 text-brand" />
              Used Cars by Body Type
            </h3>
            <ul className="space-y-2">
              {['SUV', 'Sedan', 'Hatchback', 'MUV'].map(type => (
                <li key={type}>
                  <Link 
                    href={`/search?bodyType=${type.toLowerCase()}`}
                    className="text-sm text-slate-500 hover:text-brand transition-colors"
                  >
                    Used {type} Cars in Assam
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
