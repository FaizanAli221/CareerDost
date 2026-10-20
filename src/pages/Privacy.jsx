import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy — CareerDost',
    description:
      'Read the CareerDost Privacy Policy covering data minimization, Google Analytics (GA4), local browser storage, third-party advertising cookies, and user privacy rights.',
    canonical: '/privacy-policy',
  })

  return (
    <SimplePage title="Privacy Policy" updated="18 October 2026">
      <p>
        This Privacy Policy explains how <strong>CareerDost</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;, accessible at{' '}
        <a href="https://careerdost.blog" className="text-green underline font-medium">
          https://careerdost.blog
        </a>
        ) handles information when you browse our verified job notifications, public welfare scheme guides,
        scholarship updates, and university admission reports. We designed CareerDost around strict{' '}
        <strong>data minimization</strong>: you can read every article and access official application links
        without creating an account or submitting sensitive personal records.
      </p>

      <h2>1. Sensitive Information We Never Collect</h2>
      <p>
        CareerDost is an independent public-information publication, not a recruitment agency or government
        registration portal. We <strong>never</strong> request, collect, or store Computerised National Identity
        Card (CNIC) numbers, B-Form numbers, bank account or IBAN details, biometric data, academic transcripts,
        or application fees. Always submit job or welfare applications directly on the official government or
        employer portal linked inside each article.
      </p>

      <h2>2. Information You Voluntarily Provide</h2>
      <p>
        When you use our on-site search bar or reach out through our{' '}
        <Link to="/contact" className="text-green underline">
          Contact Us
        </Link>{' '}
        page or official WhatsApp helpline, we process only the details you voluntarily provide (such as your
        name, contact details, and inquiry message) strictly to review listing corrections, answer verification
        questions, and improve our editorial coverage. We do not sell, rent, or trade user contact details to
        third parties.
      </p>

      <h2>3. Web Analytics (Google Analytics 4)</h2>
      <p>
        CareerDost uses <strong>Google Analytics 4 (GA4)</strong> (Measurement ID:{' '}
        <code>G-489C8F8SNJ</code>) to understand aggregated readership patterns, such as which job categories,
        Sindh welfare guides, and university admission notices are most helpful to readers, approximate
        city/region distribution, device viewport sizes, and page load performance.
      </p>
      <ul>
        <li>
          Google Analytics sets first-party analytics cookies (such as <code>_ga</code> and{' '}
          <code>_ga_*</code>) in your browser to distinguish unique sessions anonymously.
        </li>
        <li>
          IP addresses are anonymized by default in Google Analytics 4.
        </li>
        <li>
          You can block or delete analytics cookies at any time through your browser settings or by installing
          the official{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </li>
      </ul>

      <h2>4. Interactive Chat Assistant &amp; Browser Storage (Zanderio AI)</h2>
      <p>
        To help visitors quickly navigate career notifications and educational guides, CareerDost includes an
        interactive assistant widget powered by <strong>Zanderio AI</strong> (<code>cdn.zanderio.ai</code> /{' '}
        <code>zanderio.ai</code>).
      </p>
      <ul>
        <li>
          For optimal page speed and privacy, the assistant script loads only after you actively interact with
          the page (such as scrolling, tapping, or clicking).
        </li>
        <li>
          The widget uses your browser&rsquo;s <code>localStorage</code> and <code>sessionStorage</code> to
          preserve your ongoing chat conversation and remember whether a welcome prompt has already been shown
          during your session.
        </li>
        <li>
          Please do not enter sensitive personal data (such as CNIC numbers, passwords, or financial details)
          into the chat box. You can clear <code>localStorage</code> and <code>sessionStorage</code> at any
          time via your browser&rsquo;s privacy settings.
        </li>
      </ul>

      <h2>5. Cookies &amp; Third-Party Advertising Disclosures</h2>
      <p>
        CareerDost may display contextual or personalized advertisements served by third-party advertising
        companies, including <strong>Google AdSense</strong>, when advertising services are active on the site:
      </p>
      <ul>
        <li>
          Third-party vendors, including Google, use cookies (such as Google advertising cookies and DoubleClick
          DART cookies) or web beacons to serve ads based on a user&rsquo;s prior visits to{' '}
          <code>careerdost.blog</code> or other websites on the Internet.
        </li>
        <li>
          Google&rsquo;s use of advertising cookies enables it and its partners to serve advertisements to our
          visitors based on their visit to this site and/or other sites on the Internet.
        </li>
        <li>
          Users may opt out of personalized advertising at any time by visiting{' '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline"
          >
            Google Ads Settings
          </a>
          . Alternatively, you can opt out of a third-party vendor&rsquo;s use of cookies for personalized
          advertising by visiting{' '}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline"
          >
            www.aboutads.info/choices
          </a>
          .
        </li>
      </ul>

      <h2>6. External Links to Official Portals</h2>
      <p>
        Every opportunity published on CareerDost links to external official websites—such as FPSC, PPSC, SPSC,
        NTS, HEC, NADRA, BISP, commercial banks, and accredited universities—so readers can verify notifications
        and apply directly. CareerDost does not control and is not responsible for the privacy practices or
        content of external websites. We encourage you to verify the domain name and read the privacy notice of
        any external portal before submitting your application documents.
      </p>

      <h2>7. Security, Infrastructure &amp; Data Protection</h2>
      <p>
        CareerDost is served over encrypted HTTPS/TLS connections via Cloudflare edge infrastructure with strict
        security headers (including Content Security Policy, HSTS, and X-Content-Type-Options). Server access
        logs are retained temporarily for security monitoring, bot mitigation, and error diagnostics in
        accordance with applicable Pakistani electronic data protection principles.
      </p>

      <h2>8. Changes to This Privacy Policy &amp; Contact</h2>
      <p>
        We review and update this Privacy Policy whenever our site features, analytics tools, or regulatory
        requirements change. Material updates are reflected by the &ldquo;Last updated&rdquo; date at the top of
        this page. If you have questions about this Privacy Policy, please reach out through our{' '}
        <Link to="/contact" className="text-green underline font-medium">
          Contact Us
        </Link>{' '}
        page.
      </p>
    </SimplePage>
  )
}
