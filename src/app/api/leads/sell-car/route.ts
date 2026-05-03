import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// POST /api/leads/sell-car - Sell car request
const sellCarSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10),
  brand: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  kmDriven: z.number().int().min(0),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  ownerType: z.string().optional(),
  color: z.string().optional(),
  registrationNumber: z.string().optional(),
  city: z.string().optional(),
  expectedPrice: z.number().positive().optional(),
  accidentHistory: z.boolean().optional(),
  description: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = sellCarSchema.parse({
      ...body,
      email: body.email || undefined,
    })

    const user = await getUserFromRequest(request)

    const lead = await db.lead.create({
      data: {
        type: 'SELL_CAR',
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        userId: user?.id,
        metaData: JSON.stringify({
          brand: data.brand,
          model: data.model,
          variant: data.variant,
          year: data.year,
          kmDriven: data.kmDriven,
          fuelType: data.fuelType,
          transmission: data.transmission,
          ownerType: data.ownerType,
          color: data.color,
          registrationNumber: data.registrationNumber,
          city: data.city,
          expectedPrice: data.expectedPrice,
          accidentHistory: data.accidentHistory,
          description: data.description,
        }),
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
    console.error('Sell car lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
