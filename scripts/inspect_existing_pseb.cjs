const fs = require('fs');

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
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params })
  });
  let data = await res.json();
  if (!data.success && data.errors && data.errors[0]?.code === 10000) {
    token = await refreshToken();
    res = await fetch(d1QueryUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params })
    });
    data = await res.json();
  }
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result[0].results;
}

async function run() {
  const psebArticles = await queryD1("SELECT id, slug, title, status, last_date, excerpt, content FROM articles WHERE slug LIKE '%pseb%' OR title LIKE '%PSEB%';");
  console.log('PSEB Articles in D1:', psebArticles.length);
  for (const a of psebArticles) {
    console.log(`\n--------------------------------------------------`);
    console.log(`[ID ${a.id}] Status: ${a.status} | Slug: ${a.slug} | Last Date: ${a.last_date}`);
    console.log(`Title: ${a.title}`);
    console.log(`Excerpt: ${a.excerpt}`);
    try {
      const content = JSON.parse(a.content);
      console.log('Content sections count:', content.length);
      console.log('Section 0:', content[0]?.slice(0, 150));
      console.log('Section 1:', content[1]?.slice(0, 250));
      console.log('Section 2:', content[2]?.slice(0, 250));
    } catch {
      console.log('Raw content:', a.content?.slice(0, 200));
    }
  }
}

run().catch(console.error);
