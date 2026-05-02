import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// POST /api/leads/valuation - Valuation request
const valuationSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  variant: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  kmDriven: z.number().int().min(0),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  city: z.string().optional(),
  ownerType: z.string().optional(),
  condition: z.string().optional(),
  expectedPrice: z.number().positive().optional(),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = valuationSchema.parse({
      ...body,
      email: body.email || undefined,
    })

    const user = await getUserFromRequest(request)

    // Simple valuation estimate based on depreciation
    const currentYear = new Date().getFullYear()
    const age = Math.max(0, currentYear - data.year)
    const kmFactor = Math.max(0.3, 1 - (data.kmDriven / 150000) * 0.5)
    const conditionFactor = data.condition === 'excellent' ? 1.1 : data.condition === 'good' ? 1 : data.condition === 'fair' ? 0.85 : 0.7
    const ownerFactor = data.ownerType === 'first' ? 1 : data.ownerType === 'second' ? 0.9 : 0.8
    const ageFactor = Math.max(0.2, 1 - (age * 0.12))

    // Rough market average (this is a simplified estimate)
    const basePrice = 800000 // Base avg used car price in INR
    const estimatedPrice = Math.round(basePrice * ageFactor * kmFactor * conditionFactor * ownerFactor)

    const valuation = await db.valuationRequest.create({
      data: {
        brand: data.brand,
        model: data.model,
        variant: data.variant,
        year: data.year,
        kmDriven: data.kmDriven,
        fuelType: data.fuelType,
        transmission: data.transmission,
        city: data.city,
        ownerType: data.ownerType,
        condition: data.condition,
        expectedPrice: data.expectedPrice,
        name: data.name,
        email: data.email,
        phone: data.phone,
        estimatedPrice,
      },
    })

    // Also create a lead
    await db.lead.create({
      data: {
        type: 'VALUATION',
        name: data.name,
        email: data.email,
        phone: data.phone,
        userId: user?.id,
        metaData: JSON.stringify({
          brand: data.brand,
          model: data.model,
          variant: data.variant,
          year: data.year,
          kmDriven: data.kmDriven,
          valuationRequestId: valuation.id,
          estimatedPrice,
        }),
      },
    })

    return NextResponse.json({
      valuation,
      estimatedPrice,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Valuation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
