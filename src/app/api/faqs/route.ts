import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error('FAQs API error:', error)
    return NextResponse.json({ faqs: [] }, { status: 500 })
  }
}
