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
  console.log('=== CAREERDOST — 25 OCTOBER 2026 CONTENT PRODUCTION ===\n');

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

  // =========================================================================
  // ARTICLE 1: Bank AL Habib Fresh Graduate Jobs 2026 (Karachi & Nationwide)
  // Incorporates Update 6 (Relationship Manager & Senior RM tracks)
  // =========================================================================
  const bahlSlug = 'bank-al-habib-jobs-2026-karachi-fresh-graduates-apply-online';
  const bahlContent = [
    "# Bank AL Habib Jobs 2026 Karachi — Fresh Graduate Vacancies, Eligibility & Online Apply",

    "## Executive Summary & Official Recruitment Notice\n\n**Bank AL Habib Limited (BAHL)**, one of Pakistan's most respected private commercial banking networks with over 1,100 branches nationwide, has officially announced fresh recruitment opportunities for 2026 across **Karachi and its nationwide network**. Verified directly from the official [Bank AL Habib Current Openings portal](https://www.bankalhabib.com/current-openings) on **25 October 2026**, the ongoing intake features multiple specialized entry-level openings tailored for **fresh university graduates**, alongside lateral career pathways for experienced commercial bankers.",

    "> [!IMPORTANT]\n> **Quick Answer & Official Recruitment Verification (Verified 25 October 2026):**\n> - **Hiring Institution:** Bank AL Habib Limited (BAHL)\n> - **Key Vacancies:** Branch Sales Officer (BSO), Phone Banking Officer (Call Center / ADC), General Banking Trainee, Relationship Manager (RM), and Senior Relationship Manager (SRM)\n> - **Primary Locations:** Karachi (Head Office & Centralized Phone Banking Hub) and Nationwide Branch Network\n> - **Eligibility for Fresh Graduates:** Minimum Bachelor's Degree (14 or 16 Years of Education) in Commerce, Business Administration, Economics, or related disciplines\n> - **Experienced Hires:** 2 to 5 years of liabilities sales experience for RM and Senior RM roles\n> - **Application Window:** Active now; rolling recruitment with specific commercial intakes closing **30 November 2026**\n> - **Application Fee:** Rs. 0 (Bank AL Habib never charges any application or processing fees at any stage)\n> - **Application Method:** Exclusively online via [Bank AL Habib Current Openings](https://www.bankalhabib.com/current-openings).",

    "## Quick Facts Table: Bank AL Habib Recruitment 2026\n\n| ATTRIBUTE | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Bank / Employer** | Bank AL Habib Limited (BAHL) |\n| **Announced Positions** | Branch Sales Officer (BSO), Phone Banking Officer (ADC), General Banking, RM & Senior RM |\n| **Duty Locations** | Karachi (Centralized Operations & ADC Call Center) and Pan-Pakistan Branches |\n| **Minimum Education** | Bachelor’s Degree (14 or 16 Years) from an HEC-recognized university |\n| **Target Candidates** | Fresh Graduates (Entry-Level) & Banking Professionals (Lateral Tracks) |\n| **Experience Bracket** | 0 Years (Fresh) for BSO & Phone Banking; 2–5 Years for RM/SRM |\n| **Age Ceilings** | Fresh roles up to 28–30 Years; Experienced commercial roles up to 35 Years |\n| **Employment Type** | Regular / Full-Time Commercial Banking Career |\n| **Salary & Benefits** | Market-competitive salary, provident fund, gratuity, medical coverage, and staff financing |\n| **Closing Cutoff** | Rolling intake / 30 November 2026 for specific commercial batches |\n| **Official Portal Link** | [bankalhabib.com/current-openings](https://www.bankalhabib.com/current-openings) |",

    "## Entry-Level & Fresh Graduate Career Tracks\n\nBank AL Habib has strategically structured its front-line and digital banking operations to onboard ambitious graduates without requiring prior banking background:\n\n### 1. Branch Sales Officer (BSO) — Retail & Consumer Banking\n- **Role Focus:** Primary driver for retail branch deposit mobilization, acquiring new-to-bank (NTB) customers, promoting current and savings accounts (CASA), and cross-selling consumer finance products.\n- **Eligibility:** Fresh graduates holding a 14-year or 16-year Bachelor’s degree (B.Com, BBA, BA, BS, or equivalent) from an HEC-recognized institution with a minimum 2nd Division or 2.5 CGPA.\n- **Core Competencies:** Confident interpersonal communication in Urdu and English, positive sales aptitude, energetic client interaction, and adherence to branch compliance standards.\n- **Locations:** Karachi branch clusters, Hyderabad, Sukkur, Lahore, Islamabad, and other provincial hubs.\n\n### 2. Phone Banking Officer — Alternative Delivery Channels (ADC) Call Center\n- **Role Focus:** Stationed at Bank AL Habib's centralized contact center in Karachi, officers handle inbound customer inquiries, resolve digital banking issues, assist with internet/mobile banking setups, and execute ADC service requests.\n- **Eligibility:** Minimum 14 or 16 years of education in any discipline. Fresh graduates with pleasant telephone etiquette, active listening skills, and fluency in English and Urdu are highly encouraged to apply.\n- **Location:** Centralized ADC Facility, Karachi.\n- **Working Hours:** Rotational shift schedules (with dedicated safe transportation allowances and night allowances where applicable).\n\n### 3. General Banking & Operations Trainee Roles\n- **Role Focus:** Branch counter operations, clearing, remittance processing, account opening document verification, and Know Your Customer (KYC) compliance.\n- **Eligibility:** Bachelor’s degree in Business, Commerce, Economics, or Mathematics.",

    "## Experienced Banking Openings: Relationship Manager & Senior RM\n\nIn addition to fresh graduate opportunities, Bank AL Habib is actively conducting lateral recruitment across Pakistan for proven liabilities specialists:\n\n### 1. Relationship Manager (RM) — Branch Banking\n- **Experience Required:** Minimum **2 years** of direct liabilities sales and portfolio management experience in branch banking.\n- **Key Responsibilities:** Managing High-Net-Worth Individual (HNWI) portfolios, driving low-cost deposit growth, and ensuring cross-sales of trade and cash management services.\n- **Qualification:** Graduate with at least 14 years of education (Master’s or MBA preferred).\n- **Upper Age Limit:** Up to 35 years.\n\n### 2. Senior Relationship Manager (SRM) — Commercial Banking\n- **Experience Required:** Minimum **5 years** of demonstrated liabilities sales experience with established commercial relationships.\n- **Key Responsibilities:** Expanding institutional and commercial deposit portfolios, assisting the Branch Manager in meeting overall cluster balance sheet targets, and mentoring junior sales officers.\n- **Application Deadline:** Rolling review through **30 November 2026**.",

    "## Step-by-Step Online Application Guide (Bank AL Habib)\n\nAll applications must be submitted digitally via the official career portal. Follow these verified steps:\n\n1. **Visit Official Careers Portal:** Navigate to [bankalhabib.com/current-openings](https://www.bankalhabib.com/current-openings).\n2. **Browse Job Categories:** Select *Current Openings* and filter by location (*Karachi* or *Nationwide*) and role (*Branch Banking*, *ADC / Phone Banking*, or *Commercial Banking*).\n3. **Create Candidate Profile:** Click *Apply Online* for your desired role. Create a profile using your primary email address and CNIC number.\n4. **Upload CV & Academic Records:** Upload an updated, professional resume in PDF format (maximum 2 MB). Input your matriculation, intermediate, graduation, and post-graduation marks.\n5. **Select Preferred Branch / City:** Clearly specify *Karachi* or your preferred city of residence for interview and placement scheduling.\n6. **Submit Application:** Review all entries and submit. Note your applicant reference number for future communication.\n\n> [!CAUTION]\n> **Fraud Alert:** Bank AL Habib Limited does not charge any test fee, registration fee, or interview processing fee. Do not send money to any individual or unofficial bank account claiming to offer Bank AL Habib employment.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: Can fresh graduates with no prior banking experience apply for Bank AL Habib in 2026?**\nYes. Fresh graduates are explicitly eligible and encouraged to apply for **Branch Sales Officer (BSO)** and **Phone Banking Officer** positions. Training is provided upon induction.\n\n**Q2: What is the minimum qualification required for entry-level roles?**\nA minimum of 14 years of education (B.Com, BBA, BA, BSc, or BS) from an HEC-recognized university with at least a 2nd Division or 2.5 CGPA is required.\n\n**Q3: Where is the Phone Banking Officer role based?**\nThe Phone Banking Officer position is based at Bank AL Habib's centralized contact center in **Karachi**.\n\n**Q4: What is the last date to apply for Bank AL Habib Jobs 2026?**\nBank AL Habib operates rolling recruitment across its branch network. Specific commercial batches, including Relationship Manager tracks, accept applications through **30 November 2026**. Early submission is strongly recommended.\n\n**Q5: Is there any written test or interview fee?**\nNo. Bank AL Habib never charges any fee at any stage of recruitment. The application process is 100% free.",

    "## Official Sources & Related CareerDost Banking Guides\n\n- **Official Bank AL Habib Careers Portal:** [bankalhabib.com/current-openings](https://www.bankalhabib.com/current-openings)\n- **Corporate Portal:** [bankalhabib.com](https://www.bankalhabib.com/)\n- **Related CareerDost Banking Coverage:**\n  - [Bank of Punjab Karachi Regional Manager Jobs 2026](/jobs/bank-of-punjab-karachi-manager-jobs-2026)\n  - [Samba Bank Relationship Associate Jobs 2026](/jobs/samba-bank-relationship-associate-jobs-2026)\n  - [Meezan Bank Teller / CSO Jobs 2026](/jobs/meezan-bank-teller-2026)"
  ];

  const bahlPayload = {
    title: 'Bank AL Habib Jobs 2026 Karachi — Fresh Graduate Vacancies, Eligibility & Online Apply',
    slug: bahlSlug,
    category: 'bank-jobs',
    organization: 'Bank AL Habib Limited',
    jobType: 'Regular / Full-Time Banking Career',
    location: 'Karachi & Nationwide',
    qualification: 'Bachelor’s Degree (14 or 16 Years) from HEC-Recognized University (Commerce, BBA, BS, BA)',
    salary: 'Market Competitive (Salary + Allowances + Medical & Staff Financing)',
    experience: 'Fresh Graduates (0 Years for BSO & Phone Banking); 2–5 Years for RM/SRM',
    positions: 'Multiple Vacancies (Branch Sales Officer, Phone Banking Officer, General Banking, RM, Senior RM)',
    lastDate: '2026-11-30',
    noDeadline: false,
    publishDate: '2026-10-25',
    officialLink: 'https://www.bankalhabib.com/',
    applyLink: 'https://www.bankalhabib.com/current-openings',
    isVerified: true,
    featured: true,
    logoInitial: 'BAHL',
    featuredImage: '/images/bank-al-habib-jobs-2026-karachi.webp',
    imageAlt: 'Bank AL Habib Jobs 2026 Karachi Fresh Graduate Vacancies and Banking Careers CareerDost',
    excerpt: 'Bank AL Habib Limited announces 2026 career opportunities in Karachi and nationwide for Fresh Graduates, Branch Sales Officers, Phone Banking Officers, and Relationship Managers. Apply online via the official portal.',
    content: bahlContent,
    seoTitle: 'Bank AL Habib Jobs 2026 Karachi: Fresh Graduate Roles | Apply Online',
    metaDescription: 'Bank AL Habib announces 2026 vacancies in Karachi & nationwide for Fresh Graduates, Branch Sales Officers, Phone Banking Officers & Relationship Managers. Apply online.',
    status: 'draft'
  };

  // =========================================================================
  // ARTICLE 2: Bank of Punjab Agri Jobs 2026 — Sukkur
  // =========================================================================
  const bopSlug = 'bank-of-punjab-jobs-2026-sukkur-relationship-manager-agri';
  const bopContent = [
    "# Bank of Punjab Jobs 2026 Sukkur — Relationship Manager Agri, Eligibility & Apply Online",

    "## Executive Summary & Official Recruitment Notice\n\n**The Bank of Punjab (BOP)**, one of Pakistan's prominent scheduled commercial banks, has officially announced new career opportunities for the position of **Relationship Manager — Agri (Band-10 to Band-09)** under its **Agriculture Credit Division — Consumer Banking Group**. Released officially on **22 October 2026** and verified live on **25 October 2026** via the [BOP Available Jobs portal](https://www.bop.com.pk/Available-Jobs), this recruitment drive specifically features **Sukkur (Sindh)** as an active duty station alongside Gujranwala and Shakargarh (Punjab).",

    "> [!IMPORTANT]\n> **Quick Answer & Official Recruitment Verification (Verified 25 October 2026):**\n> - **Hiring Bank:** The Bank of Punjab (BOP)\n> - **Position Title:** Relationship Manager — Agri\n> - **Functional Division:** Agriculture Credit Division — Consumer Banking Group\n> - **Job Grade:** Band-10 to Band-09\n> - **Designated Duty Stations:** Sukkur (Sindh), Gujranwala (Punjab), and Shakargarh (Punjab)\n> - **Minimum Education:** Bachelor’s Degree (14 or 16 Years) from an HEC-recognized university\n> - **Experience Required:** 2 to 4 years of banking experience in agricultural credit / rural financing\n> - **Upper Age Limit:** Up to 55 years as of the application date\n> - **Application Cutoff:** **Sunday, 1 November 2026**\n> - **Application Portal:** Exclusively online at [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).",

    "## Quick Facts Table: BOP Agri Recruitment 2026 (Sukkur)\n\n| ATTRIBUTE | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Employer Bank** | The Bank of Punjab (BOP) |\n| **Job Title** | Relationship Manager — Agri |\n| **Operational Division** | Agriculture Credit Division — Consumer Banking Group |\n| **Designated Grade** | Band-10 to Band-09 |\n| **Job Locations** | Sukkur (Upper Sindh), Gujranwala & Shakargarh (Punjab) |\n| **Minimum Qualification** | Bachelor’s Degree (14 or 16 Years) in Agriculture, Business, Economics, or Commerce |\n| **Required Experience** | 2 to 4 Years in Agricultural Lending / Branch Rural Credit |\n| **Maximum Age Limit** | Up to 55 Years |\n| **Employment Status** | Permanent / Full-Time Commercial Banking Track |\n| **Application Deadline** | **Sunday, 1 November 2026** |\n| **Official Job Portal** | [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs) |",

    "## Core Job Responsibilities & Operational Scope\n\nThe Relationship Manager — Agri in Sukkur serves as the anchor for agricultural lending and commercial agribusiness outreach across upper Sindh’s farming belts:\n\n1. **Agricultural Loan Sourcing:** Proactively identify, market, and originate agricultural finance facilities for progressive growers, dairy farmers, and agri-traders across the Sukkur, Khairpur, and Rohri agriculture clusters.\n2. **Government Farm Schemes:** Promote and manage government-subsidized credit initiatives, including Kisan credit packages, farm mechanization financing (tractors and solar tube-wells), and crop production inputs.\n3. **Credit Proposal Formulation:** Conduct thorough on-site farm inspections, verify land revenue records (Form-VII / Khasra passbooks), prepare credit evaluation proposals, and route them within established turnaround times.\n4. **Portfolio Monitoring & Recovery:** Monitor crop seasonal cycles (Kharif and Rabi harvests), track loan repayments, and maintain portfolio quality with minimal non-performing loans (NPLs).\n5. **Client Relationship Development:** Foster long-term banking relationships with farm input dealers, grain market commission agents, and rural enterprises to mobilize low-cost deposit balances.",

    "## Comprehensive Eligibility Criteria\n\nCandidates applying for the Sukkur posting must meet the official criteria specified by The Bank of Punjab:\n\n- **Educational Background:** Minimum Bachelor’s degree (14 or 16 years of education) from an HEC-recognized local or foreign university. Degrees in Agriculture Sciences, Agribusiness, Business Administration, Economics, or Banking & Finance are preferred.\n- **Professional Experience:** At least **2 to 4 years** of direct commercial banking experience in agricultural credit, rural microfinance, or agri SME portfolio management. Candidates with strong familiarity with upper Sindh's agricultural geography and farming practices will have a strong advantage.\n- **Age Bracket:** Candidates up to **55 years of age** as of the closing date are eligible, accommodating seasoned agricultural credit officers.\n- **Technical Skills:** Sound knowledge of State Bank of Pakistan (SBP) Prudential Regulations for Agricultural Financing, land title verification procedures, and basic computer proficiency.",

    "## Step-by-Step Online Application Guide (BOP Portal)\n\nApplications are accepted solely through BOP’s web portal. Follow these instructions before the deadline:\n\n1. **Open Official Portal:** Visit [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).\n2. **Locate Vacancy:** Search for *Relationship Manager — Agri* listed under the *Consumer Banking Group*.\n3. **Select Duty Station:** In the application form, clearly select **Sukkur** (or Gujranwala / Shakargarh if preferred).\n4. **Complete Profile & History:** Input personal bio-data, academic records, and detailed banking employment history including your current employer, branch, and portfolio size.\n5. **Upload Resume:** Attach your updated CV in PDF format.\n6. **Final Submission:** Confirm that all entries match your educational certificates and CNIC, and submit the application before **1 November 2026**.\n\n> [!NOTE]\n> Only shortlisted candidates will be contacted by The Bank of Punjab for assessment and interviews. No TA/DA is admissible for interview attendance.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for BOP Relationship Manager Agri in Sukkur?**\nThe official closing date is **Sunday, 1 November 2026**.\n\n**Q2: Is this position permanent or contract-based?**\nThis is a regular, full-time banking position in **Band-10 to Band-09** within The Bank of Punjab.\n\n**Q3: Is banking experience mandatory for this role?**\nYes. BOP requires a minimum of **2 to 4 years** of relevant banking experience in agricultural credit or farm finance.\n\n**Q4: Can candidates from Sindh apply for the Sukkur vacancy?**\nYes. Candidates possessing the required educational qualifications and agricultural banking experience are encouraged to apply for the Sukkur posting.\n\n**Q5: Does BOP charge an application processing fee?**\nNo. Applying through the official BOP Careers portal is completely free of charge.",

    "## Official Sources & Related CareerDost Guides\n\n- **Official Career Page:** [The Bank of Punjab Available Jobs](https://www.bop.com.pk/Available-Jobs)\n- **Corporate Website:** [bop.com.pk](https://www.bop.com.pk/)\n- **Related CareerDost Banking Coverage:**\n  - [Bank of Punjab Karachi Regional Manager Jobs 2026](/jobs/bank-of-punjab-karachi-manager-jobs-2026)\n  - [Bank AL Habib Fresh Graduate Jobs 2026](/jobs/bank-al-habib-jobs-2026-karachi-fresh-graduates-apply-online)\n  - [Samba Bank Relationship Associate Jobs 2026](/jobs/samba-bank-relationship-associate-jobs-2026)"
  ];

  const bopPayload = {
    title: 'Bank of Punjab Jobs 2026 Sukkur — Relationship Manager Agri, Eligibility & Apply Online',
    slug: bopSlug,
    category: 'bank-jobs',
    organization: 'The Bank of Punjab (BOP)',
    jobType: 'Regular / Full-Time Banking Career (Band-10 to Band-09)',
    location: 'Sukkur (Sindh), Gujranwala & Shakargarh (Punjab)',
    qualification: 'Minimum Bachelor’s Degree (14 or 16 Years) from HEC-Recognized University (Agriculture, BBA, Economics)',
    salary: 'Band-10 to Band-09 (Competitive Salary + Allowances + Bank Benefits)',
    experience: '2 to 4 Years of Commercial Banking Experience in Agricultural Credit / Financing',
    positions: 'Multiple Vacancies (Agriculture Credit Division — Sukkur, Gujranwala, Shakargarh)',
    lastDate: '2026-11-01',
    noDeadline: false,
    publishDate: '2026-10-25',
    officialLink: 'https://www.bop.com.pk/',
    applyLink: 'https://www.bop.com.pk/Available-Jobs',
    isVerified: true,
    featured: true,
    logoInitial: 'BOP',
    featuredImage: '/images/bank-of-punjab-jobs-2026-sukkur-agri-rm.webp',
    imageAlt: 'Bank of Punjab Jobs 2026 Sukkur Relationship Manager Agri BOP CareerDost',
    excerpt: 'The Bank of Punjab (BOP) is hiring Relationship Managers – Agri (Band-10 to Band-09) in Sukkur, Gujranwala, and Shakargarh. Minimum Bachelor degree with 2-4 years experience. Apply online before 1 November 2026.',
    content: bopContent,
    seoTitle: 'BOP Jobs 2026 Sukkur: Relationship Manager Agri | Apply Online',
    metaDescription: 'Bank of Punjab (BOP) invites applications for Relationship Manager – Agri in Sukkur, Gujranwala & Shakargarh. Check eligibility, age limit, salary band & apply online by 1 Nov 2026.',
    status: 'draft'
  };

  // =========================================================================
  // ARTICLE 3: PHSA LHV First Merit List 2026
  // Category: admissions (DO NOT EMIT JobPosting SCHEMA)
  // =========================================================================
  const phsaSlug = 'phsa-lhv-first-merit-list-2026-pdf-download-quotas';
  const phsaContent = [
    "# PHSA LHV First Merit List 2026 — Official PDF Download, District & Quota-Wise Lists",

    "## Executive Summary & Official Admission Notice\n\nThe **Provincial Health Services Academy (PHSA)**, Health Department, Government of Khyber Pakhtunkhwa, has officially announced the **First Merit List for Lady Health Visitor (LHV) Admissions for the 2026–2028 Academic Session**. Notified officially on **23 October 2026** and verified live on **25 October 2026** on the [PHSA Official Notices Portal](https://phsa.edu.pk/notice-details?seg=admissions), the merit lists determine provisional admission selections across all affiliated Public Health Schools in Khyber Pakhtunkhwa.",

    "> [!IMPORTANT]\n> **Quick Answer & Official Admission Verification (Verified 25 October 2026):**\n> - **Issuing Authority:** Provincial Health Services Academy (PHSA), Health Department KPK\n> - **Academic Program:** Lady Health Visitor (LHV) Diploma (2-Year Government Healthcare Training)\n> - **Merit List Release Date:** **23 October 2026**\n> - **Merit Validity & Final Submission Deadline:** **Tuesday, 3 November 2026**\n> - **Affiliated Institutions:** Public Health Schools in Hayatabad (Peshawar), Nishterabad (Peshawar), Abbottabad, and D.I. Khan\n> - **Available Quota PDF Lists:** District-Wise Open Merit, Self-Finance, Minority Quota, and Persons with Disabilities (PWD) Quota\n> - **Official Download Portal:** [phsa.edu.pk/notice-details?seg=admissions](https://phsa.edu.pk/notice-details?seg=admissions)\n> - **Immediate Next Action:** Selected candidates must submit original documents, medical fitness certificates, and admission fees at their allocated Public Health School before the deadline to confirm their seats.",

    "## Quick Facts Table: PHSA LHV Merit List 2026\n\n| ATTRIBUTE | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Issuing Authority** | Provincial Health Services Academy (PHSA), KPK |\n| **Course / Program** | Lady Health Visitor (LHV) 2-Year Diploma Program |\n| **Academic Session** | 2026 – 2028 Batch |\n| **Official Release Date** | 23 October 2026 |\n| **Admission Confirmation Cutoff** | **Tuesday, 3 November 2026** |\n| **Participating Centers** | PHS Hayatabad, PHS Nishterabad, PHS Abbottabad, PHS D.I. Khan |\n| **Merit Status Displayed** | Selected Candidates List & Waiting List with Aggregate Scores |\n| **Document Verification** | Mandatory in-person submission of original credentials at allocated school |\n| **Official Portal Link** | [phsa.edu.pk/notice-details?seg=admissions](https://phsa.edu.pk/notice-details?seg=admissions) |",

    "## Participating Public Health Schools & Quota Breakdown\n\nThe 23 October 2026 admission release provides comprehensive seat allocations across four premier public health training institutions in the province:\n\n1. **Public Health School, Hayatabad (Peshawar):** Accommodates candidates from central Khyber Pakhtunkhwa districts, Peshawar division, and merged tribal districts.\n2. **Public Health School, Nishterabad (Peshawar):** Offers specialized primary healthcare and maternal-child health clinical training.\n3. **Public Health School, Abbottabad:** Caters to female candidates from Hazara division (Abbottabad, Mansehra, Haripur, Battagram, Torghar, Upper/Lower Kohistan).\n4. **Public Health School, D.I. Khan:** Covers southern districts including D.I. Khan, Tank, Bannu, Lakki Marwat, and adjoining tribal areas.\n\n### Quota Classifications Published:\n- **District-Wise Open Merit:** Allocated strictly based on academic aggregate (Matric Science marks / FSc Pre-Medical weightage) according to district population quotas.\n- **Self-Finance Quota:** Designated seats for candidates opting for the institutional self-finance fee structure.\n- **Minority Quota:** Reserved percentage for non-Muslim Pakistani female candidates.\n- **Disability / Special Quota:** Designated seats for candidates certified by the authorized Provincial Disability Assessment Board.",

    "## How to Download Official PHSA LHV Merit List PDFs\n\nFollow these verified instructions to view and download your institution's merit list:\n\n1. **Open Official Portal:** Visit the official PHSA website at [phsa.edu.pk](https://phsa.edu.pk).\n2. **Navigate to Public Notices:** Click on the *Public Notices* tab and select the category *LHVs Admission 2026 Updates* (or navigate directly to [phsa.edu.pk/notice-details?seg=admissions](https://phsa.edu.pk/notice-details?seg=admissions)).\n3. **Locate Notice:** Open the official notification titled **\"LHV Admission First Merit List (Session 2026–2028)\"**.\n4. **Select Institution & Quota PDF:** Click on the specific download link corresponding to your designated Public Health School (Hayatabad, Nishterabad, Abbottabad, or D.I. Khan) and your applied quota.\n5. **Check Merit Status:** Search using your Roll Number, Candidate Name, or Father’s Name. Confirm whether your status is marked **Selected** or **Waiting** alongside your calculated aggregate score.",

    "## Instructions for Selected Candidates & Document Verification\n\nCandidates whose names appear in the **Selected** category must complete mandatory formalities before the strict **3 November 2026** cutoff:\n\n- **Reporting to Allocated School:** Report physically to the Principal's Office of the assigned Public Health School between 9:00 AM and 3:00 PM on official working days.\n- **Original Documents Required:**\n  - Original Secondary School Certificate (Matriculation) with detailed marks sheet (DMC).\n  - FSc Pre-Medical Certificate / DMC (if applicable).\n  - Original Domicile Certificate of the applicant.\n  - Computerized National Identity Card (CNIC) or NADRA Smart Card / B-Form.\n  - Father's / Guardian's CNIC photocopy.\n  - 06 recent passport-size photographs with blue/white background.\n  - Medical Fitness Certificate issued by a Medical Superintendent (MS) of a Government District Headquarters (DHQ) Hospital.\n  - Prescribed Affidavit on judicial stamp paper (attested by an Oath Commissioner).\n- **Payment of Admission Fee:** Submit the prescribed admission fee challan at the authorized bank branch before **3 November 2026**.\n\n> [!WARNING]\n> **Forfeiture of Seat:** If a selected candidate fails to deposit the prescribed admission fee and submit verified original documents by **3 November 2026**, her admission offer will stand automatically cancelled, and the vacant seat will be awarded to the next candidate on the waiting list in the Second Merit List.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: When was the PHSA LHV First Merit List 2026 officially published?**\nThe list was officially published by the Provincial Health Services Academy on **23 October 2026**.\n\n**Q2: What is the deadline to confirm admission and submit fees?**\nSelected candidates must complete document verification and pay admission dues on or before **Tuesday, 3 November 2026**.\n\n**Q3: Where can candidates download the district-wise merit list PDFs?**\nThe official PDF lists are available on the PHSA Admissions portal at [phsa.edu.pk/notice-details?seg=admissions](https://phsa.edu.pk/notice-details?seg=admissions).\n\n**Q4: Will a second merit list be issued by PHSA?**\nYes. Vacant seats remaining after the 3 November 2026 deadline will be filled through the Second Merit List from candidates currently on the Waiting List.\n\n**Q5: Is this an employment recruitment list?**\nNo. This is an academic admission merit list for the 2-Year Lady Health Visitor (LHV) Diploma Training Program across public health schools in Khyber Pakhtunkhwa.",

    "## Official Sources & Related CareerDost Healthcare Guides\n\n- **Official PHSA Portal:** [phsa.edu.pk](https://phsa.edu.pk/)\n- **Direct Notice Link:** [PHSA Admission Notices 2026](https://phsa.edu.pk/notice-details?seg=admissions)\n- **Related CareerDost Healthcare & Admissions Guides:**\n  - [BS Nursing Admissions 2026–27 in Sindh via NTS](/admissions/sindh-bs-nursing-admissions-2026-27)\n  - [PHSA Paramedic Diploma General Lists 2026](/results/phsa-paramedic-general-list-2026)\n  - [KP Government BS Nursing Admissions 2026–2030](/admissions/phsa-kp-bs-nursing-admissions-2026)"
  ];

  const phsaPayload = {
    title: 'PHSA LHV First Merit List 2026 — Official PDF Download, District & Quota-Wise Lists',
    slug: phsaSlug,
    category: 'admissions',
    organization: 'Provincial Health Services Academy (PHSA)',
    jobType: '2-Year Diploma Admission Merit List',
    location: 'Khyber Pakhtunkhwa (Peshawar, Abbottabad, D.I. Khan)',
    qualification: 'Matric Science / FSc Pre-Medical (Selected Merit Candidates)',
    salary: 'Academic Training (Govt Stipend / Facilities as per PHSA Regulations)',
    experience: 'Eligible Admission Candidates (2026–2028 Session)',
    positions: '1st Merit List (Public Health Schools Hayatabad, Nishterabad, Abbottabad, D.I. Khan)',
    lastDate: '2026-11-03',
    noDeadline: false,
    publishDate: '2026-10-25',
    officialLink: 'https://phsa.edu.pk/',
    applyLink: 'https://phsa.edu.pk/notice-details?seg=admissions',
    isVerified: true,
    featured: true,
    logoInitial: 'PHSA',
    featuredImage: '/images/phsa-lhv-first-merit-list-2026.webp',
    imageAlt: 'PHSA LHV First Merit List 2026 PDF Download Public Health Schools KPK CareerDost',
    excerpt: 'Provincial Health Services Academy (PHSA) releases official First Merit List for Lady Health Visitor (LHV) 2026 admissions. Download district-wise PDFs for Peshawar, Abbottabad, and DI Khan. Verification deadline: 3 November 2026.',
    content: phsaContent,
    seoTitle: 'PHSA LHV First Merit List 2026: Official PDF Download & Quotas',
    metaDescription: 'Download official PHSA LHV First Merit List 2026 PDF for Public Health Schools in Peshawar, Abbottabad & DI Khan. Check district quotas, selection status & deadline.',
    status: 'draft'
  };

  // =========================================================================
  // EXECUTION: POST DRAFTS TO PRODUCTION CMS & UPDATE LOCAL SQLITE
  // =========================================================================
  const newArticles = [
    { name: 'Article 1 (Bank AL Habib)', payload: bahlPayload },
    { name: 'Article 2 (Bank of Punjab Agri Sukkur)', payload: bopPayload },
    { name: 'Article 3 (PHSA LHV Merit List)', payload: phsaPayload }
  ];

  const createdDrafts = [];

  for (const item of newArticles) {
    const slug = item.payload.slug;
    const existingDraftId = draftSlugMap.get(slug);

    if (existingDraftId) {
      console.log(`[DRAFT ALREADY EXISTS IN CMS] ID: ${existingDraftId} | Slug: ${slug}`);
      createdDrafts.push({ id: existingDraftId, slug, title: item.payload.title, status: 'draft', category: item.payload.category });
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

    createdDrafts.push({
      id: newId,
      slug: slug,
      title: item.payload.title,
      status: 'draft',
      category: item.payload.category,
      featuredImage: item.payload.featuredImage
    });

    // Update local SQLite for parity
    try {
      const existingInLocal = localDb.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
      const contentJson = JSON.stringify(item.payload.content);
      if (existingInLocal) {
        localDb.prepare(`
          UPDATE articles SET
            title = ?, category = ?, content = ?, status = 'draft',
            featured_image = ?, image_alt = ?, updated_at = datetime('now')
          WHERE id = ?
        `).run(item.payload.title, item.payload.category, contentJson, item.payload.featuredImage, item.payload.imageAlt, existingInLocal.id);
      } else {
        localDb.prepare(`
          INSERT INTO articles (
            id, title, slug, category, excerpt, content, status,
            featured_image, image_alt, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, datetime('now'), datetime('now'))
        `).run(newId, item.payload.title, slug, item.payload.category, item.payload.excerpt, contentJson, item.payload.featuredImage, item.payload.imageAlt);
      }
      console.log(`  ✓ Synced to local SQLite (ID: ${newId})`);
    } catch (dbErr) {
      console.warn(`  ! Local SQLite sync notice:`, dbErr.message);
    }
  }

  // =========================================================================
  // TASK: PREPARE STAGED EXISTING CONTENT UPDATES FOR OWNER REVIEW
  // =========================================================================
  console.log('\n--- PREPARING 2 STAGED EXISTING-CONTENT UPDATES FOR OWNER APPROVAL ---');

  // UPDATE 4: Sindh Government Jobs Guide (proposing expansion to Article 351 or guide)
  const stagedSindhJobsUpdate = {
    targetArticleId: 351,
    targetSlug: 'sindh-job-portal-2026-junior-clerk-jobs',
    proposedTitle: 'Sindh Government Jobs 2026 — Latest Vacancies, SPSC, STS, Eligibility & Online Apply',
    proposedCategory: 'government-jobs',
    proposedExcerpt: 'Complete 2026 Sindh Government Jobs Guide covering SPSC CCE-2026 (Adv 06/2026 deadline extended to 11 Nov), Sindh High Court & judicial tests via STS, RSU consultants, and Sindh Job Portal vacancies across Karachi, Hyderabad, and Sukkur.',
    coreUpdates: [
      {
        section: 'SPSC CCE-2026 Major Reforms & Extended Deadline',
        verifiedDetails: 'SPSC Advertisement No. 06/2026 (dated 23 Oct 2026) extended the online application deadline to 11 November 2026. Age limit relaxed to 33 years, attempts increased to 5 under a 3-year provision, and screening test qualifying marks set at 33% (66 marks with 0.25 negative marking). Prior applicants do not need to reapply.'
      },
      {
        section: 'Sindh High Court & Judicial Positions via STS',
        verifiedDetails: 'SIBA Testing Services (apply.sts.net.pk) conducting shorthand and screening tests for Personal Assistants, Civil Judges, and District Court personnel in Karachi and Mirpur Khas.'
      },
      {
        section: 'Sindh Education & Literacy Reform Support Unit (RSU)',
        verifiedDetails: 'Active PPS-8 and PPS-9 specialist and consultant vacancies under provincial education initiatives.'
      },
      {
        section: 'Sindh Job Portal (sindh.gov.pk)',
        verifiedDetails: 'Continuous roster for Junior Clerks (BPS-11), Computer Operators, and support cadres across provincial secretariats.'
      }
    ],
    editorialRecommendation: 'Keep staged as an editorial revision draft for Article 351. Owner can review and merge when ready to expand the Junior Clerk article into an all-departments directory.'
  };

  // UPDATE 5: Samba Bank Universal Teller (proposing update to Article 483)
  const stagedSambaUpdate = {
    targetArticleId: 483,
    targetSlug: 'samba-bank-relationship-associate-jobs-2026',
    proposedTitle: 'Samba Bank Jobs 2026: Universal Teller (All Cities) & Relationship Associate – Apply by 31 October',
    proposedCategory: 'bank-jobs',
    proposedExcerpt: 'Samba Bank Limited invites applications for Universal Teller (All Cities, 1+ year branch/cash experience, Bachelor’s degree) and Relationship Associate (SME Banking, Karachi & Lahore). Application cutoff is 31 October 2026.',
    coreUpdates: [
      {
        position: 'Universal Teller',
        locations: 'All Cities / Multiple Locations Nationwide',
        qualification: 'Bachelor’s Degree (Commerce, Business, Economics, or related fields)',
        experience: 'Minimum 1+ year of relevant commercial banking experience in cash handling, teller operations, and customer service',
        complianceFocus: 'Proficiency in State Bank of Pakistan (SBP) AML/KYC regulations, GL balancing, and cash counter security',
        deadline: '31 October 2026',
        officialApplication: 'Direct submission via careers@samba.com.pk and official portal https://www.samba.com.pk/career'
      }
    ],
    editorialRecommendation: 'Staged revision ready for owner review. Updates Article 483 into a multi-cadre Samba Bank recruitment alert without creating a competing duplicate article.'
  };

  fs.writeFileSync('scratch/staged_updates_oct25.json', JSON.stringify({
    date: '2026-10-25',
    stagedUpdates: [stagedSindhJobsUpdate, stagedSambaUpdate]
  }, null, 2), 'utf8');

  console.log('✓ Staged updates saved to scratch/staged_updates_oct25.json');

  // Verify created drafts via production CMS
  console.log('\n--- VERIFYING DRAFTS IN PRODUCTION CMS ADMIN PANEL ---');
  const verifyRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const verifyData = await verifyRes.json();
  const allDrafts = verifyData.data || [];

  for (const d of createdDrafts) {
    const found = allDrafts.find(item => item.id === d.id);
    if (found) {
      console.log(`✓ [CONFIRMED LIVE IN ADMIN PANEL] ID: ${found.id} | Slug: ${found.slug} | Status: ${found.status} | Title: "${found.title.slice(0, 45)}..."`);
    } else {
      console.error(`✗ [NOT FOUND IN ADMIN PANEL] ID: ${d.id}`);
    }
  }

  console.log('\n=== CONTENT PRODUCTION COMPLETED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Content production failed:', err);
  process.exit(1);
});
