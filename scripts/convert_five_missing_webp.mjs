import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('public/images');
const targets = [
  'karachi-metropolitan-university-vc-2026.jpg',
  'sindh-education-rsu-consultant-jobs-2026.jpg',
  'bop-karachi-manager-jobs-2026.jpg',
  'nbp-karachi-jobs-october-2026.jpg',
  'szabist-ihsan-trust-interest-free-loan-2026.jpg'
];

async function convertTargets() {
  console.log('Converting 5 target JPGs to high-quality WebP...');
  for (const file of targets) {
    const srcPath = path.join(imagesDir, file);
    const base = path.basename(file, path.extname(file));
    const webpPath = path.join(imagesDir, `${base}.webp`);

    if (!fs.existsSync(srcPath)) {
      console.error(`Source not found: ${srcPath}`);
      continue;
    }

    await sharp(srcPath)
      .webp({ quality: 85, effort: 5 })
      .toFile(webpPath);

    const stat = fs.statSync(webpPath);
    console.log(`✓ Created ${base}.webp (${stat.size} bytes)`);
  }
}

convertTargets().catch(console.error);
