import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const db = new Database('careerdost.sqlite')
const mode = process.argv[2] === 'published' ? 'published' : 'draft'

const testPackages = [
  {
    slug: 'samba-bank-relationship-associate-jobs-2026',
    title: 'Samba Bank Jobs 2026: Relationship Associate (SME Banking) in Karachi & Lahore – Apply by 31 October',
    expectedDraftStatus: mode === 'published' ? 'published' : 'draft',
    image: 'samba-bank-relationship-associate-jobs-2026'
  },
  {
    slug: 'bank-alfalah-jobs-internships-2026',
    title: 'Bank Alfalah Jobs 2026: Counter Service Officer, Fresh Graduate Vacancies & Internships Guide',
    expectedDraftStatus: 'published',
    image: 'bank-alfalah-jobs-internships-2026'
  },
  {
    slug: 'mrp-elite-graduate-trainee-karachi-2026',
    title: 'MRP Elite Graduate Trainee Officer (GTO) Karachi 2026: IT & Database Track Verification Status',
    expectedDraftStatus: 'draft',
    image: 'mrp-elite-graduate-trainee-karachi-2026'
  },
  {
    slug: 'ezy-business-applications-paid-internship-karachi-2026',
    title: 'EZY Business Applications Paid Sales Internship Karachi 2026: Rs 30,000 Stipend & Night Shift Guide',
    expectedDraftStatus: mode === 'published' ? 'published' : 'draft',
    image: 'ezy-business-applications-paid-internship-karachi-2026'
  },
  {
    slug: 'unilever-pakistan-jobs-october-2026',
    title: 'Unilever Pakistan Jobs October 2026: 5 Verified Openings in Karachi & Lahore (Apply by 23–24 Oct)',
    expectedDraftStatus: mode === 'published' ? 'published' : 'draft',
    image: 'unilever-pakistan-jobs-october-2026'
  }
]

async function verifyDrafts() {
  console.log(`=== VERIFYING OCT 18 EDITORIAL PACKAGES (${mode.toUpperCase()} MODE), WORD COUNTS, ASSETS & DUPLICATE PREVENTION ===\n`)

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

  // 1. Database Persistence & Word Counts (600-900 words)
  console.log('--- 1. Database Persistence & 600–900 Word Standard ---')
  for (const t of testPackages) {
    const art = db.prepare('SELECT * FROM articles WHERE slug = ?').get(t.slug)
    assert(art !== undefined, `Article row exists in 'articles' table for ${t.slug}`)
    if (art) {
      assert(art.status === t.expectedDraftStatus, `Article status is '${t.expectedDraftStatus}' (Found: ${art.status})`)
      assert(art.title === t.title, `Article title matches specification for ${t.slug}`)
      assert(art.canonical_url === `https://careerdost.blog/jobs/${t.slug}`, `Canonical URL matches: ${art.canonical_url}`)
      const contentArr = JSON.parse(art.content)
      const proseWords = contentArr.join(' ').replace(/https?:\/\/[^\s)]+/g, '').replace(/[#*|>\-\[\]\(\)`]/g, ' ').trim().split(/\s+/).filter(Boolean).length
      assert(proseWords >= 600 && proseWords <= 900, `Word count for ${t.slug} is within 600–900 words (${proseWords} words)`)
      assert(art.content.includes('Frequently Asked Questions (FAQs)'), `Includes FAQs section (${t.slug})`)
      assert(art.content.includes('WARNING') || art.content.includes('Fraud'), `Includes fraud-prevention advice (${t.slug})`)
    }
  }

  // 2. Duplicate Prevention Check for Bank Alfalah
  console.log('\n--- 2. Duplicate Prevention Check (Single Combined Bank Alfalah Article) ---')
  const alfalahRows = db.prepare("SELECT id, slug, status FROM articles WHERE slug LIKE '%alfalah%' OR title LIKE '%Alfalah%'").all()
  assert(alfalahRows.length === 1 && alfalahRows[0].slug === 'bank-alfalah-jobs-internships-2026', `Exactly 1 combined Bank Alfalah article exists (count=${alfalahRows.length}, slug=${alfalahRows[0]?.slug})`)

  // 3. Featured Image Files
  console.log('\n--- 3. Featured Image Assets in public/images/ ---')
  for (const t of testPackages) {
    const webpPath = path.resolve(`public/images/${t.image}.webp`)
    const jpgPath = path.resolve(`public/images/${t.image}.jpg`)
    assert(fs.existsSync(webpPath), `WebP image exists: ${webpPath}`)
    assert(fs.existsSync(jpgPath), `JPG image exists: ${jpgPath}`)
    if (fs.existsSync(webpPath)) {
      const stat = fs.statSync(webpPath)
      assert(stat.size > 15000, `WebP image file size is healthy (${(stat.size / 1024).toFixed(1)} KB)`)
    }
    if (fs.existsSync(jpgPath)) {
      const stat = fs.statSync(jpgPath)
      assert(stat.size > 15000, `JPG image file size is healthy (${(stat.size / 1024).toFixed(1)} KB)`)
    }
  }

  // 4. Sitemap Exclusion While New Articles Are in Draft
  console.log('\n--- 4. Exclusion of Draft Slugs from Public Sitemap ---')
  const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf8')
  for (const t of testPackages.filter(x => x.expectedDraftStatus === 'draft')) {
    const inSitemap = sitemapContent.includes(t.slug)
    assert(!inSitemap, `Draft slug '${t.slug}' is excluded from sitemap.xml while status='draft'`)
  }

  // 5. Internal Links Verification
  console.log('\n--- 5. Internal Links Integrity in Content ---')
  const allArticles = db.prepare('SELECT slug FROM articles').all().map(a => a.slug)
  const allArticleSlugs = new Set(allArticles)
  for (const t of testPackages) {
    const art = db.prepare('SELECT content FROM articles WHERE slug = ?').get(t.slug)
    if (art && art.content) {
      const links = art.content.match(/careerdost\.blog\/jobs\/([a-z0-9\-]+)/g) || []
      assert(links.length >= 2, `Article '${t.slug}' contains ${links.length} internal links`)
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
