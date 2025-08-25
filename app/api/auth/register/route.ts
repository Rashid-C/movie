import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'
import { hashPassword } from '@/lib/auth'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const rawEmail = typeof payload?.email === 'string' ? payload.email : ''
    const rawPassword =
      typeof payload?.password === 'string' ? payload.password : ''

    const email = rawEmail.trim().toLowerCase()
    const password = rawPassword.trim()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const existing = await User.findOne({ email }).lean()
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashed = await hashPassword(password)
    const user = await User.create({ email, password: hashed })

    return NextResponse.json(
      { message: 'User registered', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
