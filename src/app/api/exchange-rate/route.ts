import { NextResponse } from 'next/server'

export async function GET() {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    try {
        const res = await fetch(
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=CAD&to_currency=KRW&apikey=${apiKey}`,
            { next: { revalidate: 3600 } } // 1시간 캐시
        )
        const data = await res.json()
        const rate = data['Realtime Currency Exchange Rate']?.['5. Exchange Rate']

        if (!rate) {
            return NextResponse.json({ error: 'Invalid response from API' }, { status: 502 })
        }

        return NextResponse.json({ rate: parseFloat(rate) })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: 500 })
    }
}
