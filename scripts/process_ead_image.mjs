import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcImage = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/61583735-d24f-41bf-9657-02b0e5a430e1/economic_affairs_division_jobs_2026_banner_1793952917315.jpg';
const destDir = path.resolve('public/images');
const targetSlug = 'economic-affairs-division-jobs-balochistan-2026';

async function main() {
  if (!fs.existsSync(srcImage)) {
    console.error(`Source image missing: ${srcImage}`);
    process.exit(1);
  }

  const targetJpg = path.join(destDir, `${targetSlug}.jpg`);
  const targetWebp = path.join(destDir, `${targetSlug}.webp`);

  await sharp(srcImage)
    .resize(1200, 675, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(targetJpg);

  await sharp(srcImage)
    .resize(1200, 675, { fit: 'cover', position: 'center' })
    .webp({ quality: 88 })
    .toFile(targetWebp);

  const statJpg = fs.statSync(targetJpg);
  const statWebp = fs.statSync(targetWebp);

  console.log(`✓ Generated: ${targetSlug}`);
  console.log(`   JPG:  ${statJpg.size} bytes (${targetJpg})`);
  console.log(`   WebP: ${statWebp.size} bytes (${targetWebp})`);
}

main().catch(err => {
  console.error('Error processing image:', err);
  process.exit(1);
});
