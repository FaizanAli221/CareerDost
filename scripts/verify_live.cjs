const https = require('https');

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ...headers
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function verifyAll() {
  console.log('=== VERIFYING LIVE PRODUCTION (https://careerdost.blog) ===\n');

  // 1. /daily-updates
  console.log('1. Checking https://careerdost.blog/daily-updates...');
  const dailyRes = await fetchUrl('https://careerdost.blog/daily-updates');
  console.log('   HTTP Status:', dailyRes.status);
  console.log('   Content-Type:', dailyRes.headers['content-type']);
  const titleMatch = dailyRes.body.match(/<title>([^<]+)<\/title>/);
  console.log('   Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
  const h1Match = dailyRes.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  console.log('   H1:', h1Match ? h1Match[1].replace(/\s+/g, ' ').trim() : 'NOT FOUND');
  const canonicalMatch = dailyRes.body.match(/<link rel="canonical" href="([^"]+)"/);
  console.log('   Canonical:', canonicalMatch ? canonicalMatch[1] : 'NOT FOUND');
  console.log('   Has INITIAL_UPDATES:', dailyRes.body.includes('window.__INITIAL_UPDATES__'));
  const articleMatches = dailyRes.body.match(/<article/g) || [];
  console.log('   Articles rendered in SSR HTML:', articleMatches.length);
  const jsonLdMatch = dailyRes.body.match(/<script id="page-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      console.log('   JSON-LD Types:', parsed['@graph']?.map(x => x['@type']));
    } catch (e) {
      console.log('   JSON-LD Parse Error:', e.message);
    }
  }

  // 2. /robots.txt
  console.log('\n2. Checking https://careerdost.blog/robots.txt...');
  const robotsRes = await fetchUrl('https://careerdost.blog/robots.txt');
  console.log('   HTTP Status:', robotsRes.status);
  console.log('   Content-Type:', robotsRes.headers['content-type']);
  console.log('   Snippet:\n' + robotsRes.body.slice(0, 300));

  // 3. /sitemap.xml
  console.log('\n3. Checking https://careerdost.blog/sitemap.xml...');
  const sitemapRes = await fetchUrl('https://careerdost.blog/sitemap.xml');
  console.log('   HTTP Status:', sitemapRes.status);
  console.log('   Content-Type:', sitemapRes.headers['content-type']);
  const urlCount = (sitemapRes.body.match(/<url>/g) || []).length;
  console.log('   URL Count in Sitemap:', urlCount);

  // 4. /googlefa0859c31163b27d.html
  console.log('\n4. Checking Google Verification File...');
  const gRes = await fetchUrl('https://careerdost.blog/googlefa0859c31163b27d.html');
  console.log('   HTTP Status:', gRes.status);
  console.log('   Body Content:', gRes.body.trim());

  // 5. /category/government-jobs
  console.log('\n5. Checking https://careerdost.blog/category/government-jobs...');
  const catRes = await fetchUrl('https://careerdost.blog/category/government-jobs');
  console.log('   HTTP Status:', catRes.status);
  const catH1 = catRes.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  console.log('   H1:', catH1 ? catH1[1].replace(/\s+/g, ' ').trim() : 'NOT FOUND');

  // 6. Non-job article schema: Sindh Minimum Wage
  console.log('\n6. Checking Sindh Minimum Wage (Non-job statutory notification schema)...');
  const wageRes = await fetchUrl('https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary');
  console.log('   HTTP Status:', wageRes.status);
  const wageJsonLdMatch = wageRes.body.match(/<script id="page-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (wageJsonLdMatch) {
    try {
      const parsed = JSON.parse(wageJsonLdMatch[1]);
      console.log('   JSON-LD Types:', parsed['@graph']?.map(x => x['@type']));
      const hasJobPosting = parsed['@graph']?.some(x => x['@type'] === 'JobPosting');
      console.log('   Has JobPosting (should be FALSE):', hasJobPosting);
    } catch (e) {
      console.log('   Parse Error:', e.message);
    }
  }

  console.log('\n=== LIVE PRODUCTION CHECKS COMPLETE ===');
}

verifyAll().catch(console.error);
