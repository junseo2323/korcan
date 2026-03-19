'use client'

import styled from 'styled-components'

export const MobileWrapper = styled.div`
  padding-top: 60px; /* TopHeader height */
  padding-bottom: 80px; /* BottomNav height + extra padding */
  min-height: 100vh;
  position: relative;
  
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding-bottom: 0;
  }
`
