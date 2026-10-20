import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\Faizan Ali\\.gemini\\antigravity\\brain\\21877b4b-d7d0-41d1-be4d-e3edcf2b7e23';
const publicImagesDir = 'g:\\Carreer-dost\\public\\images';

const imageMap = [
  {
    src: 'nts_nat_xi_november_2026_png_1792440055449.jpg',
    destBase: 'nts-nat-xi-november-2026'
  },
  {
    src: 'memon_college_nursing_karachi_bsn_2026_v3_png_1792440192032.jpg',
    destBase: 'memon-college-nursing-karachi-bsn-2026'
  },
  {
    src: 'niahs_hyderabad_bsn_nursing_2026_png_1792440153412.jpg',
    destBase: 'niahs-hyderabad-bsn-nursing-2026'
  }
];

imageMap.forEach(({ src, destBase }) => {
  const srcPath = path.join(artifactsDir, src);
  const jpgDest = path.join(publicImagesDir, `${destBase}.jpg`);
  const webpDest = path.join(publicImagesDir, `${destBase}.webp`);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, jpgDest);
    fs.copyFileSync(srcPath, webpDest); // as fallback or same binary
    console.log(`Copied ${src} -> ${jpgDest} and ${webpDest}`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
});
