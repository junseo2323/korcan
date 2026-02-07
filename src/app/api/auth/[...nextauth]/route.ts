import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.isRegistered = (user as any).isRegistered
            }

            // Refetch user data on update (e.g. after registration)
            if (trigger === "update" && token.id) {
                const freshUser = await prisma.user.findUnique({
                    where: { id: token.id as string }
                })
                if (freshUser) {
                    token.name = freshUser.name
                    token.email = freshUser.email
                    token.isRegistered = freshUser.isRegistered
                }
            }

            return token
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id
                session.user.isRegistered = token.isRegistered
                session.user.name = token.name
                session.user.email = token.email
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
