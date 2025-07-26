import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  const isMaintenancePage = request.nextUrl.pathname === '/maintenance'
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  if (!isMaintenancePage && !isAdminPage) {
    try {
      const maintenanceResponse = await fetch(`${request.nextUrl.origin}/api/maintenance-status`)
      if (maintenanceResponse.ok) {
        const { maintenanceMode } = await maintenanceResponse.json()

        if (maintenanceMode) {
          return NextResponse.redirect(new URL('/maintenance', request.url))
        }
      }
    }
    catch (error) {
      console.error('Error checking maintenance mode:', error)
    }
  }

  const isAuthPage = request.nextUrl.pathname === '/'
    || request.nextUrl.pathname.startsWith('/sign-in')
    || request.nextUrl.pathname.startsWith('/sign-up')
    || request.nextUrl.pathname.startsWith('/forgot-password')
    || request.nextUrl.pathname.startsWith('/reset-password')

  const isPublicPage = request.nextUrl.pathname.startsWith('/templates')

  if (!token && !isAuthPage && !isPublicPage) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (token && isAuthPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
