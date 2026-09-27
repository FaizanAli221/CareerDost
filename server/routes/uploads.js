import { Hono } from 'hono'
import { getDb } from '../db.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'

const uploadsRouter = new Hono()

uploadsRouter.get('/:id', async (c) => {
  const db = getDb(c)
  const id = c.req.param('id')

  try {
    const img = await DailyUpdateModel.getImage(db, id)
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
