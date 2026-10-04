/**
 * Cloudflare Pages Middleware for CareerDost
 * 
 * Handles hostname canonicalization and permanent 301 redirects:
 * 1. careerdost.pages.dev/* -> https://careerdost.blog/*
 * 2. www.careerdost.blog/* -> https://careerdost.blog/*
 * 3. www.careerdost.pages.dev/* -> https://careerdost.blog/*
 * 
 * Preserves the full path and query parameters while preventing redirect loops.
 */
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

  return await context.next()
}
