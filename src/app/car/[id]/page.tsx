import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { db } from '@/lib/db'
import { CarService } from '@/lib/services/car.service'
import { ImageGallery } from '@/components/car-details/ImageGallery'
import { CarDetailShell } from '@/components/car-details/CarDetailShell'
import { SimilarCarsSection } from '@/components/car-details/SimilarCarsSection'
import InternalLinks from '@/components/seo/InternalLinks'

// Cache revalidation for this dynamic route (ISR)
export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCar(id: string) {
  const include = {
    images: { orderBy: { sortOrder: 'asc' as const } },
    brand: true,
    model: true,
    city: true,
    dealer: true,
    features: true, // ADDED: Now fetching features
  }

  const car = await db.car.findUnique({
    where: { id },
    include
  })

  if (!car) {
    return await db.car.findUnique({
      where: { slug: id },
      include
    })
  }

  return car
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params
  const car = await getCar(p.id)
  
  if (!car) {
    return { title: 'Car Not Found | MeriPehli Gadi' }
  }

  return {
    title: car.seoTitle || `${car.title} in ${car.city?.name || 'Assam'} | MeriPehli Gadi`,
    description: car.seoDescription || `Buy ${car.title} for ₹${(car.price / 100000).toFixed(2)} Lakh. ${car.kmDriven} km driven, ${car.ownerType} owner.`,
  }
}

export default async function CarDetailsPage({ params }: PageProps) {
  const p = await params
  const car = await getCar(p.id)

  if (!car) {
    notFound()
  }

  const imageUrls = car.images.map((img: any) => img.url)
  
  // Track View (Fire and forget, don't await blocking the render)
  CarService.incrementCarViews(car.id).catch(console.error)

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
    take: 6
  })

  // Format similar cars for the new section
  const formattedSimilarCars = similarCars.map(c => ({
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
  }))

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
      url: `https://new.shanifinserve.com/car/${car.slug}`,
      seller: {
        '@type': 'LocalBusiness',
        name: 'MeriPehli Gadi',
        image: 'https://new.shanifinserve.com/logo.png',
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
      <main className="bg-slate-50 min-h-screen pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Top Section: Title & Gallery */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">{car.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span>{car.year}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{car.kmDriven.toLocaleString()} km</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1">
                👁️ {(car.viewsCount || 0) + 1} views
              </span>
            </div>
            
            <ImageGallery images={imageUrls} title={car.title} />
          </div>

          {/* Interactive Shell (Tabs & Sidebar) */}
          <CarDetailShell car={car} />
          
          {/* Similar Cars Horizontal Scroll */}
          <SimilarCarsSection cars={formattedSimilarCars} />

        </div>
        
        <InternalLinks />
      </main>
    </>
  )
}
