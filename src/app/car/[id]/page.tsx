import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { db } from '@/lib/db'
import { ImageGallery } from '@/components/car-details/ImageGallery'
import { CarOverview } from '@/components/car-details/CarOverview'
import { InspectionReport } from '@/components/car-details/InspectionReport'
import { FinanceBox } from '@/components/car-details/FinanceBox'
import CarCard from '@/components/shared/CarCard'

// Cache revalidation for this dynamic route (ISR)
export const revalidate = 3600

interface PageProps {
  params: {
    id: string
  }
}

async function getCar(id: string) {
  const car = await db.car.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      brand: true,
      model: true,
      city: true,
      dealer: true,
    }
  })

  // Try to find by slug if id fails
  if (!car) {
    const carBySlug = await db.car.findUnique({
      where: { slug: id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        brand: true,
        model: true,
        city: true,
        dealer: true,
      }
    })
    return carBySlug
  }

  return car
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await getCar(params.id)
  
  if (!car) {
    return { title: 'Car Not Found | MeriPehli Gadi' }
  }

  return {
    title: car.seoTitle || `${car.title} in ${car.city?.name || 'Assam'} | MeriPehli Gadi`,
    description: car.seoDescription || `Buy ${car.title} for ₹${(car.price / 100000).toFixed(2)} Lakh. ${car.kmDriven} km driven, ${car.ownerType} owner.`,
  }
}

export default async function CarDetailsPage({ params }: PageProps) {
  const car = await getCar(params.id)

  if (!car) {
    notFound()
  }

  const imageUrls = car.images.map(img => img.url)
  
  // Track View (Using a client component for tracking or just increment DB async)
  // For ISR, we shouldn't increment DB here because this page is cached.
  // We will leave tracking to a client side useEffect or a separate route.

  // Fetch similar cars
  const similarCars = await db.car.findMany({
    where: {
      status: 'ACTIVE',
      brandId: car.brandId,
      id: { not: car.id }
    },
    include: {
      brand: true,
      model: true,
      city: true,
      images: { take: 1, orderBy: { sortOrder: 'asc' } }
    },
    take: 4
  })

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: car.title,
    image: imageUrls[0] || '',
    description: car.description || car.seoDescription,
    brand: {
      '@type': 'Brand',
      name: car.brand?.name || ''
    },
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://meripehligadi.com/car/${car.slug}`,
      seller: {
        '@type': 'LocalBusiness',
        name: 'MeriPehli Gadi',
        image: 'https://meripehligadi.com/logo.png',
        address: {
          '@type': 'PostalAddress',
          addressLocality: car.city?.name || 'Assam',
          addressRegion: 'Assam',
          addressCountry: 'IN'
        }
      }
    },
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.kmDriven,
      unitCode: 'KMT'
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-slate-50 min-h-screen pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Gallery & Details */}
            <div className="lg:col-span-2 space-y-8">
              <ImageGallery images={imageUrls} title={car.title} />

              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{car.title}</h1>
                <p className="text-slate-500">{car.description}</p>
              </div>

              <CarOverview car={{
                year: car.year,
                kmDriven: car.kmDriven,
                fuelType: car.fuelType,
                transmission: car.transmission,
                ownerType: car.ownerType,
                city: car.city?.name || 'Assam',
                rto: car.rto,
                bodyType: car.bodyType
              }} />

              <InspectionReport score={car.conditionScore || 95} isCertified={car.isCertified} />

              <div className="bg-white p-6 rounded-16 shadow-soft border border-slate-200/80 prose max-w-none">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Why buy this {car.brand?.name || 'Car'}?</h3>
                <p className="text-slate-600 leading-relaxed">
                  This {car.year} {car.title} is an excellent choice for navigating the diverse terrains of Assam, from Guwahati's city traffic to the highways of Dibrugarh. 
                  With {car.kmDriven.toLocaleString()} km on the odometer, this {car.fuelType.toLowerCase()} {car.bodyType.toLowerCase()} offers great mileage and reliability. 
                  It has been thoroughly inspected and comes with the MeriPehli Gadi trust guarantee. 
                  Easy financing is available through Shani Finserve with low downpayment options.
                </p>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Price Card */}
                <div className="bg-white p-6 rounded-16 shadow-premium border border-slate-100 relative overflow-hidden">
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Asking Price</div>
                  <div className="text-4xl font-extrabold text-brand mb-4">
                    ₹{car.price.toLocaleString('en-IN')}
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-12 shadow-lg transition-transform active:scale-95">
                      Book Test Drive
                    </button>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-12 border border-green-200 transition-colors">
                        WhatsApp
                      </button>
                      <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-12 border border-slate-200 transition-colors">
                        Call Seller
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-center text-xs text-slate-400 mt-4">No hidden charges. Price is negotiable.</p>
                </div>

                <FinanceBox price={car.price} emiPrice={car.emiPrice} />
                
              </div>
            </div>
          </div>
          
          {/* Similar Cars Section */}
          {similarCars.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Similar Cars in Assam</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarCars.map(c => (
                  <CarCard 
                    key={c.id} 
                    car={{
                      id: c.slug,
                      title: c.title,
                      brand: c.brand?.name || '',
                      model: c.model?.name || '',
                      year: c.year,
                      price: c.price,
                      emiPrice: c.emiPrice,
                      kmDriven: c.kmDriven,
                      fuelType: c.fuelType,
                      transmission: c.transmission,
                      ownerType: c.ownerType,
                      city: c.city?.name || '',
                      images: c.images.map((img: any) => img.url),
                      isCertified: c.isCertified,
                      badge: c.badge,
                      isFinanceAvailable: c.isFinanceAvailable
                    }} 
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
