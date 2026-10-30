const fs = require('fs');
const crypto = require('crypto');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

async function auditLive() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  console.log('Fetching live articles...');
  const resArticles = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const dataArticles = await resArticles.json();
  const articles = dataArticles.data || [];

  console.log('Fetching live updates...');
  const resUpdates = await fetch('https://careerdost.blog/api/admin/updates', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const dataUpdates = await resUpdates.json();
  const updates = dataUpdates.data || [];

  console.log(`Live Articles: Total = ${articles.length}`);
  const artByStatus = {};
  articles.forEach(a => { artByStatus[a.status] = (artByStatus[a.status] || 0) + 1; });
  console.log('Articles by status:', artByStatus);

  console.log(`Live Updates: Total = ${updates.length}`);
  const updByStatus = {};
  updates.forEach(u => { updByStatus[u.status] = (updByStatus[u.status] || 0) + 1; });
  console.log('Updates by status:', updByStatus);

  // Group articles by category
  const artByCat = {};
  articles.forEach(a => {
    if (a.status === 'published') {
      artByCat[a.category] = (artByCat[a.category] || 0) + 1;
    }
  });
  console.log('\nPublished Articles by category:');
  console.table(artByCat);

  // Save full JSON for inspection
  fs.writeFileSync('scripts/live_articles_inventory.json', JSON.stringify(articles, null, 2));
  fs.writeFileSync('scripts/live_updates_inventory.json', JSON.stringify(updates, null, 2));
  console.log('\nSaved full inventories to scripts/live_articles_inventory.json and live_updates_inventory.json');
}

auditLive().catch(console.error);
