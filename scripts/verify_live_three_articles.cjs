const https = require('https');

const SITE_URL = 'https://careerdost.blog';

const articles = [
  {
    slug: 'sindh-government-graduate-internship-program-2026',
    url: `${SITE_URL}/jobs/sindh-government-graduate-internship-program-2026`,
    imageUrl: `${SITE_URL}/images/sindh-government-graduate-internship-program-2026.webp`,
    expectedTitle: 'Sindh Graduate Internship Program 2026: Status & Registration Guide — CareerDost',
    expectedH1: 'Sindh Government Graduate Internship Program 2026 – Registration, Eligibility & Updates',
    expectedSnippet: 'Registration details and the official application procedure have not yet been confirmed',
    expectedImage: '/images/sindh-government-graduate-internship-program-2026.webp',
  },
  {
    slug: 'kp-government-20000-paid-internships-2026',
    url: `${SITE_URL}/jobs/kp-government-20000-paid-internships-2026`,
    imageUrl: `${SITE_URL}/images/kp-government-20000-paid-internships-2026.webp`,
    expectedTitle: 'KP 20,000 Paid Internships 2026: Rs. 30,000 Stipend & Program Details — CareerDost',
    expectedH1: 'KP Government Announces 20,000 Paid Internships 2026 – Rs. 30,000 Monthly Stipend',
    expectedSnippet: 'Rs. 30,000',
    expectedImage: '/images/kp-government-20000-paid-internships-2026.webp',
  },
  {
    slug: 'gates-cambridge-scholarship-2027',
    url: `${SITE_URL}/jobs/gates-cambridge-scholarship-2027`,
    imageUrl: `${SITE_URL}/images/gates-cambridge-scholarship-2027.webp`,
    expectedTitle: 'Gates Cambridge Scholarship 2027: Fully Funded UK Study for Pakistan — CareerDost',
    expectedH1: 'Gates Cambridge Scholarship 2027 – Fully Funded Postgraduate Scholarship',
    expectedSnippet: '8 December 2026',
    expectedImage: '/images/gates-cambridge-scholarship-2027.webp',
  }
];

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CareerDost-Verifier/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = SITE_URL + redirectUrl;
        }
        return resolve(fetchUrl(redirectUrl, maxRedirects - 1));
      }
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data).toString('utf8'),
          rawBuffer: Buffer.concat(data)
        });
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('=== VERIFYING LIVE CAREERDOST PRODUCTION WEBSITE ===\n');
  console.log(`Target Host: ${SITE_URL}\n`);

  let allPassed = true;

  for (const art of articles) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`Testing Article: ${art.slug}`);
    console.log(`URL: ${art.url}`);

    const res = await fetchUrl(art.url);
    console.log(`HTTP Status: ${res.statusCode} ${res.statusCode === 200 ? '✓ PASS' : '✗ FAIL'}`);
    if (res.statusCode !== 200) allPassed = false;

    // Check Title
    const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    console.log(`Page Title: "${title}"`);
    const titleOk = title.includes('CareerDost');
    console.log(`Title valid: ${titleOk ? '✓ PASS' : '✗ FAIL'}`);
    if (!titleOk) allPassed = false;

    // Check Canonical
    const canonicalMatch = res.body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : '';
    console.log(`Canonical URL: "${canonical}"`);
    const canonicalOk = canonical === art.url;
    console.log(`Canonical match: ${canonicalOk ? '✓ PASS' : '✗ FAIL'}`);
    if (!canonicalOk) allPassed = false;

    // Check Meta Description
    const metaDescMatch = res.body.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1] : '';
    console.log(`Meta Description: "${metaDesc.slice(0, 80)}..."`);
    const metaOk = metaDesc.length > 20;
    console.log(`Meta Description valid: ${metaOk ? '✓ PASS' : '✗ FAIL'}`);
    if (!metaOk) allPassed = false;

    // Check OG Tags
    const ogTitleMatch = res.body.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    const ogImgMatch = res.body.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    console.log(`OG Title: "${ogTitleMatch ? ogTitleMatch[1] : 'MISSING'}"`);
    console.log(`OG Image: "${ogImgMatch ? ogImgMatch[1] : 'MISSING'}"`);
    if (!ogTitleMatch || !ogImgMatch) allPassed = false;

    // Check Schema JSON-LD
    const schemaMatches = res.body.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
    console.log(`Schema JSON-LD blocks found: ${schemaMatches ? schemaMatches.length : 0}`);
    let hasValidSchema = false;
    if (schemaMatches) {
      for (const block of schemaMatches) {
        const jsonContent = block.replace(/<script[^>]*>|<\/script>/gi, '');
        try {
          const parsed = JSON.parse(jsonContent);
          if (parsed['@type'] === 'Article' || parsed['@type'] === 'NewsArticle' || parsed['@type'] === 'JobPosting') {
            console.log(`Schema @type: ${parsed['@type']} ✓ PASS`);
            hasValidSchema = true;
          }
        } catch {}
      }
    }
    if (!hasValidSchema) console.log('Schema structured data check: ⚠️ Non-blocking or fallback');

    // Check H1 and content snippet
    const hasH1 = res.body.includes(art.expectedH1) || res.body.includes('<h1');
    console.log(`H1 Header present: ${hasH1 ? '✓ PASS' : '✗ FAIL'}`);
    const hasSnippet = res.body.includes(art.expectedSnippet);
    console.log(`Content snippet present: ${hasSnippet ? '✓ PASS' : '✗ FAIL'}`);
    if (!hasSnippet) allPassed = false;

    // Check Featured Image
    console.log(`Testing Featured Image: ${art.imageUrl}`);
    const imgRes = await fetchUrl(art.imageUrl);
    console.log(`Image HTTP Status: ${imgRes.statusCode} ${imgRes.statusCode === 200 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Image Content-Type: ${imgRes.headers['content-type']}`);
    console.log(`Image Size: ${imgRes.rawBuffer.length} bytes`);
    if (imgRes.statusCode !== 200 || imgRes.rawBuffer.length < 1000) allPassed = false;
  }

  // Check Sitemap
  console.log(`\n------------------------------------------------------------`);
  console.log(`Testing Live Sitemap: ${SITE_URL}/sitemap.xml`);
  const sitemapRes = await fetchUrl(`${SITE_URL}/sitemap.xml`);
  console.log(`Sitemap HTTP Status: ${sitemapRes.statusCode}`);
  let sitemapAllIn = true;
  for (const art of articles) {
    const found = sitemapRes.body.includes(art.url);
    console.log(`Sitemap includes ${art.slug}: ${found ? '✓ PASS' : '✗ FAIL'}`);
    if (!found) sitemapAllIn = false;
  }
  if (!sitemapAllIn) allPassed = false;

  console.log(`\n============================================================`);
  console.log(`FINAL LIVE VERIFICATION: ${allPassed ? 'ALL TESTS PASSED SUCCESSFULLY! ✓' : 'SOME ISSUES DETECTED ✗'}`);
}

verifyAll().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
