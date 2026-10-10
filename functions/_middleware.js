/**
 * Cloudflare Pages Middleware for CareerDost
 * 
 * 1. Hostname canonicalization and permanent 301 redirects to https://careerdost.blog
 * 2. Edge-rendered SEO Meta & Structured Data injection via HTMLRewriter for crawlers & social cards
 */

const SITE_URL = 'https://careerdost.blog'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hec-commonwealth-scholarship-2027.jpg`

function getAbsoluteUrl(url) {
  if (!url) return DEFAULT_OG_IMAGE
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const host = url.hostname.toLowerCase()

  // Local development bypass (localhost, 127.0.0.1)
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    return await context.next()
  }

  // Canonicalize legacy, www, and alternative domains to https://careerdost.blog
  if (host !== 'careerdost.blog') {
    if (
      host === 'careerdost.pages.dev' ||
      host === 'www.careerdost.pages.dev' ||
      host.endsWith('.careerdost.pages.dev') ||
      host === 'www.careerdost.blog' ||
      host === 'careerdost.pk' ||
      host === 'www.careerdost.pk' ||
      host === 'careersdost.pk' ||
      host === 'www.careersdost.pk'
    ) {
      const targetUrl = new URL(context.request.url)
      targetUrl.hostname = 'careerdost.blog'
      targetUrl.protocol = 'https:'
      targetUrl.port = ''
      return Response.redirect(targetUrl.toString(), 301)
    }
  }

  // Ensure HTTPS enforcement on primary domain
  if (url.protocol === 'http:' && host === 'careerdost.blog') {
    const targetUrl = new URL(context.request.url)
    targetUrl.protocol = 'https:'
    return Response.redirect(targetUrl.toString(), 301)
  }

  const response = await context.next()

  // Only rewrite HTML responses
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    return response
  }

  const pathname = url.pathname

  // 1. Admin & private pages: enforce noindex, nofollow on server response
  if (pathname.startsWith('/admin')) {
    return new HTMLRewriter()
      .on('head', {
        element(e) {
          e.append('<meta name="robots" content="noindex, nofollow" />', { html: true })
        },
      })
      .transform(response)
  }

  // 2. Article pages: /jobs/:slug
  if (pathname.startsWith('/jobs/') && context.env?.DB) {
    const slug = pathname.replace('/jobs/', '').split('/')[0]
    if (slug) {
      try {
        const article = await context.env.DB
          .prepare(
            `SELECT title, excerpt, seo_title, meta_description, featured_image,
                    category_slug, organization, location, salary, publish_date,
                    last_date, job_type
             FROM articles WHERE slug = ? LIMIT 1`
          )
          .bind(slug)
          .first()

        if (article) {
          const pageTitle = escapeHtml(article.seo_title || `${article.title} — CareerDost`)
          const pageDesc = escapeHtml(article.meta_description || article.excerpt || `Check ${article.title} details, requirements, and official application process on CareerDost.`)
          const canonical = `${SITE_URL}/jobs/${slug}`
          const ogImage = getAbsoluteUrl(article.featured_image)

          const rewriter = new HTMLRewriter()
            .on('title', { element: (e) => e.setInnerContent(pageTitle) })
            .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
            .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
            .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
            .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
            .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
            .on('meta[property="og:image"]', { element: (e) => e.setAttribute('content', ogImage) })
            .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
            .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
            .on('meta[name="twitter:image"]', { element: (e) => e.setAttribute('content', ogImage) })
            .on('head', {
              element(e) {
                const jsonLd = {
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: article.title,
                  description: article.meta_description || article.excerpt,
                  datePublished: article.publish_date,
                  image: ogImage,
                  mainEntityOfPage: canonical,
                  publisher: {
                    '@type': 'Organization',
                    name: 'CareerDost',
                    url: SITE_URL,
                  },
                }
                e.append(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
              },
            })

          return rewriter.transform(response)
        }
      } catch (err) {
        console.warn('SEO Rewriter Article Error:', err)
      }
    }
  }

  // 3. Daily updates pages: /daily-updates/:slug
  if (pathname.startsWith('/daily-updates/') && context.env?.DB) {
    const slug = pathname.replace('/daily-updates/', '').split('/')[0]
    if (slug) {
      try {
        const update = await context.env.DB
          .prepare(
            `SELECT title, short_description, seo_title, meta_description,
                    featured_image, category, organization, publish_date, deadline
             FROM daily_updates WHERE slug = ? LIMIT 1`
          )
          .bind(slug)
          .first()

        if (update) {
          const pageTitle = escapeHtml(update.seo_title || `${update.title} — CareerDost`)
          const pageDesc = escapeHtml(update.meta_description || update.shortDescription || `Check ${update.title} on CareerDost.`)
          const canonical = `${SITE_URL}/daily-updates/${slug}`
          const ogImage = getAbsoluteUrl(update.featured_image)

          const rewriter = new HTMLRewriter()
            .on('title', { element: (e) => e.setInnerContent(pageTitle) })
            .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
            .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
            .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
            .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
            .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
            .on('meta[property="og:image"]', { element: (e) => e.setAttribute('content', ogImage) })
            .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
            .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
            .on('meta[name="twitter:image"]', { element: (e) => e.setAttribute('content', ogImage) })
            .on('head', {
              element(e) {
                const jsonLd = {
                  '@context': 'https://schema.org',
                  '@type': 'NewsArticle',
                  headline: update.title,
                  description: update.meta_description || update.short_description,
                  datePublished: update.publish_date,
                  image: ogImage,
                  mainEntityOfPage: canonical,
                  publisher: {
                    '@type': 'Organization',
                    name: 'CareerDost',
                    url: SITE_URL,
                  },
                }
                e.append(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
              },
            })

          return rewriter.transform(response)
        }
      } catch (err) {
        console.warn('SEO Rewriter Update Error:', err)
      }
    }
  }

  // 4. Category pages: /category/:slug
  if (pathname.startsWith('/category/')) {
    const slug = pathname.replace('/category/', '').split('/')[0]
    if (slug) {
      const catFormatted = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      const pageTitle = escapeHtml(`${catFormatted} in Pakistan — CareerDost`)
      const pageDesc = escapeHtml(`Explore verified ${catFormatted} across Pakistan with deadlines, eligibility criteria, and direct official application links on CareerDost.`)
      const canonical = `${SITE_URL}/category/${slug}`

      return new HTMLRewriter()
        .on('title', { element: (e) => e.setInnerContent(pageTitle) })
        .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
        .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
        .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
        .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
        .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
        .transform(response)
    }
  }

  return response
}
