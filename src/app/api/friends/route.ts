import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { apiError } from '@/lib/apiError'

// 친구 목록 조회 (email 노출 없음)
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const friends = await prisma.friend.findMany({
            where: { userId: session.user.id },
            include: {
                friend: {
                    select: { id: true, name: true, image: true }
                }
            }
        })
        return NextResponse.json(friends.map(f => f.friend))
    } catch (error: unknown) {
        return apiError('Failed to fetch friends', error)
    }
}

// 친구 요청 보내기 (즉시 추가 아님)
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { email } = await req.json()
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

        if (email === session.user.email) {
            return NextResponse.json({ error: '자기 자신에게는 요청을 보낼 수 없습니다.' }, { status: 400 })
        }

        const targetUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, image: true }
        })

        if (!targetUser) {
            return NextResponse.json({ error: '해당 이메일의 사용자를 찾을 수 없습니다.' }, { status: 404 })
        }

        // 이미 친구인지 확인
        const alreadyFriend = await prisma.friend.findUnique({
            where: { userId_friendId: { userId: session.user.id, friendId: targetUser.id } }
        })
        if (alreadyFriend) {
            return NextResponse.json({ error: '이미 친구입니다.' }, { status: 400 })
        }

        // 이미 요청을 보냈거나 받은 경우 확인
        const existing = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: targetUser.id },
                    { senderId: targetUser.id, receiverId: session.user.id },
                ],
                status: 'PENDING'
            }
        })
        if (existing) {
            return NextResponse.json({ error: '이미 대기 중인 친구 요청이 있습니다.' }, { status: 400 })
        }

        const request = await prisma.friendRequest.create({
            data: { senderId: session.user.id, receiverId: targetUser.id }
        })

        return NextResponse.json({ success: true, requestId: request.id })
    } catch (error: unknown) {
        return apiError('Failed to send friend request', error)
    }
}
