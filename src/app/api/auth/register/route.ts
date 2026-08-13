import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { setAuthCookie } from '@/lib/jwt'

const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#F97316' },
  { name: 'Rent', color: '#EC4899' },
  { name: 'Utilities', color: '#3B82F6' },
  { name: 'Salary', color: '#10B981' },
  { name: 'Inventory', color: '#14B8A6' },
  { name: 'Logistics', color: '#F59E0B' },
  { name: 'Salaries', color: '#10B981' },
  { name: 'Marketing', color: '#F43F5E' },
  { name: 'Equipment', color: '#6366F1' },
  { name: 'Software', color: '#8B5CF6' },
  { name: 'Taxes', color: '#EF4444' },
  { name: 'Misc', color: '#9CA3AF' },
]

export async function POST(req: Request) {
  try {
    const { name, email, password, businessName } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        businessName: businessName || null,
      },
    })

    // AUTO-SEED default categories for this new user
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat) => ({
        name: cat.name,
        color: cat.color,
        userId: user.id,
      })),
    })

    // Set secure HTTP-only auth cookie
    await setAuthCookie({ userId: user.id, email: user.email })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
