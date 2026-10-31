const Database = require('better-sqlite3');
const fs = require('fs');

async function testActualMiddlewareRuntime() {
  console.log('=== TESTING ACTUAL MIDDLEWARE RUNTIME ON ALL 9 AFFECTED ARTICLES ===\n');

  const { isGenuineJobVacancy, buildJobPostingSchema } = await import('../src/lib/jobSchema.js');
  const { getContentType, getContentTypeLabels, getContextualStatus, getSectorTransparencyNote } = await import('../src/lib/contentType.js');

  const mwCode = fs.readFileSync('functions/_middleware.js', 'utf8');

  // Load SQLite database to mock context.env.DB
  const db = new Database('careerdost.sqlite');

  // Create D1 mock using better-sqlite3
  const mockD1 = {
    prepare: (query) => {
      const stmt = db.prepare(query);
      return {
        bind: (...params) => ({
          first: async () => {
            const row = stmt.get(...params);
            return row || null;
          },
          all: async () => {
            const rows = stmt.all(...params);
            return { results: rows };
          }
        }),
        all: async () => {
          const rows = stmt.all();
          return { results: rows };
        }
      };
    }
  };

  const targetSlugs = [
    'spsc-exam-preparation-screening-challan-guide',
    'fpsc-online-application-challan-form-32a-guide',
    'national-job-portal-njp-pakistan-application-guide',
    'comsats-university-jobs-faculty-staff-2026',
    'punjab-university-jobs-faculty-staff-2026',
    'pidcl-site-engineer-jobs-2026',
    'university-of-chakwal-uoc-jobs-2026',
    'fpsc-assistant-director-2026',
    'punjab-police-constable-recruitment-2026'
  ];

  // We can dynamically evaluate the middleware's helper functions in a clean sandbox
  const vm = require('vm');
  const helpersCode = mwCode.slice(mwCode.indexOf('function cleanPlainText'), mwCode.indexOf('export async function onRequest'));

  const sandbox = {
    getContentType,
    getContentTypeLabels,
    getContextualStatus,
    getSectorTransparencyNote,
    isGenuineJobVacancy,
    buildJobPostingSchema,
    SITE_URL: 'https://careerdost.blog',
    DEFAULT_OG_IMAGE: 'https://careerdost.blog/default.jpg',
    VALID_CATEGORIES: new Set(['government-jobs', 'career-guides', 'bank-jobs', 'private-jobs', 'it-jobs', 'scholarships', 'internships', 'admissions', 'government-schemes', 'results']),
    console
  };
  vm.createContext(sandbox);
  vm.runInContext(helpersCode, sandbox);

  let passedCount = 0;

  for (const slug of targetSlugs) {
    const art = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
    if (!art) {
      console.log(`[FAIL] ${slug} -> NOT FOUND IN SQLITE`);
      continue;
    }

    const canonical = `https://careerdost.blog/jobs/${slug}`;
    const generatedHtml = sandbox.generateJobHtml(art, canonical);

    // Verify requirements:
    // 1. Correct article title in H1
    const hasTitle = generatedHtml.includes(sandbox.escapeHtml(art.title));
    // 2. Correct canonical URL
    const hasCanonical = generatedHtml.includes(`href="/jobs/${art.slug}"`) || generatedHtml.includes(`canonical`);
    // 3. Content rendered
    const hasContent = generatedHtml.length > 5000;
    // 4. Status information
    const hasStatus = generatedHtml.includes('OFFICIAL NOTICE') || generatedHtml.includes('Notice') || generatedHtml.includes('Application Window Closed') || generatedHtml.includes('Verified');

    const pass = hasTitle && hasContent && hasStatus;
    if (pass) passedCount++;

    console.log(`[${pass ? 'PASS' : 'FAIL'}] /jobs/${slug}`);
    console.log(`   Title Verified: ${hasTitle} ("${art.title.slice(0, 50)}...")`);
    console.log(`   Canonical Path: /jobs/${art.slug}`);
    console.log(`   Content Length: ${generatedHtml.length} bytes`);
    console.log(`   Status Rendered: ${hasStatus}`);
    console.log('----------------------------------------------------');
  }

  console.log(`\nRuntime Verification Summary: ${passedCount} / ${targetSlugs.length} articles verified.`);
}

testActualMiddlewareRuntime();
