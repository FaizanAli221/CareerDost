import { useState } from 'react'
import { useSeo } from '../lib/useSeo'
import { submitContactForm } from '../api/client'

export default function Contact() {
  useSeo({
    title: 'Contact Us — CareerDost',
    description: 'Get in touch with the CareerDost team to report an outdated listing, suggest an official source, or ask a question.',
    canonical: '/contact',
  })

  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Report an outdated listing or deadline',
    message: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await submitContactForm(formData)
      if (res.success) {
        setSent(true)
      } else {
        setError(res.error || 'Failed to submit form. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-x py-10 max-w-[640px] font-sans">
      <h1 className="font-serif text-3xl font-bold text-ink mb-2">Contact Us</h1>
      <p className="text-inksoft text-sm mb-4 leading-relaxed">
        Report an outdated listing, suggest an official department source we should track, or reach out to our editorial team. We review every submission.
      </p>

      <div className="mb-8 p-4 border border-line bg-paper text-sm space-y-2">
        <h2 className="font-semibold text-ink">Direct Contact &amp; Social Media:</h2>
        <div className="flex flex-col sm:flex-row gap-4 text-xs text-ink font-medium">
          <a href="https://wa.me/923173425680" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green">
            💬 <strong>WhatsApp:</strong> 03173425680
          </a>
          <a href="https://facebook.com/CareerDost" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green">
            🌐 <strong>Facebook:</strong> CareerDost
          </a>
        </div>
      </div>

      {error && (
        <div className="border border-brick/30 bg-brick-light text-brick px-4 py-3 text-sm font-medium mb-4">
          {error}
        </div>
      )}

      {sent ? (
        <div className="border border-green/30 bg-green-light text-green px-5 py-4 text-sm font-medium">
          ✓ Thank you — your message has been received. Our team will review your query.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              required
              maxLength={100}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ali Ahmed"
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-inksoft/60 focus:border-green"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">Email Address</label>
            <input
              id="email"
              name="email"
              required
              maxLength={150}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-inksoft/60 focus:border-green"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1">Subject</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green"
            >
              <option>Report an outdated listing or deadline</option>
              <option>Suggest a new official source (FPSC/PPSC/University)</option>
              <option>General query / Feedback</option>
              <option>Official Inquiry</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={2000}
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide details or links relevant to your inquiry..."
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-inksoft/60 focus:border-green"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="border border-green bg-green text-white px-6 py-2.5 text-sm font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
