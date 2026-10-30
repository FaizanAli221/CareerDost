const fs = require('fs');
const articles = JSON.parse(fs.readFileSync('scripts/live_articles_inventory.json', 'utf8'));

const batch4Ids = [10, 11, 65, 84];
batch4Ids.forEach(id => {
  const art = articles.find(a => a.id === id);
  console.log(`=== ID: ${art.id} | ${art.slug} ===`);
  console.log('Title:', art.title);
  console.log('Category:', art.category);
  console.log('Org:', art.organization);
  console.log('LastDate:', art.lastDate);
  console.log('OfficialLink:', art.officialLink);
  console.log('Content:\n', Array.isArray(art.content) ? art.content.join('\n') : art.content);
  console.log('-----------------------------------------\n');
});
