'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ChatContextType {
    isPopupOpen: boolean
    togglePopup: () => void
    activeRoomId: string | null
    openChatRoom: (roomId: string) => void
    openChatWithUser: (userId: string) => Promise<void>
    closeChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null)

    const togglePopup = () => {
        setIsPopupOpen(prev => !prev)
    }

    const openChatRoom = (roomId: string) => {
        setActiveRoomId(roomId)
        setIsPopupOpen(true)
    }

    const openChatWithUser = async (targetUserId: string) => {
        try {
            // Call API to get or create room
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId })
            })
            if (res.ok) {
                const room = await res.json()
                setActiveRoomId(room.id)
                setIsPopupOpen(true)
            } else {
                console.error("Failed to start chat")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const closeChat = () => {
        setActiveRoomId(null)
        // Keep popup open, just back to list
    }

    return (
        <ChatContext.Provider value={{
            isPopupOpen,
            togglePopup,
            activeRoomId,
            openChatRoom,
            openChatWithUser,
            closeChat
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}
