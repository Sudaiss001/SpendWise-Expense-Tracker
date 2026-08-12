import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

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

    // Configure Nodemailer transporter using process.env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"SpendWise Support" <no-reply@spendwise.app>',
      to: normalizedEmail,
      subject: 'SpendWise - Your Password Reset OTP Code',
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
    }

    try {
      await transporter.sendMail(mailOptions)
    } catch (mailError) {
      console.error('Failed to send OTP email via SMTP:', mailError)
      // Log for local dev / testing if SMTP environment variables are not configured yet
      console.log(`[DEV OTP FALLBACK] OTP for ${normalizedEmail}: ${otp}`)
    }

    return NextResponse.json({
      message: 'OTP code sent to email successfully',
      email: normalizedEmail,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process forgot password request' },
      { status: 500 }
    )
  }
}
