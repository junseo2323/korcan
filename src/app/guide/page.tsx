export const metadata = {
  title: '사용 가이드 | KorCan',
  description: 'KorCan 캐나다 한인 커뮤니티 앱 사용 방법을 안내합니다.',
}

const sections = [
  {
    imgs: ['/screenshots/mobile/01_home_1.png', '/screenshots/mobile/01_home_2.png'],
    title: '홈',
    desc: '앱을 열면 인기글, 추천 매물, 모임 정보를 한눈에 확인할 수 있습니다. 캐나다 생활에 필요한 정보를 빠르게 탐색해보세요.',
  },
  {
    imgs: ['/screenshots/mobile/02_login_1.png'],
    title: '로그인',
    desc: '카카오 또는 구글 계정으로 간편하게 로그인할 수 있습니다. 별도의 비밀번호 없이 소셜 계정만으로 이용 가능합니다.',
  },
  {
    imgs: ['/screenshots/mobile/03_register_1.png', '/screenshots/mobile/03_register_2.png'],
    title: '회원가입',
    desc: '닉네임과 거주 지역을 설정하면 가입이 완료됩니다. 지역 설정 시 내 지역 맞춤 정보를 우선으로 볼 수 있습니다.',
  },
  {
    imgs: ['/screenshots/mobile/04_community_list_1.png', '/screenshots/mobile/04_community_list_2.png'],
    title: '커뮤니티',
    desc: '자유게시판, 질문, 정보 공유 등 다양한 카테고리의 글을 확인할 수 있습니다. 캐나다 한인들과 자유롭게 소통해보세요.',
  },
  {
    imgs: ['/screenshots/mobile/05_community_write_1.png'],
    title: '글쓰기',
    desc: '카테고리를 선택하고 사진을 첨부해 게시글을 작성할 수 있습니다. 질문, 정보, 일상 모두 환영합니다.',
  },
  {
    imgs: ['/screenshots/mobile/06_community_detail_1.png', '/screenshots/mobile/06_community_detail_2.png'],
    title: '게시글 상세',
    desc: '게시글에 댓글을 달거나 좋아요를 누를 수 있습니다. 작성자와 1:1 채팅으로 직접 연결할 수도 있습니다.',
  },
  {
    imgs: ['/screenshots/mobile/17_meetup_1.png', '/screenshots/mobile/17_meetup_2.png'],
    title: '모임',
    desc: '커뮤니티의 모임 탭에서 한인들이 주최하는 다양한 모임을 찾아볼 수 있습니다. 직접 모임을 만들어 새로운 인연을 사귀어보세요.',
  },
  {
    imgs: ['/screenshots/mobile/07_market_list_1.png', '/screenshots/mobile/06b_market_detail_1.png'],
    title: '중고 장터',
    desc: '내 지역의 중고 매물을 둘러보세요. 지역 필터로 가까운 곳의 매물만 모아볼 수 있고, 매물 상세 페이지에서 판매자와 바로 채팅을 시작할 수 있습니다.',
  },
  {
    imgs: ['/screenshots/mobile/08_market_sell_1.png', '/screenshots/mobile/08_market_sell_2.png'],
    title: '판매글 작성',
    desc: '사진을 올리고 가격과 지역을 입력하면 바로 판매글이 등록됩니다. 간단하게 중고 거래를 시작해보세요.',
  },
  {
    imgs: ['/screenshots/mobile/09_jobs_1.png', '/screenshots/mobile/09_jobs_2.png'],
    title: '일자리',
    desc: '캐나다 한인 구인·구직 정보를 모아볼 수 있습니다. 공고를 탭하면 회사, 위치, 급여, 고용형태 등 상세 정보를 바로 확인할 수 있습니다.',
  },
  {
    imgs: ['/screenshots/mobile/10_realestate_list_1.png', '/screenshots/mobile/10b_realestate_detail_1.png'],
    title: '부동산',
    desc: '렌트, 홈스테이, 매매 등 부동산 매물을 지역별로 탐색하고 상세 정보와 위치를 확인할 수 있습니다.',
  },
  {
    imgs: ['/screenshots/mobile/11_realestate_create_1.png', '/screenshots/mobile/11_realestate_create_2.png'],
    title: '부동산 등록',
    desc: '보유한 매물을 직접 등록할 수 있습니다. 사진과 상세 정보를 입력해 빠르게 홍보하세요.',
  },
  {
    imgs: ['/screenshots/mobile/12_planner_1.png', '/screenshots/mobile/12_planner_2.png'],
    title: '플래너',
    desc: '할 일과 일정을 관리할 수 있는 개인 플래너입니다. 캐나다 생활의 중요한 날짜를 놓치지 마세요.',
  },
  {
    imgs: ['/screenshots/mobile/16_expenses_1.png', '/screenshots/mobile/16_expenses_2.png'],
    title: '가계부',
    desc: '지출을 날짜별로 기록하고 관리할 수 있습니다. 항목 추가 시 카테고리 아이콘(☕ Food → 🚌 Transport → 🛍 Shopping → ⋯ Other)을 탭해 분류를 선택하고, 📷 카메라 버튼으로 영수증을 촬영하면 AI가 금액·가게 이름·카테고리를 자동으로 채워줍니다.',
  },
  {
    imgs: ['/screenshots/mobile/16_expenses_analysis_1.png', '/screenshots/mobile/16_expenses_analysis_2.png'],
    title: '소비 분석',
    desc: '소비 분석 탭에서 카테고리별 지출 비율과 월별 소비 추이를 차트로 확인할 수 있습니다. 어디에 얼마나 쓰는지 한눈에 파악해보세요.',
  },
]

export default function GuidePage() {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1.5rem 6rem', color: '#1e293b' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>사용 가이드</h1>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        KorCan의 주요 기능을 소개합니다.
      </p>

      {sections.map((section, i) => (
        <div key={section.title} style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '1.5rem', height: '1.5rem', borderRadius: '50%',
              background: '#3B82F6', color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{section.title}</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: section.imgs.length === 1 ? '1fr' : '1fr 1fr',
            gap: '8px',
            marginBottom: '0.875rem',
          }}>
            {section.imgs.map((src, j) => (
              <div key={j} style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${section.title} ${j + 1}`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: '#475569', margin: 0 }}>
            {section.desc}
          </p>
        </div>
      ))}

      <div style={{
        marginTop: '1rem', padding: '1.25rem', borderRadius: '12px',
        background: '#f0f9ff', border: '1px solid #bae6fd', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: 0, lineHeight: 1.6 }}>
          더 궁금한 점이 있으신가요?<br />
          <strong>커뮤니티 게시판</strong>에 질문을 남겨주세요.
        </p>
      </div>
    </div>
  )
}
