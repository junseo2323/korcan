'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChevronUp, ChevronDown, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

interface Widget {
    key: string
    label: string
    size: 'full' | 'half' | 'quarter'
    visible: boolean
}

const SIZE_LABELS: Record<string, string> = {
    full: '전체 너비',
    half: '절반 (½)',
    quarter: '1/4',
}

const SIZE_OPTIONS = ['full', 'half', 'quarter'] as const

const PageTitle = styled.h1`
    font-size: 1.5rem; font-weight: 800; color: #1a1f2e; margin-bottom: 0.5rem;
`

const PageDesc = styled.p`
    font-size: 0.875rem; color: #6b7280; margin-bottom: 1.5rem;
`

const Card = styled.div`
    background: white; border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;
    max-width: 640px;
`

const CardHeader = styled.div`
    padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6;
    font-weight: 700; font-size: 0.95rem; color: #1a1f2e;
    display: flex; justify-content: space-between; align-items: center;
`

const WidgetRow = styled.div<{ $dimmed: boolean }>`
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.875rem 1.25rem; border-bottom: 1px solid #f3f4f6;
    opacity: ${({ $dimmed }) => $dimmed ? 0.45 : 1};
    transition: opacity 0.2s;
    &:last-child { border-bottom: none; }
`

const OrderBtns = styled.div`
    display: flex; flex-direction: column; gap: 2px; flex-shrink: 0;
`

const SmallBtn = styled.button`
    background: none; border: 1px solid #e5e7eb; cursor: pointer;
    border-radius: 4px; padding: 2px 4px; display: flex; align-items: center;
    color: #6b7280;
    &:hover { background: #f3f4f6; color: #374151; }
    &:disabled { opacity: 0.3; cursor: default; }
`

const WidgetLabel = styled.div`
    flex: 1; font-size: 0.9rem; font-weight: 500; color: #374151;
`

const SizeSelect = styled.select`
    font-size: 0.8rem; padding: 0.25rem 0.5rem;
    border: 1px solid #e5e7eb; border-radius: 6px;
    color: #374151; background: white; cursor: pointer;
    outline: none;
    &:focus { border-color: #6366f1; }
`

const IconBtn = styled.button<{ $active?: boolean }>`
    background: none; border: none; cursor: pointer; padding: 4px;
    border-radius: 6px; display: flex; align-items: center;
    color: ${({ $active }) => $active ? '#6366f1' : '#d1d5db'};
    &:hover { background: #f3f4f6; }
`

const Footer = styled.div`
    padding: 1rem 1.25rem;
    display: flex; justify-content: flex-end; gap: 0.5rem;
    border-top: 1px solid #f3f4f6;
`

const ResetBtn = styled.button`
    display: flex; align-items: center; gap: 4px;
    padding: 0.5rem 1rem; border-radius: 8px;
    border: 1px solid #e5e7eb; background: white;
    color: #6b7280; font-size: 0.875rem; cursor: pointer;
    &:hover { background: #f9fafb; }
`

const SaveBtn = styled.button`
    padding: 0.5rem 1.25rem; border-radius: 8px; border: none;
    background: #6366f1; color: white; font-size: 0.875rem;
    font-weight: 600; cursor: pointer;
    &:hover { background: #4f46e5; }
`

const SizeBadge = styled.span<{ $size: string }>`
    font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 600;
    background: ${({ $size }) =>
        $size === 'full' ? '#eff6ff' :
        $size === 'half' ? '#f0fdf4' : '#fdf4ff'};
    color: ${({ $size }) =>
        $size === 'full' ? '#3b82f6' :
        $size === 'half' ? '#10b981' : '#a855f7'};
`

export default function AdminHomeLayout() {
    const [widgets, setWidgets] = useState<Widget[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/home-layout')
            .then(r => r.json())
            .then(data => { setWidgets(data); setLoading(false) })
    }, [])

    const move = (index: number, dir: -1 | 1) => {
        const next = [...widgets]
        const target = index + dir
        if (target < 0 || target >= next.length) return
        ;[next[index], next[target]] = [next[target], next[index]]
        setWidgets(next)
    }

    const toggleVisible = (index: number) => {
        setWidgets(prev => prev.map((w, i) => i === index ? { ...w, visible: !w.visible } : w))
    }

    const changeSize = (index: number, size: Widget['size']) => {
        setWidgets(prev => prev.map((w, i) => i === index ? { ...w, size } : w))
    }

    const handleReset = async () => {
        const res = await fetch('/api/admin/home-layout')
        // Re-fetch default by deleting current config - just reload from server
        const defaults = await fetch('/api/admin/home-layout').then(r => r.json())
        setWidgets(defaults)
        toast.info('서버 설정을 불러왔습니다.')
    }

    const handleSave = async () => {
        const res = await fetch('/api/admin/home-layout', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(widgets),
        })
        if (res.ok) toast.success('홈 레이아웃이 저장되었습니다.')
        else toast.error('저장 실패')
    }

    if (loading) return <div style={{ color: '#6b7280' }}>불러오는 중...</div>

    return (
        <>
            <PageTitle>홈 레이아웃 관리</PageTitle>
            <PageDesc>위젯 순서를 바꾸거나 표시 여부 및 크기를 설정하세요. 저장 후 즉시 반영됩니다.</PageDesc>

            <Card>
                <CardHeader>
                    위젯 목록
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 400 }}>
                        위아래 버튼으로 순서 변경
                    </span>
                </CardHeader>

                {widgets.map((w, i) => (
                    <WidgetRow key={w.key} $dimmed={!w.visible}>
                        <OrderBtns>
                            <SmallBtn onClick={() => move(i, -1)} disabled={i === 0}>
                                <ChevronUp size={12} />
                            </SmallBtn>
                            <SmallBtn onClick={() => move(i, 1)} disabled={i === widgets.length - 1}>
                                <ChevronDown size={12} />
                            </SmallBtn>
                        </OrderBtns>

                        <WidgetLabel>{w.label}</WidgetLabel>

                        <SizeSelect
                            value={w.size}
                            onChange={e => changeSize(i, e.target.value as Widget['size'])}
                        >
                            {SIZE_OPTIONS.map(s => (
                                <option key={s} value={s}>{SIZE_LABELS[s]}</option>
                            ))}
                        </SizeSelect>

                        <SizeBadge $size={w.size}>{SIZE_LABELS[w.size]}</SizeBadge>

                        <IconBtn $active={w.visible} onClick={() => toggleVisible(i)} title={w.visible ? '숨기기' : '표시'}>
                            {w.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </IconBtn>
                    </WidgetRow>
                ))}

                <Footer>
                    <ResetBtn onClick={handleReset}>
                        <RotateCcw size={14} /> 다시 불러오기
                    </ResetBtn>
                    <SaveBtn onClick={handleSave}>저장</SaveBtn>
                </Footer>
            </Card>
        </>
    )
}
