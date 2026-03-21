'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const arr = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i)
  return arr.buffer
}

export default function PushPermissionPrompt() {
  const { data: session } = useSession()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!session?.user) return
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission !== 'default') return
    if (localStorage.getItem('push-prompt-dismissed')) return

    const timer = setTimeout(() => setShow(true), 30000)
    return () => clearTimeout(timer)
  }, [session])

  const handleAllow = async () => {
    setShow(false)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const reg = await navigator.serviceWorker.ready
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })
    } catch (e) {
      console.error('Push subscription failed:', e)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('push-prompt-dismissed', '1')
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(80px + env(safe-area-inset-bottom))',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '400px',
      backgroundColor: '#1e293b',
      color: '#fff',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔔</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>알림 받기</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            댓글, 좋아요, 채팅 알림을 받아보세요.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleAllow} style={{
          flex: 1, background: '#3B82F6', color: '#fff', border: 'none',
          borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
        }}>
          허용
        </button>
        <button onClick={handleDismiss} style={{
          flex: 1, background: '#334155', color: '#94a3b8', border: 'none',
          borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
        }}>
          나중에
        </button>
      </div>
    </div>
  )
}
