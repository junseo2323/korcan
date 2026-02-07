import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAuth = !!token
        const isRegistered = !!token?.isRegistered // We need to ensure token has this.
        // Note: 'token' in middleware comes from JWT strategy usually.
        // If using 'database' strategy, middleware might need 'getToken'. 
        // PrismaAdapter defaults to database strategy so 'session' strategy is used by default but middleware works best with JWT.
        // However, we are using PrismaAdapter.
        // Let's check session strategy. If session strategy (DB), middleware 'token' might be null or different?
        // Actually next-auth middleware creates a JWT even for database sessions if configured? 
        // Wait, with "database" strategy, the token is not a JWT, it is a session token cookie.
        // The "withAuth" middleware requires "jwt" strategy to inspect the token content easily?
        // Or we verify session against DB? No, middleware runs on edge (mostly).

        // For simplicity with DB sessions: 
        // We can just rely on the session cookie existence for "isAuth".
        // But "isRegistered" check needs user data.

        // IF we use 'jwt' strategy, it's easier.
        // IF we stick to 'database' strategy (for Prisma), we can't easily read user custom fields in middleware without a DB call (can't do DB in edge middleware usually).

        // ALTERNATIVE:
        // Switch to JWT strategy for session? 
        // User asked for "Session tokens" in prompt ("세션 토큰을 활용해서 개발해").
        // This usually implies standard session handling.
        // Let's try to see if 'req.nextauth.token' is populated if we just rely on the session cookie.

        // ACTUALLY:
        // With Database strategy, the middleware `withAuth` will populate `req.nextauth.token` ONLY IF we use `jwt` strategy?
        // Or it decodes the session token? No, session token is opacity string.

        // PLAN B for Middleware with DB Session:
        // We can't verify 'isRegistered' in middleware easily without switching to JWT.
        // The prompt says "세션 토큰을 활용해서 개발해".
        // Let's assume we can switch to JWT strategy which is standard for NextAuth even with Prisma (just for carrying payload).
        // OR we do client-side redirection in a Layout or specific wrapper. 
        // BUT middleware is better for security.

        // Let's try to switch to 'strategy: "jwt"' in authOptions? 
        // But PrismaAdapter usually enforces database sessions.
        // Wait, PrismaAdapter works with JWT strategy too.

        // Let's assume we stick to the existing DB session.
        // We can use a client-side layout check or Server Component check in valid layout.
        // Middleware is requested ("로그인 되어있지 않다면 홈에 접근 할 수 없고").
        // Basic auth check is easy in middleware (check cookie).
        // The 'isRegistered' check is harder.

        // Let's implement Basic Auth Check in Middleware.
        // For 'isRegistered', we can handle it in the root Layout or a logical wrapper.
        // OR:
        // We can modify `authOptions` to use `session: { strategy: "jwt" }`.
        // This allows middleware to see the token payload including `isRegistered`.
        // The `isRegistered` field needs to be added to the JWT callback as well.

        // Let's try to update authOptions to use JWT strategy? 
        // User said "세션 토큰을 활용해서". JWT is a token.
        // This is the most robust way to do redirection in middleware.

        const isLogin = req.nextUrl.pathname === '/login'
        const isRegister = req.nextUrl.pathname === '/register'

        if (isLogin || isRegister) {
            if (isAuth) {
                if (isRegistered && isLogin) return NextResponse.redirect(new URL('/', req.url))
                if (isRegistered && isRegister) return NextResponse.redirect(new URL('/', req.url))
                if (!isRegistered && isLogin) return NextResponse.redirect(new URL('/register', req.url))
            }
            return null
        }

        if (!isAuth) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        if (isAuth && !isRegistered) {
            return NextResponse.redirect(new URL('/register', req.url))
        }

        return null
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                console.log("Middleware Authorized:", { path: req.nextUrl.pathname, token })
                const path = req.nextUrl.pathname
                if (path.startsWith('/login') || path.startsWith('/register')) {
                    return true
                }
                return !!token
            }
        },
    }
)

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
