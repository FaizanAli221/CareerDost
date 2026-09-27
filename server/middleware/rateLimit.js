const rateLimitStores = new Map()

// Perform lazy cleanup of expired entries during requests
function cleanupExpiredStores(now) {
  if (rateLimitStores.size > 100) {
    for (const [key, record] of rateLimitStores.entries()) {
      if (now > record.resetTime) {
        rateLimitStores.delete(key)
      }
    }
  }
}

export function rateLimiter({ maxRequests = 5, windowMs = 15 * 60 * 1000, keyPrefix = 'rl' } = {}) {
  return async function (c, next) {
    const now = Date.now()
    cleanupExpiredStores(now)

    const ip =
      c.req.header('cf-connecting-ip') ||
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
      c.req.header('x-real-ip') ||
      '127.0.0.1'

    const key = `${keyPrefix}:${ip}`
    let record = rateLimitStores.get(key)

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      }
      rateLimitStores.set(key, record)
    } else {
      record.count += 1
    }

    c.header('X-RateLimit-Limit', String(maxRequests))
    c.header('X-RateLimit-Remaining', String(Math.max(0, maxRequests - record.count)))

    if (record.count > maxRequests) {
      return c.json(
        {
          success: false,
          error: 'Too many requests from this IP. Please try again later.',
        },
        429
      )
    }

    await next()
  }
}
