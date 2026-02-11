import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
    const { name, email, phoneNumber, birthDate, countryCode } = body

    if (!name || !email || !phoneNumber || !birthDate) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Basic Server-side Validation
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Phone validation (relaxed check to allow +1 and +82 with some format flexibility)
    // We expect the frontend to send "Code Number" or just Number, but here we validate structure.
    // For simplicity, we ensure it's not empty and has minimum length.
    if (phoneNumber.length < 10) {
        return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                email, // Update email if provided
                phoneNumber, // formatting handled by frontend (e.g. "+82 010-1234-5678")
                birthDate,
                isRegistered: true
            }
        })
        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
    }
}
