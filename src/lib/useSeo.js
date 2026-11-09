import { useEffect } from 'react'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getAbsoluteUrl } from './config'

function setMetaTag(attribute, key, content) {
  if (!content) return
  let tag = document.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLinkCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function setJsonLd(schema) {
  let pageScript = document.querySelector('script#page-jsonld[type="application/ld+json"]')
  if (!pageScript) {
    const allScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    if (allScripts.length > 1) {
      pageScript = allScripts[allScripts.length - 1]
      pageScript.setAttribute('id', 'page-jsonld')
    }
  }

  const serialized = schema ? (typeof schema === 'string' ? schema : JSON.stringify(schema)) : ''
  const isSiteWideDuplicate = serialized.includes('/#website') && document.querySelectorAll('script[type="application/ld+json"]').length >= 1

  if (!schema || isSiteWideDuplicate) {
    if (pageScript) {
      if (pageScript.parentNode) {
        pageScript.parentNode.removeChild(pageScript)
      } else if (typeof pageScript.remove === 'function') {
        pageScript.remove()
      }
    }
    return
  }

  if (!pageScript) {
    pageScript = document.createElement('script')
    pageScript.setAttribute('id', 'page-jsonld')
    pageScript.setAttribute('type', 'application/ld+json')
    document.head.appendChild(pageScript)
  }
  pageScript.textContent = serialized
}

export function useSeo(options = {}) {
  const opts = typeof options === 'string' ? { title: options } : (options || {})
  const {
    title,
    description,
    canonical,
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    noIndex = false,
    robots = null,
    jsonLd: explicitJsonLd = null,
    schemaJson = null,
  } = opts
  const jsonLd = explicitJsonLd || schemaJson || null

  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    // 1. Dynamic Page Title
    if (title) {
      document.title = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`
    }

    // 2. Meta Description
    if (description) {
      setMetaTag('name', 'description', description)
    }

    // 3. Meta Robots
    setMetaTag('name', 'robots', robots || (noIndex ? 'noindex, nofollow' : 'index, follow'))

    // 4. Canonical URL
    const pathname = typeof window !== 'undefined' && window.location ? window.location.pathname : '/'
    const canonicalUrl = getAbsoluteUrl(canonical || pathname)

    setLinkCanonical(canonicalUrl)

    // Ensure absolute image URL for Open Graph & Twitter
    const absoluteOgImage = getAbsoluteUrl(ogImage)

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', SITE_NAME)
    setMetaTag('property', 'og:title', title || SITE_NAME)
    setMetaTag('property', 'og:description', description || '')
    setMetaTag('property', 'og:url', canonicalUrl)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:image', absoluteOgImage)

    // 6. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title || SITE_NAME)
    setMetaTag('name', 'twitter:description', description || '')
    setMetaTag('name', 'twitter:image', absoluteOgImage)

    // 7. Structured Data JSON-LD
    setJsonLd(jsonLdString ? JSON.parse(jsonLdString) : null)

  }, [title, description, canonical, ogType, ogImage, noIndex, robots, jsonLdString])
}
