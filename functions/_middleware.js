/**
 * Cloudflare Pages Middleware for CareerDost (https://careerdost.blog)
 * 
 * 1. Hostname canonicalization and permanent 301 redirects to https://careerdost.blog
 * 2. Edge-rendered Semantic HTML & SEO Meta injection via HTMLRewriter
 *    (Serves full H1, article body, meta & Schema.org JSON-LD directly over HTTP 200)
 * 3. Proper HTTP 404 responses for non-existent or unverified slugs (eliminating Soft 404s)
 */

import { isGenuineJobVacancy, buildJobPostingSchema } from '../src/lib/jobSchema.js'
import { getContentType, getContentTypeLabels, getContextualStatus, getPktTodayYMD, getSectorTransparencyNote, getVerificationTier, normalizeDateToYMD } from '../src/lib/contentType.js'
import { CONSOLIDATED_SLUG_REDIRECTS } from '../src/data/consolidatedRedirects.js'

const SITE_URL = 'https://careerdost.blog'
const SITE_NAME = 'CareerDost'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hec-commonwealth-scholarship-2027.jpg`

const VALID_CATEGORIES = new Set([
  'government-jobs',
  'private-jobs',
  'bank-jobs',
  'it-jobs',
  'scholarships',
  'internships',
  'admissions',
  'government-schemes',
  'results',
  'guides-and-resources'
])

const KNOWN_STATIC_ROUTES = new Set([
  '/',
  '/daily-updates',
  '/tools/job-readiness-checker',
  '/search',
  '/about',
  '/contact',
  '/privacy-policy',
  '/disclaimer',
  '/terms-and-conditions'
])

const STATIC_ROUTE_REDIRECTS = new Map([
  ['/category/career-guides', '/category/guides-and-resources'],
  ['/privacy', '/privacy-policy'],
  ['/terms', '/terms-and-conditions'],
  ['/editorial-policy', '/about#editorial-policy'],
  ['/jobs', '/'],
  ['/category/closing-soon', '/daily-updates'],
  ['/jobs/spsc-combined-competitive-exam-guide-2026', '/jobs/spsc-exam-preparation-screening-challan-guide'],
  ['/jobs/njp-balochistan-quota-federal-jobs-november-2026', '/jobs/economic-affairs-division-jobs-balochistan-2026'],
])

const NOINDEX_ARTICLE_SLUGS = new Set([
  'hyderabad-division-section-144-notification-2026',
])

const NOINDEX_UPDATE_SLUGS = new Set([
  'fpsc-consolidated-advertisement-09-2026-announced',
  'hec-fully-funded-phd-scholarships-2026-open',
])

function getAbsoluteUrl(url) {
  if (!url) return DEFAULT_OG_IMAGE
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url)
      const h = parsed.hostname.toLowerCase()
      if (
        h === 'careerdost.pages.dev' ||
        h === 'www.careerdost.pages.dev' ||
        h.endsWith('.careerdost.pages.dev') ||
        h === 'www.careerdost.blog' ||
        h === 'careerdost.pk' ||
        h === 'www.careerdost.pk' ||
        h === 'careersdost.pk' ||
        h === 'www.careersdost.pk'
      ) {
        return `${SITE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`
      }
      return url
    } catch {
      return url
    }
  }
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

function cleanPlainText(str) {
  if (!str) return ''
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function escapeHtml(str) {
  if (!str) return ''
  const clean = cleanPlainText(str)
  return clean
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalizeLegacyInlineHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, '*$2*')
}

function normalizeLegacyBlockHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/\r\n/g, '\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<\/?(ul|ol)[^>]*>/gi, '\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
}

function withHtmlCacheHeaders(response, cacheControl = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400', etag = '', robotsTag = '') {
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', cacheControl)
  if (etag) {
    headers.set('ETag', etag)
  }
  if (robotsTag) {
    headers.set('X-Robots-Tag', robotsTag)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function formatInline(str) {
  if (!str) return ''
  const linkTokens = []
  const normalized = normalizeLegacyInlineHtml(str)
  const tokenized = String(normalized).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g, (_, label, href) => {
    const id = `@@CDLINK_${linkTokens.length}@@`
    const safeHref = escapeHtml(href)
    const safeLabel = escapeHtml(label)
    const isExternal = href.startsWith('http://') || href.startsWith('https://')
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
    linkTokens.push(`<a href="${safeHref}"${attrs} class="text-green font-semibold underline hover:text-ink">${safeLabel}</a>`)
    return id
  })
  let s = escapeHtml(tokenized)
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>')
  s = s.replace(/`([^`]+)`/g, '<code class="bg-paper px-1.5 py-0.5 rounded-xs text-sm font-mono">$1</code>')
  for (let i = 0; i < linkTokens.length; i++) {
    s = s.replace(`@@CDLINK_${i}@@`, linkTokens[i])
  }
  return s
}

function isDraftMetadataLine(line) {
  return /^(?:Title|Meta description|Focus keyword|Secondary keywords|Suggested slug):\s*/i.test(line.trim())
}

function renderOrderedListWithNesting(text) {
  const lines = text.split('\n')
  let html = '<ol class="list-decimal pl-5 space-y-2 text-ink my-4">\n'
  let inSubList = false
  let subListItems = []

  function flushSubList() {
    if (inSubList && subListItems.length > 0) {
      let subHtml = '\n    <ul class="list-disc pl-5 my-2 space-y-1 text-sm text-inksoft">\n'
      for (const sub of subListItems) {
        subHtml += `      <li>${formatInline(sub)}</li>\n`
      }
      subHtml += '    </ul>'
      subListItems = []
      inSubList = false
      return subHtml
    }
    return ''
  }

  let currentItemHtml = ''
  let hasItem = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const isNum = /^\d+\.\s+(.*)/.exec(trimmed)
    const isBullet = /^[-*]\s+(.*)/.exec(trimmed)

    if (isNum) {
      if (hasItem) {
        html += `  <li>${currentItemHtml}${flushSubList()}</li>\n`
      }
      currentItemHtml = formatInline(isNum[1])
      hasItem = true
    } else if (isBullet && hasItem) {
      inSubList = true
      subListItems.push(isBullet[1])
    } else if (hasItem) {
      currentItemHtml += ' ' + formatInline(trimmed)
    }
  }

  if (hasItem) {
    html += `  <li>${currentItemHtml}${flushSubList()}</li>\n`
  }
  html += '</ol>\n'
  return html
}

function renderContentBlocks(content, targetTitle = '') {
  if (!content) return ''
  let rawBlocks = []
  if (Array.isArray(content)) {
    rawBlocks = content
  } else if (typeof content === 'string') {
    const trimmed = content.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          rawBlocks = parsed
        } else {
          rawBlocks = [trimmed]
        }
      } catch {
        rawBlocks = [content]
      }
    } else {
      rawBlocks = content.split(/\n\s*\n/)
    }
  } else {
    rawBlocks = [String(content)]
  }

  // Split any multi-paragraph blocks and isolate headings/horizontal rules
  const blocks = []
  for (const rb of rawBlocks) {
    if (!rb) continue
    const normalizedRb = normalizeLegacyBlockHtml(rb)
    const rawParts = String(normalizedRb).split(/\n\s*\n/)
    for (const part of rawParts) {
      const trimmed = part.trim()
      if (!trimmed) continue

      const lines = trimmed.split('\n')
      let currentChunk = []

      function flushChunk() {
        if (currentChunk.length > 0) {
          const s = currentChunk.join('\n').trim()
          if (s) blocks.push(s)
          currentChunk = []
        }
      }

      for (const line of lines) {
        const t = line.trim()
        if (isDraftMetadataLine(t)) {
          continue
        }
        if (/^#{1,4}\s+/.test(t) || /^([-*_])\1{2,}$/.test(t)) {
          flushChunk()
          blocks.push(t)
        } else {
          currentChunk.push(line)
        }
      }
      flushChunk()
    }
  }

  function isDuplicateHeading(headingText) {
    if (!headingText || !targetTitle) return false
    const cleanH = headingText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
    const cleanT = targetTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
    if (!cleanH || !cleanT) return false
    if (cleanH === cleanT) return true
    if (cleanH.length > 15 && cleanT.includes(cleanH)) return true
    if (cleanT.length > 15 && cleanH.includes(cleanT)) return true
    const hWords = cleanH.split(' ').filter((w) => w.length > 2)
    const tWords = new Set(cleanT.split(' ').filter((w) => w.length > 2))
    if (hWords.length >= 3) {
      const matches = hWords.filter((w) => tWords.has(w)).length
      if (matches / hWords.length >= 0.7) return true
    }
    return false
  }

  let html = ''

  for (const text of blocks) {
    if (!text) continue
    if (isDraftMetadataLine(text)) continue

    if (/^([-*_])\1{2,}$/.test(text)) {
      html += `<hr class="my-6 border-line" />\n`
      continue
    }

    if (/^####\s+/.test(text)) {
      html += `<h4 class="font-serif text-base sm:text-lg font-bold text-ink mt-5 mb-2">${formatInline(text.replace(/^####\s+/, ''))}</h4>\n`
    } else if (text.startsWith('### ')) {
      html += `<h3 class="font-serif text-lg sm:text-xl font-bold text-ink mt-6 mb-3">${formatInline(text.replace(/^###\s+/, ''))}</h3>\n`
    } else if (text.startsWith('## ')) {
      const headingText = text.replace(/^##\s+/, '').trim()
      if (isDuplicateHeading(headingText)) {
        continue
      }
      html += `<h2 class="font-serif text-xl sm:text-2xl font-bold text-ink mt-8 mb-4 border-b border-line pb-2">${formatInline(headingText)}</h2>\n`
    } else if (text.startsWith('# ')) {
      const headingText = text.replace(/^#\s+/, '').trim()
      if (isDuplicateHeading(headingText)) {
        continue
      }
      html += `<h2 class="font-serif text-xl sm:text-2xl font-bold text-ink mt-8 mb-4 border-b border-line pb-2">${formatInline(headingText)}</h2>\n`
    } else if (text.includes('\n') && text.trim().startsWith('|') && /\|\s*:?-{2,}:?\s*\|/.test(text)) {
      const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|'))
      if (lines.length >= 2) {
        const parseRow = (line) =>
          line
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map((cell) => cell.trim())
        const headers = parseRow(lines[0])
        const dataLines = lines.slice(1).filter((l) => !/^\|?[\s\-:|]+\|?$/.test(l))
        html += `<div class="overflow-x-auto my-6 border border-line rounded-xs shadow-2xs">\n`
        html += `  <table class="w-full text-left border-collapse font-sans text-sm">\n`
        html += `    <thead class="bg-paper border-b border-line text-ink font-bold">\n      <tr>\n`
        for (const h of headers) {
          html += `        <th class="py-3 px-4 border-r border-line last:border-r-0">${formatInline(h)}</th>\n`
        }
        html += `      </tr>\n    </thead>\n    <tbody class="divide-y divide-line bg-white">\n`
        for (const dl of dataLines) {
          const cells = parseRow(dl)
          html += `      <tr>\n`
          for (const c of cells) {
            html += `        <td class="py-2.5 px-4 border-r border-line last:border-r-0 text-ink">${formatInline(c)}</td>\n`
          }
          html += `      </tr>\n`
        }
        html += `    </tbody>\n  </table>\n</div>\n`
      }
    } else if (text.startsWith('>')) {
      const rawLines = text.split('\n').map((l) => l.replace(/^>\s?/, '').trim()).filter(Boolean)
      if (rawLines.length > 0) {
        const firstLine = rawLines[0]
        const alertMatch = firstLine.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i)
        const label = alertMatch ? alertMatch[1].toUpperCase() : null
        const bodyLines = alertMatch
          ? [alertMatch[2], ...rawLines.slice(1)].filter(Boolean)
          : rawLines
        html += `<blockquote class="my-5 p-4 border-l-4 border-green bg-paper rounded-r-xs text-sm text-ink leading-relaxed">\n`
        if (label) {
          html += `  <strong class="block text-xs uppercase tracking-wider mb-1 text-green">${escapeHtml(label)} Notice</strong>\n`
        }
        html += `  <div>${bodyLines.map((l) => formatInline(l)).join('<br/>')}</div>\n`
        html += `</blockquote>\n`
      }
    } else if (text.startsWith('- ') || text.startsWith('* ')) {
      const lines = text.split('\n')
      html += `<ul class="list-disc pl-5 space-y-2 text-ink my-4">\n`
      let currentItem = ''
      for (const line of lines) {
        const t = line.trim()
        if (!t) continue
        if (/^[-*]\s+/.test(t)) {
          if (currentItem) html += `  <li>${formatInline(currentItem)}</li>\n`
          currentItem = t.replace(/^[-*]\s+/, '')
        } else if (currentItem) {
          currentItem += ' ' + t
        }
      }
      if (currentItem) html += `  <li>${formatInline(currentItem)}</li>\n`
      html += `</ul>\n`
    } else if (/^\d+\.\s+/.test(text)) {
      html += renderOrderedListWithNesting(text)
    } else {
      const lines = text.split('\n')
      let pContent = ''
      for (let i = 0; i < lines.length; i++) {
        pContent += formatInline(lines[i])
        if (i < lines.length - 1) pContent += '<br/>'
      }
      html += `<p class="font-sans text-base text-ink leading-relaxed mb-4">${pContent}</p>\n`
    }
  }
  return html
}

function generate404Html(title, message) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} — CareerDost</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "IBM Plex Sans", sans-serif; background-color: #faf9f6; color: #1c1917; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 80px auto; padding: 32px 24px; text-align: center; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
      h1 { font-size: 28px; font-weight: 700; margin-bottom: 12px; color: #0c0a09; }
      p { font-size: 15px; color: #78716c; line-height: 1.6; margin-bottom: 24px; }
      .btn { display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 10px 22px; font-size: 14px; font-weight: 600; border-radius: 4px; transition: background-color 0.2s; }
      .btn:hover { background-color: #047857; }
      .brand { font-size: 24px; font-weight: 700; color: #059669; text-decoration: none; display: inline-block; margin-bottom: 20px; }
      .nav-links { margin-top: 24px; font-size: 13px; color: #a8a29e; }
      .nav-links a { color: #059669; text-decoration: none; margin: 0 8px; }
      .nav-links a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="container">
      <a href="/" class="brand">CareerDost</a>
      <h1>404: ${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <a href="/" class="btn">← Back to CareerDost Homepage</a>
      <div class="nav-links">
        <a href="/daily-updates">Daily Updates</a> • 
        <a href="/category/government-jobs">Government Jobs</a> • 
        <a href="/category/scholarships">Scholarships</a>
      </div>
    </div>
  </body>
</html>`
}

function generateSsrFooterHtml() {
  const year = 2026
  return `
    <footer class="border-t border-line bg-white py-12 mt-16 font-sans" style="border-top:1px solid #e7e5e4;background:#ffffff;padding:48px 0;margin-top:48px;">
      <div class="container-x" style="max-width:1200px;margin:0 auto;padding:0 16px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:32px;padding-bottom:32px;border-bottom:1px solid #e7e5e4;">
          <div>
            <a href="/" style="font-family:serif;font-size:24px;font-weight:700;color:#1c1917;text-decoration:none;">CareerDost</a>
            <p style="font-size:12px;color:#78716c;line-height:1.6;margin-top:12px;">
              Pakistan's trusted opportunity portal for government vacancies, private jobs, bank jobs, scholarships, internships, schemes and admissions. Updated daily from verified official sources.
            </p>
            <div style="font-size:12px;color:#78716c;margin-top:12px;line-height:1.8;">
              <p>Email: <a href="mailto:careerdost02@gmail.com" style="color:#059669;text-decoration:none;">careerdost02@gmail.com</a></p>
              <p>Helpline: <strong style="color:#1c1917;">03173425680</strong></p>
            </div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;margin-bottom:12px;">Popular Categories</div>
            <ul style="list-style:none;padding:0;margin:0;font-size:12px;line-height:2;">
              <li><a href="/category/government-jobs" style="color:#1c1917;text-decoration:none;">Government Jobs</a></li>
              <li><a href="/category/private-jobs" style="color:#1c1917;text-decoration:none;">Private Sector Jobs</a></li>
              <li><a href="/category/bank-jobs" style="color:#1c1917;text-decoration:none;">Bank Jobs</a></li>
              <li><a href="/category/it-jobs" style="color:#1c1917;text-decoration:none;">IT &amp; Software Jobs</a></li>
              <li><a href="/category/scholarships" style="color:#1c1917;text-decoration:none;">Scholarships</a></li>
            </ul>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;margin-bottom:12px;">Opportunities &amp; Tools</div>
            <ul style="list-style:none;padding:0;margin:0;font-size:12px;line-height:2;">
              <li><a href="/category/internships" style="color:#1c1917;text-decoration:none;">Graduate Internships</a></li>
              <li><a href="/category/government-schemes" style="color:#1c1917;text-decoration:none;">Government Schemes</a></li>
              <li><a href="/category/admissions" style="color:#1c1917;text-decoration:none;">University Admissions</a></li>
              <li><a href="/category/results" style="color:#1c1917;text-decoration:none;">Merit Lists &amp; Results</a></li>
              <li><a href="/tools/job-readiness-checker" style="color:#059669;font-weight:600;text-decoration:none;">Job Readiness Checker</a></li>
            </ul>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#78716c;margin-bottom:12px;">Company &amp; Legal</div>
            <ul style="list-style:none;padding:0;margin:0;font-size:12px;line-height:2;">
              <li><a href="/about" style="color:#1c1917;text-decoration:none;">About Us</a></li>
              <li><a href="/about#editorial-policy" style="color:#1c1917;text-decoration:none;">Editorial &amp; Verification Policy</a></li>
              <li><a href="/contact" style="color:#1c1917;text-decoration:none;">Contact Us</a></li>
              <li><a href="/privacy-policy" style="color:#1c1917;text-decoration:none;">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" style="color:#1c1917;text-decoration:none;">Terms &amp; Conditions</a></li>
              <li><a href="/disclaimer" style="color:#1c1917;text-decoration:none;">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:24px;font-size:12px;color:#78716c;flex-wrap:wrap;gap:8px;">
          <span>© ${year} CareerDost — All rights reserved.</span>
          <span>Informational portal only — verify all details on official recruitment websites.</span>
        </div>
      </div>
    </footer>`
}

function generateDailyUpdateHtml(update, canonical, hasArticle = false) {
  const title = escapeHtml(update.title || '')
  const rawCat = update.category || 'Daily Update'
  const cType = getContentType(update)
  const labels = getContentTypeLabels(cType, update)
  const statusInfo = getContextualStatus(update, cType)
  const category = escapeHtml(rawCat)
  const shortDesc = update.short_description ? escapeHtml(update.short_description) : ''
  const pubDate = update.publish_date ? escapeHtml(update.publish_date) : ''
  const org = update.organization ? escapeHtml(update.organization) : ''
  const loc = update.location ? escapeHtml(update.location) : ''
  const qual = update.qualification ? escapeHtml(update.qualification) : ''
  const pos = update.positions ? escapeHtml(update.positions) : ''
  const salary = update.salary ? escapeHtml(update.salary) : ''
  const jobType = update.job_type ? escapeHtml(update.job_type) : ''
  const deadline = update.deadline ? escapeHtml(update.deadline) : ''
  const applyLink = update.apply_link ? escapeHtml(update.apply_link) : ''
  const officialLink = update.official_link ? escapeHtml(update.official_link) : ''
  const contentHtml = renderContentBlocks(update.content, update.title)

  const typeBadge = cType === 'job' ? category : escapeHtml(labels.badge || 'Career Alert')
  const actionBtnText = labels.ctaLabel ? escapeHtml(labels.ctaLabel) : ''
  const officialBtnText = escapeHtml(labels.ctaSecondary || labels.ctaLabel || 'Official Website / Gazette ↗')
  const displaySalary = labels.salLabel && salary ? salary : ''
  const displayDeadline = (cType === 'guide' || update.no_deadline) ? '' : deadline
  const updatedDate = update.updated_at ? escapeHtml(String(update.updated_at).split(' ')[0].split('T')[0]) : pubDate

  const specsBox = (org || loc || qual || pos || displaySalary || jobType || displayDeadline) ? `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-paper border border-line mb-6 text-xs" style="background:#faf9f6;border:1px solid #e7e5e4;padding:16px;margin-bottom:24px;">
      ${org ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.orgLabel)}</span><strong style="color:#1c1917;">${org}</strong></div>` : ''}
      ${loc ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.locLabel)}</span><strong style="color:#1c1917;">${loc}</strong></div>` : ''}
      ${qual ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.qualLabel)}</span><strong style="color:#1c1917;">${qual}</strong></div>` : ''}
      ${pos ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.posLabel)}</span><strong style="color:#1c1917;">${pos}</strong></div>` : ''}
      ${displaySalary ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.salLabel)}</span><strong style="color:#059669;">${displaySalary}</strong></div>` : ''}
      ${jobType ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.typeLabel)}</span><strong style="color:#1c1917;">${jobType}</strong></div>` : ''}
      ${displayDeadline ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.dateLabel)}</span><strong style="color:#1c1917;">${displayDeadline}</strong></div>` : ''}
    </div>` : ''

  const primaryCtaHref = (applyLink && actionBtnText && !statusInfo.isExpired) ? applyLink : officialLink
  const primaryCtaLabel = statusInfo.isExpired
    ? 'View Archived Official Portal ↗'
    : ((applyLink && actionBtnText) ? actionBtnText : officialBtnText)

  const bannerBg = statusInfo.isExpired ? '#f5f5f4' : '#ecfdf5'
  const bannerBorder = statusInfo.isExpired ? '#d6d3d1' : '#a7f3d0'
  const bannerTitleColor = statusInfo.isExpired ? '#44403c' : '#065f46'
  const bannerSubColor = statusInfo.isExpired ? '#57534e' : '#047857'
  const bannerBtnBg = statusInfo.isExpired ? '#57534e' : '#059669'

  const statusBanner = `
    <div style="background:${bannerBg};border:1px solid ${bannerBorder};padding:16px;margin-bottom:24px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div>
        <strong style="color:${bannerTitleColor};display:block;font-size:14px;">${escapeHtml(statusInfo.label || statusInfo.status || 'OFFICIAL NOTICE')}${displayDeadline ? ` — ${escapeHtml(labels.dateLabel)}: ${displayDeadline}` : ''}</strong>
        <span style="color:${bannerSubColor};font-size:12px;">${escapeHtml(statusInfo.description || '')}</span>
      </div>
      ${primaryCtaHref ? `<a href="${primaryCtaHref}" target="_blank" rel="noopener noreferrer" style="background:${bannerBtnBg};color:#ffffff;padding:8px 16px;font-size:12px;font-weight:700;text-decoration:none;border-radius:4px;">${primaryCtaLabel}</a>` : ''}
    </div>`

  const guideBanner = hasArticle ? `
    <div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:16px;margin-bottom:24px;border-radius:2px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div>
        <strong style="color:#065f46;display:block;font-size:14px;">Comprehensive Editorial Guide &amp; Details Available</strong>
        <span style="color:#047857;font-size:12px;">CareerDost has published an in-depth editorial guide for this opportunity featuring full eligibility matrices, required documents checklist, syllabus breakdown, and step-by-step application procedures.</span>
      </div>
      <a href="/jobs/${escapeHtml(update.slug)}" style="background:#059669;color:#ffffff;padding:8px 16px;font-size:12px;font-weight:700;text-decoration:none;border-radius:2px;">Read Full Guide →</a>
    </div>` : ''

  const transparencyText = escapeHtml(getSectorTransparencyNote(update, category))
  const transparencyNote = `
    <div style="background:#faf9f6;border-left:4px solid #059669;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#44403c;">
      <strong>Official Source &amp; Editorial Transparency:</strong> ${transparencyText}
    </div>`

  const actionButtons = (officialLink || (applyLink && actionBtnText)) ? `
    <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:20px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div>
        <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;display:block;">Verified Official Source</strong>
        <span style="font-size:12px;color:#78716c;">Verified CareerDost ${escapeHtml(labels.badge || 'Public')} Record</span>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${officialLink ? `<a href="${officialLink}" target="_blank" rel="noopener noreferrer" style="border:1px solid #d6d3d1;background:#ffffff;color:#1c1917;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none;">${officialBtnText}</a>` : ''}
        ${(!statusInfo.isExpired && applyLink && actionBtnText && applyLink !== officialLink) ? `<a href="${applyLink}" target="_blank" rel="noopener noreferrer" style="background:#059669;color:#ffffff;padding:8px 20px;font-size:12px;font-weight:600;text-decoration:none;">${actionBtnText}</a>` : ''}
      </div>
    </div>` : ''

  return `
    <div class="min-h-screen flex flex-col bg-paper">
      <header class="border-b border-line bg-white sticky top-0 z-40 shadow-xs">
        <div class="container-x">
          <div class="flex items-center justify-between h-16 gap-4 border-b border-line/50">
            <a href="/" class="flex items-baseline gap-1.5 shrink-0 group">
              <span class="font-serif text-2xl sm:text-3xl font-bold text-ink group-hover:text-green transition-colors">
                CareerDost
              </span>
            </a>
          </div>
        </div>
      </header>
      <main class="flex-1">
        <article class="container-x py-8 sm:py-12 max-w-4xl font-sans">
          <nav class="text-xs text-inksoft mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            <a href="/" class="hover:text-green">Home</a>
            <span>/</span>
            <a href="/daily-updates" class="hover:text-green">Daily Updates</a>
            <span>/</span>
            <span class="text-ink font-semibold truncate max-w-xs">${title}</span>
          </nav>
          <header class="mb-6">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
              <span class="bg-green/10 text-green text-xs font-sans font-bold px-3 py-1 rounded-full border border-green/20">
                ${typeBadge}
              </span>
              <span class="${getVerificationTier(update).pillClass} text-xs font-sans font-bold px-3 py-1 rounded-full border">
                ${getVerificationTier(update).icon} ${getVerificationTier(update).label}
              </span>
              <span class="text-xs font-sans text-inksoft">
                Published: ${pubDate}
              </span>
              ${updatedDate && updatedDate !== pubDate ? `<span class="text-xs font-sans text-inksoft">• Verified: ${updatedDate}</span>` : ''}
              <span class="text-xs font-sans text-inksoft">• By <a href="/about#editorial-team" style="color:#0f172a;font-weight:600;text-decoration:underline;">Faizan Ali &amp; CareerDost Editorial Desk</a></span>
            </div>
            <h1 class="font-serif text-2xl sm:text-4xl font-bold text-ink leading-tight mb-4">
              ${title}
            </h1>
            ${shortDesc ? `<p class="font-sans text-base sm:text-lg text-inksoft leading-relaxed border-l-4 border-green pl-4 py-1 bg-paper mb-6">${shortDesc}</p>` : ''}
            ${update.featured_image ? `
            <div class="relative aspect-[16/9] w-full bg-slate-900 rounded-xs overflow-hidden mb-6 shadow-xs" style="aspect-ratio:16/9;width:100%;margin-bottom:24px;border-radius:2px;overflow:hidden;background:#0f172a;">
              <img src="${update.featured_image}" alt="${escapeHtml(update.image_alt || update.title)}" width="1200" height="675" style="width:100%;height:100%;object-fit:cover;display:block;" fetchpriority="high" />
            </div>` : ''}
            ${specsBox}
          </header>
          ${guideBanner}
          ${statusBanner}
          ${transparencyNote}
          <div class="font-sans text-ink text-base leading-relaxed space-y-5 mb-10 border-b border-line pb-8">
            ${contentHtml}
          </div>
          ${actionButtons}
        </article>
      </main>
      ${generateSsrFooterHtml()}
    </div>
  `
}

function generateJobHtml(article, canonical) {
  const title = escapeHtml(article.title || '')
  const categorySlug = escapeHtml(article.category_slug || 'government-jobs')
  const cType = getContentType(article)
  const labels = getContentTypeLabels(cType, article)
  const statusInfo = getContextualStatus(article, cType)
  const categoryLabel = escapeHtml(getCategoryLabel(article.category_slug || 'government-jobs'))
  const org = article.organization ? escapeHtml(article.organization) : ''
  const loc = article.location ? escapeHtml(article.location) : ''
  const qual = article.qualification ? escapeHtml(article.qualification) : ''
  const salary = article.salary ? escapeHtml(article.salary) : ''
  const pos = article.positions ? escapeHtml(article.positions) : ''
  const exp = article.experience ? escapeHtml(article.experience) : ''
  const jobType = article.job_type ? escapeHtml(article.job_type) : ''
  const pubDate = article.publish_date ? escapeHtml(article.publish_date) : ''
  const updatedDate = article.updated_at ? escapeHtml(String(article.updated_at).split(' ')[0].split('T')[0]) : pubDate
  const lastDate = article.last_date ? escapeHtml(article.last_date) : ''
  const excerpt = article.excerpt ? escapeHtml(article.excerpt) : ''
  const officialLink = article.official_link ? escapeHtml(article.official_link) : ''
  const applyLink = article.apply_link ? escapeHtml(article.apply_link) : ''
  const contentHtml = renderContentBlocks(article.content, article.title)

  const typeBadge = cType === 'job' ? categoryLabel : escapeHtml(labels.badge || 'Public Notice')
  const actionBtnText = labels.ctaLabel ? escapeHtml(labels.ctaLabel) : ''
  const officialBtnText = escapeHtml(labels.ctaSecondary || labels.ctaLabel || 'Official Website / Gazette ↗')
  const displaySalary = labels.salLabel && salary ? salary : ''
  const displayLastDate = (cType === 'guide' || article.no_deadline) ? '' : lastDate

  const specsBox = (org || loc || qual || pos || exp || displaySalary || jobType || displayLastDate) ? `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-paper border border-line mb-6 text-xs" style="background:#faf9f6;border:1px solid #e7e5e4;padding:16px;margin-bottom:24px;">
      ${org ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.orgLabel)}</span><strong style="color:#1c1917;">${org}</strong></div>` : ''}
      ${loc ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.locLabel)}</span><strong style="color:#1c1917;">${loc}</strong></div>` : ''}
      ${qual ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.qualLabel)}</span><strong style="color:#1c1917;">${qual}</strong></div>` : ''}
      ${pos ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.posLabel)}</span><strong style="color:#1c1917;">${pos}</strong></div>` : ''}
      ${exp && labels.expLabel ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.expLabel)}</span><strong style="color:#1c1917;">${exp}</strong></div>` : ''}
      ${displaySalary ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.salLabel)}</span><strong style="color:#059669;">${displaySalary}</strong></div>` : ''}
      ${jobType ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.typeLabel)}</span><strong style="color:#1c1917;">${jobType}</strong></div>` : ''}
      ${displayLastDate ? `<div><span style="color:#78716c;display:block;">${escapeHtml(labels.dateLabel)}</span><strong style="color:#1c1917;">${displayLastDate}</strong></div>` : ''}
    </div>` : ''

  const primaryCtaHref = (applyLink && actionBtnText && !statusInfo.isExpired) ? applyLink : officialLink
  const primaryCtaLabel = statusInfo.isExpired
    ? 'View Archived Official Portal ↗'
    : ((applyLink && actionBtnText) ? actionBtnText : officialBtnText)

  const bannerBg = statusInfo.isExpired ? '#f5f5f4' : '#ecfdf5'
  const bannerBorder = statusInfo.isExpired ? '#d6d3d1' : '#a7f3d0'
  const bannerTitleColor = statusInfo.isExpired ? '#44403c' : '#065f46'
  const bannerSubColor = statusInfo.isExpired ? '#57534e' : '#047857'
  const bannerBtnBg = statusInfo.isExpired ? '#57534e' : '#059669'

  const statusBanner = `
    <div style="background:${bannerBg};border:1px solid ${bannerBorder};padding:16px;margin-bottom:24px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div>
        <strong style="color:${bannerTitleColor};display:block;font-size:14px;">${escapeHtml(statusInfo.label || statusInfo.status || 'OFFICIAL NOTICE')}${displayLastDate ? ` — ${escapeHtml(labels.dateLabel)}: ${displayLastDate}` : ''}</strong>
        <span style="color:${bannerSubColor};font-size:12px;">${escapeHtml(statusInfo.description || '')}</span>
      </div>
      ${primaryCtaHref ? `<a href="${primaryCtaHref}" target="_blank" rel="noopener noreferrer" style="background:${bannerBtnBg};color:#ffffff;padding:8px 16px;font-size:12px;font-weight:700;text-decoration:none;border-radius:4px;">${primaryCtaLabel}</a>` : ''}
    </div>`

  const transparencyText = escapeHtml(getSectorTransparencyNote(article, categorySlug))
  const transparencyNote = `
    <div style="background:#faf9f6;border-left:4px solid #059669;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#44403c;">
      <strong>Official Source &amp; Editorial Transparency:</strong> ${transparencyText}
    </div>`

  const recordTypeLabel = cType === 'job'
    ? 'Verified CareerDost Recruitment Record'
    : `Verified CareerDost ${escapeHtml(labels.badge || 'Public')} Record`

  const actionButtons = (officialLink || (applyLink && actionBtnText)) ? `
    <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:20px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div>
        <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;display:block;">Official Source &amp; Portal Links</strong>
        <span style="font-size:12px;color:#78716c;">${recordTypeLabel}</span>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${officialLink ? `<a href="${officialLink}" target="_blank" rel="noopener noreferrer" style="border:1px solid #d6d3d1;background:#ffffff;color:#1c1917;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none;border-radius:2px;">${officialBtnText}</a>` : ''}
        ${(!statusInfo.isExpired && applyLink && actionBtnText && applyLink !== officialLink) ? `<a href="${applyLink}" target="_blank" rel="noopener noreferrer" style="background:#059669;color:#ffffff;padding:8px 20px;font-size:12px;font-weight:600;text-decoration:none;border-radius:2px;">${actionBtnText}</a>` : ''}
      </div>
    </div>` : ''

  const isSindhGovJob = (title + ' ' + loc + ' ' + org).toLowerCase().match(/\b(sindh|karachi|hyderabad|sukkur|larkana|badin|spsc|sts)\b/i)
  const isNjpJob = (title + ' ' + loc + ' ' + org + ' ' + (applyLink || '') + ' ' + (officialLink || '') + ' ' + (article.slug || '')).toLowerCase().includes('njp') || (applyLink || '').includes('njp.gov.pk')
  const applicantResourcesBox = `
    <div style="background:#faf9f6;border:1px solid #e7e5e4;border-radius:2px;padding:20px;margin-bottom:32px;font-family:sans-serif;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#059669;margin-bottom:6px;">
        CareerDost Applicant Preparation Resources
      </div>
      <strong style="font-family:serif;font-size:16px;color:#1c1917;display:block;margin-bottom:8px;">
        Verify Your Application File Before Applying
      </strong>
      <p style="font-size:13px;color:#78716c;margin-bottom:14px;line-height:1.5;">
        Avoid recruitment portal scrutiny rejections by reviewing mandatory documents, domicile requirements, and application rules:
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:10px;font-size:12px;">
        ${isSindhGovJob ? `<a href="/jobs/sindh-government-jobs-2026" style="background:#ffffff;border:1px solid #a7f3d0;padding:10px 12px;border-radius:2px;color:#047857;text-decoration:none;font-weight:700;">Sindh Govt Jobs 2026 Directory →</a>` : ''}
        ${(isNjpJob && article.slug !== 'national-job-portal-njp-pakistan-application-guide') ? `<a href="/jobs/national-job-portal-njp-pakistan-application-guide" style="background:#ffffff;border:1px solid #a7f3d0;padding:10px 12px;border-radius:2px;color:#047857;text-decoration:none;font-weight:700;">NJP Application Guide 2026 →</a>` : ''}
        <a href="/jobs/government-jobs-documents-checklist-pakistan-2026" style="background:#ffffff;border:1px solid #e7e5e4;padding:10px 12px;border-radius:2px;color:#1c1917;text-decoration:none;font-weight:600;">Government Jobs Documents Checklist →</a>
        <a href="/tools/job-readiness-checker" style="background:#ffffff;border:1px solid #a7f3d0;padding:10px 12px;border-radius:2px;color:#047857;text-decoration:none;font-weight:700;">✓ Job Readiness Checker →</a>
        <a href="/jobs/njp-application-rejection-12-common-mistakes-avoid" style="background:#ffffff;border:1px solid #e7e5e4;padding:10px 12px;border-radius:2px;color:#1c1917;text-decoration:none;font-weight:600;">12 Common Application Mistakes →</a>
      </div>
    </div>`

  return `
    <div class="min-h-screen flex flex-col bg-paper">
      <header class="border-b border-line bg-white sticky top-0 z-40 shadow-xs">
        <div class="container-x">
          <div class="flex items-center justify-between h-16 gap-4 border-b border-line/50">
            <a href="/" class="flex items-baseline gap-1.5 shrink-0 group">
              <span class="font-serif text-2xl sm:text-3xl font-bold text-ink group-hover:text-green transition-colors">
                CareerDost
              </span>
            </a>
          </div>
        </div>
      </header>
      <main class="flex-1">
        <article class="container-x py-8 sm:py-12 max-w-4xl font-sans">
          <nav class="text-xs text-inksoft mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            <a href="/" class="hover:text-green">Home</a>
            <span>/</span>
            <a href="/category/${categorySlug}" class="hover:text-green">${categoryLabel}</a>
            <span>/</span>
            <span class="text-ink font-semibold truncate max-w-xs">${title}</span>
          </nav>
          <header class="mb-6">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
              <a href="/category/${categorySlug}" class="bg-green/10 text-green text-xs font-sans font-bold px-3 py-1 rounded-full border border-green/20">
                ${typeBadge}
              </a>
              <span class="${getVerificationTier(article).pillClass} text-xs font-sans font-bold px-3 py-1 rounded-full border">
                ${getVerificationTier(article).icon} ${getVerificationTier(article).label}
              </span>
              <span class="text-xs font-sans text-inksoft">
                Published: ${pubDate}
              </span>
              ${updatedDate && updatedDate !== pubDate ? `<span class="text-xs font-sans text-inksoft">• Verified: ${updatedDate}</span>` : ''}
              <span class="text-xs font-sans text-inksoft">• By <a href="/about#editorial-team" style="color:#0f172a;font-weight:600;text-decoration:underline;">Faizan Ali &amp; CareerDost Editorial Desk</a></span>
            </div>
            <h1 class="font-serif text-2xl sm:text-4xl font-bold text-ink leading-tight mb-4">
              ${title}
            </h1>
            ${excerpt ? `<p class="font-sans text-base sm:text-lg text-inksoft leading-relaxed border-l-4 border-green pl-4 py-1 bg-paper mb-6">${excerpt}</p>` : ''}
            ${article.featured_image ? `
            <div class="relative aspect-[16/9] w-full bg-slate-900 rounded-xs overflow-hidden mb-6 shadow-xs" style="aspect-ratio:16/9;width:100%;margin-bottom:24px;border-radius:2px;overflow:hidden;background:#0f172a;">
              <img src="${article.featured_image}" alt="${escapeHtml(article.image_alt || article.title)}" width="1200" height="675" style="width:100%;height:100%;object-fit:cover;display:block;" fetchpriority="high" />
            </div>` : ''}
            ${specsBox}
          </header>
          ${statusBanner}
          ${transparencyNote}
          <div class="font-sans text-ink text-base leading-relaxed space-y-5 mb-10 border-b border-line pb-8">
            ${contentHtml}
          </div>
          ${applicantResourcesBox}
          ${actionButtons}
        </article>
      </main>
      ${generateSsrFooterHtml()}
    </div>
  `
}

const CATEGORY_META = {
  'government-jobs': {
    label: 'Government Jobs',
    short: 'Govt Jobs',
    description: 'Federal, provincial and departmental vacancies advertised in Pakistan — from BPS-05 clerical posts to BPS-20 management positions.'
  },
  'private-jobs': {
    label: 'Private Jobs',
    short: 'Private',
    description: 'Openings from private companies, NGOs and multinationals operating in Pakistan across sales, operations, engineering and support roles.'
  },
  'bank-jobs': {
    label: 'Bank Jobs',
    short: 'Banking',
    description: 'Teller, officer grade and management trainee positions from commercial banks, microfinance banks and the State Bank of Pakistan.'
  },
  'it-jobs': {
    label: 'IT Jobs',
    short: 'IT',
    description: 'Software, QA, DevOps and IT-support roles from software houses and tech teams hiring across Pakistan and for remote work.'
  },
  'scholarships': {
    label: 'Scholarships',
    short: 'Scholarships',
    description: 'Fully funded and partial scholarships for undergraduate, graduate and PhD study in Pakistan and abroad.'
  },
  'internships': {
    label: 'Internships',
    short: 'Internships',
    description: 'Paid and unpaid internship openings for students and recent graduates across government departments and private organisations.'
  },
  'admissions': {
    label: 'Admissions',
    short: 'Admissions',
    description: 'Open admissions, entry test schedules and merit-list dates for universities, colleges and professional institutes.'
  },
  'government-schemes': {
    label: 'Government Schemes',
    short: 'Schemes',
    description: 'Welfare, subsidy and support programmes launched by federal and provincial governments, including how to check eligibility.'
  },
  'results': {
    label: 'Results',
    short: 'Results',
    description: 'Announced results and roll-number slips for board exams, entry tests and recruitment tests across Pakistan.'
  },
  'guides-and-resources': {
    label: 'Career Guides & Resources',
    short: 'Guides & Resources',
    description: 'Original Pakistani recruitment test guides, application walkthroughs, document checklists, CV templates, interview preparation, and career resources.'
  }
}

function getCategoryLabel(slug) {
  if (!slug) return 'Update'
  if (slug === 'career-guides') return 'Career Guides & Resources'
  if (CATEGORY_META[slug]?.label) return CATEGORY_META[slug].label
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function generateCategoryHtml(slug, catMeta, articles, canonical) {
  const label = escapeHtml(catMeta.label || slug)
  const desc = escapeHtml(catMeta.description || '')
  const count = articles.length

  const allCategoriesNav = [
    { slug: 'government-jobs', label: 'Govt Jobs' },
    { slug: 'private-jobs', label: 'Private Jobs' },
    { slug: 'bank-jobs', label: 'Bank Jobs' },
    { slug: 'it-jobs', label: 'IT Jobs' },
    { slug: 'scholarships', label: 'Scholarships' },
    { slug: 'internships', label: 'Internships' },
    { slug: 'admissions', label: 'Admissions' },
    { slug: 'government-schemes', label: 'Schemes' },
    { slug: 'results', label: 'Results' },
    { slug: 'guides-and-resources', label: 'Guides & Resources' },
  ]

  const navPills = allCategoriesNav.map((c) => {
    const isCurrent = c.slug === slug
    const style = isCurrent
      ? 'background:#059669;color:#ffffff;border:1px solid #059669;padding:6px 12px;font-size:12px;text-decoration:none;font-weight:600;border-radius:2px;'
      : 'background:#ffffff;color:#1c1917;border:1px solid #e7e5e4;padding:6px 12px;font-size:12px;text-decoration:none;border-radius:2px;'
    return `<a href="/category/${c.slug}" style="${style}">${escapeHtml(c.label)}</a>`
  }).join(' ')

  const todayYmd = getPktTodayYMD()
  const articleCards = articles.length > 0 ? articles.map((art) => {
    const artTitle = escapeHtml(art.title || '')
    const artOrg = art.organization ? escapeHtml(art.organization) : ''
    const artLoc = art.location ? escapeHtml(art.location) : 'Pakistan'
    const isNoDeadline = Boolean(art.no_deadline || art.noDeadline)
    const lastDateVal = art.last_date || art.lastDate
    const isEvergreenText = /evergreen|guide|ongoing|rolling/i.test(String(lastDateVal || ''))
    const lastDateYmd = (isNoDeadline || isEvergreenText) ? null : normalizeDateToYMD(lastDateVal)
    const isExpired = !isNoDeadline && !isEvergreenText && Boolean(
      (lastDateYmd && lastDateYmd < todayYmd) ||
      (lastDateVal && /closed|expired/i.test(String(lastDateVal)))
    )
    const artDate = lastDateVal ? escapeHtml(lastDateVal) : (art.publish_date ? `Posted ${escapeHtml(art.publish_date)}` : '')
    const artExcerpt = art.excerpt ? escapeHtml(art.excerpt) : ''
    const artImg = art.featured_image ? getAbsoluteUrl(art.featured_image) : ''
    const artAlt = escapeHtml(art.image_alt || art.title || '')
    const vTier = getVerificationTier(art)
    const tierStyle = vTier.tier === 'editorial' || vTier.status === 'EDITORIAL_GUIDE'
      ? 'background:#f0fdf4;color:#166534;border:1px solid #86efac;'
      : (vTier.tier === 1
        ? 'background:#ecfdf5;color:#065f46;border:1px solid #6ee7b7;'
        : (vTier.tier === 2 ? 'background:#fffbeb;color:#92400e;border:1px solid #fcd34d;' : 'background:#f8fafc;color:#475569;border:1px solid #cbd5e1;'))

    return `
      <article class="bg-white border border-line rounded-xs overflow-hidden shadow-xs hover:border-green transition-all flex flex-col justify-between" style="background:#ffffff;border:1px solid #e7e5e4;border-radius:2px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
        ${artImg ? `
        <div style="aspect-ratio:16/9;width:100%;overflow:hidden;background:#0f172a;">
          <img src="${artImg}" alt="${artAlt}" width="600" height="338" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>` : ''}
        <div style="padding:16px;flex:1;display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:8px;flex-wrap:wrap;gap:4px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="color:#059669;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${label}</span>
              <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:2px;${tierStyle}">${vTier.icon} ${escapeHtml(vTier.shortLabel)}</span>
            </div>
            ${isExpired
              ? '<span style="background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;padding:2px 6px;border-radius:2px;font-size:10px;font-weight:700;">CLOSED / EXPIRED</span>'
              : (artDate ? `<span style="color:#78716c;">${artDate}</span>` : '')}
          </div>
          <h2 style="font-family:serif;font-size:16px;font-weight:700;line-height:1.35;margin-bottom:8px;color:#1c1917;">
            <a href="/jobs/${art.slug}" style="color:#1c1917;text-decoration:none;">${artTitle}</a>
          </h2>
          ${artOrg ? `<p style="font-size:12px;color:#78716c;margin-bottom:8px;font-weight:500;">${artOrg}</p>` : ''}
          ${artExcerpt ? `<p style="font-size:12px;color:#78716c;line-height:1.5;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${artExcerpt}</p>` : ''}
          <div style="margin-top:auto;padding-top:12px;border-top:1px solid #f5f5f4;display:flex;justify-content:space-between;align-items:center;font-size:12px;">
            <span style="color:#78716c;">${artLoc}</span>
            <a href="/jobs/${art.slug}" style="color:#059669;font-weight:600;text-decoration:none;">View Details →</a>
          </div>
        </div>
      </article>
    `
  }).join('\n') : `
    <div style="grid-column:1/-1;padding:48px 16px;text-align:center;color:#78716c;">
      <p>No listings currently available in this category. Please check back soon.</p>
    </div>
  `

  return `
    <div class="min-h-screen flex flex-col bg-paper font-sans">
      <header class="border-b border-line bg-white sticky top-0 z-40 shadow-xs" style="background:#ffffff;border-bottom:1px solid #e7e5e4;">
        <div class="container-x">
          <div class="flex items-center justify-between h-16 gap-4 border-b border-line/50">
            <a href="/" class="flex items-baseline gap-1.5 shrink-0 group" style="text-decoration:none;">
              <span class="font-serif text-2xl sm:text-3xl font-bold text-ink" style="color:#1c1917;">
                CareerDost
              </span>
            </a>
            <nav class="hidden md:flex items-center gap-6 text-sm font-sans font-medium text-ink">
              <a href="/daily-updates" style="color:#1c1917;text-decoration:none;margin-right:16px;">Daily Updates</a>
              <a href="/category/government-jobs" style="color:#1c1917;text-decoration:none;margin-right:16px;">Govt Jobs</a>
              <a href="/category/scholarships" style="color:#1c1917;text-decoration:none;margin-right:16px;">Scholarships</a>
              <a href="/category/admissions" style="color:#1c1917;text-decoration:none;margin-right:16px;">Admissions</a>
              <a href="/category/guides-and-resources" style="color:#1c1917;text-decoration:none;margin-right:16px;">Guides &amp; Resources</a>
              <a href="/about" style="color:#1c1917;text-decoration:none;">About</a>
            </nav>
          </div>
        </div>
      </header>
      <main class="flex-1">
        <div class="container-x py-8" style="padding-top:32px;padding-bottom:32px;">
          <nav style="font-size:12px;color:#78716c;margin-bottom:12px;" aria-label="Breadcrumb">
            <a href="/" style="color:#059669;text-decoration:none;">Home</a>
            <span style="margin:0 6px;">/</span>
            <span style="color:#1c1917;">${label}</span>
          </nav>

          <h1 class="font-serif text-2xl sm:text-3xl font-bold text-ink mb-2" style="font-family:serif;font-size:28px;font-weight:700;color:#1c1917;margin-bottom:8px;">${label} in Pakistan</h1>
          ${desc ? `<p class="font-sans text-inksoft max-w-2xl mb-6" style="color:#78716c;max-width:42rem;margin-bottom:24px;font-size:14px;line-height:1.6;">${desc}</p>` : ''}

          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
            ${navPills}
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e7e5e4;padding-bottom:12px;margin-bottom:24px;">
            <span style="font-size:12px;color:#78716c;font-weight:600;">${count} verified listing${count === 1 ? '' : 's'}</span>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:24px;margin-bottom:48px;">
            ${articleCards}
          </div>
        </div>
      </main>
      ${generateSsrFooterHtml()}
    </div>
  `
}

function generateSindhPillarHtml(articles, canonical) {
  const todayIso = getPktTodayYMD()
  const activeArticles = []
  const archivedArticles = []

  for (const art of (articles || [])) {
    if (!art || !art.slug || art.slug === 'sindh-government-jobs-2026' || CONSOLIDATED_SLUG_REDIRECTS.has(art.slug)) {
      continue
    }
    const lastDate = art.last_date || art.lastDate
    const lastYmd = normalizeDateToYMD(lastDate)
    const isClosed = Boolean(
      (lastYmd && lastYmd < todayIso) ||
      (lastDate && /closed|expired/i.test(String(lastDate)))
    )
    if (isClosed) {
      archivedArticles.push(art)
    } else {
      activeArticles.push(art)
    }
  }

  const articleCards = activeArticles && activeArticles.length > 0 ? activeArticles.slice(0, 24).map((art) => {
    const artTitle = escapeHtml(art.title || '')
    const artOrg = art.organization ? escapeHtml(art.organization) : ''
    const artLoc = art.location ? escapeHtml(art.location) : 'Sindh, Pakistan'
    const artDate = art.publish_date ? escapeHtml(art.publish_date) : ''
    const artLastDate = art.last_date ? escapeHtml(art.last_date) : ''
    const artExcerpt = art.excerpt ? escapeHtml(art.excerpt) : ''
    const artImg = art.featured_image ? getAbsoluteUrl(art.featured_image) : ''
    const artAlt = escapeHtml(art.image_alt || art.title || 'Sindh Job Vacancy')

    return `
      <article style="background:#ffffff;border:1px solid #e7e5e4;border-radius:2px;overflow:hidden;display:flex;flex-direction:column;">
        ${artImg ? `
        <div style="aspect-ratio:16/9;width:100%;overflow:hidden;background:#0f172a;">
          <img src="${artImg}" alt="${artAlt}" width="600" height="338" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>` : ''}
        <div style="padding:16px;flex:1;display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:8px;">
            <span style="color:#059669;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Sindh Govt Job</span>
            ${artDate ? `<span style="color:#78716c;">${artDate}</span>` : ''}
          </div>
          <h2 style="font-family:serif;font-size:16px;font-weight:700;line-height:1.35;margin-bottom:8px;color:#1c1917;">
            <a href="/jobs/${art.slug}" style="color:#1c1917;text-decoration:none;">${artTitle}</a>
          </h2>
          ${artOrg ? `<p style="font-size:12px;color:#78716c;margin-bottom:6px;font-weight:600;">${artOrg}</p>` : ''}
          ${artExcerpt ? `<p style="font-size:12px;color:#78716c;line-height:1.5;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${artExcerpt}</p>` : ''}
          <div style="margin-top:auto;padding-top:12px;border-top:1px solid #f5f5f4;display:flex;justify-content:space-between;align-items:center;font-size:12px;">
            <span style="color:#78716c;">${artLoc}</span>
            <a href="/jobs/${art.slug}" style="color:#059669;font-weight:600;text-decoration:none;">${artLastDate ? `Apply by ${artLastDate} →` : 'View Details →'}</a>
          </div>
        </div>
      </article>
    `
  }).join('\n') : `
    <div style="grid-column:1/-1;padding:48px 16px;text-align:center;color:#78716c;background:#ffffff;border:1px solid #e7e5e4;">
      <p>No active Sindh vacancies currently listed. Check back regularly or view recent notices below.</p>
    </div>
  `

  const archivedRows = archivedArticles.slice(0, 6).map((art) => `
    <div style="background:#ffffff;border:1px solid #e7e5e4;padding:12px 16px;margin-bottom:8px;border-radius:2px;display:flex;justify-content:space-between;align-items:center;font-size:13px;">
      <a href="/jobs/${art.slug}" style="color:#1c1917;text-decoration:none;font-weight:600;">${escapeHtml(art.title)}</a>
      <span style="color:#78716c;font-size:11px;background:#f5f5f4;padding:2px 8px;border-radius:2px;white-space:nowrap;">Deadline Passed</span>
    </div>
  `).join('\n')

  return `
    <div class="min-h-screen flex flex-col bg-paper font-sans" style="background:#faf9f6;">
      <header class="border-b border-line bg-white sticky top-0 z-40 shadow-xs" style="background:#ffffff;border-bottom:1px solid #e7e5e4;">
        <div class="container-x">
          <div class="flex items-center justify-between h-16 gap-4 border-b border-line/50">
            <a href="/" class="flex items-baseline gap-1.5 shrink-0 group" style="text-decoration:none;">
              <span class="font-serif text-2xl sm:text-3xl font-bold text-ink" style="color:#1c1917;">
                CareerDost
              </span>
            </a>
            <nav class="hidden md:flex items-center gap-6 text-sm font-sans font-medium text-ink">
              <a href="/daily-updates" style="color:#1c1917;text-decoration:none;margin-right:16px;">Daily Updates</a>
              <a href="/category/government-jobs" style="color:#1c1917;text-decoration:none;margin-right:16px;">Govt Jobs</a>
              <a href="/category/scholarships" style="color:#1c1917;text-decoration:none;margin-right:16px;">Scholarships</a>
              <a href="/category/admissions" style="color:#1c1917;text-decoration:none;margin-right:16px;">Admissions</a>
              <a href="/category/guides-and-resources" style="color:#1c1917;text-decoration:none;margin-right:16px;">Guides &amp; Resources</a>
              <a href="/about" style="color:#1c1917;text-decoration:none;">About</a>
            </nav>
          </div>
        </div>
      </header>
      <main class="flex-1">
        <div class="container-x py-8" style="padding-top:32px;padding-bottom:48px;max-width:1024px;margin:0 auto;padding-left:16px;padding-right:16px;">
          <nav style="font-size:12px;color:#78716c;margin-bottom:16px;" aria-label="Breadcrumb">
            <a href="/" style="color:#059669;text-decoration:none;">Home</a>
            <span style="margin:0 6px;">/</span>
            <a href="/category/government-jobs" style="color:#059669;text-decoration:none;">Government Jobs</a>
            <span style="margin:0 6px;">/</span>
            <span style="color:#1c1917;font-weight:600;">Sindh Government Jobs 2026</span>
          </nav>

          <header style="margin-bottom:32px;border-bottom:1px solid #e7e5e4;padding-bottom:24px;">
            <div style="display:inline-block;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;padding:4px 12px;font-size:12px;font-weight:700;border-radius:9999px;margin-bottom:12px;">
              ✓ Verified Provincial Recruitment Hub
            </div>
            <h1 style="font-family:serif;font-size:32px;font-weight:700;color:#1c1917;line-height:1.25;margin-bottom:16px;">
              Sindh Government Jobs 2026 — Latest Vacancies
            </h1>
            <p style="font-size:16px;color:#44403c;line-height:1.6;margin-bottom:16px;">
              Welcome to CareerDost’s verified directory of <strong>Sindh Government Jobs 2026</strong>. Public sector departments across Sindh—including the <strong>Sindh Public Service Commission (SPSC)</strong>, <strong>Sukkur IBA Testing Services (STS)</strong>, <strong>High Court of Sindh &amp; District Judiciary</strong>, and provincial municipal corporations—regularly announce recruitment notices across all 30 districts of Sindh, including Karachi, Hyderabad, Sukkur, Larkana, and Badin.
            </p>
            <div style="background:#ffffff;border-left:4px solid #059669;padding:16px;font-size:14px;color:#1c1917;line-height:1.6;border-radius:2px;border:1px solid #e7e5e4;border-left-width:4px;border-left-color:#059669;">
              <strong>Key Recruitment Update (2026 Policy):</strong> The Sindh Services, General Administration &amp; Coordination Department (S&amp;GAD) enforces a general <strong>15-year upper age relaxation</strong> (up to 43 years for general provincial posts). Candidates holding a valid <strong>Sindh Domicile</strong> and <strong>PRC Form "D"</strong> are eligible to apply under designated Rural (60%) and Urban (40%) provincial quota allocations.
            </div>
          </header>

          <div style="aspect-ratio:21/9;width:100%;margin-bottom:32px;border-radius:2px;overflow:hidden;background:#0f172a;border:1px solid #e7e5e4;">
            <img src="/images/sindh-government-jobs-2026-spsc-sts-guide.webp" alt="Sindh Government Jobs 2026 Latest Vacancies SPSC STS Online Apply Guide CareerDost" width={1200} height={514} style="width:100%;height:100%;object-fit:cover;display:block;" fetchpriority="high" />
          </div>

          <!-- Quick Facts Table -->
          <section style="background:#ffffff;border:1px solid #e7e5e4;border-radius:2px;padding:24px;margin-bottom:36px;">
            <h2 style="font-family:serif;font-size:22px;font-weight:700;color:#1c1917;margin-bottom:16px;border-bottom:1px solid #e7e5e4;padding-bottom:10px;">
              Quick Facts: Sindh Government Recruitment 2026
            </h2>
            <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin-bottom:12px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left;">
                <tbody>
                  <tr style="border-bottom:1px solid #f5f5f4;">
                    <td style="padding:10px;font-weight:600;color:#1c1917;width:32%;background:#faf9f6;">Jurisdiction</td>
                    <td style="padding:10px;color:#44403c;">Government of Sindh (Provincial, Divisional &amp; District Cadres)</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f5f5f4;">
                    <td style="padding:10px;font-weight:600;color:#1c1917;background:#faf9f6;">Official Testing Agencies</td>
                    <td style="padding:10px;color:#44403c;">SPSC (BPS-16+), Sukkur IBA Testing Services (STS BPS-05 to 15), District Selection Committees (BPS-01 to 04)</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f5f5f4;">
                    <td style="padding:10px;font-weight:600;color:#1c1917;background:#faf9f6;">General Age Limit</td>
                    <td style="padding:10px;color:#44403c;">18 to 28 years + 15 Years General S&amp;GAD Relaxation = <strong>Up to 43 Years</strong></td>
                  </tr>
                  <tr style="border-bottom:1px solid #f5f5f4;">
                    <td style="padding:10px;font-weight:600;color:#1c1917;background:#faf9f6;">Mandatory Domicile</td>
                    <td style="padding:10px;color:#44403c;">District Domicile Certificate &amp; PRC Form "D" (Rural or Urban Quota)</td>
                  </tr>
                  <tr style="border-bottom:1px solid #f5f5f4;">
                    <td style="padding:10px;font-weight:600;color:#1c1917;background:#faf9f6;">Statutory Quotas</td>
                    <td style="padding:10px;color:#44403c;">Rural 60%, Urban 40%, Women 5%, Minorities 5%, Differently-Abled 5%</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;font-weight:600;color:#1c1917;background:#faf9f6;">Official Portals</td>
                    <td style="padding:10px;color:#44403c;">
                      <a href="https://spsc.gov.pk" target="_blank" rel="noopener noreferrer" style="color:#059669;font-weight:600;text-decoration:none;margin-right:12px;">spsc.gov.pk ↗</a>
                      <a href="https://apply.sts.net.pk" target="_blank" rel="noopener noreferrer" style="color:#059669;font-weight:600;text-decoration:none;margin-right:12px;">apply.sts.net.pk ↗</a>
                      <a href="https://sindhjobs.gov.pk" target="_blank" rel="noopener noreferrer" style="color:#059669;font-weight:600;text-decoration:none;">sindhjobs.gov.pk ↗</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Active Jobs Section -->
          <section style="margin-bottom:36px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <div>
                <h2 style="font-family:serif;font-size:24px;font-weight:700;color:#1c1917;margin-bottom:4px;">
                  Active Sindh Government Job Vacancies
                </h2>
                <p style="font-size:13px;color:#78716c;">
                  Verified open positions across Karachi, Hyderabad, Sukkur, Larkana, and Badin.
                </p>
              </div>
              <span style="background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;padding:4px 12px;font-size:12px;font-weight:700;border-radius:9999px;">
                ${activeArticles.length} Active Vacancies
              </span>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(290px, 1fr));gap:20px;margin-bottom:32px;">
              ${articleCards}
            </div>
          </section>

          <!-- Documents Checklist -->
          <section style="background:#ffffff;border:1px solid #e7e5e4;border-radius:2px;padding:24px;margin-bottom:36px;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#059669;margin-bottom:6px;">
              Official Submission Guide
            </div>
            <h2 style="font-family:serif;font-size:22px;font-weight:700;color:#1c1917;margin-bottom:12px;">
              Sindh Government Jobs: Mandatory Application Documents Checklist
            </h2>
            <p style="font-size:13px;color:#78716c;margin-bottom:16px;line-height:1.5;">
              Ensure your application dossier contains attested copies of these mandatory documents before submitting to SPSC, STS, or District Selection Committees:
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:12px;font-size:13px;color:#1c1917;">
              <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:12px;border-radius:2px;">
                <strong>✓ Original CNIC:</strong> Valid NADRA CNIC with permanent address in Sindh.
              </div>
              <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:12px;border-radius:2px;">
                <strong>✓ Domicile Certificate:</strong> Issued by District Deputy Commissioner office.
              </div>
              <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:12px;border-radius:2px;">
                <strong>✓ PRC Form "D":</strong> Permanent Residence Certificate indicating Urban or Rural status.
              </div>
              <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:12px;border-radius:2px;">
                <strong>✓ Educational Certificates:</strong> Degrees, mark sheets, and diplomas (HEC/IBCC attested where required).
              </div>
              <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:12px;border-radius:2px;">
                <strong>✓ Departmental NOC:</strong> No Objection Certificate from parent department if currently employed.
              </div>
              <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:12px;border-radius:2px;">
                <strong>✓ Photographs &amp; Paid Challan:</strong> Passport-size photos with blue background and original fee receipt.
              </div>
            </div>
          </section>

          <!-- Contextual Internal Linking Hub -->
          <section style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:2px;padding:24px;margin-bottom:36px;">
            <h2 style="font-family:serif;font-size:20px;font-weight:700;color:#065f46;margin-bottom:12px;">
              Related Sindh Public Sector Guides &amp; Key Notices
            </h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:12px;font-size:13px;">
              <div style="background:#ffffff;padding:14px;border:1px solid #d1fae5;border-radius:2px;">
                <a href="/jobs/sindh-courts-bps-1-4-jobs-2026" style="color:#1c1917;text-decoration:none;font-weight:700;display:block;margin-bottom:4px;">Sindh Courts BPS-01 to 04 Jobs →</a>
                <span style="color:#78716c;font-size:12px;">District &amp; Sessions Court vacancies for peon, naib qasid &amp; driver.</span>
              </div>
              <div style="background:#ffffff;padding:14px;border:1px solid #d1fae5;border-radius:2px;">
                <a href="/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening" style="color:#1c1917;text-decoration:none;font-weight:700;display:block;margin-bottom:4px;">SPSC CCE-2026 Examination Guide →</a>
                <span style="color:#78716c;font-size:12px;">Screening test dates, age relaxation rules &amp; syllabus updates.</span>
              </div>
              <div style="background:#ffffff;padding:14px;border:1px solid #d1fae5;border-radius:2px;">
                <a href="/jobs/sindh-job-portal-2026-junior-clerk-jobs" style="color:#1c1917;text-decoration:none;font-weight:700;display:block;margin-bottom:4px;">Sindh Job Portal Junior Clerk Guide →</a>
                <span style="color:#78716c;font-size:12px;">Typing test standards, BPS-11 requirements &amp; online apply steps.</span>
              </div>
            </div>
          </section>

          <!-- FAQs Section -->
          <section style="background:#ffffff;border:1px solid #e7e5e4;border-radius:2px;padding:24px;margin-bottom:36px;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#059669;margin-bottom:6px;">
              Applicant Knowledge Base
            </div>
            <h2 style="font-family:serif;font-size:22px;font-weight:700;color:#1c1917;margin-bottom:20px;">
              Frequently Asked Questions: Sindh Public Sector Jobs
            </h2>
            <div style="display:flex;flex-direction:column;gap:16px;">
              <div style="border-bottom:1px solid #f5f5f4;padding-bottom:14px;">
                <h3 style="font-family:serif;font-size:16px;font-weight:700;color:#1c1917;margin-bottom:6px;">
                  What is the general age relaxation for Sindh Government jobs in 2026?
                </h3>
                <p style="font-size:13px;color:#44403c;line-height:1.6;">
                  The Government of Sindh (S&amp;GAD) has notified a general relaxation of up to 15 years in the upper age limit for recruitment across provincial departments. This relaxation allows candidates up to 43 years (and up to 45 years in select quota categories) to apply for general posts.
                </p>
              </div>
              <div style="border-bottom:1px solid #f5f5f4;padding-bottom:14px;">
                <h3 style="font-family:serif;font-size:16px;font-weight:700;color:#1c1917;margin-bottom:6px;">
                  Which testing agencies conduct recruitment for Sindh Government departments?
                </h3>
                <p style="font-size:13px;color:#44403c;line-height:1.6;">
                  Recruitment in Sindh is conducted through three primary channels: 1) Sindh Public Service Commission (SPSC) for gazetted posts (BPS-16 and above), 2) Sukkur IBA Testing Services (STS / SIBA) for ministerial, teaching, and general departmental vacancies (BPS-05 to BPS-15), and 3) Departmental District Selection Committees for lower-cadre posts (BPS-01 to BPS-04).
                </p>
              </div>
              <div style="border-bottom:1px solid #f5f5f4;padding-bottom:14px;">
                <h3 style="font-family:serif;font-size:16px;font-weight:700;color:#1c1917;margin-bottom:6px;">
                  Is PRC Form "D" mandatory for Sindh domicile applicants?
                </h3>
                <p style="font-size:13px;color:#44403c;line-height:1.6;">
                  Yes. Permanent Residence Certificate (PRC) Form "D" along with a valid District Domicile Certificate issued under the Pakistan Citizenship Act is legally mandatory for all provincial and district quota posts in Sindh.
                </p>
              </div>
              <div style="border-bottom:1px solid #f5f5f4;padding-bottom:14px;">
                <h3 style="font-family:serif;font-size:16px;font-weight:700;color:#1c1917;margin-bottom:6px;">
                  Where can I find BPS-1 to BPS-4 jobs (Naib Qasid, Peon, Mali, Driver) in Sindh?
                </h3>
                <p style="font-size:13px;color:#44403c;line-height:1.6;">
                  BPS-01 to BPS-04 recruitment is decentralised and advertised directly by district administrative offices, including District and Sessions Courts, Municipal Corporations, Health Facilities, and the Education Department.
                </p>
              </div>
              <div>
                <h3 style="font-family:serif;font-size:16px;font-weight:700;color:#1c1917;margin-bottom:6px;">
                  What are the quota allocations for Sindh Government recruitment?
                </h3>
                <p style="font-size:13px;color:#44403c;line-height:1.6;">
                  Under the Sindh Civil Servants Rules, recruitment is allocated based on: 60% Rural Quota and 40% Urban Quota (for Karachi, Hyderabad, and Sukkur municipal limits) for provincial positions. Statutory quotas include 5% Women, 5% Minorities, and 5% Differently-Abled Persons.
                </p>
              </div>
            </div>
          </section>

          ${archivedRows ? `
          <section style="margin-top:24px;">
            <h2 style="font-family:serif;font-size:18px;font-weight:700;color:#1c1917;margin-bottom:10px;">
              Recent Closed Notices (Reference Archive)
            </h2>
            ${archivedRows}
          </section>` : ''}
        </div>
      </main>
      ${generateSsrFooterHtml()}
    </div>
  `
}

function generateDailyUpdatesIndexHtml(updates, canonical, publishedArticleSlugs = new Set()) {
  const updatePills = [
    'All Updates',
    'Latest Jobs',
    'Government Jobs',
    'Private Jobs',
    'Bank Jobs',
    'Internships',
    'Scholarships',
    'Admissions',
    'Results',
  ]

  const navPills = updatePills.map((p, idx) => {
    const isCurrent = idx === 0
    const style = isCurrent
      ? 'background:#059669;color:#ffffff;border:1px solid #059669;padding:6px 12px;font-size:12px;text-decoration:none;font-weight:600;border-radius:2px;'
      : 'background:#ffffff;color:#1c1917;border:1px solid #e7e5e4;padding:6px 12px;font-size:12px;text-decoration:none;border-radius:2px;'
    return `<a href="/daily-updates" style="${style}">${escapeHtml(p)}</a>`
  }).join(' ')

  const cardsHtml = updates && updates.length > 0 ? updates.map((up) => {
    const upTitle = escapeHtml(up.title || '')
    const upCat = escapeHtml(getCategoryLabel(up.category) || 'Career Alert')
    const upOrg = up.organization ? escapeHtml(up.organization) : ''
    const upLoc = up.location ? escapeHtml(up.location) : 'Pakistan'
    const upDate = up.publish_date ? escapeHtml(up.publish_date) : ''
    const upDeadline = up.deadline && !up.no_deadline ? escapeHtml(up.deadline) : ''
    const upDesc = escapeHtml(up.short_description || up.meta_description || '')
    const upImg = up.featured_image ? getAbsoluteUrl(up.featured_image) : ''
    const upAlt = escapeHtml(up.image_alt || up.title || '')
    const hasArticle = publishedArticleSlugs && publishedArticleSlugs.has(up.slug)
    const upUrl = hasArticle ? `/jobs/${up.slug}` : `/daily-updates/${up.slug}`

    return `
      <article class="bg-white border border-line rounded-xs overflow-hidden shadow-xs hover:border-green transition-all flex flex-col justify-between" style="background:#ffffff;border:1px solid #e7e5e4;border-radius:2px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
        ${upImg ? `
        <div style="aspect-ratio:16/9;width:100%;overflow:hidden;background:#0f172a;">
          <img src="${upImg}" alt="${upAlt}" width="600" height="338" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>` : ''}
        <div style="padding:16px;flex:1;display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:8px;gap:8px;">
            <span style="color:#059669;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${upCat}</span>
            ${upDate ? `<span style="color:#78716c;font-size:11px;">${upDate}</span>` : ''}
          </div>
          <h2 style="font-family:serif;font-size:16px;font-weight:700;line-height:1.35;margin-bottom:8px;color:#1c1917;">
            <a href="${upUrl}" style="color:#1c1917;text-decoration:none;">${upTitle}</a>
          </h2>
          ${upOrg ? `<p style="font-size:12px;color:#78716c;margin-bottom:6px;font-weight:500;">${upOrg} • ${upLoc}</p>` : ''}
          ${upDesc ? `<p style="font-size:12px;color:#78716c;line-height:1.5;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${upDesc}</p>` : ''}
          <div style="margin-top:auto;padding-top:12px;border-top:1px solid #f5f5f4;display:flex;justify-content:space-between;align-items:center;font-size:12px;">
            <span style="color:${upDeadline ? '#b45309' : '#059669'};font-weight:500;">${upDeadline ? `Deadline: ${upDeadline}` : 'Active Alert'}</span>
            <a href="${upUrl}" style="color:#059669;font-weight:600;text-decoration:none;">Read Update →</a>
          </div>
        </div>
      </article>
    `
  }).join('\n') : `
    <div style="grid-column:1/-1;padding:48px 16px;text-align:center;color:#78716c;">
      <p>No daily updates currently published. Please check back soon.</p>
    </div>
  `

  return `
    <div class="min-h-screen flex flex-col bg-paper font-sans">
      <header class="border-b border-line bg-white sticky top-0 z-40 shadow-xs" style="background:#ffffff;border-bottom:1px solid #e7e5e4;">
        <div class="container-x">
          <div class="flex items-center justify-between h-16 gap-4 border-b border-line/50">
            <a href="/" class="flex items-baseline gap-1.5 shrink-0 group" style="text-decoration:none;">
              <span class="font-serif text-2xl sm:text-3xl font-bold text-ink" style="color:#1c1917;">
                CareerDost
              </span>
            </a>
            <nav class="hidden md:flex items-center gap-6 text-sm font-sans font-medium text-ink">
              <a href="/daily-updates" style="color:#059669;text-decoration:none;font-weight:700;margin-right:16px;">Daily Updates</a>
              <a href="/category/government-jobs" style="color:#1c1917;text-decoration:none;margin-right:16px;">Govt Jobs</a>
              <a href="/category/scholarships" style="color:#1c1917;text-decoration:none;margin-right:16px;">Scholarships</a>
              <a href="/category/admissions" style="color:#1c1917;text-decoration:none;margin-right:16px;">Admissions</a>
              <a href="/category/guides-and-resources" style="color:#1c1917;text-decoration:none;margin-right:16px;">Guides &amp; Resources</a>
              <a href="/about" style="color:#1c1917;text-decoration:none;">About</a>
            </nav>
          </div>
        </div>
      </header>
      <main class="flex-1">
        <div class="container-x py-8" style="padding-top:32px;padding-bottom:32px;">
          <nav style="font-size:12px;color:#78716c;margin-bottom:12px;" aria-label="Breadcrumb">
            <a href="/" style="color:#059669;text-decoration:none;">Home</a>
            <span style="margin:0 6px;">/</span>
            <span style="color:#1c1917;">Daily Updates</span>
          </nav>

          <div style="background:#ffffff;border:1px solid #e7e5e4;padding:24px;border-radius:2px;margin-bottom:24px;">
            <div style="display:inline-flex;align-items:center;gap:8px;background:#ecfdf5;border:1px solid #a7f3d0;padding:4px 10px;font-size:11px;font-weight:700;color:#065f46;border-radius:9999px;margin-bottom:12px;">
              <span style="width:6px;height:6px;border-radius:50%;background:#059669;display:inline-block;"></span>
              Live Pakistan Career Feed
            </div>
            <h1 class="font-serif text-2xl sm:text-4xl font-bold text-ink mb-2" style="font-family:serif;font-size:32px;font-weight:700;color:#1c1917;margin-bottom:8px;">
              Daily Updates &amp; Opportunity Alerts
            </h1>
            <p class="font-sans text-inksoft max-w-3xl" style="color:#78716c;max-width:48rem;font-size:14px;line-height:1.6;">
              Real-time updates on verified Pakistan recruitment drives, government job gazettes, university admissions, scholarship deadlines, and testing agency announcements.
            </p>
          </div>

          <div style="background:linear-gradient(to right, #064e3b, #065f46, #0f172a);color:#ffffff;padding:24px;border-radius:8px;margin-bottom:24px;border:1px solid rgba(5,150,105,0.3);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
            <div>
              <div style="display:inline-block;background:rgba(37,211,102,0.2);border:1px solid rgba(37,211,102,0.4);color:#25d366;font-size:11px;font-weight:700;padding:2px 8px;border-radius:9999px;margin-bottom:8px;text-transform:uppercase;">Official Channel</div>
              <strong style="font-family:serif;font-size:20px;display:block;color:#ffffff;">Want Daily Opportunity Alerts?</strong>
              <p style="font-size:13px;color:#a7f3d0;margin-top:4px;max-width:36rem;">Join CareerDost on WhatsApp. Get official Pakistan government &amp; private job postings, university admissions, and scholarship alerts delivered directly to your phone.</p>
            </div>
            <div>
              <a href="https://whatsapp.com/channel/0029VbDnzwFF1YlIkJax2P1o" target="_blank" rel="noopener noreferrer" style="background:#25d366;color:#020617;font-weight:700;font-size:13px;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Join CareerDost WhatsApp Channel →</a>
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
            ${navPills}
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e7e5e4;padding-bottom:12px;margin-bottom:24px;">
            <span style="font-size:12px;color:#78716c;font-weight:600;">Latest Live Updates (${updates ? updates.length : 0} items)</span>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:24px;margin-bottom:48px;">
            ${cardsHtml}
          </div>
        </div>
      </main>
      ${generateSsrFooterHtml()}
    </div>
  `
}

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const host = url.hostname.toLowerCase()

  // Local development bypass (localhost, 127.0.0.1)
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    return await context.next()
  }

  const rawPath = url.pathname
  const normalizedPath = rawPath.replace(/\/+$/, '') || '/'
  const lowerPath = normalizedPath.toLowerCase()

  // Resolve any static, legacy-prefix, or consolidated-slug redirect target in a single pass
  // so that domain + protocol + trailing-slash + path redirects always complete in 1 hop.
  let directRedirectTarget = null
  if (lowerPath === '/cdn-cgi/l/email-protection') {
    directRedirectTarget = '/contact'
  } else if (STATIC_ROUTE_REDIRECTS.has(lowerPath)) {
    directRedirectTarget = STATIC_ROUTE_REDIRECTS.get(lowerPath)
  } else {
    const routePrefixMatch = lowerPath.match(/^\/(jobs|daily-updates|article|articles|updates)\/([^/]+)$/)
    if (routePrefixMatch) {
      const prefix = routePrefixMatch[1]
      const candidateSlug = routePrefixMatch[2]
      if (CONSOLIDATED_SLUG_REDIRECTS.has(candidateSlug)) {
        directRedirectTarget = CONSOLIDATED_SLUG_REDIRECTS.get(candidateSlug)
      } else if (prefix === 'article' || prefix === 'articles') {
        directRedirectTarget = `/jobs/${candidateSlug}`
      } else if (prefix === 'updates') {
        directRedirectTarget = `/daily-updates/${candidateSlug}`
      }
    }
  }

  const isNonCanonicalHost =
    host !== 'careerdost.blog' &&
    (host === 'careerdost.pages.dev' ||
      host === 'www.careerdost.pages.dev' ||
      host.endsWith('.careerdost.pages.dev') ||
      host === 'www.careerdost.blog' ||
      host === 'careerdost.pk' ||
      host === 'www.careerdost.pk' ||
      host === 'careersdost.pk' ||
      host === 'www.careersdost.pk')
  const isHttpOnCanonical = url.protocol === 'http:' && host === 'careerdost.blog'
  const hasTrailingSlash = rawPath.length > 1 && rawPath.endsWith('/')

  if (isNonCanonicalHost || isHttpOnCanonical || hasTrailingSlash || directRedirectTarget) {
    let finalPathAndHash = directRedirectTarget || `${normalizedPath}${url.search}`
    // If this is a /daily-updates/:slug request that needs canonical redirect, also check if it belongs to /jobs/:slug so it resolves in 1 hop
    const dailyMatch = (directRedirectTarget || lowerPath).match(/^\/daily-updates\/([^/?#]+)$/)
    if (dailyMatch && context.env?.DB) {
      try {
        const primaryArt = await context.env.DB
          .prepare(`SELECT slug FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`)
          .bind(dailyMatch[1])
          .first()
        if (primaryArt && primaryArt.slug) {
          finalPathAndHash = `/jobs/${primaryArt.slug}`
        }
      } catch {
        // Proceed with standard single-hop target if DB lookup fails
      }
    }
    return Response.redirect(`${SITE_URL}${finalPathAndHash}`, 301)
  }

  // 0. Dedicated Google Search Console verification token file handler
  if (lowerPath === '/googlefa0859c31163b27d.html') {
    return new Response('google-site-verification: googlefa0859c31163b27d.html\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      },
    })
  }

  // 0-ads. Dedicated Ads.txt handler for Google AdSense compliance
  if (lowerPath === '/ads.txt') {
    return new Response('google.com, pub-3823137402984505, DIRECT, f08c47fec0942fa0\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }

  // 0a. Dynamic D1-backed XML Sitemap handler (prevents serving stale build-time static public/sitemap.xml)
  if (lowerPath === '/sitemap.xml' && context.env?.DB) {
    try {
      const todayStr = new Date().toISOString().split('T')[0]
      const { results: allArticleRows } = await context.env.DB
        .prepare(`SELECT slug, status, publish_date, updated_at FROM articles ORDER BY publish_date DESC, id DESC`)
        .all()
      const { results: publishedUpdateRows } = await context.env.DB
        .prepare(`SELECT slug, publish_date, updated_at FROM daily_updates WHERE status = 'published' ORDER BY publish_date DESC, id DESC`)
        .all()
      const { results: categoryRows } = await context.env.DB
        .prepare(`SELECT slug FROM categories ORDER BY id ASC`)
        .all()

      const publishedArticleRows = (allArticleRows || []).filter(
        (r) =>
          r.status === 'published' &&
          r.slug !== 'httpswwwnjpgovpk' &&
          !CONSOLIDATED_SLUG_REDIRECTS.has(r.slug) &&
          !NOINDEX_ARTICLE_SLUGS.has(r.slug)
      )
      const publishedArticleSlugs = new Set((allArticleRows || []).filter((r) => r.status === 'published').map((r) => r.slug))
      const staticPages = [
        { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: todayStr },
        { loc: '/jobs/sindh-government-jobs-2026', priority: '0.9', changefreq: 'daily', lastmod: todayStr },
        { loc: '/daily-updates', priority: '0.9', changefreq: 'daily', lastmod: todayStr },
        { loc: '/tools/job-readiness-checker', priority: '0.8', changefreq: 'monthly', lastmod: todayStr },
        { loc: '/about', priority: '0.5', changefreq: 'monthly', lastmod: todayStr },
        { loc: '/contact', priority: '0.5', changefreq: 'monthly', lastmod: todayStr },
        { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
        { loc: '/disclaimer', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
        { loc: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
      ]

      const categoryList =
        categoryRows && categoryRows.length > 0
          ? categoryRows.map((c) => c.slug)
          : Array.from(VALID_CATEGORIES)
      const categoryUrls = categoryList.map((slug) => ({
        loc: `/category/${slug}`,
        priority: '0.8',
        changefreq: 'daily',
        lastmod: todayStr,
      }))

      const articleUrls = publishedArticleRows.map((r) => ({
        loc: `/jobs/${r.slug}`,
        priority: '0.9',
        changefreq: 'weekly',
        lastmod: String(r.updated_at || r.publish_date || todayStr).split('T')[0].split(' ')[0],
      }))

      const updateUrls = (publishedUpdateRows || [])
        .filter(
          (u) =>
            !publishedArticleSlugs.has(u.slug) &&
            u.slug !== 'httpswwwnjpgovpk' &&
            !CONSOLIDATED_SLUG_REDIRECTS.has(u.slug) &&
            !NOINDEX_UPDATE_SLUGS.has(u.slug)
        )
        .map((u) => ({
          loc: `/daily-updates/${u.slug}`,
          priority: '0.8',
          changefreq: 'daily',
          lastmod: String(u.updated_at || u.publish_date || todayStr).split('T')[0].split(' ')[0],
        }))

      const seenLocs = new Set()
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
      for (const page of [...staticPages, ...categoryUrls, ...articleUrls, ...updateUrls]) {
        if (seenLocs.has(page.loc)) continue
        seenLocs.add(page.loc)
        xml += `  <url>\n`
        xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`
        if (page.lastmod) xml += `    <lastmod>${page.lastmod}</lastmod>\n`
        if (page.changefreq) xml += `    <changefreq>${page.changefreq}</changefreq>\n`
        xml += `    <priority>${page.priority}</priority>\n`
        xml += `  </url>\n`
      }
      xml += `</urlset>`

      return new Response(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=300, s-maxage=300',
        },
      })
    } catch {
      // Fallback to static sitemap if D1 query fails
    }
  }

  // 1. Static files & API routes pass directly to asset/function handlers
  if (
    normalizedPath.startsWith('/api/') ||
    normalizedPath.startsWith('/images/') ||
    normalizedPath.startsWith('/assets/') ||
    /\.[a-z0-9]+$/i.test(normalizedPath)
  ) {
    const res = await context.next()
    const isNonHtmlStaticPath =
      normalizedPath.startsWith('/images/') ||
      normalizedPath.startsWith('/assets/') ||
      (!normalizedPath.startsWith('/api/') && /\.[a-z0-9]+$/i.test(normalizedPath) && !/\.html?$/i.test(normalizedPath))
    if (isNonHtmlStaticPath && res.headers.get('content-type')?.includes('text/html')) {
      return new Response('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        }
      })
    }
    return res
  }

  // 2. Legacy / Alternative article routes (/article/:slug, /articles/:slug)
  if (lowerPath.startsWith('/article/') || lowerPath.startsWith('/articles/')) {
    const prefix = lowerPath.startsWith('/articles/') ? '/articles/' : '/article/'
    const slug = normalizedPath.slice(prefix.length).split('/')[0]
    if (slug && context.env?.DB) {
      try {
        const article = await context.env.DB
          .prepare(`SELECT slug FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`)
          .bind(slug)
          .first()
        if (article) {
          return Response.redirect(`${SITE_URL}/jobs/${article.slug}`, 301)
        }
        const update = await context.env.DB
          .prepare(`SELECT slug FROM daily_updates WHERE slug = ? AND status = 'published' LIMIT 1`)
          .bind(slug)
          .first()
        if (update) {
          return Response.redirect(`${SITE_URL}/daily-updates/${update.slug}`, 301)
        }
        return new Response(generate404Html('Article Not Found', `The requested article "${escapeHtml(slug)}" was not found on CareerDost.`), {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        })
      } catch (err) {
        console.warn('Redirect check error:', err)
      }
    }
    return new Response(generate404Html('Article Not Found', 'The requested article was not found on CareerDost.'), {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  // 3. Alternative update routes (/updates/:slug)
  if (lowerPath.startsWith('/updates/')) {
    const slug = normalizedPath.slice('/updates/'.length).split('/')[0]
    if (slug && context.env?.DB) {
      try {
        const update = await context.env.DB
          .prepare(`SELECT slug FROM daily_updates WHERE slug = ? AND status = 'published' LIMIT 1`)
          .bind(slug)
          .first()
        if (update) {
          return Response.redirect(`${SITE_URL}/daily-updates/${update.slug}`, 301)
        }
        const article = await context.env.DB
          .prepare(`SELECT slug FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`)
          .bind(slug)
          .first()
        if (article) {
          return Response.redirect(`${SITE_URL}/jobs/${article.slug}`, 301)
        }
        return new Response(generate404Html('Update Not Found', `The requested update "${escapeHtml(slug)}" was not found on CareerDost.`), {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        })
      } catch (err) {
        console.warn('Redirect check error:', err)
      }
    }
    return new Response(generate404Html('Update Not Found', 'The requested update was not found on CareerDost.'), {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  const response = await context.next()

  // Only rewrite HTML responses
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    return response
  }

  const pathname = normalizedPath

  // 4. Admin & private pages: enforce noindex, nofollow & no-store on server response
  if (lowerPath === '/admin' || lowerPath.startsWith('/admin/')) {
    const adminRes = new HTMLRewriter()
      .on('head', {
        element(e) {
          e.append('<meta name="robots" content="noindex, nofollow" />', { html: true })
        },
      })
      .transform(response)
    return withHtmlCacheHeaders(adminRes, 'no-store, no-cache, must-revalidate')
  }

  // 2. Daily updates pages: /daily-updates/:slug
  if (pathname.startsWith('/daily-updates/')) {
    const slug = pathname.replace('/daily-updates/', '').split('/')[0]
    if (slug) {
      if (context.env?.DB) {
        try {
          // If this slug exists as a primary published article in articles table,
          // permanently 301 redirect to its canonical URL /jobs/:slug
          const primaryArticle = await context.env.DB
            .prepare(`SELECT slug FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`)
            .bind(slug)
            .first()

          if (primaryArticle) {
            return Response.redirect(`${SITE_URL}/jobs/${primaryArticle.slug}`, 301)
          }

          const update = await context.env.DB
            .prepare(
              `SELECT id, slug, title, short_description, content, seo_title, meta_description,
                      featured_image, image_alt, category, organization, location,
                      qualification, positions, experience, job_type, salary, publish_date,
                      deadline, no_deadline, official_link, apply_link, is_verified, featured,
                      status, created_at, updated_at
               FROM daily_updates WHERE slug = ? LIMIT 1`
            )
            .bind(slug)
            .first()

          if (update && update.status === 'published') {
            const pageTitle = cleanPlainText(update.seo_title || `${update.title} — CareerDost`)
            const pageDesc = cleanPlainText(update.meta_description || update.short_description || `Check ${update.title} on CareerDost.`)
            const canonical = `${SITE_URL}/daily-updates/${slug}`
            const ogImage = getAbsoluteUrl(update.featured_image)
            const dailyHtml = generateDailyUpdateHtml(update, canonical)
            const modDate = update.updated_at ? String(update.updated_at).split(' ')[0].split('T')[0] : update.publish_date

            const isNoIndexUpdate = NOINDEX_UPDATE_SLUGS.has(slug)
            const rewriter = new HTMLRewriter()
              .on('title', { element: (e) => e.setInnerContent(pageTitle) })
              .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
              .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
              .on('meta[property="og:type"]', { element: (e) => e.setAttribute('content', 'article') })
              .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
              .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
              .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
              .on('meta[property="og:image"]', { element: (e) => e.setAttribute('content', ogImage) })
              .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
              .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
              .on('meta[name="twitter:image"]', { element: (e) => e.setAttribute('content', ogImage) })
              .on('head', {
                element(e) {
                  if (isNoIndexUpdate) {
                    e.append(`<meta name="robots" content="noindex, follow" />\n`, { html: true })
                  }
                  if (ogImage) {
                    const isStatic = ogImage.includes('/images/')
                    const webpUrl = isStatic && /\.(jpe?g|png)$/i.test(ogImage) ? ogImage.replace(/\.(jpe?g|png)$/i, '.webp') : null
                    if (webpUrl) {
                      e.append(`<link rel="preload" as="image" href="${webpUrl}" type="image/webp" fetchpriority="high" />\n`, { html: true })
                    } else {
                      e.append(`<link rel="preload" as="image" href="${ogImage}" fetchpriority="high" />\n`, { html: true })
                    }
                  }
                  const jsonLd = {
                    '@context': 'https://schema.org',
                    '@graph': [
                      {
                        '@type': 'NewsArticle',
                        headline: update.title,
                        description: update.meta_description || update.short_description,
                        datePublished: update.publish_date,
                        dateModified: modDate,
                        image: ogImage,
                        mainEntityOfPage: {
                          '@type': 'WebPage',
                          '@id': canonical,
                        },
                        author: [
                          {
                            '@type': 'Person',
                            name: 'Faizan Ali',
                            jobTitle: 'Founder & Lead Editor',
                            url: `${SITE_URL}/about#editorial-team`,
                          },
                          {
                            '@type': 'Organization',
                            name: 'CareerDost Editorial Desk',
                            url: `${SITE_URL}/about#editorial-policy`,
                          },
                        ],
                        publisher: {
                          '@type': 'Organization',
                          name: 'CareerDost',
                          url: SITE_URL,
                          logo: {
                            '@type': 'ImageObject',
                            url: `${SITE_URL}/favicon.svg`,
                          },
                        },
                      },
                      {
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                          {
                            '@type': 'ListItem',
                            position: 1,
                            name: 'Home',
                            item: SITE_URL,
                          },
                          {
                            '@type': 'ListItem',
                            position: 2,
                            name: 'Daily Updates',
                            item: `${SITE_URL}/daily-updates`,
                          },
                          {
                            '@type': 'ListItem',
                            position: 3,
                            name: update.title,
                            item: canonical,
                          },
                        ],
                      },
                    ],
                  }
                  e.append(`<script id="page-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
                  const clientUpdateData = {
                    id: update.id,
                    slug: update.slug,
                    title: update.title,
                    category: update.category,
                    shortDescription: update.short_description || '',
                    content: (() => {
                      try {
                        return typeof update.content === 'string' ? JSON.parse(update.content) : (update.content || [])
                      } catch {
                        return [update.content]
                      }
                    })(),
                    featuredImage: update.featured_image || '',
                    imageAlt: update.image_alt || '',
                    officialLink: update.official_link || '',
                    applyLink: update.apply_link || '',
                    deadline: update.deadline || '',
                    noDeadline: Boolean(update.no_deadline),
                    publishDate: update.publish_date || update.created_at,
                    updatedAt: modDate,
                    organization: update.organization || '',
                    location: update.location || '',
                    qualification: update.qualification || '',
                    experience: update.experience || '',
                    positions: update.positions || '',
                    jobType: update.job_type || '',
                    salary: update.salary || '',
                    isVerified: Boolean(update.is_verified),
                    featured: Boolean(update.featured),
                    seoTitle: update.seo_title || update.title,
                    metaDescription: update.meta_description || update.short_description || '',
                    status: update.status || 'published',
                  }
                  e.append(`<script>window.__INITIAL_UPDATE__ = ${JSON.stringify(clientUpdateData).replace(/</g, '\\u003c')};</script>\n`, { html: true })
                },
              })
              .on('#root', {
                element(e) {
                  e.setInnerContent(dailyHtml, { html: true })
                },
              })

            const updateEtag = `W/"ssr-upd-${update.id}-${encodeURIComponent(String(update.updated_at || update.publish_date || ''))}-${String(update.title || '').length}-${String(update.content || '').length}"`
            return withHtmlCacheHeaders(
              rewriter.transform(response),
              'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
              updateEtag,
              isNoIndexUpdate ? 'noindex, follow' : ''
            )
          }

          // Not found in daily_updates: check if exists in articles table
          const altArticle = await context.env.DB
            .prepare(`SELECT slug FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`)
            .bind(slug)
            .first()

          if (altArticle) {
            return Response.redirect(`${SITE_URL}/jobs/${slug}`, 301)
          }

          // Neither exists: return proper 404 response
          return new Response(generate404Html('Daily Update Not Found', `The daily update "${escapeHtml(slug)}" was not found or has been removed.`), {
            status: 404,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              'X-Robots-Tag': 'noindex, nofollow',
            },
          })
        } catch (err) {
          console.warn('SEO Rewriter Update Error:', err)
        }
      }
    }
  }

  // 3. Article pages: /jobs/:slug
  if (pathname.startsWith('/jobs/')) {
    const slug = pathname.replace('/jobs/', '').split('/')[0]
    if (slug) {
      if (slug === 'sindh-government-jobs-2026') {
        const canonical = `${SITE_URL}/jobs/sindh-government-jobs-2026`
        const ogImage = `${SITE_URL}/images/sindh-government-jobs-2026-spsc-sts-guide.webp`
        const pageTitle = 'Sindh Government Jobs 2026 — Latest Vacancies | CareerDost'
        const pageDesc = 'Verified Sindh Government Jobs 2026: SPSC, STS, District Courts, BPS-1 to 4, Junior Clerk, and Driver posts across Karachi, Hyderabad, Sukkur, Larkana, and Badin.'

        let sindhArticles = []
        if (context.env?.DB) {
          try {
            const { results } = await context.env.DB
              .prepare(
                `SELECT id, slug, title, category_slug, excerpt, featured_image, image_alt, organization, job_type, location, qualification, salary, positions, last_date, publish_date, logo_initial, is_verified
                 FROM articles
                 WHERE status = 'published'
                   AND slug != 'sindh-government-jobs-2026'
                   AND title NOT LIKE '%Balochistan Quota%'
                   AND slug NOT LIKE '%-balochistan%'
                   AND slug NOT LIKE 'kp-%'
                   AND slug NOT LIKE 'punjab-%'
                   AND (
                     category_slug = 'government-jobs'
                     OR (
                       category_slug IN ('internships', 'guides-and-resources', 'career-guides')
                       AND (
                         title LIKE '%Sindh%'
                         OR title LIKE '%SPSC%'
                         OR title LIKE '%SESSI%'
                         OR organization LIKE '%Sindh%'
                       )
                     )
                   )
                   AND (
                     title LIKE '%Sindh%'
                     OR title LIKE '%Karachi%'
                     OR title LIKE '%Hyderabad%'
                     OR title LIKE '%Sukkur%'
                     OR title LIKE '%Larkana%'
                     OR title LIKE '%Badin%'
                     OR title LIKE '%Dadu%'
                     OR title LIKE '%SPSC%'
                     OR title LIKE '% STS %'
                     OR title LIKE 'STS %'
                     OR title LIKE '%(STS)%'
                     OR organization LIKE '%Sindh%'
                     OR organization LIKE '%Sukkur IBA%'
                     OR location LIKE '%Sindh%'
                     OR location LIKE '%Karachi%'
                     OR location LIKE '%Hyderabad%'
                     OR location LIKE '%Sukkur%'
                     OR location LIKE '%Larkana%'
                     OR location LIKE '%Badin%'
                     OR location LIKE '%Dadu%'
                   )
                 ORDER BY publish_date DESC, id DESC
                 LIMIT 40`
              )
              .all()
            sindhArticles = (results || []).filter(
              (a) => a.slug !== 'sindh-government-jobs-2026' && !CONSOLIDATED_SLUG_REDIRECTS.has(a.slug)
            )
          } catch (e) {
            console.warn('Sindh pillar DB query error:', e)
          }
        }

        const pillarHtml = generateSindhPillarHtml(sindhArticles, canonical)
        const clientSindhArticles = sindhArticles.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || '',
          featuredImage: a.featured_image || '',
          imageAlt: a.image_alt || '',
          category: a.category_slug || 'government-jobs',
          organization: a.organization || '',
          location: a.location || 'Sindh, Pakistan',
          qualification: a.qualification || '',
          salary: a.salary || '',
          positions: a.positions || '',
          publishDate: a.publish_date || '',
          lastDate: a.last_date || '',
          jobType: a.job_type || '',
          logoInitial: a.logo_initial || '',
          isVerified: Boolean(a.is_verified),
        }))
        const faqs = [
          {
            question: 'What is the general age relaxation for Sindh Government jobs in 2026?',
            answer: 'The Government of Sindh (S&GAD) has notified a general relaxation of up to 15 years in the upper age limit for recruitment across provincial departments. This relaxation allows candidates up to 43 years (and up to 45 years in select quota categories) to apply for general posts.',
          },
          {
            question: 'Which testing agencies conduct recruitment for Sindh Government departments?',
            answer: 'Recruitment in Sindh is conducted through three primary channels: 1) Sindh Public Service Commission (SPSC) for gazetted posts (BPS-16 and above), 2) Sukkur IBA Testing Services (STS / SIBA) for ministerial, teaching, and general departmental vacancies (BPS-05 to BPS-15), and 3) Departmental District Selection Committees for lower-cadre posts (BPS-01 to BPS-04).',
          },
          {
            question: 'Is PRC Form "D" mandatory for Sindh domicile applicants?',
            answer: 'Yes. Permanent Residence Certificate (PRC) Form "D" along with a valid District Domicile Certificate issued under the Pakistan Citizenship Act is legally mandatory for all provincial and district quota posts in Sindh.',
          },
          {
            question: 'Where can I find BPS-1 to BPS-4 jobs (Naib Qasid, Peon, Mali, Driver) in Sindh?',
            answer: 'BPS-01 to BPS-04 recruitment is decentralised and advertised directly by district administrative offices, including District and Sessions Courts, Municipal Corporations, Health Facilities, and the Education Department.',
          },
          {
            question: 'What are the quota allocations for Sindh Government recruitment?',
            answer: 'Under the Sindh Civil Servants Rules, recruitment is allocated based on: 60% Rural Quota and 40% Urban Quota (for Karachi, Hyderabad, and Sukkur municipal limits) for provincial positions. Statutory quotas include 5% Women, 5% Minorities, and 5% Differently-Abled Persons.',
          },
        ]

        const jsonLd = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              '@id': canonical,
              url: canonical,
              name: pageTitle,
              description: pageDesc,
              inLanguage: 'en-PK',
              isPartOf: {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: 'CareerDost',
              },
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                  { '@type': 'ListItem', position: 2, name: 'Government Jobs', item: `${SITE_URL}/category/government-jobs` },
                  { '@type': 'ListItem', position: 3, name: 'Sindh Government Jobs 2026', item: canonical },
                ],
              },
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: sindhArticles.length,
                itemListElement: sindhArticles.slice(0, 15).map((a, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  name: a.title,
                  url: `${SITE_URL}/jobs/${a.slug}`,
                })),
              },
            },
            {
              '@type': 'FAQPage',
              '@id': `${canonical}#faq`,
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            },
          ],
        }

        const response = await context.next()
        const catRes = new HTMLRewriter()
          .on('title', { element: (e) => e.setInnerContent(pageTitle) })
          .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
          .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
          .on('meta[property="og:type"]', { element: (e) => e.setAttribute('content', 'website') })
          .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
          .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
          .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
          .on('meta[property="og:image"]', { element: (e) => e.setAttribute('content', ogImage) })
          .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
          .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
          .on('meta[name="twitter:image"]', { element: (e) => e.setAttribute('content', ogImage) })
          .on('head', {
            element(e) {
              e.append(`<link rel="preload" as="image" href="${ogImage}" fetchpriority="high" />\n`, { html: true })
              e.append(`<script id="page-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
              if (clientSindhArticles.length > 0) {
                e.append(`<script>window.__INITIAL_SINDH_ARTICLES__ = ${JSON.stringify(clientSindhArticles).replace(/</g, '\\u003c')};</script>\n`, { html: true })
              }
            },
          })
          .on('#root', { element: (e) => e.setInnerContent(pillarHtml, { html: true }) })
          .transform(response)
        return withHtmlCacheHeaders(catRes, 'public, max-age=0, s-maxage=60, must-revalidate')
      }

      if (context.env?.DB) {
        try {
          const article = await context.env.DB
            .prepare(
              `SELECT id, slug, title, excerpt, content, seo_title, meta_description, featured_image, image_alt,
                      category_slug, organization, location, qualification, salary, experience, positions,
                      publish_date, last_date, no_deadline, job_type, apply_link, official_link, is_verified,
                      status, updated_at
               FROM articles WHERE slug = ? LIMIT 1`
            )
            .bind(slug)
            .first()

          if (article && article.status === 'published') {
            let pageTitle = cleanPlainText(article.seo_title || '')
            if (pageTitle) {
              pageTitle = pageTitle.replace(/\s*[-—|]\s*CareerDost\s*[-—|]\s*CareerDost/gi, ' — CareerDost')
              if (!pageTitle.toLowerCase().includes('careerdost')) {
                pageTitle = `${pageTitle} — CareerDost`
              }
            } else {
              let baseTitle = cleanPlainText(article.title || '')
              baseTitle = baseTitle.replace(/\s*[-—|]\s*CareerDost$/gi, '').trim()
              if (baseTitle.length > 55) {
                const words = baseTitle.split(' ')
                let shortTitle = ''
                for (const w of words) {
                  if ((shortTitle + ' ' + w).length <= 50) {
                    shortTitle += (shortTitle ? ' ' : '') + w
                  } else break
                }
                baseTitle = shortTitle || baseTitle.slice(0, 50)
                baseTitle = baseTitle.replace(/[,:;\-–—/&+]+$/, '').trim()
                baseTitle = baseTitle.replace(/\s+(?:and|or|for|in|at|to|of|via|with|by|from|on|as|into|the|a|an|&|–|—|-|last)$/i, '').trim()
              }
              pageTitle = `${baseTitle} — CareerDost`
            }

            let pageDesc = cleanPlainText(article.meta_description || article.excerpt || `Check ${article.title} details, requirements, and official application process on CareerDost.`)
            if (pageDesc.length > 160) {
              const words = pageDesc.slice(0, 157).split(' ')
              words.pop()
              pageDesc = words.join(' ') + '...'
            }
            const canonical = `${SITE_URL}/jobs/${slug}`
            const ogImage = getAbsoluteUrl(article.featured_image)
            const jobHtml = generateJobHtml(article, canonical)
            const modDate = article.updated_at ? String(article.updated_at).split(' ')[0].split('T')[0] : article.publish_date

            const cType = getContentType(article)
            const isJob = isGenuineJobVacancy(article, cType)

            const mainSchema = isJob
              ? buildJobPostingSchema(article)
              : {
                  '@type': 'Article',
                  headline: article.title,
                  description: article.meta_description || article.excerpt,
                  datePublished: article.publish_date,
                  dateModified: modDate,
                  image: ogImage,
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': canonical,
                  },
                  author: [
                    {
                      '@type': 'Person',
                      name: 'Faizan Ali',
                      jobTitle: 'Founder & Lead Editor',
                      url: `${SITE_URL}/about#editorial-team`,
                    },
                    {
                      '@type': 'Organization',
                      name: 'CareerDost Editorial Desk',
                      url: `${SITE_URL}/about#editorial-policy`,
                    },
                  ],
                  publisher: {
                    '@type': 'Organization',
                    name: 'CareerDost',
                    url: SITE_URL,
                    logo: {
                      '@type': 'ImageObject',
                      url: `${SITE_URL}/favicon.svg`,
                    },
                  },
                }

            const isNoIndexArticle = NOINDEX_ARTICLE_SLUGS.has(slug)
            const rewriter = new HTMLRewriter()
              .on('title', { element: (e) => e.setInnerContent(pageTitle) })
              .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
              .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
              .on('meta[property="og:type"]', { element: (e) => e.setAttribute('content', 'article') })
              .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
              .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
              .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
              .on('meta[property="og:image"]', { element: (e) => e.setAttribute('content', ogImage) })
              .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
              .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
              .on('meta[name="twitter:image"]', { element: (e) => e.setAttribute('content', ogImage) })
              .on('head', {
                element(e) {
                  if (isNoIndexArticle) {
                    e.append(`<meta name="robots" content="noindex, follow" />\n`, { html: true })
                  }
                  if (ogImage) {
                    const isStatic = ogImage.includes('/images/')
                    const webpUrl = isStatic && /\.(jpe?g|png)$/i.test(ogImage) ? ogImage.replace(/\.(jpe?g|png)$/i, '.webp') : null
                    if (webpUrl) {
                      e.append(`<link rel="preload" as="image" href="${webpUrl}" type="image/webp" fetchpriority="high" />\n`, { html: true })
                    } else {
                      e.append(`<link rel="preload" as="image" href="${ogImage}" fetchpriority="high" />\n`, { html: true })
                    }
                  }
                  const jsonLd = {
                    '@context': 'https://schema.org',
                    '@graph': [
                      mainSchema,
                      {
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                          {
                            '@type': 'ListItem',
                            position: 1,
                            name: 'Home',
                            item: SITE_URL,
                          },
                          {
                            '@type': 'ListItem',
                            position: 2,
                            name: article.category_slug ? article.category_slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Jobs',
                            item: `${SITE_URL}/category/${article.category_slug || 'government-jobs'}`,
                          },
                          {
                            '@type': 'ListItem',
                            position: 3,
                            name: article.title,
                            item: canonical,
                          },
                        ],
                      },
                    ],
                  }
                  e.append(`<script id="page-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
                  const clientArticleData = {
                    id: article.id,
                    slug: article.slug,
                    title: article.title,
                    category: article.category_slug,
                    organization: article.organization,
                    jobType: article.job_type,
                    location: article.location,
                    qualification: article.qualification,
                    salary: article.salary,
                    experience: article.experience || '',
                    positions: article.positions || '',
                    lastDate: article.last_date,
                    noDeadline: Boolean(article.no_deadline),
                    publishDate: article.publish_date,
                    updatedAt: modDate,
                    officialLink: article.official_link,
                    applyLink: article.apply_link || '',
                    isVerified: Boolean(article.is_verified),
                    featured: Boolean(article.featured),
                    logoInitial: article.logo_initial,
                    featuredImage: article.featured_image || '',
                    imageAlt: article.image_alt || '',
                    excerpt: article.excerpt,
                    content: (() => {
                      try {
                        return typeof article.content === 'string' ? JSON.parse(article.content) : (article.content || [])
                      } catch {
                        return [article.content]
                      }
                    })(),
                    seoTitle: article.seo_title,
                    metaDescription: article.meta_description,
                    focusKeyword: article.focus_keyword || '',
                    status: article.status || 'published',
                  }
                  e.append(`<script>window.__INITIAL_ARTICLE__ = ${JSON.stringify(clientArticleData).replace(/</g, '\\u003c')};</script>\n`, { html: true })
                },
              })
              .on('#root', {
                element(e) {
                  e.setInnerContent(jobHtml, { html: true })
                },
              })

            const articleEtag = `W/"ssr-art-${article.id}-${encodeURIComponent(String(article.updated_at || article.publish_date || ''))}-${String(article.title || '').length}-${String(article.content || '').length}"`
            return withHtmlCacheHeaders(
              rewriter.transform(response),
              'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
              articleEtag,
              isNoIndexArticle ? 'noindex, follow' : ''
            )
          }

          // Not found in articles: check if exists in daily_updates
          const altUpdate = await context.env.DB
            .prepare(`SELECT slug FROM daily_updates WHERE slug = ? AND status = 'published' LIMIT 1`)
            .bind(slug)
            .first()

          if (altUpdate) {
            return Response.redirect(`${SITE_URL}/daily-updates/${slug}`, 301)
          }

          // Neither exists: return proper 404 response
          return new Response(generate404Html('Listing Not Found', `The opportunity listing "${escapeHtml(slug)}" was not found or has expired.`), {
            status: 404,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              'X-Robots-Tag': 'noindex, nofollow',
            },
          })
        } catch (err) {
          console.warn('SEO Rewriter Article Error:', err)
        }
      }
    }
  }

  // 4. Category pages: /category/:slug
  if (pathname.startsWith('/category/')) {
    const slug = pathname.replace('/category/', '').split('/')[0]
    if (slug) {
      if (VALID_CATEGORIES.has(slug)) {
        const catMeta = CATEGORY_META[slug] || {
          label: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          description: `Explore verified ${slug.replace(/-/g, ' ')} across Pakistan with deadlines, eligibility criteria, and direct official application links on CareerDost.`
        }
        const pageTitle = escapeHtml(`${catMeta.label} in Pakistan — CareerDost`)
        const pageDesc = escapeHtml(catMeta.description)
        const canonical = `${SITE_URL}/category/${slug}`
        const ogImage = DEFAULT_OG_IMAGE

        let articles = []
        if (context.env?.DB) {
          try {
            const { results } = await context.env.DB
              .prepare(
                `SELECT id, slug, title, excerpt, featured_image, image_alt,
                        category_slug, organization, location, qualification, salary,
                        publish_date, last_date, job_type, is_verified, official_link, no_deadline
                 FROM articles
                 WHERE category_slug = ? AND status = 'published'
                 ORDER BY (CASE WHEN (last_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' AND last_date < strftime('%Y-%m-%d', 'now')) OR last_date LIKE '%October 2026' OR last_date LIKE '%September 2026' OR last_date LIKE '%August 2026' OR last_date LIKE '%Closed%' OR last_date LIKE '%Expired%' THEN 1 ELSE 0 END) ASC, publish_date DESC, id DESC
                 LIMIT 55`
              )
              .bind(slug)
              .all()
            const todayPktYmd = getPktTodayYMD()
            articles = (results || [])
              .filter((a) => !CONSOLIDATED_SLUG_REDIRECTS.has(a.slug))
              .sort((a, b) => {
                const aYmd = normalizeDateToYMD(a.last_date)
                const bYmd = normalizeDateToYMD(b.last_date)
                const aExp = (aYmd && aYmd < todayPktYmd) || /closed|expired/i.test(String(a.last_date || '')) ? 1 : 0
                const bExp = (bYmd && bYmd < todayPktYmd) || /closed|expired/i.test(String(b.last_date || '')) ? 1 : 0
                if (aExp !== bExp) return aExp - bExp
                return (b.publish_date || '').localeCompare(a.publish_date || '') || (b.id - a.id)
              })
              .slice(0, 40)
          } catch (err) {
            console.warn('Category articles query error:', err)
          }
        }

        const categoryHtml = generateCategoryHtml(slug, catMeta, articles, canonical)

        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: SITE_URL,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: catMeta.label,
              item: canonical,
            },
          ],
        }

        const clientCategoryArticles = articles.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || '',
          featuredImage: a.featured_image || '',
          imageAlt: a.image_alt || '',
          category: a.category_slug,
          organization: a.organization || '',
          location: a.location || 'Pakistan',
          qualification: a.qualification || '',
          salary: a.salary || '',
          publishDate: a.publish_date || '',
          lastDate: a.last_date || '',
          jobType: a.job_type || '',
          isVerified: Boolean(a.is_verified),
          officialLink: a.official_link || '',
          is_verified: a.is_verified,
          official_link: a.official_link || '',
        }))

        const catRes = new HTMLRewriter()
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
              e.append(`<script id="page-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
              if (clientCategoryArticles.length > 0) {
                e.append(`<script>window.__INITIAL_CATEGORY_ARTICLES__ = ${JSON.stringify(clientCategoryArticles).replace(/</g, '\\u003c')}; window.__INITIAL_CATEGORY_SLUG__ = "${slug}";</script>\n`, { html: true })
              }
            },
          })
          .on('#root', {
            element(e) {
              e.setInnerContent(categoryHtml, { html: true })
            },
          })
          .transform(response)
        return withHtmlCacheHeaders(catRes, 'public, max-age=0, s-maxage=60, must-revalidate')
      } else {
        return new Response(generate404Html('Category Not Found', `The category "${escapeHtml(slug)}" does not exist.`), {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        })
      }
    }
  }

  // 5. Homepage: /
  if (lowerPath === '/') {
    const homeTitle = 'CareerDost — Verified Pakistan Jobs, Scholarships & Government Schemes'
    const homeDesc = "CareerDost (Career Dost) provides verified Pakistan jobs, Sindh government schemes, BISP updates, bank careers, scholarships, and admissions with direct official links."
    const canonical = `${SITE_URL}/`
    const ogImage = DEFAULT_OG_IMAGE

    let latestArticles = []
    let latestDailyUpdates = []
    if (context.env?.DB) {
      try {
        const [artRes, updRes, allPubSlugsRes] = await Promise.all([
          context.env.DB
            .prepare(
              `SELECT id, slug, title, excerpt, category_slug, organization, location, publish_date, last_date, no_deadline, is_verified, official_link
               FROM articles WHERE status = 'published'
               ORDER BY (CASE WHEN (last_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' AND last_date < strftime('%Y-%m-%d', 'now')) OR last_date LIKE '%October 2026' OR last_date LIKE '%September 2026' OR last_date LIKE '%August 2026' OR last_date LIKE '%Closed%' OR last_date LIKE '%Expired%' THEN 1 ELSE 0 END) ASC, publish_date DESC, id DESC
               LIMIT 25`
            )
            .all(),
          context.env.DB
            .prepare(
              `SELECT id, slug, title, category, short_description, featured_image, image_alt, publish_date, organization, deadline, no_deadline, is_verified, official_link, featured
               FROM daily_updates WHERE status = 'published'
               AND id NOT IN (1, 2)
               AND slug NOT IN ('fpsc-consolidated-advertisement-09-2026-announced', 'hec-fully-funded-phd-scholarships-2026-open')
               ORDER BY (CASE WHEN (deadline GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' AND deadline < strftime('%Y-%m-%d', 'now')) OR deadline LIKE '%October 2026' OR deadline LIKE '%September 2026' OR deadline LIKE '%August 2026' OR deadline LIKE '%Closed%' OR deadline LIKE '%Expired%' THEN 1 ELSE 0 END) ASC, publish_date DESC, id DESC
               LIMIT 12`
            )
            .all(),
          context.env.DB
            .prepare(`SELECT slug FROM articles WHERE status = 'published'`)
            .all(),
        ])
        const pubSlugsSet = new Set(
          (allPubSlugsRes?.results || [])
            .map((r) => r.slug)
            .filter((s) => !CONSOLIDATED_SLUG_REDIRECTS.has(s))
        )
        const todayPktYmd = getPktTodayYMD()
        latestArticles = (artRes?.results || [])
          .filter((a) => !CONSOLIDATED_SLUG_REDIRECTS.has(a.slug))
          .sort((a, b) => {
            const aYmd = normalizeDateToYMD(a.last_date)
            const bYmd = normalizeDateToYMD(b.last_date)
            const aExp = (aYmd && aYmd < todayPktYmd) || /closed|expired/i.test(String(a.last_date || '')) ? 1 : 0
            const bExp = (bYmd && bYmd < todayPktYmd) || /closed|expired/i.test(String(b.last_date || '')) ? 1 : 0
            if (aExp !== bExp) return aExp - bExp
            return (b.publish_date || '').localeCompare(a.publish_date || '') || (b.id - a.id)
          })
          .slice(0, 12)
        latestDailyUpdates = (updRes?.results || [])
          .filter((u) => !CONSOLIDATED_SLUG_REDIRECTS.has(u.slug) && !NOINDEX_UPDATE_SLUGS.has(u.slug) && u.id !== 1 && u.id !== 2)
          .slice(0, 6)
          .map((u) => ({
            ...u,
            hasArticle: pubSlugsSet.has(u.slug),
          }))
      } catch (err) {
        console.warn('Homepage articles query error:', err)
      }
    }

    const homeHtml = `
      <div class="min-h-screen flex flex-col bg-paper font-sans">
        <header class="border-b border-line bg-white">
          <div class="container-x py-4 flex items-center justify-between">
            <a href="/" class="font-serif text-2xl font-bold text-ink">CareerDost</a>
            <nav class="flex items-center gap-4 text-sm">
              <a href="/daily-updates">Daily Updates</a>
              <a href="/category/government-jobs">Government Jobs</a>
              <a href="/category/government-schemes">Government Schemes</a>
              <a href="/category/scholarships">Scholarships</a>
              <a href="/category/admissions">Admissions</a>
              <a href="/category/guides-and-resources">Guides &amp; Resources</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main class="container-x py-8 flex-1">
          <section class="mb-8">
            <h1 class="font-serif text-3xl font-bold text-ink mb-2"><span class="text-green">CareerDost: </span>Pakistan Jobs, Scholarships &amp; Government Schemes</h1>
            <p class="text-inksoft text-base max-w-3xl">${escapeHtml(homeDesc)}</p>
          </section>
          <section class="mb-8">
            <h2 class="font-serif text-xl font-bold text-ink mb-4">Browse Opportunity Categories</h2>
            <ul class="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
              <li><a href="/category/government-jobs">Government Jobs in Pakistan</a></li>
              <li><a href="/category/private-jobs">Private Sector Jobs</a></li>
              <li><a href="/category/bank-jobs">Banking &amp; Finance Jobs</a></li>
              <li><a href="/category/it-jobs">IT &amp; Software Jobs</a></li>
              <li><a href="/category/internships">Graduate Internships</a></li>
              <li><a href="/category/government-schemes">Government Schemes &amp; BISP</a></li>
              <li><a href="/category/scholarships">Local &amp; International Scholarships</a></li>
              <li><a href="/category/admissions">University Admissions</a></li>
              <li><a href="/category/results">Merit Lists &amp; Exam Results</a></li>
              <li><a href="/category/guides-and-resources">Career Guides &amp; Resources</a></li>
              <li><a href="/tools/job-readiness-checker">Government Job Application Readiness Checker</a></li>
              <li><a href="/daily-updates">Daily Career &amp; Policy Updates</a></li>
            </ul>
          </section>
          <section class="mb-8">
            <h2 class="font-serif text-xl font-bold text-ink mb-4">Original CareerDost Guides, Checklists &amp; Tools</h2>
            <div class="grid sm:grid-cols-3 gap-4">
              <article class="bg-white border border-line p-4 rounded-xs">
                <h3 class="font-serif text-base font-bold text-ink mb-1"><a href="/jobs/njp-application-rejection-12-common-mistakes-avoid">NJP Application Rejection: 12 Common Mistakes Pakistani Job Applicants Should Avoid</a></h3>
                <p class="text-xs text-inksoft">Practical guide distinguishing documented NJP portal rules from common CNIC, domicile, transcript, and experience mistakes.</p>
              </article>
              <article class="bg-white border border-line p-4 rounded-xs">
                <h3 class="font-serif text-base font-bold text-ink mb-1"><a href="/jobs/government-jobs-documents-checklist-pakistan-2026">Government Jobs Documents Checklist in Pakistan 2026</a></h3>
                <p class="text-xs text-inksoft">Complete candidate folder guide and printable checklist covering CNIC, Domicile/PRC, HEC/IBCC attestation, NOC, and professional licenses.</p>
              </article>
              <article class="bg-white border border-line p-4 rounded-xs">
                <h3 class="font-serif text-base font-bold text-ink mb-1"><a href="/tools/job-readiness-checker">Government Job Application Readiness Checker</a></h3>
                <p class="text-xs text-inksoft">Interactive browser checklist to verify your documents, age limit, and official advertisement requirements before applying.</p>
              </article>
            </div>
          </section>
          <section>
            <h2 class="font-serif text-xl font-bold text-ink mb-4">Latest Verified Opportunities &amp; Official Updates</h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${latestArticles.map((a) => {
                const todayStr = getPktTodayYMD()
                const lastDateYmd = normalizeDateToYMD(a.last_date)
                const isExp = Boolean(
                  (lastDateYmd && lastDateYmd < todayStr) ||
                  (a.last_date && /closed|expired/i.test(String(a.last_date)))
                )
                const vTier = getVerificationTier(a)
                return `
                <article class="bg-white border border-line p-4 rounded-xs">
                  <div class="flex items-center justify-between mb-1 gap-2 flex-wrap">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-green uppercase">${escapeHtml(getCategoryLabel(a.category_slug))}</span>
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded border ${vTier.pillClass}">${vTier.icon} ${escapeHtml(vTier.shortLabel)}</span>
                    </div>
                    ${isExp ? '<span class="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded">CLOSED / EXPIRED</span>' : ''}
                  </div>
                  <h3 class="font-serif text-base font-bold text-ink mt-1 mb-1">
                    <a href="/jobs/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a>
                  </h3>
                  <p class="text-xs text-inksoft mb-2">${escapeHtml(a.organization || '')} • ${escapeHtml(a.location || 'Pakistan')}</p>
                  <p class="text-xs text-inksoft">${escapeHtml(a.excerpt || '')}</p>
                </article>`
              }).join('\n')}
            </div>
          </section>
        </main>
        ${generateSsrFooterHtml()}
      </div>`

    const homeInitialData = {
      dailyUpdates: latestDailyUpdates,
      govJobs: latestArticles
        .filter((a) => a.category_slug === 'government-jobs')
        .slice(0, 4)
        .map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || '',
          category: a.category_slug,
          organization: a.organization || '',
          location: a.location || 'Pakistan',
          publishDate: a.publish_date || '',
          lastDate: a.last_date || '',
          isVerified: Boolean(a.is_verified),
          officialLink: a.official_link || '',
          is_verified: a.is_verified,
          official_link: a.official_link || '',
        })),
    }

    const homeRes = new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(homeTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', homeDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', homeTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', homeDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('meta[property="og:image"]', { element: (e) => e.setAttribute('content', ogImage) })
      .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', homeTitle) })
      .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', homeDesc) })
      .on('meta[name="twitter:image"]', { element: (e) => e.setAttribute('content', ogImage) })
      .on('head', {
        element(e) {
          e.append(`<script>window.__INITIAL_HOME_DATA__ = ${JSON.stringify(homeInitialData).replace(/</g, '\\u003c')};</script>\n`, { html: true })
        },
      })
      .on('#root', { element: (e) => e.setInnerContent(homeHtml, { html: true }) })
      .transform(response)
    return withHtmlCacheHeaders(homeRes)
  }

  // 6. About Page: /about
  if (lowerPath === '/about') {
    const pageTitle = 'About CareerDost — Editorial Standards, Verification Policy & Public Mission'
    const pageDesc = 'Learn about CareerDost (https://careerdost.blog), our editorial verification methodology, primary source standards, Corrections Policy, and anti-fraud principles for Pakistan jobs, schemes, and scholarships.'
    const canonical = `${SITE_URL}/about`
    const aboutHtml = `
      <main class="container-x py-10 max-w-4xl font-sans">
        <nav class="text-xs text-inksoft mb-4" aria-label="Breadcrumb"><a href="/">Home</a> / <span>About &amp; Editorial Policy</span></nav>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">About CareerDost &amp; Editorial Verification Standards</h1>
        <p class="text-base text-ink leading-relaxed mb-4">CareerDost (<a href="https://careerdost.blog">https://careerdost.blog</a>) is an independent digital career, education, and public-information publication serving students, fresh graduates, job seekers, and citizens across Pakistan. We translate complex federal and provincial government notifications, public service commission gazettes, university admission circulars, corporate hiring announcements, and social welfare directives into clear, structured, and verifiable guides.</p>
        <p class="text-base text-ink leading-relaxed mb-6">CareerDost is strictly an independent informational platform. We are not affiliated with any federal or provincial ministry, public service commission (FPSC, PPSC, SPSC, KPPSC, BPSC), testing agency (NTS, STS-IBA, ETS, PTS), university, or private employer. We do not act as a recruitment broker, never collect job applications, and never charge fees to candidates.</p>

        <section id="editorial-team" class="mb-8">
          <h2 class="font-serif text-2xl font-bold text-ink mt-6 mb-3">Editorial Leadership &amp; Author Attribution</h2>
          <p class="text-base text-ink leading-relaxed mb-3">CareerDost is founded and edited by <strong>Faizan Ali</strong>, who serves as Lead Editor and Technical Architect. Overseeing day-to-day source verification, gazette parsing, and editorial accuracy, he ensures every opportunity guide complies with strict public documentation standards. Reachable directly for editorial inquiries, updates, and corrections via email at <a href="mailto:careerdost02@gmail.com" class="text-green underline font-semibold">careerdost02@gmail.com</a> or our <a href="/contact" class="text-green underline font-semibold">Editorial Desk &amp; Inquiry Tool</a>.</p>
          <p class="text-base text-ink leading-relaxed">The <strong>CareerDost Editorial Desk</strong> comprises dedicated educational and public-sector researchers monitoring federal and provincial public service commissions (FPSC, PPSC, SPSC, KPPSC, BPSC), testing services (NTS, STS), and accredited institutions.</p>
        </section>

        <section id="editorial-policy" class="mb-8">
          <h2 class="font-serif text-2xl font-bold text-ink mt-6 mb-3">Editorial Policy &amp; 4-Step Verification Workflow</h2>
          <ol class="list-decimal pl-5 space-y-2 text-base text-ink mb-4">
            <li><strong>Primary Source Traceability:</strong> Every listing is cross-checked against the issuing organization's official domain (such as <code>.gov.pk</code>, <code>.edu.pk</code>, or verified corporate portals), Press Information Department (PID) releases, or accredited testing agency portals.</li>
            <li><strong>Eligibility &amp; Criteria Extraction:</strong> Our editorial desk extracts concrete candidate parameters including BPS pay scales or corporate grades, HEC academic equivalency requirements, age limits, provincial/regional domicile quotas, and required documents.</li>
            <li><strong>Status &amp; Deadline Transparency:</strong> Each article displays a live contextual status indicator distinguishing open recruitment windows from expired notices, rolling career portals, statutory notifications, and unconfirmed policy proposals.</li>
            <li><strong>Historical Preservation &amp; Archival Value:</strong> When a deadline passes, we mark the opportunity as <strong>Expired / Closed</strong> while preserving the verified eligibility criteria, syllabus structure, and application procedure as a reference for future cohorts.</li>
          </ol>
        </section>

        <section class="mb-8">
          <h2 class="font-serif text-2xl font-bold text-ink mt-6 mb-3">Corrections, Updates &amp; Anti-Fraud Policy</h2>
          <p class="text-base text-ink leading-relaxed mb-3">When an issuing authority extends a closing date, issues a corrigendum, or updates examination schedules, the CareerDost Editorial Desk updates the relevant guide and records the verification date. Readers can report outdated links or inaccuracies via our <a href="/contact">Contact &amp; Editorial Helpdesk</a>.</p>
          <p class="text-base text-ink leading-relaxed">Legitimate employers and government welfare programmes in Pakistan only collect statutory examination or challan fees through designated bank branches or official 1bill channels—never through personal mobile wallets or unauthorized middlemen.</p>
        </section>
      </main>`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('#root', { element: (e) => e.setInnerContent(aboutHtml, { html: true }) })
      .transform(response)
  }

  // 7. Contact Page: /contact
  if (lowerPath === '/contact') {
    const pageTitle = 'Contact CareerDost — Editorial Helpdesk, Corrections & Source Verification'
    const pageDesc = 'Contact the CareerDost Editorial Desk to report broken official portal links, submit corrigendum updates, or request a factual review of any published listing.'
    const canonical = `${SITE_URL}/contact`
    const contactHtml = `
      <main class="container-x py-10 max-w-4xl font-sans">
        <nav class="text-xs text-inksoft mb-4" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Contact Us</span></nav>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">Contact the CareerDost Editorial Desk</h1>
        <p class="text-base text-ink leading-relaxed mb-4">Use our on-page editorial inquiry and correction tool to report an updated closing deadline, flag a broken official portal link, or request a factual check on any job notification, scholarship, admission circular, or public welfare guide published on CareerDost (<a href="https://careerdost.blog">https://careerdost.blog</a>).</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">Direct Editorial Inquiries &amp; Corrigendum Submissions</h2>
        <p class="text-base text-ink leading-relaxed mb-2">For editorial inquiries, official corrigendum submissions, and direct publisher correspondence, you can email our editorial desk directly at <a href="mailto:careerdost02@gmail.com" class="text-green font-semibold underline">careerdost02@gmail.com</a> or submit your message through the on-page form below.</p>
        <p class="text-base text-ink leading-relaxed mb-4"><span class="text-xs text-inksoft">Lead Editor: Faizan Ali | Official Contact: <a href="mailto:careerdost02@gmail.com" class="text-green font-semibold underline">careerdost02@gmail.com</a> | Helpline: <a href="https://wa.me/923173425680" class="text-green font-semibold underline">0317-3425680</a> | Verified review timeframe: Within 24–48 business hours.</span></p>

        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">Important Applicant &amp; Privacy Notice</h2>
        <p class="text-base text-ink leading-relaxed mb-4">CareerDost is an independent informational publication and is not a recruitment agency or government department. We do not accept CVs, job applications, or registration forms. Please submit applications directly on the official employer, university, or government portal linked inside each article. Do not share sensitive personal data such as CNIC numbers, bank account details, or passwords.</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">How Editorial Correction Reviews Work</h2>
        <ul class="list-disc pl-5 space-y-2 text-base text-ink mb-4">
          <li><strong>Deadline &amp; Corrigendum Updates:</strong> Include the CareerDost article URL and a link to the official corrigendum or department notice.</li>
          <li><strong>Broken Portal Links:</strong> Report if a government, university, or testing agency portal URL has changed or moved offline.</li>
          <li><strong>Fraud &amp; Impersonation Alerts:</strong> Flag suspicious third-party links or unauthorized fee demands so we can add an advisory warning.</li>
        </ul>
      </main>`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('#root', { element: (e) => e.setInnerContent(contactHtml, { html: true }) })
      .transform(response)
  }

  // 8. Daily Updates Index: /daily-updates
  if (lowerPath === '/daily-updates') {
    const pageTitle = 'Daily Career & Education Updates in Pakistan — CareerDost'
    const pageDesc = 'Live real-time feed of Pakistan career notifications, university admissions, testing roll numbers, and government scheme updates.'
    const canonical = `${SITE_URL}/daily-updates`

    let updates = []
    let publishedArticleSlugs = new Set()
    if (context.env?.DB) {
      try {
        const { results: artResults } = await context.env.DB
          .prepare(`SELECT slug FROM articles WHERE status = 'published'`)
          .all()
        if (artResults && artResults.length > 0) {
          publishedArticleSlugs = new Set(
            artResults.map((a) => a.slug).filter((s) => !CONSOLIDATED_SLUG_REDIRECTS.has(s))
          )
        }

        const { results } = await context.env.DB
          .prepare(
            `SELECT id, slug, title, category, short_description, featured_image, image_alt,
                    official_link, apply_link, deadline, publish_date, organization,
                    location, qualification, experience, positions, job_type, salary, is_verified, no_deadline
             FROM daily_updates WHERE status = 'published' ORDER BY publish_date DESC LIMIT 36`
          )
          .all()
        if (results && results.length > 0) {
          updates = results.filter((u) => !CONSOLIDATED_SLUG_REDIRECTS.has(u.slug)).slice(0, 24)
        }
      } catch (err) {
        console.warn('DB daily updates fetch error:', err)
      }
    }

    const updatesHtml = generateDailyUpdatesIndexHtml(updates, canonical, publishedArticleSlugs)

    const clientUpdates = updates.map((u) => ({
      id: u.id,
      slug: u.slug,
      title: u.title,
      hasArticle: publishedArticleSlugs.has(u.slug),
      category: u.category,
      shortDescription: u.short_description || '',
      featuredImage: u.featured_image || '',
      imageAlt: u.image_alt || '',
      officialLink: u.official_link || '',
      applyLink: u.apply_link || '',
      deadline: u.deadline || '',
      publishDate: u.publish_date || '',
      organization: u.organization || '',
      location: u.location || '',
      qualification: u.qualification || '',
      experience: u.experience || '',
      positions: u.positions || '',
      jobType: u.job_type || '',
      salary: u.salary || '',
      isVerified: Boolean(u.is_verified),
      noDeadline: Boolean(u.no_deadline),
    }))

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: pageTitle,
          description: pageDesc,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: {
            '@type': 'Thing',
            name: 'Pakistan Career Updates, Admissions & Government Schemes',
          },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: updates.length,
            itemListElement: updates.slice(0, 10).map((u, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: u.title,
              url: publishedArticleSlugs.has(u.slug)
                ? `${SITE_URL}/jobs/${u.slug}`
                : `${SITE_URL}/daily-updates/${u.slug}`,
            })),
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: SITE_URL,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Daily Updates',
              item: canonical,
            },
          ],
        },
      ],
    }

    const updatesRes = new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('head', {
        element(e) {
          e.append(`<script id="page-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
          if (clientUpdates.length > 0) {
            e.append(`<script>window.__INITIAL_UPDATES__ = ${JSON.stringify(clientUpdates).replace(/</g, '\\u003c')};</script>\n`, { html: true })
          }
        },
      })
      .on('#root', {
        element(e) {
          e.setInnerContent(updatesHtml, { html: true })
        },
      })
      .transform(response)
    return withHtmlCacheHeaders(updatesRes)
  }

  // 9. Search Page: /search
  if (lowerPath === '/search') {
    const pageTitle = 'Search Pakistan Jobs, Admissions & Schemes — CareerDost'
    const canonical = `${SITE_URL}/search`
    const searchHtml = `
      <main class="container-x py-10 max-w-3xl font-sans">
        <h1 class="font-serif text-3xl font-bold text-ink mb-4">Search Verified Pakistan Jobs, Schemes &amp; Scholarships</h1>
        <p class="text-base text-inksoft mb-4">Browse by category below or use our interactive search to find verified opportunities across Pakistan.</p>
      </main>`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('head', { element: (e) => e.append('<meta name="robots" content="noindex, follow" />', { html: true }) })
      .on('#root', { element: (e) => e.setInnerContent(searchHtml, { html: true }) })
      .transform(response)
  }

  // 9B. Interactive Tool Page: /tools/job-readiness-checker
  if (lowerPath === '/tools/job-readiness-checker') {
    const pageTitle = 'Government Job Application Readiness Checker — CareerDost'
    const pageDesc = 'Free pre-submission readiness checklist for Pakistan government job applicants. Verify CNIC, domicile, degrees, age limit, and portal requirements privately.'
    const canonical = `${SITE_URL}/tools/job-readiness-checker`
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: pageTitle,
          url: canonical,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'All',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
          description: pageDesc,
          publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'CareerDost Guides & Resources', item: `${SITE_URL}/category/guides-and-resources` },
            { '@type': 'ListItem', position: 3, name: 'Government Job Application Readiness Checker', item: canonical },
          ],
        },
      ],
    }

    const toolHtml = `
      <main class="container-x py-10 max-w-4xl font-sans">
        <nav class="text-xs text-inksoft mb-4" aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/category/guides-and-resources">CareerDost Guides &amp; Resources</a> / <span>Application Readiness Checker</span>
        </nav>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">Government Job Application Readiness Checker</h1>
        <p class="text-base text-inksoft leading-relaxed mb-4">Use this interactive pre-submission readiness tool before applying on NJP (<a href="https://www.njp.gov.pk" target="_blank" rel="noopener noreferrer">njp.gov.pk</a>), FPSC (<a href="https://www.fpsc.gov.pk" target="_blank" rel="noopener noreferrer">fpsc.gov.pk</a>), SPSC (<a href="https://spsc.gov.pk" target="_blank" rel="noopener noreferrer">spsc.gov.pk</a>), PPSC, KPPSC, BPSC, or departmental portals.</p>
        <p class="text-sm text-ink leading-relaxed mb-4">Before applying for competitive civil service positions or provincial public service commission tests, applicants frequently encounter application rejections due to minor discrepancies between CNIC spellings and matriculation certificates, expired domicile validity, missing Form-D PRC, or unverified employer experience attestations. Use this checklist to audit your document readiness prior to paying non-refundable bank challans or submitting online portal profiles.</p>
        <div style="border-left:4px solid #f59e0b;background:#fffbeb;padding:12px 16px;margin-bottom:20px;font-size:14px;color:#78350f;">
          <strong>This checklist helps you prepare your application. It does not guarantee eligibility or acceptance.</strong><br/>
          <span style="font-size:12px;">Privacy Notice: CareerDost does not collect or store CNIC numbers, personal documents, or sensitive information.</span>
        </div>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-3">7 Core Application Readiness Checks</h2>
        <ul class="list-disc pl-5 space-y-2 text-base text-ink mb-6">
          <li><strong>CNIC available:</strong> Valid NADRA CNIC with personal spellings matching educational certificates.</li>
          <li><strong>Domicile available:</strong> District Domicile Certificate (and Form-D PRC where applicable).</li>
          <li><strong>Required educational documents available:</strong> Degrees and transcripts/DMCs declared on or before closing date.</li>
          <li><strong>Experience certificate available, if required:</strong> Signed employer experience certificates with exact dates.</li>
          <li><strong>Age eligibility checked:</strong> Exact age on closing date verified with applicable upper-age relaxation rules.</li>
          <li><strong>Relevant professional registration checked, if required:</strong> Active PEC, PMDC, PNC, Pharmacy Council, or Bar registration where required.</li>
          <li><strong>Advertisement requirements reviewed:</strong> Quota, fee challan/PSID rules, NOC rules, and submission mode confirmed.</li>
        </ul>
        <p class="text-sm text-ink">Related Guides: <a href="/jobs/njp-application-rejection-12-common-mistakes-avoid">NJP Application Rejection: 12 Common Mistakes to Avoid</a> • <a href="/jobs/government-jobs-documents-checklist-pakistan-2026">Government Jobs Documents Checklist in Pakistan 2026</a> • <a href="/category/government-jobs">Browse Government Jobs</a></p>
      </main>`

    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('head', {
        element(e) {
          e.append(`<script id="page-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
        },
      })
      .on('#root', { element: (e) => e.setInnerContent(toolHtml, { html: true }) })
      .transform(response)
  }

  // 10. Legal Pages: /privacy-policy, /disclaimer, /terms-and-conditions
  if (lowerPath === '/privacy-policy') {
    const pageTitle = 'Privacy Policy — Cookies, Analytics & Advertising Disclosures | CareerDost'
    const pageDesc = 'Official Privacy Policy for CareerDost (https://careerdost.blog) covering Google Analytics 4 (GA4), Google AdSense, Adsterra, third-party advertising cookies, data protection standards, and user opt-out rights.'
    const canonical = `${SITE_URL}/privacy-policy`
    const privacyHtml = `
      <main class="container-x py-10 max-w-4xl font-sans">
        <nav class="text-xs text-inksoft mb-4" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Privacy Policy</span></nav>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">Privacy Policy — CareerDost</h1>
        <p class="text-sm text-inksoft mb-4">Effective Date: January 1, 2026 • Last Reviewed: November 10, 2026</p>
        <p class="text-base text-ink leading-relaxed mb-4">CareerDost (<a href="https://careerdost.blog">https://careerdost.blog</a>) respects your privacy. We do not require visitor registration to read our guides, and we never request or store sensitive personal identifiers such as CNIC numbers, bank account numbers, BISP/8171 dynamic survey records, or passwords.</p>

        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">1. Log Files &amp; Cloudflare Edge Security</h2>
        <p class="text-base text-ink leading-relaxed mb-4">CareerDost is hosted on Cloudflare Pages. Standard technical request metadata (IP address, browser type, timestamp, referring/exit pages) is processed transiently for DDoS mitigation, security, and aggregate diagnostics.</p>

        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">2. Google Analytics 4 (GA4) Measurement</h2>
        <p class="text-base text-ink leading-relaxed mb-4">We use Google Analytics 4 (Measurement ID: <code>G-489C8F8SNJ</code>) to understand aggregate readership trends, page views, and device types. Google Analytics sets first-party cookies (such as <code>_ga</code>) to distinguish unique sessions without identifying individual visitors. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>

        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">3. Third-Party Advertising, Cookies &amp; Ad Network Disclosures</h2>
        <p class="text-base text-ink leading-relaxed mb-3">CareerDost displays contextual and/or personalized advertisements served by third-party advertising providers, including <strong>Google AdSense</strong> and <strong>Adsterra</strong> (operated via third-party ad delivery domains such as <code>highperformanceformat.com</code> and <code>pl29190020.profitablecpmratenetwork.com</code>):</p>
        <ul class="list-disc pl-5 space-y-2 text-base text-ink mb-4">
          <li>Third-party ad servers and ad networks (including Google AdSense and Adsterra) use cookies, JavaScript tags, web beacons, and embedded iframes to deliver advertisements, measure ad impressions, cap frequency, and evaluate campaign performance.</li>
          <li>When these third-party ad scripts or iframes load in your browser, the respective ad provider automatically receives standard technical request information—including your IP address, browser user-agent, device type, operating system, and referring page URL.</li>
          <li>Google's use of advertising cookies (such as DoubleClick DART cookies) enables it and its partners to serve advertisements to our visitors based on their visit to <code>careerdost.blog</code> and/or other websites on the Internet.</li>
          <li>CareerDost has no access to or control over third-party cookies, tracking identifiers, or scripts placed by external advertising networks, which are governed by each provider's own privacy policy.</li>
          <li>Users may manage or block third-party cookies through their browser privacy settings, opt out of Google personalized advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings (adssettings.google.com)</a>, or manage participating third-party ad choices at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a>. See also <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses information from sites or apps that use our services</a>.</li>
        </ul>

        <!-- Temporarily hidden: 4. On-Page AI Assistant Widget (Zanderio AI) -->

        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">4. External Government, University &amp; Employer Links</h2>
        <p class="text-base text-ink leading-relaxed mb-4">Our articles link to official government portals (<code>.gov.pk</code>), universities (<code>.edu.pk</code>), testing agencies, and corporate career sites. Once you leave CareerDost, the destination website's privacy policy governs your session.</p>

        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">5. Privacy Inquiries &amp; Official Contact</h2>
        <p class="text-base text-ink leading-relaxed mb-4">If you have any questions regarding this Privacy Policy or your data, please contact our Editorial Desk at <!--email_off--><a href="mailto:careerdost02@gmail.com" class="text-green font-semibold underline">careerdost02@gmail.com</a><!--/email_off--> or submit an inquiry through our <a href="/contact" class="text-green underline">Contact page</a>.</p>
      </main>`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('#root', { element: (e) => e.setInnerContent(privacyHtml, { html: true }) })
      .transform(response)
  }

  if (lowerPath === '/disclaimer') {
    const pageTitle = 'Editorial & Public Non-Affiliation Disclaimer — CareerDost'
    const pageDesc = 'Official Editorial Disclaimer for CareerDost (https://careerdost.blog) regarding non-affiliation with government agencies, primary source verification, and applicant anti-fraud precautions.'
    const canonical = `${SITE_URL}/disclaimer`
    const disclaimerHtml = `
      <main class="container-x py-10 max-w-4xl font-sans">
        <nav class="text-xs text-inksoft mb-4" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Disclaimer</span></nav>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">Editorial &amp; Public Information Disclaimer — CareerDost</h1>
        <p class="text-base text-ink leading-relaxed mb-4">CareerDost (<a href="https://careerdost.blog">https://careerdost.blog</a>) is an independent private informational website and is <strong>not</strong> affiliated with, endorsed by, or operated by the Government of Pakistan, any provincial government (Sindh, Punjab, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan, or AJK), BISP (8171), SPHF, HEC, FPSC, PPSC, SPSC, KPPSC, BPSC, NTS, STS-IBA, or any commercial bank or employer mentioned on this site.</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">No Recruitment, Placement, or Fee Collection</h2>
        <p class="text-base text-ink leading-relaxed mb-4">CareerDost does not issue job offer letters, conduct recruitment tests, process welfare payments, or charge fees to candidates. Always verify dates, challan procedures, and eligibility rules directly on the linked official government or employer portal before applying, and never send money to individuals or mobile wallets claiming guaranteed selection. To report fraudulent listings or suspicious third parties impersonating CareerDost, email us directly at <!--email_off--><a href="mailto:careerdost02@gmail.com" class="text-green font-semibold underline">careerdost02@gmail.com</a><!--/email_off-->.</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">Primary Source Verification &amp; Applicant Vigilance</h2>
        <p class="text-base text-ink leading-relaxed mb-4">All opportunities published on CareerDost — including federal vacancies, provincial commission advertisements, university admissions, and government financial assistance programs — are compiled from publicly circulated official gazettes, department portals, and authorized daily newspapers. While our editorial desk conducts thorough verification checks before indexing, issuing institutions reserve the sole right to alter eligibility criteria, extend deadlines, or cancel recruitments. Candidates must always review the official notification documents on the designated primary department portals.</p>
      </main>`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('#root', { element: (e) => e.setInnerContent(disclaimerHtml, { html: true }) })
      .transform(response)
  }

  if (lowerPath === '/terms-and-conditions') {
    const pageTitle = 'Terms & Conditions of Use — CareerDost'
    const pageDesc = 'Terms and Conditions governing visitor access, acceptable use, intellectual property, and liability limitations on CareerDost (https://careerdost.blog).'
    const canonical = `${SITE_URL}/terms-and-conditions`
    const termsHtml = `
      <main class="container-x py-10 max-w-4xl font-sans">
        <nav class="text-xs text-inksoft mb-4" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Terms &amp; Conditions</span></nav>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">Terms &amp; Conditions of Use — CareerDost</h1>
        <p class="text-base text-ink leading-relaxed mb-4">By accessing CareerDost (<a href="https://careerdost.blog">https://careerdost.blog</a>), you agree to use our editorial summaries, eligibility breakdowns, and official portal directories for lawful personal, academic, and career-planning purposes.</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">Independent Informational Nature &amp; Applicant Responsibility</h2>
        <p class="text-base text-ink leading-relaxed mb-4">CareerDost provides independent editorial guidance and does not process job, admission, scholarship, or welfare applications. Visitors are solely responsible for confirming closing dates, age limits, domicile rules, and application procedures on the official issuing authority's website before submitting documents or statutory bank challans.</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">Intellectual Property &amp; Governing Law</h2>
        <p class="text-base text-ink leading-relaxed mb-4">Original editorial articles, structured tables, and site design on CareerDost may not be scraped or republished in bulk without written permission. Official logos and government notifications remain the property of their respective institutions. These terms are governed by the applicable laws of Pakistan.</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">Third-Party Portals &amp; External Links</h2>
        <p class="text-base text-ink leading-relaxed mb-4">When following links from CareerDost to external department sites, university admission portals, testing agencies (such as NTS or STS), or recruitment portals, users are subject to the terms and privacy practices of those third-party domains. CareerDost is not responsible for external website availability, online payment gateway failures, or changes to application instructions made after publication.</p>
        <h2 class="font-serif text-xl font-bold text-ink mt-6 mb-2">Inquiries &amp; Formal Notices</h2>
        <p class="text-base text-ink leading-relaxed mb-4">For questions regarding these terms, intellectual property inquiries, or formal editorial correspondence, please contact our Editorial Desk directly via email at <!--email_off--><a href="mailto:careerdost02@gmail.com" class="text-green font-semibold underline">careerdost02@gmail.com</a><!--/email_off--> or via our <a href="/contact" class="text-green underline font-semibold">Contact page</a>.</p>
      </main>`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .on('meta[name="twitter:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[name="twitter:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('#root', { element: (e) => e.setInnerContent(termsHtml, { html: true }) })
      .transform(response)
  }

  // 11. Elimination of Soft 404s: Any unrecognized HTML path returns a genuine 404
  return new Response(generate404Html('Page Not Found', 'The requested page was not found on CareerDost.'), {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
