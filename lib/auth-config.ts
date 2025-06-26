import type { NextAuthOptions } from 'next-auth'
import process from 'node:process'
import { prisma } from '@/lib/db'
import { compare } from 'bcryptjs'
import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error('Invalid credentials')

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password)
          throw new Error('Invalid credentials')

        const isValid = await compare(credentials.password, user.password)

        if (!isValid)
          throw new Error('Invalid credentials')

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
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
    signIn: '/sign-in',
  },
  callbacks: {
    async signIn({ user, account }) {
      // For third-party login (Google, GitHub, Azure), ensure the user exists in the database
      if (account?.provider !== 'credentials' && user.email) {
        try {
          // Check if the user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            // Create a new user
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0],
                image: user.image || null,
                // Third-party login users do not set a password
                password: null,
              },
            })
            // Update the user object's id to ensure the session callback can correctly get it
            user.id = newUser.id
          }
          else {
            // Update the existing user's information (e.g. avatar, name)
            await prisma.user.update({
              where: { email: user.email },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              },
            })
            user.id = existingUser.id
          }
        }
        catch (error) {
          console.error('Error handling user in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user)
        token.sub = user.id
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
}
