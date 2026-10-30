import fs from 'fs';
import Database from 'better-sqlite3';

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';

async function refreshToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const rt = toml.match(/refresh_token\s*=\s*"([^"]+)"/)[1];
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

const updates = [
  {
    slug: 'spsc-jobs-2026-54-vacancies',
    image: '/images/spsc-jobs-2026-54-vacancies.webp',
    alt: 'SPSC Jobs 2026 Advertisement No 05/2026 Apply by 23 October CareerDost',
    lastDate: '2026-10-23'
  },
  {
    slug: 'sindh-education-rsu-consultant-jobs-2026',
    image: '/images/rsu-sindh-social-safeguard-specialist-2026.webp',
    alt: 'Sindh Education Jobs 2026 Social Safeguard Specialist RSU PECHS Karachi CareerDost',
    lastDate: '2026-10-25'
  },
  {
    slug: 'sindh-courts-bps-1-4-jobs-2026',
    image: '/images/sindh-courts-bps-1-4-jobs-2026.webp',
    alt: 'Sindh District Courts Jobs 2026 BPS-01 to BPS-04 Walk-in Interviews High Court Karachi CareerDost',
    lastDate: '2026-10-31'
  }
];

async function run() {
  console.log('--- Syncing SQLite ---');
  const db = new Database('careerdost.sqlite');
  for (const u of updates) {
    db.prepare(`UPDATE articles SET featured_image = ?, last_date = ? WHERE slug = ?`).run(u.image, u.lastDate, u.slug);
    db.prepare(`UPDATE daily_updates SET featured_image = ?, deadline = ? WHERE slug = ?`).run(u.image, u.lastDate, u.slug);
  }
  console.log(`✓ SQLite updated`);

  console.log('\n--- Syncing Cloudflare D1 Remote Database ---');
  for (const u of updates) {
    try {
      await queryD1('UPDATE articles SET featured_image = ?, image_alt = ?, last_date = ? WHERE slug = ?', [u.image, u.alt, u.lastDate, u.slug]);
      await queryD1('UPDATE daily_updates SET featured_image = ?, image_alt = ?, deadline = ? WHERE slug = ?', [u.image, u.alt, u.lastDate, u.slug]);
      console.log(`✓ Cloudflare D1 updated: ${u.slug}`);
    } catch (err) {
      console.warn(`  D1 update warning for ${u.slug}:`, err.message);
    }
  }

  console.log('\nAll 3 existing articles synced successfully across SQLite and Remote D1!');
}

run().catch(console.error);
