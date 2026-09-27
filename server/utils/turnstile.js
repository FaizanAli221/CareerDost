export async function verifyTurnstileToken(c, token) {
  const secretKey = c.env?.TURNSTILE_SECRET_KEY || (typeof process !== 'undefined' && process.env ? process.env.TURNSTILE_SECRET_KEY : null)

  // If Turnstile secret key is not configured, pass validation cleanly in dev
  if (!secretKey) {
    return true
  }

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return false
  }

  try {
    const clientIp =
      c.req.header('cf-connecting-ip') ||
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
      ''

    const formData = new URLSearchParams()
    formData.append('secret', secretKey.trim())
    formData.append('response', token.trim())
    if (clientIp) formData.append('remoteip', clientIp)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const outcome = await res.json()
    return Boolean(outcome.success)
  } catch (err) {
    console.error('Turnstile verification error:', err)
    return false
  }
}
