
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

const Block = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
`

export default function Loading() {
    return (
        <Container>
            <Header>
                <Skeleton width="120px" height="28px" style={{ marginBottom: '1rem' }} />
                <Skeleton width="100%" height="40px" borderRadius="12px" />
            </Header>

            {/* Stats Block */}
            <Block>
                <Skeleton width="140px" height="24px" style={{ marginBottom: '16px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton width="100px" height="32px" />
                    <Skeleton width="80px" height="24px" />
                </div>
            </Block>

            <Skeleton width="120px" height="24px" style={{ marginBottom: '1rem' }} />

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Skeleton width="40px" height="40px" borderRadius="50%" />
                            <div>
                                <Skeleton width="100px" height="20px" style={{ marginBottom: '4px' }} />
                                <Skeleton width="60px" height="16px" />
                            </div>
                        </div>
                        <Skeleton width="80px" height="20px" />
                    </div>
                ))}
            </div>
        </Container>
    )
}
