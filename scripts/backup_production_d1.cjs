const fs = require('fs');
const path = require('path');

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
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params })
  });
  const data = await res.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result[0].results;
}

async function createBackup() {
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `d1_backup_${timestamp}.json`);

  console.log(`Starting Cloudflare D1 backup at ${new Date().toISOString()}...`);

  const articles = await queryD1('SELECT * FROM articles ORDER BY id ASC;');
  const dailyUpdates = await queryD1('SELECT * FROM daily_updates ORDER BY id ASC;');
  const categories = await queryD1('SELECT * FROM categories ORDER BY id ASC;');
  const admins = await queryD1('SELECT id, username, email, role, created_at FROM admins ORDER BY id ASC;');

  const backupData = {
    timestamp: new Date().toISOString(),
    databaseId: 'defc3a6a-54b0-42e9-a36e-f1f6b1125d94',
    counts: {
      articles: articles.length,
      dailyUpdates: dailyUpdates.length,
      categories: categories.length,
      admins: admins.length
    },
    tables: {
      articles,
      daily_updates: dailyUpdates,
      categories,
      admins
    }
  };

  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`Backup completed successfully! Saved to: ${backupFile}`);
  console.log(`Backed up ${articles.length} articles, ${dailyUpdates.length} daily updates, ${categories.length} categories, ${admins.length} admins.`);
  return { backupFile, backupData };
}

createBackup().catch(err => {
  console.error('Backup failed:', err);
  process.exit(1);
});
