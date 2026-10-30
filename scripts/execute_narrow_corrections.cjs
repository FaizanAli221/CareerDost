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

async function executeCorrections() {
  console.log('=== EXECUTING APPROVED NARROW CONTENT CORRECTIONS ===\n');
  console.log(`Execution Timestamp: ${new Date().toISOString()}`);

  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  // -------------------------------------------------------------
  // 1. SINDH WHEAT SUBSIDY
  // -------------------------------------------------------------
  console.log('\n--- 1. Updating Sindh Wheat Subsidy in Production D1 ---');
  const wheat = allD1.find(a => a.slug === 'sindh-wheat-subsidy-benazir-hari-card-2026');
  if (!wheat) throw new Error('Wheat article not found');

  const newWheatTitle = 'Sindh Wheat Subsidy 2026–27: Benazir Hari Card DAP Relief & Form-VII Verification';
  const newWheatExcerpt = 'Explore verified guidelines for the Sindh Rabi 2026–27 wheat support framework, including DAP input relief parameters, Rs 2,000/maund harvest incentives, and Form-VII land verification via Benazir Hari Card.';
  const newWheatSalary = 'DAP Input Relief Framework + Rs 2,000/Maund Harvest Incentive';

  const wheatPayload = {
    title: newWheatTitle,
    slug: wheat.slug,
    category: wheat.categorySlug || wheat.category,
    organization: wheat.organization,
    jobType: wheat.jobType,
    location: wheat.location,
    qualification: wheat.qualification,
    salary: newWheatSalary,
    experience: wheat.experience,
    positions: wheat.positions,
    lastDate: wheat.lastDate,
    noDeadline: wheat.noDeadline,
    publishDate: wheat.publishDate,
    officialLink: wheat.officialLink,
    applyLink: wheat.applyLink,
    isVerified: wheat.isVerified,
    featured: wheat.featured,
    logoInitial: wheat.logoInitial,
    featuredImage: wheat.featuredImage,
    imageAlt: wheat.imageAlt,
    excerpt: newWheatExcerpt,
    content: wheat.content,
    seoTitle: wheat.seoTitle,
    metaDescription: wheat.metaDescription,
    focusKeyword: wheat.focusKeyword,
    canonicalUrl: wheat.canonicalUrl,
    ogTitle: wheat.seoTitle,
    ogDescription: wheat.metaDescription,
    status: 'published'
  };

  const wheatRes = await fetch(`https://careerdost.blog/api/admin/articles/${wheat.slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify(wheatPayload)
  });
  const wheatJson = await wheatRes.json();
  if (!wheatRes.ok || !wheatJson.success) {
    throw new Error(`Failed to update Wheat D1: ${JSON.stringify(wheatJson)}`);
  }
  console.log('SUCCESS: Production D1 updated for Sindh Wheat Subsidy');

  // Local SQLite update for Sindh Wheat Subsidy
  localDb.prepare(`
    UPDATE articles SET
      title = ?,
      excerpt = ?,
      salary = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `).run(newWheatTitle, newWheatExcerpt, newWheatSalary, wheat.slug);
  console.log('SUCCESS: Local SQLite synchronized for Sindh Wheat Subsidy');

  // -------------------------------------------------------------
  // 2. BANK OF PUNJAB KARACHI
  // -------------------------------------------------------------
  console.log('\n--- 2. Updating Bank of Punjab Karachi in Production D1 ---');
  const bop = allD1.find(a => a.slug === 'bank-of-punjab-karachi-manager-jobs-2026');
  if (!bop) throw new Error('BOP article not found');

  const newBopContent = [...bop.content];
  newBopContent[2] = newBopContent[2].replace(
    '(Candidates must submit applications before midnight tonight).',
    '. The official listing gives 29 October 2026 as the closing date, but does not specify an exact cutoff time. Check the official BOP portal for current submission availability.'
  );

  newBopContent[13] = newBopContent[13].replace(
    'Yes, but it is closing today — 29 October 2026. Interested applicants must complete and submit their profile via the official BOP portal before midnight tonight.',
    'The official listing gives 29 October 2026 as the closing date, but does not specify an exact cutoff time. Check the official BOP portal for current submission availability.'
  );

  const bopPayload = {
    title: bop.title,
    slug: bop.slug,
    category: bop.categorySlug || bop.category,
    organization: bop.organization,
    jobType: bop.jobType,
    location: bop.location,
    qualification: bop.qualification,
    salary: bop.salary,
    experience: bop.experience,
    positions: bop.positions,
    lastDate: bop.lastDate,
    noDeadline: bop.noDeadline,
    publishDate: bop.publishDate,
    officialLink: bop.officialLink,
    applyLink: bop.applyLink,
    isVerified: bop.isVerified,
    featured: bop.featured,
    logoInitial: bop.logoInitial,
    featuredImage: bop.featuredImage,
    imageAlt: bop.imageAlt,
    excerpt: bop.excerpt,
    content: newBopContent,
    seoTitle: bop.seoTitle,
    metaDescription: bop.metaDescription,
    focusKeyword: bop.focusKeyword,
    canonicalUrl: bop.canonicalUrl,
    ogTitle: bop.seoTitle,
    ogDescription: bop.metaDescription,
    status: 'published'
  };

  const bopRes = await fetch(`https://careerdost.blog/api/admin/articles/${bop.slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify(bopPayload)
  });
  const bopJson = await bopRes.json();
  if (!bopRes.ok || !bopJson.success) {
    throw new Error(`Failed to update BOP D1: ${JSON.stringify(bopJson)}`);
  }
  console.log('SUCCESS: Production D1 updated for Bank of Punjab');

  // Local SQLite update for Bank of Punjab
  localDb.prepare(`
    UPDATE articles SET
      content = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `).run(JSON.stringify(newBopContent), bop.slug);
  console.log('SUCCESS: Local SQLite synchronized for Bank of Punjab');

  console.log('\nAll approved updates executed successfully.');
}

executeCorrections().catch(console.error);
