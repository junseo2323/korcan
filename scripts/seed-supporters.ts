
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Supporters Post...')

    // 1. Find Admin User
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    })

    if (!admin) {
        console.error('❌ Admin user not found. Please run grant-admin.ts first.')
        return
    }

    const title = '🇨🇦 KorCan 서포터즈 1기 모집'
    const post = await prisma.post.findFirst({
        where: { title: { contains: 'KorCan 서포터즈' } }
    })

    if (!post) {
        await prisma.post.create({
            data: {
                title: title,
                content: `
안녕하세요, KorCan입니다! 🍁

캐나다 한인 커뮤니티 KorCan을 함께 만들어갈 **서포터즈 1기**를 모집합니다.

**📌 모집 대상**
- 캐나다 거주 중인 한인 누구나 (유학생, 워홀러, 이민자 등)
- SNS 활동이 활발하신 분
- 커뮤니티 운영에 관심이 많으신 분

**🎁 활동 혜택**
- 활동 증명서 발급
- 우수 활동자 시상 (기프트카드 등)
- KorCan 굿즈 제공

**📅 모집 기간**
- 2026년 2월 16일 ~ 2월 28일

많은 지원 부탁드립니다!
        `,
                category: '공지',
                userId: admin.id,
                views: 0
            }
        })
        console.log('✅ Created Supporters Post')
    } else {
        console.log('ℹ️ Supporters Post already exists')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
