import { queryD1 } from './audit_d1_investigation.mjs';
import Database from 'better-sqlite3';

async function updateBoth() {
  await queryD1("UPDATE articles SET featured_image = '/images/sindh-electric-scooty-scheme-2026.webp' WHERE id = 62 OR slug = 'sindh-govt-electric-scooty-scheme-2026-women'");
  await queryD1("UPDATE articles SET featured_image = '/images/virtual-university-fall-2026-admissions.webp' WHERE id = 107 OR slug = 'virtual-university-fall-2026-admissions'");
  console.log('✓ D1 updated 62 and 107 to webp');

  const db = new Database('careerdost.sqlite');
  db.prepare("UPDATE articles SET featured_image = '/images/sindh-electric-scooty-scheme-2026.webp' WHERE slug = 'sindh-govt-electric-scooty-scheme-2026-women'").run();
  db.prepare("UPDATE articles SET featured_image = '/images/virtual-university-fall-2026-admissions.webp' WHERE slug = 'virtual-university-fall-2026-admissions'").run();
  console.log('✓ SQLite updated 62 and 107 to webp');
}

updateBoth().catch(console.error);
