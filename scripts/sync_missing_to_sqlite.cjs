const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

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
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encHeader}.${encPayload}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest());
  return `${dataToSign}.${signature}`;
}

async function main() {
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', { headers: { Authorization: 'Bearer ' + jwt } });
  const allD1 = (await res.json()).data;
  
  const targetSlugs = [
    'ministry-of-planning-jobs-october-2026',
    'pseb-creative-lead-jobs-2026',
    'meezan-bank-transaction-associates-batch-01-jobs-2026'
  ];

  const localDb = new Database('careerdost.sqlite');
  const insertStmt = localDb.prepare(`
    INSERT INTO articles (
      slug, title, category_slug, organization, job_type, location, qualification,
      salary, last_date, publish_date, official_link, apply_link, featured, logo_initial,
      excerpt, content, seo_title, meta_description, status, featured_image, image_alt,
      experience, positions, is_verified, focus_keyword, canonical_url, og_title, og_description,
      no_deadline, created_at, updated_at
    ) VALUES (
      @slug, @title, @category_slug, @organization, @job_type, @location, @qualification,
      @salary, @last_date, @publish_date, @official_link, @apply_link, @featured, @logo_initial,
      @excerpt, @content, @seo_title, @meta_description, @status, @featured_image, @image_alt,
      @experience, @positions, @is_verified, @focus_keyword, @canonical_url, @og_title, @og_description,
      @no_deadline, @created_at, @updated_at
    )
  `);

  for (const slug of targetSlugs) {
    const d1Art = allD1.find(a => a.slug === slug);
    if (!d1Art) { console.log('Not found in D1:', slug); continue; }
    const exists = localDb.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
    if (exists) { console.log('Already exists in local:', slug); continue; }

    const contentStr = Array.isArray(d1Art.content) ? JSON.stringify(d1Art.content) : (typeof d1Art.content === 'string' ? d1Art.content : '');

    insertStmt.run({
      slug: d1Art.slug,
      title: d1Art.title,
      category_slug: d1Art.category || d1Art.category_slug,
      organization: d1Art.organization,
      job_type: d1Art.jobType || d1Art.job_type,
      location: d1Art.location,
      qualification: d1Art.qualification,
      salary: d1Art.salary,
      last_date: d1Art.lastDate || d1Art.last_date,
      publish_date: d1Art.publishDate || d1Art.publish_date,
      official_link: d1Art.officialLink || d1Art.official_link,
      apply_link: d1Art.applyLink || d1Art.apply_link,
      featured: d1Art.featured ? 1 : 0,
      logo_initial: d1Art.logoInitial || d1Art.logo_initial,
      excerpt: d1Art.excerpt,
      content: contentStr,
      seo_title: d1Art.seoTitle || d1Art.seo_title,
      meta_description: d1Art.metaDescription || d1Art.meta_description,
      status: d1Art.status,
      featured_image: d1Art.featuredImage || d1Art.featured_image,
      image_alt: d1Art.imageAlt || d1Art.image_alt,
      experience: d1Art.experience,
      positions: d1Art.positions,
      is_verified: d1Art.isVerified ? 1 : 0,
      focus_keyword: d1Art.focusKeyword || d1Art.focus_keyword,
      canonical_url: d1Art.canonicalUrl || d1Art.canonical_url,
      og_title: d1Art.ogTitle || d1Art.og_title,
      og_description: d1Art.ogDescription || d1Art.og_description,
      no_deadline: d1Art.noDeadline ? 1 : 0,
      created_at: d1Art.createdAt || new Date().toISOString(),
      updated_at: d1Art.updatedAt || new Date().toISOString()
    });
    console.log('Inserted into local SQLite:', slug);
  }

  // Count published in local
  const publishedCount = localDb.prepare("SELECT count(id) as count FROM articles WHERE status = 'published'").get().count;
  console.log('Local published articles now:', publishedCount);
}

main().catch(console.error);
