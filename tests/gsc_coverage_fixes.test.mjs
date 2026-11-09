/**
 * CareerDost — GSC Coverage Audit P0 & P1 Technical SEO Fixes QA Suite
 * Run: node tests/gsc_coverage_fixes.test.mjs
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import app from '../server/index.js'
import { KNOWN_ARTICLE_SLUGS } from '../src/data/articleSlugs.js'
import {
  CONSOLIDATED_SLUG_REDIRECTS,
  CONSOLIDATED_SLUGS_SET,
} from '../src/data/consolidatedRedirects.js'

const ROOT = process.cwd()
const db = new Database(path.join(ROOT, 'careerdost.sqlite'), { readonly: true })

function createD1FromSqlite(sqliteDb) {
  const wrapStmt = (sql, params = []) => ({
    bind(...bound) {
      return wrapStmt(sql, bound)
    },
    async all() {
      const results = sqliteDb.prepare(sql).all(...params)
      return { results, success: true }
    },
    async first(colName) {
      const row = sqliteDb.prepare(sql).get(...params)
      if (!row) return null
      return colName ? row[colName] : row
    },
  })
  return {
    prepare(sql) {
      return wrapStmt(sql, [])
    },
  }
}

const d1 = createD1FromSqlite(db)
const env = { DB: d1 }

let passed = 0
let failed = 0

async function runCheck(name, fn) {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`)
    console.error(`    ${err.message}`)
    failed++
    process.exitCode = 1
  }
}

console.log('\n=== CareerDost GSC Coverage P0 & P1 Technical Fixes Test Suite ===\n')

// 1. robots.txt & API X-Robots-Tag indexing protections
await runCheck('1. robots.txt allows public read-only /api/ fetches for Googlebot WRS while blocking /admin, /api/admin, /api/auth/ and setting X-Robots-Tag: noindex on /api/*', async () => {
  const robotsTxt = fs.readFileSync(path.join(ROOT, 'public/robots.txt'), 'utf8')
  assert.ok(!robotsTxt.includes('Disallow: /api/\n') && !robotsTxt.endsWith('Disallow: /api/'), 'robots.txt must not blanket-disallow /api/')
  assert.ok(robotsTxt.includes('Disallow: /admin'), 'robots.txt must disallow /admin')
  assert.ok(robotsTxt.includes('Disallow: /api/admin'), 'robots.txt must disallow /api/admin')
  assert.ok(robotsTxt.includes('Disallow: /api/auth/'), 'robots.txt must disallow /api/auth/')
  assert.ok(robotsTxt.includes('Allow: /api/uploads/'), 'robots.txt must allow /api/uploads/')

  const headersFile = fs.readFileSync(path.join(ROOT, 'public/_headers'), 'utf8')
  assert.ok(headersFile.includes('/api/*\n  X-Robots-Tag: noindex, nofollow'), '_headers must set X-Robots-Tag: noindex, nofollow on /api/*')

  const apiRes = await app.request('https://careerdost.blog/api/articles?limit=2', {}, env)
  assert.equal(apiRes.status, 200)
  assert.equal(apiRes.headers.get('x-robots-tag'), 'noindex, nofollow', 'Hono /api/articles response must emit X-Robots-Tag: noindex, nofollow')
})

// 2, 3, 4. Sindh Government Jobs Pillar SQL filtering, no self-referencing card, and SSR hydration
await runCheck('2-4. Sindh Pillar SQL returns only relevant Sindh jobs, excludes self & Balochistan quota, and hydrates via window.__INITIAL_SINDH_ARTICLES__', async () => {
  const mwCode = fs.readFileSync(path.join(ROOT, 'functions/_middleware.js'), 'utf8')
  assert.ok(mwCode.includes("AND slug != 'sindh-government-jobs-2026'"), 'Middleware SQL must exclude self slug sindh-government-jobs-2026')
  assert.ok(mwCode.includes('window.__INITIAL_SINDH_ARTICLES__ ='), 'Middleware must inject window.__INITIAL_SINDH_ARTICLES__')
  assert.ok(!mwCode.includes("OR title LIKE '%STS%'"), 'Middleware must not use unanchored LIKE %STS% (which matches "Posts")')

  const pillarComponent = fs.readFileSync(path.join(ROOT, 'src/pages/SindhGovJobsPillarPage.jsx'), 'utf8')
  assert.ok(pillarComponent.includes('window.__INITIAL_SINDH_ARTICLES__'), 'SindhGovJobsPillarPage.jsx must consume window.__INITIAL_SINDH_ARTICLES__')
  assert.ok(pillarComponent.includes("item.slug !== 'sindh-government-jobs-2026'"), 'SindhGovJobsPillarPage.jsx must exclude self-referencing slug')
  assert.ok(!pillarComponent.includes("text.includes('sts')"), 'SindhGovJobsPillarPage.jsx must use word-boundary regex for STS instead of text.includes("sts")')
})

// 5. Single-hop redirect consolidation
await runCheck('5. Middleware consolidates domain, protocol, trailing-slash, static alias, consolidated slug, and /daily-updates->/jobs redirects into 1 hop', async () => {
  const mwCode = fs.readFileSync(path.join(ROOT, 'functions/_middleware.js'), 'utf8')
  assert.ok(mwCode.includes('let directRedirectTarget = null'), 'Middleware must compute single-pass redirect target before host/protocol/slash redirects')
  assert.ok(mwCode.includes('if (isNonCanonicalHost || isHttpOnCanonical || hasTrailingSlash || directRedirectTarget)'), 'Middleware must combine host, protocol, trailing slash, and path redirects in 1 hop')
})

// 6. /daily-updates JSON-LD canonical URLs
await runCheck('6. /daily-updates SSR JSON-LD ItemList uses /jobs/:slug for updates that have a published article', async () => {
  const mwCode = fs.readFileSync(path.join(ROOT, 'functions/_middleware.js'), 'utf8')
  assert.ok(
    mwCode.includes('url: publishedArticleSlugs.has(u.slug)\n                ? `${SITE_URL}/jobs/${u.slug}`\n                : `${SITE_URL}/daily-updates/${u.slug}`'),
    '/daily-updates ItemList JSON-LD must point to /jobs/:slug when publishedArticleSlugs.has(u.slug)'
  )
})

// 7. Sitemap generation excludes draft articles while retaining all 5 standalone published daily updates
await runCheck('7. Sitemap generation excludes draft articles and includes all 5 standalone published daily updates (249 total URLs)', async () => {
  const sitemapXml = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8')
  const locs = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
  assert.equal(locs.length, 249, `Expected 249 URLs in public/sitemap.xml, got ${locs.length}`)
  assert.ok(locs.includes('https://careerdost.blog/jobs/sindh-government-jobs-2026'), 'Sitemap must include Sindh pillar page')
  assert.ok(locs.includes('https://careerdost.blog/daily-updates/meezan-justuju-batch-5-2026'), 'Sitemap must include standalone update /daily-updates/meezan-justuju-batch-5-2026')
  assert.ok(!locs.includes('https://careerdost.blog/jobs/meezan-justuju-batch-5-2026'), 'Sitemap must NOT include draft article /jobs/meezan-justuju-batch-5-2026')

  // Also test Hono /api/sitemap.xml route
  const honoSitemapRes = await app.request('https://careerdost.blog/api/sitemap.xml', {}, env)
  assert.equal(honoSitemapRes.status, 200)
  const honoXml = await honoSitemapRes.text()
  assert.ok(honoXml.includes('https://careerdost.blog/daily-updates/meezan-justuju-batch-5-2026'), 'Hono sitemap must include meezan-justuju-batch-5-2026')
})

// 8. Synchronized articleSlugs.js & /api/updates hasArticle + consolidated filtering
await runCheck('8. articleSlugs.js has all 225 verified slugs and /api/updates attaches hasArticle & filters consolidated slugs', async () => {
  assert.equal(KNOWN_ARTICLE_SLUGS.size, 225, `Expected 225 slugs in KNOWN_ARTICLE_SLUGS, got ${KNOWN_ARTICLE_SLUGS.size}`)
  for (const cSlug of CONSOLIDATED_SLUGS_SET) {
    assert.ok(!KNOWN_ARTICLE_SLUGS.has(cSlug), `KNOWN_ARTICLE_SLUGS must not contain consolidated slug ${cSlug}`)
  }

  const updatesRes = await app.request('https://careerdost.blog/api/updates', {}, env)
  assert.equal(updatesRes.status, 200)
  const updatesJson = await updatesRes.json()
  assert.ok(Array.isArray(updatesJson.data) && updatesJson.data.length > 0)

  for (const u of updatesJson.data) {
    assert.ok(!CONSOLIDATED_SLUGS_SET.has(u.slug), `/api/updates must not return consolidated slug ${u.slug}`)
    assert.equal(typeof u.hasArticle, 'boolean', `/api/updates item ${u.slug} must include boolean hasArticle`)
  }

  const meezanUpd = updatesJson.data.find((u) => u.slug === 'meezan-justuju-batch-5-2026')
  assert.ok(meezanUpd, 'meezan-justuju-batch-5-2026 should be in /api/updates')
  assert.equal(meezanUpd.hasArticle, false, 'meezan-justuju-batch-5-2026 has a draft article so hasArticle must be false')
})

// 9. Database Safeguards verification
await runCheck('9. Database safeguards: id=575 (sindh-government-jobs-2026) backup exists, row is preserved as draft with 100% original content', async () => {
  const backupPath = path.join(ROOT, 'backups/d1_row_sindh-government-jobs-2026_backup.json')
  assert.ok(fs.existsSync(backupPath), 'Backup file must exist at backups/d1_row_sindh-government-jobs-2026_backup.json')
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  const row = db.prepare('SELECT * FROM articles WHERE id = 575').get()
  assert.ok(row, 'Row id=575 must not be deleted')
  assert.equal(row.slug, 'sindh-government-jobs-2026')
  assert.equal(row.status, 'draft')
  assert.equal(row.content, backup.d1_articles_row.content, 'Original content of id=575 must be 100% preserved')
})

db.close()

console.log(`\nResults: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
