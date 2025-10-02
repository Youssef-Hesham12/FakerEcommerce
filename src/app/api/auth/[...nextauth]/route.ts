// import { apiServices } from "@/services/api";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",

//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials) {
//         console.log(credentials)
//         if (!credentials?.email || !credentials?.password) return null;

//         const data = await fetch(
//           "https://ecommerce.routemisr.com/api/v1/auth/signin",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password,
//             }),
//           }
//         );

//         const response = await data.json();
//         console.log("ressssssssssssssssssponse",response)
//         if (response.message == "success") {
//           const user = {
//             id: response.user.email,
//             name: response.user.name,
//             email: response.user.email,
//             role: response.user.role,
//             token: response.token,
//           };
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/login",
//   },
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user.role = token.role as string;
//         session.token = token.token as string;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.token = user.token;
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
  
// });

// export { handler as GET, handler as POST };
// // CredentialsProvider take two Credential and async function named authorize








import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode"
import NextAuth from "next-auth";








const handler = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const response = await fetch(
          "https://ecommerce.routemisr.com/api/v1/auth/signin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        )

        const payload: {
          message: string
          token: string
          user: { name: string; email: string; role: string }
        } = await response.json()

        if (payload.message === "success" && payload.token) {
          const decoded: { id: string } = jwtDecode(payload.token)
          return {
            id: decoded.id,
            name: payload.user.name,
            email: payload.user.email,
            role: payload.user.role,
            token: payload.token,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          role: user.role ?? "user",
        }
        token.token = user.token
      }
      return token
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user
      }
      if (token.token) {
        session.token = token.token
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };