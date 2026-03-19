import type { Metadata } from 'next'
import CommunityClient from './CommunityClient'

export const metadata: Metadata = {
  title: '커뮤니티 | KorCan',
  description: '캐나다 한인들의 자유로운 소통 공간',
  alternates: { canonical: 'https://korcan.cc/community' },
}

export default function CommunityPage() {
  return <CommunityClient />
}
