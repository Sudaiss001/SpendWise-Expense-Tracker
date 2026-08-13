import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'spendwise_super_secret_jwt_key_2026'
const COOKIE_NAME = 'auth_token'

export interface JwtPayload {
  userId: string
  email: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export async function setAuthCookie(payload: JwtPayload) {
  const token = signToken(payload)
  const cookieStore = await cookies()
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  const expiredOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  }
  cookieStore.set(COOKIE_NAME, '', expiredOptions)
  cookieStore.set('token', '', expiredOptions)
  cookieStore.delete(COOKIE_NAME)
  cookieStore.delete('token')
}

export async function getAuthUser(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}
