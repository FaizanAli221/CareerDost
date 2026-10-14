/**
 * Cloudflare Pages Middleware for CareerDost (https://careerdost.blog)
 * 
 * 1. Hostname canonicalization and permanent 301 redirects to https://careerdost.blog
 * 2. Edge-rendered Semantic HTML & SEO Meta injection via HTMLRewriter
 *    (Serves full H1, article body, meta & Schema.org JSON-LD directly over HTTP 200)
 * 3. Proper HTTP 404 responses for non-existent or unverified slugs (eliminating Soft 404s)
 */

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
  'career-guides'
])

const KNOWN_STATIC_ROUTES = new Set([
  '/',
  '/daily-updates',
  '/search',
  '/about',
  '/contact',
  '/privacy-policy',
  '/disclaimer',
  '/terms-and-conditions'
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

function formatInline(str) {
  if (!str) return ''
  let s = escapeHtml(str)
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>')
  return s
}

function renderContentBlocks(content, targetTitle = '') {
  if (!content) return ''
  let blocks = []
  if (Array.isArray(content)) {
    blocks = content
  } else if (typeof content === 'string') {
    const trimmed = content.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          blocks = parsed
        } else {
          blocks = [trimmed]
        }
      } catch {
        blocks = [content]
      }
    } else {
      blocks = content.split(/\n\s*\n/)
    }
  } else {
    blocks = [String(content)]
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

  for (const block of blocks) {
    if (!block) continue
    const text = String(block).trim()
    if (!text) continue

    if (text.startsWith('### ')) {
      html += `<h3 class="font-serif text-lg sm:text-xl font-bold text-ink mt-6 mb-3">${escapeHtml(text.replace(/^###\s+/, ''))}</h3>\n`
    } else if (text.startsWith('## ')) {
      const headingText = text.replace(/^##\s+/, '').trim()
      if (isDuplicateHeading(headingText)) {
        continue
      }
      html += `<h2 class="font-serif text-xl sm:text-2xl font-bold text-ink mt-8 mb-4 border-b border-line pb-2">${escapeHtml(headingText)}</h2>\n`
    } else if (text.startsWith('# ')) {
      const headingText = text.replace(/^#\s+/, '').trim()
      if (isDuplicateHeading(headingText)) {
        continue
      }
      html += `<h2 class="font-serif text-xl sm:text-2xl font-bold text-ink mt-8 mb-4 border-b border-line pb-2">${escapeHtml(headingText)}</h2>\n`
    } else if (text.startsWith('- ') || text.startsWith('* ')) {
      const items = text.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '))
      html += `<ul class="list-disc pl-5 space-y-2 text-ink my-4">\n`
      for (const item of items) {
        const itemText = item.replace(/^[-*]\s+/, '').trim()
        html += `  <li>${formatInline(itemText)}</li>\n`
      }
      html += `</ul>\n`
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

function detectContentTypeEdge(category, title = '', slug = '', jobType = '') {
  const cat = String(category || '').toLowerCase().trim()
  const jType = String(jobType || '').toLowerCase().trim()
  const s = String(slug || '').toLowerCase().trim()
  const t = String(title || '').toLowerCase().trim()
  const text = `${cat} ${jType} ${s} ${t}`

  if (
    s.includes('minimum-wage') ||
    s.includes('section-144') ||
    s.includes('barcode') ||
    s.includes('petrol-price') ||
    s.includes('support-price') ||
    s.includes('wheat-imports') ||
    jType.includes('notification') ||
    jType.includes('regulatory') ||
    jType.includes('statutory') ||
    jType.includes('order') ||
    jType.includes('food reserve') ||
    jType.includes('commodity pricing') ||
    text.includes('minimum wage') ||
    text.includes('notification') ||
    text.includes('gazette') ||
    text.includes('sro') ||
    text.includes('section 144') ||
    text.includes('circular') ||
    text.includes('price reduced')
  ) {
    return 'notification'
  }
  if (
    cat === 'government-schemes' ||
    s.includes('bisp') ||
    s.includes('scooty-scheme') ||
    s.includes('hari-card') ||
    s.includes('kisan-subsidy') ||
    s.includes('fuel-relief') ||
    s.includes('mamta-programme') ||
    s.includes('hunarmand') ||
    s.includes('rozgar-scheme') ||
    s.includes('social-protection-wallet') ||
    jType.includes('scheme') ||
    jType.includes('social safety') ||
    jType.includes('subsidy') ||
    jType.includes('cash transfer') ||
    text.includes('scheme') ||
    text.includes('bisp') ||
    text.includes('subsidy') ||
    text.includes('programme')
  ) {
    return 'scheme'
  }
  if (cat === 'admissions' || s.includes('admission') || text.includes('admission') || text.includes('entry test')) {
    return 'admission'
  }
  if (cat === 'results' || s.includes('result') || text.includes('result') || text.includes('merit list')) {
    return 'result'
  }
  if (cat === 'scholarships' || s.includes('scholarship') || text.includes('scholarship') || text.includes('fellowship')) {
    return 'scholarship'
  }
  if (cat === 'career-guides' || s.includes('guide') || text.includes('guide') || text.includes('how to')) {
    return 'guide'
  }
  return 'job'
}

function generateDailyUpdateHtml(update, canonical) {
  const title = escapeHtml(update.title || '')
  const rawCat = update.category || 'Daily Update'
  const cType = detectContentTypeEdge(rawCat, update.title, update.slug, update.job_type)
  const category = escapeHtml(rawCat)
  const shortDesc = update.short_description ? escapeHtml(update.short_description) : ''
  const pubDate = update.publish_date ? escapeHtml(update.publish_date) : ''
  const org = update.organization ? escapeHtml(update.organization) : ''
  const loc = update.location ? escapeHtml(update.location) : ''
  const qual = update.qualification ? escapeHtml(update.qualification) : ''
  const pos = update.positions ? escapeHtml(update.positions) : ''
  const deadline = update.deadline ? escapeHtml(update.deadline) : ''
  const applyLink = update.apply_link ? escapeHtml(update.apply_link) : ''
  const officialLink = update.official_link ? escapeHtml(update.official_link) : ''
  const contentHtml = renderContentBlocks(update.content, update.title)

  let orgLabel = 'Organization'
  let locLabel = 'Location'
  let qualLabel = 'Qualification'
  let posLabel = 'Vacancies'
  let deadlineLabel = 'Application Deadline'
  let actionBtnText = 'Apply Online →'
  let officialBtnText = 'Official Website / Gazette ↗'
  let typeBadge = category

  if (cType === 'notification') {
    orgLabel = 'Issuing Authority'
    locLabel = 'Jurisdiction / Scope'
    qualLabel = 'Target Sectors / Workers'
    posLabel = 'Notified Categories'
    deadlineLabel = 'Effective Date'
    actionBtnText = ''
    officialBtnText = 'View Official Notification / Gazette ↗'
    typeBadge = 'Official Notification'
  } else if (cType === 'scheme') {
    orgLabel = 'Administering Department'
    locLabel = 'Coverage Area'
    qualLabel = 'Eligibility Criteria'
    posLabel = 'Target Beneficiaries'
    deadlineLabel = 'Enrollment Schedule'
    actionBtnText = 'Verify / Check Portal →'
    officialBtnText = 'Official Scheme Portal ↗'
    typeBadge = 'Government Scheme'
  } else if (cType === 'admission') {
    orgLabel = 'University / Institute'
    locLabel = 'Campus Location'
    qualLabel = 'Required Prior Education'
    posLabel = 'Programs Offered'
    deadlineLabel = 'Last Date to Apply'
    actionBtnText = 'Apply for Admission →'
    officialBtnText = 'Official Admission Portal ↗'
    typeBadge = 'Admission Notice'
  } else if (cType === 'scholarship') {
    orgLabel = 'Awarding Body'
    locLabel = 'Eligible Region'
    qualLabel = 'Eligibility Criteria'
    posLabel = 'Scholarship Slots'
    deadlineLabel = 'Submission Deadline'
    actionBtnText = 'Submit Scholarship Application →'
    officialBtnText = 'Official Scholarship Portal ↗'
    typeBadge = 'Scholarship Program'
  }

  const specsBox = (org || loc || qual || pos) ? `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-paper border border-line mb-6 text-xs" style="background:#faf9f6;border:1px solid #e7e5e4;padding:16px;margin-bottom:24px;">
      ${org ? `<div><span style="color:#78716c;display:block;">${orgLabel}</span><strong style="color:#1c1917;">${org}</strong></div>` : ''}
      ${loc ? `<div><span style="color:#78716c;display:block;">${locLabel}</span><strong style="color:#1c1917;">${loc}</strong></div>` : ''}
      ${qual ? `<div><span style="color:#78716c;display:block;">${qualLabel}</span><strong style="color:#1c1917;">${qual}</strong></div>` : ''}
      ${pos ? `<div><span style="color:#78716c;display:block;">${posLabel}</span><strong style="color:#1c1917;">${pos}</strong></div>` : ''}
    </div>` : ''

  let statusBanner = ''
  if (cType === 'notification') {
    statusBanner = `
      <div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:16px;margin-bottom:24px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <strong style="color:#065f46;display:block;font-size:14px;">Official Statutory Notification (In Force)</strong>
          <span style="color:#047857;font-size:12px;">This is an enforceable gazette notification, not a job vacancy. No application fee or job submission is required.</span>
        </div>
        ${officialLink ? `<a href="${officialLink}" target="_blank" rel="noopener noreferrer" style="background:#059669;color:#ffffff;padding:8px 16px;font-size:12px;font-weight:700;text-decoration:none;border-radius:4px;">${officialBtnText}</a>` : ''}
      </div>`
  } else if (deadline) {
    statusBanner = `
      <div style="background:#fef3c7;border:1px solid #fde68a;padding:16px;margin-bottom:24px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <strong style="color:#92400e;display:block;font-size:14px;">${deadlineLabel}: ${deadline}</strong>
          <span style="color:#b45309;font-size:12px;">Submit or verify before official portal cutoff.</span>
        </div>
        ${(applyLink && actionBtnText) ? `<a href="${applyLink}" target="_blank" rel="noopener noreferrer" style="background:#d97706;color:#ffffff;padding:8px 16px;font-size:12px;font-weight:700;text-decoration:none;border-radius:4px;">${actionBtnText}</a>` : ''}
      </div>`
  }

  const transparencyNote = `
    <div style="background:#faf9f6;border-left:4px solid #059669;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#44403c;">
      <strong>Official Source &amp; Editorial Transparency:</strong> Official facts, dates, and requirements are derived directly from public gazettes and government portals. CareerDost provides editorial analysis and practical guidance to assist citizens.
    </div>`

  const actionButtons = (officialLink || (applyLink && actionBtnText)) ? `
    <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:20px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div>
        <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;display:block;">Verified Official Source</strong>
        <span style="font-size:12px;color:#78716c;">Official CareerDost Editorial Record</span>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${officialLink ? `<a href="${officialLink}" target="_blank" rel="noopener noreferrer" style="border:1px solid #d6d3d1;background:#ffffff;color:#1c1917;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none;">${officialBtnText}</a>` : ''}
        ${(applyLink && actionBtnText && applyLink !== officialLink) ? `<a href="${applyLink}" target="_blank" rel="noopener noreferrer" style="background:#059669;color:#ffffff;padding:8px 20px;font-size:12px;font-weight:600;text-decoration:none;">${actionBtnText}</a>` : ''}
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
          <nav class="text-xs text-inksoft mb-6 flex items-center gap-1.5 flex-wrap">
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
              ${update.is_verified ? '<span class="bg-emerald-100 text-emerald-800 text-xs font-sans font-bold px-3 py-1 rounded-full border border-emerald-300">✓ Official Source Verified</span>' : ''}
              <span class="text-xs font-sans text-inksoft">
                Published: ${pubDate}
              </span>
            </div>
            <h1 class="font-serif text-2xl sm:text-4xl font-bold text-ink leading-tight mb-4">
              ${title}
            </h1>
            ${shortDesc ? `<p class="font-sans text-base sm:text-lg text-inksoft leading-relaxed border-l-4 border-green pl-4 py-1 bg-paper mb-6">${shortDesc}</p>` : ''}
            ${specsBox}
          </header>
          ${statusBanner}
          ${transparencyNote}
          <div class="font-sans text-ink text-base leading-relaxed space-y-5 mb-10 border-b border-line pb-8">
            ${contentHtml}
          </div>
          ${actionButtons}
        </article>
      </main>
      <footer class="border-t border-line bg-white py-12 mt-16 font-sans">
        <div class="container-x text-center text-xs text-inksoft">
          <p>© 2026 CareerDost. Pakistan's Daily Career, Education &amp; Opportunity Hub.</p>
        </div>
      </footer>
    </div>
  `
}

function generateJobHtml(article, canonical) {
  const title = escapeHtml(article.title || '')
  const categorySlug = escapeHtml(article.category_slug || 'government-jobs')
  const cType = detectContentTypeEdge(categorySlug, article.title, article.slug, article.job_type)
  const categoryLabel = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const org = article.organization ? escapeHtml(article.organization) : ''
  const loc = article.location ? escapeHtml(article.location) : ''
  const qual = article.qualification ? escapeHtml(article.qualification) : ''
  const salary = article.salary ? escapeHtml(article.salary) : ''
  const jobType = article.job_type ? escapeHtml(article.job_type) : ''
  const pubDate = article.publish_date ? escapeHtml(article.publish_date) : ''
  const lastDate = article.last_date ? escapeHtml(article.last_date) : ''
  const excerpt = article.excerpt ? escapeHtml(article.excerpt) : ''
  const officialLink = article.official_link ? escapeHtml(article.official_link) : ''
  const contentHtml = renderContentBlocks(article.content, article.title)

  let orgLabel = 'Organization'
  let locLabel = 'Location'
  let qualLabel = 'Qualification'
  let salaryLabel = 'Salary / Scale'
  let jobTypeLabel = 'Job Type'
  let dateLabel = 'Last Date to Apply'
  let actionBtnText = 'Official Website / Apply Link ↗'
  let typeBadge = categoryLabel

  if (cType === 'notification') {
    orgLabel = 'Issuing Authority'
    locLabel = 'Jurisdiction / Scope'
    qualLabel = 'Protected Beneficiaries'
    salaryLabel = 'Notified Rates / Mandate'
    jobTypeLabel = 'Regulatory Mandate'
    dateLabel = 'Effective Date'
    actionBtnText = 'View Official Notification / Gazette ↗'
    typeBadge = 'Official Notification'
  } else if (cType === 'scheme') {
    orgLabel = 'Administering Department'
    locLabel = 'Coverage Area'
    qualLabel = 'Eligibility Criteria'
    salaryLabel = 'Assistance / Grant'
    jobTypeLabel = 'Public Scheme'
    dateLabel = 'Application Window'
    actionBtnText = 'Official Scheme Portal ↗'
    typeBadge = 'Government Scheme'
  } else if (cType === 'admission') {
    orgLabel = 'University / Institute'
    locLabel = 'Campus Location'
    qualLabel = 'Required Prior Education'
    salaryLabel = 'Program / Fee Scale'
    jobTypeLabel = 'Admission Track'
    dateLabel = 'Admission Deadline'
    actionBtnText = 'Official Admission Portal ↗'
    typeBadge = 'Admission Notice'
  } else if (cType === 'scholarship') {
    orgLabel = 'Awarding Body'
    locLabel = 'Eligible Region'
    qualLabel = 'Eligibility Criteria'
    salaryLabel = 'Funding Coverage'
    jobTypeLabel = 'Scholarship Type'
    dateLabel = 'Submission Deadline'
    actionBtnText = 'Official Scholarship Portal ↗'
    typeBadge = 'Scholarship Program'
  }

  const specsBox = (org || loc || qual || salary || jobType || lastDate) ? `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-paper border border-line mb-6 text-xs" style="background:#faf9f6;border:1px solid #e7e5e4;padding:16px;margin-bottom:24px;">
      ${org ? `<div><span style="color:#78716c;display:block;">${orgLabel}</span><strong style="color:#1c1917;">${org}</strong></div>` : ''}
      ${loc ? `<div><span style="color:#78716c;display:block;">${locLabel}</span><strong style="color:#1c1917;">${loc}</strong></div>` : ''}
      ${qual ? `<div><span style="color:#78716c;display:block;">${qualLabel}</span><strong style="color:#1c1917;">${qual}</strong></div>` : ''}
      ${salary ? `<div><span style="color:#78716c;display:block;">${salaryLabel}</span><strong style="color:#1c1917;">${salary}</strong></div>` : ''}
      ${jobType ? `<div><span style="color:#78716c;display:block;">${jobTypeLabel}</span><strong style="color:#1c1917;">${jobType}</strong></div>` : ''}
      ${lastDate ? `<div><span style="color:#78716c;display:block;">${dateLabel}</span><strong style="color:#1c1917;">${lastDate}</strong></div>` : ''}
    </div>` : ''

  let statusBanner = ''
  if (cType === 'notification') {
    statusBanner = `
      <div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:16px;margin-bottom:24px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <strong style="color:#065f46;display:block;font-size:14px;">Official Statutory Notification (In Force)</strong>
          <span style="color:#047857;font-size:12px;">This is an enforceable gazette notification, not a job vacancy. No application fee or job submission is required.</span>
        </div>
        ${officialLink ? `<a href="${officialLink}" target="_blank" rel="noopener noreferrer" style="background:#059669;color:#ffffff;padding:8px 16px;font-size:12px;font-weight:700;text-decoration:none;border-radius:4px;">${actionBtnText}</a>` : ''}
      </div>`
  }

  const transparencyNote = `
    <div style="background:#faf9f6;border-left:4px solid #059669;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#44403c;">
      <strong>Official Source &amp; Editorial Transparency:</strong> Official notification details and schedules are verified from government gazettes and administrative records. CareerDost provides editorial analysis and practical guidance to assist citizens.
    </div>`

  const actionButtons = officialLink ? `
    <div style="background:#faf9f6;border:1px solid #e7e5e4;padding:20px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div>
        <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;display:block;">Official Source Link</strong>
        <span style="font-size:12px;color:#78716c;">Verified CareerDost Notification Record</span>
      </div>
      <div>
        <a href="${officialLink}" target="_blank" rel="noopener noreferrer" style="background:#059669;color:#ffffff;padding:8px 20px;font-size:12px;font-weight:600;text-decoration:none;border-radius:2px;">${actionBtnText}</a>
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
          <nav class="text-xs text-inksoft mb-6 flex items-center gap-1.5 flex-wrap">
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
              <span class="text-xs font-sans text-inksoft">
                Published: ${pubDate}
              </span>
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
          ${actionButtons}
        </article>
      </main>
      <footer class="border-t border-line bg-white py-12 mt-16 font-sans">
        <div class="container-x text-center text-xs text-inksoft">
          <p>© 2026 CareerDost. Pakistan's Daily Career, Education &amp; Opportunity Hub.</p>
        </div>
      </footer>
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

  const rawPath = url.pathname
  const normalizedPath = rawPath.replace(/\/+$/, '') || '/'
  const lowerPath = normalizedPath.toLowerCase()

  // 0. Dedicated Google Search Console verification token file handler
  if (lowerPath === '/googlefa0859c31163b27d.html') {
    return new Response('google-site-verification: googlefa0859c31163b27d.html\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }

  // 1. Static files & API routes pass directly to asset/function handlers
  if (
    normalizedPath.startsWith('/api/') ||
    normalizedPath.startsWith('/images/') ||
    normalizedPath.startsWith('/assets/') ||
    /\.[a-z0-9]+$/i.test(normalizedPath)
  ) {
    return await context.next()
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

  // 4. Admin & private pages: enforce noindex, nofollow on server response
  if (lowerPath === '/admin' || lowerPath.startsWith('/admin/')) {
    return new HTMLRewriter()
      .on('head', {
        element(e) {
          e.append('<meta name="robots" content="noindex, nofollow" />', { html: true })
        },
      })
      .transform(response)
  }

  // 2. Daily updates pages: /daily-updates/:slug
  if (pathname.startsWith('/daily-updates/')) {
    const slug = pathname.replace('/daily-updates/', '').split('/')[0]
    if (slug) {
      if (context.env?.DB) {
        try {
          const update = await context.env.DB
            .prepare(
              `SELECT id, slug, title, short_description, content, seo_title, meta_description,
                      featured_image, image_alt, category, organization, location,
                      qualification, positions, job_type, salary, publish_date,
                      deadline, no_deadline, official_link, apply_link, is_verified,
                      status
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
                  if (ogImage) {
                    e.append(`<link rel="preload" as="image" href="${ogImage}" fetchpriority="high" />\n`, { html: true })
                  }
                  const jsonLd = {
                    '@context': 'https://schema.org',
                    '@graph': [
                      {
                        '@type': 'NewsArticle',
                        headline: update.title,
                        description: update.meta_description || update.short_description,
                        datePublished: update.publish_date,
                        dateModified: update.publish_date,
                        image: ogImage,
                        mainEntityOfPage: {
                          '@type': 'WebPage',
                          '@id': canonical,
                        },
                        author: {
                          '@type': 'Organization',
                          name: 'CareerDost',
                          url: SITE_URL,
                        },
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
                  e.append(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
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

            return rewriter.transform(response)
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
      if (context.env?.DB) {
        try {
          const article = await context.env.DB
            .prepare(
              `SELECT id, slug, title, excerpt, content, seo_title, meta_description, featured_image, image_alt,
                      category_slug, organization, location, qualification, salary, experience, positions,
                      publish_date, last_date, no_deadline, job_type, apply_link, official_link, is_verified,
                      status
               FROM articles WHERE slug = ? LIMIT 1`
            )
            .bind(slug)
            .first()

          if (article && article.status === 'published') {
            const pageTitle = cleanPlainText(article.seo_title || `${article.title} — CareerDost`)
            const pageDesc = cleanPlainText(article.meta_description || article.excerpt || `Check ${article.title} details, requirements, and official application process on CareerDost.`)
            const canonical = `${SITE_URL}/jobs/${slug}`
            const ogImage = getAbsoluteUrl(article.featured_image)
            const jobHtml = generateJobHtml(article, canonical)

            const isJob = ['government-jobs', 'private-jobs', 'bank-jobs', 'it-jobs', 'internships'].includes(article.category_slug)

            const mainSchema = isJob
              ? {
                  '@type': 'JobPosting',
                  title: article.title,
                  description: article.meta_description || article.excerpt || article.title,
                  datePosted: article.publish_date,
                  validThrough: article.last_date || undefined,
                  employmentType: article.category_slug === 'internships' ? 'INTERN' : 'FULL_TIME',
                  hiringOrganization: {
                    '@type': 'Organization',
                    name: article.organization || 'CareerDost',
                    sameAs: article.official_link || undefined,
                  },
                  jobLocation: {
                    '@type': 'Place',
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: article.location || 'Pakistan',
                      addressCountry: 'PK',
                    },
                  },
                  baseSalary: article.salary
                    ? {
                        '@type': 'MonetaryAmount',
                        currency: 'PKR',
                        value: {
                          '@type': 'QuantitativeValue',
                          value: article.salary,
                        },
                      }
                    : undefined,
                }
              : {
                  '@type': 'Article',
                  headline: article.title,
                  description: article.meta_description || article.excerpt,
                  datePublished: article.publish_date,
                  dateModified: article.publish_date,
                  image: ogImage,
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': canonical,
                  },
                  author: {
                    '@type': 'Organization',
                    name: 'CareerDost',
                    url: SITE_URL,
                  },
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
                  if (ogImage) {
                    e.append(`<link rel="preload" as="image" href="${ogImage}" fetchpriority="high" />\n`, { html: true })
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
                  e.append(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true })
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

            return rewriter.transform(response)
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
    const homeTitle = 'CareerDost | Pakistan Jobs, Sindh Govt Schemes & Latest Updates'
    const homeDesc = 'CareerDost provides the latest Pakistan jobs, Sindh government schemes, BISP updates, scholarships, admissions, and public information with official source links.'
    const canonical = `${SITE_URL}/`
    const ogImage = DEFAULT_OG_IMAGE

    return new HTMLRewriter()
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
      .transform(response)
  }

  // 6. About Page: /about
  if (lowerPath === '/about') {
    const pageTitle = 'About CareerDost — Pakistan Jobs, Schemes & Verification Policy'
    const pageDesc = 'Learn about CareerDost, an independent Pakistan-focused opportunity and public information platform covering Sindh schemes, federal jobs, scholarships, and admissions.'
    const canonical = `${SITE_URL}/about`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .transform(response)
  }

  // 7. Contact Page: /contact
  if (lowerPath === '/contact') {
    const pageTitle = 'Contact CareerDost — Official Editorial & Query Helpdesk'
    const pageDesc = 'Contact the CareerDost editorial desk to submit inquiries, report listing updates, or verify official government gazette sources.'
    const canonical = `${SITE_URL}/contact`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .transform(response)
  }

  // 8. Daily Updates Index: /daily-updates
  if (lowerPath === '/daily-updates') {
    const pageTitle = 'Daily Career & Education Updates in Pakistan — CareerDost'
    const pageDesc = 'Live real-time feed of Pakistan career notifications, university admissions, testing roll numbers, and government scheme updates.'
    const canonical = `${SITE_URL}/daily-updates`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .on('meta[property="og:title"]', { element: (e) => e.setAttribute('content', pageTitle) })
      .on('meta[property="og:description"]', { element: (e) => e.setAttribute('content', pageDesc) })
      .on('meta[property="og:url"]', { element: (e) => e.setAttribute('content', canonical) })
      .transform(response)
  }

  // 9. Search Page: /search
  if (lowerPath === '/search') {
    const pageTitle = 'Search Pakistan Jobs, Admissions & Schemes — CareerDost'
    const canonical = `${SITE_URL}/search`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .transform(response)
  }

  // 10. Legal Pages: /privacy-policy, /disclaimer, /terms-and-conditions
  if (lowerPath === '/privacy-policy') {
    const pageTitle = 'Privacy Policy — CareerDost'
    const canonical = `${SITE_URL}/privacy-policy`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .transform(response)
  }

  if (lowerPath === '/disclaimer') {
    const pageTitle = 'Disclaimer Notice — CareerDost'
    const canonical = `${SITE_URL}/disclaimer`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
      .transform(response)
  }

  if (lowerPath === '/terms-and-conditions') {
    const pageTitle = 'Terms & Conditions — CareerDost'
    const canonical = `${SITE_URL}/terms-and-conditions`
    return new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(pageTitle) })
      .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', canonical) })
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
