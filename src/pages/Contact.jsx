import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/useSeo'
import { submitContactForm } from '../api/client'

export default function Contact() {
  useSeo({
    title: 'Contact CareerDost — Official Editorial & Query Helpdesk',
    description:
      'Contact the CareerDost editorial desk to report an outdated listing, submit an official corrigendum link, or ask a verification question.',
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

  const whatsappDirectHref = `https://wa.me/923173425680?text=${encodeURIComponent(
    `Hello CareerDost Editorial Desk,\nSubject: ${formData.subject}\nName: ${formData.name}\nMessage: ${formData.message}`
  )}`

  return (
    <div className="container-x py-10 max-w-3xl font-sans">
      <h1 className="font-serif text-3xl font-bold text-ink mb-3">
        Contact the CareerDost Editorial Desk
      </h1>
      <p className="text-inksoft text-base mb-6 leading-relaxed">
        Have you spotted an updated deadline, an official departmental corrigendum, or a broken government
        portal link? Reach out to the <strong>CareerDost Editorial Desk</strong> directly via email at{' '}
        <a href="mailto:careerdost02@gmail.com" className="text-green underline font-medium">
          careerdost02@gmail.com
        </a>
        , using our verified channels, or through the inquiry form below.
      </p>

      <div className="mb-8 p-5 border border-line bg-paper space-y-3">
        <h2 className="font-serif text-lg font-bold text-ink">
          Verified Official Communication Channels
        </h2>
        <p className="text-xs text-inksoft leading-relaxed">
          For the fastest response on urgent deadline extensions, roll number slips, or verification requests,
          connect with us via our verified channels:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-ink font-medium pt-1">
          <a
            href="mailto:careerdost02@gmail.com"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Official Email</span>
            <strong className="text-green font-semibold">✉ careerdost02@gmail.com ↗</strong>
          </a>
          <a
            href="#contact-form"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Editorial Desk</span>
            <strong className="text-green font-semibold">📝 On-Page Inquiry Tool ↓</strong>
          </a>
          <a
            href="https://whatsapp.com/channel/0029VbDnzwFF1YlIkJax2P1o"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Broadcast Alerts</span>
            <strong className="text-green">📢 WhatsApp Channel ↗</strong>
          </a>
          <a
            href="https://wa.me/923173425680"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Helpline</span>
            <strong className="text-ink">💬 0317-3425680 ↗</strong>
          </a>
          <a
            href="https://facebook.com/CareerDost"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Social Desk</span>
            <strong className="text-ink">🌐 facebook.com/CareerDost ↗</strong>
          </a>
        </div>
      </div>

      <div className="mb-8 p-4 border-l-4 border-green bg-paper text-xs text-ink leading-relaxed">
        <strong>Important Notice for Job &amp; Scheme Applicants:</strong> CareerDost is an independent
        information portal and does <strong>not</strong> accept job CVs or BISP/welfare applications directly.
        Please do not include sensitive personal records such as your CNIC number, bank account number, or
        original transcripts in your message. See our{' '}
        <Link to="/disclaimer" className="text-green underline font-medium">
          Disclaimer
        </Link>{' '}
        and{' '}
        <Link to="/privacy-policy" className="text-green underline font-medium">
          Privacy Policy
        </Link>
        .
      </div>

      {error && (
        <div className="border border-brick/30 bg-brick-light text-brick px-4 py-3 text-sm font-medium mb-4">
          {error}
        </div>
      )}

      {sent ? (
        <div className="border border-green/30 bg-green-light text-ink p-6 space-y-4">
          <div className="text-green font-bold text-base">
            ✓ Thank you — your inquiry has been prepared for our editorial desk.
          </div>
          <p className="text-sm text-ink leading-relaxed">
            Because CareerDost practices strict data minimization and does not store personal contact databases
            on our servers, you can also forward your pre-filled message directly to our verified WhatsApp
            Editorial Helpdesk below for immediate review:
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={whatsappDirectHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-green-dark transition-colors"
            >
              Send Directly via WhatsApp Helpdesk (0317-3425680) →
            </a>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="border border-line bg-white text-ink px-4 py-2.5 text-xs font-semibold hover:border-ink"
            >
              Submit Another Query
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 bg-white border border-line p-6">
          <h2 className="font-serif text-xl font-bold text-ink mb-2">
            Submit an Editorial Query or Listing Correction
          </h2>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
              Full Name
            </label>
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
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
              Email Address
            </label>
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
            <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1">
              Inquiry Category
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green"
            >
              <option>Report an outdated listing or deadline</option>
              <option>Suggest a new official source (FPSC/SPSC/PPSC/University)</option>
              <option>General query / Editorial feedback</option>
              <option>Report a suspicious third-party recruitment scam</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">
              Message &amp; Official Source URL (if applicable)
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={2000}
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Include the CareerDost article URL and the official government/university notification link..."
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-inksoft/60 focus:border-green"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="border border-green bg-green text-white px-6 py-2.5 text-sm font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
