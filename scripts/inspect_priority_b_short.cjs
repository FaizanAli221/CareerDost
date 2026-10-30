const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const slugs = [
  'niahs-hyderabad-bsn-nursing-admissions-2026-27',
  'hyderabad-division-section-144-notification-2026',
  'sindh-kisan-subsidy-2026-eligibility-payments',
  'szabist-hyderabad-spring-2027-admissions',
  'gimhs-hyderabad-bsn-dpt-admissions-2026-phase-2',
  'isra-university-mbbs-bds-scholarship-registration-2026',
  'isra-university-ms-mphil-phd-spring-2027',
  'spsc-departmental-exam-slips-2026',
  'quest-special-exams-timetable-2026',
  'fuuast-examination-forms-2026',
  'pm-fuel-relief-scheme-2026-registration-eligibility',
  'petrol-price-reduced-pakistan-september-2026',
  'uet-lahore-jobs-2026-faculty-research',
  'uhs-mdcat-2026-result-recount-review-portal',
  'punjab-university-jobs-faculty-staff-2026',
  'nts-latest-results-answer-keys-2026'
];

slugs.forEach(s => {
  const r = db.prepare('SELECT id, slug, title, category_slug, last_date, content FROM articles WHERE slug = ?').get(s);
  if (!r) {
    console.log(`MISSING: ${s}`);
    return;
  }
  let c = r.content;
  try {
    const parsed = JSON.parse(c);
    c = Array.isArray(parsed) ? parsed.join('\n\n') : c;
  } catch {}
  console.log(`\n========================================`);
  console.log(`SLUG: ${r.slug} (ID: ${r.id}, Cat: ${r.category_slug})`);
  console.log(`TITLE: ${r.title}`);
  console.log(`FIRST 300 CHARS:\n${c.slice(0, 300)}...`);
});
