'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is available as per previous context

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ImageList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`

const UploadButton = styled.label`
  width: 80px; 
  height: 80px;
  border-radius: 8px; 
  border: 1px dashed ${({ theme }) => theme.colors.border.primary};
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  cursor: pointer; 
  color: ${({ theme }) => theme.colors.text.secondary}; 
  font-size: 0.8rem; 
  gap: 4px;
  background-color: ${({ theme }) => theme.colors.background.secondary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.gray100};
  }
`

const PreviewItem = styled.div`
  position: relative; 
  width: 80px; 
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`

const PreviewImage = styled.img`
  width: 100%; 
  height: 100%; 
  object-fit: cover;
`

const RemoveButton = styled.button`
  position: absolute; 
  top: 2px; 
  right: 2px;
  background-color: rgba(239, 68, 68, 0.9); 
  color: white;
  border: none; 
  border-radius: 50%; 
  width: 20px; 
  height: 20px;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer;
  padding: 0;

  &:hover {
    background-color: rgb(220, 38, 38);
  }
`

interface ImageUploaderProps {
    label?: string
    maxImages?: number
    onImagesChange: (files: File[]) => void
}

export default function ImageUploader({ label = "사진 첨부", maxImages = 10, onImagesChange }: ImageUploaderProps) {
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)

            if (files.length + newFiles.length > maxImages) {
                toast.error(`최대 ${maxImages}장까지만 업로드 가능합니다.`)
                return
            }

            setFiles(prev => {
                const updated = [...prev, ...newFiles]
                onImagesChange(updated)
                return updated
            })

            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previews[index])

        setFiles(prev => {
            const updated = prev.filter((_, i) => i !== index)
            onImagesChange(updated)
            return updated
        })

        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <Container>
            <Label>{label}</Label>
            <ImageList>
                <UploadButton>
                    <ImageIcon size={24} />
                    <span>{files.length}/{maxImages}</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        disabled={files.length >= maxImages}
                    />
                </UploadButton>

                {previews.map((url, idx) => (
                    <PreviewItem key={idx}>
                        <PreviewImage src={url} />
                        <RemoveButton onClick={() => removeImage(idx)} type="button">
                            <X size={12} />
                        </RemoveButton>
                    </PreviewItem>
                ))}
            </ImageList>
        </Container>
    )
}
