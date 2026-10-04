import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDailyUpdateBySlugFromDb, getLatestDailyUpdatesFromDb } from '../api/client'
import CategoryFallbackImage from '../components/CategoryFallbackImage'
import UpdateCard from '../components/UpdateCard'
import WhatsAppCTA from '../components/WhatsAppCTA'
import ShareButtons from '../components/ShareButtons'
import SafeContent from '../components/SafeContent'
import { useSeo } from '../lib/useSeo'
import { getAbsoluteUrl } from '../lib/config'
import { getOpportunityStatus } from '../lib/format'
import { trackApplyNowClick, trackOfficialSourceClick } from '../lib/analytics'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function UpdateDetailPage() {
  const { slug } = useParams()
  const [updateItem, setUpdateItem] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useSeo({
    title: updateItem ? `${updateItem.seoTitle || updateItem.title} — CareerDost` : 'Daily Update — CareerDost',
    description: updateItem ? updateItem.metaDescription || updateItem.shortDescription : 'Verified Pakistan daily update.',
    canonical: updateItem?.canonicalUrl || `/daily-updates/${slug}`,
    ogImage: updateItem?.featuredImage ? getAbsoluteUrl(updateItem.featuredImage) : getAbsoluteUrl('/images/hec-commonwealth-scholarship-2027.jpg'),
    jsonLd: updateItem
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: updateItem.title,
          description: updateItem.shortDescription,
          datePublished: updateItem.publishDate,
          publisher: {
            '@type': 'Organization',
            name: 'CareerDost',
            url: getAbsoluteUrl('/'),
          },
        }
      : null,
  })

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    Promise.all([
      getDailyUpdateBySlugFromDb(slug),
      getLatestDailyUpdatesFromDb(4),
    ])
      .then(([updateData, latestData]) => {
        if (!isMounted) return
        setUpdateItem(updateData)
        if (latestData) {
          setRelated(latestData.filter((u) => u.slug !== slug).slice(0, 3))
        }
      })
      .catch((err) => {
        console.warn('Failed to load update detail:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container-x py-12 max-w-4xl font-sans">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-line/60 w-1/4 rounded"></div>
          <div className="h-10 bg-line/60 w-3/4 rounded"></div>
          <div className="aspect-[16/9] bg-line/40 rounded w-full"></div>
          <div className="h-20 bg-line/30 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (!updateItem) {
    return (
      <div className="container-x py-16 text-center font-sans">
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Daily Update Not Found</h2>
        <p className="text-sm text-inksoft mb-6">The update you are looking for may have been removed or updated.</p>
        <Link to="/daily-updates" className="border border-green bg-green text-white px-5 py-2.5 text-xs font-semibold hover:bg-green-dark">
          ← Back to Daily Updates
        </Link>
      </div>
    )
  }

  const hasImage = updateItem.featuredImage && updateItem.featuredImage.trim().length > 0
  const oppStatus = getOpportunityStatus(updateItem.deadline, updateItem.noDeadline)

  return (
    <article className="container-x py-8 sm:py-12 max-w-4xl font-sans">
      {/* Breadcrumbs */}
      <nav className="text-xs text-inksoft mb-6 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-green">Home</Link>
        <span>/</span>
        <Link to="/daily-updates" className="hover:text-green">Daily Updates</Link>
        <span>/</span>
        <span className="text-ink font-semibold truncate max-w-xs">{updateItem.title}</span>
      </nav>

      {/* Header Info */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-green/10 text-green text-xs font-sans font-bold px-3 py-1 rounded-full border border-green/20">
            {updateItem.category}
          </span>
          {updateItem.isVerified && (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-sans font-bold px-3 py-1 rounded-full border border-emerald-300">
              ✓ Official Source Verified
            </span>
          )}
          <span className="text-xs font-sans text-inksoft">
            Published: {formatDate(updateItem.publishDate)}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink leading-tight mb-4">
          {updateItem.title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-inksoft leading-relaxed border-l-4 border-green pl-4 py-1 bg-paper mb-6">
          {updateItem.shortDescription}
        </p>

        {/* Key Specs Bar if present */}
        {(updateItem.organization || updateItem.qualification || updateItem.location || updateItem.experience || updateItem.positions) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-paper border border-line mb-6 text-xs">
            {updateItem.organization && <div><span className="text-inksoft block">Organization</span><strong className="text-ink">{updateItem.organization}</strong></div>}
            {updateItem.location && <div><span className="text-inksoft block">Location</span><strong className="text-ink">{updateItem.location}</strong></div>}
            {updateItem.qualification && <div><span className="text-inksoft block">Qualification</span><strong className="text-ink">{updateItem.qualification}</strong></div>}
            {updateItem.positions && <div><span className="text-inksoft block">Vacancies</span><strong className="text-ink">{updateItem.positions}</strong></div>}
          </div>
        )}

        {/* Social Share Buttons */}
        <ShareButtons title={updateItem.title} url={`/daily-updates/${updateItem.slug}`} className="my-4" />
      </header>

      {/* Featured Image */}
      <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-xs overflow-hidden mb-8 shadow-sm">
        {hasImage ? (
          <img
            src={updateItem.featuredImage}
            alt={updateItem.imageAlt || updateItem.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <CategoryFallbackImage category={updateItem.category} title={updateItem.title} />
        )}
      </div>

      {/* Deadline Alert Card if present */}
      {(updateItem.deadline || updateItem.noDeadline) && (
        <div className={`border p-4 mb-8 rounded-xs font-sans flex items-center justify-between gap-4 ${oppStatus.badgeClass}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <strong className="text-slate-900 text-sm block font-bold">Opportunity Status: {oppStatus.status}</strong>
              <span className="text-xs text-amber-900">
                {updateItem.noDeadline ? 'No strict deadline specified.' : `Application deadline: ${updateItem.deadline} (${oppStatus.label})`}
              </span>
            </div>
          </div>
          {updateItem.applyLink && (
            <a
              href={updateItem.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackApplyNowClick({
                  jobTitle: updateItem.title,
                  organization: updateItem.organization || 'CareerDost',
                  officialLink: updateItem.applyLink,
                  category: updateItem.category,
                })
              }
              className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xs hover:bg-amber-700 whitespace-nowrap"
            >
              Apply Now →
            </a>
          )}
        </div>
      )}

      {/* Main Content Paragraphs (Safe HTML Sanitized) */}
      <div className="font-sans text-ink text-base leading-relaxed space-y-5 mb-10 border-b border-line pb-8">
        <SafeContent content={updateItem.content} />
      </div>

      {/* Source Links & Action Buttons */}
      <div className="bg-paper border border-line p-5 mb-8 rounded-xs flex flex-wrap items-center justify-between gap-4 font-sans text-sm">
        <div className="space-y-1">
          <strong className="text-ink text-xs uppercase tracking-wider block">Verified Information Source</strong>
          <span className="text-xs text-inksoft">Official CareerDost Bulletin</span>
        </div>

        <div className="flex items-center gap-3">
          {updateItem.officialLink && (
            <a
              href={updateItem.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackOfficialSourceClick({
                  title: updateItem.title,
                  organization: 'CareerDost',
                  officialLink: updateItem.officialLink,
                  category: updateItem.category,
                })
              }
              className="border border-line bg-white text-ink px-4 py-2 text-xs font-semibold hover:border-green hover:text-green transition-colors"
            >
              Official Website / Gazette ↗
            </a>
          )}
          {updateItem.applyLink && (
            <a
              href={updateItem.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackApplyNowClick({
                  jobTitle: updateItem.title,
                  organization: 'CareerDost',
                  officialLink: updateItem.applyLink,
                  category: updateItem.category,
                })
              }
              className="bg-green text-white px-5 py-2 text-xs font-semibold hover:bg-green-dark transition-colors shadow-xs"
            >
              Apply Online →
            </a>
          )}
        </div>
      </div>

      {/* Social Share Buttons (Bottom) */}
      <ShareButtons title={updateItem.title} url={`/daily-updates/${updateItem.slug}`} className="my-6" />

      {/* WHATSAPP CTA BANNER */}
      <WhatsAppCTA variant="banner" className="my-8" />

      {/* Related Updates */}
      {related.length > 0 && (
        <section className="border-t border-line pt-10">
          <h3 className="font-serif text-2xl font-bold text-ink mb-6">More Recent Updates</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {related.map((item) => (
              <UpdateCard key={item.slug} updateItem={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
