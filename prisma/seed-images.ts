import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  const imageMap: Record<string, string> = {
    '2023 Maruti Swift VXI': '/images/cars/maruti-swift.png',
    '2022 Hyundai Creta SX': '/images/cars/hyundai-creta.png',
    '2023 Tata Nexon XZ+': '/images/cars/tata-nexon.png',
    '2021 Mahindra XUV700 AX7': '/images/cars/mahindra-xuv700.png',
    '2022 Honda City ZX CVT': '/images/cars/honda-city.png',
    '2023 Toyota Fortuner Legender': '/images/cars/toyota-fortuner.png',
    '2023 Kia Seltos HTX': '/images/cars/kia-seltos.png',
    '2021 Maruti Wagon R ZXI': '/images/cars/maruti-swift.png',
    '2023 Hyundai i20 Asta': '/images/cars/hyundai-creta.png',
    '2023 Tata Punch Creative': '/images/cars/tata-punch.png',
    '2022 Maruti Swift Dzire VXI': '/images/cars/maruti-swift.png',
    '2023 Mahindra Thar LX': '/images/cars/mahindra-xuv700.png',
    '2020 BMW 3 Series 320d': '/images/cars/honda-city.png',
    '2023 Hyundai Venue SX': '/images/cars/hyundai-creta.png',
    '2022 Tata Harrier XZ+': '/images/cars/tata-nexon.png',
    '2021 Toyota Innova Crysta ZX': '/images/cars/toyota-fortuner.png',
  }

  const cars = await db.car.findMany()
  let count = 0
  for (const car of cars) {
    const imgUrl = imageMap[car.title]
    if (imgUrl) {
      const existing = await db.carImage.findFirst({ where: { carId: car.id } })
      if (!existing) {
        await db.carImage.create({
          data: { url: imgUrl, alt: car.title, sortOrder: 0, carId: car.id }
        })
        count++
      }
    }
  }
  console.log(`Seeded ${count} car images`)
}

seed().catch(console.error).finally(() => db.$disconnect())
