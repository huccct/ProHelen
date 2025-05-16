import process from 'node:process'
import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),

  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ session }) {
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
})

export { handler as GET, handler as POST }
