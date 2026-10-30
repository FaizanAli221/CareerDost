import fs from 'fs';
import Database from 'better-sqlite3';
import { oct22EditorialPackages } from './save_oct22_editorial_packages.js';

const db = new Database('careerdost.sqlite');
const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';

async function refreshToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const rtMatch = toml.match(/refresh_token\s*=\s*"([^"]+)"/);
  if (!rtMatch) throw new Error('No refresh_token found in toml');
  const rt = rtMatch[1];
  console.log('Refreshing Cloudflare OAuth token...');
  const res = await fetch('https://dash.cloudflare.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: '54d11594-84e4-41aa-b438-e81b8fa78ee7',
      refresh_token: rt
    })
  });
  const data = await res.json();
  if (data.access_token) {
    const newExpiration = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString();
    let updatedToml = toml.replace(/oauth_token\s*=\s*"[^"]+"/, `oauth_token = "${data.access_token}"`);
    updatedToml = updatedToml.replace(/expiration_time\s*=\s*"[^"]+"/, `expiration_time = "${newExpiration}"`);
    if (data.refresh_token) {
      updatedToml = updatedToml.replace(/refresh_token\s*=\s*"[^"]+"/, `refresh_token = "${data.refresh_token}"`);
    }
    fs.writeFileSync(tomlPath, updatedToml, 'utf8');
    console.log('Successfully refreshed token. Expires:', newExpiration);
    return data.access_token;
  }
  throw new Error(`Failed to refresh token: ${JSON.stringify(data)}`);
}

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  return tokenMatch ? tokenMatch[1] : null;
}

async function queryD1(sql, params = []) {
  let token = getToken();
  let res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });

  let json = await res.json();
  if (!json.success && json.errors && json.errors.some(e => e.code === 10000)) {
    console.log('Token expired or unauthorized. Refreshing...');
    token = await refreshToken();
    console.log('Waiting 3s for token propagation...');
    await new Promise(r => setTimeout(r, 3000));
    res = await fetch(d1QueryUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params })
    });
    json = await res.json();
  }

  if (!json.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(json.errors)}`);
  }
  return json.result[0];
}

const catMap = {
  'government-jobs': 'Government Jobs',
  'government-schemes': 'Government Schemes',
  'results': 'Results'
};

export async function syncOct22RemoteD1(status = 'draft') {
  console.log(`=== SYNCING OCT 22 ARTICLES TO REMOTE CLOUDFLARE D1 (STATUS: ${status.toUpperCase()}) ===\n`);

  for (const [key, item] of Object.entries(oct22EditorialPackages)) {
    console.log(`Syncing to remote D1: [${item.slug}] as '${status.toUpperCase()}'`);
    const contentJson = JSON.stringify(item.content);
    const catLabel = catMap[item.category_slug] || 'Government Schemes';

    // 1. Sync to articles table
    const sqlArt = `
      INSERT INTO articles (
        id, slug, title, category_slug, organization, job_type, location,
        qualification, salary, last_date, publish_date, official_link,
        featured, logo_initial, excerpt, content, seo_title, meta_description,
        status, featured_image, image_alt, experience, positions, apply_link,
        is_verified, focus_keyword, canonical_url, og_title, og_description, no_deadline
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      ON CONFLICT(slug) DO UPDATE SET
        title=excluded.title, category_slug=excluded.category_slug, organization=excluded.organization,
        job_type=excluded.job_type, location=excluded.location, qualification=excluded.qualification,
        salary=excluded.salary, last_date=excluded.last_date, publish_date=excluded.publish_date,
        official_link=excluded.official_link, featured=excluded.featured, logo_initial=excluded.logo_initial,
        excerpt=excluded.excerpt, content=excluded.content, seo_title=excluded.seo_title,
        meta_description=excluded.meta_description, status=excluded.status, featured_image=excluded.featured_image,
        image_alt=excluded.image_alt, experience=excluded.experience, positions=excluded.positions,
        apply_link=excluded.apply_link, is_verified=excluded.is_verified, focus_keyword=excluded.focus_keyword,
        canonical_url=excluded.canonical_url, og_title=excluded.og_title, og_description=excluded.og_description,
        no_deadline=excluded.no_deadline, updated_at=CURRENT_TIMESTAMP
    `;

    const paramsArt = [
      item.id, item.slug, item.title, item.category_slug, item.organization, item.job_type, item.location,
      item.qualification, item.salary, item.last_date, item.publish_date, item.official_link,
      item.featured ? 1 : 0, item.logo_initial, item.excerpt, contentJson, item.seo_title, item.meta_description,
      status, item.featured_image, item.image_alt, item.experience, item.positions, item.apply_link,
      item.is_verified ? 1 : 0, item.focus_keyword, item.canonical_url, item.og_title, item.og_description, item.no_deadline
    ];

    try {
      await queryD1(sqlArt, paramsArt);
      console.log(`  ✓ articles table updated in D1 for ${item.slug}`);
    } catch (e) {
      console.error(`  ✗ articles table failed in D1 for ${item.slug}:`, e.message);
    }

    // 2. Sync to daily_updates table
    const sqlDaily = `
      INSERT INTO daily_updates (
        id, slug, title, category, short_description, content, featured_image, image_alt,
        official_link, apply_link, deadline, publish_date, organization,
        location, qualification, experience, positions, job_type, salary,
        is_verified, featured, seo_title, meta_description, focus_keyword,
        canonical_url, og_title, og_description, status, no_deadline
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      ON CONFLICT(slug) DO UPDATE SET
        title=excluded.title, category=excluded.category, short_description=excluded.short_description,
        content=excluded.content, featured_image=excluded.featured_image, image_alt=excluded.image_alt,
        official_link=excluded.official_link, apply_link=excluded.apply_link, deadline=excluded.deadline,
        publish_date=excluded.publish_date, organization=excluded.organization, location=excluded.location,
        qualification=excluded.qualification, experience=excluded.experience, positions=excluded.positions,
        job_type=excluded.job_type, salary=excluded.salary, is_verified=excluded.is_verified,
        featured=excluded.featured, seo_title=excluded.seo_title, meta_description=excluded.meta_description,
        focus_keyword=excluded.focus_keyword, canonical_url=excluded.canonical_url, og_title=excluded.og_title,
        og_description=excluded.og_description, status=excluded.status, no_deadline=excluded.no_deadline,
        updated_at=CURRENT_TIMESTAMP
    `;

    const paramsDaily = [
      item.daily_update_id, item.slug, item.title, catLabel, item.excerpt, contentJson, item.featured_image, item.image_alt,
      item.official_link, item.apply_link, item.last_date, item.publish_date, item.organization,
      item.location, item.qualification, item.experience, item.positions, item.job_type, item.salary,
      item.is_verified ? 1 : 0, item.featured ? 1 : 0, item.seo_title, item.meta_description, item.focus_keyword,
      item.canonical_url, item.og_title, item.og_description, status, item.no_deadline
    ];

    try {
      await queryD1(sqlDaily, paramsDaily);
      console.log(`  ✓ daily_updates table updated in D1 for ${item.slug}`);
    } catch (e) {
      console.error(`  ✗ daily_updates table failed in D1 for ${item.slug}:`, e.message);
    }
  }

  // 3. Sync Article 335 Deadline Reminder to D1
  console.log('\n--- Syncing Article 335 Deadline Reminder to Remote D1 ---');
  const art335 = db.prepare('SELECT content FROM articles WHERE id = 335').get();
  if (art335) {
    try {
      await queryD1('UPDATE articles SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 335', [art335.content]);
      console.log('  ✓ Updated Article 335 in remote D1 articles table');
    } catch (e) {
      console.error('  ✗ Failed to update Article 335 in remote D1 articles:', e.message);
    }

    try {
      await queryD1("UPDATE daily_updates SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = 'spsc-jobs-2026-54-vacancies'", [art335.content]);
      console.log('  ✓ Updated Article 335 in remote D1 daily_updates table');
    } catch (e) {
      console.error('  ✗ Failed to update Article 335 in remote D1 daily_updates:', e.message);
    }
  }

  console.log('\n=== Remote D1 Sync Completed ===');
}

if (process.argv[1] && process.argv[1].includes('sync_oct22_remote_d1.js')) {
  const statusArg = process.argv[2] || 'draft';
  syncOct22RemoteD1(statusArg).catch(err => {
    console.error('Remote sync fatal error:', err);
    process.exit(1);
  });
}
