'use client'

import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Search, Trash2, Shield, User } from 'lucide-react'
import { toast } from 'sonner'

const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1a1f2e; margin-bottom: 1.5rem;`

const Toolbar = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
`

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 0.5rem 0.875rem;
    flex: 1;
    min-width: 200px;
    max-width: 360px;
`

const SearchInput = styled.input`
    border: none;
    outline: none;
    font-size: 0.9rem;
    width: 100%;
    background: transparent;
`

const Table = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    overflow: hidden;
`

const TableHead = styled.div`
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1fr 1fr auto;
    padding: 0.875rem 1.25rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.78rem;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 640px) {
        grid-template-columns: 2fr 2fr 1fr auto;
    }
`

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1fr 1fr auto;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid #f3f4f6;
    align-items: center;
    font-size: 0.875rem;
    transition: background 0.1s;

    &:last-child { border-bottom: none; }
    &:hover { background: #f9fafb; }

    @media (max-width: 640px) {
        grid-template-columns: 2fr 2fr 1fr auto;
    }
`

const UserCell = styled.div`display: flex; align-items: center; gap: 0.625rem; min-width: 0;`

const Avatar = styled.img`width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #e5e7eb;`

const AvatarFallback = styled.div`
    width: 32px; height: 32px; border-radius: 50%;
    background: #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`

const Name = styled.div`font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
const Email = styled.div`font-size: 0.8rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`

const Badge = styled.span<{ $admin?: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    background: ${({ $admin }) => $admin ? '#ede9fe' : '#f3f4f6'};
    color: ${({ $admin }) => $admin ? '#7c3aed' : '#374151'};
`

const HideOnMobile = styled.div`
    @media (max-width: 640px) { display: none; }
`

const DeleteBtn = styled.button`
    background: none; border: none; cursor: pointer; color: #9ca3af; padding: 4px;
    border-radius: 6px; display: flex; align-items: center; transition: color 0.15s, background 0.15s;
    &:hover { color: #ef4444; background: #fef2f2; }
`

const Pagination = styled.div`
    display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.25rem;
`

const PageBtn = styled.button<{ $active?: boolean }>`
    padding: 0.375rem 0.75rem; border-radius: 8px; border: 1px solid #e5e7eb;
    background: ${({ $active }) => $active ? '#6366f1' : 'white'};
    color: ${({ $active }) => $active ? 'white' : '#374151'};
    font-size: 0.85rem; cursor: pointer; font-weight: 500;
`

const Empty = styled.div`padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.9rem;`

export default function AdminUsers() {
    const [data, setData] = useState<any>(null)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')

    const load = useCallback(() => {
        const params = new URLSearchParams({ search: query, page: String(page) })
        fetch(`/api/admin/users?${params}`).then(r => r.json()).then(setData)
    }, [query, page])

    useEffect(() => { load() }, [load])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        setQuery(search)
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`${name} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return
        const res = await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        if (res.ok) { toast.success('삭제했습니다.'); load() }
        else toast.error('삭제 실패')
    }

    return (
        <>
            <PageTitle>사용자 관리</PageTitle>

            <Toolbar>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <SearchBox>
                        <Search size={16} color="#9ca3af" />
                        <SearchInput
                            placeholder="이름 또는 이메일 검색"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </SearchBox>
                    <PageBtn as="button" type="submit" style={{ padding: '0.5rem 1rem' }}>검색</PageBtn>
                </form>
                {data && <div style={{ fontSize: '0.875rem', color: '#6b7280', alignSelf: 'center' }}>총 {data.total}명</div>}
            </Toolbar>

            <Table>
                <TableHead>
                    <div>사용자</div>
                    <div>이메일</div>
                    <div>역할</div>
                    <HideOnMobile>게시물</HideOnMobile>
                    <HideOnMobile>가입일</HideOnMobile>
                    <div></div>
                </TableHead>

                {!data ? (
                    <Empty>불러오는 중...</Empty>
                ) : data.users.length === 0 ? (
                    <Empty>사용자가 없습니다.</Empty>
                ) : data.users.map((user: any) => (
                    <TableRow key={user.id}>
                        <UserCell>
                            {user.image
                                ? <Avatar src={user.image} alt={user.name || ''} />
                                : <AvatarFallback><User size={16} color="#9ca3af" /></AvatarFallback>
                            }
                            <Name>{user.name || '-'}</Name>
                        </UserCell>
                        <Email style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.email || '-'}
                        </Email>
                        <div>
                            <Badge $admin={user.role === 'ADMIN'}>
                                {user.role === 'ADMIN' && <Shield size={10} />}
                                {user.role}
                            </Badge>
                        </div>
                        <HideOnMobile style={{ color: '#374151' }}>{user._count.posts}</HideOnMobile>
                        <HideOnMobile style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                        </HideOnMobile>
                        <DeleteBtn onClick={() => handleDelete(user.id, user.name || user.email)}>
                            <Trash2 size={16} />
                        </DeleteBtn>
                    </TableRow>
                ))}
            </Table>

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
