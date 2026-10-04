import { execSync } from 'child_process';
import path from 'path';

const PATTERNS = [
  /pages\.dev/gi,
  /careers?dost/gi,
  /carrer/gi,
  /carrer/gi,
  /dost\.pk/gi,
  /careerdost/gi,
];

function runQuery(sql) {
  const cmd = `node node_modules/wrangler/bin/wrangler.js d1 execute careerdost-db --remote --command="${sql.replace(/"/g, '\\"')}" --json`;
  const raw = execSync(cmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  return parsed[0].results;
}

const tables = ['categories', 'articles', 'daily_updates', 'update_images'];

console.log('Searching remote D1 tables for brand / domain variations...');

for (const table of tables) {
  console.log(`Checking table: ${table}`);
  const rows = runQuery(`SELECT * FROM ${table};`);
  console.log(`  Fetched ${rows.length} rows from ${table}`);
  for (const row of rows) {
    for (const [col, val] of Object.entries(row)) {
      if (typeof val === 'string') {
        for (const pat of PATTERNS) {
          const matches = val.match(pat);
          if (matches) {
            console.log(`  [MATCH] Table: ${table}, Row ID/Slug: ${row.id || row.slug}, Col: ${col}`);
            console.log(`    Matched: "${matches[0]}"`);
            console.log(`    Snippet: ${val.substring(0, 120).replace(/\n/g, ' ')}`);
          }
        }
      }
    }
  }
}

console.log('Remote D1 audit complete.');
