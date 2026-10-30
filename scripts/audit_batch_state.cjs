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

async function auditAllBatch() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  const sitemapRes = await fetch('https://careerdost.blog/sitemap.xml');
  const sitemapXml = await sitemapRes.text();

  console.log('=== AUDIT OF ALL ARTICLES FROM ID 535 TO 552 ===\n');

  for (let id = 535; id <= 552; id++) {
    const d1 = allD1.find(a => a.id === id);
    if (!d1) continue;
    const loc = localDb.prepare('SELECT id, slug, status FROM articles WHERE slug = ?').get(d1.slug);
    const pubUrl = `https://careerdost.blog/jobs/${d1.slug}`;
    const httpRes = await fetch(pubUrl);
    const inSitemap = sitemapXml.includes(d1.slug);

    console.log(`D1 ID ${d1.id} | Slug: ${d1.slug}`);
    console.log(`  Title:        "${d1.title}"`);
    console.log(`  D1 Status:    ${d1.status} | Local Status: ${loc ? loc.status : 'NOT IN SQLITE'}`);
    console.log(`  Public HTTP:  ${httpRes.status} ${httpRes.statusText}`);
    console.log(`  In Sitemap:   ${inSitemap}`);
    console.log(`  Featured Img: ${d1.featuredImage}\n`);
  }
}

auditAllBatch().catch(console.error);
