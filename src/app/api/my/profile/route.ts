import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const tab = searchParams.get('tab') || 'posts'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const userId = session.user.id

  const [user, postCount, commentCount, likeCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, region: true, createdAt: true },
    }),
    prisma.post.count({ where: { userId } }),
    prisma.comment.count({ where: { userId } }),
    prisma.like.count({ where: { userId, postId: { not: null } } }),
  ])

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  let items: any[] = []
  let total = 0

  if (tab === 'posts') {
    ;[items, total] = await Promise.all([
      prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          category: true,
          createdAt: true,
          views: true,
          _count: { select: { comments: true, likes: true } },
        },
      }),
      prisma.post.count({ where: { userId } }),
    ])
  } else if (tab === 'comments') {
    ;[items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          content: true,
          createdAt: true,
          post: { select: { id: true, title: true } },
        },
      }),
      prisma.comment.count({ where: { userId } }),
    ])
  } else if (tab === 'likes') {
    ;[items, total] = await Promise.all([
      prisma.like.findMany({
        where: { userId, postId: { not: null } },
        orderBy: { id: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          post: { select: { id: true, title: true, category: true, createdAt: true } },
        },
      }),
      prisma.like.count({ where: { userId, postId: { not: null } } }),
    ])
  }

  return NextResponse.json({
    user,
    stats: { posts: postCount, comments: commentCount, likes: likeCount },
    items,
    total,
    pages: Math.ceil(total / limit),
    page,
  })
}
