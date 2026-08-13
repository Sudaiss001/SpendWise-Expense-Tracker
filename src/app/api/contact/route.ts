import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

function requiredString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = requiredString(body.name)
    const email = requiredString(body.email)
    const subject = optionalString(body.subject)
    const message = requiredString(body.message)

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    })

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeSubject = subject ? escapeHtml(subject) : 'No Subject Specified'
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')

    const { data, error } = await resend.emails.send({
      from: 'SpendWise Contact Form <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'mustaphaabdulrahman811@gmail.com'],
      replyTo: email,
      subject: `\u{1F4E9} New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 8px;">
          <h2 style="color: #a855f7; margin-top: 0;">New Inquiry Received!</h2>
          <p><strong>From:</strong> ${safeName} (&lt;${safeEmail}&gt;)</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="border-color: #334155; margin: 16px 0;" />
          <p><strong>Message:</strong></p>
          <blockquote style="background: #1e293b; padding: 12px; border-left: 4px solid #a855f7; color: #f1f5f9; margin: 0;">
            ${safeMessage}
          </blockquote>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            Hit 'Reply' directly in your email client to respond to ${safeEmail}.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend Contact API Error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: 'Contact message sent successfully',
        id: contactMessage.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact message' },
      { status: 500 }
    )
  }
}
