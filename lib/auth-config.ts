import type { NextAuthOptions } from 'next-auth'
import process from 'node:process'
import { prisma } from '@/lib/db'
import { sanitizeEmail, sanitizePassword } from '@/lib/xss-protection'
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

        // sanitize user input
        const cleanEmail = sanitizeEmail(credentials.email)
        const cleanPassword = sanitizePassword(credentials.password)

        if (!cleanEmail || !cleanPassword) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: cleanEmail },
        })

        if (!user || !user.password)
          throw new Error('Invalid credentials')

        const isValid = await compare(cleanPassword, user.password)

        if (!isValid)
          throw new Error('Invalid credentials')

        // TODO: Implement 2FA functionality
        // const force2faSetting = await prisma.systemSetting.findUnique({
        //   where: { key: 'security.force.2fa' },
        // })

        // if (force2faSetting?.value === 'true' && !user.has2fa) {
        //   throw new Error('2FA required')
        // }

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
      if (account?.provider !== 'credentials' && user.email) {
        try {
          // sanitize user input
          const cleanEmail = sanitizeEmail(user.email)
          const cleanName = user.name ? user.name.replace(/<[^>]*>/g, '') : null

          if (!cleanEmail) {
            return false
          }

          // Check if the user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
          })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: cleanEmail,
                name: cleanName || cleanEmail.split('@')[0],
                image: user.image || null,
                password: null,
              },
            })
            user.id = newUser.id
          }
          else {
            await prisma.user.update({
              where: { email: cleanEmail },
              data: {
                name: cleanName || existingUser.name,
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
      const sessionTimeoutSetting = await prisma.systemSetting.findUnique({
        where: { key: 'security.session.timeout' },
      })

      const sessionTimeout = Number.parseInt(sessionTimeoutSetting?.value || '30')

      if (token.iat && (Date.now() / 1000 - (token.iat as number)) > sessionTimeout * 60) {
        throw new Error('Session expired')
      }

      if (session.user && token.sub) {
        session.user.id = token.sub
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        })
        ;(session.user as any).role = user?.role || 'USER'
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
    maxAge: 30 * 24 * 60 * 60,
  },
}
