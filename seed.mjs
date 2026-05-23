import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo cars...')

  // Create a default city
  const city = await prisma.city.upsert({
    where: { slug: 'guwahati' },
    update: {},
    create: {
      name: 'Guwahati',
      slug: 'guwahati',
      state: 'Assam',
      isPopular: true,
    },
  })

  // Create a default seller (required for car relation)
  const seller = await prisma.user.upsert({
    where: { email: 'admin@meripehligadi.com' },
    update: {},
    create: {
      email: 'admin@meripehligadi.com',
      name: 'Admin Seller',
      role: 'ADMIN',
      isActive: true,
    },
  })

  // Create Brands
  const maruti = await prisma.brand.upsert({
    where: { slug: 'maruti-suzuki' },
    update: {},
    create: { name: 'Maruti Suzuki', slug: 'maruti-suzuki', isPopular: true },
  })
  
  const hyundai = await prisma.brand.upsert({
    where: { slug: 'hyundai' },
    update: {},
    create: { name: 'Hyundai', slug: 'hyundai', isPopular: true },
  })

  // Create Models
  const swift = await prisma.model.upsert({
    where: { brandId_slug: { brandId: maruti.id, slug: 'swift' } },
    update: {},
    create: { name: 'Swift', slug: 'swift', brandId: maruti.id, bodyType: 'HATCHBACK' },
  })
  
  const creta = await prisma.model.upsert({
    where: { brandId_slug: { brandId: hyundai.id, slug: 'creta' } },
    update: {},
    create: { name: 'Creta', slug: 'creta', brandId: hyundai.id, bodyType: 'SUV' },
  })

  // Create Cars
  await prisma.car.upsert({
    where: { slug: 'maruti-suzuki-swift-vxi-2021' },
    update: {},
    create: {
      title: 'Maruti Suzuki Swift VXI',
      slug: 'maruti-suzuki-swift-vxi-2021',
      brandId: maruti.id,
      modelId: swift.id,
      cityId: city.id,
      sellerId: seller.id,
      year: 2021,
      price: 450000, // Budget Car (Under 5L)
      kmDriven: 32000,
      fuelType: 'PETROL',
      transmission: 'MANUAL',
      bodyType: 'HATCHBACK',
      status: 'ACTIVE',
      isFeatured: true, // Featured Car
      viewsCount: 1500, // Trending Car
      isCertified: true,
      description: 'Excellent condition Swift VXI with complete service history.',
      images: {
        create: [
          { url: '/assets/images/cars/swift-1.webp', sortOrder: 0, alt: 'Front view' }
        ]
      }
    }
  })

  await prisma.car.upsert({
    where: { slug: 'hyundai-creta-sx-2022' },
    update: {},
    create: {
      title: 'Hyundai Creta SX Opt',
      slug: 'hyundai-creta-sx-2022',
      brandId: hyundai.id,
      modelId: creta.id,
      cityId: city.id,
      sellerId: seller.id,
      year: 2022,
      price: 1450000, 
      kmDriven: 18000,
      fuelType: 'DIESEL',
      transmission: 'AUTOMATIC',
      bodyType: 'SUV',
      status: 'ACTIVE',
      isFeatured: true,
      viewsCount: 2100,
      isCertified: true,
      images: {
        create: [
          { url: '/assets/images/cars/creta-1.webp', sortOrder: 0, alt: 'Front view' }
        ]
      }
    }
  })

  console.log('✅ Seeding complete! Added default brands, models, and 2 demo cars (1 budget, 1 premium).')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
