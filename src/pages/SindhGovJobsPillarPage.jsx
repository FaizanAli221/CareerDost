import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getArticlesByCategoryFromDb, searchListingsFromDb } from '../api/client'
import ListingRow from '../components/ListingRow'
import { useSeo } from '../lib/useSeo'
import { getAbsoluteUrl } from '../lib/config'

export default function SindhGovJobsPillarPage() {
  const [articles, setArticles] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      Array.isArray(window.__INITIAL_SINDH_ARTICLES__) &&
      window.__INITIAL_SINDH_ARTICLES__.length > 0
    ) {
      const preloaded = window.__INITIAL_SINDH_ARTICLES__.filter(
        (item) => item && item.slug && item.slug !== 'sindh-government-jobs-2026'
      )
      delete window.__INITIAL_SINDH_ARTICLES__
      return preloaded
    }
    return []
  })
  const [loading, setLoading] = useState(() => articles.length === 0)
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [selectedScale, setSelectedScale] = useState('all')

  const canonicalUrl = getAbsoluteUrl('/jobs/sindh-government-jobs-2026')
  const ogImageUrl = getAbsoluteUrl('/images/sindh-government-jobs-2026-spsc-sts-guide.webp')

  const faqs = [
    {
      question: 'What is the general age relaxation for Sindh Government jobs in 2026?',
      answer:
        'The Government of Sindh (Services, General Administration and Coordination Department - S&GAD) has notified a general relaxation of up to 15 years in the upper age limit for recruitment across provincial departments. This relaxation allows candidates up to 43 years (and up to 45 years in select quota categories) to apply for general posts, excluding police and executive law enforcement cadres which retain statutory age ceilings.',
    },
    {
      question: 'Which testing agencies conduct recruitment for Sindh Government departments?',
      answer:
        'Recruitment in Sindh is conducted through three primary channels: 1) Sindh Public Service Commission (SPSC) for gazetted posts (BPS-16 and above), 2) Sukkur IBA Testing Services (STS / SIBA) for ministerial, teaching (PST/JEST), and general departmental vacancies (BPS-05 to BPS-15), and 3) Departmental District Selection Committees for lower-cadre posts (BPS-01 to BPS-04).',
    },
    {
      question: 'Is PRC Form "D" mandatory for Sindh domicile applicants?',
      answer:
        'Yes. Permanent Residence Certificate (PRC) Form "D" along with a valid District Domicile Certificate issued under the Pakistan Citizenship Act is legally mandatory for all provincial and district quota posts in Sindh. Candidates must ensure the district mentioned on both Domicile and PRC matches their CNIC record.',
    },
    {
      question: 'Where can I find BPS-1 to BPS-4 jobs (Naib Qasid, Peon, Mali, Driver) in Sindh?',
      answer:
        'BPS-01 to BPS-04 recruitment is decentralised and advertised directly by district administrative offices, including District and Sessions Courts, Municipal Corporations, Health Facilities, and the Education Department. Candidates submit handwritten or standard printed applications directly to the respective district department head.',
    },
    {
      question: 'What are the quota allocations for Sindh Government recruitment?',
      answer:
        'Under the Sindh Civil Servants (Appointment, Promotion & Transfer) Rules, recruitment is allocated based on: 60% Rural Quota and 40% Urban Quota (for Karachi, Hyderabad, and Sukkur municipal limits) for provincial positions. Additionally, statutory reservations include 5% Women Quota, 5% Minorities Quota, and 5% Differently-Abled Persons Quota across all departments.',
    },
  ]

  const jsonLd = useMemo(() => {
    const cleanItems = articles.filter(
      (a) => a && a.slug && a.slug !== 'sindh-government-jobs-2026'
    )
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: 'Sindh Government Jobs 2026 — Latest Vacancies & Recruitment Directory',
          description:
            'Comprehensive directory of verified Sindh Government jobs in 2026 across Karachi, Hyderabad, Sukkur, Larkana, and Badin. Find SPSC, STS, BPS-1 to 4, Clerk, and Driver vacancies with official application links.',
          inLanguage: 'en-PK',
          isPartOf: {
            '@type': 'WebSite',
            '@id': getAbsoluteUrl('/#website'),
            name: 'CareerDost',
          },
          breadcrumb: {
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
                name: 'Government Jobs',
                item: getAbsoluteUrl('/category/government-jobs'),
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Sindh Government Jobs 2026',
                item: canonicalUrl,
              },
            ],
          },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: cleanItems.length,
            itemListElement: cleanItems.slice(0, 15).map((a, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: a.title,
              url: getAbsoluteUrl(`/jobs/${a.slug}`),
            })),
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        },
      ],
    }
  }, [canonicalUrl, articles])

  useSeo({
    title: 'Sindh Government Jobs 2026 — Latest Vacancies | CareerDost',
    description:
      'Verified Sindh Government Jobs 2026: SPSC, STS, District Courts, BPS-1 to 4, Junior Clerk, and Driver posts across Karachi, Hyderabad, Sukkur, Larkana, and Badin.',
    canonical: canonicalUrl,
    ogTitle: 'Sindh Government Jobs 2026 — Latest Vacancies | CareerDost',
    ogDescription:
      'Official directory of Sindh provincial vacancies: SPSC CCE, STS screening, Karachi & district posts, BPS-1 to 4 jobs, and official apply links.',
    ogImage: ogImageUrl,
    jsonLd,
  })

  useEffect(() => {
    if (articles.length > 0) {
      setLoading(false)
      return
    }
    async function loadData() {
      setLoading(true)
      try {
        const [govListings, sindhSearchings] = await Promise.all([
          getArticlesByCategoryFromDb('government-jobs', 100).catch(() => []),
          searchListingsFromDb('Sindh').catch(() => []),
        ])

        const combinedMap = new Map()
        const isSindhRelated = (item) => {
          if (!item || !item.slug || item.slug === 'sindh-government-jobs-2026') return false
          if (/balochistan quota|-balochistan|^kp-|^punjab-/i.test(`${item.title || ''} ${item.slug || ''}`)) {
            return false
          }
          const cat = item.category || item.category_slug || ''
          if (cat && !['government-jobs', 'internships', 'career-guides'].includes(cat)) {
            return false
          }
          const text = [
            item.title,
            item.location,
            item.organization,
          ]
            .join(' ')
            .toLowerCase()
          return (
            text.includes('sindh') ||
            text.includes('karachi') ||
            text.includes('hyderabad') ||
            text.includes('sukkur') ||
            text.includes('larkana') ||
            text.includes('badin') ||
            text.includes('dadu') ||
            text.includes('spsc') ||
            /\b(sts|siba)\b/i.test(text)
          )
        }

        ;[...govListings, ...sindhSearchings].forEach((item) => {
          if (item && item.slug && isSindhRelated(item)) {
            combinedMap.set(item.slug, item)
          }
        })

        const sorted = Array.from(combinedMap.values()).sort((a, b) => {
          const dateA = new Date(a.publishDate || a.publish_date || 0)
          const dateB = new Date(b.publishDate || b.publish_date || 0)
          return dateB - dateA
        })

        setArticles(sorted)
      } catch (err) {
        console.error('Failed to load Sindh jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const todayIso = new Date().toISOString().slice(0, 10)

  // Split into active vacancies vs archived reference notices
  const { activeArticles, archivedArticles } = useMemo(() => {
    const active = []
    const archived = []

    articles.forEach((item) => {
      const lastDate = item.lastDate || item.last_date
      const isExpired = lastDate && /^\d{4}-\d{2}-\d{2}$/.test(lastDate) && lastDate < todayIso
      if (isExpired) {
        archived.push(item)
      } else {
        active.push(item)
      }
    })

    return { activeArticles: active, archivedArticles: archived }
  }, [articles, todayIso])

  // Filter active articles by district and scale
  const filteredActive = useMemo(() => {
    return activeArticles.filter((item) => {
      const text = [item.title, item.location, item.positions, item.organization]
        .join(' ')
        .toLowerCase()

      // District filter
      if (selectedDistrict !== 'all') {
        if (!text.includes(selectedDistrict)) return false
      }

      // Scale / Role filter
      if (selectedScale !== 'all') {
        if (selectedScale === 'bps1-4') {
          const isBps14 =
            text.includes('bps-1') ||
            text.includes('bps-01') ||
            text.includes('bps-2') ||
            text.includes('bps-02') ||
            text.includes('bps-3') ||
            text.includes('bps-03') ||
            text.includes('bps-4') ||
            text.includes('bps-04') ||
            text.includes('naib qasid') ||
            text.includes('peon') ||
            text.includes('mali') ||
            text.includes('chowkidar') ||
            text.includes('cook')
          if (!isBps14) return false
        } else if (selectedScale === 'clerk') {
          const isClerk =
            text.includes('clerk') ||
            text.includes('assistant') ||
            text.includes('data entry') ||
            text.includes('steno')
          if (!isClerk) return false
        } else if (selectedScale === 'driver') {
          if (!text.includes('driver')) return false
        } else if (selectedScale === 'spsc-sts') {
          const isCommission =
            text.includes('spsc') ||
            /\b(sts|siba)\b/i.test(text) ||
            text.includes('bps-16') ||
            text.includes('bps-17') ||
            text.includes('bps-18')
          if (!isCommission) return false
        }
      }

      return true
    })
  }, [activeArticles, selectedDistrict, selectedScale])

  const districts = [
    { id: 'all', label: 'All Sindh' },
    { id: 'karachi', label: 'Karachi' },
    { id: 'hyderabad', label: 'Hyderabad' },
    { id: 'sukkur', label: 'Sukkur' },
    { id: 'larkana', label: 'Larkana' },
    { id: 'badin', label: 'Badin' },
  ]

  const scales = [
    { id: 'all', label: 'All Cadres & Scales' },
    { id: 'bps1-4', label: 'BPS-01 to BPS-04 (Class IV / Naib Qasid)' },
    { id: 'clerk', label: 'Clerks & Assistants (BPS-11 to 16)' },
    { id: 'driver', label: 'Drivers (BPS-04 / 05)' },
    { id: 'spsc-sts', label: 'SPSC & STS Gazette Roles' },
  ]

  return (
    <div className="bg-paper min-h-screen">
      {/* Breadcrumb Header */}
      <div className="border-b border-line bg-white/70 backdrop-blur-xs">
        <div className="container-x py-3 text-xs text-inksoft flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-green">Home</Link>
          <span>/</span>
          <Link to="/category/government-jobs" className="hover:text-green">Government Jobs</Link>
          <span>/</span>
          <span className="text-ink font-semibold">Sindh Government Jobs 2026</span>
        </div>
      </div>

      <div className="container-x py-8 sm:py-12 max-w-5xl">
        {/* Answer-First Editorial Introduction */}
        <header className="mb-8 border-b border-line pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-bold font-sans mb-3 border border-green/20">
            <span>✓ Verified Provincial Recruitment Hub</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight mb-4">
            Sindh Government Jobs 2026 — Latest Vacancies
          </h1>
          <p className="font-sans text-base sm:text-lg text-inksoft leading-relaxed max-w-4xl mb-4">
            Welcome to CareerDost’s verified directory of <strong>Sindh Government Jobs 2026</strong>. 
            Public sector departments across Sindh—including the <strong>Sindh Public Service Commission (SPSC)</strong>, 
            <strong>Sukkur IBA Testing Services (STS)</strong>, <strong>High Court of Sindh &amp; District Judiciary</strong>, 
            and provincial municipal bodies—announce regular vacancies across all 30 districts of Sindh.
          </p>
          <div className="bg-white border-l-4 border-green p-4 rounded-xs text-xs sm:text-sm text-ink leading-relaxed">
            <strong>Key Recruitment Update (2026 Policy):</strong> The Sindh Services, General Administration &amp; Coordination 
            Department (S&amp;GAD) enforces a general <strong>15-year upper age relaxation</strong> (up to 43 years for general recruitment). 
            Candidates holding a valid <strong>Sindh Domicile</strong> and <strong>PRC Form "D"</strong> are eligible to apply under 
            designated Rural (60%) and Urban (40%) provincial quota allocations.
          </div>
        </header>

        {/* Featured Guide Banner */}
        <div className="relative aspect-[21/9] w-full bg-slate-900 rounded-xs overflow-hidden mb-8 shadow-xs border border-line">
          <img
            src="/images/sindh-government-jobs-2026-spsc-sts-guide.webp"
            alt="Sindh Government Jobs 2026 Latest Vacancies SPSC STS Online Apply Guide CareerDost"
            width={1200}
            height={514}
            className="w-full h-full object-cover"
            fetchpriority="high"
          />
        </div>

        {/* Quick Facts Table (AEO Standard) */}
        <section className="mb-10 bg-white border border-line rounded-xs p-5 sm:p-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink mb-4 pb-2 border-b border-line/60">
            Quick Facts: Sindh Government Recruitment 2026
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <tbody>
                <tr className="border-b border-line/50 hover:bg-paper/50">
                  <td className="py-2.5 px-3 font-semibold text-ink w-1/3 bg-paper/40">Jurisdiction</td>
                  <td className="py-2.5 px-3 text-inksoft">Government of Sindh (Provincial, Divisional &amp; District Cadres)</td>
                </tr>
                <tr className="border-b border-line/50 hover:bg-paper/50">
                  <td className="py-2.5 px-3 font-semibold text-ink bg-paper/40">Official Testing Agencies</td>
                  <td className="py-2.5 px-3 text-inksoft">
                    SPSC (BPS-16+), Sukkur IBA Testing Services (STS BPS-05 to 15), District Selection Committees (BPS-01 to 04)
                  </td>
                </tr>
                <tr className="border-b border-line/50 hover:bg-paper/50">
                  <td className="py-2.5 px-3 font-semibold text-ink bg-paper/40">General Age Limit</td>
                  <td className="py-2.5 px-3 text-inksoft">18 to 28 years + 15 Years General Relaxation = <strong>Up to 43 Years</strong></td>
                </tr>
                <tr className="border-b border-line/50 hover:bg-paper/50">
                  <td className="py-2.5 px-3 font-semibold text-ink bg-paper/40">Mandatory Domicile</td>
                  <td className="py-2.5 px-3 text-inksoft">District Domicile Certificate &amp; PRC Form "D" (Rural or Urban Quota)</td>
                </tr>
                <tr className="border-b border-line/50 hover:bg-paper/50">
                  <td className="py-2.5 px-3 font-semibold text-ink bg-paper/40">Statutory Quotas</td>
                  <td className="py-2.5 px-3 text-inksoft">Rural 60%, Urban 40%, Women 5%, Minorities 5%, Differently-Abled 5%</td>
                </tr>
                <tr className="hover:bg-paper/50">
                  <td className="py-2.5 px-3 font-semibold text-ink bg-paper/40">Official Portals</td>
                  <td className="py-2.5 px-3 text-inksoft">
                    <a href="https://spsc.gov.pk" target="_blank" rel="noopener noreferrer" className="text-green font-semibold hover:underline mr-3">spsc.gov.pk ↗</a>
                    <a href="https://apply.sts.net.pk" target="_blank" rel="noopener noreferrer" className="text-green font-semibold hover:underline mr-3">apply.sts.net.pk ↗</a>
                    <a href="https://sindhjobs.gov.pk" target="_blank" rel="noopener noreferrer" className="text-green font-semibold hover:underline">sindhjobs.gov.pk ↗</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive District & Scale Filters */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Active Sindh Government Job Vacancies
              </h2>
              <p className="text-xs text-inksoft">
                Showing verified open vacancies. Expired announcements are automatically moved to archives.
              </p>
            </div>
            <div className="text-xs font-semibold text-green bg-green/10 px-3 py-1.5 rounded-full border border-green/20 self-start sm:self-auto">
              {filteredActive.length} Open Vacancies Available
            </div>
          </div>

          {/* District Filter Bar */}
          <div className="bg-white border border-line p-3 rounded-xs mb-3 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-ink whitespace-nowrap pl-1">District:</span>
            {districts.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d.id)}
                className={`text-xs px-3 py-1.5 rounded-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDistrict === d.id
                    ? 'bg-green text-white font-bold shadow-xs'
                    : 'bg-paper text-inksoft hover:bg-stone-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Cadre / Scale Filter Bar */}
          <div className="bg-white border border-line p-3 rounded-xs flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-ink whitespace-nowrap pl-1">Scale/Cadre:</span>
            {scales.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScale(s.id)}
                className={`text-xs px-3 py-1.5 rounded-xs font-medium whitespace-nowrap transition-colors ${
                  selectedScale === s.id
                    ? 'bg-green text-white font-bold shadow-xs'
                    : 'bg-paper text-inksoft hover:bg-stone-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Listings Section */}
        <section className="mb-12">
          {loading ? (
            <div className="py-12 text-center text-sm text-inksoft">
              Loading verified Sindh recruitment records...
            </div>
          ) : filteredActive.length > 0 ? (
            <div className="space-y-3">
              {filteredActive.map((item) => (
                <ListingRow key={item.slug || item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-line p-8 text-center rounded-xs">
              <p className="font-serif text-lg font-bold text-ink mb-2">
                No active vacancies match your selected filter right now.
              </p>
              <p className="text-xs sm:text-sm text-inksoft max-w-md mx-auto mb-4">
                Try selecting "All Sindh" or "All Cadres &amp; Scales" to explore all open provincial recruitment notices.
              </p>
              <button
                onClick={() => {
                  setSelectedDistrict('all')
                  setSelectedScale('all')
                }}
                className="inline-block bg-green text-white text-xs font-bold px-4 py-2 rounded-xs hover:bg-green-dark transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Essential Document Checklist for Sindh Candidates */}
        <section className="mb-10 bg-white border border-line rounded-xs p-5 sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-green mb-1">
            Official Submission Guide
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink mb-3">
            Sindh Government Jobs: Mandatory Application Documents Checklist
          </h2>
          <p className="text-xs sm:text-sm text-inksoft mb-4 leading-relaxed">
            Ensure your application dossier contains attested copies of these mandatory documents before submitting to SPSC, STS, or District Committees:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-ink">
            <div className="border border-line/60 bg-paper/40 p-3 rounded-xs flex items-start gap-2.5">
              <span className="text-green font-bold text-base">✓</span>
              <div>
                <strong>Original CNIC:</strong> Valid Computerized National Identity Card with permanent address in Sindh.
              </div>
            </div>
            <div className="border border-line/60 bg-paper/40 p-3 rounded-xs flex items-start gap-2.5">
              <span className="text-green font-bold text-base">✓</span>
              <div>
                <strong>Domicile Certificate:</strong> Issued by District Administration / Deputy Commissioner office.
              </div>
            </div>
            <div className="border border-line/60 bg-paper/40 p-3 rounded-xs flex items-start gap-2.5">
              <span className="text-green font-bold text-base">✓</span>
              <div>
                <strong>PRC Form "D":</strong> Permanent Residence Certificate indicating Urban or Rural municipal status.
              </div>
            </div>
            <div className="border border-line/60 bg-paper/40 p-3 rounded-xs flex items-start gap-2.5">
              <span className="text-green font-bold text-base">✓</span>
              <div>
                <strong>Educational Degrees &amp; Transcripts:</strong> Matric, Intermediate, Bachelor's / Master's certificates.
              </div>
            </div>
            <div className="border border-line/60 bg-paper/40 p-3 rounded-xs flex items-start gap-2.5">
              <span className="text-green font-bold text-base">✓</span>
              <div>
                <strong>Departmental NOC:</strong> No Objection Certificate from parent department if already in government service.
              </div>
            </div>
            <div className="border border-line/60 bg-paper/40 p-3 rounded-xs flex items-start gap-2.5">
              <span className="text-green font-bold text-base">✓</span>
              <div>
                <strong>Recent Photographs &amp; Paid Challan:</strong> Passport-size photos with blue background and bank receipt.
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-inksoft">Need an interactive pre-submission verification tool?</span>
            <Link to="/tools/job-readiness-checker" className="text-green font-bold hover:underline">
              Run Free Job Readiness Checker →
            </Link>
          </div>
        </section>

        {/* Contextual Internal Linking Hub */}
        <section className="mb-10 bg-green-light/20 border border-green/20 rounded-xs p-5 sm:p-6">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-ink mb-3">
            Related Sindh Public Sector Guides &amp; Key Notices
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <Link
              to="/jobs/sindh-courts-bps-1-4-jobs-2026"
              className="bg-white p-3 border border-line rounded-xs hover:border-green transition-colors"
            >
              <strong className="block text-ink mb-1">Sindh Courts BPS-01 to 04 Jobs</strong>
              <span className="text-inksoft">District &amp; Sessions Court vacancies for peon, naib qasid &amp; staff.</span>
            </Link>
            <Link
              to="/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening"
              className="bg-white p-3 border border-line rounded-xs hover:border-green transition-colors"
            >
              <strong className="block text-ink mb-1">SPSC CCE-2026 Examination Guide</strong>
              <span className="text-inksoft">Screening test dates, age relaxation rules &amp; syllabus updates.</span>
            </Link>
            <Link
              to="/jobs/sindh-job-portal-2026-junior-clerk-jobs"
              className="bg-white p-3 border border-line rounded-xs hover:border-green transition-colors"
            >
              <strong className="block text-ink mb-1">Sindh Job Portal Junior Clerk Guide</strong>
              <span className="text-inksoft">Typing test standards, BPS-11 requirements &amp; online apply steps.</span>
            </Link>
          </div>
        </section>

        {/* Frequently Asked Questions (AEO & FAQPage Schema) */}
        <section className="mb-12 bg-white border border-line rounded-xs p-5 sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-green mb-1">
            Applicant Knowledge Base
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink mb-6">
            Frequently Asked Questions: Sindh Public Sector Jobs
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-line/60 pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-serif text-base sm:text-lg font-bold text-ink mb-2">
                  {faq.question}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-inksoft leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Archived Reference Section */}
        {archivedArticles.length > 0 && (
          <section className="border-t border-line pt-8">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-ink mb-2">
              Recent Closed Recruitment Notices &amp; Past Test Schedules
            </h2>
            <p className="text-xs text-inksoft mb-4">
              Archived for applicant reference, syllabus cross-checking, and result tracking:
            </p>
            <div className="space-y-2 opacity-75">
              {archivedArticles.slice(0, 5).map((item) => (
                <div key={item.slug || item.id} className="bg-white border border-line/60 p-3 rounded-xs flex items-center justify-between text-xs">
                  <Link to={`/jobs/${item.slug}`} className="font-medium text-ink hover:text-green truncate pr-2">
                    {item.title}
                  </Link>
                  <span className="shrink-0 text-[11px] text-inksoft bg-stone-100 px-2 py-0.5 rounded">
                    Deadline Passed
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
