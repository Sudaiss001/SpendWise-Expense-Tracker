import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/jwt'

const AUTH_COOKIE_NAMES = ['auth_token', 'token']

export async function POST() {
  try {
    await removeAuthCookie()
    const response = NextResponse.json({ message: 'Logged out successfully' })
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    }
    AUTH_COOKIE_NAMES.forEach((cookieName) => {
      response.cookies.set(cookieName, '', cookieOptions)
    })
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
