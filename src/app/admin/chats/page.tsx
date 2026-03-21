'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { MessageSquare, Users, ChevronRight } from 'lucide-react'

const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1a1f2e; margin-bottom: 1.5rem;`

const List = styled.div`background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`

const RoomRow = styled.div`
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6;
    cursor: pointer; transition: background 0.1s;
    &:last-child { border-bottom: none; }
    &:hover { background: #f9fafb; }
`

const IconBox = styled.div`
    width: 44px; height: 44px; border-radius: 12px;
    background: #ede9fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`

const RoomInfo = styled.div`flex: 1; min-width: 0;`

const RoomTitle = styled.div`font-weight: 600; font-size: 0.9rem; margin-bottom: 2px;`

const LastMsg = styled.div`
    font-size: 0.8rem; color: #9ca3af;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`

const RoomMeta = styled.div`display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;`

const MetaBadge = styled.span`
    font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 20px;
    background: #f3f4f6; color: #374151;
    display: flex; align-items: center; gap: 3px;
`

const Empty = styled.div`padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.9rem;`

const Pagination = styled.div`display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.25rem;`
const PageBtn = styled.button<{ $active?: boolean }>`
    padding: 0.375rem 0.75rem; border-radius: 8px; border: 1px solid #e5e7eb;
    background: ${({ $active }) => $active ? '#6366f1' : 'white'};
    color: ${({ $active }) => $active ? 'white' : '#374151'};
    font-size: 0.85rem; cursor: pointer; font-weight: 500;
`

export default function AdminChats() {
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        fetch(`/api/admin/chats?page=${page}`).then(r => r.json()).then(setData)
    }, [page])

    return (
        <>
            <PageTitle>채팅 내역</PageTitle>

            {data && (
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    전체 {data.total}개 채팅방
                </div>
            )}

            <List>
                {!data ? (
                    <Empty>불러오는 중...</Empty>
                ) : data.rooms.length === 0 ? (
                    <Empty>채팅방이 없습니다.</Empty>
                ) : data.rooms.map((room: any) => {
                    const participants = room.users.map((u: any) => u.name || '?').join(', ')
                    const lastMsg = room.messages[0]

                    return (
                        <RoomRow key={room.id} onClick={() => router.push(`/admin/chats/${room.id}`)}>
                            <IconBox>
                                <MessageSquare size={20} color="#7c3aed" />
                            </IconBox>
                            <RoomInfo>
                                <RoomTitle>{participants || '알 수 없음'}</RoomTitle>
                                <LastMsg>{lastMsg ? lastMsg.content : '메시지 없음'}</LastMsg>
                            </RoomInfo>
                            <RoomMeta>
                                <MetaBadge><Users size={11} />{room.users.length}명</MetaBadge>
                                <MetaBadge><MessageSquare size={11} />{room._count.messages}</MetaBadge>
                            </RoomMeta>
                            <ChevronRight size={16} color="#d1d5db" />
                        </RoomRow>
                    )
                })}
            </List>

            {data && data.pages > 1 && (
                <Pagination>
                    {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                        <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
                    ))}
                </Pagination>
            )}
        </>
    )
}
