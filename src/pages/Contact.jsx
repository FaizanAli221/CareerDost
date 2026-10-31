import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/useSeo'
import { submitContactForm } from '../api/client'

export default function Contact() {
  useSeo({
    title: 'Contact CareerDost — Editorial Helpdesk, Corrections & Source Verification',
    description:
      'Contact the CareerDost editorial desk to report an outdated listing, submit an official corrigendum link, or ask a verification question.',
    canonical: '/contact',
  })

  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Report an outdated listing or deadline',
    message: '',
  })

  const mailtoSubject = `[CareerDost Inquiry] ${formData.subject} - ${formData.name || 'Reader'}`
  const mailtoBody = `Full Name: ${formData.name}
Email Address: ${formData.email}
Inquiry Category: ${formData.subject}

Message & Official Source URL:
${formData.message}

--
Sent via CareerDost Contact & Editorial Desk (https://careerdost.blog/contact)`

  const mailtoHref = `mailto:careerdost02@gmail.com?subject=${encodeURIComponent(
    mailtoSubject
  )}&body=${encodeURIComponent(mailtoBody)}`

  const whatsappDirectHref = `https://wa.me/923173425680?text=${encodeURIComponent(
    `Hello CareerDost Editorial Desk,\nSubject: ${formData.subject}\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
  )}`

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Background attempt to log submission if server endpoint is active
      await submitContactForm(formData).catch(() => {})
      // Launch user's default email client with pre-filled message addressed to verified email
      if (typeof window !== 'undefined') {
        window.location.href = mailtoHref
      }
      setSent(true)
    } catch (err) {
      setError(err.message || 'An error occurred. Please use direct email or WhatsApp below.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(
        `To: careerdost02@gmail.com\nSubject: ${mailtoSubject}\n\n${mailtoBody}`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      setCopied(false)
    }
  }

  return (
    <div className="container-x py-10 max-w-3xl font-sans">
      {/* Breadcrumb */}
      <nav className="text-xs text-inksoft mb-4 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-green transition-colors focus-visible:ring-1 focus-visible:ring-green">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">Contact Us</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
        Contact the CareerDost Editorial Desk
      </h1>
      <p className="text-inksoft text-base mb-6 leading-relaxed">
        Have you spotted an extended closing date, an official departmental corrigendum, or a broken government
        portal link? Reach out to the <strong>CareerDost Editorial Desk</strong> directly via our verified email{' '}
        <a
          href="mailto:careerdost02@gmail.com"
          className="text-green underline font-semibold focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
        >
          careerdost02@gmail.com
        </a>{' '}
        or connect through our official channels and inquiry composer below.
      </p>

      {/* Verified Contact Card */}
      <div className="mb-8 p-5 border border-line bg-paper space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-lg font-bold text-ink">
            Verified Official Communication Channels
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-light text-green border border-green/30">
            ✓ Verified Official
          </span>
        </div>
        <p className="text-xs text-inksoft leading-relaxed">
          To ensure transparency and rapid fact-checking, all inquiries, corrections, and editorial correspondence
          are handled directly through these verified endpoints:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-ink font-medium pt-1">
          {/* Card 1: Email */}
          <a
            href="mailto:careerdost02@gmail.com"
            aria-label="Send direct email to CareerDost at careerdost02@gmail.com"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1 focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Official Email</span>
            <strong className="text-green font-semibold break-all">✉ careerdost02@gmail.com ↗</strong>
            <span className="text-[11px] text-inksoft">Direct editorial inbox (24–48h review)</span>
          </a>

          {/* Card 2: Helpline */}
          <a
            href="https://wa.me/923173425680"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with CareerDost Editorial Helpline on WhatsApp at 03173425680"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1 focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Editorial Helpline</span>
            <strong className="text-ink font-semibold">💬 0317-3425680 ↗</strong>
            <span className="text-[11px] text-inksoft">WhatsApp text for urgent corrigendums</span>
          </a>

          {/* Card 3: Form Anchor */}
          <a
            href="#contact-form"
            aria-label="Jump to on-page editorial inquiry tool"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1 focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Inquiry Composer</span>
            <strong className="text-green font-semibold">📝 On-Page Tool ↓</strong>
            <span className="text-[11px] text-inksoft">Draft message to editorial desk</span>
          </a>

          {/* Card 4: WhatsApp Channel */}
          <a
            href="https://whatsapp.com/channel/0029VbDnzwFF1YlIkJax2P1o"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join official CareerDost WhatsApp Channel"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1 focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Broadcast Alerts</span>
            <strong className="text-green font-semibold">📢 WhatsApp Channel ↗</strong>
            <span className="text-[11px] text-inksoft">Daily verified job &amp; scheme alerts</span>
          </a>

          {/* Card 5: Facebook Desk */}
          <a
            href="https://facebook.com/CareerDost"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit CareerDost Facebook page"
            className="p-3 bg-white border border-line hover:border-green transition-colors flex flex-col gap-1 focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs sm:col-span-2 lg:col-span-2"
          >
            <span className="text-inksoft uppercase tracking-wider text-[10px]">Social Media Desk</span>
            <strong className="text-ink font-semibold">🌐 facebook.com/CareerDost ↗</strong>
            <span className="text-[11px] text-inksoft">Official updates and public announcements</span>
          </a>
        </div>
      </div>

      {/* Advisory & Data Minimization Notice */}
      <div className="mb-8 p-4 border-l-4 border-green bg-paper text-xs text-ink leading-relaxed space-y-1">
        <p className="font-semibold text-ink">
          Important Applicant Notice — No Direct Applications or Sensitive Records:
        </p>
        <p>
          CareerDost is an independent public-information publication and does <strong>not</strong> accept job CVs,
          admissions forms, or government scheme registrations directly. Never include sensitive private records
          such as your CNIC number, bank account/IBAN details, or original certificates in your message. Review our{' '}
          <Link to="/disclaimer" className="text-green underline font-medium focus-visible:ring-1 focus-visible:ring-green">
            Disclaimer
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="text-green underline font-medium focus-visible:ring-1 focus-visible:ring-green">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {error && (
        <div className="border border-brick/30 bg-brick-light text-brick px-4 py-3 text-sm font-medium mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Confirmation State vs Inquiry Form */}
      {sent ? (
        <div className="border border-green/30 bg-green-light text-ink p-6 space-y-4 rounded-xs">
          <div className="flex items-center gap-2 text-green font-bold text-base">
            <span>✓</span>
            <span>Your message has been prepared for careerdost02@gmail.com</span>
          </div>
          <p className="text-sm text-ink leading-relaxed">
            Your inquiry has been compiled and dispatched to your device&rsquo;s default email client. If your email
            application did not open automatically, or if you prefer to send via webmail or WhatsApp, choose an option
            below:
          </p>

          <div className="p-4 bg-white border border-line rounded-xs text-xs space-y-1.5 font-mono text-inksoft">
            <div><strong className="text-ink">To:</strong> careerdost02@gmail.com</div>
            <div><strong className="text-ink">Subject:</strong> {mailtoSubject}</div>
            <div className="line-clamp-3 text-ink/80"><strong className="text-ink font-mono">Message:</strong> {formData.message}</div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <a
              href={mailtoHref}
              className="inline-flex items-center bg-green text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-green-dark transition-colors rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
            >
              Open in Email Client (careerdost02@gmail.com) →
            </a>
            <a
              href={whatsappDirectHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#25D366] text-slate-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
            >
              Send via WhatsApp Helpline (0317-3425680) →
            </a>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="border border-line bg-white text-ink px-3.5 py-2.5 text-xs font-semibold hover:border-ink transition-colors rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
            >
              {copied ? '✓ Copied to Clipboard!' : 'Copy Formatted Text'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSent(false)
                setCopied(false)
              }}
              className="border border-line bg-white text-inksoft px-3.5 py-2.5 text-xs font-medium hover:text-ink hover:border-ink transition-colors rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
            >
              Draft Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form id="contact-form" onSubmit={onSubmit} className="space-y-4 bg-white border border-line p-6">
          <div className="border-b border-line pb-3 mb-4">
            <h2 className="font-serif text-xl font-bold text-ink">
              Submit an Editorial Query or Listing Correction
            </h2>
            <p className="text-xs text-inksoft mt-1">
              Submissions are addressed directly to our verified email{' '}
              <strong className="text-ink">careerdost02@gmail.com</strong>.
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
              Full Name <span className="text-brick">*</span>
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
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-inksoft/60 focus:border-green focus-visible:ring-1 focus-visible:ring-green focus-visible:outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
              Your Email Address <span className="text-brick">*</span>
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
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-inksoft/60 focus:border-green focus-visible:ring-1 focus-visible:ring-green focus-visible:outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1">
              Inquiry Category <span className="text-brick">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green focus-visible:ring-1 focus-visible:ring-green focus-visible:outline-hidden"
            >
              <option>Report an outdated listing or deadline</option>
              <option>Submit an official corrigendum link</option>
              <option>Suggest a new official source (FPSC/SPSC/PPSC/University)</option>
              <option>Report a suspicious recruitment scam or unauthorized fee</option>
              <option>General query / Editorial feedback</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">
              Message &amp; Official Notification URL <span className="text-brick">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Include the CareerDost article URL and the official government, university, or testing service notification link..."
              className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-inksoft/60 focus:border-green focus-visible:ring-1 focus-visible:ring-green focus-visible:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="border border-green bg-green text-white px-6 py-2.5 text-sm font-semibold hover:bg-green-dark transition-colors disabled:opacity-50 rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
            >
              {loading ? 'Preparing Message...' : 'Send Message (careerdost02@gmail.com)'}
            </button>
            <a
              href="mailto:careerdost02@gmail.com"
              className="text-xs text-inksoft hover:text-green underline transition-colors py-2 focus-visible:ring-1 focus-visible:ring-green"
            >
              Or email directly: careerdost02@gmail.com
            </a>
          </div>
        </form>
      )}
    </div>
  )
}
