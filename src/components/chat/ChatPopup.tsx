'use client'

import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { useChat } from '@/contexts/ChatContext'
import { useSession } from 'next-auth/react'
import { X, Send, UserPlus, MessageCircle, ChevronLeft, Check, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`

const popIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

const PopupContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 3000;
  overflow: hidden;
  font-family: inherit;
  background-color: white;

  inset: 0;
  border-radius: 0;
  box-shadow: none;
  animation: ${({ $isOpen }) => $isOpen ? slideUp : 'none'} 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  @media (min-width: 768px) {
    inset: auto;
    bottom: 80px;
    right: 20px;
    width: 350px;
    height: 500px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    border: 1px solid ${({ theme }) => theme.colors.neutral.gray200};
    animation: ${({ $isOpen }) => $isOpen ? popIn : 'none'} 0.2s ease;
  }
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

const SectionLabel = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: ${({ theme }) => theme.colors.neutral.gray100};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const AddFriendInput = styled.div`
    padding: 0.75rem 1rem;
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
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
    background-color: white;
    border-top: 1px solid #eee;
    display: flex;
    gap: 0.5rem;

    @media (min-width: 768px) {
        padding-bottom: 0.75rem;
    }
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

const ActionBtn = styled.button<{ $variant?: 'accept' | 'decline' }>`
  padding: 4px 8px;
  font-size: 0.78rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ $variant }) =>
    $variant === 'accept' ? '#dcfce7' : $variant === 'decline' ? '#fee2e2' : '#eee'};
  color: ${({ $variant }) =>
    $variant === 'accept' ? '#166534' : $variant === 'decline' ? '#991b1b' : '#333'};
`

export default function ChatPopup() {
    const { isPopupOpen, togglePopup, activeRoomId, closeChat, openChatRoom } = useChat()
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<'friends' | 'chats'>('chats')

    const [friends, setFriends] = useState<any[]>([])
    const [friendRequests, setFriendRequests] = useState<any[]>([])
    const [chats, setChats] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [addEmail, setAddEmail] = useState('')

    const scrollRef = useRef<HTMLDivElement>(null)

    // 친구 목록 + 채팅 목록 폴링 (5초)
    useEffect(() => {
        if (!isPopupOpen || !session) return

        const fetchLists = async () => {
            try {
                const [resF, resC, resR] = await Promise.all([
                    fetch('/api/friends'),
                    fetch('/api/chats'),
                    fetch('/api/friends/requests'),
                ])
                if (resF.ok) setFriends(await resF.json())
                if (resC.ok) setChats(await resC.json())
                if (resR.ok) setFriendRequests(await resR.json())
            } catch { }
        }

        fetchLists()
        const interval = setInterval(fetchLists, 5000)
        return () => clearInterval(interval)
    }, [isPopupOpen, session])

    // SSE 실시간 메시지
    useEffect(() => {
        if (!activeRoomId || !isPopupOpen) return

        // 초기 메시지 로드
        fetch(`/api/chats/${activeRoomId}/messages`)
            .then(r => r.ok ? r.json() : [])
            .then(setMessages)
            .catch(() => { })

        // SSE 연결
        const es = new EventSource(`/api/chats/${activeRoomId}/stream`)
        es.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data)
                if (data.type === 'message') {
                    setMessages(prev => {
                        // 중복 방지
                        if (prev.find(m => m.id === data.message.id)) return prev
                        return [...prev, data.message]
                    })
                }
            } catch { }
        }

        return () => {
            es.close()
            setMessages([])
        }
    }, [activeRoomId, isPopupOpen])

    // 메시지 스크롤
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
            const data = await res.json()
            if (res.ok) {
                setAddEmail('')
                toast.success('친구 요청을 보냈습니다.')
            } else {
                toast.error(data.error || '요청 실패')
            }
        } catch {
            toast.error('오류 발생')
        }
    }

    const handleFriendRequest = async (requestId: string, action: 'accept' | 'decline') => {
        try {
            const res = await fetch('/api/friends/requests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, action })
            })
            if (res.ok) {
                setFriendRequests(prev => prev.filter(r => r.id !== requestId))
                if (action === 'accept') {
                    toast.success('친구 요청을 수락했습니다.')
                    // 친구 목록 새로고침
                    fetch('/api/friends').then(r => r.json()).then(setFriends).catch(() => { })
                } else {
                    toast.success('친구 요청을 거절했습니다.')
                }
            }
        } catch {
            toast.error('오류 발생')
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeRoomId) return
        const text = newMessage
        setNewMessage('')

        try {
            const res = await fetch(`/api/chats/${activeRoomId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text })
            })
            if (res.ok) {
                const msg = await res.json()
                // 발신자 낙관적 추가 (SSE가 중복 방지 처리함)
                setMessages(prev => {
                    if (prev.find(m => m.id === msg.id)) return prev
                    return [...prev, msg]
                })
            } else {
                setNewMessage(text)
            }
        } catch {
            setNewMessage(text)
        }
    }

    const getChatName = (chat: any) => {
        if (chat.type === 'GROUP') return chat.name || 'Group Chat'
        const partner = chat.users.find((u: any) => u.id !== session?.user?.id)
        return partner ? partner.name : 'Unknown'
    }

    const getChatImage = (chat: any) => {
        if (chat.type === 'GROUP') return null
        const partner = chat.users.find((u: any) => u.id !== session?.user?.id)
        return partner ? partner.image : null
    }

    const activeChat = chats.find(c => c.id === activeRoomId)

    if (!session) return null

    return (
        <PopupContainer $isOpen={isPopupOpen}>
            <Header>
                <HeaderTitle>
                    {activeRoomId ? (
                        <>
                            <IconButton onClick={closeChat}><ChevronLeft size={20} /></IconButton>
                            <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {activeChat ? getChatName(activeChat) : '채팅'}
                            </span>
                            {activeChat?.type === 'GROUP' && (
                                <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: '4px' }}>
                                    ({activeChat.users.length})
                                </span>
                            )}
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
                            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.senderId === session.user.id ? 'flex-end' : 'flex-start' }}>
                                {activeChat?.type === 'GROUP' && msg.senderId !== session.user.id && (
                                    <span style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px', marginLeft: '4px' }}>
                                        {msg.sender?.name || 'Unknown'}
                                    </span>
                                )}
                                <MessageBubble $isMine={msg.senderId === session.user.id}>
                                    {msg.content}
                                </MessageBubble>
                            </div>
                        ))}
                    </MessageList>
                    <ChatInputArea>
                        <ChatInput
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => {
                                if (e.nativeEvent.isComposing) return
                                if (e.key === 'Enter') handleSendMessage()
                            }}
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
                <>
                    <TabContainer>
                        <Tab $active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
                            친구{friendRequests.length > 0 ? ` (${friendRequests.length})` : ''}
                        </Tab>
                        <Tab $active={activeTab === 'chats'} onClick={() => setActiveTab('chats')}>채팅</Tab>
                    </TabContainer>

                    <ContentArea>
                        {activeTab === 'friends' && (
                            <>
                                {/* 친구 요청 보내기 */}
                                <AddFriendInput>
                                    <Input
                                        placeholder="이메일로 친구 요청"
                                        value={addEmail}
                                        onChange={e => setAddEmail(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddFriend()}
                                    />
                                    <IconButton
                                        style={{ color: '#3366FF', background: '#F0F0F0', borderRadius: 4, width: 36, height: 36 }}
                                        onClick={handleAddFriend}
                                    >
                                        <UserPlus size={18} />
                                    </IconButton>
                                </AddFriendInput>

                                {/* 받은 친구 요청 */}
                                {friendRequests.length > 0 && (
                                    <>
                                        <SectionLabel>받은 요청</SectionLabel>
                                        {friendRequests.map((req: any) => (
                                            <ListItem key={req.id} style={{ cursor: 'default' }}>
                                                <Avatar src={req.sender.image || '/placeholder-user.svg'} />
                                                <Name style={{ flex: 1 }}>{req.sender.name}</Name>
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    <ActionBtn $variant="accept" onClick={() => handleFriendRequest(req.id, 'accept')}>
                                                        <Check size={14} />
                                                    </ActionBtn>
                                                    <ActionBtn $variant="decline" onClick={() => handleFriendRequest(req.id, 'decline')}>
                                                        <XCircle size={14} />
                                                    </ActionBtn>
                                                </div>
                                            </ListItem>
                                        ))}
                                    </>
                                )}

                                {/* 친구 목록 */}
                                {friends.length > 0 && <SectionLabel>친구</SectionLabel>}
                                {friends.map((f: any) => (
                                    <ListItem key={f.id}>
                                        <Avatar src={f.image || '/placeholder-user.svg'} />
                                        <Name style={{ flex: 1 }}>{f.name}</Name>
                                        <ActionBtn
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                try {
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
                                            }}
                                        >
                                            대화하기
                                        </ActionBtn>
                                    </ListItem>
                                ))}

                                {friends.length === 0 && friendRequests.length === 0 && (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>
                                        이메일로 친구를 추가해보세요
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'chats' && (
                            chats.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>
                                    아직 채팅이 없습니다
                                </div>
                            ) : (
                                chats.map((chat: any) => (
                                    <ListItem key={chat.id} onClick={() => openChatRoom(chat.id)}>
                                        {chat.type === 'GROUP' ? (
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                                                <MessageCircle size={20} />
                                            </div>
                                        ) : (
                                            <Avatar src={getChatImage(chat) || '/placeholder-user.svg'} />
                                        )}
                                        <Info>
                                            <Name>{getChatName(chat)}</Name>
                                            <SubInfo>{chat.messages[0]?.content || '대화가 없습니다.'}</SubInfo>
                                        </Info>
                                        <SubInfo style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                                            {chat.lastMessageAt ? format(new Date(chat.lastMessageAt), 'MM/dd') : ''}
                                        </SubInfo>
                                    </ListItem>
                                ))
                            )
                        )}
                    </ContentArea>
                </>
            )}
        </PopupContainer>
    )
}
