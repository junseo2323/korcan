import { NextResponse } from 'next/server'

/**
 * 서버 콘솔에는 전체 에러를 기록하고,
 * 클라이언트에는 메시지만 반환한다.
 */
export function apiError(label: string, error: unknown, status = 500) {
    console.error(`[API Error] ${label}:`, error)
    return NextResponse.json({ error: label }, { status })
}
