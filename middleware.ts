import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (pathname === '/' || pathname === '/login' || pathname === '/unauthorized') {
    return NextResponse.next()
  }

  // Check for any Supabase auth cookie
  const allCookies = request.cookies.getAll()
  const hasAuthCookie = allCookies.some(c =>
    c.name.includes('auth') ||
    c.name.includes('session') ||
    c.name.includes('sb-')
  )

  // If no auth cookie, redirect to login
  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
