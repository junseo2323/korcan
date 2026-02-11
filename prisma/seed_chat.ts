const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = 'admin@korcan.com'

    // 1. Create Admin User
    let admin = await prisma.user.findUnique({ where: { email } })
    if (!admin) {
        admin = await prisma.user.create({
            data: {
                email,
                name: '관리자',
                image: 'https://ui-avatars.com/api/?name=Admin&background=random',
                isRegistered: true,
                phoneNumber: '+1-555-0199',
                birthDate: '1990-01-01'
            }
        })
        console.log('Created Admin user:', admin.id)
    } else {
        console.log('Admin user already exists:', admin.id)
    }

    // 2. Create 5 Market Products
    const products = [
        { title: '아이폰 15 프로 맥스', price: 1200, category: 'Digital', description: '채팅 테스트용 상품입니다. 상태 아주 좋습니다.' },
        { title: '맥북 프로 M3', price: 2500, category: 'Digital', description: '거의 새것입니다. 박스 풀박스.' },
        { title: '이케아 소파', price: 150, category: 'Furniture', description: '이사가서 팝니다. 직접 가져가셔야 해요.' },
        { title: '겨울 패딩 자켓', price: 80, category: 'Clothing', description: '드라이 클리닝 완료. 사이즈 L.' },
        { title: '해리포터 전집', price: 50, category: 'Books', description: '영문판입니다. 한번 읽고 보관했습니다.' },
    ]

    for (const p of products) {
        await prisma.product.create({
            data: {
                ...p,
                sellerId: admin.id,
                imageUrl: 'https://placehold.co/400/png?text=Item',
                status: 'SELLING'
            }
        })
    }

    console.log('Seeded 5 products for Admin')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
