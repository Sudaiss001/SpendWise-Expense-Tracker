import { create } from 'zustand'

export const ALL_CATEGORIES = [
  'Inventory',
  'Logistics',
  'Utilities',
  'Salaries',
  'Marketing',
  'Rent',
  'Equipment',
  'Software',
  'Taxes',
  'Misc',
] as const

export type ExpenseCategory = (typeof ALL_CATEGORIES)[number]

export type PaymentMethod =
  | 'Cash'
  | 'Transfer'
  | 'Card'
  | 'POS'
  | 'Bank Transfer'
  | 'Mobile Money'
  | 'Cheque'

export interface Expense {
  id: string
  date: string
  vendor: string
  category: ExpenseCategory | string
  paymentMethod: PaymentMethod | string
  amount: number
  description?: string
  title?: string
  notes?: string
  categoryId?: string | null
  categoryColor?: string
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export interface AddExpenseData {
  date?: string
  vendor?: string
  title?: string
  category?: ExpenseCategory | string
  categoryId?: string | null
  paymentMethod: PaymentMethod | string
  amount: number | string
  description?: string
  notes?: string
  userId?: string
}

type ExpenseApiCategory = {
  id: string
  name: string
  color?: string | null
}

type ExpenseApiResponse = Partial<Omit<Expense, 'category' | 'amount'>> & {
  id?: string
  title?: string
  vendor?: string
  amount?: number | string
  paymentMethod?: PaymentMethod | string
  date?: string | Date
  notes?: string
  description?: string
  category?: ExpenseCategory | string | ExpenseApiCategory | null
  categoryId?: string | null
  userId?: string
}

interface MonthlyTrend {
  month: string
  total: number
}

interface CategoryBreakdown {
  category: string
  total: number
  color: string
}

interface ExpenseStore {
  expenses: Expense[]
  monthlyBudget: number
  isLoading: boolean
  error: string | null
  searchQuery: string
  filterCategory: ExpenseCategory | 'All' | string
  filterDateFrom: string
  filterDateTo: string
  currentPage: number
  pageSize: number
  fetchExpenses: (userId: string) => Promise<void>
  addExpense: (data: AddExpenseData) => Promise<void>
  editExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  setMonthlyBudget: (budget: number) => void
  setSearchQuery: (query: string) => void
  setFilterCategory: (category: ExpenseCategory | 'All' | string) => void
  setFilterDateFrom: (date: string) => void
  setFilterDateTo: (date: string) => void
  setCurrentPage: (page: number) => void
  resetFilters: () => void
  getTotalSpentThisMonth: () => number
  getTopCategory: () => string
  getMonthlyTrends: () => MonthlyTrend[]
  getCategoryBreakdown: () => CategoryBreakdown[]
  getFilteredExpenses: () => Expense[]
  getPaginatedExpenses: () => Expense[]
  getTotalPages: () => number
  exportCSV: () => string
  exportPDFData: () => Expense[]
}

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
  'Office Supplies': '#8B5CF6',
  Transport: '#F59E0B',
  'Meals & Entertainment': '#F97316',
  Miscellaneous: '#9CA3AF',
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message
  return fallback
}

async function getResponseErrorMessage(
  res: Response,
  fallback: string
): Promise<string> {
  let detail = ''

  try {
    const text = await res.text()

    if (text) {
      try {
        const data = JSON.parse(text)
        detail = data?.error || data?.message || text
      } catch {
        detail = text
      }
    }
  } catch {}

  const status = `${res.status} ${res.statusText}`.trim()
  return detail ? `${fallback} (${status}): ${detail}` : `${fallback} (${status})`
}

function createLocalId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `local_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function normalizeDate(date?: string | Date): string {
  if (!date) return new Date().toISOString().split('T')[0]

  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toISOString().split('T')[0]
}

function normalizeAmount(amount?: number | string): number {
  const numericAmount =
    typeof amount === 'string' ? Number.parseFloat(amount) : amount ?? 0

  return Number.isFinite(numericAmount) ? numericAmount : 0
}

function getCategoryName(
  category?: ExpenseApiResponse['category'],
  fallback?: string
): string {
  if (typeof category === 'string') return category
  if (category?.name) return category.name
  return fallback || 'Misc'
}

function normalizeExpense(
  expense: ExpenseApiResponse,
  fallback: Partial<Expense> = {}
): Expense {
  const vendor =
    expense.vendor ||
    expense.title ||
    fallback.vendor ||
    fallback.title ||
    'Untitled expense'
  const description =
    expense.description || expense.notes || fallback.description || fallback.notes
  const category = getCategoryName(expense.category, fallback.category)
  const categoryColor =
    typeof expense.category === 'object' && expense.category
      ? expense.category.color || undefined
      : fallback.categoryColor

  return {
    id: expense.id || fallback.id || createLocalId(),
    date: normalizeDate(expense.date || fallback.date),
    vendor,
    title: expense.title || fallback.title || vendor,
    category,
    paymentMethod:
      expense.paymentMethod || fallback.paymentMethod || ('Cash' as PaymentMethod),
    amount: normalizeAmount(expense.amount ?? fallback.amount),
    description,
    notes: expense.notes || fallback.notes || description,
    categoryId: expense.categoryId || fallback.categoryId,
    categoryColor,
    userId: expense.userId || fallback.userId,
    createdAt: expense.createdAt || fallback.createdAt,
    updatedAt: expense.updatedAt || fallback.updatedAt,
  }
}

function isInCurrentMonth(date: string): boolean {
  const parsedDate = new Date(date)
  const now = new Date()

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getMonth() === now.getMonth() &&
    parsedDate.getFullYear() === now.getFullYear()
  )
}

function getCategoryTotals(expenses: Expense[]): Map<string, number> {
  return expenses.reduce((totals, expense) => {
    const category = expense.category || 'Misc'
    totals.set(category, (totals.get(category) || 0) + expense.amount)
    return totals
  }, new Map<string, number>())
}

function formatCsvValue(value: string | number | undefined): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  monthlyBudget: 500000,
  isLoading: false,
  error: null,
  searchQuery: '',
  filterCategory: 'All',
  filterDateFrom: '',
  filterDateTo: '',
  currentPage: 1,
  pageSize: 8,

  fetchExpenses: async (userId: string) => {
    set({ isLoading: true, error: null })

    try {
      const res = await fetch(
        `/api/expenses?userId=${encodeURIComponent(userId)}`
      )

      if (!res.ok) throw new Error('Failed to fetch expenses')

      const data = await res.json()
      const expenses = Array.isArray(data)
        ? data.map((expense) => normalizeExpense(expense))
        : []

      set({ expenses, isLoading: false })
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Failed to fetch expenses'),
        isLoading: false,
      })
    }
  },

  addExpense: async (data) => {
    set({ isLoading: true, error: null })

    const optimisticExpense = normalizeExpense(
      {
        ...data,
        title: data.title || data.vendor,
        notes: data.notes || data.description,
      },
      { userId: data.userId }
    )

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title || data.vendor || optimisticExpense.title || optimisticExpense.vendor,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          date: data.date,
          category: data.category,
          categoryId: data.categoryId ?? null,
          userId: data.userId,
          notes: data.notes || data.description,
        }),
      })

      if (!res.ok) {
        throw new Error(await getResponseErrorMessage(res, 'Failed to save expense'))
      }

      const savedExpense = await res.json()
      const normalizedExpense = normalizeExpense(savedExpense, optimisticExpense)

      set((state) => ({
        expenses: [normalizedExpense, ...state.expenses],
        isLoading: false,
      }))
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to save expense')

      set({
        error: message,
        isLoading: false,
      })

      throw error instanceof Error ? error : new Error(message)
    }
  },

  editExpense: (id, updates) => {
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id
          ? normalizeExpense({ ...expense, ...updates, id }, expense)
          : expense
      ),
    }))
  },

  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    }))
  },

  setMonthlyBudget: (budget: number) => {
    if (!Number.isFinite(budget) || budget < 0) return
    set({ monthlyBudget: budget })
  },

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

  setFilterCategory: (category) =>
    set({ filterCategory: category, currentPage: 1 }),

  setFilterDateFrom: (date) => set({ filterDateFrom: date, currentPage: 1 }),

  setFilterDateTo: (date) => set({ filterDateTo: date, currentPage: 1 }),

  setCurrentPage: (page) => {
    const totalPages = get().getTotalPages()
    set({ currentPage: Math.min(Math.max(page, 1), totalPages) })
  },

  resetFilters: () =>
    set({
      searchQuery: '',
      filterCategory: 'All',
      filterDateFrom: '',
      filterDateTo: '',
      currentPage: 1,
    }),

  getTotalSpentThisMonth: () => {
    return get()
      .expenses.filter((expense) => isInCurrentMonth(expense.date))
      .reduce((total, expense) => total + expense.amount, 0)
  },

  getTopCategory: () => {
    const categoryTotals = getCategoryTotals(get().expenses)
    let topCategory = ''
    let topTotal = 0

    categoryTotals.forEach((total, category) => {
      if (total > topTotal) {
        topCategory = category
        topTotal = total
      }
    })

    return topCategory
  },

  getMonthlyTrends: () => {
    const now = new Date()

    return Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
      const total = get()
        .expenses.filter((expense) => {
          const expenseDate = new Date(expense.date)

          return (
            !Number.isNaN(expenseDate.getTime()) &&
            expenseDate.getMonth() === monthDate.getMonth() &&
            expenseDate.getFullYear() === monthDate.getFullYear()
          )
        })
        .reduce((sum, expense) => sum + expense.amount, 0)

      return {
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        total,
      }
    })
  },

  getCategoryBreakdown: () => {
    const categoryTotals = getCategoryTotals(get().expenses)

    return Array.from(categoryTotals.entries())
      .map(([category, total]) => ({
        category,
        total,
        color: CATEGORY_COLORS[category] || '#9CA3AF',
      }))
      .sort((a, b) => b.total - a.total)
  },

  getFilteredExpenses: () => {
    const {
      expenses,
      searchQuery,
      filterCategory,
      filterDateFrom,
      filterDateTo,
    } = get()

    const normalizedQuery = searchQuery.trim().toLowerCase()

    return expenses.filter((expense) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          expense.vendor,
          expense.category,
          expense.paymentMethod,
          expense.description,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery))

      const matchesCategory =
        filterCategory === 'All' || expense.category === filterCategory
      const matchesDateFrom = !filterDateFrom || expense.date >= filterDateFrom
      const matchesDateTo = !filterDateTo || expense.date <= filterDateTo

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo
    })
  },

  getPaginatedExpenses: () => {
    const { currentPage, pageSize } = get()
    const startIndex = (currentPage - 1) * pageSize

    return get()
      .getFilteredExpenses()
      .slice(startIndex, startIndex + pageSize)
  },

  getTotalPages: () => {
    return Math.max(1, Math.ceil(get().getFilteredExpenses().length / get().pageSize))
  },

  exportCSV: () => {
    const headers = [
      'Date',
      'Vendor',
      'Category',
      'Payment Method',
      'Amount',
      'Description',
    ]

    const rows = get().expenses.map((expense) =>
      [
        expense.date,
        expense.vendor,
        expense.category,
        expense.paymentMethod,
        expense.amount,
        expense.description,
      ]
        .map(formatCsvValue)
        .join(',')
    )

    return [headers.join(','), ...rows].join('\n')
  },

  exportPDFData: () => get().expenses,
}))
