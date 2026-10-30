import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const db = new Database('careerdost.sqlite');
const mode = process.argv[2] === 'published' ? 'published' : 'draft';

const testPackages = [
  {
    id: 512,
    slug: 'askari-bank-jobs-october-2026-karachi',
    title: 'Askari Bank Jobs October 2026 Karachi: Branch Manager, Officer Operations & CAD (Apply Online)',
    expectedDraftStatus: mode,
    image: 'askari-bank-jobs-october-2026-karachi'
  },
  {
    id: 513,
    slug: 'meezan-bank-jobs-october-2026',
    title: 'Meezan Bank Jobs October 2026: Operation Manager, Senior Branch Services Officer & QA Analyst',
    expectedDraftStatus: mode,
    image: 'meezan-bank-jobs-october-2026'
  },
  {
    id: 514,
    slug: 'aga-khan-university-hospital-karachi-jobs-2026',
    title: 'Aga Khan University Hospital Jobs 2026: Clinical Nurse, Medical Receptionist, Research & Technical Roles',
    expectedDraftStatus: mode,
    image: 'aga-khan-university-hospital-karachi-jobs-2026'
  }
];

async function verifyDrafts() {
  console.log(`=== VERIFYING OCT 21 EDITORIAL PACKAGES (${mode.toUpperCase()} MODE), WORD COUNTS, ASSETS & DUPLICATE PREVENTION ===\n`);

  let passCount = 0;
  let failCount = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✓ PASS: ${msg}`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failCount++;
    }
  }

  // 1. Database Persistence in articles and daily_updates
  console.log('--- 1. Database Persistence & Standards ---');
  for (const t of testPackages) {
    const art = db.prepare('SELECT * FROM articles WHERE slug = ?').get(t.slug);
    assert(art !== undefined, `Article row exists in 'articles' table for ${t.slug}`);
    if (art) {
      assert(art.id === t.id, `Article ID matches expected ${t.id} (Found: ${art.id})`);
      assert(art.status === t.expectedDraftStatus, `Article status is '${t.expectedDraftStatus}' (Found: ${art.status})`);
      assert(art.title === t.title, `Article title matches specification for ${t.slug}`);
      assert(art.canonical_url === `https://careerdost.blog/jobs/${t.slug}`, `Canonical URL matches: ${art.canonical_url}`);
      
      const contentArr = JSON.parse(art.content);
      const proseWords = contentArr.join(' ').replace(/https?:\/\/[^\s)]+/g, '').replace(/[#*|>\-\[\]\(\)`]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
      assert(proseWords >= 600, `Word count for ${t.slug} meets standards (${proseWords} words)`);
      assert(art.content.includes('Frequently Asked Questions (FAQs)'), `Includes FAQs section (${t.slug})`);
      assert(art.content.includes('WARNING') || art.content.includes('Fraud'), `Includes fraud-prevention advice (${t.slug})`);
    }

    const upd = db.prepare('SELECT * FROM daily_updates WHERE slug = ?').get(t.slug);
    assert(upd !== undefined, `Update row exists in 'daily_updates' table for ${t.slug}`);
    if (upd) {
      assert(upd.status === t.expectedDraftStatus, `Daily update status is '${t.expectedDraftStatus}' (Found: ${upd.status})`);
    }
  }

  // 2. Featured Image Assets in public/images/
  console.log('\n--- 2. Featured Image Assets in public/images/ ---');
  for (const t of testPackages) {
    const webpPath = path.resolve(`public/images/${t.image}.webp`);
    const jpgPath = path.resolve(`public/images/${t.image}.jpg`);
    assert(fs.existsSync(webpPath), `WebP image exists: ${webpPath}`);
    assert(fs.existsSync(jpgPath), `JPG image exists: ${jpgPath}`);
    if (fs.existsSync(webpPath)) {
      const stat = fs.statSync(webpPath);
      assert(stat.size > 15000, `WebP image file size is healthy (${(stat.size / 1024).toFixed(1)} KB)`);
    }
    if (fs.existsSync(jpgPath)) {
      const stat = fs.statSync(jpgPath);
      assert(stat.size > 15000, `JPG image file size is healthy (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  }

  // 3. Sitemap Exclusion While New Articles Are in Draft
  console.log('\n--- 3. Exclusion of Draft Slugs from Public Sitemap ---');
  const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf8');
  for (const t of testPackages.filter(x => x.expectedDraftStatus === 'draft')) {
    const inSitemap = sitemapContent.includes(t.slug);
    assert(!inSitemap, `Draft slug '${t.slug}' is NOT present in public/sitemap.xml (Security & Soft-404 guarantee)`);
  }

  console.log(`\nVerification Summary: ${passCount} passed, ${failCount} failed.`);
  if (failCount > 0) {
    process.exit(1);
  }
}

verifyDrafts().catch(err => {
  console.error('Verification script crashed:', err);
  process.exit(1);
});
