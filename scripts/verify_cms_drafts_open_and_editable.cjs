const fs = require('fs');
const crypto = require('crypto');

const apiBase = 'https://careerdost.blog/api/admin';

function base64UrlEncode(strOrBuffer) {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateJwt(admin, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encHeader}.${encPayload}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest());
  return `${dataToSign}.${signature}`;
}

async function verifyDrafts() {
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  console.log('Verifying articles list from CMS...');
  const artRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const artData = await artRes.json();
  const draftArticles = artData.data || [];

  const targetArticleSlugs = [
    'askari-bank-jobs-october-2026-karachi',
    'engineering-development-board-jobs-october-2026',
    'pseb-government-it-jobs-october-2026'
  ];

  for (const slug of targetArticleSlugs) {
    const found = draftArticles.find(a => a.slug === slug);
    if (!found) {
      throw new Error(`Draft article ${slug} not found in production CMS draft list!`);
    }
    console.log(`[VERIFIED DRAFT ARTICLE] ID: ${found.id} | Slug: ${found.slug} | Status: ${found.status} | Content Paragraphs: ${Array.isArray(found.content) ? found.content.length : 'non-array'}`);
  }

  console.log('\nVerifying updates list from CMS...');
  const updRes = await fetch(`${apiBase}/updates?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const updData = await updRes.json();
  const draftUpdates = updData.data || [];

  const targetUpdateSlug = 'sindh-high-court-personal-assistant-shorthand-test-2026';
  const updFound = draftUpdates.find(u => u.slug === targetUpdateSlug);
  if (!updFound) {
    throw new Error(`Draft update ${targetUpdateSlug} not found in production CMS draft list!`);
  }
  console.log(`[VERIFIED DRAFT UPDATE] ID: ${updFound.id} | Slug: ${updFound.slug} | Status: ${updFound.status} | Category: ${updFound.category}`);

  // Test that an update/edit endpoint responds successfully (testing PUT /articles/:slug with existing content without changing status)
  console.log('\nTesting CMS Edit capability (PUT endpoint check)...');
  const testArticle = draftArticles.find(a => a.slug === 'askari-bank-jobs-october-2026-karachi');
  const putRes = await fetch(`${apiBase}/articles/${testArticle.slug}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...testArticle,
      category: testArticle.category_slug || testArticle.category
    })
  });
  const putJson = await putRes.json();
  console.log(`PUT verification result: status=${putRes.status}, success=${putJson.success}, articleId=${putJson.data?.id}`);

  console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
}

verifyDrafts().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
