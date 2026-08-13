import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email: requestedEmail } = await req.json()

    if (!requestedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const email = requestedEmail.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email },
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
      where: { email },
    })

    // Save OTP and expiration in PasswordReset table
    await prisma.passwordReset.create({
      data: {
        email,
        token: otp,
        expiresAt,
      },
    })

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'SpendWise <onboarding@resend.dev>',
      to: [email],
      subject: 'SpendWise Security - Password Reset OTP',
      html: `
        <div style="font-family: sans-serif; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 12px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #a855f7; margin-top: 0;">SpendWise Security</h2>
          <p style="color: #cbd5e1; font-size: 16px;">You requested a password reset for your SpendWise account.</p>
          <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #a855f7;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend API Error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
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
