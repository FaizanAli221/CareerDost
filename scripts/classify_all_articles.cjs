const fs = require('fs');

const articles = JSON.parse(fs.readFileSync('scripts/live_articles_inventory.json', 'utf8'));
const publishedArticles = articles.filter(a => a.status === 'published');

const currentDate = new Date('2026-10-30');

const auditList = [];

publishedArticles.forEach(art => {
  let text = '';
  if (Array.isArray(art.content)) {
    text = art.content.join('\n\n');
  } else if (typeof art.content === 'string') {
    try {
      const parsed = JSON.parse(art.content);
      text = Array.isArray(parsed) ? parsed.join('\n\n') : String(art.content);
    } catch {
      text = String(art.content);
    }
  }

  const words = text.replace(/<[^>]+>/g, ' ').replace(/[#*`|_\[\]\(\)]/g, ' ').split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Deadline check
  let isExpired = false;
  let deadlineStr = art.lastDate;
  if (deadlineStr && !art.noDeadline) {
    const d = new Date(deadlineStr);
    if (!isNaN(d.getTime()) && d < currentDate) {
      isExpired = true;
    }
  }

  // Check structure elements
  const hasHeadings = /##\s+|###\s+/.test(text);
  const hasTable = text.includes('|') && /\|\s*:?-{2,}:?\s*\|/.test(text);
  const hasFaq = text.toLowerCase().includes('faq') || text.toLowerCase().includes('frequently asked');
  const hasStepByStep = text.toLowerCase().includes('how to apply') || text.toLowerCase().includes('step-by-step') || text.toLowerCase().includes('application procedure');
  const hasOfficialLink = Boolean(art.officialLink && art.officialLink.startsWith('http')) || Boolean(art.applyLink && art.applyLink.startsWith('http')) || text.includes('http://') || text.includes('https://');

  // Classification
  let category = art.category;
  let classification = 'GOOD';
  let issue = 'None';
  let recommendation = 'Retain as high quality';
  let action = 'keep';

  if (!hasOfficialLink) {
    classification = 'NEEDS_VERIFICATION';
    issue = 'Missing outbound official source link';
    recommendation = 'Add verified official departmental portal or notification URL';
    action = 'improve';
  } else if (wordCount < 300) {
    classification = 'LOW_VALUE_RISK';
    issue = `Thin content (${wordCount} words) — lacks sufficient depth and user value`;
    recommendation = 'Expand with verified eligibility, required documents, application process, and FAQs';
    action = 'improve';
  } else if (isExpired && !['results', 'government-schemes', 'career-guides'].includes(category)) {
    classification = 'OUTDATED';
    issue = `Application deadline expired on ${deadlineStr}`;
    recommendation = 'Add prominent expired banner, guide readers on next recruitment cycles / test status, or update';
    action = 'update';
  } else if (wordCount < 600 || !hasFaq || !hasStepByStep) {
    classification = 'NEEDS_IMPROVEMENT';
    issue = `Moderate depth (${wordCount} words) — missing structured application steps or FAQs`;
    recommendation = 'Add step-by-step instructions, eligibility table, or FAQs';
    action = 'improve';
  } else {
    classification = 'GOOD';
    issue = 'Well-structured, comprehensive guide';
    recommendation = 'Maintain regular updates';
    action = 'keep';
  }

  auditList.push({
    id: art.id,
    slug: art.slug,
    title: art.title,
    category: art.category,
    wordCount,
    lastDate: art.lastDate,
    isExpired,
    hasTable,
    hasFaq,
    hasStepByStep,
    hasOfficialLink,
    classification,
    issue,
    recommendation,
    action
  });
});

console.log(`Total analyzed: ${auditList.length}`);
const counts = {};
auditList.forEach(a => { counts[a.classification] = (counts[a.classification] || 0) + 1; });
console.log('Classification counts:', counts);

// Let's inspect the LOW_VALUE_RISK articles
const lowValue = auditList.filter(a => a.classification === 'LOW_VALUE_RISK');
console.log(`\n--- LOW VALUE RISK ARTICLES (${lowValue.length}) ---`);
lowValue.forEach(a => console.log(`[${a.id}] (${a.wordCount} words) ${a.title} -> ${a.category}`));

// Let's inspect the OUTDATED articles
const outdated = auditList.filter(a => a.classification === 'OUTDATED');
console.log(`\n--- OUTDATED ARTICLES (${outdated.length}) ---`);
outdated.forEach(a => console.log(`[${a.id}] (Expired: ${a.lastDate}) ${a.title}`));

// Save audit inventory
fs.writeFileSync('scripts/classified_articles_inventory.json', JSON.stringify(auditList, null, 2));
console.log('\nSaved full classified inventory to scripts/classified_articles_inventory.json');
