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

async function detailedParityAudit() {
  console.log('=== DETAILED FIELD-BY-FIELD DATABASE PARITY AUDIT ===\n');

  const localArticles = localDb.prepare('SELECT id, slug, status, featured_image FROM articles').all();
  const localUpdates = localDb.prepare('SELECT id, slug, status, featured_image FROM daily_updates').all();

  const d1Articles = await fetchJson('/api/admin/articles');
  const d1Updates = await fetchJson('/api/admin/updates');

  console.log(`Local SQLite: ${localArticles.length} articles, ${localUpdates.length} updates`);
  console.log(`Live D1:      ${d1Articles.length} articles, ${d1Updates.length} updates\n`);

  // 1. Article Duplicate Slugs & IDs
  const localArtSlugs = new Set();
  const localArtDupes = [];
  localArticles.forEach(a => {
    if (localArtSlugs.has(a.slug)) localArtDupes.push(a.slug);
    localArtSlugs.add(a.slug);
  });

  const d1ArtSlugs = new Set();
  const d1ArtDupes = [];
  d1Articles.forEach(a => {
    if (d1ArtSlugs.has(a.slug)) d1ArtDupes.push(a.slug);
    d1ArtSlugs.add(a.slug);
  });

  console.log(`Duplicate Article Slugs in SQLite: ${localArtDupes.length}`);
  console.log(`Duplicate Article Slugs in Live D1: ${d1ArtDupes.length}`);

  // 2. Field Comparison for Articles
  const d1ArtBySlug = new Map(d1Articles.map(a => [a.slug, a]));
  const localArtBySlug = new Map(localArticles.map(a => [a.slug, a]));

  const missingArticlesInD1 = [];
  const missingArticlesInLocal = [];
  const articleStatusMismatches = [];
  const articleImageMismatches = [];
  const articleIdMismatches = [];

  for (const [slug, localA] of localArtBySlug.entries()) {
    if (!d1ArtBySlug.has(slug)) {
      missingArticlesInD1.push(localA);
    } else {
      const d1A = d1ArtBySlug.get(slug);
      if (localA.status !== d1A.status) {
        articleStatusMismatches.push({ slug, localStatus: localA.status, d1Status: d1A.status });
      }
      const localImg = (localA.featured_image || '').trim();
      const d1Img = (d1A.featured_image || d1A.featuredImage || '').trim();
      if (localImg !== d1Img) {
        articleImageMismatches.push({ slug, localImg, d1Img });
      }
      if (localA.id !== d1A.id) {
        articleIdMismatches.push({ slug, localId: localA.id, d1Id: d1A.id });
      }
    }
  }

  for (const [slug, d1A] of d1ArtBySlug.entries()) {
    if (!localArtBySlug.has(slug)) {
      missingArticlesInLocal.push(d1A);
    }
  }

  console.log('\n--- ARTICLE AUDIT RESULTS ---');
  console.log(`Articles in SQLite but missing in D1: ${missingArticlesInD1.length}`);
  missingArticlesInD1.forEach(a => console.log(`  - [${a.status}] slug: ${a.slug} (ID: ${a.id})`));

  console.log(`Articles in D1 but missing in SQLite: ${missingArticlesInLocal.length}`);
  missingArticlesInLocal.forEach(a => console.log(`  - [${a.status}] slug: ${a.slug} (ID: ${a.id})`));

  console.log(`Article Status Mismatches: ${articleStatusMismatches.length}`);
  articleStatusMismatches.forEach(m => console.log(`  - ${m.slug}: SQLite=${m.localStatus} vs D1=${m.d1Status}`));

  console.log(`Article Featured Image Mismatches: ${articleImageMismatches.length}`);
  articleImageMismatches.forEach(m => console.log(`  - ${m.slug}: SQLite=${m.localImg} vs D1=${m.d1Img}`));

  console.log(`Article ID Differences (due to independent sequence counters): ${articleIdMismatches.length}`);
  if (articleIdMismatches.length > 0) {
    console.log(`  - Sample ID differences (first 5):`, articleIdMismatches.slice(0, 5));
  }

  // 3. Daily Updates Comparison
  const localUpdSlugs = new Set();
  const localUpdDupes = [];
  localUpdates.forEach(u => {
    if (localUpdSlugs.has(u.slug)) localUpdDupes.push(u.slug);
    localUpdSlugs.add(u.slug);
  });

  const d1UpdSlugs = new Set();
  const d1UpdDupes = [];
  d1Updates.forEach(u => {
    if (d1UpdSlugs.has(u.slug)) d1UpdDupes.push(u.slug);
    d1UpdSlugs.add(u.slug);
  });

  console.log(`\nDuplicate Update Slugs in SQLite: ${localUpdDupes.length}`);
  console.log(`Duplicate Update Slugs in Live D1: ${d1UpdDupes.length}`);

  const d1UpdBySlug = new Map(d1Updates.map(u => [u.slug, u]));
  const localUpdBySlug = new Map(localUpdates.map(u => [u.slug, u]));

  const missingUpdatesInD1 = [];
  const missingUpdatesInLocal = [];
  const updateStatusMismatches = [];
  const updateImageMismatches = [];
  const updateIdMismatches = [];

  for (const [slug, localU] of localUpdBySlug.entries()) {
    if (!d1UpdBySlug.has(slug)) {
      missingUpdatesInD1.push(localU);
    } else {
      const d1U = d1UpdBySlug.get(slug);
      if (localU.status !== d1U.status) {
        updateStatusMismatches.push({ slug, localStatus: localU.status, d1Status: d1U.status });
      }
      const localImg = (localU.featured_image || '').trim();
      const d1Img = (d1U.featured_image || d1U.featuredImage || '').trim();
      if (localImg !== d1Img) {
        updateImageMismatches.push({ slug, localImg, d1Img });
      }
      if (localU.id !== d1U.id) {
        updateIdMismatches.push({ slug, localId: localU.id, d1Id: d1U.id });
      }
    }
  }

  for (const [slug, d1U] of d1UpdBySlug.entries()) {
    if (!localUpdBySlug.has(slug)) {
      missingUpdatesInLocal.push(d1U);
    }
  }

  console.log('\n--- DAILY UPDATES AUDIT RESULTS ---');
  console.log(`Updates in SQLite but missing in D1: ${missingUpdatesInD1.length}`);
  missingUpdatesInD1.forEach(u => console.log(`  - [${u.status}] slug: ${u.slug} (ID: ${u.id})`));

  console.log(`Updates in D1 but missing in SQLite: ${missingUpdatesInLocal.length}`);
  missingUpdatesInLocal.forEach(u => console.log(`  - [${u.status}] slug: ${u.slug} (ID: ${u.id})`));

  console.log(`Update Status Mismatches: ${updateStatusMismatches.length}`);
  updateStatusMismatches.forEach(m => console.log(`  - ${m.slug}: SQLite=${m.localStatus} vs D1=${m.d1Status}`));

  console.log(`Update Featured Image Mismatches: ${updateImageMismatches.length}`);
  updateImageMismatches.forEach(m => console.log(`  - ${m.slug}: SQLite=${m.localImg} vs D1=${m.d1Img}`));

  console.log(`Update ID Differences: ${updateIdMismatches.length}`);
  if (updateIdMismatches.length > 0) {
    console.log(`  - Sample ID differences (first 5):`, updateIdMismatches.slice(0, 5));
  }
}

detailedParityAudit();
