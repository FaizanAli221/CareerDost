/**
 * CareerDost — AdSense Quality Improvement & Original Content QA Suite
 * Run: node tests/adsense_quality_phase.test.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';

import { categories } from '../src/data/categories.js';
import { listings } from '../src/data/listings.js';
import { KNOWN_ARTICLE_SLUGS } from '../src/data/articleSlugs.js';
import { getContentType, getContentTypeLabels, getSectorTransparencyNote } from '../src/lib/contentType.js';
import { isGenuineJobVacancy } from '../src/lib/jobSchema.js';
import { parseMarkdownToHtml } from '../src/lib/markdown.js';

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

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

console.log('\n=== CareerDost AdSense Quality & Original Content QA Suite ===\n');

// 1. Category Registration (Frontend + Edge Middleware + SQLite)
check('Category "guides-and-resources" exists in src/data/categories.js', () => {
  const cat = categories.find((c) => c.slug === 'guides-and-resources');
  assert.ok(cat, 'Missing guides-and-resources category in src/data/categories.js');
  assert.equal(cat.label, 'CareerDost Guides & Resources');
});

check('Edge middleware registers guides-and-resources and /tools/job-readiness-checker', () => {
  const mw = read('functions/_middleware.js');
  assert.ok(mw.includes("'guides-and-resources'"), 'Missing guides-and-resources in VALID_CATEGORIES / CATEGORY_META');
  assert.ok(mw.includes("'/tools/job-readiness-checker'"), 'Missing /tools/job-readiness-checker in KNOWN_STATIC_ROUTES');
  assert.ok(mw.includes("'@type': 'WebApplication'"), 'Missing WebApplication schema for /tools/job-readiness-checker SSR');
});

check('Local SQLite contains guides-and-resources category and both published guide articles', () => {
  const db = new Database(path.join(ROOT, 'careerdost.sqlite'), { readonly: true });
  const cat = db.prepare("SELECT * FROM categories WHERE slug = 'guides-and-resources'").get();
  assert.ok(cat, 'Missing guides-and-resources in SQLite categories');
  assert.equal(cat.label, 'CareerDost Guides & Resources');

  const art1 = db.prepare("SELECT * FROM articles WHERE slug = 'njp-application-rejection-12-common-mistakes-avoid'").get();
  const art2 = db.prepare("SELECT * FROM articles WHERE slug = 'government-jobs-documents-checklist-pakistan-2026'").get();
  assert.ok(art1 && art1.status === 'published', 'Article 1 missing or not published in SQLite');
  assert.ok(art2 && art2.status === 'published', 'Article 2 missing or not published in SQLite');
  assert.equal(art1.category_slug, 'guides-and-resources');
  assert.equal(art2.category_slug, 'guides-and-resources');
  db.close();
});

// 2. Article 1 & Article 2 Content, SEO Metadata, Links & Tables
const SLUG_1 = 'njp-application-rejection-12-common-mistakes-avoid';
const SLUG_2 = 'government-jobs-documents-checklist-pakistan-2026';

check('Both guide slugs exist in KNOWN_ARTICLE_SLUGS and listings dataset', () => {
  assert.ok(KNOWN_ARTICLE_SLUGS.has(SLUG_1), `${SLUG_1} missing from KNOWN_ARTICLE_SLUGS`);
  assert.ok(KNOWN_ARTICLE_SLUGS.has(SLUG_2), `${SLUG_2} missing from KNOWN_ARTICLE_SLUGS`);
  const l1 = listings.find((l) => l.slug === SLUG_1);
  const l2 = listings.find((l) => l.slug === SLUG_2);
  assert.ok(l1, `${SLUG_1} missing from listings.js`);
  assert.ok(l2, `${SLUG_2} missing from listings.js`);
});

check('Article 1 (NJP 12 Common Mistakes) meets SEO, word count, official link, and internal link requirements', () => {
  const art1 = listings.find((l) => l.slug === SLUG_1);
  assert.ok(art1.seoTitle.length > 20 && art1.seoTitle.length <= 60, `Article 1 seoTitle length invalid: ${art1.seoTitle.length}`);
  assert.ok(art1.metaDescription.length >= 110 && art1.metaDescription.length <= 158, `Article 1 metaDescription length invalid: ${art1.metaDescription.length}`);
  assert.equal(art1.officialLink, 'https://www.njp.gov.pk');
  const bodyText = Array.isArray(art1.content) ? art1.content.join('\n\n') : art1.content;
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  assert.ok(wordCount >= 1500, `Article 1 expected in-depth content (>=1500 words), got ${wordCount}`);
  assert.ok(bodyText.includes('https://www.njp.gov.pk'), 'Article 1 must cite official NJP portal');
  assert.ok(bodyText.includes('/jobs/government-jobs-documents-checklist-pakistan-2026'), 'Article 1 must cross-link to Documents Checklist guide');
  assert.ok(bodyText.includes('/tools/job-readiness-checker'), 'Article 1 must link to Job Readiness Checker tool');
  assert.ok(bodyText.includes('/jobs/national-job-portal-njp-pakistan-application-guide'), 'Article 1 must cross-link to existing NJP setup guide');
});

check('Article 2 (Documents Checklist 2026) meets SEO, 4-column table, official portals, and priority rule requirements', () => {
  const art2 = listings.find((l) => l.slug === SLUG_2);
  assert.ok(art2.seoTitle.length > 20 && art2.seoTitle.length <= 60, `Article 2 seoTitle length invalid: ${art2.seoTitle.length}`);
  assert.ok(art2.metaDescription.length >= 110 && art2.metaDescription.length <= 158, `Article 2 metaDescription length invalid: ${art2.metaDescription.length}`);
  const bodyText = Array.isArray(art2.content) ? art2.content.join('\n\n') : art2.content;
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  assert.ok(wordCount >= 1400, `Article 2 expected in-depth content (>=1400 words), got ${wordCount}`);
  assert.ok(
    bodyText.includes('| Document | Why it is needed | When it is required | Important notes |'),
    'Article 2 must include exact 4-column Markdown table header'
  );
  assert.ok(bodyText.includes('https://www.njp.gov.pk'), 'Article 2 must reference official NJP portal');
  assert.ok(bodyText.includes('https://eservices.hec.gov.pk'), 'Article 2 must reference official HEC portal');
  assert.ok(bodyText.includes('https://attest.ibcc.edu.pk'), 'Article 2 must reference official IBCC portal');
  assert.ok(bodyText.includes('https://id.nadra.gov.pk'), 'Article 2 must reference official NADRA portal');
  assert.ok(bodyText.toLowerCase().includes('advertisement') && bodyText.toLowerCase().includes('priority'), 'Article 2 must emphasize official advertisement takes priority');
});

// 3. Structured Data Guardrails (Article + BreadcrumbList, NEVER JobPosting)
check('Structured data classifier treats both guides as "guide" (never JobPosting)', () => {
  const art1 = listings.find((l) => l.slug === SLUG_1);
  const art2 = listings.find((l) => l.slug === SLUG_2);
  assert.equal(getContentType(art1), 'guide');
  assert.equal(getContentType(art2), 'guide');
  assert.equal(isGenuineJobVacancy(art1, 'guide'), false);
  assert.equal(isGenuineJobVacancy(art2, 'guide'), false);
  const labels = getContentTypeLabels('guide', art1);
  assert.ok(labels.badge.toLowerCase().includes('guide'), `Expected guide badge, got ${labels.badge}`);
  const note = getSectorTransparencyNote(art1);
  assert.ok(note.includes('original CareerDost guide'), 'Transparency note for guides-and-resources should describe editorial guide');
  const mw = read('functions/_middleware.js');
  assert.ok(mw.includes("'guides-and-resources'"), 'Edge middleware must treat guides-and-resources as non-JobPosting');
});

// 4. Phase 3 — Interactive Tool & Privacy Guardrails
check('JobReadinessChecker implements all 7 checks, mandatory disclaimer, and zero PII inputs', () => {
  const src = read('src/components/JobReadinessChecker.jsx');
  assert.ok(src.includes('CNIC available'), 'Missing Check 1 (CNIC)');
  assert.ok(src.includes('Domicile available'), 'Missing Check 2 (Domicile)');
  assert.ok(src.includes('Required educational documents available'), 'Missing Check 3 (Education)');
  assert.ok(src.includes('Experience certificate available, if required'), 'Missing Check 4 (Experience)');
  assert.ok(src.includes('Age eligibility checked'), 'Missing Check 5 (Age)');
  assert.ok(src.includes('Relevant professional registration checked, if required'), 'Missing Check 6 (Professional registration)');
  assert.ok(src.includes('Advertisement requirements reviewed'), 'Missing Check 7 (Advertisement)');
  assert.ok(
    src.includes('This checklist helps you prepare your application. It does not guarantee eligibility or acceptance.'),
    'Exact mandatory disclaimer text missing in JobReadinessChecker.jsx'
  );
  // Ensure no text/number/file inputs collecting CNIC or personal data
  assert.ok(!src.includes('type="text"') && !src.includes('type="file"') && !src.includes('type="tel"'), 'Tool must not collect personal text/file/tel inputs');
});

check('PrintableDocsChecklist and @media print CSS exist cleanly', () => {
  const comp = read('src/components/PrintableDocsChecklist.jsx');
  const css = read('src/index.css');
  assert.ok(comp.includes('window.print()'), 'PrintableDocsChecklist must trigger window.print()');
  assert.ok(css.includes('@media print'), 'src/index.css must include @media print stylesheet');
  assert.ok(css.includes('.no-print'), 'src/index.css must hide .no-print elements during printing');
});

// 5. Phase 5 — Nano Banana Editorial Images (WebP + JPG fallback)
check('Editorial WebP and JPG fallback images exist and are optimized (< 150 KB each)', () => {
  const files = [
    'public/images/njp-application-rejection-12-common-mistakes-avoid.webp',
    'public/images/njp-application-rejection-12-common-mistakes-avoid.jpg',
    'public/images/government-jobs-documents-checklist-pakistan-2026.webp',
    'public/images/government-jobs-documents-checklist-pakistan-2026.jpg',
  ];
  for (const rel of files) {
    const full = path.join(ROOT, rel);
    assert.ok(fs.existsSync(full), `Missing image file: ${rel}`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 10_000 && stat.size < 160_000, `Unexpected size for ${rel}: ${stat.size} bytes`);
  }
});

// 6. Markdown Internal vs External Links
check('parseMarkdownToHtml renders internal links in same tab and external links with target="_blank" rel="noopener noreferrer"', () => {
  const html = parseMarkdownToHtml('Read our [Documents Guide](/jobs/government-jobs-documents-checklist-pakistan-2026) and visit [Official NJP](https://www.njp.gov.pk).');
  assert.ok(
    html.includes('<a href="/jobs/government-jobs-documents-checklist-pakistan-2026" class="text-green hover:underline font-semibold">Documents Guide</a>'),
    'Internal link should not open in new tab'
  );
  assert.ok(
    html.includes('<a href="https://www.njp.gov.pk" target="_blank" rel="noopener noreferrer" class="text-green hover:underline font-semibold">Official NJP</a>'),
    'External link must include target="_blank" rel="noopener noreferrer"'
  );
});

// 7. Sitemap, Robots.txt & AdSense Preservation
check('public/sitemap.xml and public/robots.txt and index.html preserve SEO & AdSense integrity', () => {
  const sm = read('public/sitemap.xml');
  assert.ok(sm.includes('https://careerdost.blog/category/guides-and-resources'), 'Sitemap missing /category/guides-and-resources');
  assert.ok(sm.includes('https://careerdost.blog/tools/job-readiness-checker'), 'Sitemap missing /tools/job-readiness-checker');
  assert.ok(sm.includes(`https://careerdost.blog/jobs/${SLUG_1}`), `Sitemap missing ${SLUG_1}`);
  assert.ok(sm.includes(`https://careerdost.blog/jobs/${SLUG_2}`), `Sitemap missing ${SLUG_2}`);

  const robots = read('public/robots.txt');
  assert.ok(robots.includes('Mediapartners-Google'), 'robots.txt must allow Mediapartners-Google');
  assert.ok(robots.includes('Disallow: /admin'), 'robots.txt must disallow /admin');

  const indexHtml = read('index.html');
  assert.ok(indexHtml.includes('ca-pub-3823137402984505'), 'index.html must preserve AdSense publisher ID');
});

// 8. Admin CMS Integration
check('AdminPage supports new category, internal link insertion, SEO fields, and anti-fake-seal image prompt', () => {
  const admin = read('src/pages/AdminPage.jsx');
  assert.ok(admin.includes("'CareerDost Guides & Resources'"), 'AdminPage UPDATE_CATEGORIES missing CareerDost Guides & Resources');
  assert.ok(admin.includes('🏠 Internal Link'), 'AdminPage toolbar missing Internal Link helper');
  assert.ok(admin.includes('Strictly NO fake government logos'), 'AdminPage Nano Banana prompt missing anti-fake-seal rule');
});

console.log(`\nPassed ${passed} / 13 QA checks.\n`);
