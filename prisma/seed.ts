import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getCarImages } from '../src/lib/images/car-image-map'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 12)

  // ─── Cities ───────────────────────────────────────────
  const cities = [
    { name: 'Dibrugarh', slug: 'dibrugarh', state: 'Assam', isPopular: true, sortOrder: 1 },
    { name: 'Guwahati', slug: 'guwahati', state: 'Assam', isPopular: true, sortOrder: 2 },
    { name: 'Jorhat', slug: 'jorhat', state: 'Assam', isPopular: true, sortOrder: 3 },
    { name: 'Tinsukia', slug: 'tinsukia', state: 'Assam', isPopular: true, sortOrder: 4 },
    { name: 'Tezpur', slug: 'tezpur', state: 'Assam', isPopular: true, sortOrder: 5 },
    { name: 'Silchar', slug: 'silchar', state: 'Assam', isPopular: true, sortOrder: 6 },
    { name: 'Nagaon', slug: 'nagaon', state: 'Assam', isPopular: true, sortOrder: 7 },
    { name: 'Bongaigaon', slug: 'bongaigaon', state: 'Assam', isPopular: false, sortOrder: 8 },
    { name: 'Nalbari', slug: 'nalbari', state: 'Assam', isPopular: false, sortOrder: 9 },
    { name: 'Dhemaji', slug: 'dhemaji', state: 'Assam', isPopular: false, sortOrder: 10 },
    { name: 'Goalpara', slug: 'goalpara', state: 'Assam', isPopular: false, sortOrder: 11 },
    { name: 'Lakhimpur', slug: 'lakhimpur', state: 'Assam', isPopular: false, sortOrder: 12 },
    { name: 'Sivasagar', slug: 'sivasagar', state: 'Assam', isPopular: true, sortOrder: 13 },
    { name: 'Golaghat', slug: 'golaghat', state: 'Assam', isPopular: false, sortOrder: 14 },
    { name: 'Barpeta', slug: 'barpeta', state: 'Assam', isPopular: false, sortOrder: 15 },
    { name: 'Karimganj', slug: 'karimganj', state: 'Assam', isPopular: false, sortOrder: 16 },
    { name: 'Kokrajhar', slug: 'kokrajhar', state: 'Assam', isPopular: false, sortOrder: 17 },
    { name: 'Dhubri', slug: 'dhubri', state: 'Assam', isPopular: false, sortOrder: 18 },
    { name: 'Diphu', slug: 'diphu', state: 'Assam', isPopular: false, sortOrder: 19 },
    { name: 'Morigaon', slug: 'morigaon', state: 'Assam', isPopular: false, sortOrder: 20 },
    { name: 'Haflong', slug: 'haflong', state: 'Assam', isPopular: false, sortOrder: 21 },
    { name: 'Hailakandi', slug: 'hailakandi', state: 'Assam', isPopular: false, sortOrder: 22 },
  ]

  for (const city of cities) {
    await db.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    })
  }
  console.log(`✅ ${cities.length} cities seeded`)

  // ─── Brands ───────────────────────────────────────────
  const brands = [
    { name: 'Maruti Suzuki', slug: 'maruti-suzuki', country: 'India', isPopular: true, sortOrder: 1 },
    { name: 'Hyundai', slug: 'hyundai', country: 'South Korea', isPopular: true, sortOrder: 2 },
    { name: 'Tata', slug: 'tata', country: 'India', isPopular: true, sortOrder: 3 },
    { name: 'Mahindra', slug: 'mahindra', country: 'India', isPopular: true, sortOrder: 4 },
    { name: 'Honda', slug: 'honda', country: 'Japan', isPopular: true, sortOrder: 5 },
    { name: 'Toyota', slug: 'toyota', country: 'Japan', isPopular: true, sortOrder: 6 },
    { name: 'Kia', slug: 'kia', country: 'South Korea', isPopular: true, sortOrder: 7 },
    { name: 'Skoda', slug: 'skoda', country: 'Czech Republic', isPopular: false, sortOrder: 8 },
    { name: 'Volkswagen', slug: 'volkswagen', country: 'Germany', isPopular: false, sortOrder: 9 },
    { name: 'MG', slug: 'mg', country: 'China', isPopular: false, sortOrder: 10 },
    { name: 'BMW', slug: 'bmw', country: 'Germany', isPopular: false, sortOrder: 11 },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', country: 'Germany', isPopular: false, sortOrder: 12 },
    { name: 'Audi', slug: 'audi', country: 'Germany', isPopular: false, sortOrder: 13 },
    { name: 'Renault', slug: 'renault', country: 'France', isPopular: false, sortOrder: 14 },
    { name: 'Nissan', slug: 'nissan', country: 'Japan', isPopular: false, sortOrder: 15 },
    { name: 'Ford', slug: 'ford', country: 'USA', isPopular: false, sortOrder: 16 },
  ]

  for (const brand of brands) {
    await db.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    })
  }
  console.log(`✅ ${brands.length} brands seeded`)

  // ─── Users ────────────────────────────────────────────
  const dibrugarhCity = await db.city.findUnique({ where: { slug: 'dibrugarh' } })

  const users = [
    { email: 'admin@meripehligadi.com', name: 'Super Admin', role: 'SUPER_ADMIN' as const, cityId: dibrugarhCity?.id },
    { email: 'dealer@meripehligadi.com', name: 'Raj Automobiles', role: 'DEALER' as const, cityId: dibrugarhCity?.id },
    { email: 'user@meripehligadi.com', name: 'Amit Kumar', role: 'BUYER' as const, cityId: dibrugarhCity?.id },
  ]

  for (const u of users) {
    await db.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: hashedPassword,
        name: u.name,
        role: u.role,
        cityId: u.cityId,
        phone: '8721932757',
      },
    })
  }
  console.log(`✅ ${users.length} users seeded`)

  // ─── Dealer ───────────────────────────────────────────
  const dealerUser = await db.user.findUnique({ where: { email: 'dealer@meripehligadi.com' } })
  if (dealerUser && dibrugarhCity) {
    await db.dealer.upsert({
      where: { slug: 'raj-automobiles' },
      update: {},
      create: {
        name: 'Raj Automobiles',
        slug: 'raj-automobiles',
        email: 'dealer@meripehligadi.com',
        phone: '8721932757',
        address: 'Opposite Vishal Mega Mart, Kartic Para, Dibrugarh, Assam 786001',
        cityId: dibrugarhCity.id,
        description: 'Leading used car dealer in Dibrugarh with 10+ years of experience. All cars are certified and inspected.',
        rating: 4.5,
        totalCars: 25,
      },
    })
  }
  console.log('✅ Dealer seeded')

  // ─── Models ───────────────────────────────────────────
  const brandMap: Record<string, string> = {}
  const allBrands = await db.brand.findMany()
  for (const b of allBrands) brandMap[b.slug] = b.id

  const modelData: [string, string, string?][] = [
    ['maruti-suzuki', 'Swift', 'HATCHBACK'],
    ['maruti-suzuki', 'Swift Dzire', 'SEDAN'],
    ['maruti-suzuki', 'Wagon R', 'HATCHBACK'],
    ['maruti-suzuki', 'Baleno', 'HATCHBACK'],
    ['maruti-suzuki', 'Vitara Brezza', 'SUV'],
    ['maruti-suzuki', 'Ertiga', 'MPV'],
    ['maruti-suzuki', 'Ciaz', 'SEDAN'],
    ['maruti-suzuki', 'Alto', 'HATCHBACK'],
    ['hyundai', 'Creta', 'SUV'],
    ['hyundai', 'Venue', 'SUV'],
    ['hyundai', 'i20', 'HATCHBACK'],
    ['hyundai', 'Verna', 'SEDAN'],
    ['hyundai', 'Tucson', 'SUV'],
    ['hyundai', 'Grand i10', 'HATCHBACK'],
    ['tata', 'Nexon', 'SUV'],
    ['tata', 'Harrier', 'SUV'],
    ['tata', 'Tiago', 'HATCHBACK'],
    ['tata', 'Punch', 'SUV'],
    ['tata', 'Tigor', 'SEDAN'],
    ['tata', 'Safari', 'SUV'],
    ['mahindra', 'XUV700', 'SUV'],
    ['mahindra', 'Thar', 'SUV'],
    ['mahindra', 'Scorpio-N', 'SUV'],
    ['mahindra', 'XUV300', 'SUV'],
    ['mahindra', 'Bolero', 'SUV'],
    ['honda', 'City', 'SEDAN'],
    ['honda', 'Amaze', 'SEDAN'],
    ['honda', 'WR-V', 'SUV'],
    ['toyota', 'Fortuner', 'SUV'],
    ['toyota', 'Innova Crysta', 'MPV'],
    ['toyota', 'Glanza', 'HATCHBACK'],
    ['toyota', 'Urban Cruiser', 'SUV'],
    ['kia', 'Seltos', 'SUV'],
    ['kia', 'Sonet', 'SUV'],
    ['kia', 'Carens', 'MPV'],
    ['bmw', '3 Series', 'SEDAN'],
    ['bmw', 'X5', 'SUV'],
    ['mercedes-benz', 'C-Class', 'SEDAN'],
    ['mercedes-benz', 'GLC', 'SUV'],
    ['audi', 'A4', 'SEDAN'],
    ['audi', 'Q5', 'SUV'],
    ['mg', 'Hector', 'SUV'],
    ['mg', 'Astor', 'SUV'],
    ['renault', 'Kwid', 'HATCHBACK'],
    ['renault', 'Triber', 'MPV'],
  ]

  for (const [brandSlug, modelName, bodyType] of modelData) {
    const brandId = brandMap[brandSlug]
    if (!brandId) continue
    await db.model.upsert({
      where: { brandId_slug: { brandId, slug: modelName.toLowerCase().replace(/ /g, '-') } },
      update: {},
      create: {
        name: modelName,
        slug: modelName.toLowerCase().replace(/ /g, '-'),
        brandId,
        bodyType: bodyType as any,
      },
    })
  }
  console.log(`✅ ${modelData.length} models seeded`)

  // ─── Sample Cars ──────────────────────────────────────
  const sellerUser = await db.user.findUnique({ where: { email: 'user@meripehligadi.com' } })
  const dealer = await db.dealer.findUnique({ where: { slug: 'raj-automobiles' } })

  const marutiSwiftModel = await db.model.findFirst({ where: { slug: 'swift' } })
  const hyundaiCretaModel = await db.model.findFirst({ where: { slug: 'creta' } })
  const tataNexonModel = await db.model.findFirst({ where: { slug: 'nexon' } })
  const mahindraXuvModel = await db.model.findFirst({ where: { slug: 'xuv700' } })
  const hondaCityModel = await db.model.findFirst({ where: { slug: 'city' } })
  const toyotaFortunerModel = await db.model.findFirst({ where: { slug: 'fortuner' } })
  const kiaSeltosModel = await db.model.findFirst({ where: { slug: 'seltos' } })
  const marutiWagonModel = await db.model.findFirst({ where: { slug: 'wagon-r' } })
  const hyundaiI20Model = await db.model.findFirst({ where: { slug: 'i20' } })
  const tataPunchModel = await db.model.findFirst({ where: { slug: 'punch' } })
  const marutiDzireModel = await db.model.findFirst({ where: { slug: 'swift-dzire' } })
  const mahindraTharModel = await db.model.findFirst({ where: { slug: 'thar' } })
  const bmw3Model = await db.model.findFirst({ where: { slug: '3-series' } })
  const hyundaiVenueModel = await db.model.findFirst({ where: { slug: 'venue' } })
  const tataHarrierModel = await db.model.findFirst({ where: { slug: 'harrier' } })
  const toyotaInnovaModel = await db.model.findFirst({ where: { slug: 'innova-crysta' } })

  const sampleCars = [
    {
      title: '2023 Maruti Swift VXI', year: 2023, price: 580000, emiPrice: 10999, kmDriven: 45696,
      brandId: brandMap['maruti-suzuki'], modelId: marutiSwiftModel?.id!, fuelType: 'PETROL' as const,
      transmission: 'MANUAL' as const, ownerType: 'FIRST' as const, bodyType: 'HATCHBACK' as const,
      color: 'Red', cityId: dibrugarhCity?.id, badge: 'Certified', isCertified: true, isFeatured: true,
      conditionScore: 92, trustScore: 95, status: 'ACTIVE' as const,
    },
    {
      title: '2022 Hyundai Creta SX', year: 2022, price: 1280000, emiPrice: 23999, kmDriven: 32100,
      brandId: brandMap['hyundai'], modelId: hyundaiCretaModel?.id!, fuelType: 'DIESEL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'White', cityId: dibrugarhCity?.id, badge: 'Low Mileage', isCertified: true, isFeatured: true,
      conditionScore: 95, trustScore: 97, status: 'ACTIVE' as const,
    },
    {
      title: '2023 Tata Nexon XZ+', year: 2023, price: 950000, emiPrice: 17999, kmDriven: 18900,
      brandId: brandMap['tata'], modelId: tataNexonModel?.id!, fuelType: 'PETROL' as const,
      transmission: 'MANUAL' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'Blue', cityId: dibrugarhCity?.id, badge: 'Great Price', isCertified: true, isFeatured: true,
      conditionScore: 98, trustScore: 96, status: 'ACTIVE' as const,
    },
    {
      title: '2021 Mahindra XUV700 AX7', year: 2021, price: 1850000, emiPrice: 34999, kmDriven: 56000,
      brandId: brandMap['mahindra'], modelId: mahindraXuvModel?.id!, fuelType: 'DIESEL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'Black', cityId: dibrugarhCity?.id, badge: 'Finance Available', isFinanceAvailable: true, isFeatured: true,
      conditionScore: 88, trustScore: 90, status: 'ACTIVE' as const,
    },
    {
      title: '2022 Honda City ZX CVT', year: 2022, price: 1150000, emiPrice: 21999, kmDriven: 28500,
      brandId: brandMap['honda'], modelId: hondaCityModel?.id!, fuelType: 'PETROL' as const,
      transmission: 'CVT' as const, ownerType: 'FIRST' as const, bodyType: 'SEDAN' as const,
      color: 'Silver', cityId: dibrugarhCity?.id, badge: 'Certified', isCertified: true,
      conditionScore: 94, trustScore: 93, status: 'ACTIVE' as const,
    },
    {
      title: '2023 Toyota Fortuner Legender', year: 2023, price: 4200000, emiPrice: 79999, kmDriven: 12000,
      brandId: brandMap['toyota'], modelId: toyotaFortunerModel?.id!, fuelType: 'DIESEL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'White', cityId: dibrugarhCity?.id, badge: 'Luxury', isCertified: true, isFeatured: true,
      conditionScore: 99, trustScore: 98, status: 'ACTIVE' as const,
    },
    {
      title: '2023 Kia Seltos HTX', year: 2023, price: 1350000, emiPrice: 25999, kmDriven: 22100,
      brandId: brandMap['kia'], modelId: kiaSeltosModel?.id!, fuelType: 'DIESEL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'Grey', cityId: dibrugarhCity?.id, badge: 'New Arrival', isCertified: true,
      conditionScore: 97, trustScore: 94, status: 'ACTIVE' as const,
    },
    {
      title: '2021 Maruti Wagon R ZXI', year: 2021, price: 420000, emiPrice: 8499, kmDriven: 35000,
      brandId: brandMap['maruti-suzuki'], modelId: marutiWagonModel?.id!, fuelType: 'CNG' as const,
      transmission: 'MANUAL' as const, ownerType: 'FIRST' as const, bodyType: 'HATCHBACK' as const,
      color: 'White', cityId: dibrugarhCity?.id, badge: 'Budget Friendly',
      conditionScore: 85, trustScore: 88, status: 'ACTIVE' as const,
    },
    {
      title: '2023 Hyundai i20 Asta', year: 2023, price: 850000, emiPrice: 15999, kmDriven: 15200,
      brandId: brandMap['hyundai'], modelId: hyundaiI20Model?.id!, fuelType: 'PETROL' as const,
      transmission: 'MANUAL' as const, ownerType: 'FIRST' as const, bodyType: 'HATCHBACK' as const,
      color: 'Red', cityId: dibrugarhCity?.id, badge: 'Certified', isCertified: true, isFinanceAvailable: true,
      conditionScore: 96, trustScore: 94, status: 'ACTIVE' as const,
    },
    {
      title: '2023 Tata Punch Creative', year: 2023, price: 720000, emiPrice: 13999, kmDriven: 18900,
      brandId: brandMap['tata'], modelId: tataPunchModel?.id!, fuelType: 'PETROL' as const,
      transmission: 'MANUAL' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'Orange', cityId: dibrugarhCity?.id, badge: 'Great Price', isCertified: true,
      conditionScore: 97, trustScore: 95, status: 'ACTIVE' as const,
    },
    {
      title: '2022 Maruti Swift Dzire VXI', year: 2022, price: 780000, emiPrice: 14999, kmDriven: 41200,
      brandId: brandMap['maruti-suzuki'], modelId: marutiDzireModel?.id!, fuelType: 'PETROL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'SECOND' as const, bodyType: 'SEDAN' as const,
      color: 'Blue', cityId: dibrugarhCity?.id, badge: 'Certified', isCertified: true,
      conditionScore: 89, trustScore: 91, status: 'ACTIVE' as const,
    },
    {
      title: '2023 Mahindra Thar LX', year: 2023, price: 1650000, emiPrice: 30999, kmDriven: 8500,
      brandId: brandMap['mahindra'], modelId: mahindraTharModel?.id!, fuelType: 'DIESEL' as const,
      transmission: 'MANUAL' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'Red', cityId: dibrugarhCity?.id, badge: 'Finance Available', isFinanceAvailable: true, isFeatured: true,
      conditionScore: 99, trustScore: 97, status: 'ACTIVE' as const,
    },
    {
      title: '2020 BMW 3 Series 320d', year: 2020, price: 2800000, emiPrice: 52999, kmDriven: 45000,
      brandId: brandMap['bmw'], modelId: bmw3Model?.id!, fuelType: 'DIESEL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'SECOND' as const, bodyType: 'SEDAN' as const,
      color: 'Black', cityId: dibrugarhCity?.id, badge: 'Luxury', isCertified: true,
      conditionScore: 90, trustScore: 89, status: 'ACTIVE' as const,
    },
    {
      title: '2023 Hyundai Venue SX', year: 2023, price: 980000, emiPrice: 18999, kmDriven: 12300,
      brandId: brandMap['hyundai'], modelId: hyundaiVenueModel?.id!, fuelType: 'PETROL' as const,
      transmission: 'MANUAL' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'White', cityId: dibrugarhCity?.id, badge: 'New Arrival', isCertified: true,
      conditionScore: 98, trustScore: 96, status: 'ACTIVE' as const,
    },
    {
      title: '2022 Tata Harrier XZ+', year: 2022, price: 1750000, emiPrice: 32999, kmDriven: 38500,
      brandId: brandMap['tata'], modelId: tataHarrierModel?.id!, fuelType: 'DIESEL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'FIRST' as const, bodyType: 'SUV' as const,
      color: 'Blue', cityId: dibrugarhCity?.id, badge: 'Certified', isCertified: true, isFeatured: true,
      conditionScore: 93, trustScore: 95, status: 'ACTIVE' as const,
    },
    {
      title: '2021 Toyota Innova Crysta ZX', year: 2021, price: 2200000, emiPrice: 41999, kmDriven: 52000,
      brandId: brandMap['toyota'], modelId: toyotaInnovaModel?.id!, fuelType: 'DIESEL' as const,
      transmission: 'AUTOMATIC' as const, ownerType: 'FIRST' as const, bodyType: 'MPV' as const,
      color: 'White', cityId: dibrugarhCity?.id, badge: 'Best Family', isCertified: true,
      conditionScore: 87, trustScore: 92, status: 'ACTIVE' as const,
    },
  ]

  for (const car of sampleCars) {
    const slug = car.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
    
    // Reverse lookup brand and model names for the image mapper
    const brandName = allBrands.find(b => b.id === car.brandId)?.name || ''
    // Extract model name from title (e.g. "2023 Hyundai Venue SX" -> "Venue")
    const modelName = car.title.split(' ')[2] || ''

    const mappedImages = getCarImages(brandName, modelName)

    await db.car.upsert({
      where: { slug },
      update: {},
      create: {
        ...car,
        slug,
        sellerId: sellerUser?.id || dealerUser?.id!,
        dealerId: dealer?.id,
        description: `Well-maintained ${car.title} available for sale in ${dibrugarhCity?.name}. Single owner, regular service history. Perfect for Assam roads. All documents up to date. Insurance valid. Ready for immediate transfer.`,
        seoTitle: `${car.title} - Buy at ₹${(car.price / 100000).toFixed(2)} Lakh | MeriPehli Gadi`,
        seoDescription: `Buy ${car.title} at best price ₹${(car.price / 100000).toFixed(2)} Lakh. ${car.kmDriven.toLocaleString()} kms driven. ${car.color} color. Fully verified.`,
        viewsCount: Math.floor(Math.random() * 2000) + 500,
        images: {
          create: mappedImages.map((url, idx) => ({
            url,
            sortOrder: idx,
            alt: `${car.title} Image ${idx + 1}`
          }))
        }
      },
    })
  }
  console.log(`✅ ${sampleCars.length} sample cars seeded with mapped images`)

  // ─── FAQs ─────────────────────────────────────────────
  const faqs = [
    { question: 'How do I buy a car from MeriPehli Gadi?', answer: 'Simply browse our listings, select a car you like, and click "View Details". You can then book a test drive, apply for finance, or contact the seller directly. Our team will guide you through the entire process.', category: 'Buying' },
    { question: 'What documents are needed to buy a used car?', answer: 'You need a valid driving license, address proof (Aadhaar, Voter ID, or Passport), PAN card, and passport-size photographs. For finance, additional income documents may be required.', category: 'Buying' },
    { question: 'How does car finance work with Shani Finserve?', answer: 'Shani Finserve offers easy car loans with low EMIs, quick approval, and minimal documentation. Apply online, get instant eligibility check, and receive approval within 24-48 hours.', category: 'Finance' },
    { question: 'Is insurance available through MeriPehli Gadi?', answer: 'Yes! We offer comprehensive insurance support powered by Shani Finserve. Get new insurance, renewal, third-party, or comprehensive coverage at competitive rates.', category: 'Insurance' },
    { question: 'How do I sell my car on MeriPehli Gadi?', answer: 'List your car in 3 simple steps: Enter your car details, upload photos, and set your price. Our team will verify and list your car. Get verified buyer inquiries directly.', category: 'Selling' },
    { question: 'What is car valuation?', answer: 'Car valuation helps you determine the fair market price of your car based on its make, model, year, km driven, condition, and location. Get a free valuation online or schedule an inspection.', category: 'Selling' },
    { question: 'Are all cars certified?', answer: 'We have a special "Certified Cars" section where every car undergoes a thorough 200-point inspection. These cars come with a trust score, condition report, and verified documents.', category: 'General' },
    { question: 'Can I book a test drive?', answer: 'Yes! You can book a free test drive for any listed car. Simply click "Book Test Drive" on the car details page and select your preferred date and time.', category: 'General' },
    { question: 'Do you provide RTO transfer assistance?', answer: 'Yes, we provide complete RTO transfer assistance including documentation, form filling, and follow-up with the RTO office.', category: 'General' },
    { question: 'What is the return/exchange policy?', answer: 'For certified cars, we offer a 7-day return policy if the car doesn\'t match the description. Please refer to our Refund/Cancellation Policy page for detailed terms.', category: 'General' },
  ]

  for (const faq of faqs) {
    await db.fAQ.create({ data: faq })
  }
  console.log(`✅ ${faqs.length} FAQs seeded`)

  // ─── Testimonials ─────────────────────────────────────
  const testimonials = [
    { name: 'Rahul Sharma', designation: 'Software Engineer', city: 'Dibrugarh', content: 'MeriPehli Gadi made buying my first car so easy! Got a great deal on a certified Maruti Swift. The finance from Shani Finserve was approved in just 2 days. Highly recommended!', rating: 5 },
    { name: 'Priyanka Dutta', designation: 'Teacher', city: 'Guwahati', content: 'Sold my old car through MeriPehli Gadi. The process was smooth and I got a fair price. The team handled all the paperwork. Very professional service!', rating: 5 },
    { name: 'Bikash Borah', designation: 'Business Owner', city: 'Jorhat', content: 'I was looking for a family SUV and found a perfect Tata Harrier here. The inspection report gave me complete confidence. Best used car platform in Assam!', rating: 4 },
    { name: 'Sneha Devi', designation: 'Doctor', city: 'Tinsukia', content: 'Got my car insured through Shani Finserve via MeriPehli Gadi. The process was quick and the premium was very competitive. Great one-stop solution for car needs!', rating: 5 },
    { name: 'Mohan Singh', designation: 'Government Employee', city: 'Silchar', content: 'The EMI calculator helped me plan my budget perfectly. Bought a Hyundai Venue on easy monthly installments. Thank you MeriPehli Gadi!', rating: 5 },
    { name: 'Anjali Mahanta', designation: 'College Student', city: 'Dibrugarh', content: 'Har family ki pehli car ka sapna poora hua! Found an affordable Wagon R in great condition. MeriPehli Gadi ne sab easy kar diya!', rating: 5 },
  ]

  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }
  console.log(`✅ ${testimonials.length} testimonials seeded`)

  // ─── Banners ──────────────────────────────────────────
  const banners = [
    { title: 'Buy Certified Used Cars', subtitle: '200-point inspected cars with warranty', position: 'homepage', sortOrder: 1 },
    { title: 'Easy Car Finance', subtitle: 'Low EMI starting ₹8,999/month by Shani Finserve', position: 'homepage', sortOrder: 2 },
    { title: 'Sell Your Car Today', subtitle: 'Get best price with free valuation', position: 'homepage', sortOrder: 3 },
  ]

  for (const b of banners) {
    await db.banner.create({ data: b })
  }
  console.log(`✅ ${banners.length} banners seeded`)

  // ─── Website Settings ─────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'MeriPehli Gadi', type: 'text' },
    { key: 'site_tagline', value: 'Har family ki pehli car ka sapna, ab aur aasaan.', type: 'text' },
    { key: 'site_description', value: 'Buy, sell, finance and insure used cars with trust, transparency and local support from MeriPehli Gadi and Shani Finserve.', type: 'text' },
    { key: 'phone', value: '087219 32757', type: 'text' },
    { key: 'whatsapp_number', value: '918721932757', type: 'text' },
    { key: 'email', value: 'info@meripehligadi.com', type: 'text' },
    { key: 'address', value: 'MUKUL SHAH, C/O, opposite Vishal Mega Mart, KARTIC PARA, Dibrugarh, Assam 786001', type: 'text' },
    { key: 'hero_title', value: 'Find Your Perfect Car', type: 'text' },
    { key: 'hero_subtitle', value: 'Buy, sell, finance and insure your car with trusted support from MeriPehli Gadi and Shani Finserve.', type: 'text' },
    { key: 'facebook_url', value: '#', type: 'text' },
    { key: 'instagram_url', value: '#', type: 'text' },
    { key: 'twitter_url', value: '#', type: 'text' },
    { key: 'youtube_url', value: '#', type: 'text' },
  ]

  for (const s of settings) {
    await db.websiteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log(`✅ ${settings.length} website settings seeded`)

  console.log('\n🎉 Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
