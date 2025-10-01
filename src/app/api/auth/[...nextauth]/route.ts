import { apiServices } from "@/services/api";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "**************" }
            },
            async authorize(credentials) {

                const response = await apiServices.login(credentials?.email ?? '', credentials?.password ?? '')
                // console.log(response);
                if (response.message == 'success') {
                    const user = {
                        id: response.user.email,
                        name: response.user.name,
                        email: response.user.email,
                        role: response.user.role,
                        token: response.token
                    }
                    return user
                } else {
                    return null
                }

            }
        }),

    ],
    pages: {
        signIn: '/auth/login'
    },
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role as string
            session.token = token.token as string
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.token = user.token
                token.role = user.role
            }
            return token
        }
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt'
    }
})

export { handler as GET, handler as POST }
// CredentialsProvider take two Credential and async function named authorize 