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

async function checkArticles() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  console.log('--- Checking IDs 540 to 555 in D1 ---');
  for (let id = 540; id <= 555; id++) {
    const d1 = allD1.find(a => a.id === id);
    const loc = localDb.prepare('SELECT id, slug, status, title FROM articles WHERE id = ?').get(id);
    if (d1 || loc) {
      console.log(`ID ${id}:`);
      if (d1) console.log(`  D1:     status=${d1.status} | slug=${d1.slug} | title="${d1.title}"`);
      else console.log(`  D1:     NOT FOUND`);
      if (loc) console.log(`  SQLite: status=${loc.status} | slug=${loc.slug} | title="${loc.title}"`);
      else console.log(`  SQLite: NOT FOUND`);
    }
  }

  console.log('\n--- Checking all articles related to Pakistan Railways / Quetta ---');
  const rwD1 = allD1.filter(a => (a.slug + ' ' + a.title).toLowerCase().includes('railway') || (a.slug + ' ' + a.title).toLowerCase().includes('quetta'));
  rwD1.forEach(a => {
    console.log(`D1 ID: ${a.id} | status=${a.status} | slug=${a.slug} | title="${a.title}"`);
  });

  console.log('\n--- Checking all drafts in D1 ---');
  const draftsD1 = allD1.filter(a => a.status === 'draft');
  draftsD1.forEach(a => {
    console.log(`Draft D1 ID: ${a.id} | slug=${a.slug} | title="${a.title}"`);
  });
}

checkArticles().catch(console.error);
