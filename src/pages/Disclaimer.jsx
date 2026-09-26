import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'

export default function Disclaimer() {
  useSeo({
    title: 'Disclaimer Notice — CareerDost',
    description: 'CareerDost is an independent information portal. Read our disclaimer before applying to any listing.',
    canonical: '/disclaimer',
  })

  return (
    <SimplePage title="Disclaimer" updated="26 September 2026">
      <p>
        CareerDost is an independent information portal. We are not affiliated with, endorsed by,
        or officially connected to any government department, bank, university or private company
        whose vacancies, scholarships or results are listed on this site, unless explicitly stated.
      </p>
      <h2>No guarantee of accuracy</h2>
      <p>
        We make a genuine effort to summarise official notifications accurately and to update or
        remove listings once they close. However, details such as eligibility criteria, salary and
        deadlines can change after publication. Always cross-check the information on this site
        against the official notification or website before making any decision.
      </p>
      <h2>Not a recruiting agency</h2>
      <p>
        CareerDost does not process applications, does not conduct interviews or tests, and does
        not charge any fee for job seekers to view or apply to listings. If anyone claims to
        represent CareerDost and asks for payment in exchange for a job, scholarship or admission,
        please report it to us immediately.
      </p>
      <h2>External links</h2>
      <p>
        Listings link to official third-party websites for applying. We are not responsible for
        the content, accuracy or availability of these external sites.
      </p>
      <h2>No professional advice</h2>
      <p>
        Content on CareerDost, including result and scheme information, is provided for general
        informational purposes and should not be treated as legal, financial or career advice.
      </p>
    </SimplePage>
  )
}
