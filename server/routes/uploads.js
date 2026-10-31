import { Hono } from 'hono'
import { getDb } from '../db.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'

const uploadsRouter = new Hono()

uploadsRouter.get('/:id', async (c) => {
  const db = getDb(c)
  const rawId = c.req.param('id')
  const width = c.req.query('w')
  const variant = c.req.query('v') || c.req.query('variant')

  // Identify requested variant
  let requestedVariant = null
  if (variant === 'card' || width === '640' || rawId.includes('-640w') || rawId.includes('_card')) {
    requestedVariant = 'card'
  } else if (variant === 'display' || width === '1200' || rawId.includes('-1200w') || rawId.includes('_display')) {
    requestedVariant = 'display'
  }

  // Base ID: strip extensions and variant suffixes
  const baseId = rawId.replace(/(-640w|-1200w|_card|_display)?(\.(webp|jpe?g|png))?$/i, '')

  try {
    let img = null

    // 1. If variant requested, attempt to find the variant first
    if (requestedVariant === 'card') {
      img = (await DailyUpdateModel.getImage(db, `${baseId}_card`)) || (await DailyUpdateModel.getImage(db, `${baseId}_640w`))
    } else if (requestedVariant === 'display') {
      img = (await DailyUpdateModel.getImage(db, `${baseId}_display`)) || (await DailyUpdateModel.getImage(db, `${baseId}_1200w`))
    }

    // 2. If no variant requested or variant was not found, check raw ID
    if (!img) {
      img = await DailyUpdateModel.getImage(db, rawId)
    }

    // 3. Fall back to base ID
    if (!img && baseId !== rawId) {
      img = await DailyUpdateModel.getImage(db, baseId)
    }

    if (!img) {
      return c.json({ success: false, error: 'Image not found' }, 404)
    }

    c.header('Content-Type', img.mime_type || 'image/jpeg')
    c.header('Cache-Control', 'public, max-age=31536000, immutable')

    if (typeof img.data === 'string' && img.data.startsWith('data:')) {
      const base64Data = img.data.split(',')[1]
      const binaryStr = atob(base64Data)
      const bytes = new Uint8Array(binaryStr.length)
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }
      return c.body(bytes)
    } else if (typeof img.data === 'string') {
      const binaryStr = atob(img.data)
      const bytes = new Uint8Array(binaryStr.length)
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }
      return c.body(bytes)
    }

    return c.body(img.data)
  } catch (err) {
    console.error('Error serving upload image:', err)
    return c.json({ success: false, error: 'Error loading image' }, 500)
  }
})

export default uploadsRouter
