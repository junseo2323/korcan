'use client'

import { useEffect, useState } from 'react'

function isInAppBrowser() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Instagram|FBAN|FBAV|FB_IAB|FB4A|FBIOS|Threads|Twitter|TW_|Line\/|MicroMessenger|WeChat|Snapchat|TikTok|Musical\.ly|Naver|Daum|Kakaotalk|kakaostory|bingbot|YaBrowser|OPR\/|SamsungBrowser.*Mobile/.test(ua)
}

export default function InAppBrowserBanner() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('inapp-banner-dismissed')) return
    if (isInAppBrowser()) setShow(true)
  }, [])

  const handleOpenSafari = () => {
    // Try to open in external browser via various methods
    const url = window.location.href
    // iOS: x-safari scheme
    // Android: intent scheme (Chrome)
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    if (isIos) {
      window.location.href = `x-safari-https://${window.location.host}${window.location.pathname}`
    } else {
      window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('inapp-banner-dismissed', '1')
  }

  if (!show || dismissed) return null

  const isIos = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1e293b',
      color: '#fff',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 99999,
      boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    }}>
      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: '#cbd5e1' }}>
        <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>인앱 브라우저에서 열려있어요</strong>
        구글 로그인이 작동하지 않습니다.{' '}
        <strong style={{ color: '#93c5fd' }}>{isIos ? 'Safari' : 'Chrome'}에서 열면</strong> 모든 기능을 사용할 수 있어요.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleOpenSafari}
          style={{
            flex: 1, background: '#3B82F6', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '9px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          {isIos ? 'Safari에서 열기' : 'Chrome에서 열기'}
        </button>
        <button
          onClick={handleDismiss}
          style={{
            flex: 1, background: '#334155', color: '#94a3b8', border: 'none',
            borderRadius: '8px', padding: '9px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  )
}
