import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/f361b250-2b88-4918-95f5-2e498d86486f'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: 'sindh_hec_grants_1791787432867.jpg',
    target: 'sindh-hec-research-support-programme-2026-27'
  },
  {
    source: 'szabist_hyd_admissions_1791787456076.jpg',
    target: 'szabist-hyderabad-spring-2027-admissions'
  },
  {
    source: 'isra_mbbs_scholarships_1791787484529.jpg',
    target: 'isra-university-mbbs-bds-scholarship-registration-2026'
  },
  {
    source: 'isra_undergrad_spring_1791787552671.jpg',
    target: 'isra-university-spring-2027-undergraduate-admissions'
  },
  {
    source: 'isra_postgraduate_spring_1791787601124.jpg',
    target: 'isra-university-ms-mphil-phd-spring-2027'
  },
  {
    source: 'gimhs_nursing_dpt_1791787649909.jpg',
    target: 'gimhs-hyderabad-bsn-dpt-admissions-2026-phase-2'
  },
  {
    source: 'saus_deadline_extended_1791787701139.jpg',
    target: 'shaikh-ayaz-university-admissions-2027'
  },
  {
    source: 'fjwu_paid_internship_1791787753153.jpg',
    target: 'fjwu-paid-lab-engineer-internship-2026'
  },
  {
    source: 'lums_research_associate_1791787808580.jpg',
    target: 'lums-nano-physics-research-associate-jobs-2026'
  },
  {
    source: 'lums_electronic_technician_1791787869070.jpg',
    target: 'lums-electronic-technician-jobs-2026'
  }
]

async function run() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

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

    console.log(`Processed: ${item.target} (JPG & WebP)`)
  }
  console.log('\nAll 10 Nano Banana featured images processed and saved to public/images!')
}

run().catch(err => {
  console.error('Error processing images:', err)
  process.exit(1)
})
