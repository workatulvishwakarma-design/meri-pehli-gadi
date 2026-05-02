import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'meripehligadi-super-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      cityId: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      city: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!user || !user.isActive) {
    return null
  }

  return user
}

export function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Authorization header required', status: 401 }
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)
  if (!payload) {
    return { error: 'Invalid or expired token', status: 401 }
  }

  return { payload }
}

export function requireRole(...roles: string[]) {
  return (payload: JWTPayload): { error?: string; status?: number } => {
    if (!roles.includes(payload.role)) {
      return { error: 'Insufficient permissions', status: 403 }
    }
    return {}
  }
}
