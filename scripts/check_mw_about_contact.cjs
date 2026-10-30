const fs = require('fs');
const mw = fs.readFileSync('functions/_middleware.js', 'utf8').split('\n');
console.log('--- About Section ---');
console.log(mw.slice(1774, 1815).join('\n'));
console.log('--- Contact Section ---');
console.log(mw.slice(1815, 1855).join('\n'));
