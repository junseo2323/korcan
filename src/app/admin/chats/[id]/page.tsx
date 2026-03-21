'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, User } from 'lucide-react'

const Header = styled.div`
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
`

const BackBtn = styled.button`
    background: white; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 0.5rem; cursor: pointer; display: flex; align-items: center;
`

const Title = styled.h1`font-size: 1.25rem; font-weight: 700; color: #1a1f2e;`

const ParticipantsBar = styled.div`
    background: white; border-radius: 12px; padding: 0.875rem 1.25rem;
    margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;
    font-size: 0.85rem; color: #374151;
`

const ParticipantChip = styled.div`
    display: flex; align-items: center; gap: 4px;
    background: #f3f4f6; border-radius: 20px; padding: 3px 10px;
    font-size: 0.8rem; font-weight: 500;
`

const ChatWindow = styled.div`
    background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
    max-height: 70vh; overflow-y: auto;
`

const MessageRow = styled.div<{ $mine?: boolean }>`
    display: flex; flex-direction: column;
    align-items: ${({ $mine }) => $mine ? 'flex-end' : 'flex-start'};
    gap: 3px;
`

const SenderName = styled.div`font-size: 0.75rem; color: #9ca3af; font-weight: 500; padding: 0 4px;`

const Bubble = styled.div<{ $mine?: boolean }>`
    max-width: 70%;
    background: ${({ $mine }) => $mine ? '#6366f1' : '#f3f4f6'};
    color: ${({ $mine }) => $mine ? 'white' : '#1a1f2e'};
    padding: 0.625rem 0.875rem;
    border-radius: ${({ $mine }) => $mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
    font-size: 0.875rem; line-height: 1.5; word-break: break-word;
`

const Time = styled.div`font-size: 0.72rem; color: #d1d5db; padding: 0 4px;`

const Empty = styled.div`padding: 3rem; text-align: center; color: #9ca3af;`

export default function AdminChatRoom() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/admin/chats/${id}`).then(r => r.json()).then(setData)
    }, [id])

    if (!data) return <Empty>불러오는 중...</Empty>

    const userIds = data.room.users.map((u: any) => u.id)
    // For coloring: first user = mine (arbitrary) — admin view, just distinguish users
    const firstUserId = userIds[0]

    return (
        <>
            <Header>
                <BackBtn onClick={() => router.push('/admin/chats')}>
                    <ChevronLeft size={20} />
                </BackBtn>
                <Title>채팅방 상세</Title>
            </Header>

            <ParticipantsBar>
                <span style={{ color: '#9ca3af', fontWeight: 600 }}>참여자</span>
                {data.room.users.map((u: any) => (
                    <ParticipantChip key={u.id}>
                        <User size={12} />
                        {u.name || '알 수 없음'}
                    </ParticipantChip>
                ))}
                <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>{data.messages.length}개 메시지</span>
            </ParticipantsBar>

            <ChatWindow>
                {data.messages.length === 0 ? (
                    <Empty>메시지가 없습니다.</Empty>
                ) : data.messages.map((msg: any) => {
                    const isFirst = msg.senderId === firstUserId
                    return (
                        <MessageRow key={msg.id} $mine={isFirst}>
                            <SenderName>{msg.sender?.name || '알 수 없음'}</SenderName>
                            <Bubble $mine={isFirst}>{msg.content}</Bubble>
                            <Time>{new Date(msg.createdAt).toLocaleString('ko-KR')}</Time>
                        </MessageRow>
                    )
                })}
            </ChatWindow>
        </>
    )
}
