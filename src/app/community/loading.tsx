
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export default function Loading() {
    return (
        <Container>
            <Header>
                <Skeleton width="120px" height="28px" />
                <Skeleton width="100px" height="36px" borderRadius="20px" />
            </Header>

            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #f3f4f6', marginBottom: '1rem' }}>
                <Skeleton width="80px" height="32px" />
                <Skeleton width="80px" height="32px" />
            </div>

            {/* Featured Posts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <Skeleton width="100%" height="120px" borderRadius="12px" />
                <Skeleton width="100%" height="100px" borderRadius="12px" />
            </div>

            {/* Post List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3, 4].map(i => (
                    <Card key={i}>
                        <Skeleton width="60px" height="20px" borderRadius="10px" />
                        <Skeleton width="80%" height="24px" />
                        <Skeleton width="100%" height="20px" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                            <Skeleton width="100px" height="16px" />
                            <Skeleton width="60px" height="16px" />
                        </div>
                    </Card>
                ))}
            </div>
        </Container>
    )
}
