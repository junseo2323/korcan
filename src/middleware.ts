import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // 1. Bypass SEO (Explicit)
    if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
        return NextResponse.next()
    }

    // 2. Get Token
    // getToken reads the JWT from cookies. It requires NEXTAUTH_SECRET in env.
    const token = await getToken({ req })
    const isAuth = !!token
    const isRegistered = !!(token as any)?.isRegistered

    // 3. Auth Logic
    const isLogin = pathname.startsWith('/login')
    const isRegister = pathname.startsWith('/register')

    // Public pages (no login required)
    const PUBLIC_PATHS = ['/community', '/market', '/real-estate', '/jobs']
    const isPublicPath = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
    if (isPublicPath) {
        if (isAuth && !isRegistered) return NextResponse.redirect(new URL('/register', req.url))
        return NextResponse.next()
    }

    if (isLogin || isRegister) {
        if (isAuth) {
            // If logged in and registered, redirect to home
            if (isRegistered) return NextResponse.redirect(new URL('/', req.url))
            // If logged in but NOT registered, allow staying on register page (or redirect to register if on login)
            if (!isRegistered && isLogin) return NextResponse.redirect(new URL('/register', req.url))
        }
        return NextResponse.next() // Allow access to login/register pages
    }

    // Protect all other routes
    if (!isAuth) {
        const url = new URL('/login', req.url)
        url.searchParams.set('callbackUrl', req.url) // req.url is absolute or full path? standard request object.
        // Actually req.url in middleware is full URL.
        // But cleaner to just pass pathname + search?
        // NextAuth default uses full URL.
        return NextResponse.redirect(url)
    }

    // Force registration if authenticated but not registered
    if (isAuth && !isRegistered) {
        return NextResponse.redirect(new URL('/register', req.url))
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
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}
