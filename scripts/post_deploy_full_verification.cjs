const https = require('https');

function fetchUrl(urlStr) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(urlStr, { headers: { 'User-Agent': 'CareerDost-PostDeployVerifier/1.0' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          url: urlStr,
          status: res.statusCode,
          headers: res.headers,
          duration: Date.now() - start,
          body: body
        });
      });
    });
    req.on('error', (err) => {
      resolve({
        url: urlStr,
        status: 0,
        headers: {},
        duration: Date.now() - start,
        body: '',
        error: err.message
      });
    });
  });
}

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

async function verify9Articles() {
  console.log('===============================================================');
  console.log('1. VERIFYING THE 9 PREVIOUSLY AFFECTED /jobs/ ARTICLE URLS');
  console.log('===============================================================');

  const slugs = [
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

  const results = [];

  for (const slug of slugs) {
    const url = `https://careerdost.blog/jobs/${slug}`;
    const res = await fetchUrl(url);
    const title = extractTag(res.body, /<title>([^<]+)<\/title>/i);
    const canonical = extractTag(res.body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    const h1 = extractTag(res.body, /<h1[^>]*>([^<]+)<\/h1>/i);
    const hasStatus = res.body.includes('status-banner') || res.body.includes('Applications Closed') || res.body.includes('Active Opportunity');
    const imageMatch = res.body.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || res.body.match(/<img[^>]+src=["']([^"']+)["']/i);
    const imageUrl = imageMatch ? imageMatch[1] : null;

    let imageStatus = 'N/A';
    if (imageUrl) {
      const fullImgUrl = imageUrl.startsWith('http') ? imageUrl : `https://careerdost.blog${imageUrl}`;
      const imgRes = await fetchUrl(fullImgUrl);
      imageStatus = `HTTP ${imgRes.status} (${imgRes.headers['content-type'] || 'unknown'})`;
    }

    const is404Page = title && title.includes('Page Not Found');
    const pass = res.status === 200 && !is404Page && title && canonical && res.body.length > 5000;

    results.push({
      slug,
      status: res.status,
      pass,
      title,
      canonical,
      h1,
      size: res.body.length,
      imageStatus,
      imageUrl
    });

    console.log(`[${pass ? 'PASS' : 'FAIL'}] /jobs/${slug}`);
    console.log(`       Status: HTTP ${res.status} | Size: ${res.body.length} bytes | Time: ${res.duration}ms`);
    console.log(`       Title: ${title}`);
    console.log(`       Canonical: ${canonical}`);
    console.log(`       H1: ${h1}`);
    console.log(`       Image: ${imageUrl} -> ${imageStatus}`);
    console.log('---------------------------------------------------------------');
  }

  return results;
}

async function verifyAdsTxt() {
  console.log('\n===============================================================');
  console.log('2. VERIFYING /ads.txt');
  console.log('===============================================================');

  const url = 'https://careerdost.blog/ads.txt';
  const res = await fetchUrl(url);
  const contentType = res.headers['content-type'] || '';
  const containsPubId = res.body.includes('pub-3823137402984505');
  const exactExpected = 'google.com, pub-3823137402984505, DIRECT, f08c47fec0942fa0';
  const containsExact = res.body.includes(exactExpected);
  const isTextPlain = contentType.toLowerCase().includes('text/plain');
  const pass = res.status === 200 && isTextPlain && containsExact;

  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${url}`);
  console.log(`       Status: HTTP ${res.status}`);
  console.log(`       Content-Type: ${contentType}`);
  console.log(`       Contains Pub ID: ${containsPubId}`);
  console.log(`       Body: ${res.body.trim()}`);

  return { pass, status: res.status, contentType, body: res.body.trim() };
}

async function verifySiteSuite() {
  console.log('\n===============================================================');
  console.log('3. VERIFYING HOMEPAGE, ALL 10 CATEGORIES, CRAWL FILES & UPDATES');
  console.log('===============================================================');

  const endpoints = [
    { name: 'Homepage', url: 'https://careerdost.blog/', expectedTitle: 'CareerDost' },
    { name: 'Category: Government Jobs', url: 'https://careerdost.blog/category/government-jobs', expectedTitle: 'Government Jobs' },
    { name: 'Category: Private Jobs', url: 'https://careerdost.blog/category/private-jobs', expectedTitle: 'Private Jobs' },
    { name: 'Category: Bank Jobs', url: 'https://careerdost.blog/category/bank-jobs', expectedTitle: 'Bank Jobs' },
    { name: 'Category: IT Jobs', url: 'https://careerdost.blog/category/it-jobs', expectedTitle: 'IT Jobs' },
    { name: 'Category: Scholarships', url: 'https://careerdost.blog/category/scholarships', expectedTitle: 'Scholarships' },
    { name: 'Category: Internships', url: 'https://careerdost.blog/category/internships', expectedTitle: 'Internships' },
    { name: 'Category: Admissions', url: 'https://careerdost.blog/category/admissions', expectedTitle: 'Admissions' },
    { name: 'Category: Government Schemes', url: 'https://careerdost.blog/category/government-schemes', expectedTitle: 'Government Schemes' },
    { name: 'Category: Results', url: 'https://careerdost.blog/category/results', expectedTitle: 'Results' },
    { name: 'Category: Career Guides', url: 'https://careerdost.blog/category/career-guides', expectedTitle: 'Career Guides' },
    { name: 'Sitemap XML', url: 'https://careerdost.blog/sitemap.xml', checkSnippet: '<urlset' },
    { name: 'Robots TXT', url: 'https://careerdost.blog/robots.txt', checkSnippet: 'Sitemap: https://careerdost.blog/sitemap.xml' },
    { name: 'Daily Updates Listing', url: 'https://careerdost.blog/daily-updates', expectedTitle: 'Daily Career &amp; Education Updates' },
    { name: 'Daily Update Standalone', url: 'https://careerdost.blog/daily-updates/fpsc-consolidated-advertisement-09-2026-announced', expectedTitle: 'FPSC' }
  ];

  const results = [];
  for (const ep of endpoints) {
    const res = await fetchUrl(ep.url);
    const title = extractTag(res.body, /<title>([^<]+)<\/title>/i);
    let pass = res.status === 200;
    if (ep.expectedTitle && (!title || !title.toLowerCase().includes(ep.expectedTitle.toLowerCase()))) {
      pass = false;
    }
    if (ep.checkSnippet && !res.body.includes(ep.checkSnippet)) {
      pass = false;
    }

    results.push({ name: ep.name, url: ep.url, status: res.status, title, pass });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${ep.name} (${ep.url})`);
    console.log(`       Status: HTTP ${res.status} | Title: ${title || '(no title tag)'} | Size: ${res.body.length} bytes`);
  }

  return results;
}

async function run() {
  const articlesResults = await verify9Articles();
  const adsTxtResult = await verifyAdsTxt();
  const suiteResults = await verifySiteSuite();

  const total = articlesResults.length + 1 + suiteResults.length;
  const passed = articlesResults.filter(r => r.pass).length + (adsTxtResult.pass ? 1 : 0) + suiteResults.filter(r => r.pass).length;

  console.log('\n===============================================================');
  console.log(`FINAL RESULTS: ${passed}/${total} CHECKS PASSED`);
  console.log('===============================================================');
}

run();
