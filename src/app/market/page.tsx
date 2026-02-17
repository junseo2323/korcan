import type { Metadata } from 'next'
import MarketClient from './MarketClient'

export const metadata: Metadata = {
  title: '중고장터 | KorCan',
  description: '캐나다 한인 중고 직거래 장터',
}

export default function MarketPage() {
  return <MarketClient />
}
