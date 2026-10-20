import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'
import { SITE_URL } from '../lib/config'

export default function About() {
  useSeo({
    title: 'About CareerDost — Pakistan Jobs, Schemes & Verification Policy',
    description:
      'Learn about CareerDost, an independent Pakistan-focused opportunity and public information platform covering Sindh schemes, federal jobs, scholarships, and admissions.',
    canonical: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About CareerDost',
      url: `${SITE_URL}/about`,
      description:
        'Overview of CareerDost, editorial verification process, corrections policy, and geographic coverage across Pakistan and Sindh.',
      mainEntity: {
        '@type': 'Organization',
        name: 'CareerDost',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
      },
    },
  })

  return (
    <SimplePage title="About CareerDost" updated="18 October 2026">
      <p>
        <strong>CareerDost</strong> (official website:{' '}
        <a href="https://careerdost.blog" className="text-green underline font-medium">
          https://careerdost.blog
        </a>
        ) is an independent Pakistani digital opportunity and public information portal. Our mission is to make
        genuine career openings, educational opportunities, and public welfare updates transparent, fact-checked,
        and easily accessible for citizens across Pakistan — with dedicated, in-depth reporting for the province
        of <strong>Sindh</strong>.
      </p>

      <h2>Geographical Focus &amp; Regional Reporting</h2>
      <p>
        CareerDost focuses exclusively on Pakistan, serving fresh graduates, jobseekers, students, farmers, and
        households across all provinces:
      </p>
      <ul>
        <li>
          <strong>Sindh Focus:</strong> Dedicated reporting on Sindh Government initiatives, including the{' '}
          <strong>Benazir Hari Card</strong>, <strong>Sindh Peoples Housing for Flood Affectees (SPHF)</strong>,{' '}
          <strong>Sindh Solar Energy Project (SSEP)</strong>, <strong>Sindh Mamta Programme</strong>,{' '}
          <strong>SindhPublic Service Commission (SPSC)</strong> recruitments, judicial and departmental
          intakes, Karachi corporate/banking careers, and public university admissions (University of Sindh,
          NED, MUET, QUEST, SALU, SBBU, SAU Tandojam, Shaikh Ayaz University).
        </li>
        <li>
          <strong>Federal &amp; National:</strong> Coverage of Federal Public Service Commission (FPSC), Benazir
          Income Support Programme (BISP 8171), State Bank of Pakistan (SBP) circulars and trainee schemes,
          National Testing Service (NTS), Higher Education Commission (HEC) national and overseas scholarships,
          and commercial banking / private sector graduate tracks.
        </li>
        <li>
          <strong>All Provinces:</strong> Verified announcements from Punjab (PPSC, PHEC, UHS, PU, UET), Khyber
          Pakhtunkhwa (KPPSC, PHSA), Balochistan (BPSC, Gwadar Shipyard), Azad Jammu &amp; Kashmir, and
          Gilgit-Baltistan.
        </li>
      </ul>

      <h2 id="editorial-policy">Editorial Policy, Source Verification &amp; Corrections Standards</h2>
      <p>
        Every article, daily bulletin, and guide published by the <strong>CareerDost Editorial Desk</strong>{' '}
        follows five mandatory editorial standards:
      </p>
      <ol>
        <li>
          <strong>Primary Official Source Verification:</strong> No job posting, merit list, or government
          scheme is published based on unverified social media graphics or rumor chains. Every guide is
          cross-checked against official gazette notifications, Press Information Department (PID) handouts,
          public service commission portals, or accredited university and employer websites.
        </li>
        <li>
          <strong>Value Beyond Raw Announcements:</strong> Rather than copying raw advertisement text, our
          editors organize key eligibility requirements, BPS/corporate grade scales, quota distributions, step-by-step
          application instructions, fee challan procedures, and frequently asked questions (FAQs) in clear,
          accessible language.
        </li>
        <li>
          <strong>Distinguishing Confirmed Programs from Policy Proposals:</strong> When a government relief
          package or subsidy is announced in principle but formal registration has not yet opened, we state that
          fact prominently in the headline and summary so citizens are protected from fake registration links.
        </li>
        <li>
          <strong>Expired Listing Preservation &amp; Labeling:</strong> Once an application deadline passes, we
          preserve the guide for applicants tracking written tests, roll number slips, and interviews, while
          displaying an explicit <strong>Expired / Closed</strong> status indicator so readers never waste time
          applying to closed roles.
        </li>
        <li>
          <strong>Corrections &amp; Update Policy:</strong> If an official authority extends a deadline, issues
          a corrigendum, or updates an application portal URL, our editorial desk updates the relevant article
          and records the verification date. Readers can report any outdated link or corrigendum through our{' '}
          <Link to="/contact" className="text-green underline">
            Contact Us
          </Link>{' '}
          page.
        </li>
      </ol>

      <h2>Disambiguation &amp; Brand Notice</h2>
      <p>
        CareerDost (
        <a href="https://careerdost.blog" className="text-green underline">
          careerdost.blog
        </a>
        ) is an independent Pakistani publication operating exclusively for audiences in Pakistan. CareerDost is{' '}
        <strong>
          not affiliated with, associated with, or connected to any similarly named third-party job boards or
          career platforms in India or other jurisdictions
        </strong>
        .
      </p>

      <h2>What CareerDost Is — And What It Isn&rsquo;t</h2>
      <p>
        CareerDost is an independent news and educational research portal,{' '}
        <strong>not a recruitment agency, testing service, or government department</strong>. We do not issue
        job offers, accept direct job applications, collect processing fees, or guarantee selection for any post
        advertised. Every guide includes anti-fraud advice reminding citizens never to pay unauthorized agents.
      </p>

      <h2>Contact &amp; Official Channels</h2>
      <p>
        Spotted an updated corrigendum, or want to suggest an official department source we should track?
      </p>
      <ul>
        <li>
          <strong>Editorial Helpdesk:</strong> Visit our{' '}
          <Link to="/contact" className="text-green underline font-medium">
            Contact Us page
          </Link>{' '}
          to submit a correction request or verification query.
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
          for real-time alerts.
        </li>
        <li>
          <strong>WhatsApp Helpline:</strong> Reach our helpdesk via WhatsApp at{' '}
          <a
            href="https://wa.me/923173425680"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline font-medium"
          >
            0317-3425680
          </a>
          .
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
          </a>
          .
        </li>
      </ul>
    </SimplePage>
  )
}
