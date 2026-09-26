import { useEffect } from 'react'

const DOMAIN = 'https://careerdost.pk'
const DEFAULT_IMAGE = `${DOMAIN}/og-image.jpg`
const SITE_NAME = 'CareerDost'

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
  let script = document.querySelector('script[type="application/ld+json"]')
  if (!schema) {
    if (script) script.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(schema)
}

export function useSeo({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noIndex = false,
  jsonLd = null,
} = {}) {
  useEffect(() => {
    // 1. Dynamic Page Title
    if (title) {
      document.title = title.includes('CareerDost') ? title : `${title} — CareerDost`
    }

    // 2. Meta Description
    if (description) {
      setMetaTag('name', 'description', description)
    }

    // 3. Meta Robots
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // 4. Canonical URL
    const canonicalUrl = canonical ? (canonical.startsWith('http') ? canonical : `${DOMAIN}${canonical}`) : `${DOMAIN}${window.location.pathname}`
    setLinkCanonical(canonicalUrl)

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', SITE_NAME)
    setMetaTag('property', 'og:title', title || SITE_NAME)
    setMetaTag('property', 'og:description', description || '')
    setMetaTag('property', 'og:url', canonicalUrl)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:image', ogImage)

    // 6. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title || SITE_NAME)
    setMetaTag('name', 'twitter:description', description || '')
    setMetaTag('name', 'twitter:image', ogImage)

    // 7. Structured Data JSON-LD
    setJsonLd(jsonLd)

  }, [title, description, canonical, ogType, ogImage, noIndex, jsonLd])
}
