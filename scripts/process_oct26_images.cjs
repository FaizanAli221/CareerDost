const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/61583735-d24f-41bf-9657-02b0e5a430e1';
const destDir = path.resolve('public/images');

const images = [
  {
    src: path.join(brainDir, 'cga_junior_auditor_balochistan_banner_1793040860579.jpg'),
    baseName: 'cga-junior-auditor-jobs-2026'
  },
  {
    src: path.join(brainDir, 'agp_junior_auditor_editorial_banner_v2_1793040918455.jpg'),
    baseName: 'agp-junior-auditor-jobs-2026'
  },
  {
    src: path.join(brainDir, 'nbp_jobs_october_2026_banner_1793040872246.jpg'),
    baseName: 'nbp-jobs-october-2026-karachi-hyderabad'
  }
];

async function processAll() {
  console.log('=== OPTIMIZING 26 OCTOBER EDITORIAL FEATURED IMAGES ===\n');

  for (const img of images) {
    if (!fs.existsSync(img.src)) {
      console.error(`Source missing: ${img.src}`);
      continue;
    }

    const webpPath = path.join(destDir, `${img.baseName}.webp`);
    const jpgPath = path.join(destDir, `${img.baseName}.jpg`);

    // Process 1200x675 WebP
    await sharp(img.src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(webpPath);

    // Process 1200x675 JPG
    await sharp(img.src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgPath);

    const webpStat = fs.statSync(webpPath);
    const jpgStat = fs.statSync(jpgPath);
    console.log(`✓ ${img.baseName}:`);
    console.log(`   - WebP: ${webpPath} (${(webpStat.size / 1024).toFixed(1)} KB)`);
    console.log(`   - JPG:  ${jpgPath} (${(jpgStat.size / 1024).toFixed(1)} KB)`);
  }

  console.log('\nAll 26 October featured images generated and saved to public/images/ successfully!');
}

processAll().catch(console.error);
