import https from 'https';

const URLS_TO_TEST = [
  'https://careerdost.blog/',
  'https://careerdost.blog/sitemap.xml',
  'https://careerdost.blog/robots.txt',
  'https://careerdost.blog/category/government-jobs',
  'https://careerdost.blog/category/scholarships',
  'https://careerdost.blog/daily-updates',
  'https://careerdost.blog/privacy-policy',
  'https://careerdost.blog/terms-and-conditions',
  'https://careerdost.blog/disclaimer',
  'https://careerdost.blog/about',
  'https://careerdost.blog/contact',
  'https://careerdost.blog/api/articles?limit=3',
  'https://careerdost.blog/api/updates/latest?limit=3',
];

const REDIRECT_URLS = [
  'https://careerdost.pages.dev/',
  'https://careerdost.pages.dev/category/government-jobs',
  'https://careerdost.pages.dev/daily-updates?test=1',
  'https://www.careerdost.blog/',
];

function fetchUrl(url, followRedirect = false) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 CareerDostAudit/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { if (data.length < 50000) data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          bodySnippet: data.substring(0, 300),
          fullBody: data
        });
      });
    });
    req.on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFYING PRODUCTION ON https://careerdost.blog ===\n');
  for (const url of URLS_TO_TEST) {
    try {
      const res = await fetchUrl(url);
      console.log(`[STATUS ${res.status}] ${url}`);
      if (url.endsWith('.xml') || url.endsWith('.txt')) {
        console.log(`   Type: ${res.headers['content-type']}`);
        console.log(`   Snippet: ${res.bodySnippet.substring(0, 150).replace(/\n/g, ' ')}`);
      } else if (url.includes('/api/')) {
        console.log(`   API response size: ${res.fullBody.length} bytes`);
      }
    } catch (err) {
      console.error(`[ERROR] ${url}: ${err.message}`);
    }
  }

  console.log('\n=== VERIFYING REDIRECTS (careerdost.pages.dev & www) ===\n');
  for (const url of REDIRECT_URLS) {
    try {
      const res = await fetchUrl(url, false);
      console.log(`[STATUS ${res.status}] ${url}`);
      console.log(`   Redirect Location: ${res.headers.location || 'NONE'}`);
    } catch (err) {
      console.error(`[ERROR] ${url}: ${err.message}`);
    }
  }
}

run();
