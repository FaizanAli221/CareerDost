import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'

export default function About() {
  useSeo({
    title: 'About Us — CareerDost',
    description: 'Learn about CareerDost, a Pakistan-based jobs and opportunities portal covering government jobs, scholarships, admissions and results.',
    canonical: '/about',
  })

  return (
    <SimplePage title="About Us">
      <p>
        CareerDost was started with one goal: make it easier for people across Pakistan to find
        genuine job openings, scholarships, admissions and results without digging through dozens
        of scattered newspaper clippings and department websites.
      </p>
      <p>
        Every day, our team reviews official notifications from federal and provincial
        departments, commercial banks, universities and testing bodies such as FPSC, PPSC, NTS and various
        boards of intermediate and secondary education, and rewrites them in plain language —
        with the eligibility criteria, last date and official link always included.
      </p>
      <h2>What we cover</h2>
      <p>
        Government jobs, private sector openings, bank jobs, IT jobs, scholarships, internships,
        university admissions, government welfare schemes, and board or test results — organised
        by category and searchable from a single page.
      </p>
      <h2>What we don&rsquo;t do</h2>
      <p>
        We are an information portal, not a recruiting agency. CareerDost does not accept
        applications directly, does not charge any fee to job seekers, and does not guarantee
        selection for any post advertised on this site. Every listing links back to the official
        source so you can verify and apply directly.
      </p>
      <h2>Get in touch</h2>
      <p>
        Spotted an outdated listing, or want to suggest a source we should be tracking? Visit our{' '}
        <Link to="/contact" className="text-green underline">Contact Us</Link> page — we read every
        message.
      </p>
    </SimplePage>
  )
}
