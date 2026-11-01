import { Link } from 'react-router-dom'
import JobReadinessChecker from '../components/JobReadinessChecker'
import { useSeo } from '../lib/useSeo'
import { getAbsoluteUrl } from '../lib/config'

export default function JobReadinessToolPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Government Job Application Readiness Checker — CareerDost',
        url: getAbsoluteUrl('/tools/job-readiness-checker'),
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PKR',
        },
        description:
          'Interactive pre-submission readiness checklist for Pakistani government job applicants applying via NJP, FPSC, PPSC, SPSC, KPPSC, BPSC, and departmental portals.',
        publisher: {
          '@type': 'Organization',
          name: 'CareerDost',
          url: getAbsoluteUrl('/'),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: getAbsoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'CareerDost Guides & Resources',
            item: getAbsoluteUrl('/category/guides-and-resources'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Government Job Application Readiness Checker',
            item: getAbsoluteUrl('/tools/job-readiness-checker'),
          },
        ],
      },
    ],
  }

  useSeo({
    title: 'Government Job Application Readiness Checker — CareerDost',
    description:
      'Free pre-submission readiness checklist for Pakistan government job applicants. Verify CNIC, domicile, degrees, age limit, and portal requirements privately.',
    canonical: '/tools/job-readiness-checker',
    jsonLd,
  })

  return (
    <div className="container-x py-8 sm:py-12 font-sans max-w-4xl">
      {/* Breadcrumb */}
      <nav className="no-print text-xs text-inksoft mb-4 flex items-center flex-wrap gap-1.5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-green font-medium">Home</Link>
        <span>/</span>
        <Link to="/category/guides-and-resources" className="hover:text-green font-medium">
          CareerDost Guides &amp; Resources
        </Link>
        <span>/</span>
        <span className="text-ink font-semibold">Application Readiness Checker</span>
      </nav>

      {/* Page Intro */}
      <header className="mb-6">
        <span className="inline-block bg-green-light text-green border border-green/25 text-xs font-bold px-3 py-1 rounded-full mb-3">
          CareerDost Guides &amp; Resources • Free Browser Utility
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink leading-tight mb-3">
          Government Job Application Readiness Checker
        </h1>
        <p className="text-sm sm:text-base text-inksoft leading-relaxed">
          Many public-sector job applications in Pakistan fail during initial scrutiny—not because the candidate lacked merit, but because a required domicile, transcript date, experience letter, professional license, or advertisement condition was overlooked before clicking submit. Use this interactive readiness checker before applying on the{' '}
          <a
            href="https://www.njp.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green font-semibold hover:underline"
          >
            National Job Portal (NJP)
          </a>
          ,{' '}
          <a
            href="https://www.fpsc.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green font-semibold hover:underline"
          >
            FPSC
          </a>
          ,{' '}
          <a
            href="https://spsc.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green font-semibold hover:underline"
          >
            SPSC
          </a>
          , PPSC, KPPSC, BPSC, or testing agency portals.
        </p>
      </header>

      {/* Interactive Tool */}
      <JobReadinessChecker showGuideLinks={false} />

      {/* Supporting Editorial Guidance */}
      <section className="no-print mt-10 grid sm:grid-cols-2 gap-5">
        <div className="border border-line bg-white p-5 rounded-xs shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-green block mb-1">
              In-Depth Guide 1
            </span>
            <h2 className="font-serif text-lg font-bold text-ink mb-2">
              NJP Application Rejection: 12 Common Mistakes to Avoid
            </h2>
            <p className="text-xs text-inksoft leading-relaxed mb-4">
              Understand documented NJP profile rules versus common candidate mistakes across CNIC matching, domicile selection, experience dates, and quota eligibility.
            </p>
          </div>
          <Link
            to="/jobs/njp-application-rejection-12-common-mistakes-avoid"
            className="text-xs font-bold text-green hover:underline"
          >
            Read Full NJP Mistakes Guide →
          </Link>
        </div>

        <div className="border border-line bg-white p-5 rounded-xs shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-green block mb-1">
              In-Depth Guide 2
            </span>
            <h2 className="font-serif text-lg font-bold text-ink mb-2">
              Government Jobs Documents Checklist in Pakistan 2026
            </h2>
            <p className="text-xs text-inksoft leading-relaxed mb-4">
              Complete breakdown of CNIC, Domicile/PRC, transcripts, HEC/IBCC attestation, NOC rules, and a printable folder checklist.
            </p>
          </div>
          <Link
            to="/jobs/government-jobs-documents-checklist-pakistan-2026"
            className="text-xs font-bold text-green hover:underline"
          >
            Open Documents Checklist Guide →
          </Link>
        </div>
      </section>

      {/* Active Vacancies Internal Link Bar */}
      <div className="no-print mt-6 p-4 bg-paper border border-line rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <strong className="text-ink block text-sm">Ready to browse verified open vacancies?</strong>
          <span className="text-inksoft">Explore active federal and provincial government recruitment notices with official portal links.</span>
        </div>
        <Link
          to="/category/government-jobs"
          className="inline-block bg-green text-white px-4 py-2 font-bold rounded-xs hover:bg-green-dark transition-colors shrink-0"
        >
          Browse Government Jobs →
        </Link>
      </div>
    </div>
  )
}
