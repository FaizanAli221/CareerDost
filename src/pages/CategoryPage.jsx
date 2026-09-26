import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { categoryBySlug as defaultCategoryBySlug, categories as defaultCategories } from '../data/categories'
import { getListingsByCategory as defaultGetByCategory } from '../data/listings'
import { getCategoryBySlugFromDb, getCategoriesFromDb } from '../api/client'
import ListingRow from '../components/ListingRow'
import { useSeo } from '../lib/useSeo'

export default function CategoryPage() {
  const { slug } = useParams()
  const [sort, setSort] = useState('newest')

  const [categoriesList, setCategoriesList] = useState(() => defaultCategories)
  const [cat, setCat] = useState(() => defaultCategoryBySlug(slug))
  const [items, setItems] = useState(() => defaultGetByCategory(slug))

  useEffect(() => {
    let isMounted = true

    getCategoriesFromDb().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        setCategoriesList(cats)
      }
    })

    getCategoryBySlugFromDb(slug).then((res) => {
      if (isMounted && res) {
        if (res.category) setCat(res.category)
        if (res.articles) setItems(res.articles)
      }
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

  if (!cat) return <Navigate to="/" replace />

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
      <p className="font-sans text-inksoft max-w-2xl mb-6">{cat.description}</p>

      <div className="flex flex-wrap gap-2 mb-6 font-sans text-sm">
        {categoriesList.map((c) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            className={`px-3 py-1.5 border ${
              c.slug === slug ? 'border-green bg-green text-white' : 'border-line text-ink hover:border-green'
            }`}
          >
            {c.short}
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
