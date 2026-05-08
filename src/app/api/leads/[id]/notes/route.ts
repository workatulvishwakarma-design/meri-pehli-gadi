import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leads/[id]/notes
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const notes = await (db as any).leadNote.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ notes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST /api/leads/[id]/notes
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { content, authorName, authorId } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const note = await (db as any).leadNote.create({
      data: {
        leadId: id,
        content: content.trim(),
        authorName: authorName || null,
        authorId: authorId || null,
      },
    })

    // Also create activity
    await (db as any).leadActivity.create({
      data: {
        leadId: id,
        action: 'NOTE_ADDED',
        details: JSON.stringify({ noteId: note.id, preview: content.substring(0, 50) }),
        authorName: authorName || null,
        authorId: authorId || null,
      },
    })

    return NextResponse.json({ note })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
