const fs = require('fs');
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

const targetSlugs = [
  'spsc-exam-preparation-screening-challan-guide',
  'fpsc-online-application-challan-form-32a-guide',
  'national-job-portal-njp-pakistan-application-guide',
  'comsats-university-jobs-faculty-staff-2026',
  'punjab-university-jobs-faculty-staff-2026',
  'pidcl-site-engineer-jobs-2026',
  'university-of-chakwal-uoc-jobs-2026',
  'fpsc-assistant-director-2026',
  'punjab-police-constable-recruitment-2026'
];

function checkUrl(url) {
  return new Promise(r => {
    https.get(url, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        r({ status: res.statusCode, length: body.length, headers: res.headers });
      });
    }).on('error', err => r({ status: 'ERR', error: err.message }));
  });
}

async function run() {
  console.log('=== CHECKING THE 9 REPORTED 404 URLS ===');
  for (const slug of targetSlugs) {
    const res = await checkUrl(`https://careerdost.blog/jobs/${slug}`);
    console.log(`[HTTP ${res.status}] /jobs/${slug}`);
  }

  console.log('\n=== CHECKING 10 OTHER RANDOM ARTICLE URLS ===');
  const d1Articles = await new Promise((resolve, reject) => {
    https.get('https://careerdost.blog/api/admin/articles', { headers: { Authorization: 'Bearer ' + token } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d).data || JSON.parse(d)));
    }).on('error', reject);
  });

  const otherArticles = d1Articles.filter(a => !targetSlugs.includes(a.slug) && a.status === 'published').slice(0, 10);
  for (const a of otherArticles) {
    const res = await checkUrl(`https://careerdost.blog/jobs/${a.slug}`);
    console.log(`[HTTP ${res.status}] /jobs/${a.slug}`);
  }
}

run();
