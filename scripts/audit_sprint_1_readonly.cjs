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

async function auditSprint1() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', { headers: { Authorization: 'Bearer ' + token } });
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  const slugs = [
    'phsa-paramedic-general-list-2026',
    'ezy-business-applications-paid-internship-karachi-2026',
    'nts-nat-xi-2026-november-registration-guide',
    'memon-college-of-nursing-karachi-bsn-admissions-2026-27',
    'bank-of-punjab-karachi-manager-jobs-2026',
    'sindh-courts-bps-1-4-jobs-2026',
    'sindh-wheat-subsidy-benazir-hari-card-2026',
    'sindh-government-jobs-2026-spsc-sts-vacancies-apply-online'
  ];

  console.log('=== POINT 4: TITLE & TAG AUDIT ACROSS ALL 8 PAGES ===\n');

  for (const slug of slugs) {
    const d1Art = allD1.find(a => a.slug === slug);
    const localArt = localDb.prepare('SELECT id, slug, title, seo_title, og_title, meta_description, last_date, updated_at FROM articles WHERE slug = ?').get(slug);

    const url = `https://careerdost.blog/jobs/${slug}`;
    const httpRes = await fetch(url);
    const rawHtml = await httpRes.text();

    const titleMatch = rawHtml.match(/<title>([^<]*)<\/title>/i);
    const rawTitle = titleMatch ? titleMatch[1].trim() : 'NONE';

    const ogTitleMatch = rawHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                         rawHtml.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : 'NONE';

    const metaDescMatch = rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                          rawHtml.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : 'NONE';

    const h1Match = rawHtml.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : 'NONE';

    console.log(`--- [Slug: ${slug}] (D1 ID: ${d1Art?.id} | Local ID: ${localArt?.id}) ---`);
    console.log(`  1. Stored SEO Title (D1):      "${d1Art?.seoTitle}" (${d1Art?.seoTitle?.length} chars)`);
    console.log(`  2. Stored SEO Title (SQLite):  "${localArt?.seo_title}" (${localArt?.seo_title?.length} chars)`);
    console.log(`  3. Raw HTTP <title>:           "${rawTitle}" (${rawTitle.length} chars)`);
    console.log(`  4. Open Graph og:title:        "${ogTitle}" (${ogTitle.length} chars)`);
    console.log(`  5. Raw HTTP H1:                "${h1}"`);
    console.log(`  6. Meta Description:           "${metaDesc.slice(0, 90)}..." (${metaDesc.length} chars)`);
    console.log(`  7. Last Date in D1:            "${d1Art?.lastDate}"\n`);
  }
}

auditSprint1().catch(console.error);
