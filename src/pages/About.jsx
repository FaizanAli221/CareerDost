import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'
import { SITE_URL } from '../lib/config'

export default function About() {
  useSeo({
    title: 'About CareerDost — Pakistan Jobs, Schemes & Verification Policy',
    description: 'Learn about CareerDost, an independent Pakistan-focused opportunity and public information platform covering Sindh schemes, federal jobs, scholarships, and admissions.',
    canonical: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About CareerDost',
      url: `${SITE_URL}/about`,
      description: 'Overview of CareerDost, editorial verification process, and geographic coverage across Pakistan and Sindh.',
      mainEntity: {
        '@type': 'Organization',
        name: 'CareerDost',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
      },
    },
  })

  return (
    <SimplePage title="About CareerDost">
      <p>
        <strong>CareerDost</strong> (official website:{' '}
        <a href="https://careerdost.blog" className="text-green underline font-medium">https://careerdost.blog</a>)
        is an independent Pakistani digital opportunity and public information portal. Our mission is to make genuine
        career openings, educational opportunities, and public welfare updates transparent and easily accessible for citizens
        across Pakistan — with dedicated, in-depth reporting for the province of <strong>Sindh</strong>.
      </p>

      <h2>Geographical Focus &amp; Regional Reporting</h2>
      <p>
        CareerDost focuses primarily on Pakistan, serving jobseekers, students, and citizens across all provinces:
      </p>
      <ul>
        <li>
          <strong>Sindh Focus:</strong> Dedicated reporting on Sindh Government initiatives, including the <strong>Benazir Hari Card</strong>,
          agricultural subsidies, Sindh Public Service Commission (SPSC) recruitments, Sindh School Education &amp; Literacy Department
          intakes, SEDA programs, and public university admissions (University of Sindh, NED, MUET, QUEST, SALU, SAU Tandojam).
        </li>
        <li>
          <strong>Federal &amp; National:</strong> Real-time coverage of Federal Public Service Commission (FPSC), Benazir Income
          Support Programme (BISP 8171), National Testing Service (NTS), Higher Education Commission (HEC) national and overseas scholarships,
          and public sector enterprises.
        </li>
        <li>
          <strong>All Provinces:</strong> Timely announcements from Punjab (PPSC), Khyber Pakhtunkhwa (KPPSC), Balochistan (BPSC),
          Azad Jammu &amp; Kashmir, and Gilgit-Baltistan.
        </li>
      </ul>

      <h2>Editorial Policy &amp; Official Source Verification</h2>
      <p>
        Every article, daily bulletin, and guide published on CareerDost undergoes rigorous editorial verification:
      </p>
      <ul>
        <li>
          <strong>Primary Source Required:</strong> No job posting, merit list, or scheme is published based on rumors, unverified
          social media graphics, or third-party blogs. Every report is verified directly against official gazette notifications,
          authorized departmental portals, or university registrar circulars.
        </li>
        <li>
          <strong>Direct Official Links:</strong> Each listing includes verified links to the official department website or online
          application portal so readers can verify criteria independently.
        </li>
        <li>
          <strong>Zero Speculation:</strong> Deadlines, fee challans, age relaxations, quotas, and merit criteria are stated exactly
          as defined in the official announcement. If an official schedule has not yet been released, we state that explicitly.
        </li>
      </ul>

      <h2>Disambiguation &amp; Brand Notice</h2>
      <p>
        CareerDost (<a href="https://careerdost.blog" className="text-green underline">careerdost.blog</a>) is an independent
        Pakistani publication operating exclusively within Pakistan. CareerDost is <strong>not affiliated with, associated with, or
        connected to any similarly named third-party job boards or career platforms in India or other jurisdictions</strong>.
        Our sole operational focus is Pakistan's education, employment, and public welfare ecosystem.
      </p>

      <h2>What CareerDost Is — And What It Isn&rsquo;t</h2>
      <p>
        CareerDost is an informational news and research portal, <strong>not a recruitment agency or government department</strong>.
        We do not issue job offers, accept direct job applications, collect money, or guarantee selection for any post advertised.
        We provide accurate, structured information free of cost to empower Pakistani youth and professionals.
      </p>

      <h2>Contact &amp; Official Channels</h2>
      <p>
        Spotted an outdated deadline, or want to suggest an official department source we should track?
      </p>
      <ul>
        <li>
          <strong>Contact Helpdesk:</strong> Visit our{' '}
          <Link to="/contact" className="text-green underline">Contact Us page</Link> to send a query directly to our editorial team.
        </li>
        <li>
          <strong>Official WhatsApp Channel:</strong> Join our verified{' '}
          <a
            href="https://whatsapp.com/channel/0029VbDnzwFF1YlIkJax2P1o"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline font-medium"
          >
            CareerDost WhatsApp Channel
          </a>{' '}
          for instant real-time alerts.
        </li>
        <li>
          <strong>Facebook:</strong> Connect with us at{' '}
          <a
            href="https://facebook.com/CareerDost"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline"
          >
            facebook.com/CareerDost
          </a>.
        </li>
      </ul>
    </SimplePage>
  )
}
