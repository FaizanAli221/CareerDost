const fs = require('fs');
const Database = require('better-sqlite3');

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

async function run() {
  console.log('=== AUDITING LOCAL SQLITE VS PRODUCTION CLOUDFLARE D1 ===\n');

  const localDb = new Database('careerdost.sqlite');

  // Check counts
  const localArticlesCount = localDb.prepare('SELECT count(*) as count, status FROM articles GROUP BY status').all();
  const localUpdatesCount = localDb.prepare('SELECT count(*) as count, status FROM daily_updates GROUP BY status').all();
  console.log('--- LOCAL SQLITE COUNTS ---');
  console.log('Articles by status:', localArticlesCount);
  console.log('Daily Updates by status:', localUpdatesCount);

  console.log('\n--- PRODUCTION D1 COUNTS ---');
  const d1ArticlesCount = await queryD1('SELECT count(*) as count, status FROM articles GROUP BY status');
  console.log('D1 Articles by status:', d1ArticlesCount.results);
  const d1UpdatesCount = await queryD1('SELECT count(*) as count, status FROM daily_updates GROUP BY status');
  console.log('D1 Daily Updates by status:', d1UpdatesCount.results);

  console.log('\n--- SPECIFIC ARTICLES AUDIT ---');
  const testArticles = [
    { name: 'Askari Bank', localId: 512, slug: 'askari-bank-jobs-october-2026-karachi' },
    { name: 'Engineering Development Board', localId: 518, slug: 'engineering-development-board-jobs-october-2026' },
    { name: 'PSEB Jobs', localId: 519, slug: 'pseb-government-it-jobs-october-2026' },
    { name: 'Sindh Wheat Subsidy', localId: 355, slug: 'sindh-wheat-subsidy-benazir-hari-card-2026' },
    { name: 'Sindh High Court Shorthand Test', localId: 389, slug: 'sindh-high-court-personal-assistant-shorthand-test-2026', table: 'daily_updates' }
  ];

  for (const t of testArticles) {
    const tbl = t.table || 'articles';
    console.log(`\nChecking [${t.name}] (Slug: ${t.slug}):`);
    
    // Check local sqlite
    const localRow = localDb.prepare(`SELECT id, slug, title, status FROM ${tbl} WHERE slug = ? OR id = ?`).get(t.slug, t.localId);
    console.log('  Local SQLite:   ', localRow ? `FOUND (ID: ${localRow.id}, Status: ${localRow.status}, Title: "${localRow.title.slice(0, 40)}...")` : 'NOT FOUND');

    // Check production D1
    const d1Row = await queryD1(`SELECT id, slug, title, status FROM ${tbl} WHERE slug = ? OR id = ?`, [t.slug, t.localId]);
    console.log('  Production D1:  ', d1Row.results && d1Row.results.length > 0 ? `FOUND (ID: ${d1Row.results[0].id}, Status: ${d1Row.results[0].status}, Title: "${d1Row.results[0].title.slice(0, 40)}...")` : 'NOT FOUND');

    // Also check if any similar slug or title exists in D1
    const keyword = t.name.split(' ')[0];
    const d1Similar = await queryD1(`SELECT id, slug, title, status FROM ${tbl} WHERE slug LIKE ? OR title LIKE ? LIMIT 5`, [`%${keyword}%`, `%${keyword}%`]);
    if (d1Similar.results && d1Similar.results.length > 0) {
      console.log(`  Similar in D1:  `, d1Similar.results.map(r => `[ID ${r.id}, ${r.status}] ${r.slug}`).join(' | '));
    }
  }

  // Check all drafts in local SQLite
  console.log('\n--- ALL DRAFTS IN LOCAL SQLITE ---');
  const localDrafts = localDb.prepare("SELECT id, slug, title, category_slug, status FROM articles WHERE status = 'draft'").all();
  console.log(`Local Draft Articles (${localDrafts.length}):`);
  localDrafts.forEach(d => console.log(`  [ID ${d.id}] ${d.slug} -> "${d.title.slice(0, 40)}..."`));

  const localDraftUpdates = localDb.prepare("SELECT id, slug, title, category, status FROM daily_updates WHERE status = 'draft'").all();
  console.log(`Local Draft Updates (${localDraftUpdates.length}):`);
  localDraftUpdates.forEach(d => console.log(`  [ID ${d.id}] ${d.slug} -> "${d.title.slice(0, 40)}..."`));

  // Check all drafts in Production D1
  console.log('\n--- ALL DRAFTS IN PRODUCTION D1 ---');
  const d1DraftArticles = await queryD1("SELECT id, slug, title, category_slug, status FROM articles WHERE status = 'draft'");
  console.log(`D1 Draft Articles (${d1DraftArticles.results.length}):`);
  d1DraftArticles.results.forEach(d => console.log(`  [ID ${d.id}] ${d.slug} -> "${d.title.slice(0, 40)}..."`));

  const d1DraftUpdates = await queryD1("SELECT id, slug, title, category, status FROM daily_updates WHERE status = 'draft'");
  console.log(`D1 Draft Updates (${d1DraftUpdates.results.length}):`);
  d1DraftUpdates.results.forEach(d => console.log(`  [ID ${d.id}] ${d.slug} -> "${d.title.slice(0, 40)}..."`));
}

run().catch(console.error);
