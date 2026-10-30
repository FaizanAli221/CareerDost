const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/eba54489-3a17-4e85-a8c7-c1a1457d69b7';
const destDir = path.resolve('public/images');

const tasks = [
  {
    src: path.join(brainDir, 'sindh_gov_jobs_2026_banner_1792918860086.jpg'),
    dest: path.join(destDir, 'sindh-government-jobs-2026-spsc-sts-guide.webp'),
    name: 'Sindh Government Jobs 2026 Guide'
  },
  {
    src: path.join(brainDir, 'samba_bank_universal_teller_jobs_2026_png_1792918872343.jpg'),
    dest: path.join(destDir, 'samba-bank-universal-teller-jobs-2026.webp'),
    name: 'Samba Bank Universal Teller 2026'
  },
  {
    src: path.join(brainDir, 'bank_al_habib_rm_jobs_2026_1792918885808.jpg'),
    dest: path.join(destDir, 'bank-al-habib-relationship-manager-jobs-2026.webp'),
    name: 'Bank AL Habib RM Jobs 2026'
  }
];

async function processImages() {
  console.log('--- PROCESSING 25 OCTOBER 2026 BATCH 2 FEATURED IMAGES ---');
  for (const t of tasks) {
    if (!fs.existsSync(t.src)) {
      console.error(`ERROR: Source file does not exist: ${t.src}`);
      continue;
    }
    await sharp(t.src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(t.dest);

    const stat = fs.statSync(t.dest);
    const meta = await sharp(t.dest).metadata();
    console.log(`[SUCCESS] ${t.name}:`);
    console.log(`  File: ${t.dest}`);
    console.log(`  Format: ${meta.format} | Dimensions: ${meta.width}x${meta.height} | Size: ${(stat.size / 1024).toFixed(1)} KB`);
  }
}

processImages().catch(err => {
  console.error('Image processing failed:', err);
  process.exit(1);
});
