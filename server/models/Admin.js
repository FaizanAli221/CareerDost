import bcrypt from 'bcryptjs'

// Fallback runtime secret generated securely per-instance if environment variable is not supplied
let runtimeSecret = null
function getFallbackSecret() {
  if (!runtimeSecret) {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint8Array(32)
      crypto.getRandomValues(arr)
      runtimeSecret = Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
    } else {
      runtimeSecret = 'careerdost-default-jwt-secret-' + Math.random()
    }
  }
  return runtimeSecret
}

function getSecretKey(envSecret) {
  if (envSecret && typeof envSecret === 'string' && envSecret.trim().length > 8) {
    return envSecret.trim()
  }
  if (typeof process !== 'undefined' && process.env && process.env.ADMIN_JWT_SECRET) {
    return process.env.ADMIN_JWT_SECRET.trim()
  }
  return getFallbackSecret()
}

function base64UrlEncode(bufferOrString) {
  let b64 = ''
  if (typeof bufferOrString === 'string') {
    b64 = globalThis.btoa ? btoa(bufferOrString) : Buffer.from(bufferOrString).toString('base64')
  } else {
    const bytes = new Uint8Array(bufferOrString)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    b64 = globalThis.btoa ? btoa(binary) : Buffer.from(bytes).toString('base64')
  }
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4) {
    b64 += '='
  }
  return globalThis.atob ? atob(b64) : Buffer.from(b64, 'base64').toString('utf-8')
}

async function getHmacKey(secretStr) {
  const enc = new TextEncoder()
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secretStr),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export class AdminModel {
  static async getByUsername(db, username) {
    if (!username || typeof username !== 'string') return null
    const admin = await db
      .prepare('SELECT * FROM admins WHERE username = ?')
      .bind(username.trim().toLowerCase())
      .first()
    return admin || null
  }

  static async getByEmail(db, email) {
    if (!email || typeof email !== 'string') return null
    const admin = await db
      .prepare('SELECT * FROM admins WHERE email = ?')
      .bind(email.trim().toLowerCase())
      .first()
    return admin || null
  }

  static async create(db, { username, email, password, role = 'admin' }) {
    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 10)
    } catch {
      const enc = new TextEncoder()
      const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits'])
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode('careerdost-salt'), iterations: 1000, hash: 'SHA-256' }, key, 256)
      passwordHash = 'pbkdf2$' + base64UrlEncode(bits)
    }

    const res = await db
      .prepare(
        'INSERT INTO admins (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
      )
      .bind(cleanUsername, cleanEmail, passwordHash, role)
      .run()
    return res.success
  }

  static async verifyPassword(password, passwordHash) {
    if (!password || !passwordHash) return false
    if (passwordHash.startsWith('pbkdf2$')) {
      const enc = new TextEncoder()
      const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits'])
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode('careerdost-salt'), iterations: 1000, hash: 'SHA-256' }, key, 256)
      return 'pbkdf2$' + base64UrlEncode(bits) === passwordHash
    }
    try {
      return await bcrypt.compare(password, passwordHash)
    } catch {
      return false
    }
  }

  /**
   * Generates a cryptographically signed HMAC-SHA256 JWT Token
   */
  static async generateToken(admin, envSecret = null) {
    const secret = getSecretKey(envSecret)
    const header = { alg: 'HS256', typ: 'JWT' }
    const payload = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours validity
    }

    const encodedHeader = base64UrlEncode(JSON.stringify(header))
    const encodedPayload = base64UrlEncode(JSON.stringify(payload))
    const dataToSign = `${encodedHeader}.${encodedPayload}`

    const enc = new TextEncoder()
    const key = await getHmacKey(secret)
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign))
    const encodedSignature = base64UrlEncode(signatureBuffer)

    return `${dataToSign}.${encodedSignature}`
  }

  /**
   * Cryptographically verifies HMAC-SHA256 JWT Signature and expiration
   */
  static async verifyToken(token, envSecret = null) {
    if (!token || typeof token !== 'string') return null
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, encodedSignature] = parts
    const dataToSign = `${encodedHeader}.${encodedPayload}`
    const secret = getSecretKey(envSecret)

    try {
      const enc = new TextEncoder()
      const key = await getHmacKey(secret)

      // Decode signature
      let b64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/')
      while (b64.length % 4) b64 += '='
      const binarySig = globalThis.atob ? atob(b64) : Buffer.from(b64, 'base64').toString('binary')
      const sigBytes = new Uint8Array(binarySig.length)
      for (let i = 0; i < binarySig.length; i++) {
        sigBytes[i] = binarySig.charCodeAt(i)
      }

      const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(dataToSign))
      if (!isValid) return null

      const payloadStr = base64UrlDecode(encodedPayload)
      const payload = JSON.parse(payloadStr)

      const nowInSeconds = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < nowInSeconds) {
        return null
      }

      return payload
    } catch {
      return null
    }
  }

  static async getAll(db) {
    const { results } = await db
      .prepare('SELECT id, username, email, role, created_at FROM admins ORDER BY id ASC')
      .all()
    return results || []
  }

  static async delete(db, id) {
    const res = await db.prepare('DELETE FROM admins WHERE id = ?').bind(id).run()
    return res.success
  }
}
