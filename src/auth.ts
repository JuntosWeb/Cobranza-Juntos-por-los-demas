import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mock authentication para el MVP (Admin y Staff)
        if (credentials?.username === "admin" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin Fundación", email: "admin@juntosporlosdemas.org", role: "ADMIN" }
        }
        if (credentials?.username === "staff" && credentials?.password === "staff123") {
          return { id: "2", name: "Staff Recepción", email: "staff@juntosporlosdemas.org", role: "STAFF" }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
})
