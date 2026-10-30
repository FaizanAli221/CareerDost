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

async function inspectTargets() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status}`);
  }
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  const slugs = [
    'phsa-paramedic-general-list-2026',
    'sindh-wheat-subsidy-benazir-hari-card-2026',
    'bank-of-punjab-karachi-manager-jobs-2026'
  ];

  for (const slug of slugs) {
    console.log(`\n=================== SLUG: ${slug} ===================`);
    const art = allD1.find(a => a.slug === slug);
    const local = localDb.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
    if (!art) {
      console.log('Not found in D1!');
      continue;
    }
    console.log(`D1 ID: ${art.id} | Local ID: ${local?.id}`);
    console.log(`Title: ${art.title}`);
    console.log(`SEO Title: ${art.seoTitle}`);
    console.log(`Meta Desc: ${art.metaDescription}`);
    console.log(`Last Date: ${art.lastDate}`);
    console.log(`Status: ${art.status}`);
    console.log(`Official Link: ${art.officialLink}`);
    console.log(`Apply Link: ${art.applyLink}`);
    console.log(`Positions: ${art.positions}`);
    console.log(`Organization: ${art.organization}`);
    console.log(`Content items count: ${Array.isArray(art.content) ? art.content.length : typeof art.content}`);
    if (Array.isArray(art.content)) {
      art.content.forEach((c, idx) => {
        console.log(`\n--- Content [${idx}] (length ${c.length}):\n${c}\n`);
      });
    } else {
      console.log(`Raw Content:`, art.content);
    }
  }
}

inspectTargets().catch(console.error);
