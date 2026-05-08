import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leads/[id]/activities
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const activities = await (db as any).leadActivity.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ activities })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
