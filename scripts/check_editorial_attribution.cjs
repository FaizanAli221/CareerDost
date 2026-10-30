const fs = require('fs');

function checkFile(path) {
  const content = fs.readFileSync(path, 'utf8');
  console.log(`=== CHECKING ${path} ===`);
  console.log('Includes Faizan Ali:', content.includes('Faizan Ali'));
  console.log('Includes CareerDost Editorial Desk:', content.includes('CareerDost Editorial Desk'));
  console.log('Includes editor@careerdost.blog:', content.includes('editor@careerdost.blog'));
  console.log('Includes author in JSON-LD / schema:', content.includes('"author"') || content.includes("'author'") || content.includes('author:'));
}

checkFile('src/pages/About.jsx');
checkFile('src/pages/Contact.jsx');
checkFile('src/pages/ArticlePage.jsx');
checkFile('src/pages/UpdateDetailPage.jsx');
