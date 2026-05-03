import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { uploadMultipleFiles } from '@/lib/upload'
import { z } from 'zod'

const uploadImagesSchema = z.object({
  images: z.array(z.any()).min(1).max(10),
  alt: z.string().optional(),
})

// POST /api/cars/[id]/images - Upload car images
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const car = await db.car.findUnique({ where: { id } })
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      )
    }

    const uploadedImages = await uploadMultipleFiles(files, 'cars')

    const existingImageCount = await db.carImage.count({ where: { carId: id } })

    const carImages = await Promise.all(
      uploadedImages.map((img, index) =>
        db.carImage.create({
          data: {
            url: img.url,
            alt: formData.get('alt') as string || `${car.title} - Image ${existingImageCount + index + 1}`,
            sortOrder: existingImageCount + index,
            carId: id,
          },
        })
      )
    )

    return NextResponse.json({ images: carImages }, { status: 201 })
  } catch (error) {
    console.error('Upload car images error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
