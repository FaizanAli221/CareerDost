import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/cc82609f-7d6c-45ea-9894-e9ae41ab7893';
const destDir = path.resolve('public/images');

const imageMap = [
  {
    source: 'askari_bank_jobs_october_2026_karachi_1792575809718.jpg',
    target: 'askari-bank-jobs-october-2026-karachi'
  },
  {
    source: 'meezan_bank_jobs_october_2026_banner_1792575841706.jpg',
    target: 'meezan-bank-jobs-october-2026'
  },
  {
    source: 'akuh_jobs_2026_banner_1792575838865.jpg',
    target: 'aga-khan-university-hospital-karachi-jobs-2026'
  }
];

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log('=== OPTIMIZING 3 OCT 21 NANO BANANA FEATURED IMAGES (1200x675 16:9 WebP & JPG) ===\n');

  for (const item of imageMap) {
    const srcPath = path.join(brainDir, item.source);
    if (!fs.existsSync(srcPath)) {
      console.error(`Source image not found: ${srcPath}`);
      process.exit(1);
    }

    const targetJpg = path.join(destDir, `${item.target}.jpg`);
    const targetWebp = path.join(destDir, `${item.target}.webp`);

    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(targetJpg);

    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 90 })
      .toFile(targetWebp);

    const jpgStat = fs.statSync(targetJpg);
    const webpStat = fs.statSync(targetWebp);

    console.log(`✓ Processed: ${item.target}`);
    console.log(`    JPG:  ${(jpgStat.size / 1024).toFixed(1)} KB`);
    console.log(`    WebP: ${(webpStat.size / 1024).toFixed(1)} KB`);
  }

  console.log('\nAll 3 featured images successfully saved to public/images/');
}

processImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
