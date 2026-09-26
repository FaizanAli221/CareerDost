import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'careerdost-admin-secret-key-change-in-prod-v2'

function base64UrlEncode(str) {
  const b64 = globalThis.btoa ? btoa(str) : Buffer.from(str).toString('base64')
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4) {
    b64 += '='
  }
  return globalThis.atob ? atob(b64) : Buffer.from(b64, 'base64').toString('utf-8')
}

// Simple deterministic signature for edge/worker environments
function generateSignature(payloadStr) {
  let hash = 0
  const combined = payloadStr + ':' + SECRET_KEY
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

export class AdminModel {
  static async getByUsername(db, username) {
    const admin = await db
      .prepare('SELECT * FROM admins WHERE username = ?')
      .bind(username)
      .first()
    return admin || null
  }

  static async getByEmail(db, email) {
    const admin = await db
      .prepare('SELECT * FROM admins WHERE email = ?')
      .bind(email)
      .first()
    return admin || null
  }

  static async create(db, { username, email, password, role = 'admin' }) {
    const passwordHash = await bcrypt.hash(password, 10)
    const res = await db
      .prepare(
        'INSERT INTO admins (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
      )
      .bind(username, email, passwordHash, role)
      .run()
    return res.success
  }

  static async verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash)
  }

  static generateToken(admin) {
    const payload = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }
    const payloadStr = JSON.stringify(payload)
    const encodedPayload = base64UrlEncode(payloadStr)
    const signature = generateSignature(payloadStr)
    return `${encodedPayload}.${signature}`
  }

  static verifyToken(token) {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      return null
    }

    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) {
      return null
    }

    try {
      const payloadStr = base64UrlDecode(encodedPayload)
      const expectedSignature = generateSignature(payloadStr)
      if (signature !== expectedSignature) {
        return null
      }

      const payload = JSON.parse(payloadStr)
      if (payload.exp && payload.exp < Date.now()) {
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
