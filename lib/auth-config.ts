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
      // 对于第三方登录（Google, GitHub, Azure），确保数据库中有用户记录
      if (account?.provider !== 'credentials' && user.email) {
        try {
          // 检查用户是否已存在
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            // 创建新用户
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0],
                image: user.image || null,
                // 第三方登录用户不设置密码
                password: null,
              },
            })
            // 更新user对象中的id，确保后续session回调能正确获取
            user.id = newUser.id
          }
          else {
            // 更新现有用户的信息（如头像、名称）
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
