import { Hono } from 'hono'
import { rateLimiter } from '../middleware/rateLimit.js'
import { sanitizeString, validateEmail } from '../utils/validation.js'

const app = new Hono()

// Rate limit contact form: max 5 requests per 15 minutes per IP
app.post('/', rateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000, keyPrefix: 'contact' }), async (c) => {
  try {
    const body = await c.req.json()
    const name = sanitizeString(body.name, 100)
    const email = sanitizeString(body.email, 150)
    const subject = sanitizeString(body.subject, 100)
    const message = sanitizeString(body.message, 2000)

    if (!name || name.length < 2) {
      return c.json({ success: false, error: 'Please enter a valid name.' }, 400)
    }

    if (!validateEmail(email)) {
      return c.json({ success: false, error: 'Please enter a valid email address.' }, 400)
    }

    if (!message || message.length < 10) {
      return c.json({ success: false, error: 'Message must be at least 10 characters long.' }, 400)
    }

    // Process submission safely
    console.log(`[Contact Form Submission] From: ${name} <${email}> | Subject: ${subject}`)

    return c.json({
      success: true,
      message: 'Thank you for contacting CareerDost. Your message has been received.',
    })
  } catch (err) {
    return c.json({ success: false, error: 'Invalid request format.' }, 400)
  }
})

export default app
