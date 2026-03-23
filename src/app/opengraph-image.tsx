import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'KorCan - 캐나다 한인 커뮤니티'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #60a5fa 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}
          >
            🍁
          </div>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            KorCan
          </span>
        </div>
        <p
          style={{
            fontSize: '32px',
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            fontWeight: 500,
          }}
        >
          캐나다 한인 커뮤니티
        </p>
        <p
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.7)',
            margin: '12px 0 0',
          }}
        >
          중고거래 · 부동산 · 모임 · 일자리
        </p>
      </div>
    ),
    { ...size }
  )
}
