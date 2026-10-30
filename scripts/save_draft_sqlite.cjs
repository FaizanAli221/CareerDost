const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const draft = {
  id: 508,
  slug: 'sindh-nchd-becs-teachers-salary-notices-october-2026',
  title: 'Sindh Education NCHD & BECS Teachers Salary Update 2026: Verification Notices for Jamshoro, Matiari & TMK',
  category_slug: 'government-schemes',
  organization: 'School Education & Literacy Department (SE&LD), Government of Sindh',
  job_type: 'Government Departmental Update',
  location: 'Jamshoro, Matiari, Tando Muhammad Khan, Sindh',
  qualification: 'PST / JEST / Community School Educators',
  salary: 'Rs. 37,000 / month',
  last_date: '2026-10-31',
  publish_date: '2026-10-20',
  official_link: 'https://www.sindheducation.gov.pk/notifications',
  featured: 1,
  logo_initial: 'S',
  excerpt: 'Official Sindh School Education Department notifications dated 13 October 2026 regarding NCHD & BECS teachers salary verification in Jamshoro, Matiari & Tando Muhammad Khan.',
  content: '### Official Notification Overview: NCHD & BECS Teachers in Sindh\n\nThe School Education and Literacy Department (SE&LD), Government of Sindh, has officially released administrative circulars and district-level verification orders dated 13 October 2026 concerning the regular salary processing of transitioned National Commission for Human Development (NCHD) and Basic Education Community Schools (BECS) teachers.\n\nThese latest directives specifically target educators stationed in District Jamshoro, District Matiari, and District Tando Muhammad Khan (TMK), setting in motion the administrative mechanism required to release their enhanced monthly honoraria through the provincial treasury network.\n\n### Critical Notice: Administrative Processing vs. Actual Disbursement\n\n> [!CAUTION]\n> Important Distinction for Beneficiary Teachers:\n> The issuance of the 13 October 2026 notification marks the administrative and budgetary approval phase, NOT an immediate cash disbursement at commercial bank counters.\n\n1. Administrative Phase (Current): Verified, barcoded databases forwarded to AG Sindh and District Accounts Offices.\n2. Verification & Audit Stage: SEMIS codes, biometric verification, and CNIC records reconciled.\n3. Disbursement Phase (Upcoming): Funds credited via individual accounts or treasury cheques following DAO token clearance.\n\n### District-by-District Breakdown\n- Jamshoro District: Covers 102 transitioned NCHD primary teachers.\n- Matiari District: Covers transitioned NCHD and BECS community teaching staff.\n- Tando Muhammad Khan (TMK): Covers active cohort of over 110 transitioned teachers.\n\n### Salary Structure & Approved Rates\nConsolidated monthly honorarium: Rs. 37,000 per month under Sindh Statutory Minimum Wage alignment.',
  seo_title: 'Sindh Education NCHD & BECS Teachers Salary 2026: Jamshoro, Matiari, TMK',
  meta_description: 'Sindh Education Department 13 October 2026 notifications for NCHD and BECS teachers salary verification in Jamshoro, Matiari, and Tando Muhammad Khan.',
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Insert or replace into articles
const stmt = db.prepare(`
  INSERT OR REPLACE INTO articles (
    id, slug, title, category_slug, organization, job_type, location,
    qualification, salary, last_date, publish_date, official_link,
    featured, logo_initial, excerpt, content, seo_title, meta_description,
    status, created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?
  )
`);

stmt.run(
  draft.id, draft.slug, draft.title, draft.category_slug, draft.organization,
  draft.job_type, draft.location, draft.qualification, draft.salary,
  draft.last_date, draft.publish_date, draft.official_link,
  draft.featured, draft.logo_initial, draft.excerpt, draft.content,
  draft.seo_title, draft.meta_description, draft.status,
  draft.created_at, draft.updated_at
);

console.log('Saved draft article [508] into careerdost.sqlite with status = draft');
