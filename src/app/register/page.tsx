'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import Toast from '@/components/ui/Toast'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.secondary};

  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }
`

const FormCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};

  @media (min-width: 768px) {
    width: 100%;
    max-width: 480px;
    flex: unset;
    border-radius: 24px;
    padding: 2.5rem 2rem;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  }
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

const ConsentBox = styled.div`
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ConsentRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.5;

  input[type='checkbox'] {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`

const ConsentBadge = styled.span<{ $required?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $required }) => ($required ? '#ef4444' : '#64748b')};
  margin-right: 0.25rem;
`

export default function RegisterPage() {
  const { data: session, update } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phoneNumber: '',
    birthDate: '',
    region: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState({ terms: false, privacy: false, marketing: false })
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null)

  // Toast State
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  const showToast = (message: string) => {
    setToast({ show: true, message })
  }

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
        if (!value) {
          error = '생년월일을 선택해주세요.'
        } else {
          const birth = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birth.getFullYear() -
            (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0)
          if (age < 14) error = '만 14세 미만은 가입할 수 없습니다.'
        }
        break
      case 'region':
        if (!value) error = '지역을 선택해주세요.'
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
          phoneNumber: fullPhoneNumber,
          marketingConsent: consent.marketing,
        })
      })

      if (res.ok) {
        await update({ isRegistered: true })
        router.push('/')
        router.refresh()
      } else {
        showToast('Registration failed')
      }
    } catch (e) {
      console.error(e)
      showToast('Error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isValid = !Object.values(errors).some(e => e) &&
    formData.name && formData.email && formData.phoneNumber && formData.birthDate && formData.region &&
    consent.terms && consent.privacy

  return (
    <Container>
      <FormCard>
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

      <InputGroup>
        <Label>지역 (Region)</Label>
        <Select
          name="region"
          value={formData.region}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <option value="" disabled>지역을 선택해주세요</option>
          <option value="Toronto">토론토 (Toronto)</option>
          <option value="Vancouver">밴쿠버 (Vancouver)</option>
          <option value="Montreal">몬트리올 (Montreal)</option>
          <option value="Quebec">퀘벡 (Quebec)</option>
          <option value="Calgary">캘거리 (Calgary)</option>
          <option value="Ottawa">오타와 (Ottawa)</option>
          <option value="Edmonton">에드먼턴 (Edmonton)</option>
          <option value="Winnipeg">위니펙 (Winnipeg)</option>
          <option value="Halifax">할리팩스 (Halifax)</option>
          <option value="Other">그 외 (Other)</option>
        </Select>
        <ErrorText style={{ color: '#666', marginTop: '0.5rem' }}>
          * 목록에 없는 경우 가장 가까운 선호 지역을 선택하셔도 됩니다.
        </ErrorText>
        {errors.region && <ErrorText>{errors.region}</ErrorText>}
      </InputGroup>

      <ConsentBox>
        <ConsentRow>
          <input
            type="checkbox"
            checked={consent.terms}
            onChange={e => setConsent(p => ({ ...p, terms: e.target.checked }))}
          />
          <span>
            <ConsentBadge $required>[필수]</ConsentBadge>
            <button type="button" onClick={() => setLegalModal('terms')} style={{ background: 'none', border: 'none', padding: 0, color: '#3B82F6', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}>이용약관</button>에 동의합니다.
          </span>
        </ConsentRow>
        <ConsentRow>
          <input
            type="checkbox"
            checked={consent.privacy}
            onChange={e => setConsent(p => ({ ...p, privacy: e.target.checked }))}
          />
          <span>
            <ConsentBadge $required>[필수]</ConsentBadge>
            <button type="button" onClick={() => setLegalModal('privacy')} style={{ background: 'none', border: 'none', padding: 0, color: '#3B82F6', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}>개인정보 수집·이용</button>에 동의합니다.
            <br />
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              수집항목: 이름·이메일·전화번호·생년월일·지역 / 목적: 서비스 제공 / 보유: 탈퇴 시 삭제
            </span>
          </span>
        </ConsentRow>
        <ConsentRow>
          <input
            type="checkbox"
            checked={consent.marketing}
            onChange={e => setConsent(p => ({ ...p, marketing: e.target.checked }))}
          />
          <span>
            <ConsentBadge>[선택]</ConsentBadge>
            마케팅·이벤트 알림 수신에 동의합니다.
          </span>
        </ConsentRow>
      </ConsentBox>

      <Button onClick={handleSubmit} disabled={!isValid || loading}>
        {loading ? '처리중...' : '가입 완료'}
      </Button>

      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {legalModal && (
        <div
          onClick={() => setLegalModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 10000, display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', width: '100%', maxHeight: '80vh',
              borderRadius: '20px 20px 0 0', overflowY: 'auto',
              padding: '1.5rem 1.25rem 2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '1rem' }}>
                {legalModal === 'terms' ? '이용약관' : '개인정보 처리방침'}
              </strong>
              <button
                onClick={() => setLegalModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >✕</button>
            </div>
            {legalModal === 'terms' ? <TermsContent /> : <PrivacyContent />}
          </div>
        </div>
      )}
      </FormCard>
    </Container>
  )
}

function TermsContent() {
  return (
    <div style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#1e293b' }}>
      <p style={{ marginBottom: '1rem' }}>KorCan(이하 "서비스")은 캐나다 한인 커뮤니티 플랫폼으로, 본 약관은 서비스 이용 조건 및 이용자와 서비스 간의 권리·의무를 규정합니다.</p>
      <b>제1조 회원 자격</b>
      <p>만 14세 이상이어야 가입할 수 있습니다. 타인의 정보를 도용하거나 허위 정보를 기재한 경우 이용이 제한됩니다.</p>
      <b>제2조 금지 행위</b>
      <p>타인 명예훼손, 음란물·혐오 표현 게시, 스팸, 불법 광고, 서비스 운영 방해 행위는 금지됩니다. 위반 시 계정 제재 또는 삭제 조치가 취해질 수 있습니다.</p>
      <b>제3조 콘텐츠 권리</b>
      <p>회원이 게시한 콘텐츠의 저작권은 회원 본인에게 있으며, 서비스는 운영 목적으로 비독점적으로 사용할 수 있습니다. 콘텐츠로 인한 법적 분쟁의 책임은 게시자에게 있습니다.</p>
      <b>제4조 서비스 면책</b>
      <p>천재지변·불가항력적 사유로 인한 중단, 이용자 귀책 장애, 회원 간 거래 분쟁에 대해 서비스는 책임지지 않습니다.</p>
      <b>제5조 탈퇴</b>
      <p>admin@korcan.cc로 탈퇴 요청 시 5영업일 이내 처리됩니다.</p>
      <b>제6조 준거법</b>
      <p>본 약관은 대한민국 법률을 준거법으로 합니다.</p>
      <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}>시행일: 2026년 3월 21일</p>
    </div>
  )
}

function PrivacyContent() {
  return (
    <div style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#1e293b' }}>
      <p style={{ marginBottom: '1rem' }}>KorCan은 「개인정보 보호법」 및 캐나다 PIPEDA에 따라 아래와 같이 개인정보를 처리합니다.</p>
      <b>수집 항목</b>
      <p>이름(닉네임), 이메일, 전화번호, 생년월일, 지역, 프로필 사진, OAuth 연결 정보(Google/Kakao)</p>
      <b>수집 목적</b>
      <p>회원 식별, 서비스 제공(커뮤니티·장터·채팅 등), 서비스 개선</p>
      <b>보유 기간</b>
      <p>회원탈퇴 시 즉시 삭제. 단, 법령에 따라 필요한 정보는 해당 기간 보존.</p>
      <b>제3자 제공</b>
      <p>Google(Analytics·OAuth), Kakao(OAuth), AWS(이미지 저장) — 각 서비스 약관에 따라 처리됩니다.</p>
      <b>정보주체 권리</b>
      <p>열람·정정·삭제·처리정지 요청 가능. admin@korcan.cc로 문의 시 5영업일 이내 처리.</p>
      <b>개인정보보호책임자</b>
      <p>KorCan 운영팀 · admin@korcan.cc</p>
      <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}>시행일: 2026년 3월 21일</p>
    </div>
  )
}
