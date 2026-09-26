import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { categories as defaultCategories } from '../data/categories'
import { getCategoriesFromDb } from '../api/client'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [categoriesList, setCategoriesList] = useState(() => defaultCategories)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    getCategoriesFromDb().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        setCategoriesList(cats)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  // Pre-defined menu structure
  const mainNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Government Jobs', path: '/category/government-jobs' },
    { label: 'Private Jobs', path: '/category/private-jobs' },
    { label: 'Bank Jobs', path: '/category/bank-jobs' },
    { label: 'Scholarships', path: '/category/scholarships' },
    { label: 'Internships', path: '/category/internships' },
    { label: 'Schemes', path: '/category/government-schemes' },
    { label: 'Admissions', path: '/category/admissions' },
    { label: 'Search', path: '/search' },
  ]

  return (
    <header className="border-b border-line bg-white sticky top-0 z-40 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-dark text-white text-xs font-sans py-1.5 px-4 text-center hidden sm:block">
        <span className="font-medium text-gold mr-2">CareerDost.pk:</span>
        Official Pakistan Government &amp; Private Vacancies, Scholarships &amp; Admissions — Updated Daily
      </div>

      <div className="container-x">
        {/* Main Logo & Search Bar */}
        <div className="flex items-center justify-between h-16 gap-4 border-b border-line/50">
          <Link to="/" className="flex items-baseline gap-1.5 shrink-0 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-ink group-hover:text-green transition-colors">
              CareerDost
            </span>
            <span className="text-xs font-sans font-semibold text-green tracking-wide">.pk</span>
          </Link>

          {/* Search Form */}
          <form onSubmit={submitSearch} className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, organization, city, scholarships…"
                className="w-full border border-line bg-paper pl-3 pr-20 py-2 text-sm font-sans text-ink placeholder:text-inksoft/70 focus:border-green focus:bg-white transition-colors"
                aria-label="Search"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 border-l border-line bg-green text-white px-4 text-xs font-sans font-medium hover:bg-green-dark transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden font-sans text-xs font-semibold uppercase tracking-wider border border-line bg-paper px-3 py-2 text-ink hover:bg-white"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? '✕ Close' : '☰ Menu'}
          </button>
        </div>

        {/* Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between overflow-x-auto font-sans text-sm py-1">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            {mainNavItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-green/10 text-green font-semibold'
                      : 'text-ink hover:text-green hover:bg-paper'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <Link
            to="/admin"
            className="text-xs text-inksoft hover:text-green whitespace-nowrap px-2 py-1 font-sans border border-line/60 hover:border-green"
          >
            Admin Panel
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-line bg-white shadow-lg">
          <form onSubmit={submitSearch} className="flex p-3 gap-2 bg-paper border-b border-line">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, scholarships..."
              className="flex-1 border border-line bg-white px-3 py-2 text-sm"
            />
            <button type="submit" className="bg-green text-white px-4 text-sm font-medium">
              Go
            </button>
          </form>

          <div className="grid grid-cols-2 font-sans text-sm p-3 gap-2">
            {mainNavItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setOpen(false)}
                className="px-3 py-2 border border-line bg-paper text-ink hover:border-green hover:text-green font-medium text-xs rounded-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="p-3 border-t border-line flex justify-between text-xs text-inksoft font-sans">
            <Link to="/about" onClick={() => setOpen(false)} className="hover:text-green">About Us</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="hover:text-green">Contact</Link>
            <Link to="/admin" onClick={() => setOpen(false)} className="hover:text-green">Admin</Link>
          </div>
        </div>
      )}
    </header>
  )
}
