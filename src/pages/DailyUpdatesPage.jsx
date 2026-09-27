import React, { useState, useEffect } from 'react'
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
  const [updates, setUpdates] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All Updates')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useSeo({
    title: 'Daily Updates & Job Notifications — CareerDost Pakistan',
    description: 'Latest daily career updates, government job announcements, test results, scholarship deadlines, and admission notices across Pakistan.',
    canonical: '/daily-updates',
  })

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const params = {}
    if (selectedCategory !== 'All Updates') {
      params.category = selectedCategory
    }
    if (searchQuery.trim()) {
      params.q = searchQuery.trim()
    }

    getDailyUpdatesFromDb(params)
      .then((data) => {
        if (isMounted) setUpdates(data || [])
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((item) => (
            <UpdateCard key={item.slug} updateItem={item} />
          ))}
        </div>
      )}
    </div>
  )
}
