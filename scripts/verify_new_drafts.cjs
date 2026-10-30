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

async function verifyDrafts() {
  console.log('=== VERIFYING CREATED DRAFTS ===\n');

  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  const targets = [
    'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online',
    'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online'
  ];

  for (const slug of targets) {
    console.log(`--- Checking Target: ${slug} ---`);
    const d1 = allD1.find(a => a.slug === slug);
    const local = localDb.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);

    console.log(`  D1 ID:       ${d1?.id} (Status: "${d1?.status}")`);
    console.log(`  SQLite ID:   ${local?.id} (Status: "${local?.status}")`);
    console.log(`  Title:       "${d1?.title}"`);
    console.log(`  SEO Title:   "${d1?.seoTitle}" (${d1?.seoTitle?.length} chars)`);
    console.log(`  Meta Desc:   "${d1?.metaDescription}" (${d1?.metaDescription?.length} chars)`);
    console.log(`  Last Date:   ${d1?.lastDate}`);
    console.log(`  Featured Img:${d1?.featuredImage}`);

    // Verify public endpoint returns 404 since it's draft
    const publicUrl = `https://careerdost.blog/jobs/${slug}`;
    const pubRes = await fetch(publicUrl, { headers: { 'Cache-Control': 'no-cache' } });
    console.log(`  Public URL HTTP Status: ${pubRes.status} (Expected 404 for unauthenticated draft)`);

    // Verify image files exist locally
    const imgWebp = `public${d1?.featuredImage}`;
    const imgJpg = `public${d1?.featuredImage.replace('.webp', '.jpg')}`;
    console.log(`  Local WebP Exists: ${fs.existsSync(imgWebp)}`);
    console.log(`  Local JPG Exists:  ${fs.existsSync(imgJpg)}\n`);
  }

  // Check sitemap
  const sitemapRes = await fetch('https://careerdost.blog/sitemap.xml', { headers: { 'Cache-Control': 'no-cache' } });
  const sitemapXml = await sitemapRes.text();
  for (const slug of targets) {
    const inSitemap = sitemapXml.includes(slug);
    console.log(`  Draft in Sitemap (${slug}): ${inSitemap} (Expected false)`);
  }
}

verifyDrafts().catch(console.error);
