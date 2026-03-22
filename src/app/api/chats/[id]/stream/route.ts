import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addListener, removeListener } from '@/lib/sseChannel'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return new Response('Unauthorized', { status: 401 })

    const { id: roomId } = await params

    // 채팅방 멤버 확인
    const room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
        include: { users: { select: { id: true } } }
    })

    if (!room || !room.users.find(u => u.id === session.user.id)) {
        return new Response('Access denied', { status: 403 })
    }

    let controller: ReadableStreamDefaultController<Uint8Array>

    const stream = new ReadableStream<Uint8Array>({
        start(c) {
            controller = c
            addListener(roomId, controller)
            // 초기 연결 ping
            c.enqueue(new TextEncoder().encode(': ping\n\n'))
        },
        cancel() {
            removeListener(roomId, controller)
        }
    })

    // 클라이언트 disconnect 감지
    req.signal.addEventListener('abort', () => {
        removeListener(roomId, controller)
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Nginx 버퍼링 비활성화
        }
    })
}
