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

const items = [
  {
    slug: 'bank-of-punjab-relationship-officer-transaction-banking-2026',
    image: '/images/bop-relationship-officer-transaction-banking-2026.webp',
    alt: 'Bank of Punjab Jobs 2026 Relationship Officer Transaction Banking Karachi CareerDost'
  },
  {
    slug: 'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026',
    image: '/images/bop-relationship-manager-officer-cfc-2026.webp',
    alt: 'Bank of Punjab Jobs 2026 Relationship Manager and Officer CFC CareerDost'
  },
  {
    slug: 'memon-college-of-nursing-karachi-bsn-admissions-2026-27',
    image: '/images/memon-college-nursing-karachi-bsn-2026.webp',
    alt: 'Memon College of Nursing Karachi BS Nursing Admissions 2026-27 Batch X CareerDost'
  },
  {
    slug: 'niahs-hyderabad-bsn-nursing-admissions-2026-27',
    image: '/images/niahs-hyderabad-bsn-nursing-2026.webp',
    alt: 'National Institute of Allied Health Sciences Hyderabad BS Nursing Admissions 2026-27 CareerDost'
  },
  {
    slug: 'nts-nat-xi-2026-november-registration-guide',
    image: '/images/nts-nat-xi-november-2026.webp',
    alt: 'NTS NAT-XI 2026 November Test Registration and Schedule CareerDost'
  },
  {
    slug: 'gepco-jobs-2026',
    image: '/images/gepco-jobs-2026.webp',
    alt: 'GEPCO Jobs 2026 Assistant Manager IT AMI Project NTS CareerDost'
  },
  {
    slug: 'hec-uk-commonwealth-scholarships-2027-28',
    image: '/images/hec-commonwealth-scholarship-2027.webp',
    alt: 'HEC UK Commonwealth Scholarships 2027-28 Fully Funded Masters PhD CareerDost'
  },
  {
    slug: 'gwadar-shipyard-cfo-accounts-officer-jobs-2026',
    image: '/images/gwadar-shipyard-cfo-accounts-officer-2026.webp',
    alt: 'Gwadar Shipyard Jobs 2026 CFO and Accounts Officer Posts CareerDost'
  },
  {
    slug: 'imarat-finance-intern-jobs-2026',
    image: '/images/imarat-finance-intern-2026.webp',
    alt: 'IMARAT Group Careers 2026 Paid Finance Internship Program CareerDost'
  },
  {
    slug: 'gwadar-shipyard-assistant-jobs-2026',
    image: '/images/gwadar-shipyard-assistant-pps5-2026.webp',
    alt: 'Gwadar Shipyard Jobs 2026 Assistant PPS-05 Recruitment via NJP CareerDost'
  }
];

async function run() {
  console.log('--- Syncing SQLite ---');
  const db = new Database('careerdost.sqlite');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  console.log('Tables found:', tables);
  for (const tbl of ['articles', 'listings', 'posts', 'daily_updates']) {
    if (tables.includes(tbl)) {
      const cols = db.prepare(`PRAGMA table_info(${tbl})`).all().map(c => c.name);
      const imgCol = cols.find(c => c === 'featured_image' || c === 'featuredImage');
      if (imgCol) {
        for (const it of items) {
          db.prepare(`UPDATE ${tbl} SET ${imgCol} = ? WHERE slug = ?`).run(it.image, it.slug);
        }
        console.log(`✓ SQLite table ${tbl} updated`);
      }
    }
  }

  console.log('\n--- Syncing Cloudflare D1 Remote Database ---');
  for (const it of items) {
    try {
      await queryD1('UPDATE articles SET featured_image = ?, image_alt = ? WHERE slug = ?', [it.image, it.alt, it.slug]);
      await queryD1('UPDATE daily_updates SET featured_image = ?, image_alt = ? WHERE slug = ?', [it.image, it.alt, it.slug]);
      console.log(`✓ Cloudflare D1 updated: ${it.slug}`);
    } catch (err) {
      console.warn(`  D1 update warning for ${it.slug}:`, err.message);
    }
  }

  console.log('\nAll 10 user-provided images synced across SQLite and Remote D1!');
}

run().catch(console.error);
