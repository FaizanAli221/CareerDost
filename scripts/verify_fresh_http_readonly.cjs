const fs = require('fs');
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

async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const targets = [
    { slug: 'phsa-paramedic-general-list-2026', label: 'PHSA Paramedic General List' },
    { slug: 'sindh-wheat-subsidy-benazir-hari-card-2026', label: 'Sindh Wheat Subsidy' },
    { slug: 'bank-of-punjab-karachi-manager-jobs-2026', label: 'Bank of Punjab Karachi Manager' }
  ];

  console.log('=== STEP 1: FETCHING PUBLIC URLS & CACHE COMPARISON ===\n');

  const results = {};

  for (const t of targets) {
    const normalUrl = `https://careerdost.blog/jobs/${t.slug}`;
    const bustUrl = `https://careerdost.blog/jobs/${t.slug}?cb=${Date.now()}`;
    const apiUrl = `https://careerdost.blog/api/articles/${t.slug}?cb=${Date.now()}`;

    // Normal public GET with no-cache headers
    const resNormal = await fetch(normalUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ReadonlyAudit/1.0'
      }
    });
    const htmlNormal = await resNormal.text();

    // Cache-busted public GET
    const resBust = await fetch(bustUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ReadonlyAudit/1.0'
      }
    });
    const htmlBust = await resBust.text();

    // Public API GET
    const resApi = await fetch(apiUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const jsonApi = await resApi.json();

    // Admin API GET (direct D1 source of truth)
    const resAdmin = await fetch(`https://careerdost.blog/api/admin/articles`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    const allAdmin = (await resAdmin.json()).data;
    const d1Record = allAdmin.find(a => a.slug === t.slug);

    results[t.slug] = {
      label: t.label,
      normal: {
        status: resNormal.status,
        headers: Object.fromEntries(resNormal.headers.entries()),
        html: htmlNormal
      },
      bust: {
        status: resBust.status,
        headers: Object.fromEntries(resBust.headers.entries()),
        html: htmlBust,
        lengthDiff: htmlBust.length - htmlNormal.length
      },
      api: {
        status: resApi.status,
        data: jsonApi.data
      },
      d1: d1Record
    };

    console.log(`--- [${t.label}] ---`);
    console.log(`  Normal URL:       ${normalUrl}`);
    console.log(`  Normal Status:    ${resNormal.status} ${resNormal.statusText}`);
    console.log(`  CF-Cache-Status:  ${resNormal.headers.get('cf-cache-status') || 'N/A'}`);
    console.log(`  Age:              ${resNormal.headers.get('age') || 'N/A'}`);
    console.log(`  CF-RAY:           ${resNormal.headers.get('cf-ray') || 'N/A'}`);
    console.log(`  Date:             ${resNormal.headers.get('date') || 'N/A'}`);
    console.log(`  Cache-Busted:     ${resBust.status} (diff in bytes vs normal: ${htmlBust.length - htmlNormal.length})`);
    console.log(`  API Status:       ${resApi.status} (D1 ID: ${d1Record?.id}, Status: ${d1Record?.status})\n`);
  }

  fs.writeFileSync('scripts/fresh_http_results.json', JSON.stringify(results, null, 2));
  console.log('Results written to scripts/fresh_http_results.json');
}

run().catch(console.error);
