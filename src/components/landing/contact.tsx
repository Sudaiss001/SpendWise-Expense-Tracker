'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const updateField = (
    field: keyof typeof initialForm,
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSuccessMessage('')
    setErrorMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setForm(initialForm)
      setSuccessMessage('Message sent. We will get back to you soon.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-surface/80 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-muted-foreground mb-6">
              <Mail className="w-4 h-4 text-violet-400" />
              <span>Contact SpendWise</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">
              Have a question about{' '}
              <span className="gradient-text">your finances?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Send a note and it will land directly with the SpendWise team.
              We keep the details on file so follow-up stays organized.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl p-5 sm:p-7 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-white">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="w-full rounded-xl bg-slate-deep border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground outline-none transition-colors focus:border-violet"
                  placeholder="Your name"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-white">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="w-full rounded-xl bg-slate-deep border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground outline-none transition-colors focus:border-violet"
                  placeholder="you@example.com"
                  required
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-white">Subject</span>
              <input
                value={form.subject}
                onChange={(event) => updateField('subject', event.target.value)}
                className="w-full rounded-xl bg-slate-deep border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground outline-none transition-colors focus:border-violet"
                placeholder="What can we help with?"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-white">Message</span>
              <textarea
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                className="min-h-36 w-full resize-y rounded-xl bg-slate-deep border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground outline-none transition-colors focus:border-violet"
                placeholder="Tell us a little more..."
                required
              />
            </label>

            {successMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald/25 bg-emerald/10 px-4 py-3 text-sm text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl border border-crimson/25 bg-crimson/10 px-4 py-3 text-sm text-crimson">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-violet hover:bg-violet/90 text-white font-bold py-6 glow-violet transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
