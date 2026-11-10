/**
 * CareerDost Phase 2 — Existing Content Quality Improvement QA Suite
 * Run: node tests/phase2_content_quality.test.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import Database from 'better-sqlite3';

import { listings } from '../src/data/listings.js';
import { KNOWN_ARTICLE_SLUGS } from '../src/data/articleSlugs.js';
import {
  CONSOLIDATED_SLUG_REDIRECTS,
  CONSOLIDATED_SLUGS_SET,
  filterPublicArticles,
} from '../src/data/consolidatedRedirects.js';
import { parseMarkdownToHtml } from '../src/lib/markdown.js';

const ROOT = process.cwd();
const db = new Database(path.join(ROOT, 'careerdost.sqlite'), { readonly: true });

const IMPROVED_19 = [
  'isra-university-ms-mphil-phd-spring-2027',
  'isra-university-mbbs-bds-scholarship-registration-2026',
  'pidcl-site-engineer-jobs-2026',
  'navttc-assistant-bps15-jobs-2026',
  'navttc-assistant-private-secretary-jobs-2026',
  'navttc-director-bps18-jobs-2026',
  'karachi-shipyard-technical-assistant-jobs-2026',
  'sbbu-fully-funded-scholarship-2026',
  'sbbu-admissions-2026-deadline-extended',
  'sbbu-naushahro-feroze-entry-test-2027',
  'hec-peridot-research-program-phase-13-2026',
  'fjwu-paid-lab-engineer-internship-2026',
  'uoh-haripur-admissions-2026-deadline-today',
  'bank-of-punjab-relationship-officer-transaction-banking-2026',
  'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026',
  'lums-electronic-technician-jobs-2026',
  'university-of-lahore-uol-jobs-2026',
  'times-university-multan-tum-jobs-2026',
  'imarat-finance-intern-jobs-2026',
];

const ACTIVE_2 = new Set([
  'isra-university-ms-mphil-phd-spring-2027',
  'isra-university-mbbs-bds-scholarship-registration-2026',
]);

const CONSOLIDATED_5_FROM_AUDIT = [
  'httpswwwnjpgovpk',
  'benazir-income-support-programme-2026',
  'lums-lahore-jobs-advancement-it-staff-2026',
  'systems-limited-hiring-software-engineers',
  'hbl-management-trainee-officer-2026',
];

const SIX_NANO_BANANA_IMAGES = [
  { slug: 'pidcl-site-engineer-jobs-2026', base: 'pidcl-site-engineer-jobs-2026' },
  { slug: 'sbbu-fully-funded-scholarship-2026', base: 'sbbu-scholarship-2026' },
  { slug: 'sbbu-admissions-2026-deadline-extended', base: 'sbbu-admissions-2026' },
  { slug: 'sbbu-naushahro-feroze-entry-test-2027', base: 'sbbu-naushahro-feroze-entry-test-2027' },
  { slug: 'times-university-multan-tum-jobs-2026', base: 'tum-multan-university-jobs-2026' },
  { slug: 'university-of-lahore-uol-jobs-2026', base: 'uol-lahore-university-jobs-2026' },
];

const PRESERVED_13_IMAGES = [
  'public/images/isra-university-ms-mphil-phd-spring-2027.jpg',
  'public/images/isra-university-mbbs-bds-scholarship-registration-2026.jpg',
  'public/images/navttc-assistant-bps15-2026.webp',
  'public/images/navttc-assistant-private-secretary-2026.webp',
  'public/images/navttc-director-bps18-2026.webp',
  'public/images/karachi-shipyard-technical-assistant-2026.webp',
  'public/images/hec-peridot-research-2026.webp',
  'public/images/fjwu-paid-lab-engineer-internship-2026.jpg',
  'public/images/uoh-haripur-admissions-2026.webp',
  'public/images/bop-relationship-officer-transaction-banking-2026.webp',
  'public/images/bop-relationship-manager-officer-cfc-2026.webp',
  'public/images/lums-electronic-technician-jobs-2026.jpg',
  'public/images/imarat-finance-intern-2026.webp',
];

const ORIGINAL_PUBLISH_DATES = {
  'isra-university-ms-mphil-phd-spring-2027': '2026-10-12',
  'isra-university-mbbs-bds-scholarship-registration-2026': '2026-10-12',
  'pidcl-site-engineer-jobs-2026': '2026-10-03',
  'navttc-assistant-bps15-jobs-2026': '2026-09-27',
  'navttc-assistant-private-secretary-jobs-2026': '2026-09-27',
  'navttc-director-bps18-jobs-2026': '2026-09-27',
  'karachi-shipyard-technical-assistant-jobs-2026': '2026-09-27',
  'sbbu-fully-funded-scholarship-2026': '2026-09-28',
  'sbbu-admissions-2026-deadline-extended': '2026-09-28',
  'sbbu-naushahro-feroze-entry-test-2027': '2026-10-11',
  'hec-peridot-research-program-phase-13-2026': '2026-09-29',
  'fjwu-paid-lab-engineer-internship-2026': '2026-10-12',
  'uoh-haripur-admissions-2026-deadline-today': '2026-09-29',
  'bank-of-punjab-relationship-officer-transaction-banking-2026': '2026-09-27',
  'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026': '2026-09-27',
  'lums-electronic-technician-jobs-2026': '2026-10-12',
  'university-of-lahore-uol-jobs-2026': '2026-09-27',
  'times-university-multan-tum-jobs-2026': '2026-09-27',
  'imarat-finance-intern-jobs-2026': '2026-09-27',
};

let passed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('\n=== CareerDost Phase 2: 24-Article Content Quality QA Suite ===\n');

// 1. Condition 1: Duplicate Slug Redirects & Zero Redirect Loops
check('httpswwwnjpgovpk redirects 301 to /jobs/pidcl-site-engineer-jobs-2026 and zero redirect loops exist', () => {
  assert.equal(CONSOLIDATED_SLUG_REDIRECTS.get('httpswwwnjpgovpk'), '/jobs/pidcl-site-engineer-jobs-2026');
  assert.ok(CONSOLIDATED_SLUG_REDIRECTS.size >= 14, `Expected at least 14 redirects, got ${CONSOLIDATED_SLUG_REDIRECTS.size}`);
  for (const [srcSlug, destPath] of CONSOLIDATED_SLUG_REDIRECTS.entries()) {
    assert.ok(destPath.startsWith('/jobs/'), `Expected /jobs/ target for ${srcSlug}, got ${destPath}`);
    const destSlug = destPath.slice('/jobs/'.length);
    assert.notEqual(srcSlug, destSlug, `Self-redirect loop on ${srcSlug}`);
    assert.ok(!CONSOLIDATED_SLUGS_SET.has(destSlug), `Redirect chain/loop detected: ${srcSlug} -> ${destSlug}`);
    const targetRow = db.prepare("SELECT status FROM articles WHERE slug = ?").get(destSlug);
    assert.ok(targetRow && targetRow.status === 'published', `Target slug ${destSlug} missing or unpublished`);
  }
});

check('Public feeds, listings.js, articleSlugs.js, and sitemap.xml exclude all consolidated duplicate slugs while preserving DB rows', () => {
  // All 24 rows must remain present in DB (zero deletion)
  for (const slug of [...IMPROVED_19, ...CONSOLIDATED_5_FROM_AUDIT]) {
    const row = db.prepare('SELECT id, slug, status FROM articles WHERE slug = ?').get(slug);
    assert.ok(row && row.status === 'published', `DB row missing or unpublished for ${slug}`);
  }
  const sitemapXml = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
  for (const dupSlug of CONSOLIDATED_SLUGS_SET) {
    assert.ok(!KNOWN_ARTICLE_SLUGS.has(dupSlug), `KNOWN_ARTICLE_SLUGS should exclude ${dupSlug}`);
    assert.ok(!listings.some((l) => l.slug === dupSlug), `listings.js should exclude ${dupSlug}`);
    assert.ok(!sitemapXml.includes(`/jobs/${dupSlug}<`), `sitemap.xml should exclude /jobs/${dupSlug}`);
  }
  const sampleFiltered = filterPublicArticles([
    { slug: 'httpswwwnjpgovpk' },
    { slug: 'pidcl-site-engineer-jobs-2026' },
    { slug: 'benazir-income-support-programme-2026' },
  ]);
  assert.deepEqual(sampleFiltered.map((x) => x.slug), ['pidcl-site-engineer-jobs-2026']);

  // BISP CMS test artifacts removed
  const bisp = db.prepare("SELECT content FROM articles WHERE slug = 'benazir-income-support-programme-2026'").get();
  assert.ok(!bisp.content.includes('Bold text') && !bisp.content.includes('Section Heading'), 'BISP test strings must be stripped');
});

// 2. Condition 2: SBBU Shaheed Benazirabad Factual Correction & Isolation
check('sbbu-fully-funded-scholarship-2026 strictly references SBBU Shaheed Benazirabad (Sindh) SFAO with zero Sheringal leaks', () => {
  const row = db.prepare("SELECT * FROM articles WHERE slug = 'sbbu-fully-funded-scholarship-2026'").get();
  assert.equal(row.official_link, 'https://sbbusba.edu.pk/sbbu-main/financial-aid-office.html');
  assert.ok(row.title.includes('Shaheed Benazirabad'), 'Title should specify Shaheed Benazirabad');
  assert.ok(row.meta_description.includes('Shaheed Benazirabad'), 'Meta description should specify Shaheed Benazirabad');
  const combined = [row.title, row.seo_title, row.meta_description, row.excerpt, row.location, row.organization, row.content].join('\n');
  assert.ok(!/sheringal|dir upper/i.test(combined), 'Must contain zero Sheringal/Dir Upper errors');
  assert.ok(combined.includes('Students Financial Aid Office') && combined.includes('Istehqaq'), 'Must cover SFAO & Zakat Istehqaq details');
});

// 3. Condition 3: 6 New Nano Banana Images + 13 Existing Clean Images Untouched
check('All 6 replacement Nano Banana (.webp + .jpg) images exist (>50 KB) and are wired into SQLite & listings.js', () => {
  for (const { slug, base } of SIX_NANO_BANANA_IMAGES) {
    const webpPath = path.join(ROOT, 'public/images', `${base}.webp`);
    const jpgPath = path.join(ROOT, 'public/images', `${base}.jpg`);
    assert.ok(fs.existsSync(webpPath), `Missing ${webpPath}`);
    assert.ok(fs.existsSync(jpgPath), `Missing ${jpgPath}`);
    assert.ok(fs.statSync(webpPath).size > 50_000, `${base}.webp unexpectedly small`);
    assert.ok(fs.statSync(jpgPath).size > 80_000, `${base}.jpg unexpectedly small`);

    const row = db.prepare('SELECT featured_image FROM articles WHERE slug = ?').get(slug);
    assert.equal(row.featured_image, `/images/${base}.webp`);
    const item = listings.find((l) => l.slug === slug);
    assert.equal(item.featuredImage, `/images/${base}.webp`);
  }
});

check('All 13 clean existing featured images remain completely untouched in git working tree', () => {
  const gitOut = execFileSync('git', ['status', '--porcelain', '--', ...PRESERVED_13_IMAGES], { encoding: 'utf8' }).trim();
  assert.equal(gitOut, '', `Expected 0 git changes on preserved 13 images, got:\n${gitOut}`);
});

// 4. Condition 4: All 19 Live Articles Quality, Proportional Word Count, Internal Links, Status & Dates
check('All 19 live articles meet proportional word count (410–750w), SEO bounds, H2/table/FAQ structure, and publish_date integrity', () => {
  const allPublishedSlugs = new Set(
    db.prepare("SELECT slug FROM articles WHERE status = 'published'").all().map((r) => r.slug)
  );

  for (const slug of IMPROVED_19) {
    const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
    assert.equal(row.publish_date, ORIGINAL_PUBLISH_DATES[slug], `${slug} publish_date must not be altered!`);
    assert.ok(row.seo_title.length >= 30 && row.seo_title.length <= 60, `${slug} seo_title length: ${row.seo_title.length}`);
    assert.ok(row.meta_description.length >= 110 && row.meta_description.length <= 160, `${slug} meta_description length: ${row.meta_description.length}`);
    assert.ok(row.official_link.startsWith('https://'), `${slug} invalid official_link: ${row.official_link}`);
    assert.ok(!/DEADLINE TOMORROW|ALERT:\s*Today/i.test(row.excerpt + ' ' + row.meta_description), `${slug} contains stale urgency alert`);

    const blocks = JSON.parse(row.content);
    assert.ok(Array.isArray(blocks) && blocks.length >= 10, `${slug} expected structured content blocks`);
    const md = blocks.join('\n\n');
    const words = md.split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 410 && words <= 750, `${slug} word count (${words}w) outside proportional 410–750w target`);

    const h2Count = blocks.filter((b) => b.startsWith('## ')).length;
    assert.ok(h2Count >= 4, `${slug} expected >=4 H2 headings, got ${h2Count}`);
    assert.ok(md.includes('## Frequently Asked Questions (FAQs)'), `${slug} missing FAQs heading`);
    assert.ok(md.includes('| :--- |'), `${slug} missing structured Markdown table`);

    // Verify rendered HTML cleanly parses tables & links
    const html = parseMarkdownToHtml(md);
    assert.ok(html.includes('<table') && html.includes('<h2'), `${slug} markdown failed HTML table/H2 rendering`);

    // Active vs Closed status check
    if (ACTIVE_2.has(slug)) {
      assert.ok(blocks[0].includes('[!IMPORTANT]'), `${slug} active guide should open with [!IMPORTANT]`);
    } else {
      assert.ok(blocks[0].includes('[!NOTE]'), `${slug} closed guide should open with [!NOTE]`);
      assert.ok(/closed|concluded/i.test(row.excerpt), `${slug} closed guide excerpt must state closed/concluded`);
    }

    // Internal links check: >= 2 internal links, zero broken or consolidated-redirect links
    const internalLinks = [...md.matchAll(/\]\((\/(?:jobs|category|tools)\/[^)\s]+)\)/g)].map((m) => m[1]);
    assert.ok(internalLinks.length >= 2, `${slug} expected >=2 contextual internal links, got ${internalLinks.length}`);
    for (const href of internalLinks) {
      if (href.startsWith('/jobs/')) {
        const linkedSlug = href.slice('/jobs/'.length);
        assert.ok(allPublishedSlugs.has(linkedSlug), `${slug} links to non-existent article ${href}`);
        assert.ok(!CONSOLIDATED_SLUGS_SET.has(linkedSlug), `${slug} links to consolidated redirect slug ${href}`);
      }
    }
  }
});

db.close();

if (!process.exitCode) {
  console.log(`\n✓ ALL ${passed}/${passed} PHASE 2 CONTENT QUALITY CHECKS PASSED!\n`);
}
