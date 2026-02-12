import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const region = searchParams.get('region')

    const where: any = {}
    if (category && category !== 'All') where.category = category
    if (region && region !== 'All') {
        if (region === 'Global') {
            where.region = null
        } else {
            where.region = region
        }
    }

    const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, image: true }
            },
            _count: {
                select: { comments: true, likes: true }
            },
            meetup: true // Include meetup details
        }
    })

    return NextResponse.json(posts)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, category, region, meetupData, images } = body

    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    try {
        if (category === '모임' && meetupData) {
            // Transaction for Meetup, ChatRoom, Post
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create Meetup
                const meetup = await tx.meetup.create({
                    data: {
                        title,
                        description: content,
                        date: new Date(meetupData.date),
                        maxMembers: parseInt(meetupData.maxMembers),
                        region: region === 'Global' ? 'Global' : (region || 'Unknown'),
                        image: meetupData.image || null,
                        organizerId: session.user.id,
                        participants: {
                            connect: { id: session.user.id }
                        }
                    }
                })

                // 2. Create ChatRoom
                const chatRoom = await tx.chatRoom.create({
                    data: {
                        type: 'GROUP',
                        name: title,
                        meetupId: meetup.id,
                        users: {
                            connect: { id: session.user.id }
                        }
                    }
                })

                // 3. Create Post linked to Meetup
                const post = await tx.post.create({
                    data: {
                        title,
                        content,
                        category,
                        region: region === 'Global' ? null : region,
                        userId: session.user.id,
                        meetupId: meetup.id,
                        images: images && images.length > 0 ? {
                            create: images.map((url: string) => ({ url }))
                        } : undefined
                    }
                })

                return post
            })
            return NextResponse.json(result)
        } else {
            // Normal Post
            const post = await prisma.post.create({
                data: {
                    title,
                    content,
                    category: category || '일반',
                    region: region === 'Global' ? null : region,
                    userId: session.user.id,
                    images: images && images.length > 0 ? {
                        create: images.map((url: string) => ({ url }))
                    } : undefined
                }
            })
            return NextResponse.json(post)
        }
    } catch (error: any) {
        console.error('Create Post Error:', error)
        return NextResponse.json({
            error: 'Failed to create post',
            details: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
