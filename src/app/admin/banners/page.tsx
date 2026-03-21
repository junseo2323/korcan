'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Plus, Trash2, Pencil, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

interface Banner {
    id: string
    title: string
    subtitle?: string
    linkUrl?: string
    bgFrom: string
    bgTo: string
    active: boolean
    order: number
}

const EMPTY: Omit<Banner, 'id' | 'order'> = {
    title: '',
    subtitle: '',
    linkUrl: '',
    bgFrom: '#6366f1',
    bgTo: '#8b5cf6',
    active: true,
}

const PageTitle = styled.h1`font-size: 1.5rem; font-weight: 800; color: #1a1f2e; margin-bottom: 1.5rem;`

const Layout = styled.div`
    display: grid; grid-template-columns: 1fr; gap: 1.5rem;
    @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
`

const Card = styled.div`background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;`

const CardHeader = styled.div`
    padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6;
    font-weight: 700; font-size: 0.95rem; color: #1a1f2e;
    display: flex; justify-content: space-between; align-items: center;
`

const AddBtn = styled.button`
    display: flex; align-items: center; gap: 4px;
    padding: 0.375rem 0.75rem; border-radius: 8px; border: none;
    background: #6366f1; color: white; font-size: 0.8rem; font-weight: 600; cursor: pointer;
`

const BannerItem = styled.div<{ $inactive?: boolean }>`
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.875rem 1.25rem; border-bottom: 1px solid #f3f4f6;
    opacity: ${({ $inactive }) => $inactive ? 0.5 : 1};
    &:last-child { border-bottom: none; }
`

const BannerSwatch = styled.div<{ $from: string; $to: string }>`
    width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
`

const BannerInfo = styled.div`flex: 1; min-width: 0;`
const BannerTitle = styled.div`font-weight: 600; font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
const BannerSub = styled.div`font-size: 0.78rem; color: #9ca3af;`

const Actions = styled.div`display: flex; gap: 4px;`
const IconBtn = styled.button<{ $color?: string }>`
    background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px;
    color: ${({ $color }) => $color || '#9ca3af'};
    display: flex; align-items: center;
    &:hover { background: #f3f4f6; }
`

const Empty = styled.div`padding: 2.5rem; text-align: center; color: #9ca3af; font-size: 0.9rem;`

// Form
const FormTitle = styled.div`font-size: 0.95rem; font-weight: 700; color: #1a1f2e; margin-bottom: 1rem;`

const Field = styled.div`margin-bottom: 1rem;`
const Label = styled.label`font-size: 0.8rem; font-weight: 600; color: #374151; display: block; margin-bottom: 4px;`
const Input = styled.input`
    width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px;
    font-size: 0.875rem; outline: none; box-sizing: border-box;
    &:focus { border-color: #6366f1; }
`

const ColorRow = styled.div`display: flex; gap: 0.75rem;`
const ColorField = styled.div`flex: 1;`
const ColorInput = styled.input`width: 100%; height: 40px; border-radius: 8px; border: 1px solid #e5e7eb; cursor: pointer;`

const PreviewBox = styled.div<{ $from: string; $to: string }>`
    border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;
    background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
    color: white;
`

const FormBtns = styled.div`display: flex; gap: 0.5rem; justify-content: flex-end;`
const CancelBtn = styled.button`
    padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #e5e7eb;
    background: white; color: #374151; font-size: 0.875rem; cursor: pointer;
`
const SaveBtn = styled.button`
    padding: 0.5rem 1.25rem; border-radius: 8px; border: none;
    background: #6366f1; color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer;
`

const FormPanel = styled.div`padding: 1.25rem;`

export default function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [editing, setEditing] = useState<Partial<Banner> | null>(null)
    const [isNew, setIsNew] = useState(false)

    const load = () => {
        fetch('/api/admin/banners').then(r => r.json()).then(setBanners)
    }

    useEffect(() => { load() }, [])

    const openNew = () => {
        setEditing({ ...EMPTY })
        setIsNew(true)
    }

    const openEdit = (b: Banner) => {
        setEditing({ ...b })
        setIsNew(false)
    }

    const handleSave = async () => {
        if (!editing?.title?.trim()) { toast.error('제목을 입력하세요.'); return }

        const method = isNew ? 'POST' : 'PUT'
        const url = isNew ? '/api/admin/banners' : `/api/admin/banners/${editing!.id}`
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editing),
        })
        if (res.ok) {
            toast.success(isNew ? '배너를 추가했습니다.' : '수정했습니다.')
            setEditing(null)
            load()
        } else toast.error('저장 실패')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('이 배너를 삭제하시겠습니까?')) return
        const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
        if (res.ok) { toast.success('삭제했습니다.'); load() }
        else toast.error('삭제 실패')
    }

    const handleToggle = async (banner: Banner) => {
        await fetch(`/api/admin/banners/${banner.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: !banner.active }),
        })
        load()
    }

    const form = editing || {}

    return (
        <>
            <PageTitle>배너 관리</PageTitle>

            <Layout>
                {/* Left: List */}
                <Card>
                    <CardHeader>
                        배너 목록
                        <AddBtn onClick={openNew}><Plus size={14} /> 새 배너</AddBtn>
                    </CardHeader>

                    {banners.length === 0 ? (
                        <Empty>등록된 배너가 없습니다.</Empty>
                    ) : banners.map(b => (
                        <BannerItem key={b.id} $inactive={!b.active}>
                            <BannerSwatch $from={b.bgFrom} $to={b.bgTo} />
                            <BannerInfo>
                                <BannerTitle>{b.title}</BannerTitle>
                                <BannerSub>{b.subtitle || b.linkUrl || '링크 없음'}</BannerSub>
                            </BannerInfo>
                            <Actions>
                                <IconBtn $color={b.active ? '#10b981' : '#d1d5db'} onClick={() => handleToggle(b)}>
                                    {b.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                </IconBtn>
                                <IconBtn $color="#6366f1" onClick={() => openEdit(b)}>
                                    <Pencil size={15} />
                                </IconBtn>
                                <IconBtn $color="#ef4444" onClick={() => handleDelete(b.id)}>
                                    <Trash2 size={15} />
                                </IconBtn>
                            </Actions>
                        </BannerItem>
                    ))}
                </Card>

                {/* Right: Form */}
                <Card>
                    <CardHeader>{editing ? (isNew ? '새 배너 추가' : '배너 수정') : '배너 선택'}</CardHeader>

                    {!editing ? (
                        <Empty>목록에서 배너를 선택하거나 새 배너를 추가하세요.</Empty>
                    ) : (
                        <FormPanel>
                            {/* Preview */}
                            <PreviewBox $from={form.bgFrom || '#6366f1'} $to={form.bgTo || '#8b5cf6'}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>미리보기</div>
                                <div style={{ fontSize: '1rem', fontWeight: 800 }}>{form.title || '배너 제목'}</div>
                                {form.subtitle && <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: 2 }}>{form.subtitle}</div>}
                            </PreviewBox>

                            <Field>
                                <Label>제목 *</Label>
                                <Input value={form.title || ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} placeholder="배너 제목" />
                            </Field>
                            <Field>
                                <Label>부제목</Label>
                                <Input value={form.subtitle || ''} onChange={e => setEditing(p => ({ ...p, subtitle: e.target.value }))} placeholder="짧은 설명" />
                            </Field>
                            <Field>
                                <Label>링크 URL</Label>
                                <Input value={form.linkUrl || ''} onChange={e => setEditing(p => ({ ...p, linkUrl: e.target.value }))} placeholder="/community/..." />
                            </Field>
                            <Field>
                                <Label>배경 그라디언트</Label>
                                <ColorRow>
                                    <ColorField>
                                        <Label>시작 색</Label>
                                        <ColorInput type="color" value={form.bgFrom || '#6366f1'} onChange={e => setEditing(p => ({ ...p, bgFrom: e.target.value }))} />
                                    </ColorField>
                                    <ColorField>
                                        <Label>끝 색</Label>
                                        <ColorInput type="color" value={form.bgTo || '#8b5cf6'} onChange={e => setEditing(p => ({ ...p, bgTo: e.target.value }))} />
                                    </ColorField>
                                </ColorRow>
                            </Field>

                            <FormBtns>
                                <CancelBtn onClick={() => setEditing(null)}>취소</CancelBtn>
                                <SaveBtn onClick={handleSave}>저장</SaveBtn>
                            </FormBtns>
                        </FormPanel>
                    )}
                </Card>
            </Layout>
        </>
    )
}
