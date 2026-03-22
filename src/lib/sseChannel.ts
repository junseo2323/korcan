type Controller = ReadableStreamDefaultController<Uint8Array>

// roomId → 연결된 SSE 컨트롤러 집합
const channels = new Map<string, Set<Controller>>()

export function addListener(roomId: string, controller: Controller) {
    if (!channels.has(roomId)) channels.set(roomId, new Set())
    channels.get(roomId)!.add(controller)
}

export function removeListener(roomId: string, controller: Controller) {
    const set = channels.get(roomId)
    if (!set) return
    set.delete(controller)
    if (set.size === 0) channels.delete(roomId)
}

export function broadcast(roomId: string, data: object) {
    const listeners = channels.get(roomId)
    if (!listeners || listeners.size === 0) return
    const encoded = new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
    for (const controller of [...listeners]) {
        try {
            controller.enqueue(encoded)
        } catch {
            // 연결이 끊긴 클라이언트는 제거
            listeners.delete(controller)
        }
    }
}
