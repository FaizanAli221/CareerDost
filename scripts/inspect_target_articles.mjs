import { listings } from '../src/data/listings.js';

const targetIds = [24, 355, 318];
const found = listings.filter(item => targetIds.includes(item.id));

found.forEach(item => {
  console.log(`\n================ ID: ${item.id} | Slug: ${item.slug} ================`);
  console.log('Title:', item.title);
  console.log('Category:', item.category);
  console.log('LastDate:', item.lastDate);
  console.log('PublishDate:', item.publishDate);
  console.log('OfficialLink:', item.officialLink);
  console.log('ApplyLink:', item.applyLink);
  console.log('Excerpt:', item.excerpt);
  console.log('Content paragraph count:', item.content.length);
  console.log('First 2 paragraphs:', item.content.slice(0, 2));
});
