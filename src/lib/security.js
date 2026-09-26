/**
 * Validates and sanitizes external URLs to prevent javascript: or data: XSS injection vectors.
 */
export function safeUrl(url) {
  if (!url || typeof url !== 'string') return '#'
  const trimmed = url.trim()
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#'
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('mailto:')) {
    return trimmed
  }
  if (trimmed.startsWith('www.')) {
    return `https://${trimmed}`
  }
  return '#'
}

/**
 * Escapes HTML characters for safe plain text rendering
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
