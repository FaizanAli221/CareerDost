let localDbInstance = null

async function getLocalDb() {
  if (!localDbInstance) {
    try {
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        const { createRequire } = await import('module')
        const req = createRequire(import.meta.url)
        const Database = req('better-sqlite3')
        const path = req('path')

        const dbPath = path.resolve(process.cwd(), 'careerdost.sqlite')
        const db = new Database(dbPath)
        db.pragma('journal_mode = WAL')
        db.pragma('foreign_keys = ON')

        // 1. Ensure table structure exists first
        db.exec(`
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            label TEXT NOT NULL,
            short TEXT NOT NULL,
            tone TEXT NOT NULL DEFAULT 'slate',
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            category_slug TEXT NOT NULL,
            organization TEXT NOT NULL,
            job_type TEXT DEFAULT 'Full Time',
            location TEXT,
            qualification TEXT,
            salary TEXT,
            last_date TEXT,
            publish_date TEXT,
            official_link TEXT,
            featured INTEGER DEFAULT 0,
            logo_initial TEXT,
            excerpt TEXT,
            content TEXT NOT NULL,
            seo_title TEXT,
            meta_description TEXT,
            status TEXT NOT NULL DEFAULT 'published',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS daily_updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            short_description TEXT NOT NULL,
            content TEXT NOT NULL,
            featured_image TEXT,
            image_alt TEXT,
            official_link TEXT,
            apply_link TEXT,
            deadline TEXT,
            publish_date TEXT NOT NULL,
            seo_title TEXT,
            meta_description TEXT,
            status TEXT NOT NULL DEFAULT 'published',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS update_images (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            mime_type TEXT NOT NULL,
            data TEXT NOT NULL,
            size INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `)

        // 2. Ensure status, featured_image, image_alt columns exist in existing tables
        try {
          const pragma = db.prepare("PRAGMA table_info('articles')").all()
          const colNames = pragma.map((col) => col.name)
          if (!colNames.includes('status')) {
            db.exec("ALTER TABLE articles ADD COLUMN status TEXT NOT NULL DEFAULT 'published'")
          }
          if (!colNames.includes('featured_image')) {
            db.exec("ALTER TABLE articles ADD COLUMN featured_image TEXT")
          }
          if (!colNames.includes('image_alt')) {
            db.exec("ALTER TABLE articles ADD COLUMN image_alt TEXT")
          }
        } catch (err) {
          console.warn('Migration check warning:', err.message)
        }

        // 3. Ensure indexes exist
        db.exec(`
          CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_slug);
          CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
          CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);
          CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
          CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
        `)

        localDbInstance = {
          prepare(sql) {
            return createD1Statement(db, sql, [])
          },
          async exec(sql) {
            db.exec(sql)
            return { count: 1, duration: 0 }
          },
        }
      } else {
        throw new Error('Not running in Node environment')
      }
    } catch (err) {
      console.warn('Local SQLite unavailable (Cloudflare Worker environment):', err.message)
      localDbInstance = {
        prepare() {
          throw new Error('Local SQLite is not available in Cloudflare Workers. Bind a D1 database named DB.')
        },
        async exec() {
          throw new Error('Local SQLite is not available in Cloudflare Workers. Bind a D1 database named DB.')
        },
      }
    }
  }
  return localDbInstance
}

function createD1Statement(db, sql, boundParams) {
  return {
    bind(...params) {
      return createD1Statement(db, sql, params)
    },
    async all() {
      try {
        const stmt = db.prepare(sql)
        const results = stmt.all(...boundParams)
        return { results, success: true }
      } catch (err) {
        console.error('D1 emulation error (all):', err, 'SQL:', sql, 'Params:', boundParams)
        throw err
      }
    },
    async first(colName) {
      try {
        const stmt = db.prepare(sql)
        const row = stmt.get(...boundParams)
        if (!row) return null
        if (colName) return row[colName]
        return row
      } catch (err) {
        console.error('D1 emulation error (first):', err, 'SQL:', sql, 'Params:', boundParams)
        throw err
      }
    },
    async run() {
      try {
        const stmt = db.prepare(sql)
        const info = stmt.run(...boundParams)
        return {
          success: true,
          meta: {
            changes: info.changes,
            last_row_id: info.lastInsertRowid,
          },
        }
      } catch (err) {
        console.error('D1 emulation error (run):', err, 'SQL:', sql, 'Params:', boundParams)
        throw err
      }
    },
  }
}

/**
 * Returns either Cloudflare D1 instance from Hono context (env.DB)
 * or local SQLite D1-compatible emulator.
 */
export function getDb(c) {
  if (c && c.env && c.env.DB) {
    return c.env.DB
  }
  // Return lazy proxy that initializes local db on first query in Node
  return {
    prepare(sql) {
      return {
        bind(...params) {
          return {
            async all() {
              const db = await getLocalDb()
              return db.prepare(sql).bind(...params).all()
            },
            async first(colName) {
              const db = await getLocalDb()
              return db.prepare(sql).bind(...params).first(colName)
            },
            async run() {
              const db = await getLocalDb()
              return db.prepare(sql).bind(...params).run()
            },
          }
        },
        async all() {
          const db = await getLocalDb()
          return db.prepare(sql).all()
        },
        async first(colName) {
          const db = await getLocalDb()
          return db.prepare(sql).first(colName)
        },
        async run() {
          const db = await getLocalDb()
          return db.prepare(sql).run()
        },
      }
    },
    async exec(sql) {
      const db = await getLocalDb()
      return db.exec(sql)
    },
  }
}
