const fs = require('fs');
const updates = JSON.parse(fs.readFileSync('scripts/live_updates_inventory.json', 'utf8'));
const publishedUpdates = updates.filter(u => u.status === 'published');

console.log(`Analyzing ${publishedUpdates.length} published daily updates...`);

let shortUpd = 0;
let medUpd = 0;
let longUpd = 0;
const wordCounts = [];

publishedUpdates.forEach(u => {
  let text = '';
  if (Array.isArray(u.content)) {
    text = u.content.join(' ');
  } else if (typeof u.content === 'string') {
    try {
      const parsed = JSON.parse(u.content);
      text = Array.isArray(parsed) ? parsed.join(' ') : String(u.content);
    } catch {
      text = String(u.content);
    }
  }
  const words = text.replace(/<[^>]+>/g, ' ').replace(/[#*`|_\[\]\(\)]/g, ' ').split(/\s+/).filter(w => w.length > 0);
  wordCounts.push({ id: u.id, slug: u.slug, title: u.title, words: words.length });
  if (words.length < 200) shortUpd++;
  else if (words.length < 400) medUpd++;
  else longUpd++;
});

console.log(`Updates: <200 words: ${shortUpd}, 200-400 words: ${medUpd}, >400 words: ${longUpd}`);
const shortest = wordCounts.sort((a,b) => a.words - b.words).slice(0, 10);
console.log('Shortest 10 updates:', shortest);
