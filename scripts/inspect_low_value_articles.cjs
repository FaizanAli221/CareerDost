const fs = require('fs');
const articles = JSON.parse(fs.readFileSync('scripts/live_articles_inventory.json', 'utf8'));
const classified = JSON.parse(fs.readFileSync('scripts/classified_articles_inventory.json', 'utf8'));

const lowValue = classified.filter(c => c.classification === 'LOW_VALUE_RISK');

console.log(`=== DETAILED REVIEW OF ${lowValue.length} LOW VALUE RISK ARTICLES ===\n`);

lowValue.forEach((item, index) => {
  const art = articles.find(a => a.id === item.id);
  let text = '';
  if (Array.isArray(art.content)) text = art.content.join('\n\n');
  else text = String(art.content);
  
  console.log(`[#${index + 1}] ID: ${art.id} | Slug: ${art.slug}`);
  console.log(`Title: ${art.title}`);
  console.log(`Category: ${art.category} | Words: ${item.wordCount} | Last Date: ${art.lastDate || 'N/A'}`);
  console.log(`Official Link: ${art.officialLink || 'N/A'}`);
  console.log(`Preview: ${text.slice(0, 180).replace(/\n/g, ' ')}...`);
  console.log('--------------------------------------------------\n');
});
