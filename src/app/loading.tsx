
'use client'

import Skeleton from '@/components/ui/Skeleton'
import styled from 'styled-components'

const Container = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 80px;
`

const Header = styled.div`
  margin-bottom: 0.5rem;
`

const Block = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

export default function Loading() {
    return (
        <Container>
            <Header>
                <Skeleton width="60%" height="32px" style={{ marginBottom: '8px' }} />
                <Skeleton width="40%" height="20px" />
            </Header>

            {/* Timezone */}
            <Block>
                <Skeleton width="100px" height="24px" style={{ marginBottom: '16px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Skeleton width="80px" height="36px" style={{ marginBottom: '4px' }} />
                        <Skeleton width="60px" height="16px" />
                    </div>
                    <Skeleton width="40px" height="40px" borderRadius="50%" />
                    <div>
                        <Skeleton width="80px" height="36px" style={{ marginBottom: '4px' }} />
                        <Skeleton width="60px" height="16px" />
                    </div>
                </div>
            </Block>

            {/* Grid: Schedule & Expense */}
            <Grid>
                <Block>
                    <Skeleton width="80px" height="20px" style={{ marginBottom: '12px' }} />
                    <Skeleton width="100%" height="60px" />
                </Block>
                <Block>
                    <Skeleton width="80px" height="20px" style={{ marginBottom: '12px' }} />
                    <Skeleton width="100%" height="60px" />
                </Block>
            </Grid>

            {/* Meetups */}
            <Block>
                <Skeleton width="120px" height="24px" style={{ marginBottom: '16px' }} />
                <div style={{ display: 'flex', gap: '1rem', overflow: 'hidden' }}>
                    <Skeleton width="140px" height="180px" />
                    <Skeleton width="140px" height="180px" />
                    <Skeleton width="140px" height="180px" />
                </div>
            </Block>
        </Container>
    )
}
