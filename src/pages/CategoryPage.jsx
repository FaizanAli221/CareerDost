import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { categoryBySlug as defaultCategoryBySlug, categories as defaultCategories } from '../data/categories'
import { getCategoryBySlugFromDb, getCategoriesFromDb } from '../api/client'
import ListingRow from '../components/ListingRow'
import OpportunityCard from '../components/OpportunityCard'
import { useSeo } from '../lib/useSeo'
import { getAbsoluteUrl } from '../lib/config'
import { getPktTodayYMD, normalizeDateToYMD } from '../lib/contentType'

export default function CategoryPage() {
  const { slug } = useParams()
  const [sort, setSort] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const [categoriesList, setCategoriesList] = useState(() => defaultCategories)
  const [cat, setCat] = useState(() => defaultCategoryBySlug(slug) || null)
  const [items, setItems] = useState(() => {
    if (typeof window !== 'undefined' && Array.isArray(window.__INITIAL_CATEGORY_ARTICLES__) && window.__INITIAL_CATEGORY_SLUG__ === slug) {
      const preloaded = window.__INITIAL_CATEGORY_ARTICLES__
      delete window.__INITIAL_CATEGORY_ARTICLES__
      delete window.__INITIAL_CATEGORY_SLUG__
      return preloaded
    }
    return []
  })
  const [loading, setLoading] = useState(() => {
    return items.length === 0
  })
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true
    if (!items.length) {
      setLoading(true)
    }
    setNotFound(false)

    getCategoriesFromDb().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        setCategoriesList(cats)
      }
    })

    getCategoryBySlugFromDb(slug)
      .then(async (res) => {
        if (!isMounted) return
        if (res && res.category) {
          setCat(res.category)
          setItems(res.articles || [])
          setNotFound(false)
        } else {
          const fallbackCat = defaultCategoryBySlug(slug)
          if (fallbackCat) {
            setCat(fallbackCat)
            try {
              const mod = await import('../data/listings')
              setItems(mod.getListingsByCategory(slug))
            } catch {
              setItems([])
            }
            setNotFound(false)
          } else {
            setCat(null)
            setItems([])
            setNotFound(true)
          }
        }
      })
      .catch(async (err) => {
        console.warn('Error fetching category:', err)
        if (!isMounted) return
        const fallbackCat = defaultCategoryBySlug(slug)
        if (fallbackCat) {
          setCat(fallbackCat)
          try {
            const mod = await import('../data/listings')
            setItems(mod.getListingsByCategory(slug))
          } catch {
            setItems([])
          }
          setNotFound(false)
        } else {
          setCat(null)
          setItems([])
          setNotFound(true)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  const breadcrumbSchema = useMemo(() => {
    if (!cat) return null
    return {
      '@context': 'https://schema.org',
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
          name: cat.label,
          item: getAbsoluteUrl(`/category/${slug}`),
        },
      ],
    }
  }, [cat, slug])

  useSeo({
    title: cat ? `${cat.label} in Pakistan 2026 — CareerDost` : 'Category — CareerDost',
    description: cat ? cat.description : 'Browse the latest verified jobs, admissions, and scholarships on CareerDost.',
    canonical: `/category/${slug}`,
    jsonLd: breadcrumbSchema,
  })

  if (loading) {
    return (
      <div className="container-x py-12 font-sans">
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-4 bg-line/60 w-1/4 rounded"></div>
          <div className="h-8 bg-line/60 w-1/2 rounded"></div>
          <div className="h-4 bg-line/60 w-3/4 rounded"></div>
          <div className="h-32 bg-line/30 rounded mt-6"></div>
        </div>
      </div>
    )
  }

  if (notFound || !cat) {
    return (
      <div className="container-x py-16 font-sans text-center max-w-lg">
        <div className="text-4xl mb-3">📁</div>
        <h1 className="font-serif text-2xl font-bold text-ink mb-2">Category Not Found</h1>
        <p className="text-sm text-inksoft mb-6 leading-relaxed">
          The category &ldquo;{slug}&rdquo; does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-block border border-green bg-green text-white px-6 py-2.5 text-sm font-semibold hover:bg-green-dark transition-colors"
        >
          ← Return to Home
        </Link>
      </div>
    )
  }

  const todayStr = getPktTodayYMD()
  const isItemExpired = (item) => {
    const d = item.lastDate || item.last_date
    const ymd = normalizeDateToYMD(d)
    if (ymd && ymd < todayStr) return true
    if (d && /closed|expired/i.test(String(d))) return true
    return false
  }

  let sortedItems = [...items]
  if (sort === 'deadline') {
    sortedItems.sort((a, b) => {
      const expA = isItemExpired(a) ? 1 : 0
      const expB = isItemExpired(b) ? 1 : 0
      if (expA !== expB) return expA - expB
      return new Date(a.lastDate || a.last_date || '9999-12-31') - new Date(b.lastDate || b.last_date || '9999-12-31')
    })
  } else {
    // Active first, then newest publish date
    sortedItems.sort((a, b) => {
      const expA = isItemExpired(a) ? 1 : 0
      const expB = isItemExpired(b) ? 1 : 0
      if (expA !== expB) return expA - expB
      return new Date(b.publishDate || b.publish_date || 0) - new Date(a.publishDate || a.publish_date || 0)
    })
  }

  return (
    <div className="container-x py-8">
      <nav className="text-xs font-sans text-inksoft mb-3">
        <Link to="/" className="hover:text-green">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{cat.label}</span>
      </nav>

      <h1 className="font-serif text-2xl sm:text-3xl text-ink mb-2">{cat.label} in Pakistan</h1>
      {cat.description && <p className="font-sans text-inksoft max-w-2xl mb-6">{cat.description}</p>}

      {(slug === 'guides-and-resources' || slug === 'career-guides') && (
        <div className="border border-green/30 bg-green-light/40 p-4 sm:p-5 rounded-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-green block mb-0.5">
              Interactive Utility
            </span>
            <strong className="font-serif text-base sm:text-lg text-ink block">
              Government Job Application Readiness Checker
            </strong>
            <p className="text-xs text-inksoft mt-0.5">
              Check your CNIC, domicile, academic transcripts, age limit, and portal readiness before submitting an application.
            </p>
          </div>
          <Link
            to="/tools/job-readiness-checker"
            className="bg-green hover:bg-green-dark text-white px-4 py-2.5 text-xs font-bold rounded-xs transition-colors shrink-0 self-start sm:self-auto"
          >
            Open Readiness Checker →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6 font-sans text-sm">
        {categoriesList.map((c) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            className={`px-3 py-1.5 border ${
              c.slug === slug ? 'border-green bg-green text-white font-medium' : 'border-line text-ink hover:border-green'
            }`}
          >
            {c.short || c.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-line pb-3 mb-6 flex-wrap gap-3">
        <span className="font-sans text-xs text-inksoft font-semibold">{sortedItems.length} verified listing{sortedItems.length === 1 ? '' : 's'}</span>
        
        <div className="flex items-center gap-4 font-sans text-xs">
          <div className="flex items-center border border-line rounded-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-green text-white' : 'bg-paper text-ink hover:bg-white'
              }`}
            >
              ▦ Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-green text-white' : 'bg-paper text-ink hover:bg-white'
              }`}
            >
              ☰ List
            </button>
          </div>

          <div className="flex items-center">
            <label htmlFor="sort" className="text-inksoft mr-1.5 font-medium">Sort:</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-line bg-white px-2 py-1 text-xs"
            >
              <option value="newest">Newest first</option>
              <option value="deadline">Closing soon</option>
            </select>
          </div>
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <p className="font-sans text-inksoft py-10 text-center text-sm">
          No {cat.label.toLowerCase()} posted right now. Check back soon, or browse another category above.
        </p>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedItems.map((l, idx) => (
            <OpportunityCard key={l.slug} opportunity={l} priority={idx < 2} />
          ))}
        </div>
      ) : (
        <div className="border-t border-b border-line divide-y divide-line mb-12">
          {sortedItems.map((l) => (
            <ListingRow key={l.slug} listing={l} />
          ))}
        </div>
      )}
    </div>
  )
}
