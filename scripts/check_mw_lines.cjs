const fs = require('fs');
const mw = fs.readFileSync('functions/_middleware.js', 'utf8').split('\n');
console.log('--- Lines 435 to 455 ---');
console.log(mw.slice(435, 455).join('\n'));
console.log('--- Lines 620 to 640 ---');
console.log(mw.slice(620, 640).join('\n'));
