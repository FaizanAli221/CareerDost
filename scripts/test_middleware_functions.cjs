const Database = require('better-sqlite3');
const fs = require('fs');
const vm = require('vm');

async function testFix() {
  const { getContentType, getContentTypeLabels, getContextualStatus } = await import('../src/lib/contentType.js');

  let mwCode = fs.readFileSync('functions/_middleware.js', 'utf8');
  // Simulate the fix: remove the out-of-scope ${guideBanner} reference in generateJobHtml
  const jobHtmlBlock = mwCode.slice(mwCode.indexOf('function generateJobHtml'), mwCode.indexOf('const CATEGORY_META'));
  const fixedJobHtmlBlock = jobHtmlBlock.replace('${guideBanner}\n', '');

  const helpers = mwCode.slice(mwCode.indexOf('function cleanPlainText'), mwCode.indexOf('function generateJobHtml'));
  const fullCode = helpers + fixedJobHtmlBlock;

  const context = {
    getContentType,
    getContentTypeLabels,
    getContextualStatus,
    DEFAULT_OG_IMAGE: 'https://careerdost.blog/default.jpg',
    SITE_URL: 'https://careerdost.blog',
    console
  };
  vm.createContext(context);
  vm.runInContext(fullCode, context);

  const db = new Database('careerdost.sqlite');

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

  console.log('=== TESTING FIX ON ALL 9 REPORTED ARTICLES ===\n');

  for (const slug of targetSlugs) {
    const art = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
    try {
      const html = context.generateJobHtml(art, 'https://careerdost.blog/jobs/' + slug);
      console.log(`[PASS] ${slug} -> Rendered HTML: ${html.length} bytes`);
    } catch (err) {
      console.log(`[FAIL] ${slug} -> ${err.message}`);
    }
  }
}

testFix();
