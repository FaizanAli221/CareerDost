import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { queryD1 } from './audit_d1_investigation.mjs';

async function run() {
  console.log('\n=== 2. UPDATING LOCAL SQLITE DATABASE ===');
  const db = new Database('careerdost.sqlite');

  // CBD Punjab
  db.prepare("UPDATE articles SET featured_image = '/images/cbd-punjab-youth-career-program-2026.webp' WHERE slug = 'cbd-punjab-paid-internship-2026-youth-career-program'").run();
  // Sindh Pink Scooty
  db.prepare("UPDATE articles SET featured_image = '/images/sindh-electric-scooty-scheme-2026.webp' WHERE slug = 'sindh-pink-scooty-scheme-2026-online-registration-eligibility'").run();
  // VU
  db.prepare("UPDATE articles SET featured_image = '/images/virtual-university-fall-2026-admissions.webp' WHERE slug = 'virtual-university-admissions-2026-deadline-tomorrow'").run();
  db.prepare("UPDATE daily_updates SET featured_image = '/images/virtual-university-fall-2026-admissions.webp' WHERE slug = 'virtual-university-admissions-2026-deadline-tomorrow'").run();
  
  // Check if article 73 exists in sqlite
  const njpRow = db.prepare("SELECT id FROM articles WHERE slug = 'httpswwwnjpgovpk'").get();
  if (njpRow) {
    db.prepare("UPDATE articles SET last_date = '2026-10-11', no_deadline = 0, official_link = 'https://njp.gov.pk/', apply_link = 'https://njp.gov.pk/', featured_image = '/images/pidcl-site-engineer-jobs-2026.webp' WHERE slug = 'httpswwwnjpgovpk'").run();
    console.log('✓ SQLite Article httpswwwnjpgovpk updated');
  } else {
    // Fetch from D1 and insert into SQLite without id conflict
    const d1Njp = await queryD1("SELECT * FROM articles WHERE slug = 'httpswwwnjpgovpk'");
    if (d1Njp && d1Njp[0]) {
      const row = { ...d1Njp[0] };
      delete row.id;
      const cols = Object.keys(row);
      const placeholders = cols.map(() => '?').join(',');
      db.prepare(`INSERT INTO articles (${cols.join(',')}) VALUES (${placeholders})`).run(...Object.values(row));
      console.log('✓ Inserted Article httpswwwnjpgovpk into SQLite');
    }
  }

  // Check if article 81 exists in sqlite
  const vuRow = db.prepare("SELECT id FROM articles WHERE slug = 'virtual-university-admissions-2026-deadline-tomorrow'").get();
  if (!vuRow) {
    const d1Vu = await queryD1("SELECT * FROM articles WHERE slug = 'virtual-university-admissions-2026-deadline-tomorrow'");
    if (d1Vu && d1Vu[0]) {
      const row = { ...d1Vu[0] };
      delete row.id;
      const cols = Object.keys(row);
      const placeholders = cols.map(() => '?').join(',');
      db.prepare(`INSERT INTO articles (${cols.join(',')}) VALUES (${placeholders})`).run(...Object.values(row));
      console.log('✓ Inserted Article virtual-university-admissions-2026-deadline-tomorrow into SQLite');
    }
  }

  // Update any sqlite articles to .webp if .webp exists
  const publicFiles = new Set(fs.readdirSync('public/images'));
  const allSqliteArticles = db.prepare('SELECT id, slug, featured_image FROM articles').all();
  let sqliteUpdatedCount = 0;
  for (const a of allSqliteArticles) {
    if (a.featured_image && a.featured_image.endsWith('.jpg')) {
      const webp = a.featured_image.replace('/images/', '').replace('.jpg', '.webp');
      if (publicFiles.has(webp)) {
        db.prepare("UPDATE articles SET featured_image = ? WHERE id = ?").run('/images/' + webp, a.id);
        sqliteUpdatedCount++;
      }
    }
  }
  console.log(`✓ Synchronized ${sqliteUpdatedCount} additional image paths to .webp in SQLite`);

  console.log('\n=== 3. UPDATING SRC/DATA/LISTINGS.JS ===');
  let listingsContent = fs.readFileSync('src/data/listings.js', 'utf8');
  let listingsReplaced = 0;

  for (const f of publicFiles) {
    if (f.endsWith('.webp')) {
      const jpg = f.replace('.webp', '.jpg');
      const targetStr = `/images/${jpg}`;
      const replacementStr = `/images/${f}`;
      if (listingsContent.includes(targetStr)) {
        listingsContent = listingsContent.replaceAll(targetStr, replacementStr);
        listingsReplaced++;
      }
    }
  }

  // Also replace any SVG placeholders in listings.js
  if (listingsContent.includes('/images/cbd-punjab-paid-internship-2026.svg')) {
    listingsContent = listingsContent.replaceAll('/images/cbd-punjab-paid-internship-2026.svg', '/images/cbd-punjab-youth-career-program-2026.webp');
  }
  if (listingsContent.includes('/images/sindh-pink-scooty-scheme-2026.svg')) {
    listingsContent = listingsContent.replaceAll('/images/sindh-pink-scooty-scheme-2026.svg', '/images/sindh-electric-scooty-scheme-2026.webp');
  }
  if (listingsContent.includes('/images/virtual-university-admissions-2026.svg')) {
    listingsContent = listingsContent.replaceAll('/images/virtual-university-admissions-2026.svg', '/images/virtual-university-fall-2026-admissions.webp');
  }

  fs.writeFileSync('src/data/listings.js', listingsContent, 'utf8');
  console.log(`✓ listings.js updated: replaced ${listingsReplaced} image references with .webp`);

  console.log('\n=== FIXES APPLIED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('Execution error:', err);
  process.exit(1);
});
