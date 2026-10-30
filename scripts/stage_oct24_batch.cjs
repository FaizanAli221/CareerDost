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

async function run() {
  console.log('=== STAGING 24 OCTOBER 2026 EDITORIAL BATCH ===\n');

  const { oct24EditorialPackages } = await import('./save_oct24_editorial_packages.js');

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  const wheatItem = oct24EditorialPackages.wheatPrice2027;

  // 1. Check existing drafts in production CMS
  const checkRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const checkData = await checkRes.json();
  const existingDraft = (checkData.data || []).find(a => a.slug === wheatItem.slug);

  let draftId = null;

  if (existingDraft) {
    console.log(`[ALREADY STAGED] Draft already exists in production CMS with ID: ${existingDraft.id}`);
    draftId = existingDraft.id;
  } else {
    // Create new draft in CMS via admin API
    const payload = {
      title: wheatItem.title,
      slug: wheatItem.slug,
      category: wheatItem.category_slug,
      organization: wheatItem.organization,
      jobType: wheatItem.job_type,
      location: wheatItem.location,
      qualification: wheatItem.qualification,
      salary: wheatItem.salary,
      experience: wheatItem.experience,
      positions: wheatItem.positions,
      lastDate: wheatItem.last_date,
      noDeadline: true,
      publishDate: wheatItem.publish_date,
      officialLink: wheatItem.official_link,
      applyLink: wheatItem.apply_link,
      isVerified: true,
      featured: true,
      logoInitial: wheatItem.logo_initial,
      featuredImage: wheatItem.featured_image,
      imageAlt: wheatItem.image_alt,
      excerpt: wheatItem.excerpt,
      content: wheatItem.content,
      seoTitle: wheatItem.seo_title,
      metaDescription: wheatItem.meta_description,
      focusKeyword: wheatItem.focus_keyword,
      canonicalUrl: wheatItem.canonical_url,
      ogTitle: wheatItem.og_title,
      ogDescription: wheatItem.og_description,
      status: 'draft' // STRICTLY DRAFT
    };

    const postRes = await fetch(`${apiBase}/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const postData = await postRes.json();
    if (!postData.success) {
      throw new Error(`Failed to create draft in CMS: ${JSON.stringify(postData)}`);
    }

    draftId = postData.data.id;
    console.log(`[DRAFT CREATED] Successfully created draft in production CMS with ID: ${draftId}`);
  }

  // 2. Also save into local SQLite as draft for local parity
  const localDb = new Database('careerdost.sqlite');
  const existingLocal = localDb.prepare('SELECT id FROM articles WHERE slug = ?').get(wheatItem.slug);

  if (existingLocal) {
    localDb.prepare(`
      UPDATE articles SET
        title = ?, category_slug = ?, organization = ?, job_type = ?, location = ?,
        qualification = ?, salary = ?, experience = ?, positions = ?, last_date = ?,
        no_deadline = 1, publish_date = ?, official_link = ?, apply_link = ?,
        is_verified = 1, featured = 1, logo_initial = ?, featured_image = ?,
        image_alt = ?, excerpt = ?, content = ?, seo_title = ?, meta_description = ?,
        focus_keyword = ?, canonical_url = ?, og_title = ?, og_description = ?,
        status = 'draft', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      wheatItem.title, wheatItem.category_slug, wheatItem.organization, wheatItem.job_type, wheatItem.location,
      wheatItem.qualification, wheatItem.salary, wheatItem.experience, wheatItem.positions, wheatItem.last_date,
      wheatItem.publish_date, wheatItem.official_link, wheatItem.apply_link,
      wheatItem.logo_initial, wheatItem.featured_image, wheatItem.image_alt, wheatItem.excerpt,
      JSON.stringify(wheatItem.content), wheatItem.seo_title, wheatItem.meta_description,
      wheatItem.focus_keyword, wheatItem.canonical_url, wheatItem.og_title, wheatItem.og_description,
      existingLocal.id
    );
    console.log(`[LOCAL SQLITE] Updated draft in local SQLite (ID: ${existingLocal.id})`);
  } else {
    localDb.prepare(`
      INSERT INTO articles (
        id, slug, title, category_slug, organization, job_type, location,
        qualification, salary, experience, positions, last_date, no_deadline,
        publish_date, official_link, apply_link, is_verified, featured,
        logo_initial, featured_image, image_alt, excerpt, content, seo_title,
        meta_description, focus_keyword, canonical_url, og_title, og_description,
        status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, 1,
        ?, ?, ?, 1, 1,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `).run(
      draftId || 520, wheatItem.slug, wheatItem.title, wheatItem.category_slug, wheatItem.organization,
      wheatItem.job_type, wheatItem.location, wheatItem.qualification, wheatItem.salary,
      wheatItem.experience, wheatItem.positions, wheatItem.last_date, wheatItem.publish_date,
      wheatItem.official_link, wheatItem.apply_link, wheatItem.logo_initial,
      wheatItem.featured_image, wheatItem.image_alt, wheatItem.excerpt, JSON.stringify(wheatItem.content),
      wheatItem.seo_title, wheatItem.meta_description, wheatItem.focus_keyword, wheatItem.canonical_url,
      wheatItem.og_title, wheatItem.og_description
    );
    console.log(`[LOCAL SQLITE] Inserted draft into local SQLite (ID: ${draftId || 520})`);
  }

  console.log('\n=== SUMMARY OF STAGED DRAFTS & REVISIONS ===');
  console.log('1. SPSC CCE-2026 Revision:');
  console.log('   - Slug: spsc-cce-2026-examination-reforms-age-attempts-screening (ID: 515)');
  console.log('   - Status: Staged in scripts/save_oct24_editorial_packages.js (LIVE D1 UNTOUCHED)');
  console.log('2. Pakistan Wheat Indicative Price 2027:');
  console.log(`   - Slug: pakistan-wheat-indicative-price-4500-2027 (CMS Draft ID: ${draftId})`);
  console.log('   - Status: Saved as DRAFT in CMS API and local SQLite (NOT PUBLIC)');
  console.log('3. Prior Wheat Price Article 441:');
  console.log('   - Slug: pakistan-wheat-support-price-2026-27 (ID: 441)');
  console.log('   - Status: Revision staged ready for in-place update if approved (LIVE D1 UNTOUCHED)');
}

run().catch(console.error);
