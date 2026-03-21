'use client'

import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Search, Trash2, Heart, MessageCircle, Eye } from 'lucide-react'
import { toast } from 'sonner'

const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1a1f2e; margin-bottom: 1.5rem;`

const Toolbar = styled.div`display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; align-items: center;`

const SearchBox = styled.div`
    display: flex; align-items: center; gap: 0.5rem;
    background: white; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 0.5rem 0.875rem; flex: 1; min-width: 200px; max-width: 360px;
`

const SearchInput = styled.input`border: none; outline: none; font-size: 0.9rem; width: 100%; background: transparent;`

const Btn = styled.button`
    padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #e5e7eb;
    background: white; color: #374151; font-size: 0.85rem; cursor: pointer; font-weight: 500;
`

const Table = styled.div`background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`

const TableHead = styled.div`
    display: grid;
    grid-template-columns: 3fr 1.2fr 1fr 1fr auto;
    padding: 0.875rem 1.25rem;
    background: #f9fafb; border-bottom: 1px solid #e5e7eb;
    font-size: 0.78rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;
`

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 3fr 1.2fr 1fr 1fr auto;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid #f3f4f6; align-items: center; font-size: 0.875rem;
    &:last-child { border-bottom: none; }
    &:hover { background: #f9fafb; }
`

const PostTitle = styled.div`
    font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`

const PostMeta = styled.div`font-size: 0.78rem; color: #9ca3af; margin-top: 2px;`

const Category = styled.span`
    display: inline-block; font-size: 0.75rem; font-weight: 600;
    padding: 2px 8px; border-radius: 20px; background: #eff6ff; color: #3b82f6;
`

const StatCell = styled.div`display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 0.85rem;`

const DeleteBtn = styled.button`
    background: none; border: none; cursor: pointer; color: #9ca3af; padding: 4px;
    border-radius: 6px; display: flex; align-items: center;
    &:hover { color: #ef4444; background: #fef2f2; }
`

const Pagination = styled.div`display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.25rem;`
const PageBtn = styled.button<{ $active?: boolean }>`
    padding: 0.375rem 0.75rem; border-radius: 8px; border: 1px solid #e5e7eb;
    background: ${({ $active }) => $active ? '#6366f1' : 'white'};
    color: ${({ $active }) => $active ? 'white' : '#374151'};
    font-size: 0.85rem; cursor: pointer; font-weight: 500;
`

const Empty = styled.div`padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.9rem;`

export default function AdminPosts() {
    const [data, setData] = useState<any>(null)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')

    const load = useCallback(() => {
        const params = new URLSearchParams({ search: query, page: String(page) })
        fetch(`/api/admin/posts?${params}`).then(r => r.json()).then(setData)
    }, [query, page])

    useEffect(() => { load() }, [load])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        setQuery(search)
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" 게시물을 삭제하시겠습니까?`)) return
        const res = await fetch('/api/admin/posts', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) { toast.success('삭제했습니다.'); load() }
        else toast.error('삭제 실패')
    }

    return (
        <>
            <PageTitle>게시물 관리</PageTitle>

            <Toolbar>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <SearchBox>
                        <Search size={16} color="#9ca3af" />
                        <SearchInput placeholder="제목 검색" value={search} onChange={e => setSearch(e.target.value)} />
                    </SearchBox>
                    <Btn as="button" type="submit">검색</Btn>
                </form>
                {data && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>총 {data.total}개</div>}
            </Toolbar>

            <Table>
                <TableHead>
                    <div>게시물</div>
                    <div>카테고리</div>
                    <div>좋아요</div>
                    <div>댓글</div>
                    <div></div>
                </TableHead>

                {!data ? (
                    <Empty>불러오는 중...</Empty>
                ) : data.posts.length === 0 ? (
                    <Empty>게시물이 없습니다.</Empty>
                ) : data.posts.map((post: any) => (
                    <TableRow key={post.id}>
                        <div style={{ minWidth: 0 }}>
                            <PostTitle>{post.title}</PostTitle>
                            <PostMeta>
                                {post.user?.name || '알 수 없음'} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                            </PostMeta>
                        </div>
                        <div><Category>{post.category}</Category></div>
                        <StatCell><Heart size={13} /> {post._count.likes}</StatCell>
                        <StatCell><MessageCircle size={13} /> {post._count.comments}</StatCell>
                        <DeleteBtn onClick={() => handleDelete(post.id, post.title)}>
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
