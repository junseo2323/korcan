'use client'

import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Search, Trash2, Heart, MessageCircle, Megaphone, MegaphoneOff, Home, ShoppingBag, FileText } from 'lucide-react'
import { toast } from 'sonner'

// ─── Shared Styles ───────────────────────────────────────────────

const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1a1f2e; margin-bottom: 1.25rem;`

const Tabs = styled.div`
    display: flex; gap: 0; margin-bottom: 1.5rem;
    background: white; border-radius: 12px; padding: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); width: fit-content;
`

const Tab = styled.button<{ $active: boolean }>`
    display: flex; align-items: center; gap: 6px;
    padding: 0.5rem 1.1rem; border-radius: 8px; border: none; cursor: pointer;
    font-size: 0.875rem; font-weight: ${({ $active }) => $active ? '700' : '500'};
    background: ${({ $active }) => $active ? '#6366f1' : 'transparent'};
    color: ${({ $active }) => $active ? 'white' : '#6b7280'};
    transition: all 0.15s;
    &:hover { color: ${({ $active }) => $active ? 'white' : '#374151'}; }
`

const Toolbar = styled.div`display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; align-items: center;`

const SearchBox = styled.div`
    display: flex; align-items: center; gap: 0.5rem;
    background: white; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 0.5rem 0.875rem; flex: 1; min-width: 200px; max-width: 360px;
`
const SearchInput = styled.input`border: none; outline: none; font-size: 0.9rem; width: 100%; background: transparent;`
const SearchBtn = styled.button`
    padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #e5e7eb;
    background: white; color: #374151; font-size: 0.85rem; cursor: pointer; font-weight: 500;
`

const Table = styled.div`background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`
const Empty = styled.div`padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.9rem;`

const Pagination = styled.div`display: flex; gap: 0.5rem; justify-content: center; margin-top: 1.25rem;`
const PageBtn = styled.button<{ $active?: boolean }>`
    padding: 0.375rem 0.75rem; border-radius: 8px; border: 1px solid #e5e7eb;
    background: ${({ $active }) => $active ? '#6366f1' : 'white'};
    color: ${({ $active }) => $active ? 'white' : '#374151'};
    font-size: 0.85rem; cursor: pointer; font-weight: 500;
`

const DeleteBtn = styled.button`
    background: none; border: none; cursor: pointer; color: #9ca3af; padding: 4px;
    border-radius: 6px; display: flex; align-items: center;
    &:hover { color: #ef4444; background: #fef2f2; }
`
const StatCell = styled.div`display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 0.85rem;`

const Badge = styled.span<{ $color?: string }>`
    display: inline-block; font-size: 0.75rem; font-weight: 600;
    padding: 2px 8px; border-radius: 20px;
    background: ${({ $color }) => $color || '#eff6ff'};
    color: ${({ $color }) => $color === '#fef3c7' ? '#d97706' : $color === '#dcfce7' ? '#16a34a' : $color === '#fee2e2' ? '#dc2626' : '#3b82f6'};
`

const TitleCell = styled.div`font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
const MetaCell = styled.div`font-size: 0.78rem; color: #9ca3af; margin-top: 2px;`

const Head = styled.div<{ $cols: string }>`
    display: grid; grid-template-columns: ${({ $cols }) => $cols};
    padding: 0.875rem 1.25rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb;
    font-size: 0.78rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;
`
const Row = styled.div<{ $cols: string }>`
    display: grid; grid-template-columns: ${({ $cols }) => $cols};
    padding: 0.875rem 1.25rem; border-bottom: 1px solid #f3f4f6; align-items: center; font-size: 0.875rem;
    &:last-child { border-bottom: none; }
    &:hover { background: #f9fafb; }
`

const NoticeBtn = styled.button<{ $active?: boolean }>`
    display: flex; align-items: center; gap: 3px;
    background: none; border: 1px solid ${({ $active }) => $active ? '#f59e0b' : '#e5e7eb'};
    border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 0.75rem; font-weight: 600;
    color: ${({ $active }) => $active ? '#d97706' : '#9ca3af'}; white-space: nowrap;
    &:hover { background: ${({ $active }) => $active ? '#fef3c7' : '#f9fafb'}; }
`

// ─── Sub-components ───────────────────────────────────────────────

function useTable(apiPath: string) {
    const [data, setData] = useState<any>(null)
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)

    const load = useCallback(() => {
        const params = new URLSearchParams({ search: query, page: String(page) })
        fetch(`${apiPath}?${params}`).then(r => r.json()).then(setData)
    }, [apiPath, query, page])

    useEffect(() => { load() }, [load])

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); setQuery(search) }

    return { data, search, setSearch, page, setPage, load, handleSearch }
}

// ─── Community Posts Tab ───────────────────────────────────────────

function PostsTab() {
    const { data, search, setSearch, page, setPage, load, handleSearch } = useTable('/api/admin/posts')

    const handleNoticeToggle = async (post: any) => {
        const isNotice = post.category === '공지'
        if (!confirm(`"${post.title}"을(를) ${isNotice ? '공지 해제' : '공지 등록'}하시겠습니까?`)) return
        const res = await fetch('/api/admin/posts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: post.id, category: isNotice ? '일반' : '공지' }),
        })
        if (res.ok) { toast.success(isNotice ? '공지 해제했습니다.' : '공지로 등록했습니다.'); load() }
        else toast.error('처리 실패')
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" 게시물을 삭제하시겠습니까?`)) return
        const res = await fetch('/api/admin/posts', {
            method: 'DELETE', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) { toast.success('삭제했습니다.'); load() }
        else toast.error('삭제 실패')
    }

    const cols = '3fr 1.2fr 1fr 1fr auto auto'

    return (
        <>
            <Toolbar>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <SearchBox>
                        <Search size={16} color="#9ca3af" />
                        <SearchInput placeholder="제목 검색" value={search} onChange={e => setSearch(e.target.value)} />
                    </SearchBox>
                    <SearchBtn type="submit">검색</SearchBtn>
                </form>
                {data && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>총 {data.total}개</div>}
            </Toolbar>
            <Table>
                <Head $cols={cols}><div>게시물</div><div>카테고리</div><div>좋아요</div><div>댓글</div><div>공지</div><div /></Head>
                {!data ? <Empty>불러오는 중...</Empty>
                    : data.posts.length === 0 ? <Empty>게시물이 없습니다.</Empty>
                    : data.posts.map((post: any) => (
                        <Row key={post.id} $cols={cols}>
                            <div style={{ minWidth: 0 }}>
                                <TitleCell>{post.title}</TitleCell>
                                <MetaCell>{post.user?.name || '-'} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}</MetaCell>
                            </div>
                            <div>
                                <Badge $color={post.category === '공지' ? '#fef3c7' : '#eff6ff'}>{post.category}</Badge>
                            </div>
                            <StatCell><Heart size={13} />{post._count.likes}</StatCell>
                            <StatCell><MessageCircle size={13} />{post._count.comments}</StatCell>
                            <NoticeBtn $active={post.category === '공지'} onClick={() => handleNoticeToggle(post)}>
                                {post.category === '공지' ? <><MegaphoneOff size={12} />해제</> : <><Megaphone size={12} />공지</>}
                            </NoticeBtn>
                            <DeleteBtn onClick={() => handleDelete(post.id, post.title)}><Trash2 size={16} /></DeleteBtn>
                        </Row>
                    ))}
            </Table>
            <PaginationBar data={data} page={page} setPage={setPage} />
        </>
    )
}

// ─── Properties Tab ───────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    AVAILABLE: { label: '매물중', color: '#dcfce7' },
    RENTED:    { label: '계약완료', color: '#fee2e2' },
    SOLD:      { label: '판매완료', color: '#fee2e2' },
}

function PropertiesTab() {
    const { data, search, setSearch, page, setPage, load, handleSearch } = useTable('/api/admin/properties')

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" 매물을 삭제하시겠습니까?`)) return
        const res = await fetch('/api/admin/properties', {
            method: 'DELETE', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) { toast.success('삭제했습니다.'); load() }
        else toast.error('삭제 실패')
    }

    const cols = '3fr 1fr 1.5fr 1.2fr 1fr auto'

    return (
        <>
            <Toolbar>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <SearchBox>
                        <Search size={16} color="#9ca3af" />
                        <SearchInput placeholder="제목 또는 주소 검색" value={search} onChange={e => setSearch(e.target.value)} />
                    </SearchBox>
                    <SearchBtn type="submit">검색</SearchBtn>
                </form>
                {data && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>총 {data.total}개</div>}
            </Toolbar>
            <Table>
                <Head $cols={cols}><div>매물</div><div>유형</div><div>가격</div><div>지역</div><div>상태</div><div /></Head>
                {!data ? <Empty>불러오는 중...</Empty>
                    : data.properties.length === 0 ? <Empty>매물이 없습니다.</Empty>
                    : data.properties.map((p: any) => {
                        const status = STATUS_MAP[p.status] || { label: p.status, color: '#f3f4f6' }
                        return (
                            <Row key={p.id} $cols={cols}>
                                <div style={{ minWidth: 0 }}>
                                    <TitleCell>{p.title}</TitleCell>
                                    <MetaCell>{p.user?.name || '-'} · {new Date(p.createdAt).toLocaleDateString('ko-KR')}</MetaCell>
                                </div>
                                <Badge>{p.type}</Badge>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                    {p.currency === 'CAD' ? '$' : '₩'}{p.price.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#374151' }}>{p.region}</div>
                                <Badge $color={status.color}>{status.label}</Badge>
                                <DeleteBtn onClick={() => handleDelete(p.id, p.title)}><Trash2 size={16} /></DeleteBtn>
                            </Row>
                        )
                    })}
            </Table>
            <PaginationBar data={data} page={page} setPage={setPage} />
        </>
    )
}

// ─── Products Tab ───────────────────────────────────────────────

const PRODUCT_STATUS_MAP: Record<string, { label: string; color: string }> = {
    SELLING:  { label: '판매중', color: '#dcfce7' },
    RESERVED: { label: '예약중', color: '#fef3c7' },
    SOLD:     { label: '판매완료', color: '#fee2e2' },
}

function ProductsTab() {
    const { data, search, setSearch, page, setPage, load, handleSearch } = useTable('/api/admin/products')

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" 상품을 삭제하시겠습니까?`)) return
        const res = await fetch('/api/admin/products', {
            method: 'DELETE', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) { toast.success('삭제했습니다.'); load() }
        else toast.error('삭제 실패')
    }

    const cols = '3fr 1.2fr 1.5fr 1fr 1fr auto'

    return (
        <>
            <Toolbar>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <SearchBox>
                        <Search size={16} color="#9ca3af" />
                        <SearchInput placeholder="제목 검색" value={search} onChange={e => setSearch(e.target.value)} />
                    </SearchBox>
                    <SearchBtn type="submit">검색</SearchBtn>
                </form>
                {data && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>총 {data.total}개</div>}
            </Toolbar>
            <Table>
                <Head $cols={cols}><div>상품</div><div>카테고리</div><div>가격</div><div>좋아요</div><div>상태</div><div /></Head>
                {!data ? <Empty>불러오는 중...</Empty>
                    : data.products.length === 0 ? <Empty>상품이 없습니다.</Empty>
                    : data.products.map((p: any) => {
                        const status = PRODUCT_STATUS_MAP[p.status] || { label: p.status, color: '#f3f4f6' }
                        return (
                            <Row key={p.id} $cols={cols}>
                                <div style={{ minWidth: 0 }}>
                                    <TitleCell>{p.title}</TitleCell>
                                    <MetaCell>{p.seller?.name || '-'} · {new Date(p.createdAt).toLocaleDateString('ko-KR')}</MetaCell>
                                </div>
                                <Badge>{p.category}</Badge>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>${p.price.toLocaleString()}</div>
                                <StatCell><Heart size={13} />{p._count.likes}</StatCell>
                                <Badge $color={status.color}>{status.label}</Badge>
                                <DeleteBtn onClick={() => handleDelete(p.id, p.title)}><Trash2 size={16} /></DeleteBtn>
                            </Row>
                        )
                    })}
            </Table>
            <PaginationBar data={data} page={page} setPage={setPage} />
        </>
    )
}

// ─── Pagination helper ────────────────────────────────────────────

function PaginationBar({ data, page, setPage }: { data: any; page: number; setPage: (p: number) => void }) {
    if (!data || data.pages <= 1) return null
    return (
        <Pagination>
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
            ))}
        </Pagination>
    )
}

// ─── Main Page ────────────────────────────────────────────────────

type TabType = 'posts' | 'properties' | 'products'

const TAB_CONFIG: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'posts',      label: '커뮤니티',   icon: FileText },
    { id: 'properties', label: '부동산',     icon: Home },
    { id: 'products',   label: '중고거래',   icon: ShoppingBag },
]

export default function AdminContent() {
    const [activeTab, setActiveTab] = useState<TabType>('posts')

    return (
        <>
            <PageTitle>콘텐츠 관리</PageTitle>

            <Tabs>
                {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
                    <Tab key={id} $active={activeTab === id} onClick={() => setActiveTab(id)}>
                        <Icon size={15} />
                        {label}
                    </Tab>
                ))}
            </Tabs>

            {activeTab === 'posts'      && <PostsTab />}
            {activeTab === 'properties' && <PropertiesTab />}
            {activeTab === 'products'   && <ProductsTab />}
        </>
    )
}
