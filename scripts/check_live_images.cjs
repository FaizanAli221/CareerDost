const fs = require('fs');
const articles = JSON.parse(fs.readFileSync('scripts/live_articles_inventory.json', 'utf8'));

const uniqueImages = [...new Set(articles.map(a => a.featuredImage).filter(Boolean))];
console.log(`Checking ${uniqueImages.length} unique featured images against https://careerdost.blog...`);

async function checkBatch(batch) {
  return Promise.all(batch.map(async img => {
    const url = img.startsWith('http') ? img : `https://careerdost.blog${img}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        return { img, status: res.status };
      }
      return null;
    } catch (e) {
      clearTimeout(timeout);
      return { img, error: e.name === 'AbortError' ? 'timeout' : e.message };
    }
  }));
}

async function run() {
  const broken = [];
  const chunkSize = 25;
  for (let i = 0; i < uniqueImages.length; i += chunkSize) {
    const batch = uniqueImages.slice(i, i + chunkSize);
    const results = await checkBatch(batch);
    for (const r of results) {
      if (r) broken.push(r);
    }
  }
  console.log(`Finished check. Total unique: ${uniqueImages.length}. Broken / Error: ${broken.length}`);
  if (broken.length > 0) {
    console.log('Issues found:', broken);
  } else {
    console.log('ALL featured images return 200 OK!');
  }
}

run().catch(console.error);
