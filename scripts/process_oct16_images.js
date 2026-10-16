import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/670c0116-9c11-4f73-84f6-9615c949fb46'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: 'kp_project_associate_internship_2026_1792169688484.jpg',
    target: 'kp-government-project-associate-internship-2026'
  },
  {
    source: 'aku_karachi_careers_2026_1792169695380.jpg',
    target: 'aku-karachi-jobs-traineeships-2026'
  },
  {
    source: 'systems_ltd_ase_jobs_2026_png_1792169694707.jpg',
    target: 'systems-limited-associate-software-engineer-jobs-2026'
  },
  {
    source: 'hbl_jobs_internships_2026_guide_1792169693884.jpg',
    target: 'hbl-jobs-internships-the-league-2026'
  },
  {
    source: 'jazz_ai_careers_2026_1792169694415.jpg',
    target: 'jazz-careers-ai-associate-programme-2026'
  }
]

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  console.log('=== OPTIMIZING 5 NANO BANANA FEATURED IMAGES (1200x675 16:9 WebP & JPG) ===\n')

  for (const item of imageMap) {
    const srcPath = path.join(brainDir, item.source)
    if (!fs.existsSync(srcPath)) {
      console.error(`Source image not found: ${srcPath}`)
      continue
    }

    const targetJpg = path.join(destDir, `${item.target}.jpg`)
    const targetWebp = path.join(destDir, `${item.target}.webp`)

    // Resize and optimize JPEG to 1200x675 (16:9)
    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(targetJpg)

    // Resize and optimize WebP to 1200x675 (16:9)
    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 90 })
      .toFile(targetWebp)

    const jpgStat = fs.statSync(targetJpg)
    const webpStat = fs.statSync(targetWebp)

    console.log(`✓ Processed: ${item.target}`)
    console.log(`    JPG:  ${(jpgStat.size / 1024).toFixed(1)} KB`)
    console.log(`    WebP: ${(webpStat.size / 1024).toFixed(1)} KB`)
  }

  console.log('\nAll 5 featured images successfully saved to public/images/')
}

processImages().catch(err => {
  console.error('Error processing images:', err)
  process.exit(1)
})
