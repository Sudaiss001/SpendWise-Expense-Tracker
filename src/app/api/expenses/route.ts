import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CATEGORY_COLORS: Record<string, string> = {
  Inventory: '#14B8A6',
  Logistics: '#F59E0B',
  Utilities: '#3B82F6',
  Salaries: '#10B981',
  Marketing: '#F43F5E',
  Rent: '#EC4899',
  Equipment: '#6366F1',
  Software: '#8B5CF6',
  Taxes: '#EF4444',
  Misc: '#9CA3AF',
}

const CATEGORY_NAMES = Object.keys(CATEGORY_COLORS)

async function ensureDemoUser(userId: string) {
  if (userId !== 'user_1') return

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'demo@spendwise.local',
      password: 'demo-password',
      businessName: 'Demo Business',
    },
  })
}

function optionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

async function findOrCreateCategory(name: string, userId: string) {
  const existingCategory = await prisma.category.findFirst({
    where: { name, userId },
  })

  if (existingCategory) return existingCategory

  return prisma.category.create({
    data: {
      name,
      color: CATEGORY_COLORS[name] || '#8B5CF6',
      userId,
    },
  })
}

async function resolveCategoryId(categoryId: unknown, category: unknown, userId: string) {
  const selectedCategoryId = optionalString(categoryId)

  if (selectedCategoryId) {
    const existingCategory = await prisma.category.findFirst({
      where: { id: selectedCategoryId, userId },
    })

    if (existingCategory) return existingCategory.id

    if (CATEGORY_NAMES.includes(selectedCategoryId)) {
      const fallbackCategory = await findOrCreateCategory(selectedCategoryId, userId)
      return fallbackCategory.id
    }
  }

  const categoryName = optionalString(category)

  if (categoryName) {
    const fallbackCategory = await findOrCreateCategory(categoryName, userId)
    return fallbackCategory.id
  }

  return null
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, amount, paymentMethod, date, categoryId, category, userId, notes } = await req.json()
    const parsedAmount = parseFloat(amount)

    if (!title || Number.isNaN(parsedAmount) || !paymentMethod || !userId) {
      return NextResponse.json({ error: 'Missing required expense fields' }, { status: 400 })
    }

    await ensureDemoUser(userId)

    const resolvedCategoryId = await resolveCategoryId(categoryId, category, userId)

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parsedAmount,
        paymentMethod,
        date: new Date(date || new Date().toISOString()),
        notes,
        userId,
        categoryId: resolvedCategoryId,
      },
      include: { category: true },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 })
  }
}
