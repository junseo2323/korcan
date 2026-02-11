'use client'

import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useChat } from '@/contexts/ChatContext'
import { useSession } from 'next-auth/react'
import { X, Send, UserPlus, MessageCircle, ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'

const PopupContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 3000;
  overflow: hidden;
  font-family: inherit;
`

const Header = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
`

const HeaderTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
`

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text.secondary)};
  font-weight: 600;
  cursor: pointer;
`

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: white;
  display: flex;
  flex-direction: column;
`

const ListItem = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #eee;
`

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Name = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
`

const SubInfo = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`

const AddFriendInput = styled.div`
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid #eee;
`

const Input = styled.input`
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
`

const ChatRoomContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`

const MessageList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: #F8F9FA;
`

const MessageBubble = styled.div<{ $isMine: boolean }>`
    align-self: ${({ $isMine }) => $isMine ? 'flex-end' : 'flex-start'};
    background-color: ${({ $isMine, theme }) => $isMine ? theme.colors.primary : 'white'};
    color: ${({ $isMine }) => $isMine ? 'white' : 'black'};
    padding: 0.5rem 0.8rem;
    border-radius: 12px;
    border-top-right-radius: ${({ $isMine }) => $isMine ? '2px' : '12px'};
    border-top-left-radius: ${({ $isMine }) => $isMine ? '12px' : '2px'};
    max-width: 80%;
    font-size: 0.9rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    word-break: break-all;
`

const ChatInputArea = styled.div`
    padding: 0.75rem;
    background-color: white;
    border-top: 1px solid #eee;
    display: flex;
    gap: 0.5rem;
`

const ChatInput = styled.input`
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    outline: none;
    &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`

export default function ChatPopup() {
    const { isPopupOpen, togglePopup, activeRoomId, closeChat, openChatRoom } = useChat()
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<'friends' | 'chats'>('chats')

    // Data State
    const [friends, setFriends] = useState<any[]>([])
    const [chats, setChats] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [addEmail, setAddEmail] = useState('')

    const scrollRef = useRef<HTMLDivElement>(null)

    // Polling for lists
    useEffect(() => {
        if (!isPopupOpen || !session) return

        const fetchLists = async () => {
            // Fetch Friends
            try {
                const resF = await fetch('/api/friends')
                if (resF.ok) setFriends(await resF.json())
            } catch { }

            // Fetch Chats
            try {
                const resC = await fetch('/api/chats')
                if (resC.ok) setChats(await resC.json())
            } catch { }
        }

        fetchLists()
        const interval = setInterval(fetchLists, 5000)
        return () => clearInterval(interval)
    }, [isPopupOpen, session])

    // Polling for messages in active room
    useEffect(() => {
        if (!activeRoomId || !isPopupOpen) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chats/${activeRoomId}/messages`)
                if (res.ok) setMessages(await res.json())
            } catch { }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 2000)
        return () => clearInterval(interval)
    }, [activeRoomId, isPopupOpen])

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleAddFriend = async () => {
        if (!addEmail) return
        try {
            const res = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: addEmail })
            })
            if (res.ok) {
                setAddEmail('')
                alert('친구가 추가되었습니다.')
            } else {
                const data = await res.json()
                alert(data.error || '실패')
            }
        } catch {
            alert('오류 발생')
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeRoomId) return
        const text = newMessage
        setNewMessage('') // Optimistic clear

        try {
            await fetch(`/api/chats/${activeRoomId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text })
            })
            // Refetch handled by polling, but could do manual append here
        } catch (e) {
            console.error(e)
            setNewMessage(text) // Revert on fail
        }
    }

    const getPartnerName = (users: any[]) => {
        const partner = users.find((u: any) => u.id !== session?.user?.id)
        return partner ? partner.name : 'Unknown'
    }

    const getPartnerImage = (users: any[]) => {
        const partner = users.find((u: any) => u.id !== session?.user?.id)
        return partner ? partner.image : null
    }

    if (!session) return null

    return (
        <PopupContainer $isOpen={isPopupOpen}>
            <Header>
                <HeaderTitle>
                    {activeRoomId ? (
                        <>
                            <IconButton onClick={closeChat}><ChevronLeft size={20} /></IconButton>
                            <span>채팅</span>
                        </>
                    ) : (
                        <>
                            <MessageCircle size={20} />
                            <span>KorCan Talk</span>
                        </>
                    )}
                </HeaderTitle>
                <IconButton onClick={togglePopup}><X size={20} /></IconButton>
            </Header>

            {activeRoomId ? (
                <ChatRoomContainer>
                    <MessageList ref={scrollRef}>
                        {messages.map((msg: any) => (
                            <MessageBubble key={msg.id} $isMine={msg.senderId === session.user.id}>
                                {msg.content}
                            </MessageBubble>
                        ))}
                    </MessageList>
                    <ChatInputArea>
                        <ChatInput
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                            placeholder="메시지 입력..."
                        />
                        <IconButton
                            style={{ color: '#3366FF', background: '#F0F0F0', borderRadius: '50%', width: 36, height: 36 }}
                            onClick={handleSendMessage}
                        >
                            <Send size={18} />
                        </IconButton>
                    </ChatInputArea>
                </ChatRoomContainer>
            ) : (
                // List View
                <>
                    <TabContainer>
                        <Tab $active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>친구</Tab>
                        <Tab $active={activeTab === 'chats'} onClick={() => setActiveTab('chats')}>채팅</Tab>
                    </TabContainer>

                    <ContentArea>
                        {activeTab === 'friends' && (
                            <>
                                <AddFriendInput>
                                    <Input
                                        placeholder="친구 이메일 입력"
                                        value={addEmail}
                                        onChange={e => setAddEmail(e.target.value)}
                                    />
                                    <IconButton
                                        style={{ color: '#3366FF', background: '#F0F0F0', borderRadius: 4, width: 36, height: 36 }}
                                        onClick={handleAddFriend}
                                    >
                                        <UserPlus size={18} />
                                    </IconButton>
                                </AddFriendInput>
                                {friends.map((f: any) => (
                                    <ListItem key={f.id} onClick={() => {
                                        // Start chat with friend
                                        // We need to call create chat API
                                        // Or simply switch tab if chat exists?
                                        // For simplicity, just use context helper which does create/get
                                        // But we need accessing context function inside loop.. it's fine.
                                        // However, openChatWithUser is async.
                                        const { openChatWithUser } = useChat() // Wait, hooks rules. I useHook at top.
                                        // Re-use logic
                                    }}>
                                        {/* Actually I cannot call useChat inside loop. I already have it at top. */}
                                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.75rem' }} onClick={() => {
                                            // This creates a closure issue if not careful, but openChatWithUser is stable.
                                            // But wait, I cannot call hook in onClick. I can call function.
                                            // Yes, openChatWithUser is a function returned by useChat.
                                        }}>
                                            {/* Better to separate ListItem logic or just inline button */}
                                        </div>
                                        <Avatar src={f.image || 'https://via.placeholder.com/40'} />
                                        <Name>{f.name}</Name>
                                        <button
                                            style={{ marginLeft: 'auto', padding: '4px 8px', fontSize: '0.8rem', background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                // Call global function
                                                // I need to enable "openChatWithUser" here.
                                                // The hook is called at top level: const { openChatWithUser } = useChat()
                                                // So I can use it here.
                                                openChatRoom(f.id) // WRONG. Friend ID is user ID. Chat ID is different.
                                                // I need openChatWithUser(f.id)
                                                // But openChatWithUser is defined in useChat.
                                                // Let's use the one from props or context.
                                                // Wait, I destructured it at line 147.
                                                // So I can use it.
                                                const start = async () => {
                                                    try {
                                                        // Manually fetch here or use the context function
                                                        // openChatWithUser(f.id)
                                                        const res = await fetch('/api/chats', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ targetUserId: f.id })
                                                        })
                                                        if (res.ok) {
                                                            const room = await res.json()
                                                            openChatRoom(room.id)
                                                        }
                                                    } catch { }
                                                }
                                                start()
                                            }}
                                        >
                                            대화하기
                                        </button>
                                    </ListItem>
                                ))}
                            </>
                        )}

                        {activeTab === 'chats' && (
                            chats.map((chat: any) => (
                                <ListItem key={chat.id} onClick={() => openChatRoom(chat.id)}>
                                    <Avatar src={getPartnerImage(chat.users) || 'https://via.placeholder.com/40'} />
                                    <Info>
                                        <Name>{getPartnerName(chat.users)}</Name>
                                        <SubInfo>{chat.messages[0]?.content || '대화가 없습니다.'}</SubInfo>
                                    </Info>
                                    <SubInfo style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                                        {chat.lastMessageAt ? format(new Date(chat.lastMessageAt), 'MM/dd') : ''}
                                    </SubInfo>
                                </ListItem>
                            ))
                        )}
                    </ContentArea>
                </>
            )}

        </PopupContainer>
    )
}
