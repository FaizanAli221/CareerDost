import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const db = new Database('careerdost.sqlite')

const testDrafts = [
  {
    slug: 'wheat-seed-prices-2026-pakistan-nsdra-directives',
    title: 'Wheat Seed Prices 2026: Government Urges Private Firms to Lower Rates & NSDRA Facilitates Inter-Provincial Movement',
    source: 'Press Release PR No. 191',
    authority: 'NSDRA',
    image: 'wheat-seed-prices-2026-pakistan-nsdra-directives'
  },
  {
    slug: 'fbr-tax-return-deadline-2026-extension-status-iris-filing-guide',
    title: 'FBR Income Tax Return Deadline 2026: Final October 15 Filing Cut-off, Extension Requests & Official IRIS Verification',
    source: 'FBR Circular No. 3 of 2026-27',
    authority: 'FBR',
    image: 'fbr-tax-return-deadline-2026-extension-status-iris-filing-guide'
  }
]

async function verifyDrafts() {
  console.log('=== VERIFYING OCT 15 DRAFTS PERSISTENCE, ASSETS & SAFETY ===\n')

  let passCount = 0
  let failCount = 0

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✓ PASS: ${msg}`)
      passCount++
    } else {
      console.error(`  ✗ FAIL: ${msg}`)
      failCount++
    }
  }

  // 1. Database Draft Persistence
  console.log('--- 1. Database Persistence in careerdost.sqlite ---')
  for (const t of testDrafts) {
    const art = db.prepare('SELECT * FROM articles WHERE slug = ?').get(t.slug)
    assert(art !== undefined, `Article row exists in 'articles' table for ${t.slug}`)
    if (art) {
      assert(art.status === 'draft', `Article status is 'draft' (Found: ${art.status})`)
      assert(art.title === t.title, `Article title matches exact specification`)
      assert(art.canonical_url === `https://careerdost.blog/jobs/${t.slug}`, `Canonical URL is valid`)
      assert(art.is_verified === 1, `Article has is_verified=1`)
      assert(art.content && art.content.length > 500, `Article content body is substantial (${art.content?.length} chars)`)
    }

    const upd = db.prepare('SELECT * FROM daily_updates WHERE slug = ?').get(t.slug)
    assert(upd !== undefined, `Update row exists in 'daily_updates' table for ${t.slug}`)
    if (upd) {
      assert(upd.status === 'draft', `Daily update status is 'draft' (Found: ${upd.status})`)
    }
  }

  // 2. Featured Image Files
  console.log('\n--- 2. Image Asset Files in public/images/ ---')
  for (const t of testDrafts) {
    const webpPath = path.resolve(`public/images/${t.image}.webp`)
    const jpgPath = path.resolve(`public/images/${t.image}.jpg`)
    assert(fs.existsSync(webpPath), `WebP image exists at ${webpPath}`)
    assert(fs.existsSync(jpgPath), `JPG image exists at ${jpgPath}`)
    if (fs.existsSync(webpPath)) {
      const stat = fs.statSync(webpPath)
      assert(stat.size > 20000, `WebP image file size is healthy (${(stat.size / 1024).toFixed(1)} KB)`)
    }
    if (fs.existsSync(jpgPath)) {
      const stat = fs.statSync(jpgPath)
      assert(stat.size > 20000, `JPG image file size is healthy (${(stat.size / 1024).toFixed(1)} KB)`)
    }
  }

  // 3. Sitemap Exclusion
  console.log('\n--- 3. Exclusion from Public Sitemap ---')
  const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf8')
  for (const t of testDrafts) {
    const inSitemap = sitemapContent.includes(t.slug)
    assert(!inSitemap, `Draft slug '${t.slug}' is strictly EXCLUDED from sitemap.xml`)
  }

  // 4. Admin Authentication Integrity
  console.log('\n--- 4. Admin Authentication & Database Integrity ---')
  const adminRows = db.prepare('SELECT id, username, email, role FROM admins').all()
  assert(adminRows.length > 0, `Admin account exists in database (${adminRows.length} account(s) found)`)
  for (const a of adminRows) {
    console.log(`     User: ${a.username} (${a.email}) - Role: ${a.role}`)
  }

  // 5. Internal Links Verification
  console.log('\n--- 5. Internal Links Integrity in Content ---')
  const allArticles = db.prepare('SELECT slug FROM articles').all().map(a => a.slug)
  const allArticleSlugs = new Set(allArticles)
  for (const t of testDrafts) {
    const art = db.prepare('SELECT content FROM articles WHERE slug = ?').get(t.slug)
    if (art && art.content) {
      const links = art.content.match(/careerdost\.blog\/jobs\/([a-z0-9\-]+)/g) || []
      for (const link of links) {
        const linkedSlug = link.replace('careerdost.blog/jobs/', '')
        const exists = allArticleSlugs.has(linkedSlug)
        assert(exists, `Internal link target '${linkedSlug}' exists in CareerDost database`)
      }
    }
  }

  console.log(`\n=== DRAFTS VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED ===\n`)
  if (failCount > 0) {
    process.exit(1)
  }
}

verifyDrafts().catch(err => {
  console.error('Error verifying drafts:', err)
  process.exit(1)
})
