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

async function deepAudit() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  const targets = [
    { slug: 'ogra-balochistan-jobs-2026-apply-online-njp', name: '1. OGRA Balochistan Jobs 2026' },
    { slug: 'cabinet-division-staff-car-driver-jobs-bps-04-2026', name: '2. Cabinet Division Driver Jobs 2026' },
    { slug: 'hec-balochistan-jobs-2026-accountant-ldc-njp', name: '3. HEC Balochistan Jobs 2026' },
    { slug: 'ministry-of-planning-jobs-2026-accountant-aps-pps-6', name: '4. Ministry of Planning Jobs 2026' },
    { slug: 'ntc-jobs-2026-balochistan-assistant-divisional-engineer-aps', name: '5. NTC Balochistan Jobs 2026' },
    { slug: 'nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider', name: '6. NEPRA Balochistan Jobs 2026' },
    { slug: 'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables', name: '7. Punjab Police Constable Jobs 2026' },
    { slug: 'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online', name: '8. Ministry of Foreign Affairs Jobs 2026' },
    { slug: 'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online', name: '9. NHMP Junior Patrol Officer Jobs 2026' },
    { slug: 'pakistan-railways-balochistan-quota-jobs-2026-njp', name: 'EXCLUDED: Pakistan Railways Balochistan' }
  ];

  for (const t of targets) {
    const art = allD1.find(a => a.slug === t.slug);
    const loc = localDb.prepare('SELECT id, slug, status FROM articles WHERE slug = ?').get(t.slug);
    console.log(`\n======================================================`);
    console.log(`[${t.name}]`);
    console.log(`Slug: ${t.slug}`);
    if (!art) {
      console.log('NOT FOUND IN D1!');
      continue;
    }
    console.log(`D1 ID: ${art.id} | D1 Status: ${art.status} | Local Status: ${loc ? loc.status : 'NOT FOUND'}`);
    console.log(`Title: "${art.title}"`);
    console.log(`SEO Title: "${art.seoTitle}" (${art.seoTitle?.length} chars)`);
    console.log(`Meta Desc: "${art.metaDescription}" (${art.metaDescription?.length} chars)`);
    console.log(`Last Date: "${art.lastDate}"`);
    console.log(`Featured Image: "${art.featuredImage}"`);
    console.log(`Image Alt: "${art.imageAlt}"`);
    console.log(`Official Link: "${art.officialLink}"`);
    console.log(`Apply Link: "${art.applyLink}"`);
    console.log(`Content items count: ${Array.isArray(art.content) ? art.content.length : typeof art.content}`);

    // Check image HTTP status
    let imgUrl = art.featuredImage;
    if (imgUrl.startsWith('/')) {
      imgUrl = 'https://careerdost.blog' + imgUrl;
    }
    try {
      const imgRes = await fetch(imgUrl);
      console.log(`Featured Image Live HTTP: ${imgRes.status} ${imgRes.statusText} (${imgRes.headers.get('content-type')})`);
    } catch (e) {
      console.log(`Featured Image Live HTTP ERROR: ${e.message}`);
    }

    // Check public page HTTP status
    const pubUrl = `https://careerdost.blog/jobs/${art.slug}`;
    const pubRes = await fetch(pubUrl);
    console.log(`Public Page Live HTTP: ${pubRes.status} ${pubRes.statusText}`);
  }
}

deepAudit().catch(console.error);
