/**
 * Google Analytics 4 (GA4) Integration for CareerDost
 * Measurement ID: G-489C8F8SNJ
 */

export const GA_MEASUREMENT_ID = 'G-489C8F8SNJ'

/**
 * Safely dispatch events to Google Analytics (gtag.js) or dataLayer
 */
export function trackEvent(eventName, params = {}) {
  try {
    if (typeof window === 'undefined') return

    const safeParams = {
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      ...params,
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, safeParams)
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...safeParams,
      })
    }
  } catch (err) {
    // Silent catch to prevent analytics failures from interrupting UI execution
  }
}

/**
 * Track SPA Route Page Views in React Router
 */
export function trackPageView(path, title) {
  try {
    if (typeof window === 'undefined') return

    const pagePath = path || (window.location.pathname + window.location.search)
    const pageTitle = title || document.title

    trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href,
    })
  } catch (err) {
    // Silent catch
  }
}

/**
 * Track Social Sharing Events:
 * - share_whatsapp
 * - share_facebook
 * - share_linkedin
 * - share_copy
 * - share_native
 */
export function trackShare(platform, title, url, contentType = 'article') {
  const eventName = `share_${platform}`
  trackEvent(eventName, {
    method: platform,
    content_type: contentType,
    content_title: title,
    share_url: url,
  })
}

/**
 * Track WhatsApp Channel CTA Clicks
 */
export function trackWhatsAppChannelClick(sourceLocation = 'banner', title = '') {
  trackEvent('whatsapp_channel_click', {
    source_location: sourceLocation,
    content_title: title || document.title,
    channel_url: 'https://whatsapp.com/channel/0029VbDnzwFF1YlIkJax2P1o',
  })
}

/**
 * Track Apply Now Button Clicks
 */
export function trackApplyNowClick({ jobTitle, organization, officialLink, category }) {
  trackEvent('apply_now_click', {
    content_title: jobTitle,
    organization: organization || 'CareerDost',
    official_link: officialLink,
    category_slug: category,
  })
}

/**
 * Track Official Source Link Clicks
 */
export function trackOfficialSourceClick({ title, organization, officialLink, category }) {
  trackEvent('official_source_click', {
    content_title: title,
    organization: organization || 'CareerDost',
    official_link: officialLink,
    category_slug: category,
  })
}
