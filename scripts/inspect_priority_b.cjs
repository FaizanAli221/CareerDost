const fs = require('fs');
const items = JSON.parse(fs.readFileSync('scripts/classified_articles_inventory.json', 'utf8'));
const needsImp = items.filter(it => it.classification === 'NEEDS_IMPROVEMENT');
console.log('Total NEEDS_IMPROVEMENT:', needsImp.length);
needsImp.forEach(a => {
  console.log('ID: ' + a.id + ' | Cat: ' + a.category + ' | Words: ' + a.wordCount + ' | FAQ: ' + a.hasFaq + ' | Steps: ' + a.hasStepByStep + ' | Table: ' + a.hasTable + ' | ' + a.slug);
});
