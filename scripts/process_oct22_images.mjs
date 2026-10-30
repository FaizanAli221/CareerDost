import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/283e55b9-38ab-4dfc-b8f8-1df139edfe07';
const destDir = path.resolve('public/images');

const imageMap = [
  {
    source: 'spsc_cce_2026_reforms_1792650057007.jpg',
    target: 'spsc-cce-2026-examination-reforms-age-attempts-screening'
  },
  {
    source: 'sindh_flood_housing_resilience_eib_1792650061030.jpg',
    target: 'sindh-flood-housing-phase-3-financing-update-eib-sphf'
  },
  {
    source: 'ssgc_pipeline_sindh_1792650085363.jpg',
    target: 'ssgc-gasification-plan-46-sindh-villages-sanghar-shikarpur'
  }
];

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log('=== OPTIMIZING 3 OCT 22 NANO BANANA FEATURED IMAGES (1200x675 16:9 WebP & JPG) ===\n');

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
    console.log(`   JPG:  ${jpgStat.size} bytes -> ${targetJpg}`);
    console.log(`   WebP: ${webpStat.size} bytes -> ${targetWebp}`);
  }

  console.log('\nAll 3 featured images optimized and saved successfully.');
}

processImages().catch(err => {
  console.error('Image processing failed:', err);
  process.exit(1);
});
