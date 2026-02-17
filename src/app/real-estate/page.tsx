import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: '부동산 | KorCan',
  description: '캐나다 한인 부동산 매물 정보',
}

export default function RealEstatePage() {
  redirect('/market?tab=REAL_ESTATE')
}
