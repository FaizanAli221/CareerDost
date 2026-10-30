const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

// Slugs updated in Batches 1-6
const batchSlugs = new Set([
  // Batch 1 (Academic/Universities)
  'air-university-islamabad-jobs-2026', 'sarhad-university-suit-peshawar-jobs-2026',
  'times-university-multan-tum-jobs-2026', 'university-of-lahore-uol-jobs-2026', 'university-of-chakwal-uoc-jobs-2026',
  // Batch 2 (Banking/Corporate)
  'meezan-bank-teller-2026', 'engro-management-trainee-2026', 'unilever-future-leaders-2026',
  'bank-of-punjab-relationship-officer-transaction-banking-2026', 'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026',
  'askari-bank-sr-officer-artificial-intelligence-jobs-2026',
  // Batch 3 (Federal/Public Sector)
  'fpsc-assistant-director-2026', 'punjab-police-constable-recruitment-2026', 'nadra-data-entry-operator-2026',
  'wapda-junior-engineer-2026', 'gwadar-shipyard-cfo-accounts-officer-jobs-2026', 'karachi-shipyard-technical-assistant-jobs-2026',
  'navttc-assistant-private-secretary-jobs-2026', 'navttc-assistant-bps15-jobs-2026', 'navttc-director-bps18-jobs-2026',
  // Batch 4 (Internships)
  'ufone-summer-internship-2026', 'planning-commission-internship-2026', 'imarat-finance-intern-jobs-2026', 'punjab-sti-jobs-2026-27',
  // Batch 5 (Schemes/Results)
  'punjab-rozgar-scheme-2026', 'bise-lahore-matric-result-2026',
  // Batch 6 (Admissions/Scholarships)
  'phec-phd-scholarship-2026', 'turkiye-burslari-scholarship-2026', 'nust-undergraduate-admissions-fall-2026',
  'punjab-medical-university-admissions-2026', 'hec-peridot-research-program-phase-13-2026', 'sbbu-admissions-2026-deadline-extended',
  'uet-lahore-jobs-2026-faculty-research', 'isra-university-spring-2027-undergraduate-admissions'
]);

const rows = db.prepare("SELECT id, slug, title, category_slug, last_date, no_deadline, content, official_link FROM articles WHERE status = 'published'").all();

const remainingShort = [];

rows.forEach(r => {
  if (batchSlugs.has(r.slug)) return;
  let c = r.content;
  try {
    const p = JSON.parse(c);
    c = Array.isArray(p) ? p.join('\n\n') : c;
  } catch {}
  const words = c.split(/\s+/).filter(Boolean).length;
  const hasTable = c.includes('|') && /\|\s*:?-{2,}:?\s*\|/.test(c);
  const hasFaq = c.toLowerCase().includes('faq') || c.toLowerCase().includes('frequently asked');
  const hasClosed = /application (has closed|deadline passed|closed|expired)|recruitment (closed|completed)|status:\s*closed/i.test(c);

  if (words < 550 || !hasFaq || !hasTable) {
    remainingShort.push({ id: r.id, slug: r.slug, title: r.title, words, cat: r.category_slug, lastDate: r.last_date, hasTable, hasFaq, hasClosed });
  }
});

console.log('Total remaining articles needing review (not in batches 1-6 with <550 words or lacking table/FAQ):', remainingShort.length);
remainingShort.forEach(s => {
  console.log(`ID ${s.id} | Cat: ${s.cat} | Words: ${s.words} | Table: ${s.hasTable} | FAQ: ${s.hasFaq} | Closed: ${s.hasClosed} | ${s.slug}`);
});
