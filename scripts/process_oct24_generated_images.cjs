const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/eba54489-3a17-4e85-a8c7-c1a1457d69b7';
const destDir = path.resolve('public/images');

async function processImages() {
  console.log('=== OPTIMIZING 2 OCT 24 EDITORIAL FEATURED IMAGES (WebP & JPG) ===\n');

  // Find latest files in brainDir
  const brainFiles = fs.readdirSync(brainDir);
  const spscFiles = brainFiles.filter(f => f.startsWith('spsc_cce_2026_reforms_featured') && f.endsWith('.jpg')).sort();
  const wheatFiles = brainFiles.filter(f => f.startsWith('pakistan_wheat_price_2027_featured') && f.endsWith('.jpg')).sort();

  if (spscFiles.length === 0) throw new Error('No SPSC image found in brainDir');
  if (wheatFiles.length === 0) throw new Error('No Wheat image found in brainDir');

  const latestSpsc = spscFiles[spscFiles.length - 1];
  const latestWheat = wheatFiles[wheatFiles.length - 1];

  console.log('Using SPSC image source:', latestSpsc);
  console.log('Using Wheat image source:', latestWheat);

  const tasks = [
    {
      source: path.join(brainDir, latestSpsc),
      targets: [
        'spsc-cce-2026-examination-reforms-age-attempts-screening'
      ]
    },
    {
      source: path.join(brainDir, latestWheat),
      targets: [
        'pakistan-wheat-indicative-price-4500-2027',
        'pakistan-wheat-support-price-2026-27'
      ]
    }
  ];

  for (const t of tasks) {
    for (const targetName of t.targets) {
      const targetJpg = path.join(destDir, `${targetName}.jpg`);
      const targetWebp = path.join(destDir, `${targetName}.webp`);

      await sharp(t.source)
        .resize(1536, 864, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 92, mozjpeg: true })
        .toFile(targetJpg);

      await sharp(t.source)
        .resize(1536, 864, { fit: 'cover', position: 'center' })
        .webp({ quality: 90 })
        .toFile(targetWebp);

      const jpgStat = fs.statSync(targetJpg);
      const webpStat = fs.statSync(targetWebp);

      console.log(`✓ Processed: ${targetName}`);
      console.log(`   JPG:  ${jpgStat.size} bytes -> ${targetJpg}`);
      console.log(`   WebP: ${webpStat.size} bytes -> ${targetWebp}`);
    }
  }

  console.log('\nAll editorial featured images successfully optimized and placed into public/images/.');
}

processImages().catch(err => {
  console.error('Image processing error:', err);
  process.exit(1);
});
