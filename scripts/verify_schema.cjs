const https = require('https');

https.get('https://careerdost.blog/jobs/sindh-government-graduate-internship-program-2026', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(data)) !== null) {
      count++;
      console.log(`\n--- SCHEMA SCRIPT BLOCK #${count} ---`);
      try {
        const parsed = JSON.parse(match[1]);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (err) {
        console.log('Raw text:', match[1].slice(0, 300));
      }
    }
  });
});
