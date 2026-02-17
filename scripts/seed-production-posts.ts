
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Realistic User Data
const MOCK_USERS = [
    { name: 'MapleLover', email: 'maple@test.com', region: 'Toronto', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maple' },
    { name: 'VanCityGuy', email: 'vancity@test.com', region: 'Vancouver', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Van' },
    { name: '토론토새내기', email: 'newbie_to@test.com', region: 'Toronto', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Newbie' },
    { name: '단풍국살이', email: 'maple_life@test.com', region: 'Ottawa', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Life' },
    { name: '김치없인못살아', email: 'kimchi@test.com', region: 'Vancouver', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kimchi' },
    { name: '워홀러1년차', email: 'working@test.com', region: 'Calgary', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Work' },
    { name: 'CodingNinja', email: 'ninja@test.com', region: 'Toronto', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja' },
    { name: 'MontrealBabe', email: 'mtl@test.com', region: 'Montreal', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mtl' },
    { name: '캘거리목수', email: 'carpenter@test.com', region: 'Calgary', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carp' },
    { name: '퀘벡불어마스터', email: 'french@test.com', region: 'Quebec', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=French' },
]

// Realistic Post Data
const POST_TEMPLATES = [
    { category: '질문', title: '토론토 다운타운 렌트 시세 질문드립니다', content: '이번에 다운타운으로 이사가려고 하는데 1베드 시세가 어느정도 하나요? 2500불 정도면 괜찮은 곳 구할 수 있을까요? 유틸 포함인지도 궁금합니다.' },
    { category: '잡담', title: '오늘 날씨 진짜 좋네요 ㅎㅎ', content: '오랜만에 해가 쨍쨍해서 산책하기 너무 좋습니다. 다들 즐거운 주말 보내세요! 하버프론트 걷는데 기분 최고네요.' },
    { category: '정보', title: '코스트코 세일 정보 공유합니다 (휴지, 세제)', content: '이번주 코스트코 휴지 세일하네요. 커클랜드 휴지 5불 할인입니다. 필요하신 분들 얼른 가보세요~ 사람 엄청 많아요.' },
    { category: '일반', title: '한국 택배 보내려는데 어디가 싼가요?', content: '부모님께 영양제 좀 보내드리려고 하는데 한진택배랑 우체국 중 어디가 더 저렴한지 아시는 분 계신가요? 무게는 5kg 정도 됩니다.' },
    { category: '질문', title: 'SIN 넘버 발급받으려면 서비스 캐나다 예약해야하나요?', content: '워크퍼밋 받고 SIN 넘버 받으러 가려는데 예약 필수인가요? 아니면 그냥 아침 일찍 가면 되나요? 오타와 시청 쪽으로 가려고 합니다.' },
    { category: '잡담', title: '밴쿠버 비 지겹네요 ㅠㅠ 해 좀 보고 싶어요', content: '레인쿠버라더니 정말 일주일 내내 비만 오네요. 우울해지려고 해요... 맛있는 전집 추천 좀 해주세요 막걸리나 한잔 해야겠습니다.' },
    { category: '정보', title: 'TTC 이번 주말 운행 정보 (1호선 중단)', content: '1호선 일부 구간 운행 중단이라고 하니 참고하세요. 셔틀버스는 운행한다고 합니다. 주말에 다운타운 가시는 분들 시간 여유 두고 나오세요.' },
    { category: '질문', title: '생애 첫 차 구매 조언 부탁드려요 (중고차)', content: '중고차로 사려고 하는데 딜러샵이랑 개인거래 중 어디가 나을까요? 예산은 15000불 정도입니다. 사기 안 당하는 팁 좀 주세요.' },
    { category: '잡담', title: '팀홀튼 아이스캡 땡기는 날씨', content: '역시 여름엔 아이스캡이죠. 다들 오늘 아이스캡 한 잔 하셨나요? 저는 벌써 두 잔째...' },
    { category: '일반', title: '워홀 오시는 분들 짐 쌀 때 팁', content: '상비약은 꼭 넉넉히 챙겨오세요. 여기 약은 좀 안 듣는 느낌이라... 그리고 수건도 한국 게 질이 훨씬 좋아요.' },
    { category: '잡담', title: '한국 치킨 먹고 싶네요', content: '여기 치킨도 맛있지만 가끔은 처갓집 양념치킨이 너무 그립습니다.. 토론토에 비슷한 맛 나는 곳 있나요?' },
    { category: '질문', title: 'MSP 신청 언제부터 가능한가요?', content: '랜딩한지 2주 되었는데 바로 신청 가능한가요? 아니면 3개월 기다려야 하나요? 헷갈리네요.' },
]

const COMMENTS = [
    '좋은 정보 감사합니다!',
    '저도 궁금했는데 알려주셔서 감사합니다.',
    '2500불이면 충분할 것 같아요.',
    '서비스 캐나다 아침 일찍 가면 예약 없이도 가능해요.',
    '비 좀 그만 왔으면 좋겠네요 ㅠㅠ',
    '개인거래가 싸긴 한데 사기 조심하셔야 해요.',
    '화이팅입니다!',
    '저랑 같은 고민이시네요.',
    '꿀팁 감사합니다~',
    '여기 물가 너무 비싸요 ㅠㅠ',
    '완전 공감합니다...',
    '거기 가봤는데 별로였어요.',
    '쪽지 드렸습니다 확인해주세요!',
    '축하드립니다!! 🎉'
]

function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    console.log('🌱 Starting seeding...')

    // 1. Create/Update Users
    const userIds: string[] = []
    for (const userData of MOCK_USERS) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                name: userData.name,
                region: userData.region,
                image: userData.image
            },
            create: {
                name: userData.name,
                email: userData.email,
                region: userData.region,
                image: userData.image,
                isRegistered: true
            }
        })
        userIds.push(user.id)
        console.log(`Created/Found user: ${user.name}`)
    }

    // 2. Create Posts
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    for (const template of POST_TEMPLATES) {
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)]
        const randomUser = MOCK_USERS.find(u => u.email === (userIds.indexOf(randomUserId) > -1 ? MOCK_USERS[userIds.indexOf(randomUserId)].email : ''))

        // Random date within last week
        const createdAt = getRandomDate(oneWeekAgo, now)

        // Create Post
        const post = await prisma.post.create({
            data: {
                title: template.title,
                content: template.content,
                category: template.category,
                views: Math.floor(Math.random() * 200) + 10, // More realistic views
                region: randomUser?.region || 'Global',
                userId: randomUserId,
                createdAt: createdAt
            }
        })
        console.log(`Created post: ${post.title}`)

        // 3. Create Comments (0-5 random comments per post)
        const commentCount = Math.floor(Math.random() * 6)
        for (let i = 0; i < commentCount; i++) {
            const commentUserId = userIds[Math.floor(Math.random() * userIds.length)]
            const commentContent = COMMENTS[Math.floor(Math.random() * COMMENTS.length)]
            // Comment time must be after post time
            const commentCreatedAt = getRandomDate(createdAt, now)

            await prisma.comment.create({
                data: {
                    content: commentContent,
                    postId: post.id,
                    userId: commentUserId,
                    createdAt: commentCreatedAt
                }
            })
        }

        // 4. Create Likes (0-15 random likes per post)
        const likeCount = Math.floor(Math.random() * 16)
        // Shuffle userIds to pick unique likers
        const shuffledUserIds = [...userIds].sort(() => 0.5 - Math.random())
        const likers = shuffledUserIds.slice(0, likeCount)

        for (const likerId of likers) {
            await prisma.like.create({
                data: {
                    userId: likerId,
                    postId: post.id
                }
            }).catch(() => { }) // Ignore duplicates if any
        }
    }

    console.log('✅ Seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
