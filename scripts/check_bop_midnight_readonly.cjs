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

async function verifyBopMidnight() {
  const slug = 'bank-of-punjab-karachi-manager-jobs-2026';
  const timestamp = Date.now();
  const pageUrl = `https://careerdost.blog/jobs/${slug}?cb=${timestamp}`;
  const apiUrl = `https://careerdost.blog/api/articles/${slug}?cb=${timestamp}`;

  console.log('=== FORENSIC READ-ONLY INSPECTION: BOP KARACHI ARTICLE ===');
  console.log(`Inspection Time: ${new Date().toISOString()}\n`);

  // 1. Fetch Fresh Public Page
  const pageRes = await fetch(pageUrl, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ReadonlyAudit/1.0'
    }
  });
  const pageHeaders = Object.fromEntries(pageRes.headers.entries());
  const pageHtml = await pageRes.text();

  // 2. Fetch Fresh Public Article API
  const apiRes = await fetch(apiUrl, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ReadonlyAudit/1.0'
    }
  });
  const apiHeaders = Object.fromEntries(apiRes.headers.entries());
  const apiJson = await apiRes.json();

  // 3. Fetch Direct Production D1 Record via Admin
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const adminRes = await fetch(`https://careerdost.blog/api/admin/articles`, {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allAdmin = (await adminRes.json()).data;
  const d1Record = allAdmin.find(a => a.slug === slug);

  // Search for phrases
  const queryPhrase = 'before midnight tonight';
  const broadPhrase = 'midnight';

  console.log('--- 1. HTTP Response Headers ---');
  console.log('Public Page URL:        ', pageUrl);
  console.log('HTTP Status:            ', pageRes.status, pageRes.statusText);
  console.log('Date (Header):          ', pageHeaders['date']);
  console.log('CF-Cache-Status:        ', pageHeaders['cf-cache-status'] || 'NONE');
  console.log('CF-Ray:                 ', pageHeaders['cf-ray']);
  console.log('Cache-Control:          ', pageHeaders['cache-control']);
  console.log('Age:                    ', pageHeaders['age'] || 'N/A');

  console.log('\n--- 2. Search for "before midnight tonight" ---');
  const inHtmlExact = pageHtml.includes(queryPhrase);
  const inApiExact = JSON.stringify(apiJson).includes(queryPhrase);
  const inD1Exact = JSON.stringify(d1Record).includes(queryPhrase);
  console.log(`In Public Page HTML:    ${inHtmlExact ? 'FOUND (PRESENT)' : 'NOT FOUND (REMOVED)'}`);
  console.log(`In Public API JSON:     ${inApiExact ? 'FOUND (PRESENT)' : 'NOT FOUND (REMOVED)'}`);
  console.log(`In Production D1 DB:    ${inD1Exact ? 'FOUND (PRESENT)' : 'NOT FOUND (REMOVED)'}`);

  console.log('\n--- 3. Search for broad word "midnight" (case-insensitive) ---');
  const matchHtmlCount = (pageHtml.match(/midnight/gi) || []).length;
  const matchApiCount = (JSON.stringify(apiJson).match(/midnight/gi) || []).length;
  const matchD1Count = (JSON.stringify(d1Record).match(/midnight/gi) || []).length;
  console.log(`Occurrences in HTML:    ${matchHtmlCount}`);
  console.log(`Occurrences in API:     ${matchApiCount}`);
  console.log(`Occurrences in D1:      ${matchD1Count}`);

  console.log('\n--- 4. Exact Text of Section 2 (Alert Notice) ---');
  console.log('D1 Content [2]:');
  console.log(d1Record.content[2]);

  console.log('\n--- 5. Exact Text of Section 13 (FAQ Q2) ---');
  console.log('D1 Content [13]:');
  console.log(d1Record.content[13]);

  // Extract snippet from public page HTML around Section 2 and Section 13
  console.log('\n--- 6. Public HTML Snippet Around Alert Notice ---');
  const s2Idx = pageHtml.indexOf('Official Application Status Notice');
  if (s2Idx !== -1) {
    console.log(pageHtml.slice(s2Idx - 50, s2Idx + 450).replace(/\s+/g, ' '));
  } else {
    console.log('Alert notice text not found in HTML');
  }

  console.log('\n--- 7. Public HTML Snippet Around FAQ Q2 ---');
  const q2Idx = pageHtml.indexOf('Is the Regional Manager Alliances position still open');
  if (q2Idx !== -1) {
    console.log(pageHtml.slice(q2Idx - 20, q2Idx + 300).replace(/\s+/g, ' '));
  } else {
    console.log('FAQ Q2 text not found in HTML');
  }
}

verifyBopMidnight().catch(console.error);
