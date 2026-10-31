import { KNOWN_ARTICLE_SLUGS } from '../data/articleSlugs.js'

/**
 * Returns the correct internal route for a daily update or article item.
 * Directs articles to /jobs/:slug and short bulletins to /daily-updates/:slug.
 */
export function getUpdateTargetUrl(updateItem) {
  if (!updateItem || !updateItem.slug) return '/daily-updates'
  if (updateItem.targetUrl) return updateItem.targetUrl
  if (updateItem.canonicalUrl && updateItem.canonicalUrl.includes('/jobs/')) return `/jobs/${updateItem.slug}`
  if (updateItem.canonical_url && updateItem.canonical_url.includes('/jobs/')) return `/jobs/${updateItem.slug}`
  if (updateItem.hasArticle === true) return `/jobs/${updateItem.slug}`
  if (updateItem.hasArticle === false) return `/daily-updates/${updateItem.slug}`
  if (KNOWN_ARTICLE_SLUGS.has(updateItem.slug)) return `/jobs/${updateItem.slug}`
  return `/daily-updates/${updateItem.slug}`
}
