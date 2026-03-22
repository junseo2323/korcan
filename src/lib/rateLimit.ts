import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
    count: number
    resetAt: number
}

// 인메모리 스토어 (단일 컨테이너 환경에서 유효)
const store = new Map<string, RateLimitEntry>()

// 오래된 엔트리 정리 (메모리 누수 방지)
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key)
    }
}, 60_000)

/**
 * IP + prefix 조합으로 레이트 리밋 적용.
 * 한도 초과 시 429 응답을 반환하고, 정상이면 null을 반환한다.
 */
export function checkRateLimit(
    req: NextRequest | Request,
    prefix: string,
    { limit, windowMs }: { limit: number; windowMs: number }
): NextResponse | null {
    const ip =
        (req as NextRequest).headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        (req as NextRequest).headers?.get('x-real-ip') ||
        'unknown'

    const key = `${prefix}:${ip}`
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + windowMs })
        return null
    }

    if (entry.count >= limit) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
        return NextResponse.json(
            { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
            {
                status: 429,
                headers: { 'Retry-After': String(retryAfter) },
            }
        )
    }

    entry.count++
    return null
}
