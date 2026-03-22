import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { apiError } from '@/lib/apiError'

/**
 * @swagger
 * /api/auth/register:
 *   put:
 *     description: Register a new user or update existing user profile
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               birthDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    // Check for ID instead of email, as email might be null for some providers
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phoneNumber, birthDate, countryCode, region, marketingConsent } = body

    if (!name || !email || !phoneNumber || !birthDate || !region) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // 만 14세 미만 가입 차단
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear() -
        (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0)
    if (age < 14) {
        return NextResponse.json({ error: '만 14세 미만은 가입할 수 없습니다.' }, { status: 400 })
    }

    if (phoneNumber.length < 10) {
        return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                email,
                phoneNumber,
                birthDate,
                region,
                isRegistered: true,
                marketingConsent: !!marketingConsent,
            }
        })
        return NextResponse.json(user)
    } catch (error: unknown) {
        return apiError('Failed to register', error)
    }
}
