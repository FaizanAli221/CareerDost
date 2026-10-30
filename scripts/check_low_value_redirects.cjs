const fs = require('fs');
const articles = JSON.parse(fs.readFileSync('scripts/live_articles_inventory.json', 'utf8'));
const classified = JSON.parse(fs.readFileSync('scripts/classified_articles_inventory.json', 'utf8'));

const lowValue = classified.filter(c => c.classification === 'LOW_VALUE_RISK');

const middleware = fs.readFileSync('functions/_middleware.js', 'utf8');
const redirectBlock = middleware.match(/CONSOLIDATED_SLUG_REDIRECTS = new Map\(\[([\s\S]*?)\]\)/)[1];

console.log('Redirect map entries:');
console.log(redirectBlock);

console.log('\nChecking 36 Low Value Risk articles against redirect map:');
lowValue.forEach(a => {
  const isRedirected = redirectBlock.includes(`'${a.slug}'`);
  console.log(`[${a.id}] ${a.slug} -> Redirected? ${isRedirected}`);
});
