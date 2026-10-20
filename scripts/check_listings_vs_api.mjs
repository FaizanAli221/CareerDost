import fs from 'fs';
import { listings } from '../src/data/listings.js';
import Database from 'better-sqlite3';

const targetSlugs = [
  'bank-of-punjab-relationship-officer-transaction-banking-2026',
  'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026',
  'memon-college-of-nursing-karachi-bsn-admissions-2026-27',
  'niahs-hyderabad-bsn-nursing-admissions-2026-27',
  'nts-nat-xi-2026-november-registration-guide',
  'gepco-jobs-2026',
  'hec-uk-commonwealth-scholarships-2027-28',
  'gwadar-shipyard-cfo-accounts-officer-jobs-2026',
  'imarat-finance-intern-jobs-2026',
  'gwadar-shipyard-assistant-jobs-2026',
  'hec-outstanding-research-awards-2026-27',
  'uajk-admissions-2026-deadline-extended',
  'petrol-price-reduced-pakistan-september-2026',
  'navttc-assistant-private-secretary-jobs-2026',
  'karachi-shipyard-technical-assistant-jobs-2026',
  'sbbu-affiliated-colleges-admissions-2026'
];

console.log('=== CHECKING LISTINGS.JS & SQLITE VS LIVE API ===');
const db = new Database('careerdost.sqlite');

for (const slug of targetSlugs) {
  const inListings = listings.find(l => l.slug === slug);
  const inSqlite = db.prepare('SELECT id, slug, featured_image, image_alt FROM articles WHERE slug = ?').get(slug);

  let apiArticle = null;
  try {
    const res = await fetch(`https://careerdost.blog/api/articles/${slug}`);
    const json = await res.json();
    apiArticle = json.data;
  } catch (e) {
    apiArticle = { error: e.message };
  }

  console.log(`\nSlug: ${slug}`);
  console.log(`  listings.js image: ${inListings?.featuredImage || inListings?.featured_image || 'NOT IN LISTINGS'}`);
  console.log(`  sqlite image: ${inSqlite?.featured_image || 'NOT IN SQLITE'}`);
  console.log(`  live /api/articles image: ${apiArticle?.featured_image || apiArticle?.featuredImage || JSON.stringify(apiArticle)}`);
}
