/**
 * Car Image Mapping System v2
 * Deterministic image resolution for SSR stability.
 * Maps images from /public/images/car-images/ by brand/model keywords.
 * Provides fallback chains so no car ever renders with a broken image.
 */

// ─── All Car Images ─────────────────────────────────────────────────

export const CAR_IMAGES = [
  '/images/car-images/magnific_a-hyundai-creta-suv-stopp_2943259259.png',
  '/images/car-images/magnific_a-hyundai-venue-parked-in_2943259853.png',
  '/images/car-images/magnific_a-hyundai-venue-parked-in_2943259905.png',
  '/images/car-images/magnific_a-maruti-wagon-r-parked-i_2943257886.png',
  '/images/car-images/magnific_a-maruti-wagon-r-parked-o_2943257822.png',
  '/images/car-images/magnific_a-pristine-white-maruti-b_2943255437.png',
  '/images/car-images/magnific_a-tata-nexon-parked-on-a-_2943260696.png',
  '/images/car-images/magnific_a-tata-punch-compact-suv-_2943261541.png',
  '/images/car-images/magnific_a-tata-punch-compact-suv-_2943261547.png',
  '/images/car-images/magnific_honda-amaze-on-highway-wi_2943266883.png',
  '/images/car-images/magnific_honda-city-sedan-parked-i_2943265797.png',
  '/images/car-images/magnific_hyundai-creta-suv-parked-_2943259253.png',
  '/images/car-images/magnific_hyundai-i20-parked-on-a-b_2943258666.png',
  '/images/car-images/magnific_hyundai-i20-parked-on-a-d_2943258669.png',
  '/images/car-images/magnific_kia-seltos-parked-in-mode_2943264850.png',
  '/images/car-images/magnific_kia-seltos-parked-in-mode_2943264859.png',
  '/images/car-images/magnific_kia-seltos-parked-in-mode_2943265308.png',
  '/images/car-images/magnific_mahindra-scorpio-parked-i_2943262507.png',
  '/images/car-images/magnific_mahindra-scorpio-parked-i_2943262513.png',
  '/images/car-images/magnific_mahindra-thar-offroad-in-_2943263529.png',
  '/images/car-images/magnific_mahindra-thar-offroad-in-_2943263538.png',
  '/images/car-images/magnific_mahindra-xuv700-in-city-h_2943264364.png',
  '/images/car-images/magnific_mahindra-xuv700-in-city-h_2943264369.png',
  '/images/car-images/magnific_realistic-maruti-baleno-p_2943255430.png',
  '/images/car-images/magnific_realistic-photo-of-maruti_2943244405.png', // Swift
  '/images/car-images/magnific_realistic-photo-of-maruti_2943244444.png', // Swift
  '/images/car-images/magnific_renault-kwid-parked-in-in_2943267220.png',
  '/images/car-images/magnific_renault-kwid-parked-in-in_2943267617.png',
  '/images/car-images/magnific_renault-triber-in-suburba_2943268015.png',
  '/images/car-images/magnific_tata-nexon-parked-on-indi_2943260652.png',
  '/images/car-images/magnific_toyota-fortuner-suv-in-ur_2943298268.png',
  '/images/car-images/magnific_toyota-fortuner-suv-in-ur_2943298281.png',
  '/images/car-images/magnific_toyota-innova-crysta-park_2943272894.png',
  '/images/car-images/magnific_volkswagen-polo-parked-in_2943268600.png',
  '/images/car-images/magnific_volkswagen-polo-parked-in_2943322046.png',
  '/images/car-images/magnific_volkswagen-polo-parked-in_2943322052.png',
  '/images/car-images/magnific_volkswagen-polo-parked-in_2943322061.png',
  '/images/car-images/magnific_volkswagen-taigun-suv-on-_2943268960.png',
  '/images/car-images/magnific_volkswagen-taigun-suv-on-_2943294933.png',
  '/images/car-images/magnific_volkswagen-taigun-suv-on-_2943294940.png',
  '/images/car-images/magnific_closeup-shot-of-car-front_2943287200.png', // Detail generic
  '/images/car-images/magnific_closeup-shot-of-car-front_2943287212.png', // Detail generic
  '/images/car-images/magnific_second-hand-car-dealershi_2943296640.png', // Generic hero
  '/images/car-images/magnific_second-hand-car-dealershi_2943296643.png', // Generic hero
];

// ─── Banner Images ──────────────────────────────────────────────────

export const BANNER_IMAGES = [
  '/images/banner/magnific_cinematic-fullwidth-banne_2943316096.png',
  '/images/banner/magnific_dynamic-cinematic-banner-_2943316838.png',
  '/images/banner/magnific_full-width-cinematic-car-_2943314142.png',
  '/images/banner/magnific_full-width-financial-auto_2943315440.png',
  '/images/banner/magnific_futuristic-fullwidth-auto_2943318004.png',
  '/images/banner/magnific_luxury-automotive-showroo_2943316563.png',
  '/images/banner/magnific_ultra-premium-fullwidth-b_2943314833.png',
  '/images/banner/magnific_ultra-realistic-fullwidth_2943309870.png',
];

// ─── Fallback Image ─────────────────────────────────────────────────

export const FALLBACK_CAR_IMAGE = '/images/car-images/magnific_second-hand-car-dealershi_2943296640.png';
export const DETAIL_IMAGE_1 = '/images/car-images/magnific_closeup-shot-of-car-front_2943287200.png';
export const DETAIL_IMAGE_2 = '/images/car-images/magnific_closeup-shot-of-car-front_2943287212.png';

// ─── Deterministic Hash ─────────────────────────────────────────────

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// ─── Brand/Model Keyword Map ────────────────────────────────────────
// Maps brand keywords to specific image indices in CAR_IMAGES

const BRAND_MODEL_MAP: Record<string, number[]> = {
  // Maruti Suzuki
  'swift': [24, 25],
  'wagon': [3, 4],
  'baleno': [5, 23],
  'dzire': [24, 25],
  'brezza': [24, 23],
  'ertiga': [23, 24],
  'ciaz': [23, 25],
  'alto': [4, 3],
  'maruti': [3, 4, 5, 23, 24, 25],

  // Hyundai
  'creta': [0, 11],
  'venue': [1, 2],
  'i20': [12, 13],
  'verna': [12, 11],
  'tucson': [0, 11],
  'grand': [13, 12],
  'hyundai': [0, 1, 2, 11, 12, 13],

  // Tata
  'nexon': [6, 29],
  'punch': [7, 8],
  'harrier': [6, 29],
  'tiago': [7, 8],
  'tigor': [7, 6],
  'safari': [6, 29],
  'tata': [6, 7, 8, 29],

  // Mahindra
  'xuv700': [21, 22],
  'xuv300': [21, 22],
  'thar': [19, 20],
  'scorpio': [17, 18],
  'bolero': [17, 18],
  'mahindra': [17, 18, 19, 20, 21, 22],

  // Honda
  'city': [10],
  'amaze': [9],
  'wr-v': [10, 9],
  'honda': [9, 10],

  // Toyota
  'fortuner': [30, 31],
  'innova': [32],
  'glanza': [24, 25],
  'urban': [30, 31],
  'toyota': [30, 31, 32],

  // Kia
  'seltos': [14, 15, 16],
  'sonet': [14, 15],
  'carens': [14, 16],
  'kia': [14, 15, 16],

  // Volkswagen
  'polo': [33, 34, 35, 36],
  'taigun': [37, 38, 39],
  'volkswagen': [33, 34, 35, 36, 37, 38, 39],

  // Renault
  'kwid': [26, 27],
  'triber': [28],
  'renault': [26, 27, 28],

  // Others fallback to generic
  'bmw': [10, 30],
  'mercedes': [10, 30],
  'audi': [10, 30],
  'mg': [21, 22],
  'skoda': [33, 34],
  'nissan': [9, 10],
  'ford': [9, 10],
}

// ─── Get Images for a Car ───────────────────────────────────────────

/**
 * Returns an array of image paths for a given brand+model.
 * Fully deterministic — same input always returns same output.
 */
export function getCarImages(brand: string, model: string): string[] {
  const brandLower = brand.toLowerCase()
  const modelLower = model.toLowerCase().split(' ')[0] // first word of model

  // Try exact model match first
  if (BRAND_MODEL_MAP[modelLower]) {
    const indices = BRAND_MODEL_MAP[modelLower]
    const images = indices.map(i => CAR_IMAGES[i]).filter(Boolean)
    return [...images, DETAIL_IMAGE_1, FALLBACK_CAR_IMAGE]
  }

  // Try brand match
  const brandKey = Object.keys(BRAND_MODEL_MAP).find(key =>
    brandLower.includes(key) || key.includes(brandLower)
  )
  if (brandKey && BRAND_MODEL_MAP[brandKey]) {
    const indices = BRAND_MODEL_MAP[brandKey]
    const images = indices.slice(0, 3).map(i => CAR_IMAGES[i]).filter(Boolean)
    return [...images, DETAIL_IMAGE_2]
  }

  // Deterministic fallback based on brand+model hash
  const hash = simpleHash(`${brand}-${model}`)
  const mainIdx = hash % (CAR_IMAGES.length - 4) // Avoid the last 4 generic images
  return [
    CAR_IMAGES[mainIdx],
    CAR_IMAGES[(mainIdx + 7) % (CAR_IMAGES.length - 4)],
    DETAIL_IMAGE_1,
    FALLBACK_CAR_IMAGE,
  ]
}

/**
 * Returns a single stable main image for a car.
 */
export function getCarMainImage(brand: string, model: string): string {
  return getCarImages(brand, model)[0] || FALLBACK_CAR_IMAGE
}

// ─── Banner Helpers ─────────────────────────────────────────────────

/**
 * Returns a deterministic banner for a given page identifier.
 * Same slug always returns same banner.
 */
export function getBannerForPage(pageSlug: string): string {
  const hash = simpleHash(pageSlug)
  return BANNER_IMAGES[hash % BANNER_IMAGES.length]
}

/**
 * Legacy helper — kept for backward compatibility.
 * Now deterministic using a fixed index.
 */
export function getRandomBanner(): string {
  return BANNER_IMAGES[0]
}
