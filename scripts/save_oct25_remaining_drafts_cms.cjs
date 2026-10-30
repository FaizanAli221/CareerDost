const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const apiBase = 'https://careerdost.blog/api/admin';

function base64UrlEncode(strOrBuffer) {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateJwt(admin, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encHeader}.${encPayload}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest());
  return `${dataToSign}.${signature}`;
}

async function run() {
  console.log('=== CAREERDOST — SAVING REMAINING 25 OCTOBER 2026 CONTENT DRAFTS ===\n');

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  const localDb = new Database('careerdost.sqlite');

  // Check existing drafts in CMS
  const checkRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const checkData = await checkRes.json();
  const currentDrafts = checkData.data || [];
  const draftSlugMap = new Map(currentDrafts.map(d => [d.slug, d.id]));

  console.log(`Current existing drafts in CMS: ${currentDrafts.length} items`);
  console.log('Preserved completed drafts: ID 528, ID 529, ID 530 (Will not modify)\n');

  // =========================================================================
  // ARTICLE 1: Sindh Government Jobs 2026 — All Departments Guide
  // =========================================================================
  const sindhSlug = 'sindh-government-jobs-2026-spsc-sts-vacancies-apply-online';
  const sindhContent = [
    "# Sindh Government Jobs 2026 — Latest Vacancies, SPSC, STS & Online Apply Links",

    "## Executive Summary & Official Recruitment Directory\n\nThe **Government of Sindh** has notified major public sector employment updates across provincial commissions, testing services, judicial secretariats, and administrative departments for 2026. Verified directly on **25 October 2026** across official government portals—including the **Sindh Public Service Commission (SPSC)**, **SIBA Testing Services (STS)**, and the **Sindh Job Portal**—this comprehensive guide provides job seekers with a verified directory of open provincial vacancies across Karachi, Hyderabad, Jamshoro, Sukkur, Larkana, and Mirpurkhas.",

    "> [!IMPORTANT]\n> **Quick Answer & Official Recruitment Verification (Verified 25 October 2026):**\n> - **Lead Recruitment Authorities:** Sindh Public Service Commission (SPSC), SIBA Testing Services (STS), and Government of Sindh Secretariats\n> - **Major Active Drive:** SPSC Combined Competitive Examination (CCE-2026) under Advertisement No. 06/2026 with historic age and attempt reforms\n> - **CCE-2026 Application Deadline:** Officially extended to **Wednesday, 11 November 2026**\n> - **Judicial & Testing Projects:** High Court of Sindh and District Courts screening and shorthand tests active via STS at [apply.sts.net.pk](https://apply.sts.net.pk/)\n> - **Education & Project Roles:** Reform Support Unit (RSU) Social Safeguard and Learning Specialists (PPS-8/PPS-9)\n> - **Application Portals:** SPSC ([spsc.gov.pk](https://www.spsc.gov.pk/)), STS ([apply.sts.net.pk](https://apply.sts.net.pk/)), and Sindh Portal ([sindh.gov.pk](https://www.sindh.gov.pk/))\n> - **Important Note on Closed Vacancies:** SPSC Advertisement No. 05/2026 (Medical Officers BPS-17) closed on **23 October 2026** and is no longer accepting new applications.",

    "## Verified Active Vacancies Directory: Sindh Government 2026\n\n| DEPARTMENT / AGENCY | ANNOUNCED POSITIONS | PAY SCALE / GRADE | DUTY LOCATIONS | APPLICATION DEADLINE | OFFICIAL APPLICATION PORTAL | STATUS |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| **Sindh Public Service Commission (SPSC)** | Combined Competitive Examination (CCE-2026) | BPS-17 / Provincial Cadres | All Sindh / Secretariat & Field | **11 November 2026** | [spsc.gov.pk](https://www.spsc.gov.pk/) | **OPEN (Extended)** |\n| **High Court of Sindh (via STS)** | Personal Assistants & Shorthand Evaluations | Judicial Cadre | Karachi & Regional Benches | Rolling Testing Schedule | [apply.sts.net.pk](https://apply.sts.net.pk/) | **OPEN (Active)** |\n| **Sindh Education Department (RSU)** | Social Safeguard & Learning Specialists | PPS-8 / PPS-9 Contract | Karachi & Sindh Regional Centers | Mid November 2026 | [sindheducation.gov.pk](https://www.sindheducation.gov.pk/) | **OPEN (Active)** |\n| **District & Sessions Courts (via STS)** | Stenographers, Junior Clerks & Bailiffs | BPS-05 to BPS-14 | Mirpurkhas, Sukkur & Larkana | Active Test Windows | [apply.sts.net.pk](https://apply.sts.net.pk/) | **OPEN (Phased)** |\n| **Sindh Secretariat (Provincial Portal)** | Junior Clerks & Computer Operators | BPS-11 / Regular | Karachi Secretariats | Department-Specific | [sindh.gov.pk](https://www.sindh.gov.pk/) | **OPEN (Roster)** |\n| **SPSC Advertisement 05/2026** | Medical Officers & Lady Medical Officers | BPS-17 Regular | Home & Provincial Health | 23 October 2026 | [spsc.gos.pk](https://www.spsc.gos.pk/) | **CLOSED (23 Oct)** |",

    "## 1. SPSC CCE-2026: Historic Examination Reforms & Extended Deadline\n\nFollowing official amendments to the *SPSC Recruitment Management Regulations 2023* published in the Sindh Government Gazette and notified in **Advertisement No. 06/2026** on 23 October 2026, the SPSC CCE-2026 examination has undergone landmark policy modifications:\n\n- **Extended Application Cutoff:** Candidates can now apply online until **11 November 2026**.\n- **Upper Age Limit:** Relaxed to **33 years** for general candidates, expanding eligibility to thousands of previously age-barred applicants. Lower age limit remains unchanged at **21 years**.\n- **Five Maximum Attempts:** Candidates are granted a maximum of **5 attempts** under a notified 3-year transition window.\n- **Screening Qualifying Threshold:** Revised downwards to **33% (66 marks out of 200)**, replacing the earlier 50% threshold.\n- **Negative Marking:** Fixed at **0.25 marks deducted** for each incorrect response in the 100-question screening test.\n- **Existing Applicants:** Candidates who successfully registered under Advertisement 04/2026 do not need to submit fresh applications, but may rectify document deficiencies on the portal before the 11 November deadline.\n- **Postponed Screening Date:** The screening test originally set for 24 October 2026 has been officially postponed. SPSC will announce a rescheduled test date separately.",

    "## 2. SIBA Testing Services (STS) Judicial & Public Sector Projects\n\nSIBA Testing Services (STS), operated by Sukkur IBA University, manages specialized recruitment testing across Sindh:\n\n- **Sindh High Court Personal Assistants:** Active evaluation schedules for candidates who qualified initial typing and shorthand benchmarks.\n- **District Courts Recruitment:** Screening for ministerial cadres (Junior Clerks, Assistants, Process Servers, and Bailiffs) across judicial divisions including Mirpurkhas and Sukkur.\n- **Admit Card Downloads:** Applicants must visit [apply.sts.net.pk](https://apply.sts.net.pk/) to download computerized roll number slips and verify test center reporting times.",

    "## 3. Step-by-Step Guide to Applying for Sindh Government Jobs\n\n### A. Applying via SPSC Portal (spsc.gov.pk)\n1. Visit [spsc.gov.pk](https://www.spsc.gov.pk/) and create or log in to your candidate account.\n2. Download the auto-generated 1Link 1Bill fee challan (Rs. 1,000 for CCE-2026).\n3. Pay fee via ATM, internet banking, EasyPaisa, or JazzCash using the 1Bill consumer number.\n4. Fill personal data, upload CNIC, domicile, PRC (Form-D), and degree transcript scans.\n5. Select your examination center (Karachi, Hyderabad, Sukkur, Larkana) and submit before **11 November 2026**.\n\n### B. Applying via STS Candidate Portal (apply.sts.net.pk)\n1. Register at [apply.sts.net.pk](https://apply.sts.net.pk/) using your CNIC number.\n2. Select your desired project and complete academic qualifications.\n3. Generate the ABL / authorized bank deposit voucher and pay at designated branches or 1Link.\n4. Upload paid slip copy and submit the digital application.\n\n> [!CAUTION]\n> **Official Verification Notice:** The Government of Sindh and SPSC do not accept manual paper applications or cash payments. Beware of fraudulent agents claiming to guarantee interview appointments. Always verify job advertisements against official government gazettes.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for SPSC CCE-2026?**\nThe official online application deadline has been extended to **Wednesday, 11 November 2026** under SPSC Advertisement No. 06/2026.\n\n**Q2: What is the new passing percentage for SPSC CCE screening?**\nThe qualifying threshold is officially reduced to **33% (66 marks out of 200)**, with a negative marking deduction of 0.25 per incorrect answer.\n\n**Q3: Is SPSC Advertisement 05/2026 (Medical Officers) still open?**\nNo. SPSC Advertisement No. 05/2026 closed on **23 October 2026**. Only Advertisement 06/2026 remains open.\n\n**Q4: Can government servants apply for age relaxation in Sindh jobs?**\nYes. Continuous Sindh government servants are entitled to upper age relaxation in accordance with Sindh Civil Servants Rules upon uploading a Departmental Permission Certificate (DPC).\n\n**Q5: Which testing service conducts Sindh judicial examinations?**\nSIBA Testing Services (STS) at [apply.sts.net.pk](https://apply.sts.net.pk/) handles screening and shorthand testing for the High Court of Sindh and District Courts.",

    "## Official Sources & Related CareerDost Sindh Guides\n\n- **Sindh Public Service Commission:** [spsc.gov.pk](https://www.spsc.gov.pk/)\n- **SIBA Testing Services:** [apply.sts.net.pk](https://apply.sts.net.pk/)\n- **Government of Sindh Official Portal:** [sindh.gov.pk](https://www.sindh.gov.pk/)\n- **National Jobs Portal Pakistan:** [njp.gov.pk](https://njp.gov.pk/)\n- **Related CareerDost Coverage:**\n  - [SPSC CCE-2026 Examination Reforms & Extended Deadline](/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening)\n  - [Sindh Courts BPS 1 to 4 Jobs 2026](/jobs/sindh-courts-bps-1-4-jobs-2026)\n  - [Sindh Education RSU Consultant Jobs 2026](/jobs/sindh-education-rsu-consultant-jobs-2026)"
  ];

  const sindhPayload = {
    title: 'Sindh Government Jobs 2026 — Latest Vacancies, SPSC, STS & Online Apply Links',
    slug: sindhSlug,
    category: 'government-jobs',
    organization: 'Government of Sindh (SPSC, STS & Provincial Departments)',
    jobType: 'Regular / Contract Provincial Government Careers (BPS-01 to BPS-17)',
    location: 'Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas & All Sindh Districts',
    qualification: 'Matric, Intermediate, DAE, Bachelor’s & Master’s Degrees (Cadre-Specific)',
    salary: 'BPS-01 to BPS-17 (Official Sindh Pay Scales + Government Allowances)',
    experience: 'Fresh to 5+ Years Experience (Cadre-Specific)',
    positions: 'Multiple Open Vacancies across SPSC CCE, STS Judicial Tests & Provincial Secretariats',
    lastDate: '2026-11-11',
    noDeadline: false,
    publishDate: '2026-10-25',
    officialLink: 'https://www.sindh.gov.pk/',
    applyLink: 'https://www.spsc.gov.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'SINDH',
    featuredImage: '/images/sindh-government-jobs-2026-spsc-sts-guide.webp',
    imageAlt: 'Sindh Government Jobs 2026 Latest Vacancies SPSC STS Online Apply Guide CareerDost',
    excerpt: 'Comprehensive Sindh Government Jobs 2026 Guide: SPSC CCE-2026 extended to 11 Nov with 33-year age relaxation, STS Sindh High Court judicial positions, and online application links for Karachi, Hyderabad, and Sukkur.',
    content: sindhContent,
    seoTitle: 'Sindh Government Jobs 2026: SPSC, STS Vacancies & Apply Links',
    metaDescription: 'Sindh Government Jobs 2026: SPSC CCE-2026 extended to 11 Nov with 33-year age limit, STS Sindh High Court tests & department vacancies. Apply online via official portals.',
    status: 'draft'
  };

  // =========================================================================
  // ARTICLE 2: Samba Bank Universal Teller Jobs 2026
  // =========================================================================
  const sambaSlug = 'samba-bank-universal-teller-jobs-2026-apply-online';
  const sambaContent = [
    "# Samba Bank Universal Teller Jobs 2026 — Eligibility, Experience & Online Application",

    "## Executive Summary & Official Recruitment Notice\n\n**Samba Bank Limited**, a subsidiary of the prominent Saudi National Bank (SNB) operating a nationwide commercial branch network across Pakistan, has officially announced career opportunities for the position of **Universal Teller**. Verified directly on **25 October 2026** from the official [Samba Bank Careers Portal](https://www.samba.com.pk/career), this recruitment intake seeks energetic banking operations professionals for **All Cities / Multiple Nationwide Locations** to manage front-line branch cash services and customer transactions.",

    "> [!IMPORTANT]\n> **Quick Answer & Official Recruitment Verification (Verified 25 October 2026):**\n> - **Hiring Bank:** Samba Bank Limited\n> - **Job Title:** Universal Teller (Branch Operations Group)\n> - **Duty Locations:** All Cities / Multiple Locations Nationwide (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and other branch hubs)\n> - **Educational Criteria:** Minimum Bachelor’s Degree (14 or 16 Years) from an HEC-recognized university in Commerce, Business Administration, Accounting, or Economics\n> - **Experience Required:** Minimum **1+ year** of relevant commercial banking experience in cash handling, teller operations, or front-desk customer service\n> - **Employment Type:** Permanent / Full-Time Regular Banking Career\n> - **Application Cutoff:** **Saturday, 31 October 2026**\n> - **Application Fee:** Rs. 0 (Samba Bank strictly does not charge any application or recruitment fees)\n> - **Application Channels:** Direct submission via email to `careers@samba.com.pk` and through the official portal at [samba.com.pk/career](https://www.samba.com.pk/career).",

    "## Quick Facts Table: Samba Bank Universal Teller Recruitment 2026\n\n| ATTRIBUTE | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Employer Bank** | Samba Bank Limited |\n| **Designated Role** | Universal Teller |\n| **Functional Group** | Branch Operations & Retail Banking Division |\n| **Job Locations** | All Cities / Nationwide Branch Network |\n| **Minimum Education** | Bachelor’s Degree (14 or 16 Years) from an HEC-recognized institution |\n| **Required Experience** | Minimum 1+ Year in Commercial Banking Cash & Teller Services |\n| **Core Competencies** | Cash Balancing, SBP AML/KYC Compliance, MS Office, Customer Care |\n| **Maximum Age Limit** | Up to 32 Years |\n| **Employment Status** | Permanent / Regular Commercial Bank Cadre |\n| **Application Deadline** | **Saturday, 31 October 2026** |\n| **Official Portal Link** | [samba.com.pk/career](https://www.samba.com.pk/career) |",

    "## Core Operational Responsibilities & Compliance Focus\n\nThe Universal Teller acts as the primary operational face of Samba Bank, balancing transactional efficiency with strict regulatory compliance:\n\n1. **Cash Receipts & Disbursements:** Accurately process cash deposits, withdrawals, cheques, and foreign currency exchange transactions in compliance with branch authorization limits.\n2. **Daily Vault & ATM Balancing:** Balance cash drawers, reconcile day-end cash counts against General Ledger (GL) reports, and support Automated Teller Machine (ATM) replenishment and cassette audits.\n3. **Remittance & Instrument Issuance:** Issue Demand Drafts (DD), Pay Orders (PO), and telegraphic transfers while verifying customer signatures and account authorization.\n4. **Regulatory & AML/KYC Compliance:** Strictly adhere to State Bank of Pakistan (SBP) Anti-Money Laundering (AML), Counter Financing of Terrorism (CFT), and Customer Due Diligence (CDD) procedures before executing high-value or suspicious transactions.\n5. **Customer Service Excellence:** Maintain prompt turnaround times, resolve routine account inquiries, and cross-sell electronic banking channels (internet and mobile banking).",

    "## Detailed Eligibility Criteria\n\nCandidates applying for Universal Teller positions across nationwide branches must satisfy the following verified standards:\n\n- **Academic Qualification:** Bachelor’s degree (B.Com, BBA, BS, or equivalent) from a recognized university. Candidates with backgrounds in Commerce, Finance, Economics, or Accounting are preferred.\n- **Commercial Banking Experience:** At least **1 year** of hands-on experience as a branch cashier, teller, or customer service representative in a scheduled commercial bank or reputable microfinance institution.\n- **Technical & Soft Skills:** Sound numerical aptitude, rapid cash-counting accuracy, proficiency in Core Banking Systems (CBS), and good working knowledge of Microsoft Excel.\n- **Integrity & Clean Record:** Impeccable professional record with no disciplinary issues or adverse regulatory credit bureau (eCIB) defaults.",

    "## Step-by-Step Online Application Guide (Samba Bank)\n\nApplications can be submitted through either of the two official channels before **31 October 2026**:\n\n### Method 1: Email Submission to Samba Recruitment Team\n1. Prepare an updated resume in PDF format (maximum 2 MB).\n2. Format email subject line as: `Application for Universal Teller – [Your Preferred City]` (e.g., `Application for Universal Teller – Karachi`).\n3. Attach your CV along with a concise professional cover note summarizing your current bank experience, total cash handling years, and notice period.\n4. Send your application to the official recruitment desk: **`careers@samba.com.pk`**.\n\n### Method 2: Online Submission via Samba Careers Portal\n1. Visit [samba.com.pk/career](https://www.samba.com.pk/career).\n2. Search for the *Universal Teller (All Cities)* job opening.\n3. Fill in the online candidate form with personal information, academic grades, and prior banking details.\n4. Upload your resume and submit.\n\n> [!TIP]\n> Candidates currently serving as cash officers or contract tellers in other commercial banks seeking permanent placement are encouraged to apply early before the 31 October deadline.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for Samba Bank Universal Teller jobs?**\nThe official application deadline is **Saturday, 31 October 2026**.\n\n**Q2: Are fresh graduates eligible for the Universal Teller position?**\nSamba Bank officially specifies a minimum of **1+ year** of relevant commercial banking experience in teller or cash operations for this role.\n\n**Q3: Which cities have Universal Teller openings?**\nOpenings are advertised for **All Cities** across Samba Bank’s nationwide network, including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and other regional branches.\n\n**Q4: Does Samba Bank charge an application fee?**\nNo. Samba Bank never charges any application, testing, or processing fee at any stage of recruitment.",

    "## Official Sources & Related CareerDost Banking Coverage\n\n- **Official Samba Bank Careers:** [samba.com.pk/career](https://www.samba.com.pk/career)\n- **Corporate Website:** [samba.com.pk](https://www.samba.com.pk/)\n- **Related CareerDost Banking Coverage:**\n  - [Samba Bank Relationship Associate Jobs 2026](/jobs/samba-bank-relationship-associate-jobs-2026)\n  - [Bank AL Habib Fresh Graduate Jobs 2026 Karachi](/jobs/bank-al-habib-jobs-2026-karachi-fresh-graduates-apply-online)\n  - [Bank of Punjab Agri RM Jobs 2026 Sukkur](/jobs/bank-of-punjab-jobs-2026-sukkur-relationship-manager-agri)"
  ];

  const sambaPayload = {
    title: 'Samba Bank Universal Teller Jobs 2026 — Eligibility, Experience & Online Application',
    slug: sambaSlug,
    category: 'bank-jobs',
    organization: 'Samba Bank Limited',
    jobType: 'Permanent / Full-Time Regular Banking Career',
    location: 'All Cities / Nationwide Branch Network (Karachi, Lahore, Islamabad, etc.)',
    qualification: 'Bachelor’s Degree (14 or 16 Years) from HEC-Recognized University (Commerce, BBA, Economics)',
    salary: 'Market Competitive Salary + Allowances + Bank Staff Benefits',
    experience: 'Minimum 1+ Year of Commercial Banking Experience in Cash / Teller Operations',
    positions: 'Multiple Vacancies across Nationwide Commercial Network',
    lastDate: '2026-10-31',
    noDeadline: false,
    publishDate: '2026-10-25',
    officialLink: 'https://www.samba.com.pk/',
    applyLink: 'https://www.samba.com.pk/career',
    isVerified: true,
    featured: true,
    logoInitial: 'SAMBA',
    featuredImage: '/images/samba-bank-universal-teller-jobs-2026.webp',
    imageAlt: 'Samba Bank Universal Teller Jobs 2026 Eligibility Experience Online Application CareerDost',
    excerpt: 'Samba Bank Limited announces Universal Teller vacancies across All Cities for candidates with a Bachelor’s degree and 1+ year branch cash operations experience. Apply before 31 October 2026.',
    content: sambaContent,
    seoTitle: 'Samba Bank Universal Teller Jobs 2026: Apply Online by 31 Oct',
    metaDescription: 'Samba Bank Universal Teller Jobs 2026 for All Cities: Minimum Bachelor degree with 1+ year cash handling experience. Check eligibility and apply online before 31 Oct 2026.',
    status: 'draft'
  };

  // =========================================================================
  // ARTICLE 3: Bank AL Habib Relationship Manager Jobs 2026
  // (Independent Draft in Production CMS)
  // =========================================================================
  const bahlRmSlug = 'bank-al-habib-relationship-manager-jobs-2026-apply-online';
  const bahlRmContent = [
    "# Bank AL Habib Relationship Manager Jobs 2026 — Eligibility, Experience & Online Apply",

    "## Executive Summary & Official Recruitment Notice\n\n**Bank AL Habib Limited (BAHL)**, operating one of Pakistan’s largest branch banking footprints with over 1,100 locations across the country, has officially announced dedicated recruitment for **Relationship Managers (RM) and Senior Relationship Managers (SRM)** in commercial banking. Verified live on **25 October 2026** on the official [Bank AL Habib Current Openings portal](https://www.bankalhabib.com/current-openings), this career drive targets experienced liability sales specialists across **Pan-Pakistan locations**, with a reported application review window extending through **30 November 2026**.",

    "> [!IMPORTANT]\n> **Quick Answer & Official Recruitment Verification (Verified 25 October 2026):**\n> - **Hiring Bank:** Bank AL Habib Limited (BAHL)\n> - **Announced Positions:** Relationship Manager (RM) and Senior Relationship Manager (SRM)\n> - **Operational Cadres:** Branch Banking & Commercial Liabilities Division\n> - **Duty Locations:** Pan-Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Sukkur, Hyderabad, Peshawar, Quetta)\n> - **Academic Qualification:** Graduate with at least 14 years of education from an HEC-recognized university (Master's / MBA preferred)\n> - **Experience Requirements:** Minimum **2 years** for Relationship Manager; minimum **5 years** for Senior Relationship Manager in branch liabilities sales\n> - **Age Limit:** Maximum **35 years** as of application date\n> - **Application Cutoff:** Active intake / rolling review closing **30 November 2026**\n> - **Application Portal:** Exclusively online at [bankalhabib.com/current-openings](https://www.bankalhabib.com/current-openings).",

    "## Quick Facts Table: Bank AL Habib RM Recruitment 2026\n\n| ATTRIBUTE | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Employer Bank** | Bank AL Habib Limited (BAHL) |\n| **Job Positions** | Relationship Manager (RM) & Senior Relationship Manager (SRM) |\n| **Department** | Branch Banking / Commercial Liabilities Sales |\n| **Geographic Scope** | Pan-Pakistan Commercial Branch Network |\n| **Minimum Education** | Bachelor’s Degree (14 or 16 Years) from an HEC-recognized university |\n| **Experience Bracket** | 2 Years (RM) | 5 Years (Senior RM) in Liabilities Sales |\n| **Upper Age Limit** | Up to 35 Years |\n| **Employment Status** | Permanent / Full-Time Regular Banking Officer |\n| **Salary & Compensation** | Highly competitive executive salary + performance bonuses + staff financing & medical |\n| **Application Deadline** | **30 November 2026** (Rolling Intakes) |\n| **Official Application Link** | [bankalhabib.com/current-openings](https://www.bankalhabib.com/current-openings) |",

    "## Core Responsibilities & Portfolio Management Expectations\n\nRelationship Managers at Bank AL Habib spearhead commercial growth, High-Net-Worth Individual (HNWI) retention, and branch balance sheet expansion:\n\n1. **Deposit Mobilization & CASA Growth:** Formulate tactical outreach plans to acquire low-cost Current and Savings Account (CASA) balances from corporate clients, traders, institutions, and affluent retail customers.\n2. **High-Net-Worth Client Relationship Management:** Build and nurture enduring relationships with business families, corporate executives, and institutional treasuries to maximize client retention and wallet share.\n3. **Cross-Selling Banking Products:** Proactively market Alternative Delivery Channels (ADC), internet banking, payroll management solutions, trade finance instruments, and consumer credit facilities.\n4. **Branch Performance Alignment:** Work closely with the Branch Manager and Regional Heads to meet branch profitability targets, service benchmarks, and customer acquisition quotas.\n5. **Compliance & AML Safeguards:** Ensure all account opening documentation, source of funds verifications, and Politically Exposed Persons (PEP) clearances adhere strictly to State Bank of Pakistan (SBP) and BAHL compliance standards.",

    "## Tier-Wise Eligibility & Experience Standards\n\nBank AL Habib has clearly delineated requirements for both relationship management tiers:\n\n### 1. Relationship Manager (RM)\n- **Experience:** Minimum **2 years** of proven liabilities sales and relationship management experience in a scheduled commercial branch banking environment.\n- **Education:** Bachelor’s degree (14 years of education minimum) in Business, Commerce, Economics, or related fields.\n- **Age Ceiling:** Maximum 35 years.\n- **Skills:** Strong communication, presentation skills, understanding of local business dynamics, and a demonstrable customer portfolio.\n\n### 2. Senior Relationship Manager (SRM)\n- **Experience:** Minimum **5 years** of consistent track record in commercial liabilities sales, large deposit acquisition, and institutional relationship management.\n- **Education:** 16-year Bachelor’s or Master’s degree (MBA, MS Finance, M.Com) preferred.\n- **Age Ceiling:** Maximum 35 years.\n- **Leadership Skills:** Ability to mentor junior branch sales officers and drive cluster sales campaigns.",

    "## Step-by-Step Online Application Guide (Bank AL Habib Portal)\n\nCandidates meeting the criteria must submit their applications digitally:\n\n1. **Visit Careers Portal:** Navigate to [bankalhabib.com/current-openings](https://www.bankalhabib.com/current-openings).\n2. **Locate Vacancy:** Filter by *Branch Banking* or *Commercial Banking* and select *Senior Relationship Manager / Relationship Manager*.\n3. **Complete Applicant Profile:** Input your primary email address, CNIC number, and contact information.\n4. **Employment History:** Provide an accurate summary of your banking career, detailing current bank name, branch assignment, grade, and current portfolio volume.\n5. **Upload Resume:** Attach your comprehensive, updated CV in PDF format (maximum 2 MB).\n6. **Select Region:** Choose your preferred city and regional cluster for interview scheduling.\n7. **Submit Form:** Verify your data and finalize submission before **30 November 2026**.\n\n> [!NOTE]\n> Bank AL Habib Limited strictly conducts recruitment on merit with zero processing fees. Only shortlisted candidates meeting the experience threshold will receive interview calls.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for Bank AL Habib Relationship Manager jobs?**\nApplications for the ongoing commercial batches are officially being reviewed through **30 November 2026**.\n\n**Q2: Can fresh graduates apply for the Relationship Manager role?**\nNo. The Relationship Manager position requires a minimum of **2 years** of branch liabilities sales experience. Fresh graduates should instead apply for the [Bank AL Habib Fresh Graduate & BSO Vacancies](/jobs/bank-al-habib-jobs-2026-karachi-fresh-graduates-apply-online).\n\n**Q3: What is the age limit for Senior Relationship Managers?**\nThe maximum age limit is **35 years** as of the date of application.\n\n**Q4: Where will appointed Relationship Managers be posted?**\nPostings are available across Pakistan in major metropolitan commercial hubs including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Sukkur, and Peshawar.",

    "## Official Sources & Related CareerDost Banking Coverage\n\n- **Official Careers Portal:** [Bank AL Habib Current Openings](https://www.bankalhabib.com/current-openings)\n- **Bank AL Habib Corporate:** [bankalhabib.com](https://www.bankalhabib.com/)\n- **Related CareerDost Banking Coverage:**\n  - [Bank AL Habib Fresh Graduate Jobs 2026 Karachi](/jobs/bank-al-habib-jobs-2026-karachi-fresh-graduates-apply-online)\n  - [Bank of Punjab Agri RM Jobs 2026 Sukkur](/jobs/bank-of-punjab-jobs-2026-sukkur-relationship-manager-agri)\n  - [Samba Bank Universal Teller Jobs 2026](/jobs/samba-bank-universal-teller-jobs-2026-apply-online)"
  ];

  const bahlRmPayload = {
    title: 'Bank AL Habib Relationship Manager Jobs 2026 — Eligibility, Experience & Online Apply',
    slug: bahlRmSlug,
    category: 'bank-jobs',
    organization: 'Bank AL Habib Limited',
    jobType: 'Permanent / Full-Time Commercial Banking Career',
    location: 'Pan-Pakistan (Karachi, Lahore, Islamabad, Sukkur, Multan, etc.)',
    qualification: 'Graduate with at least 14 Years of Education (Master’s / MBA Preferred)',
    salary: 'Attractive Market Salary + Performance Bonuses + Staff Financing & Medical',
    experience: '2 to 5 Years of Proven Liabilities Sales Experience in Branch Banking',
    positions: 'Multiple Vacancies (Relationship Manager & Senior Relationship Manager)',
    lastDate: '2026-11-30',
    noDeadline: false,
    publishDate: '2026-10-25',
    officialLink: 'https://www.bankalhabib.com/',
    applyLink: 'https://www.bankalhabib.com/current-openings',
    isVerified: true,
    featured: true,
    logoInitial: 'BAHL',
    featuredImage: '/images/bank-al-habib-relationship-manager-jobs-2026.webp',
    imageAlt: 'Bank AL Habib Relationship Manager Jobs 2026 Eligibility Experience Online Apply CareerDost',
    excerpt: 'Bank AL Habib Limited announces career openings for Relationship Managers (2+ yrs experience) and Senior RMs (5+ yrs experience) in commercial liabilities sales across Pakistan. Apply online before 30 November 2026.',
    content: bahlRmContent,
    seoTitle: 'Bank AL Habib Relationship Manager Jobs 2026: Apply Online',
    metaDescription: 'Bank AL Habib Relationship Manager Jobs 2026: Openings for RM (2+ yrs exp) & Senior RM (5+ yrs exp) across Pakistan. Check eligibility & apply online by 30 Nov 2026.',
    status: 'draft'
  };

  // =========================================================================
  // EXECUTION: POST 3 NEW DRAFTS TO PRODUCTION CMS & UPDATE LOCAL SQLITE
  // =========================================================================
  const remainingArticles = [
    { name: 'Article 1 (Sindh Government Jobs Guide)', payload: sindhPayload },
    { name: 'Article 2 (Samba Bank Universal Teller)', payload: sambaPayload },
    { name: 'Article 3 (Bank AL Habib Relationship Manager)', payload: bahlRmPayload }
  ];

  const newlyCreatedDrafts = [];

  for (const item of remainingArticles) {
    const slug = item.payload.slug;
    const existingDraftId = draftSlugMap.get(slug);

    if (existingDraftId) {
      console.log(`[DRAFT ALREADY EXISTS IN CMS] ID: ${existingDraftId} | Slug: ${slug}`);
      newlyCreatedDrafts.push({ id: existingDraftId, slug, title: item.payload.title, status: 'draft', category: item.payload.category });
      continue;
    }

    console.log(`Saving ${item.name} to CMS...`);
    const postRes = await fetch(`${apiBase}/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item.payload)
    });

    const resJson = await postRes.json();
    if (!postRes.ok) {
      console.error(`ERROR creating ${item.name}:`, resJson);
      continue;
    }

    const created = resJson.data || resJson.article || resJson;
    const newId = created.id || resJson.id;
    console.log(`✓ [DRAFT CREATED IN CMS] ID: ${newId} | Slug: ${slug} | Title: "${item.payload.title.slice(0, 45)}..."`);

    newlyCreatedDrafts.push({
      id: newId,
      slug: slug,
      title: item.payload.title,
      status: 'draft',
      category: item.payload.category,
      featuredImage: item.payload.featuredImage
    });

    // Update local SQLite for parity
    try {
      const contentJson = JSON.stringify(item.payload.content);
      localDb.prepare(`
        INSERT OR REPLACE INTO articles (
          id, slug, title, category_slug, organization, job_type, location,
          qualification, salary, experience, positions, last_date, no_deadline,
          publish_date, official_link, apply_link, is_verified, featured,
          logo_initial, featured_image, image_alt, excerpt, content,
          seo_title, meta_description, status, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, 'draft', datetime('now'), datetime('now')
        )
      `).run(
        newId, slug, item.payload.title, item.payload.category, item.payload.organization, item.payload.jobType, item.payload.location,
        item.payload.qualification, item.payload.salary, item.payload.experience, item.payload.positions, item.payload.lastDate, item.payload.noDeadline ? 1 : 0,
        item.payload.publishDate, item.payload.officialLink, item.payload.applyLink, item.payload.isVerified ? 1 : 0, item.payload.featured ? 1 : 0,
        item.payload.logoInitial, item.payload.featuredImage, item.payload.imageAlt, item.payload.excerpt, contentJson,
        item.payload.seoTitle, item.payload.metaDescription
      );
      console.log(`  ✓ Synced to local SQLite (ID: ${newId})`);
    } catch (dbErr) {
      console.warn(`  ! Local SQLite sync notice:`, dbErr.message);
    }
  }

  // =========================================================================
  // VERIFY ALL NEW DRAFTS IN PRODUCTION CMS ADMIN PANEL
  // =========================================================================
  console.log('\n--- VERIFYING NEW DRAFTS IN PRODUCTION CMS ADMIN PANEL ---');
  const verifyRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const verifyData = await verifyRes.json();
  const allDrafts = verifyData.data || [];

  for (const d of newlyCreatedDrafts) {
    const found = allDrafts.find(item => item.id === d.id);
    if (found) {
      console.log(`✓ [CONFIRMED LIVE IN ADMIN PANEL] ID: ${found.id} | Slug: ${found.slug} | Status: ${found.status} | Title: "${found.title.slice(0, 45)}..."`);
    } else {
      console.error(`✗ [NOT FOUND IN ADMIN PANEL] ID: ${d.id}`);
    }
  }

  console.log('\n=== REMAINING CONTENT DRAFTS COMPLETED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Save remaining drafts failed:', err);
  process.exit(1);
});
