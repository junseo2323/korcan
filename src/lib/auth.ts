import KakaoProvider from "next-auth/providers/kakao"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
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
                token.region = (user as any).region
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
                    token.region = freshUser.region
                }
            }

            return token
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id
                session.user.isRegistered = token.isRegistered
                session.user.region = token.region
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
