'use client'

import React from 'react'
import styled from 'styled-components'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    fullWidth?: boolean
}

const Container = styled.div<{ $fullWidth?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`

const Label = styled.label`
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const StyledInput = styled.input<{ $hasError?: boolean }>`
    padding: 0.75rem;
    border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.status.error : theme.colors.border.primary};
    border-radius: 4px;
    font-size: ${({ theme }) => theme.typography.fontSize.body2};
    background-color: ${({ theme }) => theme.colors.neutral.white};
    transition: border-color 0.2s;
    
    &:focus {
        outline: none;
        border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.status.error : theme.colors.primary};
    }
    
    &::placeholder {
        color: ${({ theme }) => theme.colors.neutral.gray500};
    }
`

const ErrorText = styled.span`
    font-size: 11px;
    color: ${({ theme }) => theme.colors.status.error};
`

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = true, ...props }, ref) => {
        return (
            <Container $fullWidth={fullWidth}>
                {label && <Label>{label}</Label>}
                <StyledInput ref={ref} $hasError={!!error} {...props} />
                {error && <ErrorText>{error}</ErrorText>}
            </Container>
        )
    }
)

Input.displayName = 'Input'
