import bcrypt from 'bcryptjs'

const SECRET_KEY = 'careerdost-admin-secret-key-change-in-prod'

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
    const str = JSON.stringify(payload)
    const b64 = globalThis.btoa ? btoa(str) : Buffer.from(str).toString('base64')
    return b64
  }

  static verifyToken(token) {
    try {
      const str = globalThis.atob ? atob(token) : Buffer.from(token, 'base64').toString('utf-8')
      const payload = JSON.parse(str)
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
