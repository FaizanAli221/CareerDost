import SimplePage from '../components/SimplePage'
import { useSeo } from '../lib/useSeo'

export default function Terms() {
  useSeo({
    title: 'Terms & Conditions — CareerDost',
    description: 'The terms and conditions governing your use of the CareerDost website.',
    canonical: '/terms-and-conditions',
  })

  return (
    <SimplePage title="Terms &amp; Conditions" updated="26 September 2026">
      <p>
        By accessing or using careerdost.pk, you agree to the following terms. If you do not agree
        with any part of these terms, please discontinue use of the site.
      </p>
      <h2>Use of the site</h2>
      <p>
        You may browse, search and share content from CareerDost for personal, non-commercial use.
        You may not republish, scrape at scale, or redistribute our content as your own without
        prior written permission.
      </p>
      <h2>Accuracy of listings</h2>
      <p>
        Job, scholarship, admission and result listings are compiled from publicly available
        official sources. While we aim for accuracy, CareerDost makes no warranty, express or
        implied, regarding the completeness or current validity of any listing. The official
        source linked in each listing takes precedence.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        CareerDost, its team and affiliates will not be liable for any loss or damage arising from
        decisions made based on content published on this site, including missed deadlines,
        rejected applications, or reliance on outdated information.
      </p>
      <h2>User submissions</h2>
      <p>
        Any information you submit through our Contact Us form is provided voluntarily and may be
        used to respond to your query or improve our content, in line with our Privacy Policy.
      </p>
      <h2>Changes to these terms</h2>
      <p>
        We may revise these terms from time to time. Continued use of the site after changes are
        posted constitutes acceptance of the revised terms.
      </p>
      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Pakistan, and any disputes will be subject to the
        exclusive jurisdiction of the courts of Pakistan.
      </p>
    </SimplePage>
  )
}
