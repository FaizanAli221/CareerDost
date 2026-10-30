const fs = require('fs');
const Database = require('better-sqlite3');
const https = require('https');
const crypto = require('crypto');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

const localDb = new Database('careerdost.sqlite');

// 1. Local SQLite statistics
const localTotalArticles = localDb.prepare('SELECT count(*) as count FROM articles').get().count;
const localPublishedArticles = localDb.prepare("SELECT count(*) as count FROM articles WHERE status = 'published'").get().count;
const localDraftArticles = localDb.prepare("SELECT count(*) as count FROM articles WHERE status != 'published'").get().count;

const localTotalUpdates = localDb.prepare('SELECT count(*) as count FROM daily_updates').get().count;
const localPublishedUpdates = localDb.prepare("SELECT count(*) as count FROM daily_updates WHERE status = 'published'").get().count;
const localDraftUpdates = localDb.prepare("SELECT count(*) as count FROM daily_updates WHERE status != 'published'").get().count;

console.log('=== LOCAL SQLITE DATABASE INTEGRITY ===');
console.log(`Articles: Total=${localTotalArticles}, Published=${localPublishedArticles}, Draft/Other=${localDraftArticles}`);
console.log(`Updates: Total=${localTotalUpdates}, Published=${localPublishedUpdates}, Draft/Other=${localDraftUpdates}`);

// Check for duplicate slugs
const duplicateArticleSlugs = localDb.prepare('SELECT slug, count(*) as count FROM articles GROUP BY slug HAVING count > 1').all();
console.log('Duplicate article slugs in local SQLite:', duplicateArticleSlugs);

const duplicateUpdateSlugs = localDb.prepare('SELECT slug, count(*) as count FROM daily_updates GROUP BY slug HAVING count > 1').all();
console.log('Duplicate update slugs in local SQLite:', duplicateUpdateSlugs);

// Check 3 guides
const guideSlugs = [
  'spsc-exam-preparation-screening-challan-guide',
  'fpsc-online-application-challan-form-32a-guide',
  'national-job-portal-njp-pakistan-application-guide'
];

guideSlugs.forEach(slug => {
  const g = localDb.prepare('SELECT id, title, slug, status, category_slug, official_link, apply_link FROM articles WHERE slug = ?').get(slug);
  console.log(`Guide: ${slug} | ID: ${g ? g.id : 'MISSING'} | Status: ${g ? g.status : 'N/A'} | Category: ${g ? g.category_slug : 'N/A'}`);
});

// 2. Live Cloudflare D1 verification via Admin API
let JWT_SECRET = 'careerdost-admin-jwt-secret-key-prod-2026';
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const m = envContent.match(/ADMIN_JWT_SECRET=(.+)/);
  if (m) JWT_SECRET = m[1].trim();
}

const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, JWT_SECRET);

function fetchD1(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'careerdost.blog',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.slice(0, 100)}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function verifyLiveD1() {
  console.log('\n=== LIVE CLOUDFLARE D1 DATABASE INTEGRITY ===');
  try {
    const resArticles = await fetchD1('/api/admin/articles');
    const liveArticles = resArticles.data || resArticles.articles || resArticles;

    const resUpdates = await fetchD1('/api/admin/updates');
    const liveUpdates = resUpdates.data || resUpdates.updates || resUpdates;

    if (!Array.isArray(liveArticles)) {
      console.log('liveArticles is not an array:', resArticles);
      return;
    }

    console.log(`Live D1 Articles: Total fetched = ${liveArticles.length}`);
    const livePublishedArticles = liveArticles.filter(a => a.status === 'published').length;
    console.log(`Live D1 Published Articles = ${livePublishedArticles}`);

    console.log(`Live D1 Updates: Total fetched = ${liveUpdates.length}`);
    const livePublishedUpdates = liveUpdates.filter(u => u.status === 'published').length;
    console.log(`Live D1 Published Updates = ${livePublishedUpdates}`);

    // Check 3 guides on live D1
    guideSlugs.forEach(slug => {
      const g = liveArticles.find(a => a.slug === slug);
      console.log(`Live D1 Guide [${slug}]: Found=${!!g}, ID=${g ? g.id : 'N/A'}, Status=${g ? g.status : 'N/A'}, Category=${g ? (g.category_slug || g.category) : 'N/A'}`);
    });

    // Check for parity discrepancies
    const localSlugs = new Set(localDb.prepare('SELECT slug FROM articles').all().map(r => r.slug));
    const liveSlugs = new Set(liveArticles.map(a => a.slug));
    
    let missingInLive = 0;
    localSlugs.forEach(s => {
      if (!liveSlugs.has(s)) {
        console.log(`Discrepancy: ${s} present in SQLite but missing in D1`);
        missingInLive++;
      }
    });

    let missingInLocal = 0;
    liveSlugs.forEach(s => {
      if (!localSlugs.has(s)) {
        console.log(`Discrepancy: ${s} present in D1 but missing in SQLite`);
        missingInLocal++;
      }
    });

    console.log(`Parity Summary: Missing in Live D1 = ${missingInLive}, Missing in Local SQLite = ${missingInLocal}`);
  } catch (err) {
    console.error('Error fetching live D1:', err.message);
  }
}

verifyLiveD1();
