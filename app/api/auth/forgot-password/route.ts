import { randomBytes } from 'node:crypto'
import process from 'node:process'
import { prisma } from '@/lib/db'
import { sanitizeEmail } from '@/lib/xss-protection'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const cleanEmail = sanitizeEmail(email)

    if (!cleanEmail) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    // Generate a random token
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    // Save the token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    })

    // Send email with reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    await resend.emails.send({
      from: 'ProHelen <no-reply@prohelen.dev>',
      to: cleanEmail,
      subject: 'Reset your password',
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          This email was sent from ProHelen. If you have any questions, please contact us at support@prohelen.dev
        </p>
      `,
    })

    return NextResponse.json({ message: 'Reset link sent successfully' })
  }
  catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to send reset link' },
      { status: 500 },
    )
  }
}
