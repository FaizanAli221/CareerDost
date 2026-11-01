import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getLatestDailyUpdatesFromDb,
  getArticlesByCategoryFromDb,
  getClosingSoonOpportunitiesFromDb,
} from '../api/client'
import OpportunityCard from '../components/OpportunityCard'
import UpdateCard from '../components/UpdateCard'
import WhatsAppCTA from '../components/WhatsAppCTA'
import { useSeo } from '../lib/useSeo'
import { SITE_URL } from '../lib/config'

const QUICK_CATEGORIES = [
  { label: 'Government Jobs', path: '/category/government-jobs', icon: '🏛️', desc: 'FPSC, PPSC, NTS, Federal & Provincial' },
  { label: 'Private Jobs', path: '/category/private-jobs', icon: '🏢', desc: 'Corporate, MNCs & National Enterprises' },
  { label: 'Bank Jobs', path: '/category/bank-jobs', icon: '🏦', desc: 'Commercial, Islamic & Central Banking' },
  { label: 'IT & Tech Jobs', path: '/category/it-jobs', icon: '💻', desc: 'Software, QA, Cyber Security & Remote' },
  { label: 'Scholarships', path: '/category/scholarships', icon: '📜', desc: 'HEC, Fully Funded & Foreign Awards' },
  { label: 'Internships', path: '/category/internships', icon: '🎓', desc: 'Fresh Graduates & Paid Trainee Schemes' },
  { label: 'Admissions', path: '/category/admissions', icon: '🏫', desc: 'Undergraduate, Medical, MS & PhD Intakes' },
  { label: 'Results & Merit Lists', path: '/category/results', icon: '📊', desc: 'Merit Lists, Answer Keys & Test Slips' },
]

function SectionHeader({ tag, title, subtitle, linkTo, linkText = 'View All →' }) {
  return (
    <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2 border-b border-line pb-4">
      <div>
        {tag && (
          <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider mb-1 text-green">
            {tag}
          </div>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm font-sans text-inksoft mt-1">{subtitle}</p>}
      </div>

      {linkTo && (
        <Link
          to={linkTo}
          className="border border-green text-green hover:bg-green hover:text-white px-4 py-2 text-xs font-sans font-semibold rounded-xs transition-colors shrink-0"
        >
          {linkText}
        </Link>
      )}
    </div>
  )
}

function LoadingGrid({ count = 4, cols = 'grid sm:grid-cols-2 lg:grid-cols-4' }) {
  return (
    <div className={`${cols} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-line bg-white h-72 p-4 rounded-xs">
          <div className="aspect-[16/9] bg-line/25 rounded-xs mb-4"></div>
          <div className="h-4 bg-line/40 w-3/4 rounded mb-2"></div>
          <div className="h-3 bg-line/25 w-1/2 rounded"></div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [heroSearch, setHeroSearch] = useState('')
  const [dailyUpdates, setDailyUpdates] = useState([])
  const [govJobs, setGovJobs] = useState([])
  const [pvtJobs, setPvtJobs] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [results, setResults] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [internships, setInternships] = useState([])
  const [closingSoon, setClosingSoon] = useState([])
  const [loading, setLoading] = useState(true)
  const [belowFoldLoaded, setBelowFoldLoaded] = useState(false)
  const [feedReady] = useState(true)
  const navigate = useNavigate()

  useSeo({
    title: 'CareerDost — Verified Pakistan Jobs, Scholarships & Government Schemes',
    description: "CareerDost (Career Dost) provides verified Pakistan jobs, Sindh government schemes, BISP updates, bank careers, scholarships, and admissions with direct official links.",
    canonical: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: 'CareerDost',
          alternateName: [
            'Career Dost',
            'CareerDost Pakistan',
            'Career Dost Pakistan'
          ],
          url: `${SITE_URL}/`,
          description: 'Pakistan-focused jobs, education, government schemes, and public updates platform',
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
          inLanguage: 'en-PK',
        },
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'CareerDost',
          alternateName: [
            'Career Dost',
            'CareerDost Pakistan'
          ],
          url: `${SITE_URL}/`,
          description: 'Pakistan-focused jobs, education, government schemes, and public updates platform',
          logo: {
            '@type': 'ImageObject',
            '@id': `${SITE_URL}/#logo`,
            url: `${SITE_URL}/logo.png`,
            caption: 'CareerDost Pakistan Logo',
            width: 512,
            height: 512,
          },
          image: `${SITE_URL}/logo.png`,
          sameAs: [
            'https://whatsapp.com/channel/0029VbDnzwFF1YlIkJax2P1o',
            'https://facebook.com/CareerDost',
          ],
          areaServed: [
            {
              '@type': 'Country',
              name: 'Pakistan',
            },
            {
              '@type': 'AdministrativeArea',
              name: 'Sindh',
            },
          ],
        },
      ],
    },
  })

  useEffect(() => {
    let isMounted = true

    // Phase 1: Prioritize above-the-fold content (Daily Updates and Government Jobs)
    Promise.allSettled([
      getLatestDailyUpdatesFromDb(6),
      getArticlesByCategoryFromDb('government-jobs', 4),
    ]).then(([updRes, govRes]) => {
      if (!isMounted) return
      if (updRes.status === 'fulfilled' && updRes.value) setDailyUpdates(updRes.value)
      if (govRes.status === 'fulfilled' && govRes.value) setGovJobs(govRes.value.slice(0, 4))
      setLoading(false)
    })

    // Phase 2: Load below-the-fold categories on interaction or idle timeout
    let timerHandle = null

    const loadBelowFold = () => {
      if (!isMounted) return
      setBelowFoldLoaded(true)
      Promise.allSettled([
        getClosingSoonOpportunitiesFromDb(6),
        getArticlesByCategoryFromDb('private-jobs', 4),
        getArticlesByCategoryFromDb('admissions', 4),
        getArticlesByCategoryFromDb('results', 4),
        getArticlesByCategoryFromDb('scholarships', 4),
        getArticlesByCategoryFromDb('internships', 4),
      ]).then(([clsRes, pvtRes, admRes, resRes, schRes, intRes]) => {
        if (!isMounted) return
        if (clsRes.status === 'fulfilled' && clsRes.value) setClosingSoon(clsRes.value)
        if (pvtRes.status === 'fulfilled' && pvtRes.value) setPvtJobs(pvtRes.value.slice(0, 4))
        if (admRes.status === 'fulfilled' && admRes.value) setAdmissions(admRes.value.slice(0, 4))
        if (resRes.status === 'fulfilled' && resRes.value) setResults(resRes.value.slice(0, 4))
        if (schRes.status === 'fulfilled' && schRes.value) setScholarships(schRes.value.slice(0, 4))
        if (intRes.status === 'fulfilled' && intRes.value) setInternships(intRes.value.slice(0, 4))
      })
    }

    const triggerBelowFold = () => {
      if (timerHandle) clearTimeout(timerHandle)
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', triggerBelowFold)
        window.removeEventListener('touchstart', triggerBelowFold)
      }
      loadBelowFold()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', triggerBelowFold, { once: true, passive: true })
      window.addEventListener('touchstart', triggerBelowFold, { once: true, passive: true })
      timerHandle = setTimeout(triggerBelowFold, 8000)
    }

    return () => {
      isMounted = false
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', triggerBelowFold)
        window.removeEventListener('touchstart', triggerBelowFold)
      }
      if (timerHandle) {
        clearTimeout(timerHandle)
      }
    }
  }, [])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`)
    }
  }

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="border-b border-line bg-gradient-to-b from-white via-paper to-white py-12 sm:py-16">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 border border-green/30 bg-green-light px-3.5 py-1 text-xs font-sans font-semibold text-green mb-4 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green"></span>
              Verified Pakistan Career &amp; Education News • Updated Daily
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight mb-4">
              <span className="text-green block sm:inline">CareerDost: </span>Pakistan Jobs, Scholarships &amp; Government Schemes
            </h1>

            <p className="font-sans text-sm sm:text-base text-inksoft leading-relaxed mb-8 max-w-2xl mx-auto">
              Real-time verified notifications for federal &amp; provincial government vacancies, Sindh government schemes (Benazir Hari Card &amp; subsidies), BISP 8171 updates, bank recruitment, scholarships, university admissions, and merit results.
            </p>

            {/* Prominent Hero Search Field */}
            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row items-center border-2 border-green bg-white shadow-sm rounded-xs overflow-hidden">
                <div className="flex-1 w-full flex items-center px-4 py-2.5">
                  <span className="text-xl text-inksoft mr-2.5">🔍</span>
                  <input
                    type="search"
                    id="home-search-input"
                    name="q"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search by job title, department, university, test name, or city..."
                    className="w-full text-sm font-sans text-ink placeholder:text-inksoft/70 focus:outline-hidden bg-transparent"
                    aria-label="Search opportunities"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green text-white font-sans text-sm font-bold px-8 py-3.5 hover:bg-green-dark transition-colors whitespace-nowrap"
                >
                  Search Portal
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 font-sans text-xs text-inksoft">
              <span className="font-semibold text-ink">Popular Categories:</span>
              <Link to="/category/government-jobs" className="hover:text-green underline">FPSC &amp; PPSC</Link>
              <span>•</span>
              <Link to="/category/admissions" className="hover:text-green underline">Spring &amp; Fall Admissions</Link>
              <span>•</span>
              <Link to="/category/results" className="hover:text-green underline">Merit Lists &amp; NTS</Link>
              <span>•</span>
              <Link to="/category/scholarships" className="hover:text-green underline">HEC Scholarships</Link>
              <span>•</span>
              <Link to="/category/guides-and-resources" className="hover:text-green underline font-semibold text-green">Guides &amp; Checklists</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK CATEGORY NAVIGATION */}
      <section className="container-x">
        <div className="text-center mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">Explore Opportunities by Category</h2>
          <p className="text-xs font-sans text-inksoft mt-1">Direct access to verified career and educational streams across Pakistan</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="border border-line bg-white p-4 rounded-xs hover:border-green hover:shadow-xs transition-all group flex items-start gap-3"
            >
              <span className="text-2xl p-2 bg-paper group-hover:bg-green-light rounded-xs transition-colors shrink-0">
                {cat.icon}
              </span>
              <div className="overflow-hidden">
                <span className="font-serif font-bold text-sm text-ink group-hover:text-green transition-colors block truncate">
                  {cat.label}
                </span>
                <span className="text-[11px] font-sans text-inksoft line-clamp-1 mt-0.5">
                  {cat.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3, 4, 5: MAIN FEED SECTIONS */}
      {feedReady && (
        <>
          {/* 3. LATEST UPDATES (TODAY'S BULLETINS) */}
          <section className="container-x">
            <div className="border border-line bg-white p-6 sm:p-8 rounded-xs shadow-xs">
              <SectionHeader
                tag="🔴 Real-Time Feed"
                title="Latest Updates &amp; Announcements"
                subtitle="Same-day verified alerts, testing notices, roll number slips, and urgent recruitment deadlines"
                linkTo="/daily-updates"
                linkText="View All Updates →"
              />

              {loading ? (
                <LoadingGrid count={6} cols="grid sm:grid-cols-2 lg:grid-cols-3" />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dailyUpdates.slice(0, 6).map((item) => (
                    <UpdateCard key={item.slug} updateItem={item} priority={false} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 4. WHATSAPP CHANNEL PROMOTIONAL CTA */}
          <section className="container-x">
            <WhatsAppCTA variant="banner" className="my-0" />
          </section>

          {/* 5. GOVERNMENT JOBS */}
          <section className="container-x">
            <SectionHeader
              tag="🏛️ Public Sector"
              title="Government Jobs"
              subtitle="Federal &amp; provincial departments, armed forces, autonomous authorities, and public health recruitment"
              linkTo="/category/government-jobs"
              linkText="All Government Jobs →"
            />

            {loading ? (
              <LoadingGrid count={4} />
            ) : govJobs.length === 0 ? (
              <p className="text-sm font-sans text-inksoft text-center py-8">No government vacancies listed currently.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {govJobs.map((item) => (
                  <OpportunityCard key={item.slug} opportunity={item} priority={false} />
                ))}
              </div>
            )}
          </section>

          {/* 5B. CAREERDOST GUIDES, CHECKLISTS & READINESS TOOLS */}
          <section className="container-x">
            <div className="border border-green/25 bg-white p-6 sm:p-8 rounded-xs shadow-xs">
              <SectionHeader
                tag="🧭 Original Applicant Resources"
                title="CareerDost Guides, Checklists &amp; Tools"
                subtitle="Practical preparation guides, document attestation checklists, and interactive application readiness tools for Pakistani candidates"
                linkTo="/category/guides-and-resources"
                linkText="All Guides &amp; Resources →"
              />

              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  to="/jobs/njp-application-rejection-12-common-mistakes-avoid"
                  className="border border-line bg-paper/50 hover:bg-white hover:border-green p-5 rounded-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-green mb-2">
                      Portal Application Guide
                    </span>
                    <h3 className="font-serif text-lg font-bold text-ink group-hover:text-green transition-colors mb-2 leading-snug">
                      NJP Application Rejection: 12 Common Mistakes Pakistani Job Applicants Should Avoid
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      Distinguish documented NJP portal rules from common CNIC, domicile, transcript date, experience, and age-limit mistakes before submitting.
                    </p>
                  </div>
                  <span className="mt-4 pt-3 border-t border-line/60 text-xs font-bold text-green">
                    Read NJP Mistakes Guide →
                  </span>
                </Link>

                <Link
                  to="/jobs/government-jobs-documents-checklist-pakistan-2026"
                  className="border border-line bg-paper/50 hover:bg-white hover:border-green p-5 rounded-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-green mb-2">
                      Printable Folder Guide
                    </span>
                    <h3 className="font-serif text-lg font-bold text-ink group-hover:text-green transition-colors mb-2 leading-snug">
                      Government Jobs Documents Checklist in Pakistan 2026
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      Complete reference table and printable checklist covering CNIC, Domicile/PRC, transcripts, HEC/IBCC attestation, NOC, and council licenses.
                    </p>
                  </div>
                  <span className="mt-4 pt-3 border-t border-line/60 text-xs font-bold text-green">
                    Open Printable Checklist →
                  </span>
                </Link>

                <Link
                  to="/tools/job-readiness-checker"
                  className="border-2 border-green/35 bg-green-light/40 hover:bg-green-light/70 p-5 rounded-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-green text-white px-2 py-0.5 rounded-xs mb-2">
                      Interactive Browser Tool
                    </span>
                    <h3 className="font-serif text-lg font-bold text-ink group-hover:text-green transition-colors mb-2 leading-snug">
                      Government Job Application Readiness Checker
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      Verify your 7 core application requirements—CNIC, domicile, degrees, experience, age limit, registration, and ad review—with zero personal data stored.
                    </p>
                  </div>
                  <span className="mt-4 pt-3 border-t border-green/20 text-xs font-bold text-green">
                    Launch Readiness Checker →
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* BELOW-THE-FOLD SECTIONS (Loaded on scroll or idle) */}
      {belowFoldLoaded && (
        <>
          {/* 6. PRIVATE & CORPORATE JOBS */}
          <section className="container-x">
            <SectionHeader
              tag="🏢 Private Sector"
              title="Private &amp; Corporate Jobs"
              subtitle="Verified vacancies in manufacturing, FMCG, banking, software engineering, and corporate conglomerates"
              linkTo="/category/private-jobs"
              linkText="All Private Jobs →"
            />

            {pvtJobs.length === 0 ? (
              <LoadingGrid count={4} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pvtJobs.map((item) => (
                  <OpportunityCard key={item.slug} opportunity={item} />
                ))}
              </div>
            )}
          </section>

          {/* 7. ADMISSIONS 2026–2027 */}
          <section className="container-x">
            <SectionHeader
              tag="🏫 Academic Intakes"
              title="University Admissions"
              subtitle="Spring &amp; Fall undergraduate, MBBS, BDS, PharmD, MS/MPhil, and PhD intake announcements across Pakistan"
              linkTo="/category/admissions"
              linkText="All Admissions →"
            />

            {admissions.length === 0 ? (
              <LoadingGrid count={4} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {admissions.map((item) => (
                  <OpportunityCard key={item.slug} opportunity={item} />
                ))}
              </div>
            )}
          </section>

          {/* 8. RESULTS & MERIT LISTS */}
          <section className="container-x">
            <SectionHeader
              tag="📊 Examination &amp; Merit Lists"
              title="Results &amp; Merit Lists"
              subtitle="Provisional university merit lists, NTS NAT &amp; GAT roll number slips, answer keys, and board gazettes"
              linkTo="/category/results"
              linkText="All Results →"
            />

            {results.length === 0 ? (
              <LoadingGrid count={4} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((item) => (
                  <OpportunityCard key={item.slug} opportunity={item} />
                ))}
              </div>
            )}
          </section>

          {/* 9. SCHOLARSHIPS */}
          <section className="container-x">
            <SectionHeader
              tag="📜 Educational Grants"
              title="Scholarships &amp; Financial Aid"
              subtitle="HEC indigenous, foreign bilateral, Commonwealth, Türkiye Burslari, and university welfare trust funds"
              linkTo="/category/scholarships"
              linkText="All Scholarships →"
            />

            {scholarships.length === 0 ? (
              <LoadingGrid count={4} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {scholarships.map((item) => (
                  <OpportunityCard key={item.slug} opportunity={item} />
                ))}
              </div>
            )}
          </section>

          {/* 10. INTERNSHIPS */}
          <section className="container-x">
            <SectionHeader
              tag="🎓 Student &amp; Graduate Trainee"
              title="Internships &amp; Apprenticeships"
              subtitle="Paid corporate traineeships, government research fellowships, and school teacher internship initiatives"
              linkTo="/category/internships"
              linkText="All Internships →"
            />

            {internships.length === 0 ? (
              <LoadingGrid count={4} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {internships.map((item) => (
                  <OpportunityCard key={item.slug} opportunity={item} />
                ))}
              </div>
            )}
          </section>

          {/* 11. CLOSING SOON (PRIORITY DEADLINES) */}
          <section className="container-x">
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-xs shadow-md">
              <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2 border-b border-white/15 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <span>⏰</span> Priority Deadlines
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Closing Soon</h2>
                  <p className="text-xs sm:text-sm font-sans text-slate-300 mt-0.5">High-priority vacancies and admissions with upcoming submission deadlines</p>
                </div>

                <Link
                  to="/category/government-jobs"
                  className="border border-amber-400 text-amber-300 hover:bg-amber-500 hover:text-slate-950 px-4 py-2 text-xs font-sans font-semibold rounded-xs transition-colors"
                >
                  Browse All Deadlines →
                </Link>
              </div>

              {closingSoon.length === 0 ? (
                <LoadingGrid count={6} cols="grid sm:grid-cols-2 lg:grid-cols-3" />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {closingSoon.slice(0, 6).map((item) => (
                    <OpportunityCard key={item.slug} opportunity={item} showDeadlineBadge={true} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
