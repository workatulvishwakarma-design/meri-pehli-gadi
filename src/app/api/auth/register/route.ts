import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  cityId: z.string().optional(),
  role: z.enum(['BUYER', 'SELLER', 'DEALER']).default('BUYER'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        cityId: data.cityId,
        role: data.role,
      },
      include: { city: { select: { id: true, name: true, slug: true } } },
    })

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: 'Registration successful',
        token,
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
