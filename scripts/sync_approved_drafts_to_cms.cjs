const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';
const apiBase = 'https://careerdost.blog/api/admin';

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  return tokenMatch ? tokenMatch[1] : null;
}

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

async function queryD1(sql, params = []) {
  const token = getToken();
  const res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params })
  });
  const data = await res.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result[0].results;
}

async function runSync() {
  console.log('=== CAREERDOST CONTROLLED DRAFT SYNCHRONIZATION VIA CMS API ===\n');

  // 1. Get Admin and Secret to create authenticated Bearer token
  const admins = await queryD1('SELECT id, username, email, role FROM admins;');
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secretMatch = envLocal.match(/ADMIN_JWT_SECRET=(.+)/);
  const secret = secretMatch ? secretMatch[1].trim() : null;
  if (!admins.length || !secret) {
    throw new Error('Admin credentials or JWT secret missing.');
  }

  const jwt = generateJwt(admins[0], secret);
  console.log('Generated Admin JWT Token. Verifying with CMS API...');
  const meRes = await fetch(`${apiBase}/me`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  if (meRes.status !== 200) {
    throw new Error(`Authentication check failed: ${meRes.status} ${await meRes.text()}`);
  }
  console.log('CMS API Authentication verified successfully (HTTP 200).\n');

  // 2. Fetch current production drafts to ensure idempotency
  console.log('Checking current production drafts in CMS...');
  const currentArticlesRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const currentArticlesData = await currentArticlesRes.json();
  const currentArticleSlugs = new Set((currentArticlesData.data || []).map(a => a.slug));

  const currentUpdatesRes = await fetch(`${apiBase}/updates?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const currentUpdatesData = await currentUpdatesRes.json();
  const currentUpdateSlugs = new Set((currentUpdatesData.data || []).map(u => u.slug));

  console.log(`Current production draft counts: Articles=${currentArticleSlugs.size}, DailyUpdates=${currentUpdateSlugs.size}\n`);

  // 3. Connect to local SQLite to load the 4 specific approved records
  const db = new Database('careerdost.sqlite');
  const resultsSummary = [];

  const targetArticles = [
    { localId: 512, expectedSlug: 'askari-bank-jobs-october-2026-karachi' },
    { localId: 518, expectedSlug: 'engineering-development-board-jobs-october-2026' },
    { localId: 519, expectedSlug: 'pseb-government-it-jobs-october-2026' }
  ];

  for (const target of targetArticles) {
    const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(target.localId);
    if (!row) {
      throw new Error(`Local article ID ${target.localId} not found in careerdost.sqlite`);
    }
    if (row.slug !== target.expectedSlug) {
      throw new Error(`Slug mismatch for ID ${target.localId}: expected ${target.expectedSlug}, got ${row.slug}`);
    }

    if (currentArticleSlugs.has(row.slug)) {
      console.log(`[IDEMPOTENT SKIP] Article slug already exists in production CMS: ${row.slug}`);
      const existing = (currentArticlesData.data || []).find(a => a.slug === row.slug);
      resultsSummary.push({
        name: row.title,
        slug: row.slug,
        productionId: existing ? existing.id : 'existing',
        type: 'Article',
        status: existing ? existing.status : 'draft',
        action: 'Already Existed (Skipped)'
      });
      continue;
    }

    // Prepare payload
    const payload = {
      title: row.title,
      slug: row.slug,
      category: row.category_slug,
      organization: row.organization,
      jobType: row.job_type || 'Full Time',
      location: row.location,
      qualification: row.qualification,
      salary: row.salary,
      experience: row.experience,
      positions: row.positions,
      lastDate: row.last_date && row.last_date.length > 20 ? 'Rolling Intake' : (row.last_date || ''),
      noDeadline: Boolean(row.no_deadline),
      publishDate: row.publish_date || '2026-10-22',
      officialLink: row.official_link,
      applyLink: row.apply_link || row.official_link,
      isVerified: Boolean(row.is_verified),
      featured: Boolean(row.featured),
      logoInitial: row.logo_initial || '',
      featuredImage: row.featured_image,
      imageAlt: row.image_alt,
      excerpt: row.excerpt,
      content: JSON.parse(row.content),
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
      focusKeyword: row.focus_keyword,
      canonicalUrl: row.canonical_url,
      ogTitle: row.og_title,
      ogDescription: row.og_description,
      status: 'draft' // Strictly draft
    };

    console.log(`Importing Article [${row.slug}] via CMS API...`);
    const createRes = await fetch(`${apiBase}/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const createJson = await createRes.json();
    if (!createRes.ok || !createJson.success) {
      throw new Error(`Failed to create article [${row.slug}]: ${JSON.stringify(createJson)}`);
    }

    console.log(`-> SUCCESS! Created production article ID: ${createJson.data.id} (Status: ${createJson.data.status})`);
    resultsSummary.push({
      name: createJson.data.title,
      slug: createJson.data.slug,
      productionId: createJson.data.id,
      type: 'Article',
      status: createJson.data.status,
      action: 'Created via CMS API'
    });
  }

  // 4. Import the Daily Update
  const updateTarget = { localId: 389, expectedSlug: 'sindh-high-court-personal-assistant-shorthand-test-2026' };
  const updateRow = db.prepare('SELECT * FROM daily_updates WHERE id = ?').get(updateTarget.localId);
  if (!updateRow) {
    throw new Error(`Local daily_update ID ${updateTarget.localId} not found`);
  }
  if (updateRow.slug !== updateTarget.expectedSlug) {
    throw new Error(`Slug mismatch for Daily Update ID ${updateTarget.localId}`);
  }

  if (currentUpdateSlugs.has(updateRow.slug)) {
    console.log(`[IDEMPOTENT SKIP] Daily update slug already exists in production CMS: ${updateRow.slug}`);
    const existing = (currentUpdatesData.data || []).find(u => u.slug === updateRow.slug);
    resultsSummary.push({
      name: updateRow.title,
      slug: updateRow.slug,
      productionId: existing ? existing.id : 'existing',
      type: 'Daily Update',
      status: existing ? existing.status : 'draft',
      action: 'Already Existed (Skipped)'
    });
  } else {
    const updatePayload = {
      title: updateRow.title,
      slug: updateRow.slug,
      category: updateRow.category,
      shortDescription: updateRow.short_description,
      content: JSON.parse(updateRow.content),
      featuredImage: updateRow.featured_image,
      imageAlt: updateRow.image_alt,
      officialLink: updateRow.official_link,
      applyLink: updateRow.apply_link || updateRow.official_link,
      deadline: updateRow.deadline || '',
      noDeadline: Boolean(updateRow.no_deadline),
      publishDate: updateRow.publish_date || '2026-10-22',
      organization: updateRow.organization,
      location: updateRow.location,
      qualification: updateRow.qualification,
      experience: updateRow.experience,
      positions: updateRow.positions,
      jobType: updateRow.job_type,
      salary: updateRow.salary,
      isVerified: Boolean(updateRow.is_verified),
      featured: Boolean(updateRow.featured),
      seoTitle: updateRow.seo_title,
      metaDescription: updateRow.meta_description,
      focusKeyword: updateRow.focus_keyword,
      canonicalUrl: updateRow.canonical_url,
      ogTitle: updateRow.og_title,
      ogDescription: updateRow.og_description,
      status: 'draft' // Strictly draft
    };

    console.log(`Importing Daily Update [${updateRow.slug}] via CMS API...`);
    const updateRes = await fetch(`${apiBase}/updates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });

    const updateJson = await updateRes.json();
    if (!updateRes.ok || !updateJson.success) {
      throw new Error(`Failed to create daily update [${updateRow.slug}]: ${JSON.stringify(updateJson)}`);
    }

    console.log(`-> SUCCESS! Created production daily update ID: ${updateJson.data.id} (Status: ${updateJson.data.status})`);
    resultsSummary.push({
      name: updateJson.data.title,
      slug: updateJson.data.slug,
      productionId: updateJson.data.id,
      type: 'Daily Update',
      status: updateJson.data.status,
      action: 'Created via CMS API'
    });
  }

  // 5. Verification: Check production CMS Draft listings
  console.log('\n--- VERIFYING IN PRODUCTION CMS DRAFT LISTINGS ---');
  const verifyArticlesRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const verifyArticles = (await verifyArticlesRes.json()).data || [];

  const verifyUpdatesRes = await fetch(`${apiBase}/updates?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const verifyUpdates = (await verifyUpdatesRes.json()).data || [];

  console.log(`Total production draft articles now: ${verifyArticles.length}`);
  console.log(`Total production draft updates now: ${verifyUpdates.length}`);

  for (const item of resultsSummary) {
    if (item.type === 'Article') {
      const found = verifyArticles.find(a => a.slug === item.slug);
      console.log(`Article [${item.slug}]: ${found ? `VISIBLE IN CMS (ID: ${found.id}, status: ${found.status})` : 'NOT FOUND IN CMS'}`);
    } else {
      const found = verifyUpdates.find(u => u.slug === item.slug);
      console.log(`Update [${item.slug}]: ${found ? `VISIBLE IN CMS (ID: ${found.id}, status: ${found.status})` : 'NOT FOUND IN CMS'}`);
    }
  }

  console.log('\n=== CONTROLLED SYNCHRONIZATION COMPLETE ===');
  console.log(JSON.stringify(resultsSummary, null, 2));
}

runSync().catch(err => {
  console.error('\nSync error:', err);
  process.exit(1);
});
