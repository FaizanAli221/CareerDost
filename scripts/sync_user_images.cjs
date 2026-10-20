const fs = require('fs');
const Database = require('better-sqlite3');
const { execSync } = require('child_process');

console.log('--- Syncing SQLite ---');
const db = new Database('careerdost.sqlite');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in SQLite:', tables.map(t => t.name));

const targetTable = tables.find(t => t.name === 'listings' || t.name === 'jobs' || t.name === 'articles');
const tableName = targetTable ? targetTable.name : 'listings';
console.log('Using table:', tableName);

const cols = db.prepare(`PRAGMA table_info(${tableName})`).all();
console.log('Columns in', tableName, ':', cols.map(c => c.name));

const imageCol = cols.find(c => c.name === 'featured_image' || c.name === 'featuredImage' || c.name === 'image');
console.log('Image column:', imageCol ? imageCol.name : 'NOT FOUND');

const pairs = [
  ['bop-relationship-officer-transaction-banking-2026.svg', 'bop-relationship-officer-transaction-banking-2026.webp'],
  ['bop-relationship-manager-officer-cfc-2026.svg', 'bop-relationship-manager-officer-cfc-2026.webp'],
  ['gwadar-shipyard-cfo-accounts-officer-2026.svg', 'gwadar-shipyard-cfo-accounts-officer-2026.webp'],
  ['imarat-finance-intern-2026.svg', 'imarat-finance-intern-2026.webp'],
  ['gwadar-shipyard-assistant-pps5-2026.svg', 'gwadar-shipyard-assistant-pps5-2026.webp']
];

if (imageCol) {
  for (const [from, to] of pairs) {
    const row = db.prepare(`SELECT slug, ${imageCol.name} FROM ${tableName} WHERE ${imageCol.name} LIKE ?`).get(`%${from}%`);
    if (row) {
      const updated = row[imageCol.name].replace(from, to);
      db.prepare(`UPDATE ${tableName} SET ${imageCol.name} = ? WHERE slug = ?`).run(updated, row.slug);
      console.log(`Updated SQLite ${row.slug} -> ${updated}`);
    }
  }
}

console.log('--- Syncing Cloudflare D1 Remote Database ---');
const d1Queries = [
  "UPDATE listings SET featured_image = '/images/bop-relationship-officer-transaction-banking-2026.webp' WHERE slug = 'bank-of-punjab-relationship-officer-transaction-banking-2026';",
  "UPDATE listings SET featured_image = '/images/bop-relationship-manager-officer-cfc-2026.webp' WHERE slug = 'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026';",
  "UPDATE listings SET featured_image = '/images/gwadar-shipyard-cfo-accounts-officer-2026.webp' WHERE slug = 'gwadar-shipyard-cfo-accounts-officer-jobs-2026';",
  "UPDATE listings SET featured_image = '/images/imarat-finance-intern-2026.webp' WHERE slug = 'imarat-finance-intern-jobs-2026';",
  "UPDATE listings SET featured_image = '/images/gwadar-shipyard-assistant-pps5-2026.webp' WHERE slug = 'gwadar-shipyard-assistant-jobs-2026';"
];

for (const q of d1Queries) {
  try {
    console.log('Running D1 command:', q);
    const cmd = `npx wrangler d1 execute careerdost-db --remote --command="${q}"`;
    const res = execSync(cmd, { encoding: 'utf8' });
    console.log('D1 Result:', res.trim());
  } catch (err) {
    console.warn('D1 Query warning:', err.message);
  }
}
