import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create or update test user for local development
    const testUser = await prisma.user.upsert({
        where: { email: 'test@localhost.dev' },
        update: {
            name: 'Test User',
            region: 'Toronto',
            isRegistered: true,
        },
        create: {
            id: 'test-user-local-dev',
            email: 'test@localhost.dev',
            name: 'Test User',
            region: 'Toronto',
            isRegistered: true,
            image: null,
        },
    })

    console.log('✅ Test user created/updated:', testUser)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
