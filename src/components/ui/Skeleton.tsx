
'use client'

import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const BaseSkeleton = styled.div<{ $width?: string, $height?: string, $borderRadius?: string }>`
  background: #f3f4f6;
  background-image: linear-gradient(
    90deg,
    #f3f4f6 0px,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
  border-radius: ${({ $borderRadius }) => $borderRadius || '4px'};
`

interface SkeletonProps {
    width?: string
    height?: string
    borderRadius?: string
    style?: React.CSSProperties
}

export default function Skeleton({ width, height, borderRadius, style }: SkeletonProps) {
    return <BaseSkeleton $width={width} $height={height} $borderRadius={borderRadius} style={style} />
}
