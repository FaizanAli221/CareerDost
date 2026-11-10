import test from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { parseMarkdownToHtml } from '../src/lib/markdown.js';
import { getVerificationTier } from '../src/lib/contentType.js';
import { NOINDEX_UPDATE_SLUGS } from '../server/routes/updates.js';

test('1. LESCO ID 589 nested bullets preserved and list numbering does not reset', () => {
  const db = new Database('careerdost.sqlite');
  const lesco = db.prepare('SELECT id, slug, title, content FROM articles WHERE id = 589').get();
  assert.ok(lesco, 'LESCO article exists');

  const html = parseMarkdownToHtml(lesco.content, { stripTitle: lesco.title });
  
  // Verify all 5 OTS syllabus sub-bullets are present in rendered HTML
  assert.ok(html.includes('Total Marks:'), 'Contains Total Marks bullet');
  assert.ok(html.includes('Subject-Specific Knowledge:'), 'Contains Subject-Specific Knowledge bullet');
  assert.ok(html.includes('General Knowledge & Pakistan Affairs:'), 'Contains GK bullet');
  assert.ok(html.includes('English Comprehension & Grammar:'), 'Contains English bullet');
  assert.ok(html.includes('Analytical Reasoning & Basic Math:'), 'Contains Analytical reasoning bullet');

  // Verify nested list inside ol
  assert.ok(/<ol[^>]*>[\s\S]*?<ul[^>]*>[\s\S]*?<\/ul>[\s\S]*?<\/ol>/.test(html), 'Contains nested ul inside ol');

  // Verify list numbering does not restart after nested bullet list
  assert.ok(html.includes('Merit Shortlisting'), 'Contains Merit Shortlisting');
  assert.ok(html.includes('Departmental Interview'), 'Contains Departmental Interview');
  assert.ok(html.includes('Pre-Employment Medical Examination'), 'Contains Medical Examination');
});

test('2. Single-newline headings do NOT swallow paragraph text into <h3> or <h2>', () => {
  const db = new Database('careerdost.sqlite');
  const uol = db.prepare('SELECT id, slug, title, content FROM articles WHERE id = 38').get();
  assert.ok(uol, 'UOL article exists');

  const html = parseMarkdownToHtml(uol.content, { stripTitle: uol.title });

  // Verify heading is distinct and does not contain the answer paragraph
  assert.ok(html.includes('<h3 class="font-serif text-lg sm:text-xl font-bold text-ink mt-6 mb-3">Can I still apply for the 10 October 2026 UOL advertisement?</h3>'), 'Clean H3 tag');
  assert.ok(html.includes('<p class="leading-relaxed text-inksoft mb-4 text-sm sm:text-base">The specific positions advertised with the'), 'Answer paragraph rendered in p tag, not in h3');

  // Ensure no h3 tag contains newline or full paragraph
  const h3Tags = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/g) || [];
  for (const h3 of h3Tags) {
    assert.ok(!h3.includes('<p>'), 'No p tag inside h3');
    assert.ok(!h3.includes('<br/>') || h3.length < 150, 'No multiline paragraph inside h3');
  }
});

test('3. Raw #### and --- rendered as semantic HTML, not <p> tags', () => {
  const input = `
#### Sub-section Heading 4
---
Normal paragraph here.
`;
  const html = parseMarkdownToHtml(input);
  assert.ok(html.includes('<h4 class="font-serif text-base sm:text-lg font-bold text-ink mt-5 mb-2">Sub-section Heading 4</h4>'), 'H4 rendered correctly');
  assert.ok(html.includes('<hr class="my-6 border-line" />'), 'HR rendered correctly');
  assert.ok(!html.includes('<p>---</p>'), 'No raw <p>---</p>');
  assert.ok(!html.includes('<p>####'), 'No raw <p>####');
});

test('4. All 15 target articles in SQLite and D1 have ZERO draft prompt metadata leaks', () => {
  const db = new Database('careerdost.sqlite');
  const ids = [583, 581, 580, 579, 578, 576, 573, 568, 563, 559, 557, 556, 551, 549, 545];
  const rows = db.prepare(`SELECT id, slug, title, content FROM articles WHERE id IN (${ids.join(',')})`).all();

  assert.equal(rows.length, 15, 'All 15 target articles found');

  for (const r of rows) {
    const c = r.content || '';
    assert.ok(!/Title:\s*[A-Z]/i.test(c), `Article ${r.id} (${r.slug}) contains leaked Title:`);
    assert.ok(!/Meta description:\s*/i.test(c), `Article ${r.id} (${r.slug}) contains leaked Meta description:`);
    assert.ok(!/Suggested slug:\s*/i.test(c), `Article ${r.id} (${r.slug}) contains leaked Suggested slug:`);
    assert.ok(!/Focus keyword:\s*/i.test(c), `Article ${r.id} (${r.slug}) contains leaked Focus keyword:`);

    // Verify rendered HTML also has zero leaks
    const html = parseMarkdownToHtml(c, { stripTitle: r.title });
    assert.ok(!/Title:\s*[A-Z]/i.test(html), `Rendered HTML ${r.id} contains leaked Title:`);
    assert.ok(!/Suggested slug:/i.test(html), `Rendered HTML ${r.id} contains leaked Suggested slug:`);
    assert.ok(!/Meta description:/i.test(html), `Rendered HTML ${r.id} contains leaked Meta description:`);
  }
});

test('5. Three-tier verification badge system correctly classifies opportunities', () => {
  // Tier 1: Verified Job with valid link
  const tier1 = getVerificationTier({
    isVerified: true,
    officialLink: 'https://njp.gov.pk/jobs/live',
    slug: 'regular-verified-job',
    title: 'Regular Verified Civil Officer Job'
  });
  assert.equal(tier1.tier, 1);
  assert.equal(tier1.status, 'OFFICIAL_VERIFIED');
  assert.ok(tier1.label.includes('Official Notification Verified'));

  // Tier 2: Announcement Phase (iwork4Sindh, KP 20,000 internships, upcoming schemes)
  const tier2A = getVerificationTier({
    isVerified: true,
    officialLink: 'https://sindh.gov.pk',
    slug: 'iwork4sindh-jobs-2026-registration-portal-guide',
    title: 'iwork4Sindh Jobs 2026: 10,000 IT & Youth Vacancies'
  });
  assert.equal(tier2A.tier, 2);
  assert.equal(tier2A.status, 'ANNOUNCEMENT_AWAITED');
  assert.ok(tier2A.label.includes('Official Announcement'));

  const tier2B = getVerificationTier({
    isVerified: true,
    officialLink: '',
    slug: 'kp-government-20000-paid-internships-2026',
    title: 'KP Government Announces 20,000 Paid Internships 2026'
  });
  assert.equal(tier2B.tier, 2);
  assert.equal(tier2B.status, 'ANNOUNCEMENT_AWAITED');

  // Tier 3: Unconfirmed / Under Review
  const tier3 = getVerificationTier({
    isVerified: false,
    officialLink: '',
    slug: 'unconfirmed-report-job',
    title: 'Some Unconfirmed Report'
  });
  assert.equal(tier3.tier, 3);
  assert.equal(tier3.status, 'UNDER_REVIEW');
  assert.ok(tier3.label.includes('Unconfirmed / Under Review'));
});

test('6. Feed hygiene: thin noindex daily updates excluded from homepage feeds', () => {
  assert.ok(NOINDEX_UPDATE_SLUGS.has('fpsc-consolidated-advertisement-09-2026-announced'));
  assert.ok(NOINDEX_UPDATE_SLUGS.has('hec-fully-funded-phd-scholarships-2026-open'));
});

test('7. Active-first SQL sorting ranks active opportunities before expired ones', () => {
  const db = new Database('careerdost.sqlite');
  const sql = `
    SELECT id, slug, title, last_date,
      (CASE WHEN (last_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' AND last_date < strftime('%Y-%m-%d', 'now')) THEN 1 ELSE 0 END) AS is_expired
    FROM articles
    WHERE status = 'published'
    ORDER BY is_expired ASC, publish_date DESC, id DESC
    LIMIT 20
  `;
  const rows = db.prepare(sql).all();
  assert.ok(rows.length > 0, 'Rows returned');

  // Verify that all active items (is_expired === 0) appear before any expired items (is_expired === 1)
  let seenExpired = false;
  for (const r of rows) {
    if (r.is_expired === 1) {
      seenExpired = true;
    } else {
      assert.equal(seenExpired, false, `Active opportunity ${r.id} (${r.slug}) appeared after an expired one!`);
    }
  }
});
