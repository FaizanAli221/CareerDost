import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchListingsFromDb } from '../api/client'
import ListingRow from '../components/ListingRow'
import { useSeo } from '../lib/useSeo'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(Boolean(q))

  useSeo({
    title: q ? `Search: "${q}" — CareerDost` : 'Search Jobs & Admissions — CareerDost',
    description: 'Search government jobs, private jobs, bank jobs, scholarships, internships and results on CareerDost.',
    canonical: q ? `/search?q=${encodeURIComponent(q)}` : '/search',
  })

  useEffect(() => setInput(q), [q])

  useEffect(() => {
    let isMounted = true
    if (q && q.trim()) {
      setLoading(true)
      searchListingsFromDb(q)
        .then((data) => {
          if (isMounted) setResults(data || [])
        })
        .catch((err) => {
          console.warn('Search error:', err)
          if (isMounted) setResults([])
        })
        .finally(() => {
          if (isMounted) setLoading(false)
        })
    } else {
      setResults([])
      setLoading(false)
    }
    return () => {
      isMounted = false
    }
  }, [q])

  const onSubmit = (e) => {
    e.preventDefault()
    setParams(input.trim() ? { q: input.trim() } : {})
  }

  return (
    <div className="container-x py-8">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink mb-4">Search</h1>
      <form onSubmit={onSubmit} className="flex max-w-lg mb-8">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try “bank jobs”, “scholarship”, “Lahore”…"
          className="flex-1 border border-line bg-white px-3 py-2.5 text-sm font-sans"
          autoFocus
        />
        <button type="submit" className="border border-l-0 border-line bg-green text-white px-5 text-sm font-sans hover:bg-green-dark">
          Search
        </button>
      </form>

      {loading && (
        <div className="py-6 font-sans text-sm text-inksoft animate-pulse">
          Searching vacancies and opportunities for &ldquo;{q}&rdquo;…
        </div>
      )}

      {!loading && q && (
        <p className="font-sans text-sm text-inksoft mb-3">
          {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
        </p>
      )}

      {!loading && q && results.length === 0 && (
        <p className="font-sans text-inksoft py-4">
          No listings matched your search. Try a broader term, or browse categories from the menu above.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="border-t border-line">
          {results.map((l) => (
            <ListingRow key={l.slug} listing={l} />
          ))}
        </div>
      )}
    </div>
  )
}
