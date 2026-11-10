import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/fe03ca47-07ac-437e-93c5-1311150bca4a'
const outputDir = 'public/images'

const imageMap = [
  {
    src: path.join(brainDir, 'pakistan_cnic_domicile_prc_guide_hero_1794316725272.jpg'),
    targetName: 'pakistan-cnic-domicile-prc-application-guide',
  },
  {
    src: path.join(brainDir, 'ots_jobs_online_application_guide_1794316735425.jpg'),
    targetName: 'ots-jobs-online-application-registration-guide',
  },
  {
    src: path.join(brainDir, 'fresh_graduate_cv_pakistan_guide_1794316767635.jpg'),
    targetName: 'fresh-graduate-cv-format-guide-pakistan',
  },
  {
    src: path.join(brainDir, 'govt_interview_guide_hero_1794316782348.jpg'),
    targetName: 'government-job-interview-preparation-guide-pakistan',
  },
]

async function processImages() {
  for (const item of imageMap) {
    if (!fs.existsSync(item.src)) {
      console.error(`Source image missing: ${item.src}`)
      continue
    }

    const webpPath = path.join(outputDir, `${item.targetName}.webp`)
    const jpgPath = path.join(outputDir, `${item.targetName}.jpg`)

    // Process WEBP (1200x675)
    await sharp(item.src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(webpPath)

    // Process JPG (1200x675)
    await sharp(item.src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toFile(jpgPath)

    const webpStat = fs.statSync(webpPath)
    const jpgStat = fs.statSync(jpgPath)
    console.log(`✓ Generated ${item.targetName}:`)
    console.log(`    .webp: ${(webpStat.size / 1024).toFixed(1)} KB`)
    console.log(`    .jpg:  ${(jpgStat.size / 1024).toFixed(1)} KB`)
  }
}

processImages().catch(err => {
  console.error('Image processing failed:', err)
  process.exit(1)
})
