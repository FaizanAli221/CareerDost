const fs = require('fs');
const mw = fs.readFileSync('functions/_middleware.js', 'utf8').split('\n');
console.log('--- Lines 1205 to 1235 ---');
console.log(mw.slice(1205, 1235).join('\n'));
