const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const rows = db.prepare("SELECT id, slug, title, category_slug, last_date, no_deadline, content, official_link, apply_link FROM articles WHERE status = 'published' ORDER BY id ASC").all();

console.log('Total published articles in SQLite:', rows.length);

const currentDate = new Date('2026-10-31');

const summary = {
  total: rows.length,
  byCategory: {},
  needsContentEnrichment: [],
  needsClosedNotice: [],
  alreadyGood: []
};

rows.forEach(r => {
  summary.byCategory[r.category_slug] = (summary.byCategory[r.category_slug] || 0) + 1;
  
  let c = r.content;
  try {
    const p = JSON.parse(c);
    c = Array.isArray(p) ? p.join('\n\n') : c;
  } catch {}
  const words = c.split(/\s+/).filter(Boolean).length;
  
  let isExpired = false;
  if (r.last_date && !r.no_deadline) {
    const d = new Date(r.last_date);
    if (!isNaN(d.getTime()) && d < currentDate) {
      isExpired = true;
    }
  }

  const hasClosedInBody = /application (has closed|deadline passed|closed|expired)|recruitment (closed|completed)|status:\s*closed/i.test(c);

  if (words < 580) {
    summary.needsContentEnrichment.push({ id: r.id, slug: r.slug, title: r.title, words, cat: r.category_slug, lastDate: r.last_date, isExpired, hasClosedInBody });
  } else if (isExpired && !hasClosedInBody && !['career-guides', 'government-schemes'].includes(r.category_slug)) {
    summary.needsClosedNotice.push({ id: r.id, slug: r.slug, title: r.title, words, cat: r.category_slug, lastDate: r.last_date });
  } else {
    summary.alreadyGood.push({ id: r.id, slug: r.slug, words, cat: r.category_slug });
  }
});

console.log('Articles by category:', summary.byCategory);
console.log('\nNeeds Content Enrichment (<580 words):', summary.needsContentEnrichment.length);
console.log('Needs Closed Notice in Body (solid words, expired deadline):', summary.needsClosedNotice.length);
console.log('Already Good / Satisfies Quality Criteria:', summary.alreadyGood.length);

fs.writeFileSync('scripts/comprehensive_recovery_plan.json', JSON.stringify(summary, null, 2));
