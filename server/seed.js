import { categories } from '../src/data/categories.js'
import { listings } from '../src/data/listings.js'
import { CategoryModel } from './models/Category.js'
import { ArticleModel } from './models/Article.js'
import { AdminModel } from './models/Admin.js'
import { DailyUpdateModel } from './models/DailyUpdate.js'

export async function seedDatabase(db) {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        label TEXT NOT NULL,
        short TEXT NOT NULL,
        tone TEXT NOT NULL DEFAULT 'slate',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } catch {}

  try {
    await db.exec(`
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
      )
    `)
  } catch {}

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } catch {}

  try {
    await db.exec(`
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
      )
    `)
  } catch {}

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS update_images (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        data TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } catch {}

  // 2. Seed Categories if empty
  try {
    const existingCategories = await CategoryModel.getAll(db)
    if (existingCategories.length === 0) {
      for (const cat of categories) {
        await CategoryModel.create(db, {
          slug: cat.slug,
          label: cat.label,
          short: cat.short,
          tone: cat.tone,
          description: cat.description,
        })
      }
    }
  } catch (err) {
    console.warn('Category seeding note:', err.message)
  }

  // 3. Seed Articles if empty
  try {
    const existingArticles = await ArticleModel.getAll(db)
    if (existingArticles.length === 0) {
      for (const item of listings) {
        await ArticleModel.create(db, item)
      }
    }
  } catch (err) {
    console.warn('Article seeding note:', err.message)
  }

  // 4. Seed Admin user if empty
  try {
    const existingAdmins = await AdminModel.getAll(db)
    if (existingAdmins.length === 0) {
      await AdminModel.create(db, {
        username: '4330426358809',
        email: '4330426358809',
        password: 'Faizan2345',
        role: 'superadmin',
      })
    }
  } catch (err) {
    console.warn('Admin seeding note:', err.message)
  }

  // 5. Seed Daily Updates if empty
  try {
    const existingUpdates = await DailyUpdateModel.getAll(db)
    if (existingUpdates.length === 0) {
      const sampleUpdates = [
        {
          slug: 'fpsc-consolidated-advertisement-09-2026-announced',
          title: 'FPSC Consolidated Advertisement No. 09/2026 Announced for 450+ Federal Posts',
          category: 'Government Jobs',
          shortDescription: 'Federal Public Service Commission (FPSC) has released General Recruitment Advertisement 09/2026 covering Inspectors, Lecturers, and Assistant Directors across various federal ministries.',
          content: [
            'The Federal Public Service Commission (FPSC) has officially published Consolidated Advertisement No. 09/2026, inviting applications from eligible Pakistani candidates for over 450 general recruitment positions.',
            'Major departments included in this recruitment drive are the Federal Investigation Agency (FIA), Ministry of Defense, FGEI Schools & Colleges, and Inland Revenue Department.',
            'Candidates are advised to read the detailed eligibility criteria, age limits, and required academic qualifications before submitting their online applications on the official FPSC portal before the closing date.'
          ],
          officialLink: 'https://fpsc.gov.pk',
          applyLink: 'https://online.fpsc.gov.pk',
          deadline: '2026-10-15',
          publishDate: new Date().toISOString(),
          status: 'published'
        },
        {
          slug: 'hec-fully-funded-phd-scholarships-2026-open',
          title: 'HEC Announces Fully Funded Overseas PhD Scholarships 2026 for Top Global Universities',
          category: 'Scholarships',
          shortDescription: 'Higher Education Commission (HEC) Pakistan invites applications for fully funded PhD scholarships in top-ranked international universities for Fall 2026 enrollment.',
          content: [
            'HEC Pakistan has opened applications for its flagship Overseas Scholarship Scheme Phase-III for PhD studies in selected fields of Engineering, Technology, Medicine, and Social Sciences.',
            'The scholarship covers full tuition fees, living stipend, round-trip airfare, and health insurance for the entire duration of the PhD program.',
            'Pakistani citizens and AJ&K nationals holding a master’s or 18-year equivalent qualification with a minimum of 3.0 CGPA are eligible to apply.'
          ],
          officialLink: 'https://hec.gov.pk',
          applyLink: 'https://eportal.hec.gov.pk',
          deadline: '2026-10-30',
          publishDate: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          status: 'published'
        },
        {
          slug: 'state-bank-officer-training-scheme-sbots-batch-27',
          title: 'State Bank of Pakistan SBOTS Batch 27 Recruitment Notification Released',
          category: 'Bank Jobs',
          shortDescription: 'State Bank of Pakistan (SBP) announces Officer Training Scheme (SBOTS Batch 27) for Og-2 Grade Officers. High salary package with competitive perks.',
          content: [
            'The State Bank of Pakistan (SBP) is recruiting talented and energetic graduates for the State Bank Officer Training Scheme (SBOTS 27th Batch) in Grade OG-2.',
            'Selection will be conducted through a rigorous written test administered by NTS followed by panel interviews.',
            'Successful candidates will undergo comprehensive residential training at the National Institute of Banking & Finance (NIBAF) Islamabad before posting.'
          ],
          officialLink: 'https://sbp.org.pk',
          applyLink: 'https://nts.org.pk',
          deadline: '2026-10-20',
          publishDate: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
          status: 'published'
        },
        {
          slug: 'nts-nat-2026-october-test-roll-number-slips-uploaded',
          title: 'NTS NAT 2026 October Test Roll Number Slips & Test Center Allocation Uploaded',
          category: 'Results / Test Updates',
          shortDescription: 'National Testing Service (NTS) has uploaded the electronic Roll Number Slips for National Aptitude Test (NAT 2026-X) scheduled for coming Sunday.',
          content: [
            'Candidates who registered for NTS NAT 2026 (October cycle) can now download their admit cards directly from the official NTS candidate portal.',
            'Please ensure you bring your printed Roll Number Slip along with your original CNIC/Smart Card to the assigned test center.'
          ],
          officialLink: 'https://nts.org.pk',
          deadline: '2026-10-05',
          publishDate: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
          status: 'published'
        },
        {
          slug: 'pm-youth-laptop-scheme-phase-4-registration-alert',
          title: 'Prime Minister Youth Laptop Scheme Phase IV Online Registration Deadline Alert',
          category: 'Deadline Alerts',
          shortDescription: 'Final 3 days remaining to complete online validation for PM Youth Free Laptop Scheme Phase IV for university students.',
          content: [
            'Students enrolled in public sector universities across Pakistan are reminded that online data verification for the PM Youth Laptop Distribution Scheme closes this week.',
            'Verify your enrollment data on the HEC PM YLS portal to ensure inclusion in the final merit list.'
          ],
          officialLink: 'https://pmyp.gov.pk',
          deadline: '2026-09-30',
          publishDate: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
          status: 'published'
        }
      ]

      for (const updateData of sampleUpdates) {
        await DailyUpdateModel.create(db, updateData)
      }
    }
  } catch (err) {
    console.warn('Daily updates seeding note:', err.message)
  }
}

