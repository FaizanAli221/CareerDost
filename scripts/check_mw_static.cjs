const fs = require('fs');
const mw = fs.readFileSync('functions/_middleware.js', 'utf8').split('\n');
mw.forEach((l, i) => {
  if (l.includes("'/about'") || l.includes("'/contact'") || l.includes("'/disclaimer'")) {
    console.log((i+1) + ': ' + l.trim());
  }
});
