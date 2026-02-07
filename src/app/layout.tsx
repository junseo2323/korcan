import type { Metadata } from 'next'
import StyledComponentsRegistry from '@/lib/registry'
import Providers from './providers'
import Shell from '@/components/layout/Shell'

export const metadata: Metadata = {
  title: 'KorCan',
  description: 'Korean Community in Canada',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
            <Shell>
              {children}
            </Shell>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
