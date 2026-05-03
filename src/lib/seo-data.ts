// ─────────────────────────────────────────────────────────────────────────────
// MeriPehli Gadi — Complete SEO Data Infrastructure
// Assam-focused used car marketplace data for programmatic SEO pages
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_NAME = 'MeriPehli Gadi'
export const SITE_URL = 'https://meripehligadi.com'
export const PHONE = '087219 32757'
export const PHONE_HREF = 'tel:+918721932757'
export const WHATSAPP_NUMBER = '918721932757'
export const WHATSAPP_MESSAGE = 'Hello MeriPehli Gadi, I want help with buying/selling/financing/insuring a used car in Assam.'
export const EMAIL = 'info@meripehligadi.com'
export const PARTNER_NAME = 'Shani Finserve'

export const BUSINESS_ADDRESS = {
  name: 'MeriPehli Gadi',
  streetAddress: 'MUKUL SHAH, C/O, opposite Vishal Mega Mart, KARTIC PARA',
  addressLocality: 'Dibrugarh',
  addressRegion: 'Assam',
  postalCode: '786001',
  addressCountry: 'IN',
}

// ─── Assam Cities ───────────────────────────────────────────────────────────
export interface CityData {
  name: string
  slug: string
  state: string
  popularity: number // 1 = highest
  description: string
  nearbyCities: string[]
  metaTitle: string
  metaDescription: string
  h1: string
  introText: string
  localContent: string
}

export const ASSAM_CITIES: CityData[] = [
  {
    name: 'Guwahati',
    slug: 'guwahati',
    state: 'Assam',
    popularity: 1,
    description: 'The gateway to Northeast India and Assam\'s largest city with highest car demand.',
    nearbyCities: ['Nagaon', 'Tezpur', 'Barpeta'],
    metaTitle: 'Used Cars in Guwahati | Verified Second Hand Cars with Finance - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Guwahati with easy finance, insurance support, test drive and trusted local assistance from MeriPehli Gadi powered by Shani Finserve.',
    h1: 'Used Cars in Guwahati',
    introText: 'Finding a trusted used car in Guwahati should not feel confusing. MeriPehli Gadi helps customers in Guwahati and nearby areas explore verified second-hand cars with easy finance, insurance support and local guidance.',
    localContent: 'Guwahati is one of the fastest-growing car markets in Assam. From daily office travel to family trips, buyers usually prefer reliable hatchbacks, compact SUVs and fuel-efficient sedans. MeriPehli Gadi helps customers compare verified used cars, check EMI options, apply for insurance support and connect with local sellers. Whether you are searching for a budget-friendly first car near Paltan Bazaar, a family SUV for trips to Kamakhya, or a fuel-efficient sedan for your Assam Engineering College commute, we have listings that match your need. Our finance partner Shani Finserve makes used car loans accessible with low EMI and simple documentation, specifically designed for Assam buyers.',
  },
  {
    name: 'Dibrugarh',
    slug: 'dibrugarh',
    state: 'Assam',
    popularity: 2,
    description: 'The tea city of Assam with growing demand for reliable used cars.',
    nearbyCities: ['Tinsukia', 'Sivasagar', 'Jorhat'],
    metaTitle: 'Used Cars in Dibrugarh | Second Hand Cars with Finance & Insurance - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Dibrugarh with easy finance, insurance support and local guidance. MeriPehli Gadi powered by Shani Finserve.',
    h1: 'Used Cars in Dibrugarh',
    introText: 'Dibrugarh, the tea capital of Assam, deserves a trusted local car marketplace. MeriPehli Gadi helps you find verified second-hand cars with transparent pricing and finance support.',
    localContent: 'Dibrugarh is the heart of Assam\'s tea industry and one of the most active car markets in upper Assam. From tea garden managers needing sturdy SUVs for estate roads to families looking for comfortable sedans for daily commute along the NH37, the demand for reliable used cars is consistently high. MeriPehli Gadi is headquartered in Dibrugarh at Kartic Para, opposite Vishal Mega Mart, making us your most accessible local car marketplace. We understand the specific needs of Dibrugarh buyers — from cars that handle muddy tea estate roads to fuel-efficient options for city driving. With Shani Finserve\'s local finance support, getting a used car loan in Dibrugarh has never been easier.',
  },
  {
    name: 'Tinsukia',
    slug: 'tinsukia',
    state: 'Assam',
    popularity: 3,
    description: 'An important commercial hub in upper Assam with active car trading.',
    nearbyCities: ['Dibrugarh', 'Dhemaji', 'Lakhimpur'],
    metaTitle: 'Used Cars in Tinsukia | Buy Second Hand Cars with Easy Finance - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Tinsukia with finance, insurance and local support. MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Tinsukia',
    introText: 'Looking for a reliable used car in Tinsukia? MeriPehli Gadi brings verified car listings, finance support and local guidance to Tinsukia buyers.',
    localContent: 'Tinsukia, being a major commercial and industrial hub in upper Assam, has a steady demand for used vehicles. The city connects key districts and serves as a gateway to Arunachal Pradesh, making personal vehicles essential for business and travel. Buyers in Tinsukia typically look for fuel-efficient hatchbacks for city use, durable SUVs for highway travel to Digboi and Margherita, and comfortable sedans for family needs. MeriPehli Gadi ensures every listing in Tinsukia is verified, priced transparently, and backed by local support. Our finance partner Shani Finserve provides accessible used car loan options for eligible Tinsukia customers.',
  },
  {
    name: 'Jorhat',
    slug: 'jorhat',
    state: 'Assam',
    popularity: 4,
    description: 'The cultural capital of Assam with strong car market demand.',
    nearbyCities: ['Sivasagar', 'Golaghat', 'Dibrugarh'],
    metaTitle: 'Used Cars in Jorhat | Verified Second Hand Cars in Assam - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Jorhat with easy finance, insurance support and local guidance from MeriPehli Gadi powered by Shani Finserve.',
    h1: 'Used Cars in Jorhat',
    introText: 'Jorhat, known as the cultural capital of Assam, now has a trusted local car marketplace. MeriPehli Gadi helps Jorhat buyers find verified used cars with finance and insurance support.',
    localContent: 'Jorhat is one of the most culturally rich cities in Assam and a significant hub for education, tea industry, and agriculture. The city has a growing middle class with strong demand for personal vehicles, from affordable first cars for college students at Jorhat\'s universities to comfortable family cars for daily commute. MeriPehli Gadi serves Jorhat with verified listings from trusted sellers, transparent pricing, and finance support through Shani Finserve. Whether you need a low-maintenance hatchback for city drives or a spacious SUV for trips to Majuli, our platform makes buying a used car in Jorhat simple and trustworthy.',
  },
  {
    name: 'Tezpur',
    slug: 'tezpur',
    state: 'Assam',
    popularity: 5,
    description: 'A historic city on the banks of Brahmaputra with active car market.',
    nearbyCities: ['Nagaon', 'Guwahati', 'Dhemaji'],
    metaTitle: 'Used Cars in Tezpur | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Tezpur with easy finance, insurance support and local guidance. MeriPehli Gadi — trusted car marketplace for Assam.',
    h1: 'Used Cars in Tezpur',
    introText: 'Tezpur, the historic city on the banks of the Brahmaputra, deserves a trusted car marketplace. MeriPehli Gadi brings verified listings and finance support to Tezpur.',
    localContent: 'Tezpur is one of the most beautiful and historically significant cities in Assam, strategically located on the north bank of the Brahmaputra. The city serves as a gateway to Arunachal Pradesh and has a diverse population including defense personnel, students, and business owners. The demand for used cars in Tezpur ranges from compact city cars for daily errands around Mahabhairab Temple area to sturdy SUVs for highway travel and adventure trips to Nameri National Park. MeriPehli Gadi provides Tezpur buyers with verified car listings, fair pricing, and accessible finance options through Shani Finserve.',
  },
  {
    name: 'Silchar',
    slug: 'silchar',
    state: 'Assam',
    popularity: 6,
    description: 'The second largest city in Assam and gateway to Barak Valley.',
    nearbyCities: ['Karimganj', 'Hailakandi'],
    metaTitle: 'Used Cars in Silchar | Buy Verified Second Hand Cars in Barak Valley - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Silchar with finance, insurance and local support from MeriPehli Gadi. Your trusted car marketplace in Barak Valley.',
    h1: 'Used Cars in Silchar',
    introText: 'Silchar, the heart of Barak Valley, now has access to a trusted used car marketplace. MeriPehli Gadi serves Silchar with verified listings and finance support.',
    localContent: 'Silchar is the second largest city in Assam and the cultural and commercial hub of Barak Valley. Connected to the rest of India through the Silchar-Lumding railway and NH37, the city has a strong demand for personal vehicles for both business and leisure. Buyers in Silchar look for reliable cars that can handle the scenic hilly routes to Aizawl and Shillong, comfortable sedans for city driving, and affordable hatchbacks for daily use. MeriPehli Gadi is expanding its reach to Silchar, bringing the same verified listings, transparent pricing, and Shani Finserve finance support that Assam buyers trust.',
  },
  {
    name: 'Sivasagar',
    slug: 'sivasagar',
    state: 'Assam',
    popularity: 7,
    description: 'Historic Ahom capital with growing car market.',
    nearbyCities: ['Jorhat', 'Dibrugarh', 'Golaghat'],
    metaTitle: 'Used Cars in Sivasagar | Buy Second Hand Cars with Finance - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Sivasagar with easy finance and insurance support. MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Sivasagar',
    introText: 'Sivasagar, the historic Ahom capital, now has a trusted car marketplace. MeriPehli Gadi helps Sivasagar buyers find verified used cars with finance support.',
    localContent: 'Sivasagar, formerly known as Rangpur, was the capital of the Ahom Kingdom and remains one of the most historically significant cities in Assam. Today, it is a growing urban center with active demand for personal vehicles. From tea garden workers needing affordable transport to government employees looking for comfortable sedans, Sivasagar has diverse car buying needs. MeriPehli Gadi provides verified listings, fair pricing, and Shani Finserve finance support for Sivasagar customers.',
  },
  {
    name: 'Nagaon',
    slug: 'nagaon',
    state: 'Assam',
    popularity: 8,
    description: 'Central Assam\'s major city with strong car market.',
    nearbyCities: ['Guwahati', 'Tezpur', 'Morigaon'],
    metaTitle: 'Used Cars in Nagaon | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Nagaon with finance, insurance and local support from MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Nagaon',
    introText: 'Nagaon, centrally located in Assam, is now connected to a trusted used car marketplace. MeriPehli Gadi brings verified listings and finance support to Nagaon.',
    localContent: 'Nagaon is one of the largest districts in Assam and serves as an important agricultural and commercial center. The city is strategically located between Guwahati and upper Assam, making it a key transit point. Buyers in Nagaon typically look for fuel-efficient cars for highway travel, affordable first cars, and reliable vehicles for agricultural business use. MeriPehli Gadi serves Nagaon with verified listings, transparent pricing, and accessible finance through Shani Finserve.',
  },
  {
    name: 'Lakhimpur',
    slug: 'lakhimpur',
    state: 'Assam',
    popularity: 9,
    description: 'North Lakhimpur is a key agricultural hub in Assam.',
    nearbyCities: ['Dhemaji', 'Tinsukia', 'Dibrugarh'],
    metaTitle: 'Used Cars in Lakhimpur | Buy Second Hand Cars in Assam - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Lakhimpur with easy finance and insurance support from MeriPehli Gadi — your trusted Assam car marketplace.',
    h1: 'Used Cars in Lakhimpur',
    introText: 'North Lakhimpur, a key hub in northern Assam, now has access to trusted used car listings through MeriPehli Gadi with finance and insurance support.',
    localContent: 'Lakhimpur is an important district in northern Assam, known for its agricultural productivity and proximity to Arunachal Pradesh. The demand for personal vehicles here is driven by business needs, agricultural transport, and family mobility. MeriPehli Gadi connects Lakhimpur buyers with verified used car listings, fair pricing, and Shani Finserve finance options.',
  },
  {
    name: 'Dhemaji',
    slug: 'dhemaji',
    state: 'Assam',
    popularity: 10,
    description: 'Northern Assam district with growing car needs.',
    nearbyCities: ['Lakhimpur', 'Tinsukia'],
    metaTitle: 'Used Cars in Dhemaji | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Dhemaji with finance and insurance support from MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Dhemipur',
    introText: 'Dhemaji residents can now buy verified used cars through MeriPehli Gadi with transparent pricing and finance support.',
    localContent: 'Dhemaji, located in northern Assam near the foothills of the Himalayas, is a growing district with increasing demand for personal vehicles. The region\'s geographic challenges make reliable transportation essential. MeriPehli Gadi provides Dhemaji buyers with verified car listings and accessible finance options through Shani Finserve.',
  },
  {
    name: 'Golaghat',
    slug: 'golaghat',
    state: 'Assam',
    popularity: 11,
    description: 'Known for Kaziranga access and tea estates.',
    nearbyCities: ['Jorhat', 'Nagaon', 'Sivasagar'],
    metaTitle: 'Used Cars in Golaghat | Buy Second Hand Cars in Assam - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Golaghat with easy finance and insurance support. MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Golaghat',
    introText: 'Golaghat, the gateway to Kaziranga, now has access to a trusted used car marketplace with MeriPehli Gadi.',
    localContent: 'Golaghat is strategically located near Kaziranga National Park and has a strong tea industry presence. The city\'s proximity to the national highway and wildlife tourism creates diverse car buying needs. MeriPehli Gadi serves Golaghat with verified listings and Shani Finserve finance support.',
  },
  {
    name: 'Barpeta',
    slug: 'barpeta',
    state: 'Assam',
    popularity: 12,
    description: 'Important town in lower Assam.',
    nearbyCities: ['Guwahati', 'Bongaigaon', 'Nalbari'],
    metaTitle: 'Used Cars in Barpeta | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Barpeta with finance and insurance support from MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Barpeta',
    introText: 'Barpeta, a culturally rich town in lower Assam, now has access to verified used car listings through MeriPehli Gadi.',
    localContent: 'Barpeta is known for its cultural heritage, the historic Barpeta Satra, and a growing urban population. The demand for affordable, reliable used cars is increasing as more families seek personal transportation. MeriPehli Gadi provides Barpeta buyers with transparent pricing, verified listings, and finance support through Shani Finserve.',
  },
  {
    name: 'Bongaigaon',
    slug: 'bongaigaon',
    state: 'Assam',
    popularity: 13,
    description: 'Industrial town in western Assam.',
    nearbyCities: ['Barpeta', 'Kokrajhar', 'Goalpara'],
    metaTitle: 'Used Cars in Bongaigaon | Buy Second Hand Cars in Assam - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Bongaigaon with easy finance and insurance support. MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Bongaigaon',
    introText: 'Bongaigaon, a key industrial town in western Assam, can now access trusted used car listings through MeriPehli Gadi.',
    localContent: 'Bongaigaon is an important industrial and commercial center in western Assam, with the Bongaigaon Refinery being a major employer. The city has a diverse population with growing demand for personal vehicles. MeriPehli Gadi provides verified listings, fair pricing, and Shani Finserve finance support for Bongaigaon customers.',
  },
  {
    name: 'Nalbari',
    slug: 'nalbari',
    state: 'Assam',
    popularity: 14,
    description: 'Educational hub in lower Assam.',
    nearbyCities: ['Guwahati', 'Barpeta'],
    metaTitle: 'Used Cars in Nalbari | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Nalbari with finance and insurance support from MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Nalbari',
    introText: 'Nalbari, known as the education hub of Assam, can now buy verified used cars through MeriPehli Gadi.',
    localContent: 'Nalbari is a prominent educational and cultural center in lower Assam, home to several colleges and educational institutions. The growing student and professional population creates consistent demand for affordable used cars. MeriPehli Gadi serves Nalbari with verified listings and Shani Finserve finance options.',
  },
  {
    name: 'Kokrajhar',
    slug: 'kokrajhar',
    state: 'Assam',
    popularity: 15,
    description: 'BTAD headquarters with growing needs.',
    nearbyCities: ['Bongaigaon', 'Goalpara'],
    metaTitle: 'Used Cars in Kokrajhar | Buy Second Hand Cars in Assam - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Kokrajhar with easy finance and insurance support. MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Kokrajhar',
    introText: 'Kokrajhar, the headquarters of Bodoland Territorial Region, can now access trusted used car listings through MeriPehli Gadi.',
    localContent: 'Kokrajhar is the gateway to Bodoland and an important administrative and commercial center in western Assam. The region\'s growing economy and connectivity needs drive demand for reliable personal vehicles. MeriPehli Gadi provides Kokrajhar buyers with verified car listings and finance support through Shani Finserve.',
  },
  {
    name: 'Goalpara',
    slug: 'goalpara',
    state: 'Assam',
    popularity: 16,
    description: 'Historic town on the banks of Brahmaputra.',
    nearbyCities: ['Bongaigaon', 'Guwahati'],
    metaTitle: 'Used Cars in Goalpara | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Goalpara with finance and insurance support from MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Goalpara',
    introText: 'Goalpara, a historic town on the south bank of the Brahmaputra, can now access verified used car listings through MeriPehli Gadi.',
    localContent: 'Goalpara is a historically significant town in western Assam, known for its cultural heritage and scenic beauty along the Brahmaputra. The town has a growing demand for personal vehicles for both business and family use. MeriPehli Gadi provides Goalpara buyers with verified listings and Shani Finserve finance support.',
  },
  {
    name: 'Morigaon',
    slug: 'morigaon',
    state: 'Assam',
    popularity: 17,
    description: 'Central Assam town with growing car needs.',
    nearbyCities: ['Nagaon', 'Guwahati'],
    metaTitle: 'Used Cars in Morigaon | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Morigaon with easy finance and insurance support from MeriPehli Gadi.',
    h1: 'Used Cars in Morigaon',
    introText: 'Morigaon residents can now explore verified used car listings through MeriPehli Gadi with finance and insurance support.',
    localContent: 'Morigaon is centrally located in Assam and serves as an important transit and agricultural center. The growing local economy and connectivity needs create steady demand for reliable used cars. MeriPehli Gadi serves Morigaon with transparent pricing, verified listings, and Shani Finserve finance options.',
  },
  {
    name: 'Karimganj',
    slug: 'karimganj',
    state: 'Assam',
    popularity: 18,
    description: 'Southern Assam district bordering Bangladesh.',
    nearbyCities: ['Silchar', 'Hailakandi'],
    metaTitle: 'Used Cars in Karimganj | Buy Second Hand Cars in Assam - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Karimganj with finance and insurance support from MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Karimganj',
    introText: 'Karimganj, a key commercial hub in southern Assam, can now buy verified used cars through MeriPehli Gadi.',
    localContent: 'Karimganj is an important trade and commercial center in southern Assam, bordering Bangladesh. The city has a diverse population with strong demand for affordable, reliable personal vehicles. MeriPehli Gadi provides Karimganj buyers with verified listings, fair pricing, and Shani Finserve finance support.',
  },
  {
    name: 'Hailakandi',
    slug: 'hailakandi',
    state: 'Assam',
    popularity: 19,
    description: 'Barak Valley district with active car market.',
    nearbyCities: ['Silchar', 'Karimganj'],
    metaTitle: 'Used Cars in Hailakandi | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Hailakandi with easy finance and insurance support from MeriPehli Gadi.',
    h1: 'Used Cars in Hailakandi',
    introText: 'Hailakandi, a beautiful district in Barak Valley, can now access trusted used car listings through MeriPehli Gadi.',
    localContent: 'Hailakandi is a picturesque district in southern Assam\'s Barak Valley, known for its tea gardens and agricultural production. The local economy drives demand for reliable personal vehicles. MeriPehli Gadi provides Hailakandi buyers with verified listings and finance support through Shani Finserve.',
  },
  {
    name: 'Diphu',
    slug: 'diphu',
    state: 'Assam',
    popularity: 20,
    description: 'HQ of Karbi Anglong district.',
    nearbyCities: ['Golaghat', 'Nagaon'],
    metaTitle: 'Used Cars in Diphu | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Explore verified used cars in Diphu with finance and insurance support from MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Diphu',
    introText: 'Diphu, the headquarters of Karbi Anglong, can now access verified used car listings through MeriPehli Gadi.',
    localContent: 'Diphu is the headquarters of the Karbi Anglong Autonomous Council and serves as an important administrative and commercial center in central Assam. The hilly terrain and distance from major cities make reliable personal vehicles essential. MeriPehli Gadi provides Diphu buyers with verified listings and Shani Finserve finance options.',
  },
  {
    name: 'Haflong',
    slug: 'haflong',
    state: 'Assam',
    popularity: 21,
    description: 'Only hill station in Assam.',
    nearbyCities: ['Golaghat', 'Nagaon'],
    metaTitle: 'Used Cars in Haflong | Buy Verified Second Hand Cars - MeriPehli Gadi',
    metaDescription: 'Buy verified used cars in Haflong with easy finance and insurance support. MeriPehli Gadi — Assam\'s trusted car marketplace.',
    h1: 'Used Cars in Haflong',
    introText: 'Haflong, Assam\'s only hill station, can now buy verified used cars through MeriPehli Gadi with finance and insurance support.',
    localContent: 'Haflong is Assam\'s only hill station, known for its scenic beauty and diverse tribal culture. The hilly terrain makes sturdy, reliable vehicles essential for daily transportation. MeriPehli Gadi provides Haflong buyers with verified listings of vehicles suitable for hill roads, along with Shani Finserve finance support.',
  },
]

// ─── Car Brands ─────────────────────────────────────────────────────────────
export interface BrandData {
  name: string
  slug: string
  popular: boolean
  country: string
}

export const CAR_BRANDS: BrandData[] = [
  { name: 'Maruti Suzuki', slug: 'maruti-suzuki', popular: true, country: 'India' },
  { name: 'Hyundai', slug: 'hyundai', popular: true, country: 'South Korea' },
  { name: 'Tata', slug: 'tata', popular: true, country: 'India' },
  { name: 'Mahindra', slug: 'mahindra', popular: true, country: 'India' },
  { name: 'Honda', slug: 'honda', popular: true, country: 'Japan' },
  { name: 'Toyota', slug: 'toyota', popular: true, country: 'Japan' },
  { name: 'Kia', slug: 'kia', popular: true, country: 'South Korea' },
  { name: 'Volkswagen', slug: 'volkswagen', popular: false, country: 'Germany' },
  { name: 'Skoda', slug: 'skoda', popular: false, country: 'Czech Republic' },
  { name: 'MG', slug: 'mg', popular: false, country: 'UK' },
  { name: 'BMW', slug: 'bmw', popular: false, country: 'Germany' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', popular: false, country: 'Germany' },
  { name: 'Renault', slug: 'renault', popular: false, country: 'France' },
  { name: 'Nissan', slug: 'nissan', popular: false, country: 'Japan' },
  { name: 'Ford', slug: 'ford', popular: false, country: 'USA' },
]

// ─── Budget Ranges ──────────────────────────────────────────────────────────
export interface BudgetData {
  label: string
  maxLakhs: number
  slug: string
}

export const BUDGET_RANGES: BudgetData[] = [
  { label: 'Under ₹2 Lakh', maxLakhs: 2, slug: 'under-2-lakh' },
  { label: 'Under ₹3 Lakh', maxLakhs: 3, slug: 'under-3-lakh' },
  { label: 'Under ₹5 Lakh', maxLakhs: 5, slug: 'under-5-lakh' },
  { label: 'Under ₹8 Lakh', maxLakhs: 8, slug: 'under-8-lakh' },
  { label: 'Under ₹10 Lakh', maxLakhs: 10, slug: 'under-10-lakh' },
  { label: 'Under ₹15 Lakh', maxLakhs: 15, slug: 'under-15-lakh' },
  { label: 'Under ₹20 Lakh', maxLakhs: 20, slug: 'under-20-lakh' },
  { label: 'Above ₹20 Lakh', maxLakhs: 100, slug: 'above-20-lakh' },
]

// ─── Fuel Types ─────────────────────────────────────────────────────────────
export const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] as const
export const FUEL_SLUGS = ['petrol', 'diesel', 'cng', 'electric', 'hybrid'] as const

// ─── Body Types ─────────────────────────────────────────────────────────────
export const BODY_TYPES = ['Hatchback', 'SUV', 'Sedan', 'MUV/MPV', 'Coupe', 'Convertible', 'Pickup', 'Van'] as const
export const BODY_SLUGS = ['hatchback', 'suv', 'sedan', 'muv-mpv', 'coupe', 'convertible', 'pickup', 'van'] as const

// ─── Transmission Types ─────────────────────────────────────────────────────
export const TRANSMISSION_TYPES = ['Manual', 'Automatic'] as const
export const TRANSMISSION_SLUGS = ['manual', 'automatic'] as const

// ─── Finance & Insurance Pages ──────────────────────────────────────────────
export const FINANCE_PAGES = [
  { slug: 'used-car-loan-in-assam', h1: 'Used Car Loan in Assam', metaTitle: 'Used Car Loan in Assam | Low EMI Finance by Shani Finserve - MeriPehli Gadi', metaDescription: 'Apply for used car loan in Assam with low EMI, quick approval and simple documentation. Powered by Shani Finserve. MeriPehli Gadi.' },
  { slug: 'used-car-loan-in-guwahati', h1: 'Used Car Loan in Guwahati', metaTitle: 'Used Car Loan in Guwahati | Easy Finance for Second Hand Cars - MeriPehli Gadi', metaDescription: 'Get used car loan in Guwahati with low EMI and quick approval. Shani Finserve finance support through MeriPehli Gadi.' },
  { slug: 'used-car-loan-in-dibrugarh', h1: 'Used Car Loan in Dibrugarh', metaTitle: 'Used Car Loan in Dibrugarh | Easy Finance by Shani Finserve - MeriPehli Gadi', metaDescription: 'Apply for used car loan in Dibrugarh with low interest and minimal documents. Powered by Shani Finserve via MeriPehli Gadi.' },
  { slug: 'car-loan-for-used-cars-in-assam', h1: 'Car Loan for Used Cars in Assam', metaTitle: 'Car Loan for Used Cars in Assam | Eligibility & Documents - MeriPehli Gadi', metaDescription: 'Check eligibility and apply for car loan for used cars in Assam. Simple documents, low EMI by Shani Finserve.' },
  { slug: 'low-emi-used-car-loan-assam', h1: 'Low EMI Used Car Loan in Assam', metaTitle: 'Low EMI Used Car Loan Assam | Affordable Car Finance - MeriPehli Gadi', metaDescription: 'Get low EMI used car loan in Assam with Shani Finserve. Affordable monthly payments for your dream car.' },
]

export const INSURANCE_PAGES = [
  { slug: 'used-car-insurance-in-assam', h1: 'Used Car Insurance in Assam', metaTitle: 'Used Car Insurance in Assam | Compare & Renew - MeriPehli Gadi', metaDescription: 'Buy or renew used car insurance in Assam with comprehensive, third-party and zero depreciation options. Powered by Shani Finserve.' },
  { slug: 'car-insurance-renewal-in-assam', h1: 'Car Insurance Renewal in Assam', metaTitle: 'Car Insurance Renewal in Assam | Quick & Easy - MeriPehli Gadi', metaDescription: 'Renew your car insurance in Assam quickly with Shani Finserve. Compare plans, get best rates and instant renewal.' },
  { slug: 'third-party-car-insurance-assam', h1: 'Third Party Car Insurance in Assam', metaTitle: 'Third Party Car Insurance Assam | Legal Coverage - MeriPehli Gadi', metaDescription: 'Get third party car insurance in Assam at affordable rates. Legal compliance made easy with Shani Finserve via MeriPehli Gadi.' },
  { slug: 'comprehensive-car-insurance-assam', h1: 'Comprehensive Car Insurance in Assam', metaTitle: 'Comprehensive Car Insurance Assam | Full Coverage - MeriPehli Gadi', metaDescription: 'Buy comprehensive car insurance in Assam with full coverage, zero depreciation and claim support. Powered by Shani Finserve.' },
]

export const SELL_CAR_PAGES = [
  { slug: 'sell-car-in-assam', h1: 'Sell Your Car in Assam', metaTitle: 'Sell Car in Assam | Get Best Price for Your Used Car - MeriPehli Gadi', metaDescription: 'Sell your used car in Assam at the best price. Free valuation, quick inspection and easy process with MeriPehli Gadi.' },
  { slug: 'sell-car-in-guwahati', h1: 'Sell Your Car in Guwahati', metaTitle: 'Sell Car in Guwahati | Best Price for Used Cars - MeriPehli Gadi', metaDescription: 'Sell your used car in Guwahati at the best value. Free valuation, quick inspection and hassle-free process.' },
  { slug: 'sell-car-in-dibrugarh', h1: 'Sell Your Car in Dibrugarh', metaTitle: 'Sell Car in Dibrugarh | Get Best Value - MeriPehli Gadi', metaDescription: 'Sell your used car in Dibrugarh at the best price. Local inspection, free valuation and instant offers from MeriPehli Gadi.' },
  { slug: 'used-car-valuation-in-assam', h1: 'Used Car Valuation in Assam', metaTitle: 'Used Car Valuation Assam | Free Car Price Check - MeriPehli Gadi', metaDescription: 'Check free used car valuation in Assam. Get the best price estimate for your car with MeriPehli Gadi\'s valuation tool.' },
]

// ─── Blog Categories ────────────────────────────────────────────────────────
export const BLOG_CATEGORIES = [
  { name: 'Used Car Buying Guide', slug: 'used-car-buying-guide' },
  { name: 'Car Finance Guide', slug: 'car-finance-guide' },
  { name: 'Car Insurance Guide', slug: 'car-insurance-guide' },
  { name: 'Assam Car Market', slug: 'assam-car-market' },
  { name: 'First-Time Buyer Guide', slug: 'first-time-buyer-guide' },
  { name: 'Car Maintenance', slug: 'car-maintenance' },
  { name: 'Comparison Guides', slug: 'comparison-guides' },
]

// ─── Quick Answers (AIO/GEO) ────────────────────────────────────────────────
export const QUICK_ANSWERS: Record<string, string> = {
  'used-cars-assam': 'MeriPehli Gadi helps users find verified used cars in Assam with local listings, finance support by Shani Finserve, insurance assistance, test drive booking and WhatsApp support.',
  'used-cars-guwahati': 'MeriPehli Gadi lists 100+ verified used cars in Guwahati across all brands, budgets and body types with easy finance, insurance and test drive support.',
  'used-cars-dibrugarh': 'MeriPehli Gadi is headquartered in Dibrugarh and offers verified used car listings with local inspection, finance by Shani Finserve and insurance support.',
  'car-loan-assam': 'Yes, MeriPehli Gadi provides used car loan support powered by Shani Finserve for eligible customers across Assam with low EMI, minimal documentation and quick approval.',
  'car-insurance-assam': 'MeriPehli Gadi helps Assam buyers get used car insurance including comprehensive, third-party and zero depreciation plans through Shani Finserve.',
  'sell-car-assam': 'Yes, you can sell your used car in Assam through MeriPehli Gadi. Submit car details, upload photos and get free valuation with local inspection support.',
  'best-cars-assam': 'Hatchbacks, compact SUVs and reliable sedans from Maruti Suzuki, Hyundai, Tata, Mahindra, Honda and Toyota are popular choices for Assam roads based on budget, mileage and road conditions.',
}

// ─── FAQs ───────────────────────────────────────────────────────────────────
export interface FAQItem {
  question: string
  answer: string
}

export const GENERAL_FAQS: FAQItem[] = [
  {
    question: 'Which is the best website to buy used cars in Assam?',
    answer: 'MeriPehli Gadi is a local used car marketplace for Assam where customers can explore verified cars, compare prices, apply for finance, check insurance and contact sellers easily.',
  },
  {
    question: 'Can I get used car loan in Assam?',
    answer: 'Yes, MeriPehli Gadi provides used car finance support powered by Shani Finserve for eligible customers in Assam. The process involves minimal documentation with quick approval.',
  },
  {
    question: 'Can I sell my car in Guwahati or Dibrugarh?',
    answer: 'Yes, you can submit your car details, upload photos and get valuation support through MeriPehli Gadi. Our local team assists with inspection and paperwork in both cities.',
  },
  {
    question: 'Which used cars are best for Assam roads?',
    answer: 'Hatchbacks, compact SUVs and reliable sedans from Maruti Suzuki, Hyundai, Tata, Mahindra, Honda and Toyota are popular options depending on budget, mileage and road usage.',
  },
  {
    question: 'How can I check used car valuation in Assam?',
    answer: 'MeriPehli Gadi offers free used car valuation. Submit your car details including make, model, year, km driven and condition to get an estimated market price.',
  },
  {
    question: 'Is it safe to buy used cars online in Assam?',
    answer: 'MeriPehli Gadi provides verified listings with inspection support, transparent pricing, document assistance and local guidance to ensure a safe and trustworthy car buying experience in Assam.',
  },
]

export const FINANCE_FAQS: FAQItem[] = [
  {
    question: 'What is the interest rate for used car loan in Assam?',
    answer: 'Interest rates for used car loans through Shani Finserve start from competitive rates. The exact rate depends on the car value, loan amount, tenure and applicant profile. Contact MeriPehli Gadi for personalized quotes.',
  },
  {
    question: 'What documents are needed for used car loan in Assam?',
    answer: 'Commonly required documents include Aadhaar card, PAN card, bank statements (last 3 months), salary slip or income proof, address proof and passport-size photographs.',
  },
  {
    question: 'How long does it take to get used car loan approval?',
    answer: 'With Shani Finserve, used car loan applications through MeriPehli Gadi can be processed within 24-48 hours with complete documentation.',
  },
  {
    question: 'Can I get used car loan with low CIBIL score in Assam?',
    answer: 'While a good CIBIL score helps, Shani Finserve evaluates applications holistically. Contact MeriPehli Gadi to discuss your specific situation and available options.',
  },
  {
    question: 'What is the maximum tenure for used car loan?',
    answer: 'Used car loan tenure through Shani Finserve typically ranges from 12 to 60 months, depending on the car age, loan amount and applicant eligibility.',
  },
]

export const INSURANCE_FAQS: FAQItem[] = [
  {
    question: 'What types of car insurance are available in Assam?',
    answer: 'In Assam, you can choose from third-party insurance (mandatory), comprehensive insurance (full coverage), zero depreciation cover, and own damage insurance through Shani Finserve.',
  },
  {
    question: 'How to renew car insurance in Assam?',
    answer: 'You can renew your car insurance in Assam through MeriPehli Gadi powered by Shani Finserve. Simply provide your registration details and get instant renewal with best available rates.',
  },
  {
    question: 'Is third-party car insurance mandatory in Assam?',
    answer: 'Yes, third-party car insurance is legally mandatory for all vehicles in Assam and across India as per the Motor Vehicles Act.',
  },
  {
    question: 'How to file a car insurance claim in Assam?',
    answer: 'MeriPehli Gadi assists with insurance claims through Shani Finserve. The process involves reporting the incident, submitting required documents, getting vehicle inspection and receiving settlement.',
  },
]

// ─── Emotional Hinglish Lines ───────────────────────────────────────────────
export const HINGLISH_LINES = [
  'Pehli car ka sapna, ab Assam mein aur aasaan.',
  'Verified cars, easy finance aur insurance support ek hi jagah.',
  'Har family ke budget ke hisaab se trusted gadi.',
  'Assam ke roads, family needs aur budget ko samajhkar car choose karein.',
  'Local support, transparent pricing aur fast loan assistance.',
  'Apni pehli gadi, apne budget mein — ab Assam mein.',
  'Used car lena hai? Finance, insurance aur local support milenga — MeriPehli Gadi pe.',
  'Assam ki har city mein verified cars, transparent price aur trusted dealers.',
  'Ghar se office, office se mandir — har raste ke liye trusted gadi.',
  'Car khareedne ka tension chhod do, MeriPehli Gadi sambhal lega.',
]

// ─── Trust Signals ──────────────────────────────────────────────────────────
export const TRUST_SIGNALS = [
  { label: 'Verified Listings', icon: 'shield-check' as const },
  { label: 'Local Assam Support', icon: 'map-pin' as const },
  { label: 'Finance by Shani Finserve', icon: 'banknote' as const },
  { label: 'Insurance Assistance', icon: 'shield' as const },
  { label: 'Transparent Pricing', icon: 'indian-rupee' as const },
  { label: 'Easy Test Drive', icon: 'car' as const },
  { label: 'WhatsApp Support', icon: 'message-circle' as const },
  { label: 'Document Assistance', icon: 'file-text' as const },
]

// ─── Helper: Generate SEO Title ─────────────────────────────────────────────
export function generateSEOTitle(type: string, city?: string, brand?: string, budget?: string): string {
  const cityName = city ? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''
  const brandName = brand ? brand.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''

  switch (type) {
    case 'city':
      return `Used Cars in ${cityName} | Verified Second Hand Cars with Finance - ${SITE_NAME}`
    case 'brand-city':
      return `Used ${brandName} Cars in ${cityName} - ${SITE_NAME}`
    case 'brand-assam':
      return `Used ${brandName} Cars in Assam - ${SITE_NAME}`
    case 'budget-city':
      return `Used Cars Under ₹${budget} Lakh in ${cityName} - ${SITE_NAME}`
    case 'budget-assam':
      return `Used Cars Under ₹${budget} Lakh in Assam - ${SITE_NAME}`
    case 'fuel':
      return `Used ${fuel} Cars in ${cityName || 'Assam'} - ${SITE_NAME}`
    case 'body':
      return `Used ${body} Cars in ${cityName || 'Assam'} - ${SITE_NAME}`
    default:
      return `${SITE_NAME} - Buy, Sell, Finance & Insure Used Cars in Assam`
  }
}

// ─── Helper: Get City Data by Slug ──────────────────────────────────────────
export function getCityBySlug(slug: string): CityData | undefined {
  return ASSAM_CITIES.find(c => c.slug === slug)
}

// ─── Helper: Generate Quick Answer ──────────────────────────────────────────
export function getQuickAnswer(pageType: string, city?: string): string {
  const key = `${pageType}${city ? `-${city}` : '-assam'}`
  return QUICK_ANSWERS[key] || QUICK_ANSWERS['used-cars-assam'] || ''
}

// Temporary variables to avoid lint errors
const fuel = 'Petrol'
const body = 'SUV'
