const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const slugs = [
  'comsats-university-jobs-faculty-staff-2026',
  'gwadar-shipyard-assistant-jobs-2026',
  'punjab-university-jobs-faculty-staff-2026',
  'pidcl-site-engineer-jobs-2026',
  'uoh-haripur-admissions-2026-deadline-today',
  'pec-graduate-engineer-training-get-program-2026',
  'petrol-price-reduced-pakistan-september-2026',
  'uhs-mdcat-2026-result-recount-review-portal',
  'hec-usat-hat-registration-2026-etc-hec',
  'sbbu-fully-funded-scholarship-2026',
  'sbbu-naushahro-feroze-entry-test-2027',
  'lums-electronic-technician-jobs-2026',
  'isra-university-ms-mphil-phd-spring-2027',
  'isra-university-mbbs-bds-scholarship-registration-2026',
  'fjwu-paid-lab-engineer-internship-2026',
  'gimhs-hyderabad-bsn-dpt-admissions-2026-phase-2',
  'sindh-kisan-subsidy-2026-eligibility-payments',
  'niahs-hyderabad-bsn-nursing-admissions-2026-27'
];

slugs.forEach(s => {
  const r = db.prepare('SELECT id, slug, title, category_slug, organization, location, qualification, salary, last_date, official_link, apply_link, content FROM articles WHERE slug = ?').get(s);
  if (!r) {
    console.log(`[NOT FOUND] ${s}`);
    return;
  }
  let c = r.content;
  try {
    const p = JSON.parse(c);
    c = Array.isArray(p) ? p.join('\n\n') : c;
  } catch {}
  console.log(`\n========================================`);
  console.log(`SLUG: ${r.slug} (ID: ${r.id})`);
  console.log(`TITLE: ${r.title}`);
  console.log(`CAT: ${r.category_slug} | ORG: ${r.organization} | LOC: ${r.location} | LAST: ${r.last_date}`);
  console.log(`LINKS: Official=${r.official_link} | Apply=${r.apply_link}`);
  console.log(`CONTENT SAMPLE (350 chars):\n${c.slice(0, 350)}...`);
});
