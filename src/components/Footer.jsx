import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { WHATSAPP_CHANNEL_URL, WhatsAppIcon } from './WhatsAppCTA'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-white mt-16 font-sans">
      <div className="container-x py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-3">
          <Link to="/" className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-bold text-ink">CareerDost</span>
          </Link>
          <p className="text-xs text-inksoft leading-relaxed">
            Pakistan&rsquo;s trusted opportunity portal for government vacancies, private jobs, bank jobs, scholarships, internships, schemes and admissions. Updated daily from verified official sources.
          </p>

          {/* Social Links (Requirement 10) */}
          <div className="pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-inksoft mb-2">Connect With Us</div>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join official CareerDost WhatsApp Channel"
                className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-3 py-1.5 rounded-xs text-xs font-bold transition-colors w-fit shadow-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Join WhatsApp Channel</span>
              </a>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="mailto:careerdost02@gmail.com"
                  aria-label="Send email to careerdost02@gmail.com"
                  className="border border-line bg-paper px-2.5 py-1 text-ink hover:text-green hover:border-green transition-colors rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
                >
                  Email: careerdost02@gmail.com
                </a>
                <a
                  href="https://wa.me/923173425680"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact CareerDost helpline on WhatsApp at 03173425680"
                  className="border border-line bg-paper px-2.5 py-1 text-ink hover:text-green hover:border-green transition-colors rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
                >
                  Contact: 03173425680
                </a>
                <a
                  href="https://facebook.com/CareerDost"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit CareerDost on Facebook"
                  className="border border-line bg-paper px-2.5 py-1 text-ink hover:text-green hover:border-green transition-colors rounded-xs focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden"
                >
                  Facebook: CareerDost
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Column 1 */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-inksoft mb-3">Popular Categories</div>
          <ul className="space-y-2 text-xs text-ink">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/category/${c.slug}`}
                  className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories Column 2 */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-inksoft mb-3">Opportunities</div>
          <ul className="space-y-2 text-xs text-ink">
            {categories.slice(5).map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/category/${c.slug}`}
                  className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
                >
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/tools/job-readiness-checker"
                className="text-green font-semibold hover:underline transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
              >
                Job Readiness Checker
              </Link>
            </li>
          </ul>
        </div>

        {/* Site Pages & Legal */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-inksoft mb-3">Company &amp; Legal</div>
          <ul className="space-y-2 text-xs text-ink">
            <li>
              <Link
                to="/about"
                className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/about#editorial-policy"
                className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
              >
                Editorial &amp; Verification Policy
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/disclaimer"
                className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
              >
                Disclaimer
              </Link>
            </li>
            <li>
              <Link
                to="/terms-and-conditions"
                className="hover:text-green transition-colors focus-visible:ring-2 focus-visible:ring-green focus-visible:outline-hidden rounded-xs"
              >
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-line bg-paper">
        <div className="container-x py-4 text-xs text-inksoft flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between items-center">
          <span>© {year} CareerDost — All rights reserved.</span>
          <span>Informational portal only — verify all details on official recruitment websites.</span>
        </div>
      </div>
    </footer>
  )
}
