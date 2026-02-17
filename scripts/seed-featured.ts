
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Notice and Hot posts...')

    // 1. Ensure Admin User
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (!admin) {
        console.error('No Admin user found. Run grant-admin.ts first.')
        return
    }

    // 2. Create Notice Post
    const noticeTitle = '📢 커뮤니티 이용 수칙 안내'
    const existingNotice = await prisma.post.findFirst({ where: { title: noticeTitle } })

    if (!existingNotice) {
        await prisma.post.create({
            data: {
                title: noticeTitle,
                content: '깨끗한 커뮤니티 문화를 위해 서로 존중해주세요.\n\n1. 비방 금지\n2. 도배 금지\n3. 허위사실 유포 금지',
                category: '공지',
                userId: admin.id,
                views: 100
            }
        })
        console.log('✅ Created Notice post')
    } else {
        console.log('ℹ️ Notice post already exists')
    }

    // 3. Ensure some posts have likes to be "Hot"
    const posts = await prisma.post.findMany({
        where: { category: { not: '공지' } },
        take: 5
    })

    for (const post of posts) {
        const likeCount = await prisma.like.count({ where: { postId: post.id } })
        if (likeCount < 3) {
            // Add some fake likes from admin
            try {
                await prisma.like.create({
                    data: {
                        postId: post.id,
                        userId: admin.id
                    }
                })
                console.log(`👍 Added like to post: ${post.title}`)
            } catch (e) {
                // Ignore duplicate likes
            }
        }
    }

    console.log('✅ Seeding complete')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
