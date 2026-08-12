import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/jwt'

export async function POST() {
  try {
    await removeAuthCookie()
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
