import fs from 'fs';

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  return tokenMatch ? tokenMatch[1] : null;
}

async function queryD1(sql, params = []) {
  const token = getToken();
  const res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(json.errors)}`);
  }
  return json.result[0];
}

async function run() {
  console.log('=== SYNCING 20 OCTOBER 2026 BATCH TO REMOTE CLOUDFLARE D1 ===\n');

  // Import listings from src/data/listings.js
  const { listings } = await import('../src/data/listings.js');

  const targets = [24, 355, 318, 505, 506, 507];
  for (const id of targets) {
    const a = listings.find(l => l.id === id);
    if (!a) {
      console.warn(`Article [${id}] not found in listings.js`);
      continue;
    }

    console.log(`Syncing [${a.id}] ${a.slug}...`);

    const sql = `
      INSERT INTO articles (
        id, slug, title, category_slug, organization, job_type, location,
        qualification, salary, last_date, publish_date, official_link,
        featured, logo_initial, excerpt, content, seo_title, meta_description,
        status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        category_slug = excluded.category_slug,
        organization = excluded.organization,
        job_type = excluded.job_type,
        location = excluded.location,
        qualification = excluded.qualification,
        salary = excluded.salary,
        last_date = excluded.last_date,
        publish_date = excluded.publish_date,
        official_link = excluded.official_link,
        featured = excluded.featured,
        logo_initial = excluded.logo_initial,
        excerpt = excluded.excerpt,
        content = excluded.content,
        seo_title = excluded.seo_title,
        meta_description = excluded.meta_description,
        status = excluded.status,
        updated_at = excluded.updated_at
    `;

    const params = [
      a.id,
      a.slug,
      a.title,
      a.category,
      a.organization,
      a.jobType,
      a.location,
      a.qualification,
      a.salary,
      a.lastDate,
      a.publishDate,
      a.officialLink,
      a.featured ? 1 : 0,
      a.logoInitial,
      a.excerpt,
      JSON.stringify(a.content),
      a.seoTitle,
      a.metaDescription,
      'published',
      a.createdAt || '2026-10-20 01:00:00',
      a.updatedAt || '2026-10-20 01:00:00'
    ];

    try {
      await queryD1(sql, params);
      console.log(`  -> Synced [${a.id}] ${a.slug} successfully`);
    } catch (err) {
      console.error(`  -> Failed syncing [${a.id}] ${a.slug}:`, err.message);
    }
  }

  console.log('\n=== D1 Sync Finished ===');
}

run().catch(console.error);
