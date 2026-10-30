const Database = require('better-sqlite3');
const https = require('https');
const db = new Database('careerdost.sqlite');

const rows = db.prepare("SELECT slug, title FROM articles WHERE content LIKE '%Application Window Closed%' AND slug NOT LIKE '%systems-limited%' LIMIT 10 OFFSET 5").all();

function testUrl(slug) {
  return new Promise(resolve => {
    https.get(`https://careerdost.blog/jobs/${slug}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasClosed = /closed|concluded|expired|window closed/i.test(data);
        console.log(`[HTTP ${res.statusCode}] /jobs/${slug} -> Has closed notice: ${hasClosed}`);
        resolve();
      });
    });
  });
}

(async () => {
  for (const r of rows) {
    await testUrl(r.slug);
  }
})();
