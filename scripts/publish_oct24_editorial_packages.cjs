const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

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

async function publishApproved() {
  console.log('=== PUBLISHING 24 OCTOBER 2026 APPROVED EDITORIAL BATCH ===\n');

  const { oct24EditorialPackages } = await import('./save_oct24_editorial_packages.js');
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  const spsc = oct24EditorialPackages.spscReforms;
  const wheat = oct24EditorialPackages.wheatPrice2027;

  // 1. Publish SPSC Revision to CMS (PUT /articles/:slug)
  console.log(`Publishing revised SPSC article (${spsc.slug})...`);
  const spscPayload = {
    title: spsc.title,
    slug: spsc.slug,
    category: spsc.category_slug,
    organization: spsc.organization,
    jobType: spsc.job_type,
    location: spsc.location,
    qualification: spsc.qualification,
    salary: spsc.salary,
    experience: spsc.experience,
    positions: spsc.positions,
    lastDate: spsc.last_date,
    noDeadline: false,
    publishDate: spsc.publish_date,
    officialLink: spsc.official_link,
    applyLink: spsc.apply_link,
    isVerified: true,
    featured: true,
    logoInitial: spsc.logo_initial,
    featuredImage: spsc.featured_image,
    imageAlt: spsc.image_alt,
    excerpt: spsc.excerpt,
    content: spsc.content,
    seoTitle: spsc.seo_title,
    metaDescription: spsc.meta_description,
    focusKeyword: spsc.focus_keyword,
    canonicalUrl: spsc.canonical_url,
    ogTitle: spsc.og_title,
    ogDescription: spsc.og_description,
    status: 'published'
  };

  const spscRes = await fetch(`${apiBase}/articles/${spsc.slug}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(spscPayload)
  });
  const spscData = await spscRes.json();
  if (!spscData.success) {
    throw new Error(`Failed to update SPSC: ${JSON.stringify(spscData)}`);
  }
  console.log('✓ SPSC Revision successfully published to Production CMS!');

  // 2. Publish Wheat Draft 524 to 'published' status (PATCH /articles/:slug/status)
  console.log(`Publishing Wheat article (${wheat.slug})...`);
  const wheatRes = await fetch(`${apiBase}/articles/${wheat.slug}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'published' })
  });
  const wheatData = await wheatRes.json();
  if (!wheatData.success) {
    throw new Error(`Failed to publish Wheat: ${JSON.stringify(wheatData)}`);
  }
  console.log('✓ Wheat Article successfully published to Production CMS!');

  // 3. Update local SQLite
  const localDb = new Database('careerdost.sqlite');
  localDb.prepare(`
    UPDATE articles SET
      title = ?, last_date = '2026-11-11', no_deadline = 0, excerpt = ?,
      content = ?, seo_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP, status = 'published'
    WHERE slug = ?
  `).run(
    spsc.title, spsc.excerpt, JSON.stringify(spsc.content), spsc.seo_title, spsc.meta_description, spsc.slug
  );

  localDb.prepare(`
    UPDATE articles SET status = 'published', updated_at = CURRENT_TIMESTAMP WHERE slug = ?
  `).run(wheat.slug);

  console.log('✓ Local SQLite synchronized as published.');
  console.log('\n=== ALL APPROVED PACKAGES PUBLISHED ===');
}

if (process.argv.includes('--execute')) {
  publishApproved().catch(console.error);
} else {
  console.log('Publishing script ready. Run with --execute after editorial approval.');
}
