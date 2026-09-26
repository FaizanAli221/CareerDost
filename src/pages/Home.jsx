import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categories as defaultCategories } from '../data/categories'
import { getFeaturedListings as defaultFeatured, getLatestListings as defaultLatest } from '../data/listings'
import { getCategoriesFromDb, getFeaturedListingsFromDb, getLatestListingsFromDb } from '../api/client'
import FeaturedCard from '../components/FeaturedCard'
import ListingRow from '../components/ListingRow'
import { useSeo } from '../lib/useSeo'

export default function Home() {
  const [featured, setFeatured] = useState(() => defaultFeatured().slice(0, 4))
  const [latest, setLatest] = useState(() => defaultLatest(10))
  const [categoriesList, setCategoriesList] = useState(() => defaultCategories)

  useSeo({
    title: 'CareerDost — Pakistan Jobs, Scholarships & Admissions 2026',
    description: 'Find verified government jobs, private openings, bank vacancies, IT roles, scholarships, internships and admissions across Pakistan. Daily updates from official sources.',
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

    getFeaturedListingsFromDb(4).then((data) => {
      if (isMounted && data && data.length > 0) setFeatured(data)
    })

    getLatestListingsFromDb(10).then((data) => {
      if (isMounted && data && data.length > 0) setLatest(data)
    })

    getCategoriesFromDb().then((data) => {
      if (isMounted && data && data.length > 0) setCategoriesList(data)
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-line bg-gradient-to-b from-white to-paper py-12 sm:py-16">
        <div className="container-x">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-green/30 bg-green-light px-3 py-1 text-xs font-sans font-semibold text-green mb-4">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
              Updated {new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight mb-4">
              Find Your Next Career Opportunity
            </h1>

            <p className="font-sans text-base sm:text-lg text-inksoft leading-relaxed mb-8 max-w-2xl">
              Pakistan&rsquo;s trusted portal for federal &amp; provincial government jobs, bank jobs, private vacancies, scholarships, internships, schemes and university admissions — verified daily against official sources.
            </p>

            <div className="flex flex-wrap items-center gap-3 font-sans text-sm">
              <Link
                to="/category/government-jobs"
                className="border border-green bg-green text-white px-6 py-3 font-medium hover:bg-green-dark transition-colors shadow-xs"
              >
                Browse Latest Jobs →
              </Link>
              <Link
                to="/category/scholarships"
                className="border border-line bg-white text-ink px-6 py-3 font-medium hover:bg-paper hover:border-green transition-colors"
              >
                Explore Scholarships
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container-x py-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-ink font-semibold">Featured Opportunities</h2>
            <p className="text-xs font-sans text-inksoft mt-1">High-priority positions and major recruitment drives closing soon</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {featured.map((l) => (
            <FeaturedCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="container-x pb-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10">
          {/* Latest Listings */}
          <div>
            <div className="flex items-baseline justify-between mb-4 border-b border-line pb-2">
              <h2 className="font-serif text-2xl text-ink font-semibold">Latest Listings</h2>
              <Link to="/category/government-jobs" className="text-xs font-sans font-medium text-green hover:underline">
                View All Categories →
              </Link>
            </div>
            <div className="divide-y divide-line">
              {latest.map((l) => (
                <ListingRow key={l.slug} listing={l} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Category Navigation */}
            <div className="border border-line bg-white p-5">
              <h3 className="font-serif text-lg text-ink font-semibold mb-3 border-b border-line pb-2">
                Browse by Category
              </h3>
              <ul className="space-y-1 font-sans text-sm">
                {categoriesList.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/category/${c.slug}`}
                      className="flex items-center justify-between px-3 py-2 text-ink hover:text-green hover:bg-paper rounded-xs transition-colors"
                    >
                      <span>{c.label}</span>
                      <span className="text-xs text-inksoft">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why CareerDost Section (Requirement 11) */}
            <div className="border border-line bg-paper p-5 font-sans">
              <h3 className="font-serif text-lg text-ink font-semibold mb-3 border-b border-line pb-2">
                Why CareerDost?
              </h3>
              <ul className="space-y-3 text-xs text-inksoft leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-green font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-ink block">Official-Source Based</strong>
                    Every listing is verified against official notifications from FPSC, PPSC, NTS, and official department gazettes.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-ink block">Daily Regular Updates</strong>
                    Fresh listings checked and posted same-day so you never miss application deadlines.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-ink block">Easy &amp; Organised Access</strong>
                    Filter by category, qualification, location, and closing date in seconds.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-ink block">Mobile-Friendly Design</strong>
                    Lightweight and optimized for fast browsing on all mobile and desktop devices.
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
