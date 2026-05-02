import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { uploadFile } from '@/lib/upload'

// POST /api/upload - Upload file
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Use form field name "file"' },
        { status: 400 }
      )
    }

    const result = await uploadFile(file, folder || undefined)

    return NextResponse.json(
      { url: result.url, filename: result.filename },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
