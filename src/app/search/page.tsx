import type { Metadata } from 'next'
import SearchClient from './SearchClient'

type Props = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" 검색 결과 | KorCan` : '검색 | KorCan',
    description: 'KorCan에서 커뮤니티 게시글, 중고거래, 부동산을 검색하세요.',
    robots: { index: false, follow: false },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  return <SearchClient initialQuery={q} />
}
