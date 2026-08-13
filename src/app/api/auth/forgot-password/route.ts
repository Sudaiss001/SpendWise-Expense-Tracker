import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      // Return success message to avoid email enumeration
      return NextResponse.json({
        message: 'If an account exists with this email, an OTP code has been sent.',
      })
    }

    // Generate 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiration

    // Clear any previous reset requests for this email
    await prisma.passwordReset.deleteMany({
      where: { email: normalizedEmail },
    })

    // Save OTP and expiration in PasswordReset table
    await prisma.passwordReset.create({
      data: {
        email: normalizedEmail,
        token: otp,
        expiresAt,
      },
    })

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'SpendWise <onboarding@resend.dev>',
      to: [normalizedEmail],
      subject: 'SpendWise - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #8b5cf6; margin-bottom: 8px;">SpendWise Password Reset</h2>
          <p style="color: #94a3b8; font-size: 15px; margin-bottom: 24px;">
            Hello ${user.name || 'there'}, you requested a password reset for your SpendWise account. Use the 6-digit OTP code below to reset your password:
          </p>
          <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #10b981;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
            This OTP is valid for 15 minutes. If you did not request this password reset, please ignore this email.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend delivery failed:', error)
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'OTP code sent to email successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process forgot password request' },
      { status: 500 }
    )
  }
}
