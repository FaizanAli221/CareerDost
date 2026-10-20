import fs from 'fs';

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

export async function queryD1(sql, params = []) {
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
  return json.result[0]?.results || [];
}

async function run() {
  console.log('--- 1. Querying for httpswwwnjpgovpk or njp in D1 ---');
  const articlesNjp = await queryD1("SELECT id, slug, title, last_date, publish_date, official_link, apply_link FROM articles WHERE slug LIKE '%njp%' OR slug LIKE '%http%'");
  console.log('Articles matching njp/http:', articlesNjp);

  const updatesNjp = await queryD1("SELECT id, slug, title, deadline, publish_date, official_link, apply_link FROM daily_updates WHERE slug LIKE '%njp%' OR slug LIKE '%http%'");
  console.log('Daily Updates matching njp/http:', updatesNjp);

  console.log('\n--- 2. Fetching live URL https://careerdost.blog/jobs/httpswwwnjpgovpk ---');
  try {
    const res = await fetch('https://careerdost.blog/jobs/httpswwwnjpgovpk');
    console.log('Live status:', res.status);
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'N/A');
    console.log('H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').trim() : 'N/A');
    // Extract dates or deadlinse from HTML
    const deadlineMatches = html.match(/deadline[^\n<]{0,100}/gi) || [];
    console.log('Deadlines in HTML:', deadlineMatches.slice(0, 5));
  } catch (e) {
    console.error('Fetch error:', e.message);
  }

  console.log('\n--- 3. Checking all articles in D1 to see total count and image URLs ---');
  const allArticles = await queryD1("SELECT id, slug, title, featured_image, image_alt, last_date FROM articles ORDER BY id DESC");
  console.log('Total articles in D1:', allArticles.length);
  const svgArticles = allArticles.filter(a => a.featured_image && a.featured_image.endsWith('.svg'));
  console.log('Articles with .svg in D1:', svgArticles.length);
  svgArticles.forEach(a => console.log(`  [${a.id}] ${a.slug} -> ${a.featured_image}`));

  const webpArticles = allArticles.filter(a => a.featured_image && a.featured_image.endsWith('.webp'));
  console.log('Articles with .webp in D1:', webpArticles.length);

  const jpgArticles = allArticles.filter(a => a.featured_image && (a.featured_image.endsWith('.jpg') || a.featured_image.endsWith('.png')));
  console.log('Articles with .jpg/.png in D1:', jpgArticles.length);

  const emptyImageArticles = allArticles.filter(a => !a.featured_image);
  console.log('Articles with empty image in D1:', emptyImageArticles.length);
  emptyImageArticles.forEach(a => console.log(`  [${a.id}] ${a.slug}`));

  console.log('\n--- 4. Checking daily_updates table in D1 ---');
  const allUpdates = await queryD1("SELECT id, slug, title, featured_image, deadline FROM daily_updates ORDER BY id DESC");
  console.log('Total daily_updates in D1:', allUpdates.length);
  const svgUpdates = allUpdates.filter(u => u.featured_image && u.featured_image.endsWith('.svg'));
  console.log('Daily updates with .svg in D1:', svgUpdates.length);
  svgUpdates.forEach(u => console.log(`  [${u.id}] ${u.slug} -> ${u.featured_image}`));
}

run().catch(console.error);
