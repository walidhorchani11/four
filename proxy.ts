import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

/**
 * Laisser passer immédiatement les routes API (pas de locale / rewrite i18n).
 * Sinon certaines requêtes POST peuvent rester bloquées derrière le middleware.
 */
export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/trpc')
  ) {
    return NextResponse.next()
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
