const https = require('https');

function testUrl(urlStr, expectedContent = '') {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(urlStr, { headers: { 'User-Agent': 'CareerDost-SafetyAuditBot/1.0' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        const containsExpected = expectedContent ? body.toLowerCase().includes(expectedContent.toLowerCase()) : true;
        resolve({
          url: urlStr,
          status: res.statusCode,
          duration: `${duration}ms`,
          headers: res.headers,
          contentLength: body.length,
          containsExpected: containsExpected,
          sample: body.slice(0, 150).replace(/\s+/g, ' ')
        });
      });
    });
    req.on('error', (err) => {
      resolve({
        url: urlStr,
        status: 'ERROR: ' + err.message,
        duration: `${Date.now() - start}ms`,
        containsExpected: false
      });
    });
  });
}

async function runProductionChecks() {
  const tests = [
    // 1. Core pages
    { url: 'https://careerdost.blog/', expected: 'CareerDost', desc: 'Homepage' },
    { url: 'https://careerdost.blog/about', expected: 'CareerDost', desc: 'About Page' },
    { url: 'https://careerdost.blog/contact', expected: 'Contact', desc: 'Contact Page' },
    { url: 'https://careerdost.blog/privacy-policy', expected: 'Privacy Policy', desc: 'Privacy Policy' },
    { url: 'https://careerdost.blog/disclaimer', expected: 'Disclaimer', desc: 'Disclaimer' },
    { url: 'https://careerdost.blog/terms-and-conditions', expected: 'Terms', desc: 'Terms & Conditions' },
    { url: 'https://careerdost.blog/about#editorial-policy', expected: 'Editorial', desc: 'Editorial Policy Section' },
    { url: 'https://careerdost.blog/editorial-policy', expected: '', desc: 'Editorial Policy Alias (301)' },

    // 2. All 10 Categories
    { url: 'https://careerdost.blog/category/government-jobs', expected: 'Government', desc: 'Category: Government Jobs' },
    { url: 'https://careerdost.blog/category/private-jobs', expected: 'Private', desc: 'Category: Private Jobs' },
    { url: 'https://careerdost.blog/category/bank-jobs', expected: 'Bank', desc: 'Category: Bank Jobs' },
    { url: 'https://careerdost.blog/category/it-jobs', expected: 'IT', desc: 'Category: IT Jobs' },
    { url: 'https://careerdost.blog/category/scholarships', expected: 'Scholarship', desc: 'Category: Scholarships' },
    { url: 'https://careerdost.blog/category/internships', expected: 'Internship', desc: 'Category: Internships' },
    { url: 'https://careerdost.blog/category/admissions', expected: 'Admission', desc: 'Category: Admissions' },
    { url: 'https://careerdost.blog/category/government-schemes', expected: 'Scheme', desc: 'Category: Government Schemes' },
    { url: 'https://careerdost.blog/category/results', expected: 'Result', desc: 'Category: Results' },
    { url: 'https://careerdost.blog/category/career-guides', expected: 'Career Guides', desc: 'Category: Career Guides' },

    // 3. Three New Guides
    { url: 'https://careerdost.blog/jobs/spsc-exam-preparation-screening-challan-guide', expected: 'SPSC', desc: 'Guide: SPSC Preparation' },
    { url: 'https://careerdost.blog/jobs/fpsc-online-application-challan-form-32a-guide', expected: 'Challan', desc: 'Guide: FPSC Challan 32-A' },
    { url: 'https://careerdost.blog/jobs/national-job-portal-njp-pakistan-application-guide', expected: 'National Job Portal', desc: 'Guide: NJP Application' },

    // 4. Random Updated Active Articles
    { url: 'https://careerdost.blog/jobs/comsats-university-jobs-faculty-staff-2026', expected: 'COMSATS', desc: 'Active Job: COMSATS' },
    { url: 'https://careerdost.blog/jobs/punjab-university-jobs-faculty-staff-2026', expected: 'Punjab', desc: 'Active Job: PU' },
    { url: 'https://careerdost.blog/jobs/pidcl-site-engineer-jobs-2026', expected: 'PIDCL', desc: 'Active Job: PIDCL' },

    // 5. Random Closed-Status Articles
    { url: 'https://careerdost.blog/jobs/university-of-chakwal-uoc-jobs-2026', expected: 'closed', desc: 'Closed Article: UOC' },
    { url: 'https://careerdost.blog/jobs/fpsc-assistant-director-2026', expected: 'closed', desc: 'Closed Article: FPSC AD' },
    { url: 'https://careerdost.blog/jobs/punjab-police-constable-recruitment-2026', expected: 'closed', desc: 'Closed Article: Punjab Police' },

    // 6. Crawl & Discovery files
    { url: 'https://careerdost.blog/sitemap.xml', expected: '<urlset', desc: 'Dynamic XML Sitemap' },
    { url: 'https://careerdost.blog/robots.txt', expected: 'Sitemap:', desc: 'Robots.txt' },
    { url: 'https://careerdost.blog/ads.txt', expected: 'pub-3823137402984505', desc: 'Ads.txt File' },

    // 7. Daily Updates
    { url: 'https://careerdost.blog/daily-updates', expected: 'Daily', desc: 'Daily Updates Listing' },
    { url: 'https://careerdost.blog/daily-updates/fpsc-consolidated-advertisement-09-2026-announced', expected: 'FPSC', desc: 'Standalone Daily Update' },
    { url: 'https://careerdost.blog/daily-updates/comsats-university-jobs-faculty-staff-2026', expected: '', desc: 'Canonical 301 Update Redirect' }
  ];

  console.log('=== STARTING COMPREHENSIVE PRODUCTION SYSTEM CHECK ===\n');

  for (const t of tests) {
    const res = await testUrl(t.url, t.expected);
    const pass = (res.status === 200 || (t.url.includes('redirect') || res.status === 301)) && (t.expected ? res.containsExpected : true);
    const badge = pass ? '[PASS]' : '[WARN/FAIL]';
    console.log(`${badge} ${t.desc} -> Status ${res.status} (${res.duration}) | Contains "${t.expected}": ${res.containsExpected}`);
    if (!pass) {
      console.log(`   URL: ${t.url}`);
      console.log(`   Sample: ${res.sample}`);
    }
  }
}

runProductionChecks();
