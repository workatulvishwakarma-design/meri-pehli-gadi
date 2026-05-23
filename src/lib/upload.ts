import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'public', 'uploads')

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
  }
  return map[mimeType] || '.jpg'
}

export async function uploadFile(file: File, subfolder?: string): Promise<{ url: string; filename: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`)
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  const ext = getExtension(file.type)
  const filename = `${randomUUID()}${ext}`
  const dir = subfolder ? join(UPLOAD_DIR, subfolder) : UPLOAD_DIR

  await mkdir(dir, { recursive: true })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filepath = join(dir, filename)
  await writeFile(filepath, buffer)

  const url = subfolder ? `/uploads/${subfolder}/${filename}` : `/uploads/${filename}`

  return { url, filename }
}

export async function uploadMultipleFiles(files: File[], subfolder?: string): Promise<{ url: string; filename: string }[]> {
  const results = await Promise.all(
    files.map((file) => uploadFile(file, subfolder))
  )
  return results
}
