'use client'

import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Wrapper = styled.div`
  position: relative;
`

const BellButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 2000;
  overflow: hidden;
`

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  font-weight: 700;
  font-size: 0.95rem;
`

const MarkAllRead = styled.button`
  background: none;
  border: none;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: 500;
`

const NotifItem = styled.div<{ $read: boolean }>`
  padding: 0.875rem 1.25rem;
  background: ${({ $read }) => $read ? 'transparent' : '#f0f7ff'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  cursor: pointer;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const NotifMessage = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
`

const NotifTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

interface Notification {
  id: string
  type: string
  message: string
  targetUrl: string | null
  read: boolean
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export default function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = async () => {
    setOpen(prev => !prev)
    if (!open && unreadCount > 0) {
      await fetch('/api/notifications', { method: 'POST' })
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  const handleNotifClick = (notif: Notification) => {
    setOpen(false)
    if (notif.targetUrl) router.push(notif.targetUrl)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <BellButton onClick={handleOpen} aria-label="알림">
        <Bell size={22} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>
        )}
      </BellButton>

      {open && (
        <Dropdown>
          <DropdownHeader>
            알림
            {notifications.some(n => !n.read) && (
              <MarkAllRead onClick={handleOpen}>모두 읽음</MarkAllRead>
            )}
          </DropdownHeader>

          {notifications.length === 0 ? (
            <EmptyState>새 알림이 없습니다</EmptyState>
          ) : (
            notifications.map(notif => (
              <NotifItem key={notif.id} $read={notif.read} onClick={() => handleNotifClick(notif)}>
                <NotifMessage>{notif.message}</NotifMessage>
                <NotifTime>{timeAgo(notif.createdAt)}</NotifTime>
              </NotifItem>
            ))
          )}
        </Dropdown>
      )}
    </Wrapper>
  )
}
