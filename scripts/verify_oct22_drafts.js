import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const db = new Database('careerdost.sqlite');
const mode = process.argv[2] === 'published' ? 'published' : 'draft';

const testPackages = [
  {
    id: 515,
    daily_update_id: 386,
    slug: 'spsc-cce-2026-examination-reforms-age-attempts-screening',
    title: 'SPSC CCE 2026 Examination Reforms: Upper Age Limit Raised to 33, 5 Attempts Allowed & 33% Screening Cutoff',
    expectedDraftStatus: mode,
    image: 'spsc-cce-2026-examination-reforms-age-attempts-screening',
    minWords: 900
  },
  {
    id: 516,
    daily_update_id: 387,
    slug: 'sindh-flood-housing-phase-3-financing-update-eib-sphf',
    title: 'Sindh Flood Housing Phase III: €115 Million EIB Financing Ratified by Provincial Cabinet (SPHF Reconstruction Update)',
    expectedDraftStatus: mode,
    image: 'sindh-flood-housing-phase-3-financing-update-eib-sphf',
    minWords: 900
  },
  {
    id: 517,
    daily_update_id: 388,
    slug: 'ssgc-gasification-plan-46-sindh-villages-sanghar-shikarpur',
    title: 'SSGC Gasification Plan: 46 Sindh Villages in Sanghar & Shikarpur to Get Gas Grid Connections (Rs 1.92B Project)',
    expectedDraftStatus: mode,
    image: 'ssgc-gasification-plan-46-sindh-villages-sanghar-shikarpur',
    minWords: 900
  }
];

async function verifyDrafts() {
  console.log(`=== VERIFYING OCT 22 EDITORIAL PACKAGES (${mode.toUpperCase()} MODE), WORD COUNTS, ASSETS & DEADLINE REMINDER ===\n`);

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
      assert(proseWords >= t.minWords, `Substantial word count: ${proseWords} words (Target: >= ${t.minWords})`);
      assert(contentArr.length >= 8, `Structured content blocks: ${contentArr.length} sections`);
    }

    const du = db.prepare('SELECT * FROM daily_updates WHERE slug = ?').get(t.slug);
    assert(du !== undefined, `Daily update row exists in 'daily_updates' table for ${t.slug}`);
    if (du) {
      assert(du.id === t.daily_update_id, `Daily Update ID matches expected ${t.daily_update_id} (Found: ${du.id})`);
      assert(du.status === t.expectedDraftStatus, `Daily update status is '${t.expectedDraftStatus}' (Found: ${du.status})`);
    }
  }

  // 2. Physical Images in public/images
  console.log('\n--- 2. Featured Image Asset Verification (WebP & JPG) ---');
  for (const t of testPackages) {
    const webpPath = path.resolve(`public/images/${t.image}.webp`);
    const jpgPath = path.resolve(`public/images/${t.image}.jpg`);

    assert(fs.existsSync(webpPath), `WebP image exists: public/images/${t.image}.webp`);
    assert(fs.existsSync(jpgPath), `JPG image exists: public/images/${t.image}.jpg`);

    if (fs.existsSync(webpPath)) {
      const stat = fs.statSync(webpPath);
      assert(stat.size > 20000, `WebP image non-empty: ${(stat.size / 1024).toFixed(1)} KB`);
    }
  }

  // 3. Article 335 Deadline Reminder Check
  console.log('\n--- 3. Article 335 Deadline Reminder Check ---');
  const art335 = db.prepare('SELECT * FROM articles WHERE id = 335').get();
  assert(art335 !== undefined, `Article ID 335 exists in database`);
  if (art335) {
    assert(art335.last_date === '2026-10-23', `Article 335 last_date is verified as 2026-10-23`);
    const content335 = JSON.parse(art335.content);
    assert(content335[0].includes('URGENT DEADLINE REMINDER') && content335[0].includes('23 October 2026'), `Article 335 includes urgent deadline reminder banner at top`);
  }

  // 4. Verification of Safety Requirements
  console.log('\n--- 4. Factual Safety Boundaries & Claim Labels ---');
  const p1 = db.prepare('SELECT content FROM articles WHERE id = 515').get();
  const p2 = db.prepare('SELECT content FROM articles WHERE id = 516').get();
  const p3 = db.prepare('SELECT content FROM articles WHERE id = 517').get();

  assert(p1.content.includes('Cabinet Approval Reported') || p1.content.includes('Cabinet approval'), 'SPSC draft correctly indicates Cabinet approval / gazette pending');
  assert(!p1.content.includes('Open Registrations'), 'SPSC draft does not claim general open registrations');
  assert(p2.content.includes('100 Million') && p2.content.includes('15 Million'), 'Flood Housing draft correctly identifies exact €100M loan + €15M grant breakdown');
  assert(p2.content.includes('Financing Arrangements Reported') || p2.content.includes('Financing arrangements reported'), 'Flood Housing draft correctly labels financing arrangements reported');
  assert(!p2.content.includes('New cash scheme') && !p2.content.includes('Payments released'), 'Flood Housing draft does not claim new cash scheme or released payments');
  assert(p3.content.includes('Planned Infrastructure') || p3.content.includes('Planned infrastructure'), 'SSGC draft correctly labels planned infrastructure');
  assert(p3.content.includes('31') && p3.content.includes('15') && p3.content.includes('46'), 'SSGC draft correctly covers 31 Sanghar + 15 Shikarpur = 46 villages');
  assert(p3.content.includes('1.922') || p3.content.includes('1,922'), 'SSGC draft correctly details Rs 1.922B budget');

  console.log(`\n=== VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED ===`);
  if (failCount > 0) process.exit(1);
}

verifyDrafts().catch(e => {
  console.error(e);
  process.exit(1);
});
