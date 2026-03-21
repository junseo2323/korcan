'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isIosSafari() {
  const ua = navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua)
  const isWebkit = /webkit/i.test(ua)
  const isChrome = /CriOS/i.test(ua)
  const isFirefox = /FxiOS/i.test(ua)
  return isIos && isWebkit && !isChrome && !isFirefox
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('install-prompt-dismissed')) return

    if (isIosSafari()) {
      setIsIos(true)
      setShow(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    setShow(false)
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('install-prompt-dismissed', '1')
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
      backgroundColor: '#0f172a',
      color: '#fff',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      zIndex: 9998,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>📲</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>홈 화면에 추가</p>
          {isIos ? (
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
              하단 공유 버튼(<span style={{ fontSize: '1rem' }}>⎙</span>)을 누른 후<br />
              <strong style={{ color: '#cbd5e1' }}>"홈 화면에 추가"</strong>를 선택하세요.
            </p>
          ) : (
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              KorCan을 앱처럼 빠르게 사용하세요.
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isIos && (
          <button onClick={handleInstall} style={{
            flex: 1, background: '#3B82F6', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
          }}>
            추가
          </button>
        )}
        <button onClick={handleDismiss} style={{
          flex: isIos ? undefined : 1,
          width: isIos ? '100%' : undefined,
          background: isIos ? '#3B82F6' : '#1e293b',
          color: '#fff', border: 'none',
          borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
        }}>
          확인
        </button>
      </div>
    </div>
  )
}
