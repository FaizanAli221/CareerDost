import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getDailyUpdatesFromDb } from '../api/client'
import UpdateCard from '../components/UpdateCard'
import WhatsAppCTA from '../components/WhatsAppCTA'
import { useSeo } from '../lib/useSeo'

const UPDATE_CATEGORIES = [
  'All Updates',
  'Latest Jobs',
  'Government Jobs',
  'Private Jobs',
  'Bank Jobs',
  'Internships',
  'Scholarships',
  'Admissions',
  'Results / Test Updates',
  'Deadline Alerts',
  'Career News',
]

export default function DailyUpdatesPage() {
  const initialUpdates =
    typeof window !== 'undefined' && Array.isArray(window.__INITIAL_UPDATES__) && window.__INITIAL_UPDATES__.length > 0
      ? window.__INITIAL_UPDATES__
      : []
  const [updates, setUpdates] = useState(initialUpdates)
  const [selectedCategory, setSelectedCategory] = useState('All Updates')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(initialUpdates.length === 0)
  const [visibleCount, setVisibleCount] = useState(24)

  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://careerdost.blog/daily-updates#webpage',
        url: 'https://careerdost.blog/daily-updates',
        name: 'Daily Updates & Job Notifications — CareerDost Pakistan',
        description: 'Latest daily career updates, government job announcements, test results, scholarship deadlines, and admission notices across Pakistan.',
        isPartOf: { '@id': 'https://careerdost.blog/#website' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://careerdost.blog/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Daily Updates',
            item: 'https://careerdost.blog/daily-updates',
          },
        ],
      },
    ],
  }), [])

  useSeo({
    title: 'Daily Updates & Job Notifications — CareerDost Pakistan',
    description: 'Latest daily career updates, government job announcements, test results, scholarship deadlines, and admission notices across Pakistan.',
    canonical: '/daily-updates',
    jsonLd,
  })

  useEffect(() => {
    let isMounted = true
    const isDefaultFilter = selectedCategory === 'All Updates' && !searchQuery.trim()

    if (!isDefaultFilter || updates.length === 0) {
      setLoading(true)
    }

    const params = {}
    if (selectedCategory !== 'All Updates') {
      params.category = selectedCategory
    }
    if (searchQuery.trim()) {
      params.q = searchQuery.trim()
    }

    getDailyUpdatesFromDb(params)
      .then((data) => {
        if (!isMounted || !Array.isArray(data)) return
        if (data.length > 0 || !isDefaultFilter) {
          setUpdates(data)
        }
      })
      .catch((err) => {
        console.warn('Failed to load updates:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedCategory, searchQuery])

  return (
    <div className="container-x py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-inksoft mb-4 flex items-center gap-1.5">
        <Link to="/" className="hover:text-green">Home</Link>
        <span>/</span>
        <span className="text-ink font-semibold">Daily Updates</span>
      </nav>

      {/* Header Banner */}
      <div className="border border-line bg-white p-6 sm:p-8 mb-8 rounded-xs shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-green/30 bg-green-light px-3 py-1 text-xs font-sans font-semibold text-green mb-3">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
            Live Pakistan Career Feed
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
            Daily Updates &amp; Opportunity Alerts
          </h1>

          <p className="font-sans text-sm sm:text-base text-inksoft leading-relaxed">
            Real-time updates on verified Pakistan recruitment drives, government job gazettes, university admissions, scholarship deadlines, and testing agency announcements.
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-6 max-w-xl">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search daily updates by title, department, or keyword…"
              className="w-full border border-line bg-paper px-4 py-2.5 text-sm font-sans text-ink focus:border-green focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-inksoft hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp CTA Banner */}
      <WhatsAppCTA variant="banner" className="my-6" />

      {/* Category Pills Filter */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {UPDATE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-sans font-semibold rounded-xs transition-colors ${
                  active
                    ? 'bg-green text-white shadow-xs'
                    : 'border border-line bg-white text-ink hover:bg-paper hover:border-green'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Updates Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-line bg-white h-72 animate-pulse p-4">
              <div className="aspect-[16/9] bg-line/40 rounded mb-4"></div>
              <div className="h-4 bg-line/60 w-3/4 rounded mb-2"></div>
              <div className="h-3 bg-line/30 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : updates.length === 0 ? (
        <div className="border border-line bg-white p-12 text-center font-sans">
          <div className="text-4xl mb-3">📰</div>
          <h3 className="font-serif text-xl font-bold text-ink mb-1">No Daily Updates Found</h3>
          <p className="text-xs text-inksoft max-w-md mx-auto mb-4">
            {searchQuery || selectedCategory !== 'All Updates'
              ? 'Try selecting a different category or clearing your search term.'
              : 'Daily updates will appear here once published by the CareerDost team.'}
          </p>
          {(searchQuery || selectedCategory !== 'All Updates') && (
            <button
              onClick={() => {
                setSelectedCategory('All Updates')
                setSearchQuery('')
              }}
              className="border border-green text-green px-4 py-2 text-xs font-semibold hover:bg-green hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.slice(0, visibleCount).map((item, idx) => (
              <UpdateCard key={item.slug} updateItem={item} priority={idx < 2} />
            ))}
          </div>
          {updates.length > visibleCount && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="inline-flex items-center gap-2 border border-green text-green hover:bg-green hover:text-white px-6 py-2.5 text-xs font-sans font-semibold rounded-xs transition-colors shadow-xs"
              >
                <span>Load More Updates</span>
                <span className="bg-green/10 text-green group-hover:bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                  {updates.length - visibleCount} more
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
