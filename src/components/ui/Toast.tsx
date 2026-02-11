'use client'

import React, { useEffect, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
`

const fadeOut = keyframes`
  from { opacity: 1; transform: translate(-50%, 0); }
  to { opacity: 0; transform: translate(-50%, 10px); }
`

const ToastContainer = styled.div<{ $isClosing: boolean }>`
  position: fixed;
  bottom: 140px; /* Above CommentInput (60px + safe area) + Nav */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(33, 33, 33, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 4000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  white-space: nowrap;
  pointer-events: none;

  animation: ${({ $isClosing }) => $isClosing ? fadeOut : fadeIn} 0.3s ease-out forwards;
`

interface ToastProps {
    message: string
    duration?: number
    onClose: () => void
}

export default function Toast({ message, duration = 2000, onClose }: ToastProps) {
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClosing(true)
        }, duration - 300) // Start closing animation before unmount

        const closeTimer = setTimeout(() => {
            onClose()
        }, duration)

        return () => {
            clearTimeout(timer)
            clearTimeout(closeTimer)
        }
    }, [duration, onClose])

    return (
        <ToastContainer $isClosing={isClosing}>
            {message}
        </ToastContainer>
    )
}
