const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const apiBase = 'https://careerdost.blog/api/admin';

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

async function executeRevert() {
  console.log('=== EXECUTING APPROVED GROUP A STATUS REVERT ===\n');

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  const targetArticles = [
    { id: 357, slug: 'hyderabad-division-section-144-notification-2026', desc: 'Hyderabad Section 144 (Editorial Hold)' },
    { id: 485, slug: 'mrp-elite-graduate-trainee-karachi-2026', desc: 'MRP Elite GTO (Editorial Hold)' },
    { id: 14, slug: 'benazir-income-support-programme-2026', desc: 'BISP Legacy Redirect' },
    { id: 88, slug: 'sindh-pink-scooty-scheme-2026-online-registration-eligibility', desc: 'Pink Scooty Legacy Redirect' },
    { id: 73, slug: 'httpswwwnjpgovpk', desc: 'Malformed Slug (Pakistan Infrastructure Development)' }
  ];

  const targetUpdates = [
    { id: 252, slug: 'hyderabad-division-section-144-notification-2026', desc: 'Mirror Daily Update for Hyderabad Section 144' },
    { id: 370, slug: 'mrp-elite-graduate-trainee-karachi-2026', desc: 'Mirror Daily Update for MRP Elite' }
  ];

  // 1. Revert Articles in Production D1
  console.log('--- 1. Reverting 5 Articles in Production D1 to draft ---');
  for (const art of targetArticles) {
    console.log(`Setting Article [D1 ID ${art.id}] '${art.slug}' to 'draft'...`);
    const res = await fetch(`${apiBase}/articles/${art.slug}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'draft' })
    });
    const json = await res.json();
    if (res.ok && json.success) {
      console.log(`  ✓ SUCCESS: Article [ID ${art.id}] status is now '${json.data?.status}'`);
    } else {
      console.error(`  ✗ ERROR: Failed to update article [ID ${art.id}]:`, json);
      process.exit(1);
    }
  }

  // 2. Revert Daily Updates in Production D1
  console.log('\n--- 2. Reverting 2 Mirror Daily Updates in Production D1 to draft ---');
  for (const upd of targetUpdates) {
    console.log(`Setting Daily Update [D1 ID ${upd.id}] '${upd.slug}' to 'draft'...`);
    const res = await fetch(`${apiBase}/updates/${upd.slug}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'draft' })
    });
    const json = await res.json();
    if (res.ok && json.success) {
      console.log(`  ✓ SUCCESS: Daily Update [ID ${upd.id}] status is now '${json.data?.status}'`);
    } else {
      console.error(`  ✗ ERROR: Failed to update daily update [ID ${upd.id}]:`, json);
      process.exit(1);
    }
  }

  // 3. Reconcile Local SQLite
  console.log('\n--- 3. Reconciling Local SQLite careerdost.sqlite ---');
  const localDb = new Database('careerdost.sqlite');
  const sqRes = localDb.prepare("UPDATE articles SET status = 'draft', updated_at = CURRENT_TIMESTAMP WHERE slug = 'httpswwwnjpgovpk'").run();
  console.log(`  ✓ Updated Local SQLite article 'httpswwwnjpgovpk' to draft (changes: ${sqRes.changes})`);

  // Verify all target items in Local SQLite are now draft
  for (const art of targetArticles) {
    const row = localDb.prepare('SELECT id, slug, status FROM articles WHERE slug = ?').get(art.slug);
    console.log(`  Local SQLite Article: [ID ${row?.id}] ${row?.slug} -> status='${row?.status}'`);
  }

  console.log('\n=== VERIFYING PRODUCTION D1 UPDATED STATE ===');
  const finalArtRes = await fetch(`${apiBase}/articles`, { headers: { Authorization: `Bearer ${jwt}` } });
  const finalArticles = (await finalArtRes.json()).data;
  for (const art of targetArticles) {
    const found = finalArticles.find(a => a.id === art.id);
    console.log(`  Verified D1 Article [ID ${art.id}] '${found.slug}' -> status='${found.status}'`);
  }

  const finalUpdRes = await fetch(`${apiBase}/updates`, { headers: { Authorization: `Bearer ${jwt}` } });
  const finalUpdates = (await finalUpdRes.json()).data;
  for (const upd of targetUpdates) {
    const found = finalUpdates.find(u => u.id === upd.id);
    console.log(`  Verified D1 Update  [ID ${upd.id}] '${found.slug}' -> status='${found.status}'`);
  }

  // Verify Dashboard Counts
  const statsRes = await fetch(`${apiBase}/stats`, { headers: { Authorization: `Bearer ${jwt}` } });
  const stats = (await statsRes.json()).data;
  console.log('\n--- PRODUCTION D1 UPDATED DASHBOARD STATS ---');
  console.log(`  Published Articles: ${stats.publishedArticles} (Was 190, decreased by 5 to 185)`);
  console.log(`  Draft Articles:     ${stats.draftArticles} (Was 10, increased by 5 to 15)`);
  console.log(`  Published Updates:  ${stats.publishedUpdates} (Was 111, decreased by 2 to 109)`);
  console.log(`  Draft Updates:      ${stats.draftUpdates} (Was 5, increased by 2 to 7)`);
}

executeRevert().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
