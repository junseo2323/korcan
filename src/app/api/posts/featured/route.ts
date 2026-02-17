
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Get latest Notice (공지)
        const noticePost = await prisma.post.findFirst({
            where: { category: '공지' },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, image: true } },
                _count: { select: { comments: true, likes: true } }
            }
        })

        // 2. Get a random Hot Post (Top 10 liked posts, excluding '공지' and the notice above)
        // Since Prisma doesn't support random native sort easily, we pick top 10 and select one in JS.
        const topPosts = await prisma.post.findMany({
            where: {
                category: { not: '공지' },
                id: { not: noticePost?.id }
            },
            orderBy: { likes: { _count: 'desc' } },
            take: 10,
            include: {
                user: { select: { name: true, image: true } },
                _count: { select: { comments: true, likes: true } }
            }
        })

        let hotPost = null
        if (topPosts.length > 0) {
            const randomIndex = Math.floor(Math.random() * topPosts.length)
            hotPost = topPosts[randomIndex]
        }

        return NextResponse.json({
            notice: noticePost,
            hot: hotPost
        })

    } catch (error) {
        console.error('Error fetching featured posts:', error)
        return NextResponse.json({ error: 'Failed to fetch featured posts' }, { status: 500 })
    }
}
