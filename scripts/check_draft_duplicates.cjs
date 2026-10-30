const fs = require('fs');
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

async function checkDuplicates() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  console.log(`Total D1 records: ${allD1.length}`);

  const searchKeywords = [
    'foreign', 'mofa', 'nhmp', 'motorway', 'patrol', 'highway'
  ];

  console.log('\n=== CHECKING D1 FOR DUPLICATES ===');
  for (const art of allD1) {
    const text = (art.title + ' ' + art.slug + ' ' + (art.organization || '')).toLowerCase();
    for (const kw of searchKeywords) {
      if (text.includes(kw)) {
        console.log(`[D1 Match - "${kw}"] ID: ${art.id} | Status: ${art.status} | Slug: ${art.slug} | Title: "${art.title}"`);
        break;
      }
    }
  }

  console.log('\n=== CHECKING LOCAL SQLITE FOR DUPLICATES ===');
  const localMatches = localDb.prepare(`
    SELECT id, slug, title, status FROM articles
    WHERE lower(title) LIKE '%foreign%' OR lower(title) LIKE '%mofa%'
       OR lower(title) LIKE '%nhmp%' OR lower(title) LIKE '%motorway%'
       OR lower(title) LIKE '%patrol%' OR lower(slug) LIKE '%foreign%'
       OR lower(slug) LIKE '%nhmp%' OR lower(slug) LIKE '%motorway%'
  `).all();

  for (const row of localMatches) {
    console.log(`[SQLite Match] ID: ${row.id} | Status: ${row.status} | Slug: ${row.slug} | Title: "${row.title}"`);
  }
}

checkDuplicates().catch(console.error);
