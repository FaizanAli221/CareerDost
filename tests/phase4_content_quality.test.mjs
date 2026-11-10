import assert from 'node:assert/strict'
import fs from 'node:fs'
import Database from 'better-sqlite3'

console.log('=== RUNNING PHASE 4: CONTENT QUALITY & CATEGORY CLEANUP TEST SUITE ===\n')

// 1. Verify Category Merge & Redirects
console.log('1. Checking Category Merge & Redirect Setup...')
const middlewareCode = fs.readFileSync('functions/_middleware.js', 'utf8')
const redirectsCode = fs.readFileSync('public/_redirects', 'utf8')
const appCode = fs.readFileSync('src/App.jsx', 'utf8')
const categoriesCode = fs.readFileSync('src/data/categories.js', 'utf8')

// Assert redirect in middleware
assert.ok(
  middlewareCode.includes("['/category/career-guides', '/category/guides-and-resources']"),
  'STATIC_ROUTE_REDIRECTS must redirect /category/career-guides to /category/guides-and-resources'
)

// Assert career-guides removed from VALID_CATEGORIES
const validCatsMatch = middlewareCode.match(/const VALID_CATEGORIES = new Set\(\[([\s\S]*?)\]\)/)
assert.ok(validCatsMatch, 'VALID_CATEGORIES definition must exist')
assert.ok(
  !validCatsMatch[1].includes('career-guides'),
  'VALID_CATEGORIES must not contain career-guides'
)
assert.ok(
  validCatsMatch[1].includes('guides-and-resources'),
  'VALID_CATEGORIES must contain guides-and-resources'
)

// Assert redirect in public/_redirects
assert.ok(
  redirectsCode.includes('/category/career-guides /category/guides-and-resources 301'),
  '_redirects must have 301 rule for /category/career-guides'
)

// Assert React Router route in App.jsx
assert.ok(
  appCode.includes('path="/category/career-guides" element={<Navigate to="/category/guides-and-resources" replace />}'),
  'App.jsx must redirect /category/career-guides to /category/guides-and-resources'
)

// Assert categories.js alias
assert.ok(
  categoriesCode.includes("slug === 'career-guides'"),
  'categoryBySlug in categories.js must alias career-guides to guides-and-resources'
)
console.log('  ✓ Category merge and redirect configurations verified successfully.')

// 2. Verify Database Records
console.log('\n2. Checking Database Integrity in careerdost.sqlite...')
const db = new Database('careerdost.sqlite')

// Ensure 0 articles have old category_slug
const oldCatCount = db.prepare("SELECT COUNT(*) as count FROM articles WHERE category_slug = 'career-guides'").get().count
assert.equal(oldCatCount, 0, 'No articles should have category_slug = career-guides in SQLite')

const expectedGuideSlugs = [
  'pakistan-cnic-domicile-prc-application-guide',
  'ots-jobs-online-application-registration-guide',
  'fresh-graduate-cv-format-guide-pakistan',
  'government-job-interview-preparation-guide-pakistan',
]

for (const slug of expectedGuideSlugs) {
  const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug)
  assert.ok(row, `Article with slug ${slug} must exist in SQLite`)
  assert.equal(row.status, 'published', `Article ${slug} must be published`)
  assert.equal(row.category_slug, 'guides-and-resources', `Article ${slug} category_slug must be guides-and-resources`)
  assert.equal(row.is_verified, 1, `Article ${slug} is_verified must be 1`)
  assert.equal(row.no_deadline, 1, `Article ${slug} no_deadline must be 1`)

  // Content depth check
  const parsedContent = JSON.parse(row.content)
  const fullText = parsedContent.join('\n')
  const wordCount = fullText.split(/\s+/).filter(Boolean).length
  console.log(`  ✓ Article ${slug} (ID ${row.id}): ${wordCount} words, verified & published.`)
  assert.ok(wordCount >= 700, `Article ${slug} should have at least 700 words (got ${wordCount})`)
  assert.ok(fullText.includes('## '), `Article ${slug} must contain H2 markdown headings`)
  assert.ok(fullText.includes('|'), `Article ${slug} must contain structured markdown tables`)
  assert.ok(fullText.includes('Frequently Asked Questions'), `Article ${slug} must contain FAQs`)
}

// 3. Verify Images on Disk
console.log('\n3. Checking Featured Images in public/images/...')
for (const slug of expectedGuideSlugs) {
  const webpPath = `public/images/${slug}.webp`
  const jpgPath = `public/images/${slug}.jpg`

  assert.ok(fs.existsSync(webpPath), `Image file ${webpPath} must exist`)
  assert.ok(fs.existsSync(jpgPath), `Image file ${jpgPath} must exist`)

  const webpSize = fs.statSync(webpPath).size
  const jpgSize = fs.statSync(jpgPath).size

  assert.ok(webpSize > 50000, `${webpPath} must be >50KB (got ${webpSize} bytes)`)
  assert.ok(jpgSize > 50000, `${jpgPath} must be >50KB (got ${jpgSize} bytes)`)
  console.log(`  ✓ ${slug}: webp=${(webpSize/1024).toFixed(1)}KB, jpg=${(jpgSize/1024).toFixed(1)}KB`)
}

// 4. Verify Sitemap Alignment
console.log('\n4. Checking sitemap.xml alignment...')
const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8')
assert.ok(!sitemapXml.includes('/category/career-guides'), 'sitemap.xml must NOT contain /category/career-guides')
assert.ok(sitemapXml.includes('/category/guides-and-resources'), 'sitemap.xml must contain /category/guides-and-resources')
for (const slug of expectedGuideSlugs) {
  assert.ok(sitemapXml.includes(`/jobs/${slug}`), `sitemap.xml must contain /jobs/${slug}`)
}
console.log('  ✓ sitemap.xml properly includes active guides and excludes retired category.')

console.log('\nALL PHASE 4 CHECKS PASSED SUCCESSFULLY! ✓')
