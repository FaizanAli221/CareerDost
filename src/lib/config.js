import { trackShare } from './analytics'

/**
 * Centralized site configuration and URL utilities for CareerDost.
 */

export const PRIMARY_DOMAIN = 'careerdost.blog'
export const SITE_URL = 'https://careerdost.blog'

export const SITE_NAME = 'CareerDost'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hec-commonwealth-scholarship-2027.jpg`

/**
 * Returns an absolute URL for any relative or absolute path on the canonical production domain.
 */
export function getAbsoluteUrl(path = '') {
  if (!path) return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const parsed = new URL(path)
      const host = parsed.hostname.toLowerCase()
      // If it's an old or alternative CareerDost domain, migrate to primary production SITE_URL
      if (
        host === 'careerdost.pages.dev' ||
        host === 'www.careerdost.pages.dev' ||
        host === 'www.careerdost.blog' ||
        host === 'careerdost.pk' ||
        host === 'www.careerdost.pk' ||
        host === 'careersdost.pk' ||
        host === 'www.careersdost.pk'
      ) {
        return `${SITE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`
      }
      return path
    } catch {
      return path
    }
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

/**
 * Lightweight analytics event dispatcher for social sharing actions.
 * Safely hooks into GA4 tracking functions.
 */
export function trackShareEvent(platform, title, url) {
  try {
    trackShare(platform, title, url)
  } catch (err) {
    // Silent catch
  }
}
