import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// POST /api/leads/test-drive - Test drive request
const testDriveSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10),
  carId: z.string().min(1, 'Car ID is required'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = testDriveSchema.parse({
      ...body,
      email: body.email || undefined,
    })

    const user = await getUserFromRequest(request)

    // Verify car exists
    const car = await db.car.findUnique({ where: { id: data.carId } })
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    const testDrive = await db.testDrive.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        carId: data.carId,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        message: data.message,
        userId: user?.id,
      },
      include: {
        car: { select: { id: true, title: true, price: true } },
      },
    })

    // Also create a lead entry
    await db.lead.create({
      data: {
        type: 'TEST_DRIVE',
        name: data.name,
        email: data.email,
        phone: data.phone,
        carId: data.carId,
        message: data.message,
        userId: user?.id,
        metaData: JSON.stringify({
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          testDriveId: testDrive.id,
        }),
      },
    })

    // Increment inquiries count
    await db.car.update({
      where: { id: data.carId },
      data: { inquiriesCount: { increment: 1 } },
    })

    return NextResponse.json({ testDrive }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Test drive error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
