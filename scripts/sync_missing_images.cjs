const fs = require('fs');
const Database = require('better-sqlite3');
const https = require('https');
const crypto = require('crypto');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

const envContent = fs.readFileSync('.env.local', 'utf8');
const secret = envContent.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

const localDb = new Database('careerdost.sqlite');

const updateMappings = [
  { slug: 'pm-youth-laptop-scheme-phase-4-registration-alert', img: '/images/pm-youth-laptop-scheme-phase-4-registration-alert.webp' },
  { slug: 'nts-nat-2026-october-test-roll-number-slips-uploaded', img: '/images/nts-nat-2026-october-test-roll-number-slips-uploaded.webp' },
  { slug: 'hec-fully-funded-phd-scholarships-2026-open', img: '/images/hec-fully-funded-phd-scholarships-2026-open.webp' },
  { slug: 'fpsc-consolidated-advertisement-09-2026-announced', img: '/images/fpsc-consolidated-advertisement-09-2026-announced.webp' },
];

function updateLiveEndpoint(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const req = https.request({
      hostname: 'careerdost.blog',
      path: endpoint,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('=== SYNCING MISSING FEATURED IMAGES ===\n');

  // Fetch current live updates to preserve all existing fields
  const getRes = await new Promise(resolve => {
    https.get('https://careerdost.blog/api/admin/updates', { headers: { Authorization: `Bearer ${token}` } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d).data || JSON.parse(d)));
    });
  });

  for (const m of updateMappings) {
    // SQLite
    localDb.prepare('UPDATE daily_updates SET featured_image = ? WHERE slug = ?').run(m.img, m.slug);
    console.log(`[SQLite Update] ${m.slug} -> ${m.img}`);

    // D1
    const existing = getRes.find(u => u.slug === m.slug);
    if (existing) {
      const payload = {
        ...existing,
        slug: existing.slug,
        title: existing.title,
        category: existing.category,
        shortDescription: existing.shortDescription || existing.short_description,
        content: existing.content,
        featuredImage: m.img,
        officialLink: existing.officialLink || existing.official_link,
        applyLink: existing.applyLink || existing.apply_link,
        status: existing.status
      };
      const putRes = await updateLiveEndpoint(`/api/admin/updates/${m.slug}`, payload);
      console.log(`[Live D1 Update] ${m.slug} -> HTTP ${putRes.status}`);
      if (putRes.status !== 200) console.log('Error:', putRes.body);
    }
  }

  console.log('\nSync completed.');
}

run();
