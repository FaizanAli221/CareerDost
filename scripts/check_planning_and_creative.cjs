const fs = require('fs');

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';

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
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result[0].results;
}

async function run() {
  const planningArticles = await queryD1("SELECT id, slug, title, status FROM articles WHERE slug LIKE '%planning%' OR title LIKE '%Planning%';");
  console.log('Ministry of Planning Articles in D1:', planningArticles);

  const creativeArticles = await queryD1("SELECT id, slug, title, status FROM articles WHERE slug LIKE '%creative%' OR title LIKE '%Creative%';");
  console.log('Creative Lead Articles in D1:', creativeArticles);
}

run().catch(console.error);
