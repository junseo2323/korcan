import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { apiError } from '@/lib/apiError'

// 받은 친구 요청 목록 조회
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const requests = await prisma.friendRequest.findMany({
            where: { receiverId: session.user.id, status: 'PENDING' },
            include: {
                sender: { select: { id: true, name: true, image: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(requests)
    } catch (error: unknown) {
        return apiError('Failed to fetch friend requests', error)
    }
}

// 친구 요청 수락 또는 거절
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { requestId, action } = await req.json() // action: 'accept' | 'decline'
        if (!requestId || !['accept', 'decline'].includes(action)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId }
        })

        if (!request || request.receiverId !== session.user.id) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 })
        }

        if (request.status !== 'PENDING') {
            return NextResponse.json({ error: '이미 처리된 요청입니다.' }, { status: 400 })
        }

        if (action === 'accept') {
            await prisma.$transaction([
                prisma.friendRequest.update({
                    where: { id: requestId },
                    data: { status: 'ACCEPTED' }
                }),
                // 양방향 Friend 생성
                prisma.friend.upsert({
                    where: { userId_friendId: { userId: request.senderId, friendId: request.receiverId } },
                    update: {},
                    create: { userId: request.senderId, friendId: request.receiverId }
                }),
                prisma.friend.upsert({
                    where: { userId_friendId: { userId: request.receiverId, friendId: request.senderId } },
                    update: {},
                    create: { userId: request.receiverId, friendId: request.senderId }
                }),
            ])
            return NextResponse.json({ success: true, action: 'accepted' })
        } else {
            await prisma.friendRequest.update({
                where: { id: requestId },
                data: { status: 'DECLINED' }
            })
            return NextResponse.json({ success: true, action: 'declined' })
        }
    } catch (error: unknown) {
        return apiError('Failed to process friend request', error)
    }
}
