const fs = require('fs');

const articles = JSON.parse(fs.readFileSync('scripts/live_articles_inventory.json', 'utf8'));
const updates = JSON.parse(fs.readFileSync('scripts/live_updates_inventory.json', 'utf8'));

console.log(`Loaded ${articles.length} articles and ${updates.length} updates.`);

const publishedArticles = articles.filter(a => a.status === 'published');
console.log(`Analyzing ${publishedArticles.length} published articles...`);

const stats = {
  totalPublished: publishedArticles.length,
  wordCounts: [],
  categories: {},
  missingOfficialLink: [],
  missingDeadline: [],
  missingEducation: [],
  expiredCount: 0,
  shortContent: [], // < 300 words
  mediumContent: [], // 300-600 words
  longContent: [], // > 600 words
  missingImage: [],
  brokenImagePattern: [],
  aiPatternIndicators: [],
  duplicateCheck: {},
  classifications: {
    GOOD: [],
    NEEDS_IMPROVEMENT: [],
    LOW_VALUE_RISK: [],
    OUTDATED: [],
    NEEDS_VERIFICATION: []
  }
};

const currentDate = new Date('2026-10-30');

publishedArticles.forEach(art => {
  const cat = art.category || 'uncategorized';
  stats.categories[cat] = (stats.categories[cat] || 0) + 1;

  // Content parsing
  let text = '';
  if (Array.isArray(art.content)) {
    text = art.content.join(' ');
  } else if (typeof art.content === 'string') {
    try {
      const parsed = JSON.parse(art.content);
      text = Array.isArray(parsed) ? parsed.join(' ') : String(art.content);
    } catch {
      text = String(art.content);
    }
  }

  // Word count calculation
  const words = text.replace(/<[^>]+>/g, ' ').replace(/[#*`|_\[\]\(\)]/g, ' ').split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  stats.wordCounts.push({ id: art.id, slug: art.slug, title: art.title, wordCount, category: cat });

  // Official link check
  const hasOfficialLink = Boolean(art.officialLink && art.officialLink.startsWith('http'));
  if (!hasOfficialLink) {
    stats.missingOfficialLink.push({ id: art.id, slug: art.slug, title: art.title });
  }

  // Deadline & Outdated check
  let isExpired = false;
  if (art.deadline) {
    const d = new Date(art.deadline);
    if (!isNaN(d.getTime()) && d < currentDate) {
      isExpired = true;
      stats.expiredCount++;
    }
  } else {
    stats.missingDeadline.push({ id: art.id, slug: art.slug, title: art.title, cat });
  }

  // Education/qualification check
  if (!art.education && !text.toLowerCase().includes('qualification') && !text.toLowerCase().includes('eligibility') && !text.toLowerCase().includes('matric') && !text.toLowerCase().includes('bachelor') && !text.toLowerCase().includes('master')) {
    stats.missingEducation.push({ id: art.id, slug: art.slug, title: art.title });
  }

  // Image check
  if (!art.featuredImage) {
    stats.missingImage.push({ id: art.id, slug: art.slug, title: art.title });
  }

  // Word count buckets
  if (wordCount < 300) {
    stats.shortContent.push({ id: art.id, slug: art.slug, title: art.title, wordCount, cat });
  } else if (wordCount < 600) {
    stats.mediumContent.push({ id: art.id, slug: art.slug, title: art.title, wordCount, cat });
  } else {
    stats.longContent.push({ id: art.id, slug: art.slug, title: art.title, wordCount, cat });
  }

  // Check repetitive AI phrasing
  const lowerText = text.toLowerCase();
  const aiPhrases = [
    'in conclusion',
    'it is important to note that',
    'furthermore, it is worth mentioning',
    'embark on a journey',
    'testament to',
    'delve into',
    'beacon of hope',
    'plethora of',
    'tapestry of'
  ];
  const matchedAi = aiPhrases.filter(p => lowerText.includes(p));
  if (matchedAi.length >= 2) {
    stats.aiPatternIndicators.push({ id: art.id, slug: art.slug, title: art.title, matches: matchedAi });
  }

  // Check duplicates
  const simpleTitle = art.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (stats.duplicateCheck[simpleTitle]) {
    stats.duplicateCheck[simpleTitle].push({ id: art.id, slug: art.slug });
  } else {
    stats.duplicateCheck[simpleTitle] = [{ id: art.id, slug: art.slug }];
  }

  // CLASSIFICATION LOGIC
  // E. NEEDS VERIFICATION: Missing official source, or unverified claims
  // D. OUTDATED: Deadline passed, or mentions old years without update notice
  // C. LOW VALUE RISK: Word count < 300, or generic announcement rewrite with no practical details
  // B. NEEDS IMPROVEMENT: 300-600 words, missing practical steps, or missing faqs/tables
  // A. GOOD: > 600 words, structured, has official links, clear steps, tables/blockquotes
  
  if (!hasOfficialLink && cat !== 'government-schemes') {
    stats.classifications.NEEDS_VERIFICATION.push({
      id: art.id,
      slug: art.slug,
      title: art.title,
      cat,
      wordCount,
      reason: 'Missing verifiable official source link'
    });
  } else if (wordCount < 300) {
    stats.classifications.LOW_VALUE_RISK.push({
      id: art.id,
      slug: art.slug,
      title: art.title,
      cat,
      wordCount,
      reason: `Thin content (${wordCount} words) — high AdSense rejection risk`
    });
  } else if (isExpired && !art.title.toLowerCase().includes('result') && !art.title.toLowerCase().includes('guide') && !art.title.toLowerCase().includes('scheme')) {
    stats.classifications.OUTDATED.push({
      id: art.id,
      slug: art.slug,
      title: art.title,
      cat,
      wordCount,
      deadline: art.deadline,
      reason: `Application deadline expired on ${art.deadline}`
    });
  } else if (wordCount < 650 || !text.includes('##') || !text.includes('1.') || matchedAi.length >= 2) {
    stats.classifications.NEEDS_IMPROVEMENT.push({
      id: art.id,
      slug: art.slug,
      title: art.title,
      cat,
      wordCount,
      reason: wordCount < 650 ? `Moderate depth (${wordCount} words) — needs more practical guidance` : 'Needs better formatting/structure or less generic phrasing'
    });
  } else {
    stats.classifications.GOOD.push({
      id: art.id,
      slug: art.slug,
      title: art.title,
      cat,
      wordCount,
      reason: `Well-structured (${wordCount} words) with practical sections`
    });
  }
});

console.log('\n=== AUDIT SUMMARY STATS ===');
console.log(`Total Published Articles: ${stats.totalPublished}`);
console.log(`Short (<300 words): ${stats.shortContent.length}`);
console.log(`Medium (300-600 words): ${stats.mediumContent.length}`);
console.log(`Long (>600 words): ${stats.longContent.length}`);
console.log(`Missing Official Link: ${stats.missingOfficialLink.length}`);
console.log(`Missing Deadline: ${stats.missingDeadline.length}`);
console.log(`Expired Deadlines: ${stats.expiredCount}`);
console.log(`AI Pattern Indicators: ${stats.aiPatternIndicators.length}`);
console.log(`Missing Images: ${stats.missingImage.length}`);

console.log('\n=== CLASSIFICATION DISTRIBUTION ===');
console.log(`A. GOOD:               ${stats.classifications.GOOD.length}`);
console.log(`B. NEEDS IMPROVEMENT:  ${stats.classifications.NEEDS_IMPROVEMENT.length}`);
console.log(`C. LOW VALUE RISK:     ${stats.classifications.LOW_VALUE_RISK.length}`);
console.log(`D. OUTDATED:           ${stats.classifications.OUTDATED.length}`);
console.log(`E. NEEDS VERIFICATION: ${stats.classifications.NEEDS_VERIFICATION.length}`);

// Output duplicates
const duplicates = Object.entries(stats.duplicateCheck).filter(([k, v]) => v.length > 1);
console.log(`\nDuplicate / Highly Similar Titles found: ${duplicates.length}`);
duplicates.forEach(([k, v]) => console.log('Duplicate:', v));

fs.writeFileSync('scripts/detailed_audit_results.json', JSON.stringify(stats, null, 2));
console.log('\nSaved full report to scripts/detailed_audit_results.json');
