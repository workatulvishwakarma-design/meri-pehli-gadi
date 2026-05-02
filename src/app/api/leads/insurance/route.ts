import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// POST /api/leads/insurance - Insurance lead
const insuranceLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10),
  carId: z.string().optional(),
  carBrand: z.string().optional(),
  carModel: z.string().optional(),
  carYear: z.number().int().optional(),
  registrationNumber: z.string().optional(),
  existingPolicy: z.boolean().optional(),
  previousClaim: z.boolean().optional(),
  city: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = insuranceLeadSchema.parse({
      ...body,
      email: body.email || undefined,
    })

    const user = await getUserFromRequest(request)

    const lead = await db.lead.create({
      data: {
        type: 'INSURANCE',
        name: data.name,
        email: data.email,
        phone: data.phone,
        carId: data.carId,
        message: data.message,
        userId: user?.id,
        metaData: JSON.stringify({
          carBrand: data.carBrand,
          carModel: data.carModel,
          carYear: data.carYear,
          registrationNumber: data.registrationNumber,
          existingPolicy: data.existingPolicy,
          previousClaim: data.previousClaim,
          city: data.city,
        }),
      },
      include: {
        car: { select: { id: true, title: true, price: true } },
      },
    })

    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Insurance lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
