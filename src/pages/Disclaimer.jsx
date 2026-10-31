import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'

export default function Disclaimer() {
  useSeo({
    title: 'Disclaimer Notice — CareerDost',
    description:
      'Read the official CareerDost editorial disclaimer regarding non-affiliation with government agencies, official source verification, and anti-recruitment fraud rules.',
    canonical: '/disclaimer',
  })

  return (
    <SimplePage title="Editorial Disclaimer" updated="18 October 2026">
      <p>
        <strong>CareerDost</strong> (accessible at{' '}
        <a href="https://careerdost.blog" className="text-green underline font-medium">
          https://careerdost.blog
        </a>
        ) is an independent Pakistani public-interest career, education, and welfare information portal. Please
        read this Disclaimer carefully before acting on any job notification, government scheme guide,
        scholarship notice, or university admission report published on this website.
      </p>

      <h2>1. Independent Publication &amp; Non-Affiliation Notice</h2>
      <p>
        CareerDost is <strong>not affiliated with, endorsed by, or officially connected to</strong> any federal
        or provincial government ministry, public service commission (including FPSC, PPSC, SPSC, KPPSC, or
        BPSC), testing agency (NTS, ETC HEC, PTS, STS), social safety-net authority (BISP 8171, Benazir Hari
        Card, SPHF), regulatory body (SBP, NADRA, FBR, NEPRA), commercial bank, or university whose notices are
        summarized on this site. All institutional names and trademarks belong to their respective owners and
        are referenced strictly for factual identification and public reporting under fair-dealing principles.
      </p>

      <h2>2. Official Source Verification &amp; Final Authority</h2>
      <p>
        Every article published by the CareerDost Editorial Desk is prepared by reviewing official press
        releases, newspaper gazettes, and accredited institutional portals. We clearly distinguish between
        confirmed open recruitment or registration drives, expired historical notices, and policy proposals
        still awaiting cabinet or regulatory approval.
      </p>
      <p>
        However, government departments, employers, and universities may modify eligibility criteria, test
        schedules, age relaxations, or closing dates at any time without prior notice to third-party
        publications. <strong>Always verify all details directly on the official portal linked inside each
        article before submitting documents or depositing an official bank challan.</strong>
      </p>

      <h2>3. Not a Recruiting Agency — Zero Fee &amp; Anti-Scam Warning</h2>
      <p>
        CareerDost does <strong>not</strong> recruit candidates, does <strong>not</strong> process job or
        welfare scheme applications, does <strong>not</strong> issue offer letters or roll number slips, and{' '}
        <strong>never charges any fee</strong> to readers.
      </p>
      <ul>
        <li>
          Never pay money, mobile wallet transfers ( JazzCash / Easypaisa ), or ”processing charges” to any
          individual, WhatsApp number, or social media account claiming to guarantee a job, internship,
          scholarship, or BISP/welfare payment.
        </li>
        <li>
          Official examination or application fees in Pakistan are payable only through authorized bank challans
          or verified 1Link / 1Bill government invoice channels specified on the employer&rsquo;s official
          website.
        </li>
        <li>
          If you spot a fraudulent link or an outdated listing, please alert us immediately via our{' '}
          <Link to="/contact" className="text-green underline font-medium">
            Contact Us
          </Link>{' '}
          page or email our editorial desk directly at{' '}
          <a href="mailto:careerdost02@gmail.com" className="text-green underline font-medium">
            careerdost02@gmail.com
          </a>.
        </li>
      </ul>

      <h2>4. External Websites &amp; No Professional Advice</h2>
      <p>
        Outbound links to official departmental websites, university admission portals, and employer career
        pages are provided strictly as a public service. CareerDost does not control external websites and cannot
        guarantee their uptime or security. Furthermore, articles covering tax deadlines, statutory minimum
        wages, banking circulars, or public subsidies are published for general public awareness and do not
        constitute formal legal, tax, financial, or career counseling advice.
      </p>
    </SimplePage>
  )
}
