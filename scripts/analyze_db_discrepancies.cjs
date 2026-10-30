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

const envContent = fs.readFileSync('.env.local', 'utf8');
const secret = envContent.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

const localDb = new Database('careerdost.sqlite');

function fetchJson(urlPath) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'careerdost.blog',
      path: urlPath,
      headers: { Authorization: 'Bearer ' + token }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d).data || JSON.parse(d)));
    }).on('error', reject);
  });
}

async function analyze() {
  console.log('=== EXACT RECONCILIATION: LOCAL SQLITE VS LIVE CLOUDFLARE D1 ===\n');

  const localArticles = localDb.prepare('SELECT id, slug, title, status, category_slug FROM articles').all();
  const localUpdates = localDb.prepare('SELECT id, slug, title, status, category FROM daily_updates').all();

  const d1Articles = await fetchJson('/api/admin/articles');
  const d1Updates = await fetchJson('/api/admin/updates');

  console.log(`Local SQLite: ${localArticles.length} articles (${localArticles.filter(a => a.status === 'published').length} published, ${localArticles.filter(a => a.status !== 'published').length} draft/archived)`);
  console.log(`Live D1:      ${d1Articles.length} articles (${d1Articles.filter(a => a.status === 'published').length} published, ${d1Articles.filter(a => a.status !== 'published').length} draft/archived)`);

  console.log(`\nLocal SQLite: ${localUpdates.length} daily updates (${localUpdates.filter(u => u.status === 'published').length} published, ${localUpdates.filter(u => u.status !== 'published').length} draft/archived)`);
  console.log(`Live D1:      ${d1Updates.length} daily updates (${d1Updates.filter(u => u.status === 'published').length} published, ${d1Updates.filter(u => u.status !== 'published').length} draft/archived)`);

  const localArtMap = new Map(localArticles.map(a => [a.slug, a]));
  const d1ArtMap = new Map(d1Articles.map(a => [a.slug, a]));

  const inLocalNotD1 = [];
  const inD1NotLocal = [];

  for (const [slug, a] of localArtMap.entries()) {
    if (!d1ArtMap.has(slug)) inLocalNotD1.push(a);
  }
  for (const [slug, a] of d1ArtMap.entries()) {
    if (!localArtMap.has(slug)) inD1NotLocal.push(a);
  }

  console.log('\n--- ARTICLES IN LOCAL SQLITE BUT NOT IN LIVE D1 ---');
  if (inLocalNotD1.length === 0) console.log('None.');
  else inLocalNotD1.forEach(a => console.log(`- [${a.status}] ID: ${a.id} | Slug: ${a.slug} | Title: ${a.title}`));

  console.log('\n--- ARTICLES IN LIVE D1 BUT NOT IN LOCAL SQLITE ---');
  if (inD1NotLocal.length === 0) console.log('None.');
  else inD1NotLocal.forEach(a => console.log(`- [${a.status}] ID: ${a.id} | Slug: ${a.slug} | Title: ${a.title}`));

  // Compare status of articles present in both
  const statusMismatches = [];
  for (const [slug, localArt] of localArtMap.entries()) {
    if (d1ArtMap.has(slug)) {
      const d1Art = d1ArtMap.get(slug);
      if (localArt.status !== d1Art.status) {
        statusMismatches.push({ slug, localStatus: localArt.status, d1Status: d1Art.status });
      }
    }
  }

  console.log('\n--- ARTICLE STATUS MISMATCHES (LOCAL VS D1) ---');
  if (statusMismatches.length === 0) console.log('None! All shared articles have identical status.');
  else statusMismatches.forEach(m => console.log(`- ${m.slug}: Local=${m.localStatus} vs D1=${m.d1Status}`));

  // Daily Updates reconciliation
  const localUpdMap = new Map(localUpdates.map(u => [u.slug, u]));
  const d1UpdMap = new Map(d1Updates.map(u => [u.slug, u]));

  const updInLocalNotD1 = [];
  const updInD1NotLocal = [];

  for (const [slug, u] of localUpdMap.entries()) {
    if (!d1UpdMap.has(slug)) updInLocalNotD1.push(u);
  }
  for (const [slug, u] of d1UpdMap.entries()) {
    if (!localUpdMap.has(slug)) updInD1NotLocal.push(u);
  }

  console.log('\n--- DAILY UPDATES IN LOCAL SQLITE BUT NOT IN LIVE D1 ---');
  if (updInLocalNotD1.length === 0) console.log('None.');
  else updInLocalNotD1.forEach(u => console.log(`- [${u.status}] ID: ${u.id} | Slug: ${u.slug} | Title: ${u.title}`));

  console.log('\n--- DAILY UPDATES IN LIVE D1 BUT NOT IN LOCAL SQLITE ---');
  if (updInD1NotLocal.length === 0) console.log('None.');
  else updInD1NotLocal.forEach(u => console.log(`- [${u.status}] ID: ${u.id} | Slug: ${u.slug} | Title: ${u.title}`));
}

analyze();
