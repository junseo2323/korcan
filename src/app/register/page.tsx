'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text.primary};
`

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.status.error : theme.colors.border.primary};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.status.error : theme.colors.primary};
  }
`

const PhoneContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Select = styled.select`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
`

const ErrorText = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.status.error};
`

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral.gray300};
    cursor: not-allowed;
  }
`

export default function RegisterPage() {
  const { data: session, update } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phoneNumber: '',
    birthDate: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Validation Patterns
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const PHONE_KR_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
  const PHONE_CA_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  const validateField = (name: string, value: string, countryCode?: string) => {
    let error = ''
    switch (name) {
      case 'name':
        if (!value.trim()) error = '닉네임을 입력해주세요.'
        break
      case 'email':
        if (!EMAIL_REGEX.test(value)) error = '올바른 이메일 형식이 아닙니다.'
        break
      case 'phoneNumber':
        const code = countryCode || formData.countryCode
        if (code === '+82' && !PHONE_KR_REGEX.test(value)) error = '올바른 한국 휴대전화 번호를 입력해주세요.'
        if (code === '+1' && !PHONE_CA_REGEX.test(value)) error = '올바른 캐나다 전화번호를 입력해주세요.'
        break
      case 'birthDate':
        if (!value) error = '생년월일을 선택해주세요.'
        break
    }
    return error
  }

  // Auto-format phone number
  const formatPhoneNumber = (value: string, countryCode: string) => {
    const numbers = value.replace(/[^\d]/g, '')

    if (countryCode === '+1') {
      if (numbers.length <= 3) return numbers
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    } else {
      // Korea (+82)
      if (numbers.length <= 3) return numbers
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => {
      let newValue = value
      const currentCountryCode = name === 'countryCode' ? value : prev.countryCode

      if (name === 'phoneNumber') {
        newValue = formatPhoneNumber(value, currentCountryCode)
      }

      // If country code changes, re-format the existing phone number
      if (name === 'countryCode') {
        newValue = value
        const existingNumbers = prev.phoneNumber.replace(/[^\d]/g, '')
        const reFormattedPhone = formatPhoneNumber(existingNumbers, newValue)

        const updated = { ...prev, countryCode: newValue, phoneNumber: reFormattedPhone }
        return updated
      }

      const updated = { ...prev, [name]: newValue }
      // Validate
      const error = validateField(name, newValue, updated.countryCode)
      setErrors(prevErrors => ({ ...prevErrors, [name]: error }))

      return updated
    })
  }

  const handleSubmit = async () => {
    // Final Validation
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    const fullPhoneNumber = `${formData.countryCode} ${formData.phoneNumber}`

    try {
      const res = await fetch('/api/auth/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phoneNumber: fullPhoneNumber
        })
      })

      if (res.ok) {
        await update({ isRegistered: true })
        router.push('/')
        router.refresh()
      } else {
        alert('Registration failed')
      }
    } catch (e) {
      console.error(e)
      alert('Error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isValid = !Object.values(errors).some(e => e) &&
    formData.name && formData.email && formData.phoneNumber && formData.birthDate

  return (
    <Container>
      <Title>환영합니다!<br />필수 정보를 입력해주세요.</Title>

      <InputGroup>
        <Label>이름 (닉네임)</Label>
        <Input
          name="name"
          type="text"
          placeholder="홍길동"
          value={formData.name}
          onChange={handleChange}
          $hasError={!!errors.name}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>이메일</Label>
        <Input
          name="email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          $hasError={!!errors.email}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>전화번호</Label>
        <PhoneContainer>
          <Select name="countryCode" value={formData.countryCode} onChange={handleChange}>
            <option value="+1">+1 (CA)</option>
            <option value="+82">+82 (KR)</option>
          </Select>
          <Input
            name="phoneNumber"
            type="tel"
            placeholder={formData.countryCode === '+82' ? "010-1234-5678" : "123-456-7890"}
            value={formData.phoneNumber}
            onChange={handleChange}
            $hasError={!!errors.phoneNumber}
          />
        </PhoneContainer>
        {errors.phoneNumber && <ErrorText>{errors.phoneNumber}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>생년월일</Label>
        <Input
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          $hasError={!!errors.birthDate}
        />
        {errors.birthDate && <ErrorText>{errors.birthDate}</ErrorText>}
      </InputGroup>

      <Button onClick={handleSubmit} disabled={!isValid || loading}>
        {loading ? '처리중...' : '가입 완료'}
      </Button>
    </Container>
  )
}
