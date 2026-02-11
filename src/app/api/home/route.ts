import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    try {
        // 1. Popular Posts (Top 5 by likes)
        // Prisma doesn't support ordering by relation aggregation in findMany easily in all versions, 
        // but we can fetch and sort or use orderBy: { likes: { _count: 'desc' } } if enabled.
        // Let's rely on updated stats or simple fetch 20 and sort in memory for MVP if DB is small, 
        // OR use the proper syntax if available. Prisma 3+ supports it.

        const popularPosts = await prisma.post.findMany({
            take: 5,
            orderBy: {
                likes: {
                    _count: 'desc'
                }
            },
            include: {
                _count: {
                    select: { likes: true, comments: true }
                },
                user: {
                    select: { name: true }
                }
            }
        })

        // 2. Today's Todos (Only if logged in)
        let incompleteTodosCount = 0
        let userName = ''

        if (session?.user?.id) {
            userName = session.user.name || '사용자'

            const { searchParams } = new URL(req.url)
            const dateStr = searchParams.get('date') // Client's "today" (YYYY-MM-DD)

            let where: any = {
                userId: session.user.id,
                isCompleted: false
            }

            if (dateStr) {
                // Determine range for that specific date (UTC coverage)
                // If saved as new Date("YYYY-MM-DD"), it's UTC midnight.
                // We should search for that range.
                const start = new Date(`${dateStr}T00:00:00.000Z`)
                const end = new Date(`${dateStr}T23:59:59.999Z`)
                // Actually, if we saved as UTC midnight, equals check is risky due to float/precision?
                // But `date` in Prisma/SQLite is exact string often.
                // Let's use range to be safe.
                // Wait, if I do `new Date("2024-02-09")` it is `2024-02-09T00:00:00.000Z`.
                // If I want to match that, I should look for it.
                // The `POST` uses `new Date(date)`.

                // Let's try to match the logic in GET /api/todos which uses local time construction `T00:00:00`.
                // Wait, `GET /api/todos` uses `new Date(${date}T00:00:00)`.
                // If running on server with UTC, that's UTC.
                // If running on local Mac (KST/PST), that's local.
                // Consistency is key.

                // The safest is to query the whole 24h range of the given date string.
                // But we need to know if the stored date is 00:00 UTC or 00:00 Local.
                // `new Date("2024-02-09")` -> UTC.
                // `new Date("2024-02-09T00:00:00")` -> Local.

                // In `POST /api/todos`: `date: new Date(date)` -> If `date` is "2024-02-09", it is UTC.
                // So todo.date is stored as 2024-02-09 00:00:00 UTC.

                // So we should search where `date >= 2024-02-09T00:00:00Z AND date <= 2024-02-09T23:59:59Z`??
                // IF stored as exactly 00:00:00 UTC, then yes.

                where.date = {
                    gte: new Date(`${dateStr}T00:00:00.000Z`),
                    lt: new Date(`${dateStr}T23:59:59.999Z`) // Covering the single point 00:00:00Z
                }
            } else {
                // Fallback to server time "today" if no date provided
                const now = new Date()
                where.date = {
                    gte: new Date(now.setHours(0, 0, 0, 0)),
                    lte: new Date(now.setHours(23, 59, 59, 999))
                }
            }

            const count = await prisma.todo.count({ where })
            incompleteTodosCount = count
        }

        // 3. Monthly Expenses (Only if logged in)
        let monthlyExpenses = { CAD: 0, KRW: 0 }

        if (session?.user?.id) {
            const { searchParams } = new URL(req.url)
            const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0]

            // Calculate start/end of month based on client date
            // dateStr is YYYY-MM-DD
            const [year, month] = dateStr.split('-').map(Number)

            // Start of Month: YYYY-MM-01 00:00:00
            const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0)

            // End of Month: YYYY-MM+1-01 00:00:00 minus 1ms
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999)

            const expenses = await prisma.expense.groupBy({
                by: ['currency'],
                _sum: {
                    amount: true
                },
                where: {
                    userId: session.user.id,
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            })

            expenses.forEach(e => {
                if (e.currency === 'CAD') monthlyExpenses.CAD = e._sum.amount || 0
                if (e.currency === 'KRW') monthlyExpenses.KRW = e._sum.amount || 0
            })
        }

        return NextResponse.json({
            user: session?.user ? { name: userName, image: session.user.image } : null,
            popularPosts: popularPosts.map(p => ({
                id: p.id,
                title: p.title,
                category: p.category,
                likes: p._count.likes,
                comments: p._count.comments
            })),
            incompleteTodosCount,
            monthlyExpenses
        })

    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 })
    }
}
