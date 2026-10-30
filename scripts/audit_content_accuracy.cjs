const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const batches = [
  'scripts/update_batch1_universities.cjs',
  'scripts/update_batch2_banking.cjs',
  'scripts/update_batch3_public_sector.cjs',
  'scripts/update_batch4_internships.cjs',
  'scripts/update_batch5_schemes_results.cjs',
  'scripts/update_batch6_admissions_scholarships.cjs'
];

const allPriorityASlugs = [];
batches.forEach(b => {
  const code = fs.readFileSync(b, 'utf8');
  const matches = [...code.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  allPriorityASlugs.push(...matches);
});

console.log('Total Priority A slugs:', allPriorityASlugs.length);

const rows = db.prepare(`SELECT id, title, slug, category_slug, official_link, apply_link, content, status FROM articles WHERE slug IN (${allPriorityASlugs.map(() => '?').join(',')})`).all(...allPriorityASlugs);

console.log('Found in SQLite:', rows.length);

// Sample 10 random articles across categories
const sampleIndices = [0, 3, 6, 9, 12, 16, 20, 24, 28, 32];
const sampled = sampleIndices.map(i => rows[i]).filter(Boolean);

console.log('\n=== DETAILED FACTUAL AUDIT OF SAMPLED REWRITTEN ARTICLES ===\n');

sampled.forEach((a, idx) => {
  console.log(`[Sample ${idx + 1}] ID: ${a.id} | Slug: ${a.slug}`);
  console.log(`Title: ${a.title}`);
  console.log(`Category: ${a.category_slug}`);
  console.log(`Official Link: ${a.official_link}`);
  console.log(`Apply Link: ${a.apply_link}`);
  
  let contentStr = '';
  try {
    const parsed = JSON.parse(a.content);
    contentStr = Array.isArray(parsed) ? parsed.join('\n\n') : a.content;
  } catch {
    contentStr = a.content;
  }
  
  const wordCount = contentStr.split(/\s+/).length;
  const hasBps = /bps[-\s]?\d+/i.test(contentStr);
  const hasSalary = /salary|stipend|remuneration|pay/i.test(contentStr);
  const hasEligibility = /eligibility|qualification|criteria/i.test(contentStr);
  const hasQuota = /quota|merit|provincial|domicile/i.test(contentStr);
  const hasDeadline = /deadline|last date|closing/i.test(contentStr);
  const hasChallanFee = /challan|fee|rs\.?\s*\d+/i.test(contentStr);
  const hasFaq = /faq|frequently asked/i.test(contentStr);

  console.log(`Words: ${wordCount} | Has BPS: ${hasBps} | Has Salary/Stipend: ${hasSalary} | Has Eligibility: ${hasEligibility} | Has Quota/Domicile: ${hasQuota} | Has Deadline: ${hasDeadline} | Has Fee/Challan: ${hasChallanFee} | Has FAQ: ${hasFaq}`);
  console.log('----------------------------------------------------');
});
