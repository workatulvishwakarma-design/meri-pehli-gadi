import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

// GET /api/settings - Get all settings
export async function GET() {
  try {
    const settings = await db.websiteSetting.findMany({
      orderBy: { key: 'asc' },
    })

    // Convert array to key-value object
    const settingsMap: Record<string, string | null> = {}
    settings.forEach((s) => {
      settingsMap[s.key] = s.value
    })

    return NextResponse.json({ settings: settingsMap, raw: settings })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update setting
const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().nullable().optional(),
  type: z.enum(['text', 'json', 'html']).optional(),
})

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = updateSettingSchema.parse(body)

    const setting = await db.websiteSetting.upsert({
      where: { key: data.key },
      create: {
        key: data.key,
        value: data.value ?? null,
        type: data.type || 'text',
      },
      update: {
        ...(data.value !== undefined && { value: data.value }),
        ...(data.type && { type: data.type }),
      },
    })

    return NextResponse.json({ setting })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Update setting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
