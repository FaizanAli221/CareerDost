const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const Database = require('better-sqlite3');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

let JWT_SECRET = 'careerdost-admin-jwt-secret-key-prod-2026';
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const m = envContent.match(/ADMIN_JWT_SECRET=(.+)/);
  if (m) JWT_SECRET = m[1].trim();
}
const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, JWT_SECRET);

function fetchJson(urlPath) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'careerdost.blog',
      path: urlPath,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function checkLiveImage(imgUrl) {
  return new Promise((resolve) => {
    if (!imgUrl) return resolve({ status: 0, ok: false });
    const fullUrl = imgUrl.startsWith('http') ? imgUrl : `https://careerdost.blog${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
    const req = https.get(fullUrl, { method: 'HEAD' }, res => {
      resolve({ status: res.statusCode, ok: res.statusCode === 200 });
    });
    req.on('error', () => resolve({ status: 'ERR', ok: false }));
  });
}

async function runImageAudit() {
  console.log('=== COMPLETE MISSING-IMAGE RECOVERY AUDIT ===\n');

  const localDb = new Database('careerdost.sqlite');
  const localArticles = localDb.prepare('SELECT id, slug, title, featured_image FROM articles').all();
  const localUpdates = localDb.prepare('SELECT id, slug, title, featured_image FROM daily_updates').all();

  console.log(`Local SQLite: ${localArticles.length} articles, ${localUpdates.length} daily updates.`);

  const resArt = await fetchJson('/api/admin/articles');
  const d1Articles = resArt.data || resArt.articles || [];
  const resUpd = await fetchJson('/api/admin/updates');
  const d1Updates = resUpd.data || resUpd.updates || [];

  console.log(`Live D1: ${d1Articles.length} articles, ${d1Updates.length} daily updates.`);

  // Load previous backup if available
  let backupArticles = [];
  if (fs.existsSync('backups/careerdost_pre_recovery_1793378500892.sqlite')) {
    const bDb = new Database('backups/careerdost_pre_recovery_1793378500892.sqlite');
    backupArticles = bDb.prepare('SELECT id, slug, title, featured_image FROM articles').all();
    console.log(`Pre-recovery Backup SQLite: ${backupArticles.length} articles.`);
  }

  const pubImagesDir = path.resolve('public/images');
  const pubFiles = new Set(fs.existsSync(pubImagesDir) ? fs.readdirSync(pubImagesDir) : []);
  console.log(`Files present in public/images/: ${pubFiles.size}`);

  // Analyze all image references
  const allRefs = new Map(); // key: clean filename, value: { usedIn: [], existsInPublic: false, liveStatus: null }

  function recordRef(imgRef, sourceInfo) {
    if (!imgRef) {
      console.log(`[EMPTY FEATURED IMAGE] Source: ${sourceInfo}`);
      return;
    }
    const filename = path.basename(imgRef);
    if (!allRefs.has(filename)) {
      allRefs.set(filename, {
        originalRef: imgRef,
        filename: filename,
        sources: [],
        existsInPublic: pubFiles.has(filename),
        hasWebpEquivalent: pubFiles.has(filename.replace(/\.[a-z0-9]+$/i, '.webp')),
        hasJpgEquivalent: pubFiles.has(filename.replace(/\.[a-z0-9]+$/i, '.jpg')),
      });
    }
    allRefs.get(filename).sources.push(sourceInfo);
  }

  // Record from D1 articles
  d1Articles.forEach(a => recordRef(a.featured_image || a.featuredImage, `D1 Article: ${a.slug}`));
  // Record from D1 updates
  d1Updates.forEach(u => recordRef(u.featured_image || u.featuredImage, `D1 Update: ${u.slug}`));
  // Record from SQLite articles
  localArticles.forEach(a => recordRef(a.featured_image, `SQLite Article: ${a.slug}`));
  // Record from SQLite updates
  localUpdates.forEach(u => recordRef(u.featured_image, `SQLite Update: ${u.slug}`));

  console.log(`\nTotal unique image filenames referenced across all databases: ${allRefs.size}`);

  let missingInPublic = [];
  let presentInPublic = [];

  for (const [filename, info] of allRefs.entries()) {
    if (info.existsInPublic) {
      presentInPublic.push(info);
    } else {
      missingInPublic.push(info);
    }
  }

  console.log(`- Present in public/images/: ${presentInPublic.length}`);
  console.log(`- Missing in public/images/: ${missingInPublic.length}`);

  if (missingInPublic.length > 0) {
    console.log('\n--- DETAILED BREAKDOWN OF MISSING IMAGES ---');
    missingInPublic.forEach(m => {
      console.log(`Missing: ${m.filename}`);
      console.log(`  Original Ref: ${m.originalRef}`);
      console.log(`  Sources: ${m.sources.slice(0, 3).join(', ')}`);
      console.log(`  Has WebP fallback: ${m.hasWebpEquivalent}`);
      console.log(`  Has JPG fallback: ${m.hasJpgEquivalent}`);
    });
  }

  // Sample check live HTTP status of 20 images
  console.log('\n--- SAMPLING LIVE HTTP 200 ON PRODUCTION CDN ---');
  const sampleToCheck = Array.from(allRefs.values()).slice(0, 15);
  let liveOk = 0;
  let liveFail = 0;
  for (const item of sampleToCheck) {
    const live = await checkLiveImage(item.originalRef);
    if (live.ok) liveOk++;
    else liveFail++;
    console.log(`Live Check: ${item.originalRef} -> HTTP ${live.status} (${live.ok ? 'OK' : 'MISSING/FAIL'})`);
  }
  console.log(`Sample Live Result: ${liveOk} passed, ${liveFail} failed.`);
}

runImageAudit();
