import Link from 'next/link'

export const metadata = {
  title: '개인정보 처리방침 | KorCan',
}

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 6rem', lineHeight: 1.8, color: '#1e293b' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>개인정보 처리방침</h1>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>시행일: 2026년 3월 21일</p>

      <p>
        KorCan (이하 "서비스")은 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 및 캐나다
        「PIPEDA」에 따라 아래와 같이 개인정보 처리방침을 수립·공개합니다.
      </p>

      <Section title="1. 수집하는 개인정보 항목 및 수집 방법">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <Th>구분</Th><Th>수집 항목</Th><Th>수집 방법</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>필수</Td>
              <Td>이름(닉네임), 이메일, 전화번호, 생년월일, 지역</Td>
              <Td>회원가입 시 직접 입력</Td>
            </tr>
            <tr>
              <Td>자동 수집</Td>
              <Td>프로필 사진, OAuth 연결 정보 (Google/Kakao 계정 ID)</Td>
              <Td>소셜 로그인 연동</Td>
            </tr>
            <tr>
              <Td>자동 수집</Td>
              <Td>서비스 이용 기록, 접속 로그, 기기 정보</Td>
              <Td>서비스 이용 과정에서 자동 생성 (Google Analytics)</Td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="2. 개인정보의 수집·이용 목적">
        <ul>
          <li>회원 식별 및 본인 확인</li>
          <li>서비스 제공 (커뮤니티, 장터, 모임, 채팅 등)</li>
          <li>서비스 개선 및 통계 분석</li>
          <li>이용약관 위반 행위 제재</li>
          <li>법령상 의무 이행</li>
        </ul>
      </Section>

      <Section title="3. 개인정보의 보유 및 이용 기간">
        <p>
          회원탈퇴 시 지체 없이 파기합니다. 단, 관련 법령에 의해 일정 기간 보존이 필요한 경우 아래와 같이 보유합니다.
        </p>
        <ul>
          <li>서비스 이용 기록: 3개월 (통신비밀보호법)</li>
          <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
        </ul>
      </Section>

      <Section title="4. 개인정보의 제3자 제공">
        <p>서비스는 아래와 같이 외부 서비스와 연동되며, 해당 데이터는 각 서비스 약관에 따라 처리됩니다.</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <Th>제공 대상</Th><Th>제공 항목</Th><Th>목적</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Google LLC</Td>
              <Td>서비스 이용 행동 데이터 (Google Analytics)</Td>
              <Td>이용 통계 분석</Td>
            </tr>
            <tr>
              <Td>Google LLC</Td>
              <Td>Google 계정 ID, 이메일, 프로필</Td>
              <Td>Google 소셜 로그인</Td>
            </tr>
            <tr>
              <Td>Kakao Corp.</Td>
              <Td>Kakao 계정 ID</Td>
              <Td>카카오 소셜 로그인</Td>
            </tr>
            <tr>
              <Td>Amazon Web Services</Td>
              <Td>업로드 이미지 파일</Td>
              <Td>이미지 저장 (S3, ca-central-1)</Td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="5. 개인정보의 파기 절차 및 방법">
        <p>
          전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법으로 삭제합니다.
          탈퇴 요청은 <a href="mailto:admin@korcan.cc" style={{ color: '#3B82F6' }}>admin@korcan.cc</a>로 문의 주시면 처리합니다.
        </p>
      </Section>

      <Section title="6. 정보주체의 권리">
        <p>이용자는 언제든지 아래 권리를 행사할 수 있습니다.</p>
        <ul>
          <li>개인정보 열람 요청</li>
          <li>개인정보 정정·삭제 요청</li>
          <li>개인정보 처리정지 요청</li>
          <li>동의 철회 (회원탈퇴)</li>
        </ul>
        <p>요청은 <a href="mailto:admin@korcan.cc" style={{ color: '#3B82F6' }}>admin@korcan.cc</a>로 하시면 5영업일 이내 처리합니다.</p>
      </Section>

      <Section title="7. 개인정보 보호책임자">
        <ul>
          <li><strong>성명:</strong> KorCan 운영팀</li>
          <li><strong>이메일:</strong> <a href="mailto:admin@korcan.cc" style={{ color: '#3B82F6' }}>admin@korcan.cc</a></li>
        </ul>
        <p>
          개인정보 처리에 관한 문의, 불만 처리, 피해 구제 등은 위 연락처로 문의 주시기 바랍니다.
          또한 개인정보보호 관련 신고나 상담은 개인정보분쟁조정위원회(www.kopico.go.kr) 또는
          개인정보침해신고센터(privacy.kisa.or.kr)에 도움을 요청할 수 있습니다.
        </p>
      </Section>

      <Section title="8. 쿠키(Cookie) 운영">
        <p>
          서비스는 로그인 세션 유지 및 서비스 이용 분석을 위해 쿠키를 사용합니다.
          브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.
        </p>
      </Section>

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#64748b' }}>
        본 방침은 2026년 3월 21일부터 적용됩니다.
        내용 변경 시 서비스 공지사항을 통해 안내합니다.
      </p>

      <p style={{ marginTop: '1rem' }}>
        <Link href="/terms" style={{ color: '#3B82F6', fontSize: '0.9rem' }}>이용약관 보기 →</Link>
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>{title}</h2>
      {children}
    </section>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ border: '1px solid #e2e8f0', padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ border: '1px solid #e2e8f0', padding: '8px 12px', verticalAlign: 'top' }}>
      {children}
    </td>
  )
}