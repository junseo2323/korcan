/**
 * KorCan Seed Script — 토론토 한인 커뮤니티 초기 데이터
 * Run: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding KorCan database...')

  // ─────────────────────────────────────────────
  // 1. 시드 유저 생성
  // ─────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'seed_jihoon@korcan.cc' },
      update: {},
      create: {
        name: '김지훈',
        email: 'seed_jihoon@korcan.cc',
        image: 'https://api.dicebear.com/7.x/thumbs/svg?seed=jihoon',
        isRegistered: true,
        region: 'Toronto',
      },
    }),
    prisma.user.upsert({
      where: { email: 'seed_soyeon@korcan.cc' },
      update: {},
      create: {
        name: '박소연',
        email: 'seed_soyeon@korcan.cc',
        image: 'https://api.dicebear.com/7.x/thumbs/svg?seed=soyeon',
        isRegistered: true,
        region: 'Toronto',
      },
    }),
    prisma.user.upsert({
      where: { email: 'seed_minsu@korcan.cc' },
      update: {},
      create: {
        name: '이민수',
        email: 'seed_minsu@korcan.cc',
        image: 'https://api.dicebear.com/7.x/thumbs/svg?seed=minsu',
        isRegistered: true,
        region: 'Toronto',
      },
    }),
    prisma.user.upsert({
      where: { email: 'seed_hyejin@korcan.cc' },
      update: {},
      create: {
        name: '최혜진',
        email: 'seed_hyejin@korcan.cc',
        image: 'https://api.dicebear.com/7.x/thumbs/svg?seed=hyejin',
        isRegistered: true,
        region: 'Toronto',
      },
    }),
    prisma.user.upsert({
      where: { email: 'seed_junho@korcan.cc' },
      update: {},
      create: {
        name: '정준호',
        email: 'seed_junho@korcan.cc',
        image: 'https://api.dicebear.com/7.x/thumbs/svg?seed=junho',
        isRegistered: true,
        region: 'Toronto',
      },
    }),
  ])

  const [jihoon, soyeon, minsu, hyejin, junho] = users
  console.log('✅ Users created:', users.map((u) => u.name).join(', '))

  // ─────────────────────────────────────────────
  // 2. 커뮤니티 게시글
  // ─────────────────────────────────────────────
  const postData = [
    {
      title: '토론토 처음 오신 분들 필독 — 정착 첫 달 체크리스트',
      category: '정보',
      region: 'Toronto',
      userId: jihoon.id,
      content: `캐나다 온 지 3년 됐는데 처음 왔을 때 몰라서 고생했던 것들 정리해봤습니다.

**1. 도착 첫 주**
- SIN(Social Insurance Number) 신청 → Service Canada 방문, 여권+입국서류 지참
- 은행 계좌 개설 → TD, RBC, Scotiabank 중 한 곳 (학생이면 No-fee 계좌 요청)
- OHIP(온타리오 건강보험) 신청 → ServiceOntario, 3개월 대기기간 있음

**2. 첫 달**
- 핸드폰 요금제: Public Mobile $34짜리 쓰다가 나중에 Fido로 갔는데 Public이 진짜 가성비
- 교통카드(PRESTO) 충전: Shoppers Drug Mart에서 가능, 월정액 $156
- T&T 마트 위치 파악: 노스욕 쉐퍼드/영 근처에 있음

**3. 꼭 알아야 할 것**
- 세금 신고(Tax Return)는 4월 30일까지 → TurboTax 무료 버전으로 가능
- 운전면허 교환: 한국 면허 있으면 온타리오 G2로 바로 교환 가능 (필기/실기 면제)
- 가구는 페북 마켓플레이스, 키지지에서 무료 혹은 저렴하게 구할 수 있음

궁금한 거 댓글로 달아주세요!`,
    },
    {
      title: '노스욕 한국 음식 맛집 총정리 2026',
      category: '정보',
      region: 'Toronto',
      userId: soyeon.id,
      content: `노스욕 쉐퍼드/영 지역 맛집 소개합니다. 다 직접 가본 곳들이에요.

**고기집**
- 강남 BBQ (Sheppard Ave E) — 삼겹살 $29/1인분이지만 고기 질이 진짜 좋음. 예약 필수
- 북창동 순대국 — 순대국밥 $16, 국물이 진해서 해장 맛집

**분식/간식**
- 설빙 노스욕점 — 여름에 빙수 먹으러 줄 서는 곳
- 명랑핫도그 — 학교 앞 간식, $4~5에 먹을 수 있어서 자주 감

**한식 뷔페**
- 아리랑 — 점심 뷔페 $18, 저녁 $26. 가격 대비 진짜 좋음

**카페**
- 메가커피 (Yonge/Finch) — 아메리카노 $3, 제일 저렴한 편
- 파리바게트 노스욕점 — 생크림빵 정기적으로 나옴

밴쿠버에서 온 지 1년 됐는데 토론토 한인 음식 인프라가 훨씬 잘 돼 있는 것 같아요.`,
    },
    {
      title: '온타리오 운전면허 교환 완전 정리 (한국 면허 → G2)',
      category: '정보',
      region: 'Toronto',
      userId: minsu.id,
      content: `저번 주에 드라이브테스트 센터 다녀왔습니다. 한국 면허 가지고 있으면 필기/도로 시험 없이 G2로 교환 가능해요.

**준비물**
1. 한국 운전면허증 원본
2. 공증된 번역본 (공인번역사 필요, 약 $30~50)
3. 여권 + PR카드 또는 스터디/워크퍼밋
4. 시력 검사 비용 $10 (현장에서 함)
5. 면허 발급 비용: $90

**주의사항**
- 번역본은 반드시 공증 받아야 함 (그냥 번역 X)
- 노스욕 드라이브테스트 센터는 대기 없이 당일 방문 가능했음
- G2 받으면 혼자 운전 가능, 고속도로도 가능

**다음 단계 (G)**
- G2 취득 후 12개월 후 G 테스트 응시 가능
- 도로 테스트 있음 (예약 필요)

한국 면허 오래된 분들은 교환 후 보험료가 생각보다 높을 수 있으니 여러 회사 견적 받아보세요. 저는 Aviva 써요.`,
    },
    {
      title: '캐나다 세금 신고 처음 하시는 분들께 (Tax Return 가이드)',
      category: '정보',
      region: 'Toronto',
      userId: jihoon.id,
      content: `4월 30일 세금 신고 마감입니다. 처음 하시는 분들 위해 정리했어요.

**왜 신고해야 하나요?**
- 세금을 이미 낸 경우 → 환급(refund) 받을 수 있음
- GST/HST 크레딧, OSHC, 탄소세 환급 등 각종 베네핏 자격 조건

**무료 신고 방법**
1. **SimpleTax (Wealthsimple Tax)** — 완전 무료, 한국어 지원 안 되지만 쉬움
2. **TurboTax 무료 버전** — 단순한 경우 무료
3. **CVITP** — 저소득자 무료 세금 신고 도움 서비스 (커뮤니티 센터 이용)

**T4 슬립 받는 법**
- 고용주가 2월 말까지 이메일 또는 우편으로 발송
- 없으면 CRA 계정에서 확인 가능 (My Account 등록 필수)

**환급 예상**
- 소득에 따라 다르지만 첫 해는 보통 $200~800 환급 받는 경우 많음
- T4 외에 RRSP, 교육비, 이사비용 등 공제 항목 있음

제가 작년에 $640 환급 받았어요. 꼭 신고하세요!`,
    },
    {
      title: '핸드폰 요금제 비교해봤습니다 (Fido vs Koodo vs Public Mobile)',
      category: '정보',
      region: 'Toronto',
      userId: soyeon.id,
      content: `캐나다 통신비 진짜 비싸잖아요. 그래서 직접 비교해봤습니다.

**Public Mobile (추천)**
- $34/월: 15GB, 캐나다 전국 통화+문자 무제한
- $45/월: 50GB
- 단점: 앱으로만 고객센터, 통화 품질 가끔 불안정
- **가성비 최고**, 장기 고객 할인 있음

**Koodo**
- $45/월: 30GB
- $55/월: 50GB
- 탭 시스템으로 폰 할부 구매 가능
- 고객센터 직접 통화 가능

**Fido**
- $55/월: 40GB
- $65/월: 무제한
- Rogers 계열이라 커버리지 좋음
- 로밍 옵션 다양

**결론**
- 돈 아끼고 싶으면: Public Mobile
- 서비스 중시: Koodo
- 여행 많이 가면: Fido

저는 Public Mobile 2년 쓰고 있는데 큰 문제 없어요. 포인트 적립도 되고요.`,
    },
    {
      title: '토론토 한인 치과 추천해주세요',
      category: '질문',
      region: 'Toronto',
      userId: hyejin.id,
      content: `노스욕 근처에 사는데 치과를 못 찾겠어요 ㅠㅠ

OHIP이 치과는 안 커버하잖아요. 회사 보험 있긴 한데 뭘 봐야 할지 모르겠고, 한국어 통하는 곳이 있으면 더 좋겠습니다.

충치 2개 정도 있는 것 같은데 오래 참다 보니까 슬슬 아프기도 하고요.

혹시 본인이 다니는 곳 있으시면 가격대, 예약 대기시간, 원장님 설명 잘 해주시는지 같이 알려주시면 감사하겠습니다!`,
    },
    {
      title: '취업비자(PGWP)에서 영주권 신청 과정 공유합니다',
      category: '일반',
      region: 'Toronto',
      userId: junho.id,
      content: `작년 11월에 Express Entry ITA 받고 이번 주에 eAPR 제출했습니다. 과정 공유합니다.

**타임라인**
- 2023.09 : 졸업 후 PGWP 발급
- 2024.03 : Express Entry 프로필 생성 (CRS 487점)
- 2024.07 : NOC TEER 1로 재분류 후 점수 상승
- 2025.11 : ITA 수령 (CRS 컷오프 491점에 걸림)
- 2026.01 : 서류 준비 시작
- 2026.03 : eAPR 제출 완료

**준비 서류**
- IELTS 4밴드 6.5 이상 (저는 Speaking 7.5, Overall 7.5)
- 경찰 증명서 (한국, 캐나다 둘 다)
- 학력 증명 (WES 공증)
- Reference Letter (전 직장 2개)
- 사진 6장 (규격 맞춰야 함)

**이민 변호사 vs 직접**
직접 했습니다. IRCC 웹사이트 꼼꼼히 읽으면 됩니다. 변호사 비용 $2,000~4,000 아꼈어요.

처리 기간 보통 6~12개월이라고 하네요. 승인되면 또 공유할게요!`,
    },
    {
      title: '캐나다 생활 6개월 — 솔직한 후기',
      category: '잡담',
      region: 'Toronto',
      userId: soyeon.id,
      content: `한국에서 워홀로 왔고 이제 만 6개월 됐습니다. 솔직하게 씁니다.

**좋은 점**
- 사람들이 진짜 친절함. 엘리베이터에서 모르는 사람이 문 잡아줌
- 자연 환경. 주말에 하이킹 가면 스트레스 다 날아감
- 워라밸. 칼퇴 당연, 연차 눈치 없음

**힘든 점**
- 물가 진짜 비쌈. 삼겹살 먹으러 가면 두 명에 $100은 기본
- 처음 6개월 외로움. 친구 사귀기 생각보다 어려움
- OHIP 3개월 대기 기간 동안 아프면 그냥 참아야 함...

**생각보다 잘 된 것**
- 영어: 완전 초보 수준이었는데 3개월 지나니까 일상 대화는 됨
- 운동: 동네 community centre 헬스장 $50/월, 한국보다 저렴

처음에는 후회했었는데 지금은 잘 왔다고 생각해요. 비슷한 분들 있으면 같이 밥 먹어요!`,
    },
    {
      title: 'T&T vs 갤럭시슈퍼마켓 vs H마트 — 장보기 비교',
      category: '정보',
      region: 'Toronto',
      userId: minsu.id,
      content: `토론토 한인 마트 세 곳 다 다녀봤는데 비교해드릴게요.

**T&T (아시안 마트)**
- 위치: 노스욕, 다운타운 등 여러 곳
- 강점: 신선식품, 과일, 두부, 해산물. 가격 합리적
- 약점: 한국 브랜드 제품이 중국산에 밀림
- 팁: 수요일 세일 품목 확인 필수

**Galaxy Supermarket**
- 위치: Sheppard Ave E 근처
- 강점: 한국 식재료 전문, 고추장/된장/참기름 등 본고장 맛
- 가격: T&T보다 10~20% 비쌈
- 주차: 무료

**H Mart**
- 위치: Steeles/Leslie
- 강점: 한국 간식, 라면, 냉동식품 종류 최다
- 푸드코트: 내부 식당 퀄리티 높음 (순두부찌개 추천)
- 약점: 다소 멈

**결론**
- 기본 장보기: T&T
- 한국 식재료 구입: Galaxy
- 간식 쇼핑: H Mart 푸드코트 같이`,
    },
    {
      title: '아이 한국어 교육 어디서 시키세요?',
      category: '질문',
      region: 'Toronto',
      userId: hyejin.id,
      content: `아이가 8살인데 영어만 늘고 한국어를 점점 잊어가고 있어요 ㅠ

집에서는 한국어로 대화하려 하는데 친구들이랑 놀 때는 영어만 쓰다 보니 어쩔 수가 없네요.

혹시 토론토에서 한국어 교육이나 한국 문화 활동 하는 곳 아시는 분 계신가요?

한국학교 같은 데 주말에 보내는 것도 생각 중인데, 아이들 반응이 어떤지 궁금합니다. 재미없어하면 억지로 보내기도 힘들고요...

경험 있으신 분들 조언 부탁드립니다!`,
    },
    {
      title: 'Costco 멤버십 가입할 만한가요?',
      category: '잡담',
      region: 'Toronto',
      userId: junho.id,
      content: `혼자 살고 있어서 Costco 가입하기 좀 망설여지는데, 솔직히 1인 가구도 본전 뽑을 수 있나요?

$65/년 내야 하는데 자주 못 가면 그냥 날리는 거잖아요.

근데 주변 보면 다들 코스트코 얘기 많이 하길래... Kirkland 제품들 가성비 좋다는 말도 많고요.

아, 그리고 노스욕이나 미시사가 중에 어느 지점이 덜 복잡한가요? 주말에 사람 많은 거 너무 싫어서요 😅`,
    },
    {
      title: '겨울 끝 + 봄 시작 — 이 날씨 못 참겠다',
      category: '잡담',
      region: 'Toronto',
      userId: soyeon.id,
      content: `어제까지만 해도 눈이 오더니 오늘 갑자기 14도네요 ㅋㅋㅋ

토론토 날씨 진짜 이상해요. 아침에 패딩 입고 나갔다가 점심에 더워서 들고 왔습니다.

근데 이러다 또 내일 영하 되는 거 아닌지... 4월까지는 절대 방심하면 안 된다고 선배 이민자들이 그러더라고요.

봄 되면 하이드로파크 벚꽃 보러 가야겠어요. 작년에 놓쳤는데 올해는 꼭! 아이들이랑 피크닉도 하고 싶고요 🌸

주변에 봄 맞이 나들이 장소 추천 있으시면 공유해 주세요~`,
    },
    {
      title: '캐나다 직장 문화 적응 팁 (한국과 다른 점 10가지)',
      category: '정보',
      region: 'Global',
      userId: jihoon.id,
      content: `캐나다 IT 회사 다닌 지 2년 됐습니다. 한국 직장 다니다 왔는데 차이 느낀 점 공유합니다.

**1. 칼퇴가 당연**
6시 됐는데 아직 일하고 있으면 "왜 퇴근 안 해?" 소리 들을 수도 있음

**2. 이름 호칭**
부장님, 팀장님 없음. 다 이름으로 부름. 심지어 VP도 그냥 "Hey John"

**3. 회식 강제 없음**
Team lunch는 있지만 참석 안 해도 아무 말 없음. 퇴근 후 술자리는 거의 없음

**4. 피드백 문화**
칭찬 진짜 많이 함. "Great job!" "That's a really good idea!" 처음엔 어색했음

**5. 회의 문화**
회의 시작 전 5분 간 잡담 필수. 주말 이야기, 날씨 이야기. 어색해도 참여해야 함

**6. 이메일 vs Slack**
중요한 건 이메일, 일상적인 건 Slack. 이메일 답장 당일 안 와도 이상한 거 아님

**7~10은 나중에 추가할게요** (글이 너무 길어져서 ㅋㅋ)

궁금한 거 댓글 달아주세요!`,
    },
    {
      title: '에어비앤비 호스팅 해보신 분 계세요?',
      category: '질문',
      region: 'Toronto',
      userId: minsu.id,
      content: `콘도 1베드 살고 있는데 가끔 여행 갈 때 빈방 에어비앤비 돌리면 어떨까 생각 중이에요.

근데 규정이 어떻게 되는지 잘 모르겠어서요. 토론토 콘도에서 에어비앤비 하면 허가 필요하다고 들었는데, 단기 렌트 규정이 강해진다는 뉴스도 봤고요.

1. 콘도 bylaws에서 금지하는 경우 어떻게 되나요?
2. 시 허가증 같은 거 필요한가요?
3. 실제로 해보신 분들 수익은 어느 정도 되나요?

다운타운 쪽이면 박당 $100~150 정도 받을 수 있다고 하던데, 실제로 그 정도 되는지도 궁금합니다.`,
    },
    {
      title: '공지: KorCan 오픈 안내 — 캐나다 한인 플랫폼',
      category: '일반',
      region: 'Global',
      userId: jihoon.id,
      content: `안녕하세요! KorCan(코리안-캐나다)에 오신 것을 환영합니다 🍁

KorCan은 캐나다 전역 한인 커뮤니티를 위한 플랫폼입니다.

**주요 기능**
- 📋 **커뮤니티 게시판** — 정보, 질문, 잡담 자유롭게
- 🏠 **부동산 매물** — 렌트, 쉐어, 매매 한눈에
- 🛍️ **중고 장터** — 캐나다 한인들끼리 직거래
- 📅 **캘린더** — 일정 관리
- 💰 **지출 관리** — CAD/KRW 동시 관리

**현재 집중 지역: 토론토**

처음 방문하신 분들은 자유롭게 글 작성해 주세요. 작은 커뮤니티지만 함께 키워나가면 좋겠습니다.

문의나 건의사항은 댓글 또는 채팅으로 연락 주세요!`,
    },
  ]

  let postCount = 0
  for (const data of postData) {
    await prisma.post.create({ data })
    postCount++
  }
  console.log(`✅ ${postCount} community posts created`)

  // ─────────────────────────────────────────────
  // 3. 중고장터 상품
  // ─────────────────────────────────────────────
  const productData = [
    {
      title: '삼성 갤럭시 S24 128GB 블랙 팝니다',
      price: 650,
      description: `작년 12월에 새로 산 건데 폰을 바꾸게 돼서 팝니다.

- 사용기간: 약 3개월
- 상태: 케이스 끼고 써서 흠집 없음, 화면 프로텍터 붙어 있음
- 박스, 충전기 포함
- 배터리 98%
- 공기계 (언락)

직거래 선호합니다. 노스욕 쉐퍼드/영 근처에서 만날 수 있어요.
택배는 추가 $10 (캐나다 포스트).`,
      category: 'Digital',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
      sellerId: minsu.id,
    },
    {
      title: '다이슨 V11 무선청소기 팔아요',
      price: 280,
      description: `이사 가면서 정리합니다.

- 구매일: 2024년 6월 (Best Buy 영수증 있음)
- 상태: 사용감 있지만 기능 100% 정상
- 필터 새 것으로 교체함
- 배터리 90% 상태 (Dyson 앱에서 확인)
- 액세서리 5종 모두 포함

원가 $649에 구매했고, 직거래 $280에 드립니다.
미시사가 City Centre 근처에서 만남 가능.`,
      category: 'Digital',
      imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600',
      sellerId: soyeon.id,
    },
    {
      title: 'IKEA KALLAX 책장 + 소파 세트 급처',
      price: 160,
      description: `이사 일정이 빨라져서 급하게 처분합니다.

**KALLAX 4×4 책장** - 상태 양호, 큰 흠집 없음
**소파 (2인용)** - 패브릭, 미세 보풀 있지만 전체적으로 깨끗

개별 구매도 가능:
- KALLAX 단독: $80
- 소파 단독: $100

세트로 같이 가져가시면 $160에 드려요.
스카버러 Kennedy/Lawrence 근처, 차량 있으신 분만 연락 주세요.`,
      category: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      sellerId: jihoon.id,
    },
    {
      title: '쿠쿠 6인용 IH 전기밥솥 (CRP-LHTR0609F)',
      price: 120,
      description: `이민 오면서 가져온 건데 캐나다에서 전압 변환기 사용하다가 그냥 캐나다 모델 새로 사서 이거 처분합니다.

- 한국 모델이라 220V (변환기 필요)
- 기능 완전 정상
- 박스 없음, 설명서 있음
- 사용기간: 2년

노스욕 직거래 $120. 변환기도 같이 드릴 수 있어요 (+$10).`,
      category: 'Other',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
      sellerId: hyejin.id,
    },
    {
      title: '캐나다 구스 익스피디션 파카 S사이즈 (블랙)',
      price: 550,
      description: `정품입니다. 구매 영수증 있어요.

- 사이즈: S (어깨 44, 총장 72)
- 컬러: Black
- 상태: 3시즌 착용, 세탁 1회
- 다운 충전 100%, 보온력 그대로
- 구매 영수증 + 보증서 동봉

2년 전에 $995 주고 샀는데 사이즈가 안 맞아서 처분합니다.
직거래 또는 택배(바이어 부담).`,
      category: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600',
      sellerId: junho.id,
    },
    {
      title: '아이폰 15 Pro 256GB 언락 + 에어팟 프로 세트',
      price: 980,
      description: `세트로 팝니다. 개별 판매 안 합니다.

**아이폰 15 Pro**
- 256GB, 내추럴 티타늄
- 사용기간: 5개월
- 화면 흠집 없음 (강화유리 항상 부착)
- 배터리 96%

**에어팟 프로 2세대**
- 케이스 포함, 기능 정상

둘 다 박스 있음. 노스욕 직거래 선호.`,
      category: 'Digital',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
      sellerId: soyeon.id,
    },
    {
      title: '밥상 + 좌식 방석 4개 세트',
      price: 45,
      description: `한국식 밥상 + 방석 4개 세트입니다.

한국 음식점 하다가 그만두면서 처분합니다. 상업용이라 튼튼합니다.

- 밥상 크기: 90×60cm
- 방석: 두꺼운 스펀지, 커버 세탁 가능
- 상태: 사용감 있지만 기능 이상 없음

미시사가 직거래, 차량 있으신 분.`,
      category: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      sellerId: minsu.id,
    },
    {
      title: '한국어 교재 + 토익 책 모음 (15권)',
      price: 20,
      description: `한국에서 가져온 교재들인데 이제 필요 없어서 정리합니다.

- 토익 LC/RC 2권
- 문법 교재 3권
- 한국어 기초 교재 (어린이용) 5권
- 기타 자기계발서 5권

전부 $20에 드립니다. 택배 가능 (Canada Post 실비 부담).
노스욕 또는 스카버러에서 직거래도 가능.`,
      category: 'Books',
      imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600',
      sellerId: hyejin.id,
    },
    {
      title: 'LG 32인치 모니터 27UK850 4K',
      price: 220,
      description: `재택 근무 끝나면서 필요 없어졌습니다.

- 해상도: 4K UHD (3840×2160)
- 패널: IPS
- 상태: 이상 없음, 데드픽셀 없음
- HDMI, USB-C, DisplayPort 단자 정상
- 모니터 암 있으시면 같이 드림 (VESA 75×75 호환)

스카버러 Kennedy 근처 직거래.`,
      category: 'Digital',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600',
      sellerId: junho.id,
    },
    {
      title: '롤러블레이드 + 헬멧 세트 (여성 240mm)',
      price: 65,
      description: `작년 여름에 하이드로 파크 가려고 샀다가 두 번 탔습니다 ㅋㅋ

- 인라인 스케이트: K2 여성용 240mm (약 235~245 발 사이즈)
- 헬멧: S사이즈, 조절 가능
- 무릎/손목 보호대 세트 포함
- 전체 상태 매우 좋음

노스욕 또는 하이드로 파크 직거래 환영.`,
      category: 'Other',
      imageUrl: 'https://images.unsplash.com/photo-1515534024434-b7b90a5ffd6c?w=600',
      sellerId: soyeon.id,
    },
  ]

  let productCount = 0
  for (const data of productData) {
    await prisma.product.create({ data })
    productCount++
  }
  console.log(`✅ ${productCount} products created`)

  // ─────────────────────────────────────────────
  // 4. 부동산 매물
  // ─────────────────────────────────────────────
  const propertyData = [
    {
      title: '노스욕 1베드 아파트 — 쉐퍼드/영 도보 5분',
      description: `쉐퍼드/영 역에서 도보 5분 거리의 깔끔한 1베드룸 아파트입니다.

**상세 정보**
- 면적: 약 650 sqft
- 층수: 12층 (조망 양호)
- 방향: 남향
- 입주 가능일: 2026년 4월 1일

**포함 내용**
- 수도/가스 요금 포함
- 인터넷 미포함 (Rogers 기준 약 $60/월)
- 지하 주차 1대 (별도 $120/월)
- 코인 세탁기/건조기 같은 층

**주변 환경**
- Loblaws, T&T 도보 3분
- 한인 마트, 식당 밀집 지역
- 노스욕 쉐퍼드-영역 직결

연락은 카카오채팅으로 주세요. 내부 사진 더 보내드릴게요.`,
      price: 1850,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'RENT',
      bedrooms: 1,
      bathrooms: 1,
      address: '4789 Yonge St, North York, ON M2N 0E2',
      latitude: 43.7681,
      longitude: -79.4128,
      region: 'Toronto',
      features: 'Parking,Laundry,Heat included,Water included',
      userId: jihoon.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
        ],
      },
    },
    {
      title: '스카버러 방 쉐어 — 여성만, 화장실 공유, 즉시 입주',
      description: `조용한 환경 원하시는 분 환영합니다. 집 전체를 3명이 씁니다.

**방 정보**
- 방 크기: 약 120 sqft
- 가구 포함 (침대, 책상, 옷장)
- 창문 있음, 자연광 들어옴

**공용 공간**
- 화장실 2개 공유 (현재 2인 거주, 1자리 남음)
- 주방 공동 사용
- 세탁기/건조기 공용

**포함 내용**
- 전기/가스/인터넷 포함
- TTC 버스 노선 도보 3분
- 스카버러타운센터 차량 10분

여성분만 받습니다. 직장인/학생 모두 환영.
카카오톡: 연락 주시면 바로 답변드려요.`,
      price: 850,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'SHARE',
      bedrooms: 1,
      bathrooms: 1,
      address: '55 Morningside Ave, Scarborough, ON M1G 3T2',
      latitude: 43.7692,
      longitude: -79.2188,
      region: 'Toronto',
      features: 'Furnished,Internet included,Utilities included,Laundry',
      userId: soyeon.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
        ],
      },
    },
    {
      title: '미시사가 2베드 콘도 — Square One 도보 10분',
      description: `Square One 쇼핑몰 도보권, 깔끔한 신축 콘도입니다.

**유닛 정보**
- 전용면적: 약 820 sqft
- 방 2개 + 욕실 2개
- 발코니 있음 (도시 뷰)
- 빌트인 주방 가전 포함

**포함 사항**
- 주차 1대 포함
- 로커 포함

**단지 시설**
- 헬스장, 루프탑 테라스
- 24시간 컨시어지
- 게스트 스위트

**위치**
- Square One 도보 10분
- GO Bus 터미널 도보 15분
- 한인 마트 차량 5분

반려동물은 고양이 1마리까지 가능 (상의 후). 비흡연자 선호.`,
      price: 2450,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'RENT',
      bedrooms: 2,
      bathrooms: 2,
      address: '3300 Hurontario St, Mississauga, ON L5B 0A7',
      latitude: 43.5768,
      longitude: -79.6396,
      region: 'Toronto',
      features: 'Parking,Gym,Balcony,Concierge,Locker',
      userId: minsu.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800' },
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
          { url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800' },
        ],
      },
    },
    {
      title: '다운타운 토론토 스튜디오 — King/Bathurst역 2분',
      description: `다운타운 최고 위치입니다. 엔터테인먼트 디스트릭트 바로 옆이에요.

**유닛 정보**
- 전용면적: 450 sqft
- 스튜디오 (방+거실 통합)
- 9피트 천장, 대형 창문
- 풀 주방 (가스 레인지, 식기세척기)

**포함 사항**
- 수도/가스 포함
- 전기 별도 (약 $40~60/월)

**단지 시설**
- 루프탑 풀 (여름 시즌 운영)
- 컨시어지
- 자전거 보관실

**위치**
- King 역 도보 2분
- Lake Ontario 도보 15분
- Rogers Centre, 리플리 아쿠아리움 5분

사무직 분들, 학교 다운타운 다니시는 분들께 추천드려요.`,
      price: 2150,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'RENT',
      bedrooms: 0,
      bathrooms: 1,
      address: '36 Blue Jays Way, Toronto, ON M5V 3T3',
      latitude: 43.6441,
      longitude: -79.3928,
      region: 'Toronto',
      features: 'Heat included,Water included,Pool,Concierge,Bike storage',
      userId: hyejin.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
        ],
      },
    },
    {
      title: '노스욕 2베드 — 한인타운 중심, 학교 배정 좋음',
      description: `가족 단위 추천드립니다. 노스욕 한인 상권 중심부입니다.

**유닛 정보**
- 전용면적: 약 900 sqft
- 방 2개 (마스터룸 욕실 딸림)
- 바닥: 하드우드 전체
- 수납 넉넉한 주방

**포함 사항**
- 냉장고, 세탁기/건조기 인클루딩
- 주차 1대 포함 (지하, 실내)
- 히트 포함

**학군**
- Earl Haig Secondary 통학 가능 거리
- 한국 문화원, 한글학교 도보권

**위치**
- 갤럭시 슈퍼마켓 도보 5분
- 메가커피, 파리바게트 도보 5분
- 쉐퍼드-영역 차량 5분

조용한 분, 가족 환영합니다. 입주일 협의 가능.`,
      price: 2250,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'RENT',
      bedrooms: 2,
      bathrooms: 2,
      address: '325 Sheppard Ave E, North York, ON M2N 3B4',
      latitude: 43.7617,
      longitude: -79.4112,
      region: 'Toronto',
      features: 'Parking,Laundry,Heat included,Hardwood floors',
      userId: junho.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
        ],
      },
    },
    {
      title: '마컴 방 쉐어 — 남성, 주차 무료, GO Train 10분',
      description: `마컴에 단독주택을 3명이 나눠 씁니다. 방 1개 자리 남았습니다.

**방 정보**
- 방 크기: 130 sqft
- 가구 포함 여부: 침대, 옷장 있음 (책상은 없음)
- 1층, 창문 2개

**공용 공간**
- 화장실 2개 (2~3인 공유)
- 주방, 거실, 세탁기 사용 가능
- 뒷마당 있음 (여름에 바베큐 ㅋㅋ)

**포함 사항**
- 모든 유틸리티 포함
- 인터넷 포함 (Rogers 500Mbps)
- 주차 1대 무료

**교통**
- 마컴 16호선 버스 도보 5분
- Unionville GO 역 차량 10분
- Highway 407 진입 용이

조용한 남성분 환영합니다. 장기 거주 선호.`,
      price: 950,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'SHARE',
      bedrooms: 1,
      bathrooms: 1,
      address: '4000 Highway 7 E, Markham, ON L3R 2A8',
      latitude: 43.8531,
      longitude: -79.3329,
      region: 'Toronto',
      features: 'Parking,Internet included,Utilities included,Backyard,Laundry',
      userId: jihoon.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800' },
        ],
      },
    },
    {
      title: '에토비코 1베드 베이스먼트 — 조용한 주거지역',
      description: `에토비코 주거지역 내 깔끔한 베이스먼트 아파트입니다.

**유닛 정보**
- 전용면적: 약 550 sqft
- 방 1개 + 거실
- 별도 출입구 (프라이버시 좋음)
- 주방 냉장고, 스토브 포함

**포함 사항**
- 물/히트 포함
- 주차 1대 포함 (도로변)
- 세탁기 공용 (집 소유주와 요일 조율)

**위치**
- TTC Kipling 역 차량 10분
- Cloverdale Mall 차량 5분
- 에토비코 한인 마트 차량 7분

조용한 동네라 가족, 커플, 조용한 개인 모두 잘 맞을 것 같습니다.
반려동물 고양이 1마리 가능.`,
      price: 1680,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'RENT',
      bedrooms: 1,
      bathrooms: 1,
      address: '23 Westmore Dr, Etobicoke, ON M9V 3Y1',
      latitude: 43.7243,
      longitude: -79.5673,
      region: 'Toronto',
      features: 'Parking,Heat included,Water included,Separate entrance',
      userId: soyeon.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800' },
        ],
      },
    },
    {
      title: '미시사가 타운하우스 3베드 — 가족 세대 장기 임대',
      description: `가족 단위를 위한 넓은 타운하우스입니다. 조용한 단지 내에 위치합니다.

**유닛 정보**
- 전용면적: 약 1,400 sqft (3층 구조)
- 방 3개 (마스터룸 + 2룸)
- 욕실 2.5개
- 내장 차고 1대 + 추가 주차 1대
- 개인 뒷마당

**포함 사항**
- 냉장고, 스토브, 식기세척기
- 세탁기/건조기

**주변 환경**
- 초등학교 도보 10분
- 미시사가 공원 도보 5분
- Heartland Town Centre 차량 10분
- 403번 고속도로 진입 5분

장기(12개월 이상) 임대 선호. 비흡연, 반려동물 없는 가족.
레퍼런스, 크레딧 체크 요청드립니다.`,
      price: 2900,
      currency: 'CAD',
      period: 'MONTHLY',
      type: 'RENT',
      bedrooms: 3,
      bathrooms: 2,
      address: '2800 Eglinton Ave W, Mississauga, ON L5M 0S1',
      latitude: 43.5631,
      longitude: -79.7217,
      region: 'Toronto',
      features: 'Parking,Backyard,Garage,Laundry,Dishwasher',
      userId: minsu.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800' },
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
        ],
      },
    },
  ]

  let propertyCount = 0
  for (const data of propertyData) {
    await prisma.property.create({ data })
    propertyCount++
  }
  console.log(`✅ ${propertyCount} properties created`)

  // ─────────────────────────────────────────────
  // 5. 커뮤니티 댓글
  // ─────────────────────────────────────────────
  const allPosts = await prisma.post.findMany({ take: 5, orderBy: { createdAt: 'asc' } })

  const commentData = [
    { postIdx: 0, content: '정말 유용한 정보네요! SIN 신청하러 이번 주에 가야겠어요 감사합니다 🙏', userId: soyeon.id },
    { postIdx: 0, content: '은행은 TD랑 Scotiabank 두 군데 가봤는데 저는 Scotiabank가 더 친절하더라고요', userId: hyejin.id },
    { postIdx: 0, content: 'PRESTO 카드 충전 Shoppers에서 된다는 거 몰랐어요! 감사해요', userId: junho.id },
    { postIdx: 1, content: '북창동 순대국 저도 진짜 자주 가요 ㅋㅋ 국물 진짜 맛있죠', userId: minsu.id },
    { postIdx: 1, content: '설빙 줄이 너무 길어서 포기한 적 있는데 그래도 맛있긴 하죠 ㅎㅎ', userId: junho.id },
    { postIdx: 2, content: '번역 공증 저는 $45에 했어요. 영어 번역사 협회 회원 분들이 저렴하더라고요', userId: soyeon.id },
    { postIdx: 2, content: '노스욕 드라이브테스트 대기 없다니 꿀팁이네요. 다른 곳은 예약 몇 주씩 걸리던데', userId: hyejin.id },
    { postIdx: 3, content: '저도 작년에 $580 환급 받았어요! SimpleTax 진짜 편해요', userId: minsu.id },
    { postIdx: 4, content: 'Public Mobile 저도 2년째 쓰는데 딱히 불편한 거 없어요. 포인트 쌓이면 할인도 되고요', userId: jihoon.id },
  ]

  let commentCount = 0
  for (const c of commentData) {
    if (allPosts[c.postIdx]) {
      await prisma.comment.create({
        data: {
          content: c.content,
          postId: allPosts[c.postIdx].id,
          userId: c.userId,
        },
      })
      commentCount++
    }
  }
  console.log(`✅ ${commentCount} comments created`)

  console.log('\n🎉 Seed complete!')
  console.log(`   Users: ${users.length}`)
  console.log(`   Posts: ${postCount}`)
  console.log(`   Products: ${productCount}`)
  console.log(`   Properties: ${propertyCount}`)
  console.log(`   Comments: ${commentCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
