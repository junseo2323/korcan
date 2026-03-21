import Link from 'next/link'

export const metadata = {
  title: '이용약관 | KorCan',
}

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 6rem', lineHeight: 1.8, color: '#1e293b' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>이용약관</h1>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>시행일: 2026년 3월 21일</p>

      <Section title="제1조 (목적)">
        <p>
          본 약관은 KorCan(이하 "서비스")이 제공하는 캐나다 한인 커뮤니티 서비스의 이용 조건 및
          절차, 이용자와 서비스 간의 권리·의무를 규정함을 목적으로 합니다.
        </p>
      </Section>

      <Section title="제2조 (정의)">
        <ul>
          <li><strong>서비스:</strong> KorCan이 운영하는 웹/앱 플랫폼 (korcan.cc)</li>
          <li><strong>이용자:</strong> 본 약관에 동의하고 서비스를 이용하는 자</li>
          <li><strong>회원:</strong> 가입 절차를 완료하여 계정을 보유한 이용자</li>
          <li><strong>콘텐츠:</strong> 회원이 서비스 내에 게시한 글, 사진, 댓글 등 일체의 정보</li>
        </ul>
      </Section>

      <Section title="제3조 (약관의 효력 및 변경)">
        <p>
          본 약관은 서비스에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
          서비스는 필요 시 약관을 변경할 수 있으며, 변경 시 공지사항을 통해 7일 전 공지합니다.
        </p>
      </Section>

      <Section title="제4조 (회원가입 및 자격)">
        <ul>
          <li>이용자는 서비스가 정한 가입 양식을 작성하여 동의함으로써 회원가입을 신청합니다.</li>
          <li><strong>만 14세 미만은 회원가입이 제한됩니다.</strong></li>
          <li>타인의 정보를 도용하거나 허위 정보를 기재한 경우 서비스 이용이 제한될 수 있습니다.</li>
        </ul>
      </Section>

      <Section title="제5조 (서비스 제공)">
        <p>서비스는 다음의 서비스를 제공합니다.</p>
        <ul>
          <li>커뮤니티 게시판 (커뮤니티, 자유게시판 등)</li>
          <li>중고 장터 및 부동산 정보 공유</li>
          <li>모임(Meetup) 생성 및 참가</li>
          <li>1:1 채팅</li>
          <li>가계부, 캘린더 등 유틸리티</li>
          <li>기타 서비스가 추가로 개발·제공하는 서비스</li>
        </ul>
        <p>
          서비스는 운영상 또는 기술상의 이유로 서비스를 일시 중단할 수 있으며,
          이 경우 사전에 공지합니다. 단, 긴급한 경우 사후에 공지할 수 있습니다.
        </p>
      </Section>

      <Section title="제6조 (이용자의 의무 및 금지 행위)">
        <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
        <ul>
          <li>타인의 개인정보 도용, 명예훼손, 모욕, 스팸 행위</li>
          <li>음란물, 혐오 표현, 불법 정보 게시</li>
          <li>서비스의 정상적인 운영을 방해하는 행위</li>
          <li>상업적 목적의 무단 광고·홍보 게시</li>
          <li>타인을 사칭하거나 허위 사실을 유포하는 행위</li>
          <li>관련 법령을 위반하는 일체의 행위</li>
        </ul>
        <p>위반 시 서비스 이용 제한, 계정 삭제 등의 조치가 취해질 수 있습니다.</p>
      </Section>

      <Section title="제7조 (콘텐츠의 권리 및 책임)">
        <p>
          회원이 서비스 내에 게시한 콘텐츠의 저작권은 회원 본인에게 있습니다.
          단, 회원은 서비스에 콘텐츠를 게시함으로써 서비스가 해당 콘텐츠를
          서비스 운영 목적으로 사용할 수 있는 비독점적 라이선스를 부여합니다.
        </p>
        <p>
          콘텐츠로 인한 법적 분쟁의 책임은 해당 콘텐츠를 게시한 회원에게 있으며,
          서비스는 이에 대해 책임을 지지 않습니다.
        </p>
      </Section>

      <Section title="제8조 (서비스의 면책)">
        <ul>
          <li>천재지변, 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
          <li>이용자의 귀책 사유로 발생한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
          <li>회원이 서비스를 통해 얻은 정보의 신뢰도·정확성에 대해 보증하지 않습니다.</li>
          <li>회원 간 거래(장터 등)에서 발생한 분쟁은 당사자 간 해결 원칙이며, 서비스는 개입하지 않습니다.</li>
        </ul>
      </Section>

      <Section title="제9조 (계정 탈퇴 및 자격 상실)">
        <p>
          회원은 언제든지 <a href="mailto:admin@korcan.cc" style={{ color: '#3B82F6' }}>admin@korcan.cc</a>로
          탈퇴를 요청할 수 있으며, 요청 후 5영업일 이내 처리됩니다.
          탈퇴 시 개인정보 처리방침에 따라 개인정보가 삭제되나, 법령에 따라 보존이 필요한 정보는 예외입니다.
        </p>
      </Section>

      <Section title="제10조 (준거법 및 관할)">
        <p>
          본 약관은 캐나다 온타리오 주법을 준거법으로 하며,
          서비스 이용으로 인한 분쟁이 발생할 경우 온타리오 주 법원을 전속 관할 법원으로 합니다.
          단, 대한민국 내 이용자와의 분쟁에 대해서는 대한민국 법률이 적용될 수 있습니다.
        </p>
      </Section>

      <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#64748b' }}>
        문의: <a href="mailto:admin@korcan.cc" style={{ color: '#3B82F6' }}>admin@korcan.cc</a>
      </p>

      <p style={{ marginTop: '1rem' }}>
        <Link href="/privacy" style={{ color: '#3B82F6', fontSize: '0.9rem' }}>개인정보 처리방침 보기 →</Link>
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
