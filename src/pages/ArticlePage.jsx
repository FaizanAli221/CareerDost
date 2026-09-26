import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getListingBySlug as defaultGetListing, getListingsByCategory as defaultGetByCategory } from '../data/listings'
import { categoryBySlug as defaultCategoryBySlug } from '../data/categories'
import { getArticleBySlugFromDb, getArticlesByCategoryFromDb, getCategoriesFromDb } from '../api/client'
import CategoryTag from '../components/CategoryTag'
import ListingRow from '../components/ListingRow'
import { deadlineLabel, formatDate } from '../lib/format'
import { safeUrl } from '../lib/security'
import { useSeo } from '../lib/useSeo'

function DetailRow({ label, value }) {
  if (!value || value === 'N/A') return null
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-line last:border-b-0 font-sans text-sm">
      <span className="text-inksoft font-normal">{label}</span>
      <span className="text-ink font-semibold text-right">{value}</span>
    </div>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState([])
  const [categoriesList, setCategoriesList] = useState([])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setNotFound(false)

    // Attempt to load from DB, then fallback to static file if needed
    getArticleBySlugFromDb(slug)
      .then((data) => {
        if (!isMounted) return
        const article = data || defaultGetListing(slug)

        if (article) {
          setListing(article)
          setNotFound(false)

          getArticlesByCategoryFromDb(article.category).then((rel) => {
            if (!isMounted) return
            const relatedList = rel && rel.length > 0 ? rel : defaultGetByCategory(article.category)
            setRelated(relatedList.filter((l) => l.slug !== article.slug).slice(0, 4))
          })
        } else {
          setListing(null)
          setNotFound(true)
        }
      })
      .catch((err) => {
        console.warn('Error fetching article:', err)
        if (!isMounted) return
        const fallback = defaultGetListing(slug)
        if (fallback) {
          setListing(fallback)
          setNotFound(false)
        } else {
          setListing(null)
          setNotFound(true)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    getCategoriesFromDb().then((cats) => {
      if (isMounted && cats) setCategoriesList(cats)
    })

    return () => {
      isMounted = false
    }
  }, [slug])

  // JobPosting / Article Structured Data Schema
  const jsonLdSchema = useMemo(() => {
    if (!listing) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: listing.title,
      description: listing.metaDescription || (Array.isArray(listing.content) ? listing.content.join(' ') : listing.content),
      datePosted: listing.publishDate,
      validThrough: listing.lastDate,
      employmentType: listing.jobType?.toLowerCase().includes('part') ? 'PART_TIME' : 'FULL_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: listing.organization,
        sameAs: listing.officialLink ? safeUrl(listing.officialLink) : undefined,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: listing.location,
          addressCountry: 'PK',
        },
      },
      baseSalary: listing.salary
        ? {
            '@type': 'MonetaryAmount',
            currency: 'PKR',
            value: {
              '@type': 'QuantitativeValue',
              value: listing.salary,
            },
          }
        : undefined,
    }
  }, [listing])

  useSeo({
    title: listing?.seoTitle || (listing ? `${listing.title} — CareerDost` : 'Opportunity — CareerDost'),
    description: listing?.metaDescription || listing?.excerpt || 'View job qualification, deadline, and official application details on CareerDost.',
    canonical: `/jobs/${slug}`,
    ogType: 'article',
    jsonLd: jsonLdSchema,
  })

  if (loading) {
    return (
      <div className="container-x py-16 font-sans">
        <div className="animate-pulse space-y-4 max-w-3xl">
          <div className="h-4 bg-line/60 w-1/4 rounded"></div>
          <div className="h-8 bg-line/60 w-3/4 rounded"></div>
          <div className="h-4 bg-line/60 w-1/2 rounded"></div>
          <div className="h-48 bg-line/30 rounded mt-6"></div>
        </div>
      </div>
    )
  }

  if (notFound || !listing) {
    return (
      <div className="container-x py-16 font-sans text-center max-w-lg">
        <div className="text-4xl mb-3">🔍</div>
        <h1 className="font-serif text-2xl font-bold text-ink mb-2">Listing Not Found</h1>
        <p className="text-sm text-inksoft mb-6 leading-relaxed">
          The opportunity listing you are looking for may have expired, been removed, or moved to a different web address.
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

  const cat =
    categoriesList.find((c) => c.slug === listing.category) ||
    defaultCategoryBySlug(listing.category) || {
      slug: listing.category || 'general',
      label: listing.category || 'General',
    }

  const dl = deadlineLabel(listing.lastDate)
  const contentArray = Array.isArray(listing.content) ? listing.content : [listing.content || '']

  return (
    <div className="container-x py-8">
      {/* Breadcrumbs */}
      <nav className="text-xs font-sans text-inksoft mb-4 flex items-center flex-wrap gap-1">
        <Link to="/" className="hover:text-green font-medium">Home</Link>
        <span className="text-inksoft/60">/</span>
        <Link to={`/category/${cat.slug}`} className="hover:text-green font-medium">{cat.label}</Link>
        <span className="text-inksoft/60">/</span>
        <span className="text-ink font-semibold truncate max-w-xs">{listing.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <article>
          <div className="mb-3">
            <CategoryTag slug={listing.category} />
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight text-ink mb-3">
            {listing.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-sans text-inksoft mb-6 pb-4 border-b border-line">
            <span>Posted: <strong className="text-ink">{formatDate(listing.publishDate)}</strong></span>
            <span>•</span>
            <span>Organization: <strong className="text-ink">{listing.organization}</strong></span>
            {listing.location && (
              <>
                <span>•</span>
                <span>Location: <strong className="text-ink">{listing.location}</strong></span>
              </>
            )}
          </div>

          {/* Deadline Alert Box */}
          <div
            className={`border p-4 mb-8 font-sans text-sm ${
              dl.closed
                ? 'border-line bg-white text-inksoft'
                : dl.urgent
                ? 'border-brick/30 bg-brick-light text-brick'
                : 'border-green/30 bg-green-light text-green'
            }`}
          >
            <div className="font-semibold mb-1">
              {dl.closed ? '⚠️ Applications Closed' : dl.urgent ? '🚨 Closing Soon!' : '✅ Accepting Applications'}
            </div>
            {dl.closed
              ? `Applications for this vacancy officially closed on ${formatDate(listing.lastDate)}.`
              : `The last date to submit online applications is ${formatDate(listing.lastDate)} (${dl.text}).`}
          </div>

          {/* Detailed Content / Overview */}
          <div className="prose-content font-sans text-ink space-y-4 leading-relaxed text-sm sm:text-base">
            <h2 className="font-serif text-xl text-ink font-bold border-b border-line pb-2 mt-6">
              Overview &amp; Description
            </h2>
            {contentArray.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* How to Apply Section */}
          <div className="mt-8 border border-line bg-paper p-6 font-sans">
            <h2 className="font-serif text-xl text-ink font-bold mb-3">
              How to Apply
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-inksoft leading-relaxed">
              <li>Review the eligibility criteria, qualification, and deadline details listed above.</li>
              <li>Prepare your CNIC, educational documents, domicile certificate, and recent photographs.</li>
              <li>Visit the official portal linked below to fill out the online application form or download the prescribed challan/application form.</li>
              <li>Submit the application fee (if applicable) at the designated bank branch before the closing date.</li>
            </ol>

            {listing.officialLink && (
              <a
                href={safeUrl(listing.officialLink)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-block mt-5 border border-green bg-green text-white px-6 py-3 font-sans text-sm font-semibold hover:bg-green-dark transition-colors shadow-xs"
              >
                Visit Official Portal / Apply Online →
              </a>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-10 border-t border-line pt-6 font-sans">
            <h2 className="font-serif text-xl text-ink font-bold mb-4">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="border border-line bg-white p-4">
                <h3 className="font-semibold text-ink text-sm mb-1">
                  What is the last date to apply for {listing.title}?
                </h3>
                <p className="text-xs text-inksoft">
                  The last date to submit your application is <strong>{formatDate(listing.lastDate)}</strong>.
                </p>
              </div>

              <div className="border border-line bg-white p-4">
                <h3 className="font-semibold text-ink text-sm mb-1">
                  What qualification is required for this position?
                </h3>
                <p className="text-xs text-inksoft">
                  {listing.qualification || 'Please refer to the official advertisement for exact qualification and degree discipline requirements.'}
                </p>
              </div>

              <div className="border border-line bg-white p-4">
                <h3 className="font-semibold text-ink text-sm mb-1">
                  Is CareerDost receiving job applications directly?
                </h3>
                <p className="text-xs text-inksoft">
                  No, CareerDost is an informational portal. All applications must be submitted directly through the official recruiting organization's portal linked above.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar Key Details */}
        <aside className="space-y-6">
          <div className="border border-line bg-white p-5 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-ink mb-3 border-b border-line pb-2">
              Key Details
            </h2>
            <DetailRow label="Organization" value={listing.organization} />
            <DetailRow label="Employment Type" value={listing.jobType} />
            <DetailRow label="Location" value={listing.location} />
            <DetailRow label="Qualification" value={listing.qualification} />
            <DetailRow label="Salary / Scale" value={listing.salary} />
            <DetailRow label="Posted Date" value={formatDate(listing.publishDate)} />
            <DetailRow label="Application Deadline" value={formatDate(listing.lastDate)} />
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="font-serif text-lg font-bold text-ink mb-3">
                More in {cat.label}
              </h2>
              <div className="border border-line bg-white px-4 divide-y divide-line">
                {related.map((l) => (
                  <ListingRow key={l.slug} listing={l} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
