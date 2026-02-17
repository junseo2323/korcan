
'use client'

import Skeleton from '@/components/ui/Skeleton'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding-bottom: 80px;
`

const ProfileSection = styled.div`
  background-color: white;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #f3f4f6;
`

const MenuSection = styled.div`
  background-color: white;
  margin-top: 1rem;
  padding: 0 1.5rem;
`

const MenuItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default function Loading() {
    return (
        <Container>
            <ProfileSection>
                <Skeleton width="100px" height="100px" borderRadius="50%" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Skeleton width="120px" height="24px" />
                    <Skeleton width="80px" height="16px" />
                </div>
            </ProfileSection>

            <MenuSection>
                {[1, 2, 3, 4].map((i) => (
                    <MenuItem key={i}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Skeleton width="24px" height="24px" />
                            <Skeleton width="100px" height="20px" />
                        </div>
                        <Skeleton width="20px" height="20px" />
                    </MenuItem>
                ))}
            </MenuSection>
        </Container>
    )
}
