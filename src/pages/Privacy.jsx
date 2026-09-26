import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy — CareerDost',
    description: 'Read how CareerDost collects, uses and protects information when you use our website.',
    canonical: '/privacy-policy',
  })

  return (
    <SimplePage title="Privacy Policy" updated="26 September 2026">
      <p>
        This Privacy Policy explains how CareerDost (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles
        information when you visit careerdost.pk. We built this site to be useful without asking
        for more from you than necessary.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you use our search or contact form, we collect only what you choose to enter, such as
        your name, email address and message. Standard technical information — like browser type,
        pages visited and approximate location derived from IP address — may be collected
        automatically through analytics tools to help us understand how the site is used.
      </p>
      <h2>How we use information</h2>
      <p>
        We use the information we collect to respond to your messages, improve site content and
        navigation, and understand which categories of jobs and opportunities are most useful to
        our readers. We do not sell personal information to third parties.
      </p>
      <h2>Cookies</h2>
      <p>
        We may use cookies or similar technologies for basic analytics and to remember simple
        preferences such as your last search. You can disable cookies in your browser settings;
        the site will continue to function normally without them.
      </p>
      <h2>Third-party links</h2>
      <p>
        Listings on CareerDost link to official third-party websites for applying to jobs,
        scholarships and admissions. We are not responsible for the privacy practices of those
        external sites, and encourage you to review their own privacy policies.
      </p>
      <h2>Data retention and security</h2>
      <p>
        We retain contact form submissions only as long as needed to respond to your query, and
        take reasonable technical measures to protect information from unauthorised access.
      </p>
      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected by
        updating the &ldquo;Last updated&rdquo; date above.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent through our Contact Us page.
      </p>
    </SimplePage>
  )
}
