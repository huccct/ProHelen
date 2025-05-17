import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // check the email is already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 },
      )
    }

    // hash the password
    const hashedPassword = await hash(password, 12)

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
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
