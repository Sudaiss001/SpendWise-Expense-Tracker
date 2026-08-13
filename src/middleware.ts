import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname === '/'

  // Redirect unauthenticated users attempting to access dashboard/protected routes strictly to /login
  if (isDashboardRoute && !authToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users visiting auth pages (/login, /signup) to home / dashboard
  if (isAuthPage && authToken) {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/signup'],
}
