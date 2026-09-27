import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getCategoriesFromDb,
  getFeaturedListingsFromDb,
  getLatestListingsFromDb,
  getLatestDailyUpdatesFromDb,
  getClosingSoonOpportunitiesFromDb,
  getArticlesByCategoryFromDb,
} from '../api/client'
import FeaturedCard from '../components/FeaturedCard'
import ListingRow from '../components/ListingRow'
import UpdateCard from '../components/UpdateCard'
import OpportunityCard from '../components/OpportunityCard'
import WhatsAppCTA from '../components/WhatsAppCTA'
import { useSeo } from '../lib/useSeo'

const QUICK_CATEGORIES = [
  { label: 'Government Jobs', path: '/category/government-jobs', icon: '🏛️', count: 'FPSC, PPSC, NTS' },
  { label: 'Private Jobs', path: '/category/private-jobs', icon: '🏢', count: 'Corporate & MNCs' },
  { label: 'Bank Jobs', path: '/category/bank-jobs', icon: '🏦', count: 'SBP, HBL, Meezan' },
  { label: 'IT & Tech Jobs', path: '/category/it-jobs', icon: '💻', count: 'Software & Remote' },
  { label: 'Scholarships', path: '/category/scholarships', icon: '📜', count: 'HEC, Fully Funded' },
  { label: 'Internships', path: '/category/internships', icon: '🎓', count: 'Fresh Graduates' },
  { label: 'Admissions', path: '/category/admissions', icon: '🏫', count: 'Universities 2026' },
  { label: 'Career Guides', path: '/category/career-guides', icon: '📘', count: 'CV & Interview Tips' },
]

export default function Home() {
  const [heroSearch, setHeroSearch] = useState('')
  const [dailyUpdates, setDailyUpdates] = useState([])
  const [trending, setTrending] = useState([])
  const [closingSoon, setClosingSoon] = useState([])
  const [latestJobs, setLatestJobs] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [internships, setInternships] = useState([])
  const [careerGuides, setCareerGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useSeo({
    title: "CareerDost — Pakistan's Daily Career & Opportunity Hub",
    description: "Discover verified government jobs, private vacancies, bank jobs, scholarships, internships, admissions and career updates across Pakistan.",
    canonical: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CareerDost',
      url: 'https://careerdost.pk',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://careerdost.pk/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  })

  useEffect(() => {
    let isMounted = true

    Promise.all([
      getLatestDailyUpdatesFromDb(6),
      getFeaturedListingsFromDb(4),
      getClosingSoonOpportunitiesFromDb(6),
      getLatestListingsFromDb(6),
      getArticlesByCategoryFromDb('scholarships'),
      getArticlesByCategoryFromDb('internships'),
      getArticlesByCategoryFromDb('career-guides'),
    ])
      .then(([updatesData, trendingData, closingData, latestData, scholData, internData, guideData]) => {
        if (!isMounted) return
        if (updatesData) setDailyUpdates(updatesData)
        if (trendingData) setTrending(trendingData)
        if (closingData) setClosingSoon(closingData)
        if (latestData) setLatestJobs(latestData)
        if (scholData) setScholarships(scholData.slice(0, 3))
        if (internData) setInternships(internData.slice(0, 3))
        if (guideData) setCareerGuides(guideData.slice(0, 3))
      })
      .catch((err) => {
        console.warn('Home page load warning:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`)
    }
  }

  return (
    <div className="space-y-12 pb-16">
      {/* A. HERO SECTION */}
      <section className="border-b border-line bg-gradient-to-b from-white via-paper to-white py-12 sm:py-16">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 border border-green/30 bg-green-light px-3.5 py-1 text-xs font-sans font-semibold text-green mb-4 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
              Live Pakistan Opportunities Portal • Updated Daily
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight mb-4">
              Pakistan&rsquo;s Daily Career &amp; Opportunity Hub
            </h1>

            <p className="font-sans text-base sm:text-lg text-inksoft leading-relaxed mb-8 max-w-2xl mx-auto">
              Discover verified federal &amp; provincial government jobs, bank openings, private vacancies, fully funded scholarships, internships, and university admissions.
            </p>

            {/* Prominent Hero Search Field */}
            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row items-center border-2 border-green bg-white shadow-md rounded-xs overflow-hidden">
                <div className="flex-1 w-full flex items-center px-4 py-2">
                  <span className="text-xl text-inksoft mr-2">🔍</span>
                  <input
                    type="search"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search jobs, scholarships, internships..."
                    className="w-full text-sm font-sans text-ink placeholder:text-inksoft/70 focus:outline-hidden bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green text-white font-sans text-sm font-bold px-8 py-3.5 hover:bg-green-dark transition-colors whitespace-nowrap"
                >
                  Search Opportunities
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 font-sans text-xs text-inksoft">
              <span className="font-semibold text-ink">Popular Searches:</span>
              <Link to="/category/government-jobs" className="hover:text-green underline">FPSC Jobs</Link>
              <span>•</span>
              <Link to="/category/bank-jobs" className="hover:text-green underline">Bank MTO Programs</Link>
              <span>•</span>
              <Link to="/category/scholarships" className="hover:text-green underline">HEC Scholarships</Link>
              <span>•</span>
              <Link to="/category/internships" className="hover:text-green underline">Summer Internships</Link>
            </div>
          </div>
        </div>
      </section>

      {/* B. QUICK CATEGORY NAVIGATION */}
      <section className="container-x">
        <div className="text-center mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">Explore Opportunities by Category</h2>
          <p className="text-xs font-sans text-inksoft mt-1">Direct access to targeted career listings across Pakistan</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="border border-line bg-white p-4 rounded-xs hover:border-green hover:shadow-xs transition-all group flex items-center gap-3"
            >
              <span className="text-2xl sm:text-3xl p-2 bg-paper group-hover:bg-green-light rounded-xs transition-colors shrink-0">
                {cat.icon}
              </span>
              <div className="overflow-hidden">
                <span className="font-serif font-bold text-sm text-ink group-hover:text-green transition-colors block truncate">
                  {cat.label}
                </span>
                <span className="text-[11px] font-sans text-inksoft truncate block">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* C. TODAY'S UPDATES */}
      <section className="container-x">
        <div className="border border-line bg-white p-6 sm:p-8 rounded-xs shadow-xs">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2 border-b border-line pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-red-600 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Fresh Daily Feed
              </div>
              <h2 className="font-serif text-2xl text-ink font-bold">Today&rsquo;s Updates</h2>
              <p className="text-xs font-sans text-inksoft mt-0.5">Real-time alerts, quick announcements and testing notices</p>
            </div>

            <Link
              to="/daily-updates"
              className="border border-green text-green hover:bg-green hover:text-white px-4 py-2 text-xs font-sans font-semibold rounded-xs transition-colors"
            >
              View All Updates →
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-line bg-white h-64 animate-pulse p-4">
                  <div className="aspect-[16/9] bg-line/40 rounded mb-4"></div>
                  <div className="h-4 bg-line/60 w-3/4 rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyUpdates.slice(0, 6).map((item) => (
                <UpdateCard key={item.slug} updateItem={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHATSAPP CHANNEL PROMOTIONAL CTA BANNER */}
      <section className="container-x">
        <WhatsAppCTA variant="banner" className="my-0" />
      </section>

      {/* E. CLOSING SOON (DYNAMIC COUNTDOWN) */}
      <section className="container-x">
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-xs shadow-md">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2 border-b border-white/15 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-amber-400 uppercase tracking-wider mb-1">
                <span>⏰</span> Priority Deadlines
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">Closing Soon</h2>
              <p className="text-xs font-sans text-slate-300 mt-0.5">High-priority positions with upcoming application deadlines</p>
            </div>

            <Link
              to="/category/government-jobs"
              className="border border-amber-400 text-amber-300 hover:bg-amber-500 hover:text-slate-950 px-4 py-2 text-xs font-sans font-semibold rounded-xs transition-colors"
            >
              Browse All Deadlines →
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-white/10 bg-slate-800 h-64 animate-pulse p-4">
                  <div className="aspect-[16/9] bg-slate-700 rounded mb-4"></div>
                </div>
              ))}
            </div>
          ) : closingSoon.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No immediate closing deadlines available.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {closingSoon.slice(0, 6).map((item) => (
                <OpportunityCard key={item.slug} opportunity={item} showDeadlineBadge={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* D. TRENDING OPPORTUNITIES */}
      <section className="container-x">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
          <div>
            <div className="text-xs font-sans font-bold text-green uppercase tracking-wider mb-1">
              ⭐ Featured Recruitment Drives
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink">Trending Opportunities</h2>
            <p className="text-xs font-sans text-inksoft mt-0.5">Top-rated vacancies and nationwide career admissions</p>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-line bg-white p-5 h-40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {trending.map((l) => (
              <FeaturedCard key={l.slug} listing={l} />
            ))}
          </div>
        )}
      </section>

      {/* F. LATEST JOBS & MAIN FEED */}
      <section className="container-x">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <div>
            <div className="flex items-baseline justify-between mb-4 border-b border-line pb-2">
              <h2 className="font-serif text-2xl text-ink font-bold">Latest Vacancies &amp; Job Posts</h2>
              <Link to="/category/government-jobs" className="text-xs font-sans font-semibold text-green hover:underline">
                View All Categories →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-4 border-b border-line animate-pulse">
                    <div className="h-5 bg-line/60 w-2/3 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-line border-t border-b border-line">
                {latestJobs.map((l) => (
                  <ListingRow key={l.slug} listing={l} />
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            <div className="border border-line bg-white p-5 rounded-xs">
              <h3 className="font-serif text-lg text-ink font-bold mb-3 border-b border-line pb-2">
                Browse by Category
              </h3>
              <ul className="space-y-1 font-sans text-sm">
                {QUICK_CATEGORIES.map((c) => (
                  <li key={c.path}>
                    <Link
                      to={c.path}
                      className="flex items-center justify-between px-3 py-2 text-ink hover:text-green hover:bg-paper rounded-xs transition-colors"
                    >
                      <span className="flex items-center gap-2 font-medium text-xs">
                        <span>{c.icon}</span>
                        <span>{c.label}</span>
                      </span>
                      <span className="text-xs text-inksoft">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why CareerDost */}
            <div className="border border-line bg-paper p-5 font-sans rounded-xs">
              <h3 className="font-serif text-lg text-ink font-bold mb-3 border-b border-line pb-2">
                Why Trust CareerDost?
              </h3>
              <ul className="space-y-3 text-xs text-inksoft leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-green font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-ink block">Official Sources Only</strong>
                    Verified directly against FPSC, PPSC, NTS, and official department gazettes.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-ink block">Daily Fresh Updates</strong>
                    Listings checked and posted same-day so you never miss a deadline.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-ink block">Structured Application Data</strong>
                    Clear qualifications, closing dates, and official application URLs.
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* G. SCHOLARSHIPS & INTERNSHIPS SECTIONS */}
      <section className="container-x">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scholarships */}
          <div className="border border-line bg-white p-6 rounded-xs">
            <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink">Scholarships 2026</h3>
                  <span className="text-xs text-inksoft font-sans">Fully funded &amp; partial study schemes</span>
                </div>
              </div>
              <Link to="/category/scholarships" className="text-xs font-sans font-semibold text-green hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {scholarships.map((s) => (
                <div key={s.slug} className="p-3 bg-paper rounded-xs border border-line/60 hover:border-green transition-colors">
                  <div className="text-[11px] font-sans text-green font-semibold mb-1">{s.organization}</div>
                  <h4 className="font-serif font-bold text-sm text-ink mb-1">
                    <Link to={`/jobs/${s.slug}`}>{s.title}</Link>
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-sans text-inksoft mt-2">
                    <span>Deadline: {s.lastDate || 'N/A'}</span>
                    <Link to={`/jobs/${s.slug}`} className="text-green font-semibold hover:underline">
                      Apply Info →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internships */}
          <div className="border border-line bg-white p-6 rounded-xs">
            <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink">Internships 2026</h3>
                  <span className="text-xs text-inksoft font-sans">For students &amp; fresh graduates</span>
                </div>
              </div>
              <Link to="/category/internships" className="text-xs font-sans font-semibold text-green hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {internships.map((i) => (
                <div key={i.slug} className="p-3 bg-paper rounded-xs border border-line/60 hover:border-green transition-colors">
                  <div className="text-[11px] font-sans text-green font-semibold mb-1">{i.organization}</div>
                  <h4 className="font-serif font-bold text-sm text-ink mb-1">
                    <Link to={`/jobs/${i.slug}`}>{i.title}</Link>
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-sans text-inksoft mt-2">
                    <span>Deadline: {i.lastDate || 'N/A'}</span>
                    <Link to={`/jobs/${i.slug}`} className="text-green font-semibold hover:underline">
                      Apply Info →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* H. CAREER GUIDES */}
      <section className="container-x">
        <div className="border border-line bg-gradient-to-r from-paper to-white p-6 sm:p-8 rounded-xs">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2 border-b border-line pb-4">
            <div>
              <div className="text-xs font-sans font-bold text-green uppercase tracking-wider mb-1">
                📘 Educational Articles
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">Career Guides &amp; Tips</h2>
              <p className="text-xs font-sans text-inksoft mt-0.5">CV guidance, interview preparation, and job application strategies</p>
            </div>

            <Link
              to="/category/career-guides"
              className="border border-green text-green hover:bg-green hover:text-white px-4 py-2 text-xs font-sans font-semibold rounded-xs transition-colors"
            >
              Explore All Guides →
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {careerGuides.length > 0 ? (
              careerGuides.map((guide) => (
                <div key={guide.slug} className="bg-white border border-line p-5 rounded-xs hover:border-green transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-sans font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full mb-3 inline-block">
                      Career Guide
                    </span>
                    <h3 className="font-serif font-bold text-base text-ink mb-2">
                      <Link to={`/jobs/${guide.slug}`}>{guide.title}</Link>
                    </h3>
                    <p className="font-sans text-xs text-inksoft leading-relaxed line-clamp-3 mb-4">
                      {guide.excerpt}
                    </p>
                  </div>
                  <Link to={`/jobs/${guide.slug}`} className="text-xs font-sans font-semibold text-green hover:underline">
                    Read Guide →
                  </Link>
                </div>
              ))
            ) : (
              [
                {
                  slug: 'how-to-build-a-professional-cv-in-pakistan',
                  title: 'How to Build a Professional CV for Pakistani Job Market',
                  excerpt: 'Step-by-step guide to writing a high-impact CV tailored for FPSC, PPSC, corporate companies, and bank recruitment.',
                },
                {
                  slug: 'top-interview-preparation-tips-fresh-graduates',
                  title: 'Top 10 Interview Preparation Tips for Fresh Graduates',
                  excerpt: 'Essential advice on answering common interview questions, dressing professionally, and showcasing academic projects.',
                },
                {
                  slug: 'complete-guide-to-fpsc-and-ppsc-online-applications',
                  title: 'Complete Guide to FPSC & PPSC Online Application Process',
                  excerpt: 'Avoid common application rejection errors when applying for federal and provincial government job advertisements.',
                },
              ].map((g) => (
                <div key={g.slug} className="bg-white border border-line p-5 rounded-xs hover:border-green transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-sans font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full mb-3 inline-block">
                      Career Guide
                    </span>
                    <h3 className="font-serif font-bold text-base text-ink mb-2">{g.title}</h3>
                    <p className="font-sans text-xs text-inksoft leading-relaxed line-clamp-3 mb-4">{g.excerpt}</p>
                  </div>
                  <span className="text-xs font-sans font-semibold text-green">Read Guide →</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
