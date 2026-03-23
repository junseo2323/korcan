import type { Metadata } from 'next'
import React from 'react'
import { getServerSession } from 'next-auth'

export const metadata: Metadata = {
  title: '홈',
  description: '캐나다 한인 커뮤니티 KorCan에서 정보를 나누고 함께 성장하세요.',
}
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GridContainer, FullWidthBlock, HalfWidthBlock, QuarterWidthBlock, TimezoneBlock, PopularPostsBlock, TodayScheduleBlock, AdBlock, MonthlyExpenseBlock, SupportersAdBlock, DynamicBannerBlock } from '@/components/home/HomeWidgets'
import MeetupRecommendationBlock from '@/components/home/MeetupRecommendationBlock'
import PropertyRecommendationBlock from '@/components/home/PropertyRecommendationBlock'
import Link from 'next/link'
import { DEFAULT_LAYOUT } from '@/app/api/admin/home-layout/route'

async function getData() {
  const session = await getServerSession(authOptions)

  // Defaults
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  // 1. Popular Posts (Top 5)
  const popularPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { likes: { _count: 'desc' } },
    include: {
      _count: { select: { likes: true, comments: true } }
    }
  })

  // 2. Recent Meetups (only those with an existing post)
  const recentMeetups = await prisma.meetup.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    where: { posts: { some: {} } },
    select: {
      id: true, title: true, date: true, region: true,
      maxMembers: true, currentMembers: true, image: true,
      posts: { select: { id: true }, take: 1 }
    }
  })

  // 3. Recent Properties
  const recentProperties = await prisma.property.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      type: true,
      images: {
        take: 1,
        select: { url: true }
      }
    }
  })

  // 4. Supporters Post
  const supportersPost = await prisma.post.findFirst({
    where: {
      title: { contains: 'KorCan 서포터즈' },
      user: { role: 'ADMIN' }
    },
    select: { id: true }
  })

  let incompleteTodosCount = 0
  let monthlyExpenses = { CAD: 0, KRW: 0 }
  let userName = ''

  if (session?.user?.id) {
    userName = session.user.name || '사용자'

    // Todos
    incompleteTodosCount = await prisma.todo.count({
      where: {
        userId: session.user.id,
        isCompleted: false,
        date: { gte: startOfDay, lte: endOfDay }
      }
    })

    // Expenses (This Month)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const expenses = await prisma.expense.groupBy({
      by: ['currency'],
      _sum: { amount: true },
      where: {
        userId: session.user.id,
        date: { gte: startOfMonth, lte: endOfMonth }
      }
    })

    expenses.forEach(e => {
      if (e.currency === 'CAD') monthlyExpenses.CAD = e._sum.amount || 0
      if (e.currency === 'KRW') monthlyExpenses.KRW = e._sum.amount || 0
    })
  }

  return {
    user: session?.user ? { name: userName } : null,
    popularPosts: popularPosts.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      likes: p._count.likes,
      comments: p._count.comments
    })),
    incompleteTodosCount,
    monthlyExpenses,
    recentMeetups: recentMeetups.map(m => ({
      id: m.id,
      title: m.title,
      date: m.date.toISOString(),
      region: m.region,
      currentMembers: m.currentMembers,
      maxMembers: m.maxMembers,
      image: m.image
    })),
    recentProperties: recentProperties.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      currency: p.currency,
      type: p.type,
      imageUrl: p.images[0]?.url || ''
    })),
    supportersPostId: supportersPost?.id
  }
}

async function getLayout() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const config = await prisma.siteConfig.findUnique({ where: { key: 'home_layout' } })
    return (config?.value as typeof DEFAULT_LAYOUT) ?? DEFAULT_LAYOUT
  } catch {
    return DEFAULT_LAYOUT
  }
}

function WidgetWrapper({ size, children }: { size: string; children: React.ReactNode }) {
  if (size === 'half') return <HalfWidthBlock>{children}</HalfWidthBlock>
  if (size === 'quarter') return <QuarterWidthBlock>{children}</QuarterWidthBlock>
  return <FullWidthBlock>{children}</FullWidthBlock>
}

export default async function Home() {
  const [data, layout] = await Promise.all([getData(), getLayout()])

  const renderWidget = (key: string) => {
    switch (key) {
      case 'supporters':
        return data.supportersPostId ? (
          <Link href={`/community/${data.supportersPostId}`} style={{ textDecoration: 'none' }}>
            <SupportersAdBlock />
          </Link>
        ) : null
      case 'timezone':
        return <TimezoneBlock />
      case 'schedule':
        return <TodayScheduleBlock count={data.incompleteTodosCount} userName={data.user?.name || ''} />
      case 'expense':
        return <MonthlyExpenseBlock expenses={data.monthlyExpenses} />
      case 'meetup':
        return <MeetupRecommendationBlock meetups={data.recentMeetups} />
      case 'popular_posts':
        return <PopularPostsBlock posts={data.popularPosts} />
      case 'banner':
        return <DynamicBannerBlock />
      case 'property':
        return <PropertyRecommendationBlock properties={data.recentProperties} />
      case 'ad':
        return <AdBlock />
      default:
        return null
    }
  }

  return (
    <>
      <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          안녕하세요, {data.user?.name || '방문자'}님
        </h1>
        <p style={{ fontSize: '1rem', color: '#6B7280' }}>
          오늘도 활기차게 시작해보세요!
        </p>
      </div>

      <GridContainer>
        {layout
          .filter(w => w.visible)
          .map(w => {
            const content = renderWidget(w.key)
            if (!content) return null
            return (
              <WidgetWrapper key={w.key} size={w.size}>
                {content}
              </WidgetWrapper>
            )
          })}
      </GridContainer>
    </>
  )
}
