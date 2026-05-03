import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// POST /api/leads/finance - Finance lead
const financeLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10),
  carId: z.string().optional(),
  loanAmount: z.number().positive().optional(),
  downPayment: z.number().min(0).optional(),
  tenure: z.number().int().min(12).max(84).optional(),
  employmentType: z.string().optional(),
  monthlyIncome: z.number().positive().optional(),
  city: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = financeLeadSchema.parse({
      ...body,
      email: body.email || undefined,
    })

    const user = await getUserFromRequest(request)

    const lead = await db.lead.create({
      data: {
        type: 'FINANCE',
        name: data.name,
        email: data.email,
        phone: data.phone,
        carId: data.carId,
        message: data.message,
        userId: user?.id,
        metaData: JSON.stringify({
          loanAmount: data.loanAmount,
          downPayment: data.downPayment,
          tenure: data.tenure,
          employmentType: data.employmentType,
          monthlyIncome: data.monthlyIncome,
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
    console.error('Finance lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
