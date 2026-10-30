const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/21877b4b-d7d0-41d1-be4d-e3edcf2b7e23';
const destDir = path.resolve('public/images');

const imageMap = [
  {
    source: 'pseb_creative_lead_jobs_2026_1792763816388.jpg',
    target: 'pseb-creative-lead-jobs-2026'
  },
  {
    source: 'ministry_of_planning_jobs_october_2026_1792763881238.jpg',
    target: 'ministry-of-planning-jobs-october-2026'
  }
];

async function processImages() {
  console.log('=== OPTIMIZING 2 OCT 23 EDITORIAL FEATURED IMAGES (WebP & JPG) ===\n');

  for (const item of imageMap) {
    const srcPath = path.join(brainDir, item.source);
    if (!fs.existsSync(srcPath)) {
      throw new Error(`Source image not found: ${srcPath}`);
    }

    const targetJpg = path.join(destDir, `${item.target}.jpg`);
    const targetWebp = path.join(destDir, `${item.target}.webp`);

    await sharp(srcPath)
      .resize(1536, 864, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(targetJpg);

    await sharp(srcPath)
      .resize(1536, 864, { fit: 'cover', position: 'center' })
      .webp({ quality: 90 })
      .toFile(targetWebp);

    const jpgStat = fs.statSync(targetJpg);
    const webpStat = fs.statSync(targetWebp);

    console.log(`✓ Processed: ${item.target}`);
    console.log(`   JPG:  ${jpgStat.size} bytes -> ${targetJpg}`);
    console.log(`   WebP: ${webpStat.size} bytes -> ${targetWebp}`);
  }

  console.log('\nAll editorial featured images successfully optimized and placed into public/images/.');
}

processImages().catch(err => {
  console.error('Image processing failed:', err);
  process.exit(1);
});
