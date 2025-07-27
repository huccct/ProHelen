import { prisma } from '@/lib/db'
import { sanitizeEmail, sanitizePassword, sanitizeText } from '@/lib/xss-protection'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const allowRegistrationSetting = await prisma.systemSetting.findUnique({
    where: { key: 'security.allow.registration' },
  })

  if (allowRegistrationSetting?.value === 'false') {
    return NextResponse.json(
      { error: 'Registration is currently disabled' },
      { status: 403 },
    )
  }

  try {
    const { name, email, password } = await req.json()

    const cleanName = sanitizeText(name)
    const cleanEmail = sanitizeEmail(email)
    const cleanPassword = sanitizePassword(password)

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 },
      )
    }

    // check the email is already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 },
      )
    }

    // hash the password
    const hashedPassword = await hash(cleanPassword, 12)

    // create user
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    })
  }
  catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
