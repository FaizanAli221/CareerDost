import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { categoryBySlug as defaultCategoryBySlug, categories as defaultCategories } from '../data/categories'
import { getListingsByCategory as defaultGetByCategory } from '../data/listings'
import { getCategoryBySlugFromDb, getCategoriesFromDb } from '../api/client'
import ListingRow from '../components/ListingRow'
import { useSeo } from '../lib/useSeo'

export default function CategoryPage() {
  const { slug } = useParams()
  const [sort, setSort] = useState('newest')

  const [categoriesList, setCategoriesList] = useState(() => defaultCategories)
  const [cat, setCat] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setNotFound(false)

    getCategoriesFromDb().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        setCategoriesList(cats)
      }
    })

    getCategoryBySlugFromDb(slug)
      .then((res) => {
        if (!isMounted) return
        if (res && res.category) {
          setCat(res.category)
          setItems(res.articles || [])
          setNotFound(false)
        } else {
          const fallbackCat = defaultCategoryBySlug(slug)
          if (fallbackCat) {
            setCat(fallbackCat)
            setItems(defaultGetByCategory(slug))
            setNotFound(false)
          } else {
            setCat(null)
            setItems([])
            setNotFound(true)
          }
        }
      })
      .catch((err) => {
        console.warn('Error fetching category:', err)
        if (!isMounted) return
        const fallbackCat = defaultCategoryBySlug(slug)
        if (fallbackCat) {
          setCat(fallbackCat)
          setItems(defaultGetByCategory(slug))
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

  useSeo({
    title: cat ? `${cat.label} in Pakistan 2026 — CareerDost` : 'Category — CareerDost',
    description: cat ? cat.description : 'Browse the latest verified jobs, admissions, and scholarships on CareerDost.',
    canonical: `/category/${slug}`,
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

  let sortedItems = [...items]
  if (sort === 'deadline') {
    sortedItems.sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate))
  } else {
    sortedItems.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
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

      <div className="flex items-center justify-between border-b border-line pb-2 mb-1">
        <span className="font-sans text-sm text-inksoft">{sortedItems.length} listing{sortedItems.length === 1 ? '' : 's'}</span>
        <div className="font-sans text-sm">
          <label htmlFor="sort" className="text-inksoft mr-2">Sort</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-line bg-white px-2 py-1"
          >
            <option value="newest">Newest first</option>
            <option value="deadline">Closing soon</option>
          </select>
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <p className="font-sans text-inksoft py-10">
          No {cat.label.toLowerCase()} posted right now. Check back soon, or browse another category above.
        </p>
      ) : (
        <div>
          {sortedItems.map((l) => (
            <ListingRow key={l.slug} listing={l} />
          ))}
        </div>
      )}
    </div>
  )
}
