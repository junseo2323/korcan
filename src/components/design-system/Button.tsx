'use client'

import styled, { css } from 'styled-components'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text'
type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    isLoading?: boolean
}

const getVariantStyles = (variant: ButtonVariant = 'primary') => {
    switch (variant) {
        case 'primary':
            return css`
                background-color: ${({ theme }) => theme.colors.primary};
                color: ${({ theme }) => theme.colors.text.white};
                border: 1px solid transparent;
                &:hover:not(:disabled) {
                    background-color: ${({ theme }) => theme.colors.primaryStrong};
                }
                &:disabled {
                    background-color: ${({ theme }) => theme.colors.neutral.gray300};
                    color: ${({ theme }) => theme.colors.text.disabled};
                }
            `
        case 'secondary':
            return css`
                background-color: ${({ theme }) => theme.colors.secondary};
                color: ${({ theme }) => theme.colors.text.white};
                border: 1px solid transparent;
                &:hover:not(:disabled) {
                     opacity: 0.9;
                }
            `
        case 'outline':
            return css`
                background-color: transparent;
                color: ${({ theme }) => theme.colors.primary};
                border: 1px solid ${({ theme }) => theme.colors.primary};
                &:hover:not(:disabled) {
                    background-color: ${({ theme }) => theme.colors.primary}10;
                }
            `
        case 'text':
            return css`
                background-color: transparent;
                color: ${({ theme }) => theme.colors.text.primary};
                border: 1px solid transparent;
                &:hover:not(:disabled) {
                    background-color: ${({ theme }) => theme.colors.neutral.gray100};
                }
            `
    }
}

const getSizeStyles = (size: ButtonSize = 'medium') => {
    switch (size) {
        case 'small':
            return css`
                padding: 0.25rem 0.75rem;
                font-size: ${({ theme }) => theme.typography.fontSize.caption};
                height: 32px;
            `
        case 'medium':
            return css`
                padding: 0.5rem 1rem;
                font-size: ${({ theme }) => theme.typography.fontSize.body2};
                height: 44px;
            `
        case 'large':
            return css`
                padding: 0.75rem 1.5rem;
                font-size: ${({ theme }) => theme.typography.fontSize.body1};
                height: 52px;
            `
    }
}

const StyledButton = styled.button<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    
    ${({ variant }) => getVariantStyles(variant)}
    ${({ size }) => getSizeStyles(size)}
    
    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`

export const Button = (props: ButtonProps) => {
    return <StyledButton {...props}>{props.children}</StyledButton>
}
