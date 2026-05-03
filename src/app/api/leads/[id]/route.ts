import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// PATCH /api/leads/[id] - Update lead status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const updateLeadSchema = z.object({
      status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']).optional(),
    })

    const data = updateLeadSchema.parse(body)

    const existing = await db.lead.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const lead = await db.lead.update({
      where: { id },
      data,
      include: {
        car: { select: { id: true, title: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ lead })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Update lead error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
