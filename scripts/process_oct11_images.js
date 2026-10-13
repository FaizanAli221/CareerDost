import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/f9203ccd-a0f1-4c8b-b1c7-ecc9b72589f9'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: 'spsc_jobs_2026_1791698882794.jpg',
    target: 'spsc-jobs-2026-54-vacancies'
  },
  {
    source: 'spsc_dept_exams_2026_1791698933330.jpg',
    target: 'spsc-departmental-exam-slips-2026'
  },
  {
    source: 'sindh_courts_jobs_2026_1791698990744.jpg',
    target: 'sindh-courts-bps-1-4-jobs-2026'
  },
  {
    source: 'quest_admissions_2026_1791699058903.jpg',
    target: 'quest-nawabshah-phd-me-ms-admissions-2026'
  },
  {
    source: 'quest_special_exams_2026_1791699107395.jpg',
    target: 'quest-special-exams-timetable-2026'
  },
  {
    source: 'spsc_cce_2026_1791699236411.jpg',
    target: 'spsc-cce-2026-screening-test-date'
  },
  {
    source: 'sbbu_nf_test_2027_1791699303764.jpg',
    target: 'sbbu-naushahro-feroze-entry-test-2027'
  },
  {
    source: 'pnsc_jobs_2026_1791699375370.jpg',
    target: 'pnsc-jobs-2026-karachi-shipping'
  },
  {
    source: 'hec_irsip_batch_60_1791699506277.jpg',
    target: 'hec-irsip-batch-60-scholarship-2026'
  },
  {
    source: 'mocc_jobs_2026_1791699574926.jpg',
    target: 'ministry-climate-change-jobs-2026'
  }
]

async function run() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  for (const item of imageMap) {
    const srcPath = path.join(brainDir, item.source)
    if (!fs.existsSync(srcPath)) {
      console.error(`Source not found: ${srcPath}`)
      continue
    }

    const targetJpg = path.join(destDir, `${item.target}.jpg`)
    const targetWebp = path.join(destDir, `${item.target}.webp`)

    // Resize and optimize JPEG
    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(targetJpg)

    // Also optimize WebP
    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 90 })
      .toFile(targetWebp)

    console.log(`Successfully generated:\n  - ${targetJpg}\n  - ${targetWebp}`)
  }
  console.log('\nAll 10 featured images processed and saved to public/images!')
}

run()
