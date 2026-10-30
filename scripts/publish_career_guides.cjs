const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

const guides = [
  {
    slug: 'spsc-exam-preparation-screening-challan-guide',
    title: 'SPSC Exam Preparation Guide: Screening Test, Syllabus, Challan & Quota Rules',
    category: 'career-guides',
    organization: 'Sindh Public Service Commission (SPSC)',
    jobType: 'Provincial Career Examination Guide',
    location: 'Sindh, Pakistan',
    qualification: 'Graduation / Bachelor’s Degree (14 or 16 Years)',
    salary: 'BPS-16 to BPS-18 Provincial Cadre Pay Scales',
    experience: 'Fresh Graduates & In-Service Candidates',
    positions: 'Combined Competitive Examination (CCE) & General Departmental Recruitment',
    lastDate: '',
    noDeadline: true,
    publishDate: '2026-10-30',
    officialLink: 'https://spsc.gov.pk',
    applyLink: 'https://spsc.gov.pk',
    isVerified: true,
    featured: true,
    logoInitial: 'SPSC',
    featuredImage: '/images/spsc-cce-2026-examination-reforms-age-attempts-screening.webp',
    imageAlt: 'SPSC Exam Preparation Screening Test Syllabus and Challan Guide CareerDost',
    excerpt: 'Comprehensive guide to Sindh Public Service Commission (SPSC) exams covering pre-interview screening tests, negative marking, 1Bill PSID fee challan generation, age relaxation, and syllabus breakdown.',
    seoTitle: 'SPSC Exam Preparation Guide: Screening Test, Challan & Quotas — CareerDost',
    metaDescription: 'Complete preparation guide for Sindh Public Service Commission (SPSC) exams. Learn about 100-MCQ screening structure, negative marking, 1Bill PSID challan payment, and age relaxation rules.',
    focusKeyword: 'SPSC Exam Preparation Screening Test Challan',
    canonicalUrl: 'https://careerdost.blog/jobs/spsc-exam-preparation-screening-challan-guide',
    ogTitle: 'SPSC Exam Preparation Guide: Screening Test, Challan & Quotas — CareerDost',
    ogDescription: 'Complete preparation guide for Sindh Public Service Commission (SPSC) exams. Learn about 100-MCQ screening structure, negative marking, 1Bill PSID challan payment, and age relaxation rules.',
    status: 'published',
    content: [
      '> [!IMPORTANT]\n> **Official Commission Reference & Purpose:**\n> - **Statutory Body:** Sindh Public Service Commission (SPSC), Government of Sindh, Hyderabad.\n> - **Coverage:** Combined Competitive Examination (CCE) and General Departmental Recruitment (BPS-16 to BPS-18).\n> - **Official Web Portal:** [spsc.gov.pk](https://spsc.gov.pk).\n> - **Fee Payment Standard:** Online via **1Link / 1Bill PSID Voucher** (Paper bank challans phased out).',
      '### Understanding SPSC Recruitment Framework',
      'The **Sindh Public Service Commission (SPSC)** is the constitutional body mandated under the Sindh Public Service Commission Act to recruit officers into the provincial civil service. SPSC oversees two broad recruitment streams:\n1. **Combined Competitive Examination (CCE):** Entry into the prestigious Executive Cadre (Assistant Commissioner / Ex-PCS), Police Service (Deputy Superintendent of Police / DSP), and Section Officers (BPS-17).\n2. **General Departmental Recruitment:** Department-specific recruitment for College Lecturers, Subject Specialists, Medical Officers, Assistant Executive Engineers (AEE), Municipal Officers (MO), and Town Officers (TO) across Sindh Government departments.',
      '### Pre-Interview Written Screening Test Architecture',
      'For general posts and CCE preliminary screening, SPSC administers a standardized computer-scored Objective Multiple Choice Questions (MCQ) examination:',
      '| Examination Parameter | Verified SPSC Standard |\n| :--- | :--- |\n| **Total Marks** | **100 Marks** (100 Objective Questions) |\n| **Examination Duration** | **100 Minutes** (1 Minute per question) |\n| **Negative Marking Policy** | **Yes — 0.25 Marks deducted per incorrect answer** (4 wrong answers erase 1 correct mark) |\n| **Passing Threshold** | Generally **50% Marks** (Subject to departmental competitive merit cutoffs) |\n| **Testing Centers** | Karachi, Hyderabad, Sukkur, Larkana, and Mirpurkhas |',
      '### General Recruitment Syllabus Breakdown',
      '- **General Academic & Administrative Posts (Lecturers, Municipal Officers, Accountants):**\n  - **Part I: General Knowledge & Current Affairs (20% to 30%):** Pakistan Studies, Constitution of Pakistan, Islamic Studies (Ethics for non-Muslims), Everyday Science, and Geography of Sindh.\n  - **Part II: English Language (20%):** Grammar usage, sentence structuring, synonyms/antonyms, prepositions, and reading comprehension.\n  - **Part III: Professional / Academic Specialization (50% to 60%):** Subject-specific discipline questions aligned with master’s or bachelor’s university curricula.',
      '### How to Generate and Pay SPSC 1Bill PSID Online Fee',
      'SPSC has transitioned from manual National Bank of Pakistan (NBP) paper challan forms to digital **1Link 1Bill PSID invoice payments**:\n1. **Create SPSC Profile:** Log in to `spsc.gov.pk` with your CNIC and register your profile.\n2. **Select Vacancy:** Apply for the desired post and click **"Generate PSID"**.\n3. **17-Digit PSID Generation:** The portal generates a unique 17-digit 1Bill Consumer Number for the statutory Rs. 500 examination fee.\n4. **Payment Options:** Open any Pakistani banking app (HBL, Meezan, UBL, Alfalah), Easypaisa, JazzCash, or Nayapay -> Go to **Bill Payment / 1Bill Invoices** -> Enter the 17-digit PSID -> Verify candidate name and amount (Rs. 500) -> Confirm payment.\n5. **Instant Portal Reconciliation:** The SPSC portal automatically marks fee status as "Paid" within seconds, eliminating manual voucher uploads.',
      '### Sindh Government Age Relaxation Framework',
      'Under continuous executive notifications issued by the Services, General Administration & Coordination Department (SGA&CD), Government of Sindh:\n- The Government of Sindh grants **up to 15 years general age relaxation** for general recruitment across provincial departments (subject to post-specific maximum ceilings announced in advertisements).\n- In-service provincial government employees with at least 3 years continuous service receive additional service relaxations.\n- Disabled candidates and minority communities benefit from reserved provincial quotas (5% each under Sindh rules).',
      '### Mandatory Document Checklist for SPSC Interview Stage',
      'Candidates qualifying the written screening test must produce original and attested copies of:\n1. Computerized National Identity Card (CNIC).\n2. Permanent Residence Certificate (PRC Form-D) and Domicile Certificate of the relevant Sindh district.\n3. Matriculation Certificate (Pacca Certificate) showing verified date of birth.\n4. Intermediate and Bachelor’s/Master’s degrees along with official transcripts.\n5. Departmental No Objection Certificate (NOC) for candidates currently employed in federal or provincial departments.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: How should candidates handle negative marking on SPSC screening tests?**\nBecause SPSC deducts 0.25 marks for every incorrect answer, candidates should avoid random guessing. If you can eliminate two incorrect options, intelligent guessing may be mathematically favorable, but purely blind guessing reduces your aggregate score.\n\n**Q2: What is the validity of the SPSC 1Bill PSID voucher?**\nPSID vouchers typically remain valid until the official advertisement closing date. However, candidates should pay immediately upon generation to prevent last-minute banking gateway congestion.\n\n**Q3: Where are SPSC test dates and interview schedules officially announced?**\nOfficial press releases and interview lists are uploaded exclusively on [spsc.gov.pk](https://spsc.gov.pk).'
    ]
  },
  {
    slug: 'fpsc-online-application-challan-form-32a-guide',
    title: 'FPSC Online Application Guide: Treasury Challan 32-A, Quotas & Test Scheme',
    category: 'career-guides',
    organization: 'Federal Public Service Commission (FPSC)',
    jobType: 'Federal Career Recruitment Guide',
    location: 'Pakistan (All Provinces & Regions)',
    qualification: 'Bachelor’s / Master’s Degree (14-16 Years)',
    salary: 'BPS-16 to BPS-19 Federal Pay Scales',
    experience: 'Fresh Graduates & In-Service Federal Servants',
    positions: 'General Recruitment Consolidated Advertisements (Phases I to V)',
    lastDate: '',
    noDeadline: true,
    publishDate: '2026-10-30',
    officialLink: 'https://fpsc.gov.pk',
    applyLink: 'https://online.fpsc.gov.pk',
    isVerified: true,
    featured: true,
    logoInitial: 'FPSC',
    featuredImage: '/images/fpsc-consolidated-advertisement-09-2026-announced.webp',
    imageAlt: 'FPSC Online Application Treasury Challan Form 32-A Guide CareerDost',
    excerpt: 'Official guide to applying for Federal Public Service Commission (FPSC) jobs. Review Treasury Challan Form 32-A deposit details, fee tiers, provincial quotas, and online application steps.',
    seoTitle: 'FPSC Online Application Guide: Challan Form 32-A & Quotas — CareerDost',
    metaDescription: 'Step-by-step guide to applying on the FPSC online portal. Learn how to fill Treasury Challan Form 32-A, deposit exam fees at NBP/SBP, calculate provincial quotas, and track Phase schedules.',
    focusKeyword: 'FPSC Online Application Treasury Challan Form 32-A',
    canonicalUrl: 'https://careerdost.blog/jobs/fpsc-online-application-challan-form-32a-guide',
    ogTitle: 'FPSC Online Application Guide: Challan Form 32-A & Quotas — CareerDost',
    ogDescription: 'Step-by-step guide to applying on the FPSC online portal. Learn how to fill Treasury Challan Form 32-A, deposit exam fees at NBP/SBP, calculate provincial quotas, and track Phase schedules.',
    status: 'published',
    content: [
      '> [!IMPORTANT]\n> **Official Federal Reference & Purpose:**\n> - **Authority:** Federal Public Service Commission (FPSC), Aga Khan Road, F-5/1, Islamabad.\n> - **Portal Gateway:** [online.fpsc.gov.pk](https://online.fpsc.gov.pk).\n> - **Recruitment Scope:** Federal Ministries, FIA, FBR, Intelligence Bureau, Defense, and National Highways.\n> - **Fee Deposit Head of Account:** `C02101-Organs of State-Exam Fee (FPSC Receipts)`.',
      '### Overview of FPSC General Recruitment',
      'The **Federal Public Service Commission (FPSC)** is the supreme federal recruitment agency responsible for selecting officers for the Civil Superior Services (CSS) and General Recruitment into gazetted federal posts ranging from **BPS-16 to BPS-20**. Unlike provincial commissions, FPSC operates under a strict calendar of monthly Consolidated Advertisements published on the first Sunday of every month.',
      '### Treasury Challan Form 32-A & Official Fee Structure',
      'Candidates applying for FPSC positions must deposit examination fees prior to submitting online applications using **Treasury Challan Form 32-A**:',
      '| Pay Scale Cadre | Statutory FPSC Examination Fee | Designated Deposit Banks |\n| :--- | :--- | :--- |\n| **Basic Pay Scale BPS-16 & BPS-17** | **PKR 300** | National Bank of Pakistan (NBP) or State Bank of Pakistan (SBP) |\n| **Basic Pay Scale BPS-18** | **PKR 750** | National Bank of Pakistan (NBP) or State Bank of Pakistan (SBP) |\n| **Basic Pay Scale BPS-19** | **PKR 1,200** | National Bank of Pakistan (NBP) or State Bank of Pakistan (SBP) |\n| **Basic Pay Scale BPS-20 & BPS-21** | **PKR 1,500** | National Bank of Pakistan (NBP) or State Bank of Pakistan (SBP) |',
      '### Step-by-Step Instructions: How to Complete Form 32-A',
      '1. Download the blank 4-copy Treasury Challan Form 32-A from the FPSC website or obtain it at any National Bank of Pakistan branch.\n2. **Bank Head of Account:** Enter `C02101-Organs of State-Exam Fee (FPSC Receipts)`.\n3. **Candidate Details:** Write your full name, CNIC number, Case Number (e.g., `F.4-150/2026-R`), and post title.\n4. **Deposit:** Deposit cash at any NBP branch counter.\n5. **Retain Original Copy:** The bank returns the "Candidate Copy" with official bank seal, date, and scroll/branch code. **Retain this original receipt**; it must be surrendered at the physical examination center.',
      '### Federal Provincial Quota Distribution Formula',
      'Under the Federal Civil Servants (Appointment, Promotion & Transfer) Rules, all general recruitment vacancies are distributed according to statutory regional quotas:',
      '| Regional / Provincial Quota | Percentage Allocation | Eligible Population Pool |\n| :--- | :--- | :--- |\n| **Open Merit (All Pakistan)** | **7.5%** | Highest scores nationwide regardless of provincial domicile |\n| **Punjab** | **50.0%** | Candidates holding Punjab Domicile & CNIC |\n| **Sindh (Rural)** | **11.4%** | Rural Sindh districts (excluding Karachi, Hyderabad, Sukkur municipal limits) |\n| **Sindh (Urban)** | **7.6%** | Urban centers of Karachi, Hyderabad, and Sukkur |\n| **Khyber Pakhtunkhwa (KPK)** | **11.5%** | Settled districts of Khyber Pakhtunkhwa |\n| **Balochistan** | **6.0%** | Candidates holding verified Balochistan Local / Domicile |\n| **Newly Merged Districts (Ex-FATA)**| **3.0%** | Tribal districts of Khyber Pakhtunkhwa |\n| **Azad Jammu & Kashmir (AJK)** | **2.0%** | State of Azad Jammu & Kashmir |\n| **Gilgit-Baltistan (GB)** | **1.0%** | Gilgit-Baltistan administrative region |',
      '### Federal Age Relaxation Rules',
      '- **General 5-Year Relaxation:** All candidates receive a blanket 5-year general age relaxation over the advertised age limit (e.g., 28 years becomes **33 years**).\n- **Government Servants:** In-service federal civil servants with 2 years continuous service receive up to 10 years relaxation up to age 55.\n- **Armed Forces Personnel:** Retired or released officers/men receive relaxation equivalent to their active service years (up to 15 years).\n- **Widows / Children of Deceased Civil Servants:** Up to 5 years relaxation under the Prime Minister Assistance Package.',
      '### How to Complete Online Application on FPSC Portal',
      '1. Navigate to [online.fpsc.gov.pk](https://online.fpsc.gov.pk).\n2. Click on **"Apply Online"** -> Select **General Recruitment**.\n3. Input your CNIC and the Case Number from the advertisement.\n4. Input bank challan details: Bank Name, Branch Code, Deposit Date, and Amount Paid.\n5. Enter educational qualifications, major subjects, division/CGPA, and university award date.\n6. Select your preferred examination center and interview center (Islamabad, Lahore, Karachi, Peshawar, Quetta, Multan, Sukkur, Gilgit).\n7. Submit and print the application confirmation slip.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can an applicant deposit one challan for two different FPSC case numbers?**\nNo. Every distinct case number requires a separate individual Treasury Challan receipt. Combining multiple case fees on a single voucher will result in rejection of applications.\n\n**Q2: What happens if an applicant enters an incorrect challan date on the portal?**\nFPSC allows online profile editing only until the official closing date. Ensure all challan numbers and dates are entered accurately before final submission.\n\n**Q3: When are FPSC admission certificates (Roll Number Slips) released?**\nAdmission certificates are posted online approximately 2 to 3 weeks before Phase screening exams begin on [online.fpsc.gov.pk](https://online.fpsc.gov.pk).'
    ]
  },
  {
    slug: 'national-job-portal-njp-pakistan-application-guide',
    title: 'National Job Portal (NJP) Guide: Profile Setup, Resume Builder & Online Application',
    category: 'career-guides',
    organization: 'National Job Portal (NJP), Ministry of Information Technology & Telecommunication',
    jobType: 'Federal Career Technology Guide',
    location: 'Pakistan (All Federal Ministries & Autonomous Bodies)',
    qualification: 'Matriculation to PhD (BPS-01 to BPS-22 / PPS Scales)',
    salary: 'Federal Basic Pay Scales & Project Pay Scales',
    experience: 'All Career Levels (Fresh, Intermediate, Executive)',
    positions: 'Federal Civil Service, Autonomous Corporations & PSDP Project Staff',
    lastDate: '',
    noDeadline: true,
    publishDate: '2026-10-30',
    officialLink: 'https://njp.gov.pk',
    applyLink: 'https://njp.gov.pk',
    isVerified: true,
    featured: true,
    logoInitial: 'NJP',
    featuredImage: '/images/sindh-government-jobs-2026-spsc-sts-guide.webp',
    imageAlt: 'National Job Portal NJP Pakistan Online Application and Profile Guide CareerDost',
    excerpt: 'Complete official guide to applying for federal government jobs on the National Job Portal (njp.gov.pk). Learn how to achieve 100% profile completion, build your online resume, and track applications.',
    seoTitle: 'National Job Portal (NJP) Pakistan: Complete Application Guide — CareerDost',
    metaDescription: 'Complete step-by-step guide to applying for federal jobs on the National Job Portal (njp.gov.pk). Learn profile completion steps, resume builder, zero-fee policy, and application tracking.',
    focusKeyword: 'National Job Portal NJP Pakistan Apply Online',
    canonicalUrl: 'https://careerdost.blog/jobs/national-job-portal-njp-pakistan-application-guide',
    ogTitle: 'National Job Portal (NJP) Pakistan: Complete Application Guide — CareerDost',
    ogDescription: 'Complete step-by-step guide to applying for federal jobs on the National Job Portal (njp.gov.pk). Learn profile completion steps, resume builder, zero-fee policy, and application tracking.',
    status: 'published',
    content: [
      '> [!IMPORTANT]\n> **Official Federal Reference & Purpose:**\n> - **Platform:** National Job Portal (NJP) / Central Employment Exchange.\n> - **Operating Agency:** National Information Technology Board (NITB) & Ministry of IT & Telecom.\n> - **Official Web Gateway:** [njp.gov.pk](https://njp.gov.pk).\n> - **Statutory Fee Rule:** **100% Free of Cost** — NJP never charges any application or processing fees to citizens.',
      '### What is the National Job Portal (NJP)?',
      'The **National Job Portal (njp.gov.pk)** is the Government of Pakistan’s centralized digital employment infrastructure. Established under the Digital Pakistan initiative, NJP connects Pakistani jobseekers with vacancies across federal ministries, divisions, attached departments, regulatory authorities (such as NEPRA, OGRA, PTA), and Public Sector Development Programme (PSDP) projects.',
      '### Key Specifications Table',
      '| Platform Feature | Verified Official Specification |\n| :--- | :--- |\n| **Managing Ministry** | Ministry of Information Technology & Telecommunication (MoITT) |\n| **Technical Execution** | National Information Technology Board (NITB) |\n| **Coverage** | All Federal Ministries, Autonomous Authorities, Armed Forces Civilian Cadres |\n| **Application Cost** | **Zero Fee (PKR 0)** — Free online submission for all citizens |\n| **Identity Verification** | Direct automated integration with NADRA CNIC database |\n| **Supported Scales** | Basic Pay Scales (BPS-01 to BPS-22) & Project Pay Scales (PPS-01 to PPS-12) |',
      '### 6 Steps to Achieve 100% Profile Completion on NJP',
      'Federal departments use automated algorithmic screening on NJP to filter candidate resumes. Incomplete profiles are automatically bypassed by the system. Follow these 6 steps to reach 100% completion:\n1. **Personal Information:** Enter full name exactly as written on your CNIC, 13-digit CNIC number, date of birth, domicile province, and district.\n2. **Contact & Address:** Provide verified active mobile number (convert numbers often fail SMS gateways; ensure number is active) and permanent postal address.\n3. **Academic Qualifications:** Add all degrees chronologically (Matric, Intermediate, Bachelor’s, Master’s). Ensure HEC degree titles and CGPA/Division match transcripts.\n4. **Professional Experience:** Detail past employment, employer names, designation, start/end dates, and job duties.\n5. **Skills & Certifications:** Select relevant technical skills (e.g., Python, Accounting, Shorthand, Data Analysis) and upload relevant certificates (e.g., PEC, PM&DC, NITB IT Course).\n6. **Resume Document Upload:** Upload a clean PDF copy of your CV along with a passport-size photo with white background (under 500 KB).',
      '### How to Apply for Vacancies on NJP',
      '1. Log in to [njp.gov.pk](https://njp.gov.pk) with your CNIC and password.\n2. In the search bar, filter vacancies by **Ministry / Department**, **Scale (BPS/PPS)**, or **Location**.\n3. Click **"View Details"** on the vacancy of interest and review quota distribution and mandatory criteria.\n4. Click **"Apply Now"**.\n5. Select your highest relevant qualification from your profile and click **"Confirm Submission"**.\n6. The portal issues a unique **Application Tracking ID** instantly.',
      '### Anti-Fraud & Citizen Safety Warning',
      '- **Zero Fee Policy:** The Federal Government does **NOT** charge any application fee, registration fee, or interview fee for submissions on `njp.gov.pk`.\n- **Scam Protection:** Beware of unauthorized third-party websites or fake WhatsApp groups asking for Easypaisa / JazzCash transfers for NJP forms. Always ensure the browser address bar reads `https://njp.gov.pk`.\n- **Authentic Credentials:** Submitting false academic degrees or fake domicile certificates on NJP leads to immediate disqualification and blacklisting across all federal recruitments under the Pakistan Penal Code.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates edit their NJP profile after applying for a job?**\nYes. You can update your master profile on NJP at any time. However, the snapshot of your resume submitted for a specific job remains frozen at the time of application submission.\n\n**Q2: What does "Application Under Scrutiny" mean on the NJP candidate dashboard?**\nThis status indicates that the recruiting ministry’s departmental scrutiny committee has downloaded candidate applications and is verifying academic criteria against advertised quotas.\n\n**Q3: How do applicants receive call letters for NJP jobs?**\nShortlisted candidates receive automated SMS alerts on their registered mobile numbers and official call letters uploaded inside their NJP account dashboard.'
    ]
  }
];

async function publishGuides() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  console.log('=== PUBLISHING 3 CORNERSTONE CAREER GUIDES ===\n');

  for (const guide of guides) {
    console.log(`>>> Creating Guide on Cloudflare D1: ${guide.slug}`);

    const res = await fetch('https://careerdost.blog/api/admin/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(guide)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      console.error(`Error creating guide on D1 for ${guide.slug}:`, json);
      throw new Error(`D1 creation failed for ${guide.slug}`);
    }
    console.log(`SUCCESS: Cloudflare D1 created guide ${guide.slug} (ID: ${json.data?.id})`);

    // Insert into local SQLite
    console.log(`>>> Inserting Guide into Local SQLite: ${guide.slug}`);
    localDb.prepare(`
      INSERT INTO articles (
        slug, title, category_slug, organization, job_type, location,
        qualification, salary, experience, positions, last_date, no_deadline,
        publish_date, official_link, apply_link, is_verified, featured,
        logo_initial, featured_image, image_alt, excerpt, content,
        seo_title, meta_description, focus_keyword, canonical_url,
        og_title, og_description, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      guide.slug,
      guide.title,
      guide.category,
      guide.organization,
      guide.jobType,
      guide.location,
      guide.qualification,
      guide.salary,
      guide.experience,
      guide.positions,
      guide.lastDate,
      guide.noDeadline ? 1 : 0,
      guide.publishDate,
      guide.officialLink,
      guide.applyLink,
      guide.isVerified ? 1 : 0,
      guide.featured ? 1 : 0,
      guide.logoInitial,
      guide.featuredImage,
      guide.imageAlt,
      guide.excerpt,
      JSON.stringify(guide.content),
      guide.seoTitle,
      guide.metaDescription,
      guide.focusKeyword,
      guide.canonicalUrl,
      guide.ogTitle,
      guide.ogDescription,
      guide.status
    );
    console.log(`SUCCESS: Local SQLite inserted guide ${guide.slug}\n`);
  }

  console.log('=== ALL 3 CAREER GUIDES PUBLISHED SUCCESSFULLY ===');
}

publishGuides().catch(console.error);
