import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value

  if (pathname === '/') {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  // Redirect unauthenticated users attempting to access dashboard/protected routes strictly to /login
  if (isDashboardRoute && !authToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
