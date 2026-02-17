import type { Metadata, Viewport } from 'next'
import StyledComponentsRegistry from '@/lib/registry'
import Providers from './providers'
import Shell from '@/components/layout/Shell'
import SplashScreen from '@/components/ui/SplashScreen'

export const metadata: Metadata = {
  title: {
    template: '%s | KorCan',
    default: 'KorCan - 캐나다 한인 커뮤니티',
  },
  description: '캐나다 생활의 모든 것, KorCan에서 시작하세요. 중고거래, 부동산, 모임, 뉴스까지 한곳에.',
  metadataBase: new URL('https://korcan.cc'),
  openGraph: {
    title: 'KorCan - 캐나다 한인 커뮤니티',
    description: '캐나다 생활의 모든 것, KorCan에서 시작하세요.',
    url: 'https://korcan.cc',
    siteName: 'KorCan',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KorCan - 캐나다 한인 커뮤니티',
    description: '캐나다 생활의 모든 것, KorCan에서 시작하세요.',
  },
  icons: {
    icon: '/favicon.ico', // Ensure this exists or use text
  },
  alternates: {
    canonical: './',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <SplashScreen />
            <Shell>
              {children}
            </Shell>
          </Providers>
        </StyledComponentsRegistry>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  name: 'KorCan',
                  url: 'https://korcan.cc',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://korcan.cc/search?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  name: 'KorCan',
                  url: 'https://korcan.cc',
                  logo: 'https://korcan.cc/logo.png',
                  description: '캐나다 한인 커뮤니티',
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
