import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDailyUpdateBySlugFromDb, getLatestDailyUpdatesFromDb, getArticleBySlugFromDb } from '../api/client'
import CategoryFallbackImage from '../components/CategoryFallbackImage'
import OptimizedImage from '../components/OptimizedImage'
import UpdateCard from '../components/UpdateCard'
import WhatsAppCTA from '../components/WhatsAppCTA'
import ShareButtons from '../components/ShareButtons'
import SafeContent from '../components/SafeContent'
import KeyInfoSummary from '../components/KeyInfoSummary'
import AdsterraNativeBanner from '../components/AdsterraNativeBanner'
import { useSeo } from '../lib/useSeo'
import { getAbsoluteUrl } from '../lib/config'
import { trackApplyNowClick, trackOfficialSourceClick } from '../lib/analytics'
import { getContentType, getContentTypeLabels, getContextualStatus, getVerificationTier } from '../lib/contentType'
import { KNOWN_ARTICLE_SLUGS } from '../data/articleSlugs'

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
  const [initialHydratedSlug, setInitialHydratedSlug] = useState(() => {
    if (typeof window !== 'undefined' && window.__INITIAL_UPDATE__ && window.__INITIAL_UPDATE__.slug === slug) {
      return slug
    }
    return null
  })
  const [updateItem, setUpdateItem] = useState(() => {
    if (typeof window !== 'undefined' && window.__INITIAL_UPDATE__ && window.__INITIAL_UPDATE__.slug === slug) {
      const preloaded = window.__INITIAL_UPDATE__
      delete window.__INITIAL_UPDATE__
      return preloaded
    }
    return null
  })
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(() => {
    if (updateItem && updateItem.slug === slug) {
      return false
    }
    return true
  })

  const contentType = useMemo(() => getContentType(updateItem), [updateItem])
  const labels = useMemo(() => getContentTypeLabels(contentType, updateItem), [contentType, updateItem])
  const statusInfo = useMemo(() => getContextualStatus(updateItem, contentType), [updateItem, contentType])
  const verification = useMemo(() => getVerificationTier(updateItem), [updateItem])

  const hasMatchingArticle = useMemo(() => {
    if (updateItem?.hasArticle === true) return true
    if (updateItem?.hasArticle === false) return false
    if (updateItem?.canonicalUrl && updateItem.canonicalUrl.includes('/jobs/')) return true
    if (updateItem?.canonical_url && updateItem.canonical_url.includes('/jobs/')) return true
    return KNOWN_ARTICLE_SLUGS.has(slug)
  }, [updateItem, slug])

  const canonicalPath = hasMatchingArticle ? `/jobs/${slug}` : `/daily-updates/${slug}`

  const jsonLdSchema = React.useMemo(() => {
    if (!updateItem) return null
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'NewsArticle',
          headline: updateItem.title,
          description: updateItem.shortDescription,
          datePublished: updateItem.publishDate,
          dateModified: updateItem.updatedAt || updateItem.publishDate,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': getAbsoluteUrl(canonicalPath),
          },
          author: [
            {
              '@type': 'Person',
              name: 'Faizan Ali',
              jobTitle: 'Founder & Lead Editor',
              url: getAbsoluteUrl('/about#editorial-team'),
            },
            {
              '@type': 'Organization',
              name: 'CareerDost Editorial Desk',
              url: getAbsoluteUrl('/about#editorial-policy'),
            },
          ],
          publisher: {
            '@type': 'Organization',
            name: 'CareerDost',
            url: getAbsoluteUrl('/'),
            logo: {
              '@type': 'ImageObject',
              url: getAbsoluteUrl('/favicon.svg'),
            },
          },
          image: updateItem.featuredImage ? getAbsoluteUrl(updateItem.featuredImage) : undefined,
        },
        {
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
              name: 'Daily Updates',
              item: getAbsoluteUrl('/daily-updates'),
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: updateItem.title,
              item: getAbsoluteUrl(canonicalPath),
            },
          ],
        },
      ],
    }
  }, [updateItem, slug, canonicalPath])

  const isNoIndexUpdate =
    slug === 'fpsc-consolidated-advertisement-09-2026-announced' ||
    slug === 'hec-fully-funded-phd-scholarships-2026-open'

  useSeo({
    title: updateItem ? `${updateItem.seoTitle || updateItem.title} — CareerDost` : 'Daily Update — CareerDost',
    description: updateItem ? updateItem.metaDescription || updateItem.shortDescription : 'Verified Pakistan daily update.',
    canonical: canonicalPath,
    ogImage: updateItem?.featuredImage ? getAbsoluteUrl(updateItem.featuredImage) : getAbsoluteUrl('/images/hec-commonwealth-scholarship-2027.jpg'),
    robots: !loading && !updateItem ? 'noindex, nofollow' : isNoIndexUpdate ? 'noindex, follow' : null,
    jsonLd: jsonLdSchema,
  })

  useEffect(() => {
    let isMounted = true

    const usedInitialSsr = initialHydratedSlug === slug && updateItem && updateItem.slug === slug
    if (usedInitialSsr) {
      setInitialHydratedSlug(null)
      getLatestDailyUpdatesFromDb(4).then((latestData) => {
        if (!isMounted) return
        if (latestData) {
          setRelated(latestData.filter((u) => u.slug !== slug).slice(0, 3))
        }
      })

      let shouldRevalidate = false
      try {
        shouldRevalidate = Boolean(
          window.localStorage?.getItem('careerdost_content_v') ||
          window.localStorage?.getItem('careerdost_admin_token')
        )
      } catch {}

      if (shouldRevalidate) {
        getDailyUpdateBySlugFromDb(slug).then((fresh) => {
          if (!isMounted) return
          if (fresh) setUpdateItem(fresh)
          else setUpdateItem(null)
        }).catch(() => {})
      }

      return () => {
        isMounted = false
      }
    }

    setLoading(true)

    Promise.all([
      getDailyUpdateBySlugFromDb(slug),
      getLatestDailyUpdatesFromDb(4),
    ])
      .then(([updateData, latestData]) => {
        if (!isMounted) return
        if (updateData) {
          setUpdateItem(updateData)
        } else {
          getArticleBySlugFromDb(slug).then((art) => {
            if (art && isMounted) {
              window.location.replace(`/jobs/${slug}`)
            }
          })
        }
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
        <h1 className="font-serif text-2xl font-bold text-ink mb-2">Daily Update Not Found</h1>
        <p className="text-sm text-inksoft mb-6">The update you are looking for may have been removed or updated.</p>
        <Link to="/daily-updates" className="border border-green bg-green text-white px-5 py-2.5 text-xs font-semibold hover:bg-green-dark">
          ← Back to Daily Updates
        </Link>
      </div>
    )
  }

  const hasImage = updateItem.featuredImage && updateItem.featuredImage.trim().length > 0
  const actionDestination = updateItem.applyLink || updateItem.officialLink

  return (
    <article className="container-x py-6 sm:py-10 max-w-4xl font-sans">
      {/* Breadcrumbs */}
      <nav className="text-xs text-inksoft mb-4 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-green">Home</Link>
        <span>/</span>
        <Link to="/daily-updates" className="hover:text-green">Daily Updates</Link>
        <span>/</span>
        <span className="text-ink font-semibold truncate max-w-xs">{updateItem.title}</span>
      </nav>

      {/* Header Info */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${labels.badgeClass}`}>
            {labels.badge}
          </span>
          <Link
            to="/daily-updates"
            className="bg-green/10 hover:bg-green/20 text-green text-xs font-sans font-bold px-3 py-1 rounded-full border border-green/20 transition-colors"
          >
            {updateItem.category}
          </Link>
          <span className={`text-xs font-sans font-bold px-3 py-1 rounded-full border ${verification.pillClass}`}>
            {verification.icon} {verification.label}
          </span>
          <span className="text-xs font-sans text-inksoft">
            Published: {formatDate(updateItem.publishDate)}
          </span>
          {updateItem.updatedAt && updateItem.updatedAt !== updateItem.publishDate && (
            <span className="text-xs font-sans text-inksoft">
              • Verified: {formatDate(updateItem.updatedAt)}
            </span>
          )}
          <span className="text-xs font-sans text-inksoft">
            • By <Link to="/about#editorial-team" className="font-semibold text-ink hover:text-green underline">Faizan Ali &amp; CareerDost Editorial Desk</Link>
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink leading-tight mb-4">
          {updateItem.title}
        </h1>

        {updateItem.shortDescription && (
          <p className="font-sans text-base sm:text-lg text-inksoft leading-relaxed border-l-4 border-green pl-4 py-1 bg-paper mb-6">
            {updateItem.shortDescription}
          </p>
        )}

        {/* Social Share Buttons */}
        <ShareButtons title={updateItem.title} url={`/daily-updates/${updateItem.slug}`} className="my-4" />
      </header>

      {/* Featured Image */}
      <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-xs overflow-hidden mb-6 shadow-xs">
        {hasImage ? (
          <OptimizedImage
            src={updateItem.featuredImage}
            alt={updateItem.imageAlt || updateItem.title}
            width={1200}
            height={675}
            priority={true}
            className="w-full h-full object-cover"
          />
        ) : (
          <CategoryFallbackImage category={updateItem.category} title={updateItem.title} />
        )}
      </div>

      {/* Concise Key Information Summary Box */}
      <KeyInfoSummary item={updateItem} type={contentType} labels={labels} statusInfo={statusInfo} />

      {/* Link to Full Article Guide if available */}
      {hasMatchingArticle && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 mb-8 rounded-xs text-xs sm:text-sm font-sans flex items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <strong className="text-emerald-950 font-bold block text-sm">
              Comprehensive Editorial Guide &amp; Details Available
            </strong>
            <p className="text-emerald-800 text-xs leading-relaxed">
              CareerDost has published an in-depth editorial guide for this opportunity featuring full eligibility matrices, required documents checklist, syllabus breakdown, and step-by-step application procedures.
            </p>
          </div>
          <Link
            to={`/jobs/${slug}`}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 text-xs rounded-xs whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            Read Full Guide →
          </Link>
        </div>
      )}

      {/* Contextual Status Alert Box */}
      <div className={`border p-4 mb-8 rounded-xs text-xs sm:text-sm font-sans flex items-center justify-between gap-4 shadow-xs ${statusInfo.badgeClass}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl">{contentType === 'notification' ? '📋' : '⏰'}</span>
          <div>
            <strong className="text-slate-900 text-sm block font-bold">
              {labels.statusPrefix}: {statusInfo.status}
            </strong>
            <span className="text-xs text-slate-800">
              {statusInfo.description}
            </span>
          </div>
        </div>
        {actionDestination && (
          <a
            href={actionDestination}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() =>
              trackApplyNowClick({
                jobTitle: updateItem.title,
                organization: updateItem.organization || 'CareerDost',
                officialLink: actionDestination,
                category: updateItem.category,
              })
            }
            className="bg-green text-white text-xs font-bold px-4 py-2 rounded-xs hover:bg-green-dark whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            {labels.ctaLabel.includes('→') ? labels.ctaLabel : `${labels.ctaLabel}`}
          </a>
        )}
      </div>

      {/* Main Content Paragraphs with Semantic H2/H3 and Title Deduplication */}
      <div className="font-sans text-ink text-base leading-relaxed space-y-5 mb-10 border-b border-line pb-8">
        <SafeContent content={updateItem.content} stripTitle={updateItem.title} />
      </div>

      {/* Source Links & Action Buttons */}
      <div className="bg-paper border border-line p-5 mb-8 rounded-xs flex flex-wrap items-center justify-between gap-4 font-sans text-sm">
        <div className="space-y-1">
          <strong className="text-ink text-xs uppercase tracking-wider block">Verified Information Source</strong>
          <span className="text-xs text-inksoft">Official CareerDost Editorial Desk</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {updateItem.officialLink && (
            <a
              href={updateItem.officialLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() =>
                trackOfficialSourceClick({
                  title: updateItem.title,
                  organization: 'CareerDost',
                  officialLink: updateItem.officialLink,
                  category: updateItem.category,
                })
              }
              className="border border-line bg-white text-ink px-4 py-2 text-xs font-semibold hover:border-green hover:text-green transition-colors rounded-xs"
            >
              Official Department Website / Gazette ↗
            </a>
          )}
          {actionDestination && (
            <a
              href={actionDestination}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() =>
                trackApplyNowClick({
                  jobTitle: updateItem.title,
                  organization: 'CareerDost',
                  officialLink: actionDestination,
                  category: updateItem.category,
                })
              }
              className="bg-green text-white px-5 py-2 text-xs font-semibold hover:bg-green-dark transition-colors shadow-xs rounded-xs"
            >
              {labels.ctaLabel}
            </a>
          )}
        </div>
      </div>

      {/* Adsterra Native Responsive Banner */}
      <AdsterraNativeBanner />

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
