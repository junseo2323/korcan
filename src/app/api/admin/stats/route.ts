import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
        totalUsers,
        newUsersThisMonth,
        todayVisitors,
        totalPosts,
        totalProducts,
        totalProperties,
        totalChatRooms,
        totalMessages,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.user.count({ where: { lastActiveAt: { gte: startOfToday } } }),
        prisma.post.count(),
        prisma.product.count(),
        prisma.property.count(),
        prisma.chatRoom.count(),
        prisma.message.count(),
    ])

    // User signups by month for the last 6 months
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const usersRaw = await prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
    })

    const monthlyMap: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthlyMap[key] = 0
    }
    usersRaw.forEach(u => {
        const d = new Date(u.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (key in monthlyMap) monthlyMap[key]++
    })

    const userGrowth = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }))

    return NextResponse.json({
        totalUsers,
        newUsersThisMonth,
        todayVisitors,
        totalPosts,
        totalProducts,
        totalProperties,
        totalChatRooms,
        totalMessages,
        userGrowth,
    })
}
