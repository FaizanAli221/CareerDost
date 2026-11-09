import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { extractCleanJobDesignation, buildJobPostingSchema, isGenuineJobVacancy } from '../src/lib/jobSchema.js'

const ROOT = process.cwd()
const db = new Database(path.join(ROOT, 'careerdost.sqlite'), { readonly: true })
const middlewareCode = fs.readFileSync(path.join(ROOT, 'functions/_middleware.js'), 'utf8')
const privacyJsx = fs.readFileSync(path.join(ROOT, 'src/pages/Privacy.jsx'), 'utf8')
const appJsx = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf8')
const articlesRouteCode = fs.readFileSync(path.join(ROOT, 'server/routes/articles.js'), 'utf8')
const seoRouteCode = fs.readFileSync(path.join(ROOT, 'server/routes/seo.js'), 'utf8')
const sitemapXml = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8')

let passed = 0
function check(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}\n    ${err.stack || err.message}`)
    process.exitCode = 1
  }
}

console.log('\n=== CareerDost AdSense Approved Fixes Verification Suite ===\n')

// 1. Three Alias Slug Problems
check('Fix 1a: lookupSlug aliasing removed from _middleware.js and server/routes/articles.js so window.__INITIAL_ARTICLE__.slug always matches canonical URL slug', () => {
  assert.ok(!middlewareCode.includes('const lookupSlug ='), 'lookupSlug aliasing must be removed from _middleware.js')
  assert.ok(!middlewareCode.includes("'sindh-cti-jobs-2026-college-teaching-interns'"), 'sindh-cti-jobs-2026-college-teaching-interns must not alias to unrelated RSU article')
  assert.ok(!articlesRouteCode.includes('sindh-cti-jobs-2026-college-teaching-interns'), 'server/routes/articles.js must not alias sindh-cti-jobs-2026-college-teaching-interns')
})

check('Fix 1b: /jobs/spsc-combined-competitive-exam-guide-2026 and /jobs/njp-balochistan-quota-federal-jobs-november-2026 redirect in 1 hop (301) to verified canonical articles', () => {
  assert.ok(
    middlewareCode.includes("['/jobs/spsc-combined-competitive-exam-guide-2026', '/jobs/spsc-exam-preparation-screening-challan-guide']"),
    'Middleware must 301 redirect /jobs/spsc-combined-competitive-exam-guide-2026 -> /jobs/spsc-exam-preparation-screening-challan-guide'
  )
  assert.ok(
    middlewareCode.includes("['/jobs/njp-balochistan-quota-federal-jobs-november-2026', '/jobs/economic-affairs-division-jobs-balochistan-2026']"),
    'Middleware must 301 redirect /jobs/njp-balochistan-quota-federal-jobs-november-2026 -> /jobs/economic-affairs-division-jobs-balochistan-2026'
  )
  assert.ok(
    appJsx.includes('path="/jobs/spsc-combined-competitive-exam-guide-2026"') &&
      appJsx.includes('to="/jobs/spsc-exam-preparation-screening-challan-guide"'),
    'App.jsx must include client-side <Navigate> for /jobs/spsc-combined-competitive-exam-guide-2026'
  )
  assert.ok(
    appJsx.includes('path="/jobs/njp-balochistan-quota-federal-jobs-november-2026"') &&
      appJsx.includes('to="/jobs/economic-affairs-division-jobs-balochistan-2026"'),
    'App.jsx must include client-side <Navigate> for /jobs/njp-balochistan-quota-federal-jobs-november-2026'
  )
})

// 2. Adsterra Privacy Disclosure
check('Fix 2: Privacy Policy (Privacy.jsx and SSR _middleware.js) discloses Adsterra, third-party ad domains, cookies, web beacons, and opt-out controls while preserving Adsterra components', () => {
  assert.ok(privacyJsx.includes('Adsterra'), 'Privacy.jsx must disclose Adsterra')
  assert.ok(privacyJsx.includes('highperformanceformat.com'), 'Privacy.jsx must disclose Adsterra delivery domain')
  assert.ok(middlewareCode.includes('Adsterra'), '_middleware.js SSR privacy policy must disclose Adsterra')
  assert.ok(middlewareCode.includes('highperformanceformat.com'), '_middleware.js SSR privacy policy must disclose Adsterra delivery domain')
  assert.ok(fs.existsSync(path.join(ROOT, 'src/components/AdsterraBanner300x250.jsx')), 'AdsterraBanner300x250.jsx must remain intact')
  assert.ok(fs.existsSync(path.join(ROOT, 'src/components/AdsterraNativeBanner.jsx')), 'AdsterraNativeBanner.jsx must remain intact')
})

// 3. Thin Daily Updates (ID 1 and ID 2)
check('Fix 3: Thin daily updates ID 1 and ID 2 remain published in DB but are excluded from sitemap.xml and marked noindex, follow', () => {
  const upd1 = db.prepare('SELECT id, slug, status FROM daily_updates WHERE id = 1').get()
  const upd2 = db.prepare('SELECT id, slug, status FROM daily_updates WHERE id = 2').get()
  assert.equal(upd1.status, 'published', 'Update ID 1 must remain published in DB')
  assert.equal(upd2.status, 'published', 'Update ID 2 must remain published in DB')

  assert.ok(!sitemapXml.includes(upd1.slug), `public/sitemap.xml must exclude ${upd1.slug}`)
  assert.ok(!sitemapXml.includes(upd2.slug), `public/sitemap.xml must exclude ${upd2.slug}`)
  assert.ok(middlewareCode.includes(`'${upd1.slug}'`) && middlewareCode.includes(`'${upd2.slug}'`), '_middleware.js NOINDEX_UPDATE_SLUGS must include ID 1 and ID 2')
  assert.ok(seoRouteCode.includes(`'${upd1.slug}'`) && seoRouteCode.includes(`'${upd2.slug}'`), 'server/routes/seo.js must exclude ID 1 and ID 2 from sitemap')
})

// 4. JobPosting Schema Titles (IDs 564, 565, 567, 571)
check('Fix 4: JobPosting.title for articles 564, 565, 567, and 571 emits clean verified job designations without raw vacancy counts', () => {
  const expected = {
    'sindh-irrigation-department-jobs-2026-badin-tando-muhammad-khan': 'Darogha, Jeep Driver, Gauge Reader, Beldar & Field Staff (BPS-01 to BPS-04)',
    'district-sessions-court-dadu-jobs-2026-nts': 'Stenographer (BPS-16), Data Coder (BPS-14) & Junior Clerk (BPS-11)',
    'islamabad-police-jobs-2026-790-constable-asi-sub-inspector': 'Constable (BS-07), Assistant Sub-Inspector (BS-11) & Sub-Inspector (BS-14)',
    'survey-of-pakistan-jobs-2026-naib-qasid-sanitary-worker': 'Naib Qasid & Sanitary Worker (BPS-01)',
  }

  for (const [slug, expectedTitle] of Object.entries(expected)) {
    const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug)
    assert.ok(row, `Article ${slug} must exist in SQLite`)
    assert.equal(extractCleanJobDesignation(row), expectedTitle)
    assert.equal(isGenuineJobVacancy(row, 'job'), true, `${slug} should qualify as genuine active job vacancy`)
    const schema = buildJobPostingSchema(row)
    assert.equal(schema['@type'], 'JobPosting')
    assert.equal(schema.title, expectedTitle)
    assert.ok(!/^\d+\s/.test(schema.title), `JobPosting.title must not start with raw vacancy count: ${schema.title}`)
  }
})

// 5. Editorial Hold Article ID 357
check('Fix 5: Article ID 357 (hyderabad-division-section-144-notification-2026) preserves DB record and Editorial Hold notice while excluded from sitemap and marked noindex, follow', () => {
  const row = db.prepare("SELECT id, slug, title, status FROM articles WHERE slug = 'hyderabad-division-section-144-notification-2026'").get()
  assert.equal(row.slug, 'hyderabad-division-section-144-notification-2026')
  assert.equal(row.status, 'published')
  assert.ok(row.title.includes('(Editorial Hold)'), 'DB record must preserve Editorial Hold warning')
  assert.ok(!sitemapXml.includes('hyderabad-division-section-144-notification-2026'), 'public/sitemap.xml must exclude ID 357')
  assert.ok(middlewareCode.includes("'hyderabad-division-section-144-notification-2026'"), '_middleware.js NOINDEX_ARTICLE_SLUGS must include ID 357')
  assert.ok(seoRouteCode.includes("'hyderabad-division-section-144-notification-2026'"), 'server/routes/seo.js must exclude ID 357 from sitemap')
})

db.close()

if (!process.exitCode) {
  console.log(`\n✓ ALL ${passed}/${passed} ADSENSE APPROVED FIXES CHECKS PASSED!\n`)
}
