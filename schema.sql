-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  short TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'slate',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Articles Table
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

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
