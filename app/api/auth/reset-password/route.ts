import { prisma } from '@/lib/db'
import { sanitizePassword, sanitizeText } from '@/lib/xss-protection'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    const cleanToken = sanitizeText(token)
    const cleanPassword = sanitizePassword(password)

    if (!cleanToken || !cleanPassword) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 },
      )
    }

    // Find the token and check if it's valid
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: cleanToken },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 },
      )
    }

    // Check if token is expired or already used
    if (verificationToken.expires < new Date() || verificationToken.isUsed) {
      return NextResponse.json(
        { error: 'Token has expired or already been used' },
        { status: 400 },
      )
    }

    // Find user by email (stored in identifier)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    // Hash new password
    const hashedPassword = await hash(cleanPassword, 12)

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Update verification token
    await prisma.verificationToken.upsert({
      where: { token: cleanToken },
      update: { isUsed: true },
      create: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
        isUsed: true,
      },
    })

    return NextResponse.json({ message: 'Password reset successfully' })
  }
  catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 },
    )
  }
}
