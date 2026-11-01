/**
 * Single source of truth for consolidated duplicate article slugs.
 *
 * - Edge middleware (`functions/_middleware.js`) serves permanent HTTP 301 redirects
 *   from any consolidated slug to its canonical `/jobs/<target-slug>` guide.
 * - Public article feeds (`/api/articles`, SSR category/homepage lists, `listings.js`,
 *   `articleSlugs.js`, and `sitemap.xml`) exclude consolidated duplicate slugs so
 *   search engines and readers only see canonical guides.
 * - Underlying database rows in D1 / SQLite are preserved for Admin CMS auditability.
 */

export const CONSOLIDATED_SLUG_REDIRECTS = new Map([
  ['httpswwwnjpgovpk', '/jobs/pidcl-site-engineer-jobs-2026'],
  ['bank-alfalah-cso-jobs-2026', '/jobs/bank-alfalah-jobs-internships-2026'],
  ['systems-limited-hiring-software-engineers', '/jobs/systems-limited-associate-software-engineer-jobs-2026'],
  ['hbl-management-trainee-officer-2026', '/jobs/hbl-jobs-internships-the-league-2026'],
  ['benazir-income-support-programme-2026', '/jobs/bisp-8171-payment-check-2026-official-guide'],
  ['nts-nat-result-september-2026', '/jobs/nts-latest-results-answer-keys-2026'],
  ['commonwealth-scholarships-2027-28-pakistan-hec-csc-uk', '/jobs/hec-uk-commonwealth-scholarships-2027-28'],
  ['cbd-punjab-paid-internship-2026-youth-career-program', '/jobs/punjab-cbd-youth-career-program-2026-internship'],
  ['sindh-pink-scooty-scheme-2026-online-registration-eligibility', '/jobs/sindh-govt-electric-scooty-scheme-2026-women'],
  ['shaikh-ayaz-university-spring-2027-admissions-apply-online', '/jobs/shaikh-ayaz-university-admissions-2027'],
  ['lums-nano-physics-research-associate-jobs-2026', '/jobs/lums-electronic-technician-jobs-2026'],
  ['lums-lahore-jobs-advancement-it-staff-2026', '/jobs/lums-electronic-technician-jobs-2026'],
  ['virtual-university-admissions-2026-deadline-tomorrow', '/jobs/virtual-university-fall-2026-admissions'],
  ['nts-nat-2026-october-test-roll-number-slips-uploaded', '/jobs/nts-nat-gat-roll-number-slip-2026'],
  ['nepra-support-staff-jobs-2026', '/jobs/nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider'],
  ['cabinet-division-driver-jobs-bps-04-2026', '/jobs/cabinet-division-staff-car-driver-jobs-bps-04-2026'],
  ['meezan-bank-jobs-october-2026', '/jobs/meezan-bank-transaction-associates-batch-01-jobs-2026'],
])

export const CONSOLIDATED_SLUGS_SET = new Set(CONSOLIDATED_SLUG_REDIRECTS.keys())

export function filterPublicArticles(items) {
  if (!Array.isArray(items)) return []
  return items.filter((item) => item && !CONSOLIDATED_SLUGS_SET.has(String(item.slug || '').toLowerCase()))
}
