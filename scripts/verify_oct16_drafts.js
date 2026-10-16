import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const db = new Database('careerdost.sqlite')

const testDrafts = [
  {
    slug: 'electricity-bills-november-2026-rs256-fuel-adjustment-explained',
    title: 'Electricity Bills November 2026: Rs2.56 Per Unit Fuel Adjustment Explained',
    source: 'Associated Press of Pakistan',
    authority: 'NEPRA',
    image: 'electricity-bills-november-2026-rs256-fuel-adjustment-explained'
  }
]

async function verifyDrafts() {
  console.log('=== VERIFYING OCT 16 DRAFT PERSISTENCE, ASSETS & SAFETY ===\n')

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
      assert(art.content && art.content.length > 2000, `Article content body is substantial (${art.content?.length} chars)`)
      assert(art.content.includes('Rs2.56'), `Article content includes projected Rs2.56/unit figure`)
      assert(art.content.includes('Rs32.7 billion'), `Article content includes Rs32.7 billion aggregate impact`)
      assert(art.content.includes('NEPRA'), `Article content includes NEPRA regulatory verification guidance`)
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

  // 3. Sitemap Exclusion while in Draft
  console.log('\n--- 3. Exclusion from Public Sitemap While in Draft ---')
  const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf8')
  for (const t of testDrafts) {
    const inSitemap = sitemapContent.includes(t.slug)
    assert(!inSitemap, `Draft slug '${t.slug}' is strictly EXCLUDED from sitemap.xml while status='draft'`)
  }

  // 4. Existing Sindh Articles Integrity (Benazir Hari Card, BISP, Mamta)
  console.log('\n--- 4. Existing Sindh Content Integrity (No Duplicate Churn) ---')
  const sindhSlugs = [
    'sindh-wheat-subsidy-benazir-hari-card-2026',
    'bisp-8171-payment-check-2026-official-guide',
    'sindh-mamta-programme-2026-october-dashboard'
  ]
  for (const sSlug of sindhSlugs) {
    const rows = db.prepare('SELECT id, slug, status FROM articles WHERE slug = ?').all(sSlug)
    assert(rows.length === 1 && rows[0].status === 'published', `Existing Sindh article '${sSlug}' preserved without duplication (status: ${rows[0]?.status})`)
  }

  // 5. Internal Links Verification
  console.log('\n--- 5. Internal Links Integrity in Content ---')
  const allArticles = db.prepare('SELECT slug FROM articles').all().map(a => a.slug)
  const allArticleSlugs = new Set(allArticles)
  for (const t of testDrafts) {
    const art = db.prepare('SELECT content FROM articles WHERE slug = ?').get(t.slug)
    if (art && art.content) {
      const links = art.content.match(/careerdost\.blog\/jobs\/([a-z0-9\-]+)/g) || []
      assert(links.length >= 4, `Article contains ${links.length} internal links to CareerDost articles`)
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
