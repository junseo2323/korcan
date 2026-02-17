
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking for Admin user...')

    // 1. Find or Create Admin User
    let adminUser = await prisma.user.findFirst({
        where: { name: '관리자' }
    })

    if (!adminUser) {
        console.log('Creating Admin user...')
        adminUser = await prisma.user.create({
            data: {
                name: '관리자',
                email: 'admin@korcan.cc',
                region: 'Global',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
                isRegistered: true
            }
        })
    } else {
        console.log(`Found Admin user: ${adminUser.id}`)
    }

    // 2. Find or Create Supporters Post
    const postTitle = 'KorCan 서포터즈 모집합니다. (내용 수정 예정)'

    let post = await prisma.post.findFirst({
        where: {
            title: postTitle,
            userId: adminUser.id
        }
    })

    if (!post) {
        console.log('Creating Supporters Post...')
        post = await prisma.post.create({
            data: {
                title: postTitle,
                content: 'KorCan 서포터즈를 모집합니다.\n\n(내용 수정 예정)\n\n많은 관심 부탁드립니다.',
                category: '공지',
                views: 0,
                region: 'Global',
                userId: adminUser.id
            }
        })
        console.log(`Created Supporters Post: ${post.id}`)
    } else {
        console.log(`Found existing Supporters Post: ${post.id}`)
    }

    console.log('✅ Setup complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
