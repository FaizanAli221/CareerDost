import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const srcPath = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/d10680d5-11c3-47db-a199-18e3d7c25c0f/pakistan_flood_support_editorial_1792257404142.jpg'
const destDir = path.resolve('public/images')
const targetSlug = 'pakistan-plans-new-support-poor-flood-affected-families-what-is-confirmed'

async function processImage() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const targetJpg = path.join(destDir, `${targetSlug}.jpg`)
  const targetWebp = path.join(destDir, `${targetSlug}.webp`)

  console.log(`Processing ${srcPath} -> ${targetSlug} (1200x675 16:9)...`)

  // Optimize JPG (1200x675)
  await sharp(srcPath)
    .resize(1200, 675, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(targetJpg)

  // Optimize WebP (1200x675)
  await sharp(srcPath)
    .resize(1200, 675, { fit: 'cover', position: 'center' })
    .webp({ quality: 90 })
    .toFile(targetWebp)

  const jpgStat = fs.statSync(targetJpg)
  const webpStat = fs.statSync(targetWebp)

  console.log(`✓ Processed JPG:  ${(jpgStat.size / 1024).toFixed(1)} KB at ${targetJpg}`)
  console.log(`✓ Processed WebP: ${(webpStat.size / 1024).toFixed(1)} KB at ${targetWebp}`)
}

processImage().catch(err => {
  console.error('Image processing failed:', err)
  process.exit(1)
})
