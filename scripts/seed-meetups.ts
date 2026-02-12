import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const testUser = await prisma.user.findUnique({
        where: { email: 'test@localhost.dev' }
    })

    if (!testUser) {
        console.error('Test user not found')
        return
    }

    // Create sample meetup posts
    const meetups = [
        {
            title: '토론토 한국어-영어 교환',
            description: '토론토에서 한국어와 영어를 교환하며 대화해요!',
            date: new Date('2026-02-20T18:00:00'),
            maxMembers: 8,
            region: 'Toronto',
        },
        {
            title: 'Vancouver 중국어 클럽',
            description: '중국어 학습자들을 위한 모임입니다.',
            date: new Date('2026-02-25T19:00:00'),
            maxMembers: 6,
            region: 'Vancouver',
        },
        {
            title: 'Montreal 독서 모임',
            description: '매달 책 한 권을 읽고 토론하는 모임입니다.',
            date: new Date('2026-03-01T14:00:00'),
            maxMembers: 10,
            region: 'Montreal',
        },
    ]

    for (const meetupData of meetups) {
        await prisma.$transaction(async (tx) => {
            // Create post
            const post = await tx.post.create({
                data: {
                    title: meetupData.title,
                    content: meetupData.description,
                    category: '모임',
                    region: meetupData.region,
                    userId: testUser.id,
                },
            })

            // Create meetup
            const meetup = await tx.meetup.create({
                data: {
                    title: meetupData.title,
                    description: meetupData.description,
                    date: meetupData.date,
                    maxMembers: meetupData.maxMembers,
                    currentMembers: 1,
                    status: 'OPEN',
                    region: meetupData.region,
                    organizerId: testUser.id,
                    participants: {
                        connect: { id: testUser.id },
                    },
                },
            })

            // Link meetup to post
            await tx.post.update({
                where: { id: post.id },
                data: { meetupId: meetup.id },
            })

            // Create chat room
            await tx.chatRoom.create({
                data: {
                    name: meetupData.title,
                    type: 'GROUP',
                    meetupId: meetup.id,
                    users: {
                        connect: { id: testUser.id },
                    },
                },
            })

            console.log(`✅ Created meetup: ${meetupData.title}`)
        })
    }

    console.log('✅ All sample meetups created!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
