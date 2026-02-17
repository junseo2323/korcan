
'use client'

import Skeleton from '@/components/ui/Skeleton'
import styled from 'styled-components'

const Container = styled.div`
  padding: 1.5rem;
  padding-bottom: 80px;
`

const Header = styled.div`
  margin-bottom: 1.5rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`

export default function Loading() {
    return (
        <Container>
            <Header>
                <Skeleton width="100px" height="28px" style={{ marginBottom: '1rem' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Skeleton width="80px" height="32px" />
                    <Skeleton width="80px" height="32px" />
                </div>
            </Header>

            <Grid>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i}>
                        <Skeleton width="100%" height="150px" borderRadius="0" />
                        <div style={{ padding: '0.75rem' }}>
                            <Skeleton width="80%" height="20px" style={{ marginBottom: '4px' }} />
                            <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="40%" height="18px" />
                        </div>
                    </Card>
                ))}
            </Grid>
        </Container>
    )
}
