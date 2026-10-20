import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'

export default function Terms() {
  useSeo({
    title: 'Terms & Conditions — CareerDost',
    description:
      'Read the Terms and Conditions governing your use of CareerDost (careerdost.blog), including intellectual property, official source precedence, and liability rules.',
    canonical: '/terms-and-conditions',
  })

  return (
    <SimplePage title="Terms &amp; Conditions" updated="18 October 2026">
      <p>
        Welcome to <strong>CareerDost</strong> (accessible at{' '}
        <a href="https://careerdost.blog" className="text-green underline font-medium">
          https://careerdost.blog
        </a>
        ). By accessing or using this website, you agree to comply with and be bound by the following Terms and
        Conditions. If you do not agree with any part of these terms, please discontinue use of the website.
      </p>

      <h2>1. Purpose of the Platform</h2>
      <p>
        CareerDost is an independent Pakistani public-interest career, education, and welfare information
        platform. We publish editorial guides, structured summaries, eligibility breakdowns, and verification
        checklists for government and private sector jobs, internships, scholarships, university admissions,
        examination results, and public welfare schemes across Sindh and all provinces of Pakistan.
      </p>

      <h2>2. Permitted Use &amp; Intellectual Property</h2>
      <ul>
        <li>
          You may browse, search, print, and share links to CareerDost articles for personal, non-commercial
          educational and career-planning use.
        </li>
        <li>
          All original editorial analysis, structured tables, custom graphics, and page layouts on{' '}
          <code>careerdost.blog</code> are the intellectual property of CareerDost unless otherwise noted
          (such as statutory figures or public-domain government notifications).
        </li>
        <li>
          Automated bulk scraping, unauthorized mirroring, or republishing full CareerDost articles on third-party
          websites or apps without prior written permission and clear canonical attribution is strictly
          prohibited.
        </li>
      </ul>

      <h2>3. Precedence of Official Notifications &amp; Deadlines</h2>
      <p>
        While the CareerDost Editorial Desk cross-checks every published guide against official government
        gazettes, public service commission portals (FPSC, PPSC, SPSC, KPPSC, BPSC), HEC circulars, and employer
        career portals, hiring authorities and universities may revise deadlines, seat quotas, fee challans, or
        eligibility criteria after publication.
      </p>
      <p>
        <strong>The official notification and primary portal linked in each article always take precedence.</strong>{' '}
        Readers are responsible for verifying all dates, requirements, and fee deposit instructions on the
        official authority&rsquo;s website before submitting an application.
      </p>

      <h2>4. Zero Recruitment Fees &amp; Anti-Fraud Policy</h2>
      <p>
        CareerDost is <strong>not</strong> a recruiting agency, testing body, or government department. We never
        accept job applications directly, never promise employment or scholarship selection, and{' '}
        <strong>never charge any fee</strong> to view or apply to opportunities. Users agree not to misuse any
        information on CareerDost to solicit money or misrepresent affiliation with our editorial team.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        All content on CareerDost is provided on an &ldquo;as-is&rdquo; informational basis without warranties
        of any kind, express or implied. CareerDost and its editorial contributors shall not be liable for any
        direct, indirect, or consequential loss or damage arising from reliance on information published on this
        website, including missed application deadlines, portal downtime on external government websites,
        examination changes, or rejected applications.
      </p>

      <h2>6. External Links &amp; Third-Party Services</h2>
      <p>
        Our articles include outbound links to official employer, university, and government portals for reader
        convenience. Accessing third-party websites is at your own discretion and subject to the respective
        terms and privacy policies of those external platforms. See our{' '}
        <Link to="/privacy-policy" className="text-green underline">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link to="/disclaimer" className="text-green underline">
          Disclaimer
        </Link>{' '}
        for further details.
      </p>

      <h2>7. Revisions &amp; Governing Law</h2>
      <p>
        We may update these Terms &amp; Conditions periodically to reflect operational or legal changes.
        Continued use of <code>careerdost.blog</code> following any update constitutes acceptance of the revised
        terms. These Terms &amp; Conditions are governed by the laws of the Islamic Republic of Pakistan, and
        any disputes shall be subject to the exclusive jurisdiction of the competent courts of Pakistan.
      </p>
    </SimplePage>
  )
}
