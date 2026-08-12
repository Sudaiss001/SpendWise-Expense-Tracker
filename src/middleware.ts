import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isProtectedPage = pathname === '/' || pathname.startsWith('/dashboard')

  // Redirect unauthenticated users trying to visit protected pages to /login
  if (isProtectedPage && !authToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users visiting /login or /signup straight to /
  if (isAuthPage && authToken) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/signup'],
}
