import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        token: string
        user: {
            role: string
        } & DefaultSession["user"]
    }
    interface User {
        token: string
        role: string
    }
}
//  NextAuth,