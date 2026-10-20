import { listings } from '../src/data/listings.js';

const keywords = ['commonwealth', 'wheat', 'hari', 'gepco', 'nat', 'memon', 'nursing', 'allied', 'hyderabad'];

keywords.forEach(kw => {
  const found = listings.filter(item => (item.slug + ' ' + item.title).toLowerCase().includes(kw));
  console.log('=== ' + kw + ' (' + found.length + ') ===');
  found.forEach(m => console.log('  [' + m.id + '] ' + m.slug + ' | ' + m.title + ' | lastDate: ' + m.lastDate));
});
