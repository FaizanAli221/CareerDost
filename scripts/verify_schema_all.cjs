const https = require('https');

const slugs = [
  'sindh-government-graduate-internship-program-2026',
  'kp-government-20000-paid-internships-2026',
  'gates-cambridge-scholarship-2027'
];

async function check(slug) {
  return new Promise(resolve => {
    https.get(`https://careerdost.blog/jobs/${slug}`, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const regex = /<script[^>]*id="page-jsonld"[^>]*>([\s\S]*?)<\/script>/i;
        const match = regex.exec(data);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            console.log(`[PASS] ${slug} -> Schema Type: ${parsed['@graph'][0]['@type']}`);
          } catch {
            console.log(`[FAIL] ${slug} -> Schema Parse Error`);
          }
        } else {
          console.log(`[FAIL] ${slug} -> Schema Script Tag Missing`);
        }
        resolve();
      });
    });
  });
}

async function run() {
  for (const s of slugs) {
    await check(s);
  }
}

run();
