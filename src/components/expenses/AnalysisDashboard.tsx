'use client'

import React from 'react'
import styled from 'styled-components'
import CategoryChart from '@/components/expenses/charts/CategoryChart'
import TrendChart from '@/components/expenses/charts/TrendChart'
import FixedExpenseManager from '@/components/expenses/FixedExpenseManager'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
`

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`

export default function AnalysisDashboard() {
  return (
    <DashboardContainer>
      <h2 style={{ textAlign: 'center' }}>Analytics</h2>
      <ChartsGrid>
        <CategoryChart />
        <TrendChart />
      </ChartsGrid>

      <FixedExpenseManager />
    </DashboardContainer>
  )
}
