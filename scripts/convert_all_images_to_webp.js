import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const imagesDir = path.resolve('public/images')

async function run() {
  const files = fs.readdirSync(imagesDir)
  const jpgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'))

  console.log(`Optimizing ${jpgFiles.length} JPG files to responsive WebP in ${imagesDir}...`)
  let convertedCount = 0
  let totalSavedBytes = 0

  for (const file of jpgFiles) {
    const ext = path.extname(file)
    const base = path.basename(file, ext)
    const srcPath = path.join(imagesDir, file)
    const webpPath = path.join(imagesDir, `${base}.webp`)

    try {
      const srcStats = fs.statSync(srcPath)
      const existingWebpSize = fs.existsSync(webpPath) ? fs.statSync(webpPath).size : srcStats.size

      // Resize to max 720px width (optimal for mobile & desktop card grids)
      // Quality 75 provides crisp images at ~30-50KB instead of 150-200KB
      await sharp(srcPath)
        .resize(720, null, { withoutEnlargement: true })
        .webp({ quality: 75, effort: 5 })
        .toFile(webpPath + '.tmp')

      fs.renameSync(webpPath + '.tmp', webpPath)
      const newWebpSize = fs.statSync(webpPath).size

      convertedCount++
      totalSavedBytes += (existingWebpSize - newWebpSize)
    } catch (err) {
      console.error(`Error converting ${file}:`, err.message)
    }
  }

  console.log(`\nSuccessfully optimized ${convertedCount} images to WebP!`)
  console.log(`Total storage & bandwidth savings: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`)
}

run()
