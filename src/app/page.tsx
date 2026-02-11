'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { GridContainer, FullWidthBlock, TimezoneBlock, PopularPostsBlock, TodayScheduleBlock, AdBlock, MonthlyExpenseBlock } from '@/components/home/HomeWidgets'

const Header = styled.div`
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
`

const Greeting = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`

const SubGreeting = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

export default function Home() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Get client's local date YYYY-MM-DD
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    fetch(`/api/home?date=${dateStr}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  return (
    <>
      <Header>
        <Greeting>안녕하세요, {data?.user?.name || '방문자'}님</Greeting>
        <SubGreeting>오늘도 활기차게 시작해보세요!</SubGreeting>
      </Header>

      <GridContainer>
        {/* Row 1: Timezone (Full Width) */}
        <FullWidthBlock>
          <TimezoneBlock />
        </FullWidthBlock>

        {/* Row 2: Schedule & Expense (Half Width) */}
        <TodayScheduleBlock count={data?.incompleteTodosCount || 0} userName={data?.user?.name} />
        <MonthlyExpenseBlock expenses={data?.monthlyExpenses || { CAD: 0, KRW: 0 }} />

        {/* Row 3: Ad (Full Width for visual break) -> Actually User requested Ad "Block". Let's put it at bottom or as full width */}
        <FullWidthBlock>
          <AdBlock />
        </FullWidthBlock>

        {/* Row 4: Popular Posts (Full Width) */}
        <FullWidthBlock>
          <PopularPostsBlock posts={data?.popularPosts || []} />
        </FullWidthBlock>
      </GridContainer>
    </>
  )
}
