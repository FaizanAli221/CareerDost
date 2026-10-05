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

  // Safe Column Migrations for D1 & SQLite
  const colMigrations = [
    "ALTER TABLE articles ADD COLUMN status TEXT NOT NULL DEFAULT 'published'",
    "ALTER TABLE articles ADD COLUMN featured_image TEXT",
    "ALTER TABLE articles ADD COLUMN image_alt TEXT",
    "ALTER TABLE articles ADD COLUMN experience TEXT",
    "ALTER TABLE articles ADD COLUMN positions TEXT",
    "ALTER TABLE articles ADD COLUMN apply_link TEXT",
    "ALTER TABLE articles ADD COLUMN is_verified INTEGER DEFAULT 0",
    "ALTER TABLE articles ADD COLUMN focus_keyword TEXT",
    "ALTER TABLE articles ADD COLUMN canonical_url TEXT",
    "ALTER TABLE articles ADD COLUMN og_title TEXT",
    "ALTER TABLE articles ADD COLUMN og_description TEXT",
    "ALTER TABLE articles ADD COLUMN no_deadline INTEGER DEFAULT 0",

    "ALTER TABLE daily_updates ADD COLUMN organization TEXT",
    "ALTER TABLE daily_updates ADD COLUMN location TEXT",
    "ALTER TABLE daily_updates ADD COLUMN qualification TEXT",
    "ALTER TABLE daily_updates ADD COLUMN experience TEXT",
    "ALTER TABLE daily_updates ADD COLUMN positions TEXT",
    "ALTER TABLE daily_updates ADD COLUMN job_type TEXT",
    "ALTER TABLE daily_updates ADD COLUMN salary TEXT",
    "ALTER TABLE daily_updates ADD COLUMN is_verified INTEGER DEFAULT 0",
    "ALTER TABLE daily_updates ADD COLUMN focus_keyword TEXT",
    "ALTER TABLE daily_updates ADD COLUMN canonical_url TEXT",
    "ALTER TABLE daily_updates ADD COLUMN og_title TEXT",
    "ALTER TABLE daily_updates ADD COLUMN og_description TEXT",
    "ALTER TABLE daily_updates ADD COLUMN no_deadline INTEGER DEFAULT 0",
    "ALTER TABLE daily_updates ADD COLUMN featured INTEGER DEFAULT 0",
  ]
  for (const sql of colMigrations) {
    try {
      await db.exec(sql)
    } catch {}
  }

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

  // 3. Seed Articles (Ensure all listings exist in DB)
  try {
    for (const item of listings) {
      const existing = await ArticleModel.getBySlug(db, item.slug)
      if (!existing) {
        await ArticleModel.create(db, item)
      } else {
        await ArticleModel.update(db, item.slug, item)
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

  // 5. Seed Daily Updates (Ensure all sample updates exist in DB)
  try {
    const sampleUpdates = [
      {
        slug: 'uoh-haripur-admissions-2026-deadline-today',
        title: 'University of Haripur Admissions Fall 2026 – Apply Online Today Before Sept 29',
        category: 'Deadline Alerts',
        shortDescription: 'ALERT: Today (September 29, 2026) is the final deadline for University of Haripur Fall 2026 BS, BS 5th Semester bridge, and Diploma degree program online applications.',
        content: [
          'Today, September 29, 2026, is the final deadline for University of Haripur Fall 2026 undergraduate admissions.',
          '1st Merit list will be displayed on October 1, 2026.',
          'Apply online via uoh.edu.pk/admissions/schedule before midnight.'
        ],
        featuredImage: '/images/uoh-haripur-admissions-2026.svg',
        imageAlt: 'University of Haripur Admissions Fall 2026 Deadline Today September 29',
        officialLink: 'https://www.uoh.edu.pk/admissions/schedule',
        applyLink: 'https://www.uoh.edu.pk/admissions/schedule',
        deadline: '2026-09-29',
        publishDate: '2026-09-29',
        status: 'published'
      },
      {
        slug: 'virtual-university-admissions-2026-deadline-tomorrow',
        title: 'Virtual University Fall 2026 Admissions – Apply Before Sept 30 Tomorrow',
        category: 'Admissions',
        shortDescription: 'DEADLINE TOMORROW: Virtual University of Pakistan (VU) Fall 2026 online admission applications close on Wednesday, September 30, 2026.',
        content: [
          'Virtual University Fall 2026 admissions deadline is tomorrow, Wednesday, September 30, 2026.',
          'Rs. 500 processing fee. Apply online via vu.edu.pk/apply for BS, Associate Degree, B.Ed, and MS/MPhil programs.'
        ],
        featuredImage: '/images/virtual-university-admissions-2026.svg',
        imageAlt: 'Virtual University Fall 2026 Admissions Apply Online Before Sept 30 Deadline',
        officialLink: 'https://vu.edu.pk/Admissions/AdmissionProcedure',
        applyLink: 'https://www.vu.edu.pk/apply',
        deadline: '2026-09-30',
        publishDate: '2026-09-29',
        status: 'published'
      },
      {
        slug: 'hec-peridot-research-program-phase-13-2026',
        title: 'HEC PERIDOT Research Program Phase XIII – Apply Before Sept 30 Tomorrow',
        category: 'Scholarships',
        shortDescription: 'DEADLINE TOMORROW: HEC Pakistan and Campus France PERIDOT Phase XIII joint research proposal submissions close September 30, 2026 at 16:00 PST.',
        content: [
          'HEC PERIDOT Phase XIII joint Franco-Pakistani research grant call closes tomorrow, September 30, 2026 at 16:00 PST.',
          'Mandatory joint application required via HEC E-Portal and Campus France.'
        ],
        featuredImage: '/images/hec-peridot-research-2026.svg',
        imageAlt: 'HEC PERIDOT Research Program Phase XIII Apply Online Before September 30',
        officialLink: 'https://www.hec.gov.pk/english/services/faculty/peridot/pages/default.aspx',
        applyLink: 'https://eportal.hec.gov.pk',
        deadline: '2026-09-30',
        publishDate: '2026-09-29',
        status: 'published'
      },
      {
        slug: 'punjab-cbd-youth-career-program-2026-internship',
        title: 'Punjab CBD Youth Career Program 2026 – Apply Online for 3-Month Paid Internship',
        category: 'Internships',
        shortDescription: 'PCBDDA opens applications for Punjab CBD Youth Career Programme 2026 offering 3-month paid internships for fresh graduates (BS/BE, 3.0 CGPA, Age ≤ 25).',
        content: [
          'CBD Punjab is offering 3-month paid internships across engineering, IT, HR, finance, legal, and architecture disciplines.',
          'Apply online before October 12, 2026.'
        ],
        featuredImage: '/images/punjab-cbd-youth-career-2026.svg',
        imageAlt: 'Punjab CBD Youth Career Program 2026 3 Month Paid Internship Apply Online',
        officialLink: 'https://www.brecorder.com/news/40441735/pcbdda-opens-applications-for-youth-career-programme',
        applyLink: 'https://cbdpunjab.gov.pk',
        deadline: '2026-10-12',
        publishDate: '2026-09-29',
        status: 'published'
      },
      {
        slug: 'pec-graduate-engineer-training-get-program-2026',
        title: 'PEC Graduate Engineer Training (GET) Program 2026 – Status & Updates',
        category: 'Internships',
        shortDescription: 'PEC GET 6-month paid graduate engineer training status notice: 2025 batch cycle concluded March 25, 2026. Awaiting next batch cycle announcement.',
        content: [
          'The PEC GET 2025 batch application cycle concluded on March 25, 2026. No active open registration currently.',
          'Fresh registered engineers are advised to keep PEC RE status active for future batch announcements.'
        ],
        featuredImage: '/images/pec-get-engineer-training-2026.svg',
        imageAlt: 'PEC Graduate Engineer Training GET Program 2026 Application Status Expired',
        officialLink: 'https://www.pec.org.pk/get/',
        applyLink: 'https://www.pec.org.pk/get/',
        deadline: '2026-03-25',
        publishDate: '2026-09-29',
        status: 'published'
      },
      {
        slug: 'petrol-price-reduced-pakistan-september-2026',
        title: 'Petrol Price Reduced in Pakistan – New Petrol & Diesel Prices From September 29, 2026',
        category: 'Deadline Alerts',
        shortDescription: 'Government of Pakistan announces reduction in petroleum prices. Petrol decreased by Rs2.27/L to Rs389.03/L and High-Speed Diesel by Rs3.56/L to Rs404.97/L effective September 29, 2026.',
        content: [
          'The Government of Pakistan has officially reduced fuel prices effective September 29, 2026.',
          'Super Petrol price has been reduced by Rs2.27 per litre to Rs389.03 per litre, while High-Speed Diesel (HSD) has been slashed by Rs3.56 per litre to Rs404.97 per litre.',
          'The revised prices take effect nationwide starting midnight.'
        ],
        featuredImage: '/images/petrol-price-reduced-pakistan-2026.svg',
        imageAlt: 'Petrol Price Reduced in Pakistan September 2026 New Fuel Rates',
        officialLink: 'https://www.dawn.com/news/2033319',
        applyLink: 'https://www.dawn.com/news/2033319',
        deadline: '2026-09-29',
        publishDate: '2026-09-28',
        status: 'published'
      },
      {
        slug: 'uhs-mdcat-2026-result-recount-review-portal',
        title: 'UHS MDCAT 2026 Result Recount & Review Portal Open – Apply Before Sept 30',
        category: 'Results / Test Updates',
        shortDescription: 'UHS Lahore has activated the online MDCAT 2026 Result Recount & Grievance Review Portal for candidates seeking mark re-verification or answer sheet cross-checking.',
        content: [
          'The University of Health Sciences (UHS) Lahore has officially opened its online MDCAT 2026 Result Recounting & Review Portal.',
          'Medical and dental candidates can lodge complaints regarding score calculation, OMR bubble sheet scanning, or key verification before the closing deadline of September 30, 2026.',
          'All requests must be submitted online via the official UHS portal along with the prescribed bank processing fee receipt.'
        ],
        featuredImage: '/images/uhs-mdcat-2026-recount.jpg',
        imageAlt: 'UHS MDCAT 2026 Result Recount & Review Portal Apply Before Sept 30',
        officialLink: 'https://portals.uhs.edu.pk/complaints/',
        applyLink: 'https://portals.uhs.edu.pk/complaints/',
        deadline: '2026-09-30',
        publishDate: '2026-09-28',
        status: 'published'
      },
      {
        slug: 'hec-usat-hat-registration-2026-etc-hec',
        title: 'HEC USAT & HAT Registration 2026 – Apply Online Before October 2',
        category: 'Admissions',
        shortDescription: 'HEC Education Testing Council (ETC) invites online registrations for Undergraduate Studies Admission Test (USAT) and Higher Education Aptitude Test (HAT) 2026.',
        content: [
          'The Education Testing Council (ETC) under HEC Pakistan is conducting nationwide registrations for USAT and HAT 2026 standardized aptitude tests.',
          'USAT is required for BS degree entry while HAT is mandatory for MS/MPhil/PhD admissions and HEC scholarship schemes.',
          'Online applications must be completed on the official ETC portal (etc.hec.gov.pk) on or before October 2, 2026. Tests will take place on Sunday, October 25, 2026.'
        ],
        featuredImage: '/images/hec-usat-hat-2026.jpg',
        imageAlt: 'HEC USAT & HAT Registration 2026 Apply Online Before October 2',
        officialLink: 'https://etc.hec.gov.pk',
        applyLink: 'https://etc.hec.gov.pk',
        deadline: '2026-10-02',
        publishDate: '2026-09-28',
        status: 'published'
      },
      {
        slug: 'sbbu-admissions-2026-deadline-extended',
        title: 'SBBU Admissions 2026 Deadline Extended – Apply Before September 29',
        category: 'Admissions',
        shortDescription: 'Shaheed Benazir Bhutto University Shaheed Benazirabad extends online admission application deadline for BS, LLB, MBA, MS/MPhil and PhD to September 29, 2026.',
        content: [
          'SBBU Shaheed Benazirabad (Nawabshah) has extended its online admission application closing date to September 29, 2026 across Main Campus, Sanghar Campus, and Naushahro Feroze Campus.',
          'Entry tests will be conducted in phases between October 2 and October 18, 2026.',
          'Candidates can fill out the online admission form at admissions.sbbusba.edu.pk.'
        ],
        featuredImage: '/images/sbbu-admissions-2026.jpg',
        imageAlt: 'SBBU Admissions 2026 Deadline Extended Apply Online Before Sept 29',
        officialLink: 'https://admissions.sbbusba.edu.pk/',
        applyLink: 'https://admissions.sbbusba.edu.pk/',
        deadline: '2026-09-29',
        publishDate: '2026-09-28',
        status: 'published'
      },
      {
        slug: 'sbbu-fully-funded-scholarship-2026',
        title: 'SBBU Fully Funded Scholarship 2026 – 100% Tuition-Free Opportunity',
        category: 'Scholarships',
        shortDescription: 'Shaheed Benazir Bhutto University offers 100% tuition fee waiver scholarships for top entry test merit scorers and deserving BS, BBA, MS/MPhil & PhD applicants.',
        content: [
          'SBBU Shaheed Benazirabad has announced full 100% tuition-free merit and need-based scholarships for Academic Session 2026-27.',
          'Applicants applying for BS, BBA, MS, MPhil, or PhD programs can select the financial assistance option on the university admissions portal before September 29, 2026.'
        ],
        featuredImage: '/images/sbbu-scholarship-2026.jpg',
        imageAlt: 'SBBU Fully Funded Scholarship 2026 100 Percent Tuition Free Opportunity',
        officialLink: 'https://admissions.sbbusba.edu.pk/',
        applyLink: 'https://admissions.sbbusba.edu.pk/',
        deadline: '2026-09-29',
        publishDate: '2026-09-28',
        status: 'published'
      },
      {
        slug: 'uet-lahore-jobs-2026-faculty-research',
        title: 'UET Lahore Jobs 2026 – Faculty, Teaching & Research Opportunities',
        category: 'Government Jobs',
        shortDescription: 'University of Engineering and Technology (UET) Lahore invites applications for teaching faculty, research associates, and Chair Professors across its campuses.',
        content: [
          'UET Lahore has published fresh recruitment advertisements for Professors, Associate Professors, Assistant Professors, Lecturers, and Research Associates.',
          'Engineering positions require active PEC registration and relevant HEC publications. Candidates can apply online via jobs.uet.edu.pk and send hard copies to the Registrar Office.'
        ],
        featuredImage: '/images/uet-lahore-jobs-2026.jpg',
        imageAlt: 'UET Lahore Jobs 2026 Faculty Teaching Research Vacancies',
        officialLink: 'https://jobs.uet.edu.pk/',
        applyLink: 'https://jobs.uet.edu.pk/',
        deadline: '2026-10-31',
        publishDate: '2026-09-28',
        status: 'published'
      },
      {
        slug: 'sindh-govt-electric-scooty-scheme-2026-women',
        title: 'Sindh Govt Electric Scooty Scheme 2026 – 50,000 Scooters for Women Registration Open',
        category: 'Deadline Alerts',
        shortDescription: 'Sindh Government and SMTA announce expansion of Pink Scooty Scheme to 50,000 electric scooters for female students, working women, and entrepreneurs across Sindh.',
        content: [
          'The Sindh Mass Transit Authority (SMTA) under the Government of Sindh has announced a major policy expansion of the Sindh Pink Scooty Scheme, preparing to distribute up to 50,000 electric scooters to women across all districts.',
          'Female university students, working professionals, and entrepreneurs holding a valid Sindh domicile and permanent 2-wheeler driving license are eligible to apply online.',
          'Registration is conducted exclusively via the official SMTA web portal (smta.gos.pk/pink-scooty-registration). Applicants are urged to beware of fraudulent third-party payment requests.'
        ],
        featuredImage: '/images/sindh-electric-scooty-scheme-2026.jpg',
        imageAlt: 'Sindh Govt Electric Scooty Scheme 2026 50000 Scooters for Women',
        officialLink: 'https://smta.gos.pk/pink-scooty-registration',
        applyLink: 'https://smta.gos.pk/pink-scooty-registration',
        deadline: '2026-11-30',
        publishDate: new Date().toISOString(),
        status: 'published'
      },
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
      const existing = await DailyUpdateModel.getBySlug(db, updateData.slug)
      if (!existing) {
        await DailyUpdateModel.create(db, updateData)
      }
    }
  } catch (err) {
    console.warn('Daily updates seeding note:', err.message)
  }
}

