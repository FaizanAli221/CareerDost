const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

function base64UrlEncode(strOrBuffer) {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateJwt(admin, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encHeader}.${encPayload}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest());
  return `${dataToSign}.${signature}`;
}

async function auditParity() {
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  const artRes = await fetch('https://careerdost.blog/api/admin/articles', { headers: { Authorization: 'Bearer ' + jwt } });
  const d1Articles = (await artRes.json()).data;

  const updRes = await fetch('https://careerdost.blog/api/admin/updates', { headers: { Authorization: 'Bearer ' + jwt } });
  const d1Updates = (await updRes.json()).data;

  const localDb = new Database('careerdost.sqlite');
  const localArticles = localDb.prepare('SELECT id, slug, title, status FROM articles').all();
  const localUpdates = localDb.prepare('SELECT id, slug, title, status FROM daily_updates').all();

  console.log('=== ARTICLES PARITY AUDIT ===');
  console.log(`Production D1 Total Articles: ${d1Articles.length} (Published: ${d1Articles.filter(a => a.status === 'published').length}, Draft: ${d1Articles.filter(a => a.status === 'draft').length})`);
  console.log(`Local SQLite Total Articles:  ${localArticles.length} (Published: ${localArticles.filter(a => a.status === 'published').length}, Draft: ${localArticles.filter(a => a.status === 'draft').length})`);

  // Check matching by slug
  const d1ArtMap = new Map(d1Articles.map(a => [a.slug, a]));
  const localArtMap = new Map(localArticles.map(a => [a.slug, a]));

  const artStatusMismatches = [];
  const localOnlyArticles = [];
  const d1OnlyArticles = [];

  for (const la of localArticles) {
    const da = d1ArtMap.get(la.slug);
    if (!da) {
      localOnlyArticles.push(la);
    } else if (la.status !== da.status) {
      artStatusMismatches.push({ slug: la.slug, localId: la.id, d1Id: da.id, localStatus: la.status, d1Status: da.status });
    }
  }

  for (const da of d1Articles) {
    if (!localArtMap.has(da.slug)) {
      d1OnlyArticles.push(da);
    }
  }

  console.log(`\nArticles Status Mismatches (by slug match): ${artStatusMismatches.length}`);
  for (const m of artStatusMismatches) {
    console.log(`  - [Local ID ${m.localId} / D1 ID ${m.d1Id}] ${m.slug}: Local='${m.localStatus}' vs D1='${m.d1Status}'`);
  }

  console.log(`\nLocal-Only Articles: ${localOnlyArticles.length}`);
  for (const lo of localOnlyArticles) {
    console.log(`  - [Local ID ${lo.id}] '${lo.slug}' (status: ${lo.status}) - ${lo.title}`);
  }

  console.log(`\nD1-Only Articles: ${d1OnlyArticles.length}`);
  for (const d1o of d1OnlyArticles) {
    console.log(`  - [D1 ID ${d1o.id}] '${d1o.slug}' (status: ${d1o.status}) - ${d1o.title}`);
  }

  console.log('\n=== DAILY UPDATES PARITY AUDIT ===');
  console.log(`Production D1 Total Updates: ${d1Updates.length} (Published: ${d1Updates.filter(u => u.status === 'published').length}, Draft: ${d1Updates.filter(u => u.status === 'draft').length})`);
  console.log(`Local SQLite Total Updates:  ${localUpdates.length} (Published: ${localUpdates.filter(u => u.status === 'published').length}, Draft: ${localUpdates.filter(u => u.status === 'draft').length})`);

  const d1UpdMap = new Map(d1Updates.map(u => [u.slug, u]));
  const localUpdMap = new Map(localUpdates.map(u => [u.slug, u]));

  const updStatusMismatches = [];
  const localOnlyUpdates = [];
  const d1OnlyUpdates = [];

  for (const lu of localUpdates) {
    const du = d1UpdMap.get(lu.slug);
    if (!du) {
      localOnlyUpdates.push(lu);
    } else if (lu.status !== du.status) {
      updStatusMismatches.push({ slug: lu.slug, localId: lu.id, d1Id: du.id, localStatus: lu.status, d1Status: du.status });
    }
  }

  for (const du of d1Updates) {
    if (!localUpdMap.has(du.slug)) {
      d1OnlyUpdates.push(du);
    }
  }

  console.log(`\nDaily Updates Status Mismatches (by slug match): ${updStatusMismatches.length}`);
  for (const m of updStatusMismatches) {
    console.log(`  - [Local ID ${m.localId} / D1 ID ${m.d1Id}] ${m.slug}: Local='${m.localStatus}' vs D1='${m.d1Status}'`);
  }

  console.log(`\nLocal-Only Daily Updates: ${localOnlyUpdates.length}`);
  for (const lo of localOnlyUpdates) {
    console.log(`  - [Local ID ${lo.id}] '${lo.slug}' (status: ${lo.status}) - ${lo.title}`);
  }

  console.log(`\nD1-Only Daily Updates: ${d1OnlyUpdates.length}`);
  for (const d1o of d1OnlyUpdates) {
    console.log(`  - [D1 ID ${d1o.id}] '${d1o.slug}' (status: ${d1o.status}) - ${d1o.title}`);
  }
}

auditParity().catch(console.error);
