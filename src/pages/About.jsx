import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'
import { SITE_URL } from '../lib/config'

export default function About() {
  useSeo({
    title: 'About CareerDost — Editorial Team, Source Verification & Standards',
    description:
      'Learn about CareerDost, an independent Pakistani career and public opportunity portal founded by Faizan Ali. Review our editorial team, source verification standards, and corrections policy.',
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
    <SimplePage title="About CareerDost" updated="30 October 2026">
      <p>
        <strong>CareerDost</strong> (official website:{' '}
        <a href="https://careerdost.blog" className="text-green underline font-medium">
          https://careerdost.blog
        </a>
        ) is an independent Pakistani digital career, education, and public-interest opportunity portal.
        Our mission is to make genuine public and private job vacancies, university admissions, scholarships,
        and government welfare programs transparent, fact-checked, and practically accessible for citizens
        across Pakistan — with dedicated reporting for the province of <strong>Sindh</strong> and all provincial regions.
      </p>

      <h2 id="editorial-team">Editorial Leadership &amp; Team</h2>
      <p>
        CareerDost is founded and edited by <strong>Faizan Ali</strong>, who serves as the platform’s Lead Editor and Technical Architect.
        Supported by a dedicated research desk tracking Pakistani public sector announcements, the editorial team specializes
        in parsing complex statutory gazettes, testing service schedules, and departmental recruitment rules into clear, actionable guides for citizens.
      </p>
      <ul>
        <li>
          <strong>Faizan Ali — Founder &amp; Lead Editor:</strong> Oversees editorial integrity, primary source cross-checking,
          digital verification protocols, and technical architecture. Reachable directly for editorial inquiries at{' '}
          <a href="mailto:editor@careerdost.blog" className="text-green underline font-medium">editor@careerdost.blog</a>.
        </li>
        <li>
          <strong>CareerDost Editorial Desk:</strong> A collaborative team of educational researchers and content editors
          monitoring daily publications from federal ministries, provincial public service commissions, accredited universities,
          and public safety-net authorities.
        </li>
      </ul>

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
          <strong>Sindh Public Service Commission (SPSC)</strong> recruitments, judicial and departmental
          intakes, Karachi corporate/banking careers, and public university admissions (University of Sindh,
          NED, MUET, QUEST, SALU, SBBU, SAU Tandojam, Shaikh Ayaz University).
        </li>
        <li>
          <strong>Federal &amp; National:</strong> Coverage of Federal Public Service Commission (FPSC), Benazir
          Income Support Programme (BISP 8171), State Bank of Pakistan (SBP) circulars and trainee schemes,
          National Job Portal (NJP), National Testing Service (NTS), Higher Education Commission (HEC) national and overseas scholarships,
          and commercial banking / private sector graduate tracks.
        </li>
        <li>
          <strong>All Provinces:</strong> Verified announcements from Punjab (PPSC, PHEC, UHS, PU, UET), Khyber
          Pakhtunkhwa (KPPSC, PHSA), Balochistan (BPSC, Gwadar Shipyard), Azad Jammu &amp; Kashmir, and
          Gilgit-Baltistan.
        </li>
      </ul>

      <h2 id="editorial-policy">Editorial Policy, Source Verification &amp; Standards</h2>
      <p>
        Every article, daily bulletin, and comprehensive guide published on CareerDost adheres to five strict editorial standards:
      </p>
      <ol>
        <li>
          <strong>Primary Official Source Verification:</strong> No job posting, admission notice, or government
          scheme is published based on unverified social media screenshots or WhatsApp rumors. Every guide is
          cross-checked directly against official gazette notifications, Press Information Department (PID) handouts,
          public service commission bulletins, or accredited institutional websites.
        </li>
        <li>
          <strong>Value Beyond Raw Advertisements:</strong> Rather than merely republishing raw notifications, our
          editors organize practical details required by applicants: provincial/regional quota distributions, basic pay scale (BPS)
          allowances, official Treasury Challan Form 32-A / 1Bill PSID payment procedures, step-by-step application walkthroughs,
          and frequently asked questions (FAQs).
        </li>
        <li>
          <strong>Distinguishing Policy Proposals from Active Registration:</strong> When a government relief
          package or subsidy is announced in principle but formal registration has not yet opened, we state that
          prominently in the headline and summary so citizens are protected from fraudulent registration scams.
        </li>
        <li>
          <strong>Maintenance of Expired &amp; Outdated Opportunities:</strong> After an application deadline passes, we
          preserve the guide so applicants can reference syllabus breakdowns, screening test dates, answer keys, and roll number
          slip schedules, while displaying a clear <strong>Archived / Application Closed</strong> status banner so readers never waste
          time trying to apply for closed roles.
        </li>
        <li>
          <strong>Transparent Corrections &amp; Corrigenda Protocol:</strong> If an official authority extends an application
          deadline, issues a corrigendum altering seat quotas, or revises an application URL, our editorial team updates the article
          promptly and updates the verification timestamp. Readers can report any broken link or revised date directly through our{' '}
          <Link to="/contact" className="text-green underline">
            Contact Us
          </Link>{' '}
          helpdesk.
        </li>
      </ol>

      <h2>Anti-Fraud &amp; Zero-Fee Commitment</h2>
      <p>
        CareerDost is an independent educational and public research publication,{' '}
        <strong>not a recruitment agency, testing service, or government department</strong>. We never issue
        job offers, accept job applications directly, collect processing fees, or guarantee selection for any post
        advertised. We advise all citizens never to pay money, mobile wallet transfers (Easypaisa / JazzCash), or "processing charges"
        to unauthorized individuals claiming to represent employers.
      </p>

      <h2>Disambiguation &amp; Brand Notice</h2>
      <p>
        CareerDost (
        <a href="https://careerdost.blog" className="text-green underline">
          careerdost.blog
        </a>
        ) is an independent Pakistani publication operating exclusively for audiences in Pakistan. CareerDost is{' '}
        <strong>
          not affiliated with, associated with, or connected to any similarly named third-party job boards or
          career platforms in India or other international jurisdictions
        </strong>
        .
      </p>

      <h2>Contact &amp; Editorial Helpdesk</h2>
      <p>
        Spotted an updated corrigendum, or want to suggest an official department source we should track?
      </p>
      <ul>
        <li>
          <strong>Editorial Inquiries:</strong>{' '}
          <a href="mailto:editor@careerdost.blog" className="text-green underline font-medium">
            editor@careerdost.blog
          </a>{' '}
          or{' '}
          <a href="mailto:contact@careerdost.blog" className="text-green underline font-medium">
            contact@careerdost.blog
          </a>
        </li>
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
