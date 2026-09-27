/**
 * Centralized site configuration and URL utilities for CareerDost.
 */

// Dynamically resolve current origin in browser environments, defaulting to production Cloudflare Pages domain
export const SITE_URL =
  typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://careerdost.pages.dev'

export const SITE_NAME = 'CareerDost'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hec-commonwealth-scholarship-2027.jpg`

/**
 * Returns an absolute URL for any relative or absolute path.
 */
export function getAbsoluteUrl(path = '') {
  if (!path) return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

/**
 * Lightweight analytics event dispatcher for social sharing actions.
 * Safely hooks into window.gtag or window.dataLayer if present without requiring extra libraries.
 */
export function trackShareEvent(platform, title, url) {
  try {
    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        window.gtag('event', `share_${platform}`, {
          event_category: 'social_share',
          event_label: title,
          share_url: url,
        })
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: 'social_share',
          platform: platform,
          title: title,
          url: url,
        })
      }
    }
  } catch (err) {
    // Silent catch to prevent analytics failures from breaking UI
  }
}
