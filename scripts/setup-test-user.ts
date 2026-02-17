
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'test@localhost.dev'

    console.log(`🔍 Checking for test user: ${email}...`)

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        console.log('✅ Test user already exists:', existingUser)
        return
    }

    console.log('👤 Creating test user...')

    const newUser = await prisma.user.create({
        data: {
            name: 'Test User',
            email: email,
            role: 'USER',
            isRegistered: true,
            region: 'Toronto',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser'
        }
    })

    console.log('✅ Test user created:', newUser)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
