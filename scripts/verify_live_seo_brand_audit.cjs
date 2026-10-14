const https = require('https');

async function fetchUrl(url, redirect = 'manual') {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body
          });
        });
      });
      req.on('error', reject);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

async function run() {
  console.log('=== CareerDost Production Live Verification Suite ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  // 1. Homepage SEO & Brand Identity
  const home = await fetchUrl('https://careerdost.blog/');
  assert(home.status === 200, 'Homepage Status 200', `HTTP ${home.status}`);
  assert(home.body.includes('CareerDost | Pakistan Jobs, Sindh Govt Schemes &amp; Latest Updates') || home.body.includes('CareerDost | Pakistan Jobs, Sindh Govt Schemes & Latest Updates'), 'Homepage Title Tag Updated');
  assert(home.body.includes('Sindh government schemes'), 'Homepage Meta Description contains Sindh Govt Schemes');
  assert(home.body.includes('rel="canonical"') && home.body.includes('https://careerdost.blog/'), 'Homepage Canonical Tag');
  assert(home.body.includes('"@type":"Organization"') || home.body.includes('"@type": "Organization"'), 'Homepage Organization Schema');
  assert(home.body.includes('"@type":"WebSite"') || home.body.includes('"@type": "WebSite"'), 'Homepage WebSite Schema');
  assert(home.body.includes('Sindh') && home.body.includes('Pakistan'), 'Homepage Schema covers Pakistan and Sindh');

  // 2. Robots & Sitemap
  const robots = await fetchUrl('https://careerdost.blog/robots.txt');
  assert(robots.status === 200, 'robots.txt returns 200');
  assert(robots.body.includes('https://careerdost.blog/sitemap.xml'), 'robots.txt points to canonical sitemap');
  assert(robots.body.includes('Disallow: /admin'), 'robots.txt protects /admin');

  const sitemap = await fetchUrl('https://careerdost.blog/sitemap.xml');
  assert(sitemap.status === 200, 'sitemap.xml returns 200');
  assert(sitemap.body.includes('<urlset'), 'sitemap.xml is valid urlset XML');
  assert(sitemap.body.includes('https://careerdost.blog/jobs/nums-spring-2027-admissions'), 'sitemap.xml contains real article URLs');

  // 3. Static Pages Server SEO
  const about = await fetchUrl('https://careerdost.blog/about');
  assert(about.status === 200, 'About page returns 200');
  assert(about.body.includes('About CareerDost — Pakistan Jobs, Schemes &amp; Verification Policy') || about.body.includes('About CareerDost — Pakistan Jobs, Schemes & Verification Policy'), 'About page server title');
  assert(about.body.includes('rel="canonical"') && about.body.includes('https://careerdost.blog/about'), 'About page canonical tag');

  const contact = await fetchUrl('https://careerdost.blog/contact');
  assert(contact.status === 200, 'Contact page returns 200');
  assert(contact.body.includes('Contact CareerDost — Official Editorial &amp; Query Helpdesk') || contact.body.includes('Contact CareerDost — Official Editorial & Query Helpdesk'), 'Contact page server title');

  // 4. Live Article Server SEO & Schemas
  const job = await fetchUrl('https://careerdost.blog/jobs/nums-spring-2027-admissions');
  assert(job.status === 200, 'Valid Job Article returns 200');
  assert(job.body.includes('NUMS Spring 2027 Admissions Open') || job.body.includes('nums-spring-2027'), 'Job page title rendered');
  assert(job.body.includes('rel="canonical"') && job.body.includes('https://careerdost.blog/jobs/nums-spring-2027-admissions'), 'Job article canonical tag');
  assert(job.body.includes('"@type":"Article"') || job.body.includes('"@type":"JobPosting"') || job.body.includes('"@type": "Article"'), 'Job article schema rendered');

  const update = await fetchUrl('https://careerdost.blog/daily-updates/nums-spring-2027-admissions');
  assert(update.status === 200, 'Valid Daily Update returns 200');
  assert(update.body.includes('"@type":"NewsArticle"') || update.body.includes('"@type": "NewsArticle"'), 'Update NewsArticle schema rendered');

  // 5. Legacy Route Redirects
  const legacyArt = await fetchUrl('https://careerdost.blog/article/nums-spring-2027-admissions');
  assert(legacyArt.status === 301, 'Legacy /article/:slug returns 301 redirect', `Status ${legacyArt.status}`);
  assert(legacyArt.headers.location === 'https://careerdost.blog/jobs/nums-spring-2027-admissions', 'Legacy /article/ redirects to /jobs/:slug', legacyArt.headers.location);

  const legacyUpd = await fetchUrl('https://careerdost.blog/updates/nums-spring-2027-admissions');
  assert(legacyUpd.status === 301, 'Legacy /updates/:slug returns 301 redirect', `Status ${legacyUpd.status}`);
  assert(legacyUpd.headers.location === 'https://careerdost.blog/daily-updates/nums-spring-2027-admissions', 'Legacy /updates/ redirects to /daily-updates/:slug', legacyUpd.headers.location);

  // 6. Old Domain Redirects
  const oldDomain = await fetchUrl('https://careerdost.pages.dev/');
  assert(oldDomain.status === 301, 'careerdost.pages.dev returns 301 redirect', `Status ${oldDomain.status}`);
  assert(oldDomain.headers.location === 'https://careerdost.blog/', 'careerdost.pages.dev redirects to careerdost.blog', oldDomain.headers.location);

  // 7. Admin Protection
  const admin = await fetchUrl('https://careerdost.blog/admin');
  assert(admin.status === 200, 'Admin page returns 200');
  assert(admin.body.includes('content="noindex, nofollow"'), 'Admin page server response has noindex, nofollow');

  // 8. Soft 404 Prevention Tests (Must return genuine HTTP 404)
  const missingJob = await fetchUrl('https://careerdost.blog/jobs/definitely-nonexistent-job-slug-999');
  assert(missingJob.status === 404, 'Missing job returns HTTP 404', `Status ${missingJob.status}`);
  assert(missingJob.body.includes('404:'), 'Missing job returns 404 page content');

  const missingUpdate = await fetchUrl('https://careerdost.blog/daily-updates/definitely-nonexistent-update-slug-999');
  assert(missingUpdate.status === 404, 'Missing update returns HTTP 404', `Status ${missingUpdate.status}`);

  const missingLegacy = await fetchUrl('https://careerdost.blog/article/definitely-nonexistent-legacy-slug-999');
  assert(missingLegacy.status === 404, 'Missing legacy /article/ returns HTTP 404', `Status ${missingLegacy.status}`);

  const missingCategory = await fetchUrl('https://careerdost.blog/category/definitely-nonexistent-category-999');
  assert(missingCategory.status === 404, 'Missing category returns HTTP 404', `Status ${missingCategory.status}`);

  const missingRandom = await fetchUrl('https://careerdost.blog/completely-random-nonexistent-path-999');
  assert(missingRandom.status === 404, 'Completely random path returns HTTP 404 (Soft 404 eliminated!)', `Status ${missingRandom.status}`);

  // 9. AI Visibility & LLMs.txt
  const llms = await fetchUrl('https://careerdost.blog/llms.txt');
  assert(llms.status === 200, 'llms.txt returns 200');
  assert(llms.body.includes('Sindh') && llms.body.includes('Pakistan'), 'llms.txt covers Pakistan and Sindh');
  assert(llms.body.includes('NOT affiliated with, connected to, or related to any similarly named platforms, businesses, or career boards in India'), 'llms.txt contains explicit Indian platform disambiguation');

  // 10. Google Search Console Verification Token
  const gsc = await fetchUrl('https://careerdost.blog/googlefa0859c31163b27d.html');
  assert(gsc.status === 200, 'GSC Verification File returns HTTP 200', `Status ${gsc.status}`);
  assert(gsc.body.includes('googlefa0859c31163b27d.html'), 'GSC Verification Token string is present in response');

  // 11. Sindh Minimum Wage 2026 Non-Job Presentation Test
  const wage = await fetchUrl('https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary');
  assert(wage.status === 200, 'Sindh Minimum Wage Article returns HTTP 200', `Status ${wage.status}`);
  assert(wage.body.includes('Official Statutory Notification') || wage.body.includes('Official Notification'), 'Sindh Minimum Wage uses statutory notification presentation');
  assert(wage.body.includes('https://lhr.sindh.gov.pk/'), 'Sindh Minimum Wage includes verified official Labour Dept portal link');
  assert(!wage.body.includes('>Vacancies</span><strong'), 'Sindh Minimum Wage does not present minimum wage tiers as vacancies');

  // 12. Edge HTML LCP Optimization Preload Test
  assert(wage.body.includes('rel="preload"') && wage.body.includes('as="image"'), 'Hero image is preloaded in head for mobile LCP optimization');

  console.log(`\n=== Verification Complete: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

run().catch(e => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
