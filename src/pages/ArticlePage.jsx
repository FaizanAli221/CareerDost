import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { categoryBySlug as defaultCategoryBySlug } from '../data/categories'
import { getArticleBySlugFromDb, getArticlesByCategoryFromDb, getCategoriesFromDb } from '../api/client'
import CategoryTag from '../components/CategoryTag'
import ListingRow from '../components/ListingRow'
import { formatDate } from '../lib/format'
import { safeUrl } from '../lib/security'
import { useSeo } from '../lib/useSeo'
import { getAbsoluteUrl } from '../lib/config'
import { trackApplyNowClick, trackOfficialSourceClick } from '../lib/analytics'
import { getContentType, getContentTypeLabels, getContextualStatus } from '../lib/contentType'

import CategoryFallbackImage from '../components/CategoryFallbackImage'
import OptimizedImage from '../components/OptimizedImage'
import WhatsAppCTA from '../components/WhatsAppCTA'
import ShareButtons from '../components/ShareButtons'
import SafeContent from '../components/SafeContent'
import KeyInfoSummary from '../components/KeyInfoSummary'

function DetailRow({ label, value }) {
  if (!value || value === 'N/A') return null
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-line last:border-b-0 font-sans text-xs sm:text-sm">
      <span className="text-inksoft font-normal">{label}</span>
      <span className="text-ink font-semibold text-right max-w-[60%] line-clamp-2">{value}</span>
    </div>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()

  const [listing, setListing] = useState(() => {
    if (typeof window !== 'undefined' && window.__INITIAL_ARTICLE__ && window.__INITIAL_ARTICLE__.slug === slug) {
      return window.__INITIAL_ARTICLE__
    }
    return null
  })
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined' && window.__INITIAL_ARTICLE__ && window.__INITIAL_ARTICLE__.slug === slug) {
      return false
    }
    return true
  })
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState([])
  const [categoriesList, setCategoriesList] = useState([])

  useEffect(() => {
    let isMounted = true

    // If preloaded from SSR window.__INITIAL_ARTICLE__, load ancillary data without showing skeleton
    if (listing && listing.slug === slug) {
      getArticlesByCategoryFromDb(listing.category, 5).then((rel) => {
        if (!isMounted) return
        setRelated((rel || []).filter((l) => l.slug !== listing.slug).slice(0, 4))
      })
      getCategoriesFromDb().then((cats) => {
        if (isMounted && cats) setCategoriesList(cats)
      })
      return () => {
        isMounted = false
      }
    }

    setLoading(true)
    setNotFound(false)

    // Attempt to load from DB, then dynamically fallback if needed
    getArticleBySlugFromDb(slug)
      .then(async (data) => {
        if (!isMounted) return
        let article = data
        if (!article) {
          try {
            const mod = await import('../data/listings')
            article = mod.getListingBySlug ? mod.getListingBySlug(slug) : (mod.listings || []).find((l) => l.slug === slug)
          } catch {}
        }

        if (article) {
          setListing(article)
          setNotFound(false)

          getArticlesByCategoryFromDb(article.category, 5).then((rel) => {
            if (!isMounted) return
            setRelated((rel || []).filter((l) => l.slug !== article.slug).slice(0, 4))
          })
        } else {
          setListing(null)
          setNotFound(true)
        }
      })
      .catch(async (err) => {
        console.warn('Error fetching article:', err)
        if (!isMounted) return
        try {
          const mod = await import('../data/listings')
          const fallback = mod.getListingBySlug ? mod.getListingBySlug(slug) : (mod.listings || []).find((l) => l.slug === slug)
          if (fallback) {
            setListing(fallback)
            setNotFound(false)
            return
          }
        } catch {}
        setListing(null)
        setNotFound(true)
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

  const contentType = useMemo(() => getContentType(listing), [listing])
  const labels = useMemo(() => getContentTypeLabels(contentType), [contentType])
  const statusInfo = useMemo(() => getContextualStatus(listing, contentType), [listing, contentType])

  const cat =
    categoriesList.find((c) => c.slug === listing?.category) ||
    defaultCategoryBySlug(listing?.category) || {
      slug: listing?.category || 'general',
      label: listing?.category || 'General',
    }

  // Structured Data Schema: JobPosting ONLY for genuine job vacancies, Article/NewsArticle for others
  const jsonLdSchema = useMemo(() => {
    if (!listing) return null

    const categoryLabel = cat.label || listing.category || 'Opportunities'
    const breadcrumbSchema = {
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
          name: categoryLabel,
          item: getAbsoluteUrl(`/category/${listing.category}`),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: listing.title || 'Opportunity',
          item: getAbsoluteUrl(`/jobs/${slug}`),
        },
      ],
    }

    const qualifiesForJobPosting = contentType === 'job' && listing.schemaType !== 'Article'

    let mainSchema
    if (!qualifiesForJobPosting) {
      mainSchema = {
        '@type': 'Article',
        headline: listing.title || 'Opportunity',
        description:
          listing.metaDescription ||
          listing.excerpt ||
          (Array.isArray(listing.content) ? listing.content.join(' ') : String(listing.content || '')),
        datePublished: listing.publishDate || undefined,
        dateModified: listing.publishDate || undefined,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': getAbsoluteUrl(`/jobs/${slug}`),
        },
        author: {
          '@type': 'Organization',
          name: 'CareerDost',
          url: getAbsoluteUrl('/'),
        },
        publisher: {
          '@type': 'Organization',
          name: 'CareerDost',
          url: getAbsoluteUrl('/'),
          logo: {
            '@type': 'ImageObject',
            url: getAbsoluteUrl('/favicon.svg'),
          },
        },
        image: listing.featuredImage ? getAbsoluteUrl(listing.featuredImage) : undefined,
      }
    } else {
      const jobTypeStr = String(listing.jobType || '').toLowerCase()
      const isInternship = listing.category === 'internships' || jobTypeStr.includes('intern')
      mainSchema = {
        '@type': 'JobPosting',
        title: listing.title || 'Opportunity',
        description:
          listing.metaDescription ||
          (Array.isArray(listing.content) ? listing.content.join(' ') : String(listing.content || '')),
        datePosted: listing.publishDate || undefined,
        validThrough: listing.lastDate && !isNaN(new Date(listing.lastDate.split('T')[0] + 'T00:00:00').getTime()) ? listing.lastDate : undefined,
        employmentType: isInternship
          ? 'INTERN'
          : jobTypeStr.includes('part')
          ? 'PART_TIME'
          : 'FULL_TIME',
        hiringOrganization: listing.organization
          ? {
              '@type': 'Organization',
              name: listing.organization,
              sameAs: listing.officialLink ? safeUrl(listing.officialLink) : undefined,
            }
          : undefined,
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: listing.location || 'Pakistan',
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
    }

    return {
      '@context': 'https://schema.org',
      '@graph': [mainSchema, breadcrumbSchema],
    }
  }, [listing, slug, cat, contentType])

  useSeo({
    title: listing?.seoTitle || (listing ? `${listing.title} — CareerDost` : 'Opportunity — CareerDost'),
    description: listing?.metaDescription || listing?.excerpt || 'View verified requirements, eligibility criteria, and direct official links on CareerDost.',
    canonical: `/jobs/${slug}`,
    ogType: 'article',
    ogImage: listing?.featuredImage ? getAbsoluteUrl(listing.featuredImage) : getAbsoluteUrl('/images/hec-commonwealth-scholarship-2027.jpg'),
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

  const hasImage = listing.featuredImage && listing.featuredImage.trim().length > 0
  const applyDestination = listing.applyLink || listing.officialLink
  const hasFaqInContent = useMemo(() => {
    const raw = Array.isArray(listing?.content) ? listing.content.join('\n') : String(listing?.content || '')
    return raw.includes('Frequently Asked Questions') || raw.includes('## FAQ') || raw.includes('### FAQ')
  }, [listing?.content])

  return (
    <div className="container-x py-6 sm:py-8 font-sans">
      {/* Breadcrumbs */}
      <nav className="text-xs text-inksoft mb-4 flex items-center flex-wrap gap-1">
        <Link to="/" className="hover:text-green font-medium">Home</Link>
        <span className="text-inksoft/60">/</span>
        <Link to={`/category/${cat.slug}`} className="hover:text-green font-medium">{cat.label}</Link>
        <span className="text-inksoft/60">/</span>
        <span className="text-ink font-semibold truncate max-w-xs">{listing.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10">
        <article>
          {/* Taxonomy Badges */}
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${labels.badgeClass}`}>
              {labels.badge}
            </span>
            <CategoryTag slug={listing.category} />
            {(listing.isVerified || listing.is_verified) && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                ✓ Official Source Verified
              </span>
            )}
          </div>

          {/* Primary H1 Heading */}
          <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight text-ink mb-3">
            {listing.title}
          </h1>

          {/* Top Meta Line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-inksoft mb-4 pb-4 border-b border-line">
            <span>Published: <strong className="text-ink">{formatDate(listing.publishDate)}</strong></span>
            {listing.organization && (
              <>
                <span>•</span>
                <span>{labels.orgLabel}: <strong className="text-ink">{listing.organization}</strong></span>
              </>
            )}
            {listing.location && (
              <>
                <span>•</span>
                <span>{labels.locLabel}: <strong className="text-ink">{listing.location}</strong></span>
              </>
            )}
          </div>

          {/* Social Share Buttons */}
          <ShareButtons title={listing.title} url={`/jobs/${listing.slug}`} className="mb-6" />

          {/* Featured Image Banner */}
          <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-xs overflow-hidden mb-6 shadow-xs">
            {hasImage ? (
              <OptimizedImage
                src={listing.featuredImage}
                alt={listing.imageAlt || listing.title}
                width={1200}
                height={675}
                priority={true}
                className="w-full h-full object-cover"
              />
            ) : (
              <CategoryFallbackImage category={cat.label || listing.category} title={listing.title} />
            )}
          </div>

          {/* Concise Key Information Summary Box */}
          <KeyInfoSummary item={listing} type={contentType} labels={labels} statusInfo={statusInfo} />

          {/* Contextual Status Alert Box */}
          <div className={`border p-4 mb-8 text-xs sm:text-sm rounded-xs shadow-xs ${statusInfo.badgeClass}`}>
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <span>{contentType === 'notification' ? '📋' : '⏰'}</span>
              <span>{labels.statusPrefix}: {statusInfo.status}</span>
            </div>
            <p className="leading-relaxed">{statusInfo.description}</p>
          </div>

          {/* Article Main Body with Clean Heading Hierarchy and Deduplication */}
          <div className="prose-content text-ink leading-relaxed text-sm sm:text-base space-y-4">
            <SafeContent content={listing.content} stripTitle={listing.title} />
          </div>

          {/* Contextual Action / Redressal / How to Benefit Section */}
          <div className="mt-10 border border-line bg-paper/70 p-5 sm:p-6 rounded-xs">
            <h2 className="font-serif text-xl sm:text-2xl text-ink font-bold mb-3 border-b border-line/60 pb-2">
              {labels.howToApplyTitle}
            </h2>

            {contentType === 'notification' ? (
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-inksoft leading-relaxed">
                <li><strong>Verify Statutory Pay:</strong> Ensure monthly salary and daily wages meet or exceed the official notified rates across your worker tier.</li>
                <li><strong>No Illegal Deductions:</strong> Employers cannot reduce wages below statutory minimums for uniforms, tea, food, or arbitrary fines.</li>
                <li><strong>Universal Worker Entitlement:</strong> Contractual, piece-rate, daily-wage, and third-party outsourced personnel are protected under provincial labour law.</li>
                <li><strong>Lodge Formal Grievance:</strong> Violations can be filed under the Payment of Wages Act before the Directorate of Labour Sindh or District Labour Officer.</li>
              </ol>
            ) : contentType === 'scheme' ? (
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-inksoft leading-relaxed">
                <li><strong>Verify Eligibility Criteria:</strong> Review the official poverty scorecard threshold, regional quota, and valid CNIC requirements detailed above.</li>
                <li><strong>Use Only Official Portals:</strong> Beware of fake SMS messages from ordinary 11-digit mobile numbers. Use only official government channels.</li>
                <li><strong>Biometric Verification:</strong> Receive cash disbursements or subsidies only through designated biometric partner bank branches or official campsites.</li>
                <li><strong>Zero Service Charges:</strong> Official government welfare payments are completely free of fee or processing deductions.</li>
              </ol>
            ) : contentType === 'admission' ? (
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-inksoft leading-relaxed">
                <li><strong>Review Academic Eligibility:</strong> Confirm required pre-requisite marks, entry test qualification, and quota eligibility.</li>
                <li><strong>Submit Online Application:</strong> Register on the university portal and upload educational marksheets, domicile, and photograph.</li>
                <li><strong>Fee Deposit:</strong> Pay the prescribed processing challan at designated bank branches before the closing deadline.</li>
                <li><strong>Admit Card &amp; Test Schedule:</strong> Download the pre-admission entry test slip and report to your designated testing center.</li>
              </ol>
            ) : contentType === 'result' ? (
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-inksoft leading-relaxed">
                <li><strong>Prepare Roll Number:</strong> Have your test roll number, registration ID, or 13-digit CNIC ready.</li>
                <li><strong>Visit Official Result Portal:</strong> Navigate to the authorized testing service or board result portal linked below.</li>
                <li><strong>Download Scorecard:</strong> Review your subject-wise marks, percentile, and provisional merit list ranking.</li>
                <li><strong>Recounting Window:</strong> Submit verification or paper re-checking applications within the notified post-result timeline if required.</li>
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-inksoft leading-relaxed">
                <li>Review the eligibility criteria, qualification, and deadline details listed above.</li>
                <li>Prepare your CNIC, educational documents, domicile certificate, and recent photographs.</li>
                <li>Visit the official portal linked below to fill out the online application form or download the prescribed challan/application form.</li>
                <li>Submit the application fee (if applicable) at the designated bank branch before the closing date.</li>
              </ol>
            )}

            {/* Contextual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-line/60">
              {applyDestination && (
                <a
                  href={safeUrl(applyDestination)}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() =>
                    trackApplyNowClick({
                      jobTitle: listing.title,
                      organization: listing.organization,
                      officialLink: applyDestination,
                      category: listing.category,
                    })
                  }
                  className="inline-block border border-green bg-green text-white px-6 py-3 text-xs sm:text-sm font-bold hover:bg-green-dark transition-colors shadow-xs rounded-xs"
                >
                  {labels.ctaLabel}
                </a>
              )}
              {listing.officialLink && listing.officialLink !== applyDestination && labels.ctaSecondary && (
                <a
                  href={safeUrl(listing.officialLink)}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() =>
                    trackOfficialSourceClick({
                      title: listing.title,
                      organization: listing.organization || 'CareerDost',
                      officialLink: listing.officialLink,
                      category: listing.category,
                    })
                  }
                  className="inline-block border border-line bg-white text-ink px-5 py-3 text-xs sm:text-sm font-semibold hover:border-green hover:text-green transition-colors rounded-xs"
                >
                  {labels.ctaSecondary}
                </a>
              )}
            </div>
          </div>

          {/* Contextual Frequently Asked Questions (FAQ) — only rendered if article content doesn't already have FAQs */}
          {!hasFaqInContent && (
            <div className="mt-10 border-t border-line pt-6">
              <h2 className="font-serif text-xl sm:text-2xl text-ink font-bold mb-4">
                Frequently Asked Questions (FAQ)
              </h2>
            <div className="space-y-4">
              {contentType === 'notification' ? (
                <>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      What is the statutory minimum wage rate in Sindh?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      {listing.salary || 'The statutory baseline is Rs. 43,000 per month for unskilled workers, with scheduled higher tiers for semi-skilled, skilled, and highly skilled employees.'}
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      When did this official notification take effect?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      {listing.lastDate || 'In statutory effect as notified by the Government of Sindh and Sindh Minimum Wages Board.'}
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      Are contract, piece-rate, and third-party workers protected?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      Yes. The statutory labour mandates apply to all industrial and commercial establishments throughout Sindh across permanent, temporary, contractual, and outsourced personnel.
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      Where can official circulars and gazettes be verified?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      Official gazette notifications are published on the Sindh Labour Department portal: <a href="https://lhr.sindh.gov.pk/" target="_blank" rel="noopener noreferrer" className="text-green hover:underline font-semibold">lhr.sindh.gov.pk</a>.
                    </p>
                  </div>
                </>
              ) : contentType === 'scheme' ? (
                <>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      Who is eligible to benefit from {listing.title}?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      {listing.qualification || 'Eligibility is determined based on government criteria, valid CNIC registration, and socio-economic verification under the sponsoring department.'}
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      Is there any fee to check status or register?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      No. Public verification and welfare scheme enrollments are 100% free of cost. Never pay any fee or transfer mobile balance to callers or private agents.
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      How can I verify whether my application is approved?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      Always check through the official government portal or authorized shortcode linked in this guide.
                    </p>
                  </div>
                </>
              ) : contentType === 'admission' ? (
                <>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      What is the last date to apply for admission?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      {listing.noDeadline
                        ? 'No strict deadline has been specified. Check the official prospectus for upcoming intakes.'
                        : `The last date to submit your online admission form is ${formatDate(listing.lastDate)}.`}
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      What academic qualification is required?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      {listing.qualification || 'Please refer to the official university prospectus for program-specific eligibility criteria.'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      What is the application deadline for {listing.title}?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      {listing.noDeadline
                        ? 'No specific deadline has been announced for this vacancy.'
                        : `The last date to submit your application is ${formatDate(listing.lastDate)}.`}
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      What qualification is required for this position?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      {listing.qualification || 'Please refer to the official advertisement for exact qualification requirements.'}
                    </p>
                  </div>
                  <div className="border border-line bg-white p-4 rounded-xs">
                    <h3 className="font-semibold text-ink text-sm mb-1">
                      Is CareerDost receiving job applications directly?
                    </h3>
                    <p className="text-xs text-inksoft leading-relaxed">
                      No, CareerDost is an informational opportunity platform. All applications must be submitted directly through the official recruiting organization's portal linked above.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          )}

          {/* Contextual Category Internal Link CTA */}
          <div className="mt-8 p-4 bg-paper border border-line rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-inksoft block">Explore more verified updates:</span>
              <strong className="text-ink text-sm">Looking for more in {cat.label}?</strong>
            </div>
            <Link
              to={`/category/${cat.slug}`}
              className="inline-flex items-center gap-1 font-bold text-green hover:text-green-dark transition-colors self-start sm:self-auto"
            >
              Browse all {cat.label} →
            </Link>
          </div>

          {/* Social Share Buttons (Bottom) */}
          <ShareButtons title={listing.title} url={`/jobs/${listing.slug}`} className="mt-8 mb-6" />

          {/* WhatsApp Channel CTA */}
          <WhatsAppCTA variant="banner" className="mt-8 mb-0" />
        </article>

        {/* Sidebar Key Details with Adaptive Content Type Labels */}
        <aside className="space-y-6">
          <div className="border border-line bg-white p-5 shadow-xs rounded-xs">
            <h3 className="font-serif text-lg font-bold text-ink mb-3 border-b border-line pb-2 flex items-center justify-between">
              <span>{labels.summaryTitle || 'Key Specifications'}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${labels.badgeClass}`}>
                {labels.badge}
              </span>
            </h3>
            <DetailRow label={labels.orgLabel} value={listing.organization} />
            <DetailRow label={labels.typeLabel} value={listing.jobType} />
            <DetailRow label={labels.locLabel} value={listing.location} />
            <DetailRow label={labels.qualLabel} value={listing.qualification} />
            <DetailRow label={labels.expLabel} value={listing.experience} />
            <DetailRow label={labels.posLabel} value={listing.positions} />
            <DetailRow label={labels.salLabel} value={listing.salary} />
            <DetailRow label="Published Date" value={formatDate(listing.publishDate)} />
            <DetailRow
              label={labels.dateLabel}
              value={
                listing.noDeadline
                  ? 'No Deadline'
                  : contentType === 'job' && !isNaN(new Date(String(listing.lastDate).split('T')[0] + 'T00:00:00').getTime())
                  ? formatDate(listing.lastDate)
                  : listing.lastDate
              }
            />
            <DetailRow
              label="Source Verification"
              value={listing.isVerified || listing.is_verified ? '✓ Official Verified' : 'Standard'}
            />
          </div>

          <WhatsAppCTA variant="sidebar" />

          {related.length > 0 && (
            <div>
              <h3 className="font-serif text-lg font-bold text-ink mb-3">
                More in {cat.label}
              </h3>
              <div className="border border-line bg-white px-4 divide-y divide-line rounded-xs shadow-xs">
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
