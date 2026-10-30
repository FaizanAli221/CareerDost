const fs = require('fs');
const articles = JSON.parse(fs.readFileSync('scripts/live_articles_inventory.json', 'utf8'));

const imageTypes = {};
const svgImages = [];
const missingImages = [];
const externalImages = [];
const localUploads = [];
const publicImages = [];

articles.forEach(a => {
  const img = a.featuredImage;
  if (!img) {
    missingImages.push({ id: a.id, slug: a.slug, title: a.title });
    return;
  }
  const ext = img.split('.').pop().toLowerCase();
  imageTypes[ext] = (imageTypes[ext] || 0) + 1;

  if (img.endsWith('.svg')) {
    svgImages.push({ id: a.id, slug: a.slug, img });
  } else if (img.startsWith('http')) {
    externalImages.push({ id: a.id, slug: a.slug, img });
  } else if (img.startsWith('/api/uploads/')) {
    localUploads.push({ id: a.id, slug: a.slug, img });
  } else if (img.startsWith('/images/')) {
    publicImages.push({ id: a.id, slug: a.slug, img });
  }
});

console.log('Image extension distribution:', imageTypes);
console.log('Missing images:', missingImages.length);
console.log('SVG images:', svgImages.length);
console.log('External images:', externalImages.length);
console.log('Local uploads (/api/uploads/):', localUploads.length);
console.log('Public images (/images/):', publicImages.length);

if (svgImages.length > 0) {
  console.log('\nSVG images found:', svgImages);
}
