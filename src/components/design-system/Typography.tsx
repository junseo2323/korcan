'use client'

import styled, { css } from 'styled-components'

type VariantType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body1' | 'body2' | 'caption'

interface TextProps {
    variant?: VariantType
    color?: string
    weight?: number | 'regular' | 'medium' | 'bold'
    align?: 'left' | 'center' | 'right'
}

export const Text = styled.p<TextProps>`
    margin: 0;
    text-align: ${({ align }) => align || 'left'};
    color: ${({ theme, color }) => color || theme.colors.text.primary};
    
    ${({ theme, variant = 'body1' }) => css`
        font-size: ${theme.typography.fontSize[variant]};
        line-height: ${theme.typography.lineHeight[variant]};
    `}
    
    ${({ theme, weight }) => {
        if (typeof weight === 'number') return css`font-weight: ${weight};`
        if (weight === 'regular') return css`font-weight: ${theme.typography.fontWeight.regular};`
        if (weight === 'medium') return css`font-weight: ${theme.typography.fontWeight.medium};`
        if (weight === 'bold') return css`font-weight: ${theme.typography.fontWeight.bold};`
        return ''
    }}
`
