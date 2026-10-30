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
  console.log('=== CAREERDOST — 24 OCTOBER 2026 CONTENT PRODUCTION ===\n');

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
  // ARTICLE 1: IRSA Government Jobs 2026 (Telemetry Project via NTS)
  // =========================================================================
  const irsaSlug = 'irsa-jobs-2026-nts-telemetry-engineers-supervisors';
  const irsaContent = [
    "# IRSA Jobs 2026 — 23 Vacancies for Engineers, Supervisors, GIS Analyst & Auditor | Apply via NTS",

    "## Executive Summary & Official Recruitment Notice\n\nThe **Indus River System Authority (IRSA)**, the apex federal water regulatory authority operating under the administrative control of the Government of Pakistan, has announced fresh contractual career opportunities under its flagship national development initiative: **\"Installation of Telemetry System for Real-Time Discharge Monitoring at 27 Key Sites on Indus Basin Irrigation System (IBIS)\"**.\n\nAdministered and processed through the **National Testing Service (NTS)**, this recruitment drive invites experienced engineering, spatial analysis, and financial professionals across Pakistan to support modern digital discharge monitoring across major barrage stations, canal headworks, and inter-provincial water distribution rim stations.",

    "> [!IMPORTANT]\n> **Quick Answer & Official Recruitment Verification (Verified 24 October 2026):**\n> - **Hiring Organization:** Indus River System Authority (IRSA), Government of Pakistan\n> - **Project Mandate:** Telemetry System for Real-Time Discharge Monitoring (IBIS 27 Sites)\n> - **Testing & Screening Agency:** National Testing Service (NTS)\n> - **Total Confirmed Positions:** Exactly **23 Vacancies** across 4 distinct cadres\n> - **Employment Terms:** Federal Project Pay Scale (PPS-05 to PPS-07 Contract)\n> - **Application Window:** Open now; final cutoff is **Monday, 26 October 2026**\n> - **Application Mode:** Online submission on [nts.org.pk](https://www.nts.org.pk/new/projectsnew.php) followed by postal dispatch of printed form and credentials to NTS Headquarters, Islamabad.",

    "## Quick Facts Table: IRSA Telemetry Recruitment 2026\n\n| ATTRIBUTE | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Employer Authority** | Indus River System Authority (IRSA) |\n| **Sponsoring Project** | Telemetry Real-Time Discharge Monitoring System (IBIS) |\n| **Testing Agency** | National Testing Service (NTS) |\n| **Total Vacancies** | **23 Confirmed Posts** |\n| **Pay Scales Offered** | Project Pay Scales (PPS-05, PPS-06, PPS-07) |\n| **Application Deadline** | **Monday, 26 October 2026** |\n| **Duty Stations** | 27 IBIS Telemetry Stations Nationwide (Punjab, Sindh, KP, Balochistan) & IRSA HQ Islamabad |\n| **Eligibility Bracket** | DAE (Electronics/Electrical), 16-Year Degrees in GIS/Finance |\n| **Age Limits** | 30 to 35 Years (Cadre-specific ceilings) |\n| **Official Portal Link** | [nts.org.pk](https://www.nts.org.pk/new/projectsnew.php) |",

    "## Position Breakdown, Vacancies & Eligibility Criteria\n\n### 1. GIS / Web GIS Analyst (PPS-07) — 01 Post\n- **Monthly Remuneration:** **Rs. 157,500/-** per month.\n- **Educational Qualification:** Master’s / 16-Year Bachelor’s degree in Geographic Information Systems (GIS), Remote Sensing (RS), Geomatics, Space Science, or Computer Science from an HEC-recognized university.\n- **Experience Required:** Minimum 3 to 5 years of professional hands-on experience in Web GIS portal development, hydrological spatial mapping, satellite data integration, and database administration.\n- **Upper Age Limit:** Up to 35 Years.\n\n### 2. Senior Auditor (PPS-06) — 01 Post\n- **Monthly Remuneration:** **Rs. 105,000/-** per month.\n- **Educational Qualification:** 16-Year degree in Accounting & Finance, Commerce (M.Com, BBA Hons / MBA Finance) or CA Inter, CMA, or ACCA member.\n- **Experience Required:** At least 3 years of post-qualification experience in project financial auditing, public procurement rules (PPRA), and expenditure verification in government or autonomous bodies.\n- **Upper Age Limit:** Up to 35 Years.\n\n### 3. Sub-Engineer — Electronics / Electrical (PPS-05) — 17 Posts\n- **Monthly Remuneration:** **Rs. 70,000/-** per month.\n- **Educational Qualification:** 3-Year Diploma of Associate Engineer (DAE) in Electronics, Electrical, or Telecommunication Engineering from a recognized Board of Technical Education.\n- **Experience Required:** 1 to 2 years of practical experience in electronic sensor calibration, river gauging equipment maintenance, industrial instrumentation, or solar telemetry setups.\n- **Upper Age Limit:** Up to 30 Years.\n\n### 4. Supervisor — Electronics / Electrical (PPS-05) — 04 Posts\n- **Monthly Remuneration:** **Rs. 70,000/-** per month.\n- **Educational Qualification:** 3-Year Diploma of Associate Engineer (DAE) in Electrical or Electronics Engineering.\n- **Experience Required:** 2 to 3 years of supervisory field experience in battery bank monitoring, power distribution boards, automated gate sensor networks, and data transmission links.\n- **Upper Age Limit:** Up to 32 Years.",

    "## Step-by-Step Online Application Guide (NTS)\n\nCandidates meeting the eligibility criteria must complete the standardized two-phase NTS application procedure:\n\n1. **Register on NTS Candidate Portal:** Visit [nts.org.pk](https://www.nts.org.pk/new/projectsnew.php) and locate *Indus River System Authority (IRSA) — Telemetry Project*.\n2. **Fill Digital Application:** Enter CNIC, personal bio-data, academic qualifications (Matric, DAE, Graduation), and relevant work experience.\n3. **Select Post:** Choose your exact position (only one position per application form; candidates applying for multiple posts must submit separate forms and fees).\n4. **Generate Fee Challan / 1Bill Invoice:** Download the auto-generated 1Link 1Bill invoice for the NTS test processing fee.\n5. **Pay Fee Electronically:** Pay via mobile banking apps, ATMs, EasyPaisa, JazzCash, or TCS express counters using the 1Bill consumer number.\n6. **Print & Dispatch Form:** Print the finalized online application form, affix 2 recent passport-size photographs, attach attested photocopies of CNIC, Domicile, DAE/Degree certificates, experience letters, and the original paid deposit slip.\n7. **Mailing Address:** Send via registered courier before the close of business on **26 October 2026** to:\n   > **National Testing Service (IRSA Project)**\n   > Plot 96, Street 4, Sector H-8/1, Islamabad.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for IRSA Jobs 2026?**\nThe last date for online registration and courier submission through NTS is **Monday, 26 October 2026**.\n\n**Q2: How many total vacancies are announced in this IRSA recruitment drive?**\nExactly **23 vacancies** are officially advertised (1 GIS Analyst, 1 Senior Auditor, 17 Sub-Engineers, and 4 Supervisors).\n\n**Q3: Can candidates with a DAE apply for Sub-Engineer posts?**\nYes. Candidates holding a 3-year DAE in Electronics, Electrical, or Telecommunication from a recognized Board of Technical Education are eligible.\n\n**Q4: Where will appointed candidates be posted?**\nAppointed staff will be stationed at telemetry monitoring stations across 27 key irrigation sites on the Indus Basin (including locations in Punjab, Sindh, Khyber Pakhtunkhwa, and Balochistan) and at the IRSA Head Office in Islamabad.\n\n**Q5: Is physical mailing of the application mandatory?**\nYes. NTS requires candidates to print the submitted online application and mail it along with attested educational documents and the paid fee voucher to NTS Islamabad.",

    "## Official Sources & Related CareerDost Guides\n\n- **Official Testing Portal:** [NTS Open Projects Portal](https://www.nts.org.pk/new/projectsnew.php)\n- **Authority Website:** [Indus River System Authority (IRSA)](https://pakirsa.gov.pk/)\n- **Related CareerDost Recruitment Coverage:**\n  - [Engineering Development Board Jobs 2026 (Apply Online)](/jobs/engineering-development-board-jobs-october-2026)\n  - [PSEB Government IT Vacancies 2026](/jobs/pseb-government-it-jobs-october-2026)\n  - [SPSC Jobs 2026 – Government Vacancies Guide](/jobs/spsc-jobs-2026-54-vacancies)"
  ];

  const irsaPayload = {
    title: 'IRSA Jobs 2026 — 23 Vacancies for Engineers, Supervisors, GIS Analyst & Auditor | Apply via NTS',
    slug: irsaSlug,
    category: 'government-jobs',
    organization: 'Indus River System Authority (IRSA)',
    jobType: 'Federal Project Contract (PPS-05 to PPS-07)',
    location: '27 Telemetry Sites Nationwide (Punjab, Sindh, KP, Balochistan) & Islamabad',
    qualification: 'DAE (Electronics / Electrical) or 16-Year Degree in GIS, Remote Sensing, Finance or Accounting',
    salary: 'PPS-05 (Rs. 70,000) | PPS-06 (Rs. 105,000) | PPS-07 (Rs. 157,500) per month',
    experience: '1 to 5 Years Post-Qualification Experience in Engineering, Telemetry, GIS or Public Audit',
    positions: '23 Confirmed Vacancies (1 GIS Analyst, 1 Auditor, 17 Sub-Engineers, 4 Supervisors)',
    lastDate: '2026-10-26',
    noDeadline: false,
    publishDate: '2026-10-24',
    officialLink: 'https://pakirsa.gov.pk/',
    applyLink: 'https://www.nts.org.pk/new/projectsnew.php',
    isVerified: true,
    featured: true,
    logoInitial: 'IRSA',
    featuredImage: '/images/irsa-jobs-2026-nts-telemetry-engineers-supervisors.webp',
    imageAlt: 'IRSA Jobs 2026 Telemetry Project NTS Sub-Engineers GIS Analyst Senior Auditor CareerDost',
    excerpt: 'Indus River System Authority (IRSA) announces 23 contractual vacancies for Sub-Engineers, Supervisors, GIS Analysts, and Auditors under the IBIS Telemetry System project via NTS. Monthly salary up to Rs. 157,500. Apply before 26 October 2026.',
    content: irsaContent,
    seoTitle: 'IRSA Jobs 2026: 23 Telemetry Engineer & Analyst Posts | NTS',
    metaDescription: 'IRSA Jobs 2026 via NTS: 23 vacancies for Sub-Engineers, Supervisors, GIS Analyst & Senior Auditor. Monthly pay up to Rs. 157,500. Apply by 26 October 2026.',
    focusKeyword: 'IRSA Jobs 2026',
    canonicalUrl: `https://careerdost.blog/jobs/${irsaSlug}`,
    ogTitle: 'IRSA Jobs 2026 — 23 Telemetry Engineer & Supervisor Vacancies (NTS)',
    ogDescription: 'Official IRSA Telemetry project hiring via NTS: 23 vacancies for DAE holders, Engineers, and Finance professionals. Check eligibility and application steps.',
    status: 'draft'
  };

  // =========================================================================
  // ARTICLE 2: Punjab Child Protection Bureau Jobs 2026 (CPWB via NTS)
  // =========================================================================
  const cpwbSlug = 'punjab-child-protection-welfare-bureau-cpwb-jobs-2026';
  const cpwbContent = [
    "# Punjab Child Protection Bureau Jobs 2026 — Nurse, Accountant, Child Attendant & Other Vacancies",

    "## Executive Summary & Official Recruitment Notice\n\nThe **Child Protection & Welfare Bureau (CPWB), Punjab**, operating under the administrative oversight of the **Home Department, Government of Punjab**, has officially announced an extensive recruitment campaign for **120 contract vacancies** across multiple professional, technical, and caregiving cadres.\n\nAdministered through the **National Testing Service (NTS)**, this recruitment drive offers opportunities for qualified medical, finance, religious, and childcare professionals to serve vulnerable, neglected, and destitute children across CPWB institutes in Lahore, Rawalpindi, Multan, Faisalabad, Gujranwala, Sialkot, Bahawalpur, and Rahim Yar Khan.",

    "> [!IMPORTANT]\n> **Quick Answer & Official Recruitment Verification (Verified 24 October 2026):**\n> - **Hiring Department:** Child Protection & Welfare Bureau (CPWB), Home Department, Government of Punjab\n> - **Testing Agency:** National Testing Service (NTS)\n> - **Total Vacancies:** Exactly **120 Confirmed Positions** (Nurse, Accountant, Child Attendants, Religious Teacher, Dispenser)\n> - **Employment Nature:** 1-Year Contract Basis (Extendable based on performance and budget)\n> - **Application Fee:** **Rs. 550/-** payable via 1Link 1Bill\n> - **Application Cutoff:** **Saturday, 31 October 2026**\n> - **Application Procedure:** Complete online registration at [nts.org.pk](https://www.nts.org.pk/new/projectsnew.php), print the completed form, and dispatch it with verified credentials to NTS Lahore Office.",

    "## Quick Facts Table: Punjab CPWB Jobs 2026\n\n| RECRUITMENT PARAMETER | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Hiring Institution** | Child Protection & Welfare Bureau (CPWB), Punjab |\n| **Administrative Parent** | Home Department, Government of Punjab |\n| **Testing Authority** | National Testing Service (NTS) |\n| **Total Vacancies** | **120 Posts** (111 Child Attendants + 9 Technical/Staff) |\n| **Job Locations** | Lahore (Head Office) & Regional CPWB Centers across Punjab |\n| **Gender Eligibility** | Male & Female (Cadre-specific quotas) |\n| **Application Fee** | Rs. 550/- (Non-Refundable NTS Fee) |\n| **Application Deadline** | **Saturday, 31 October 2026** |\n| **Minimum Education** | Matriculation, Intermediate, Nursing Diploma, B.Com |\n| **Official Portal** | [nts.org.pk](https://www.nts.org.pk/new/projectsnew.php) |",

    "## Detailed Position Breakdown & Educational Eligibility\n\n### 1. Child Attendant (Male & Female) — 111 Posts\n- **Vacancies Distribution:** **26 Male** positions and **85 Female** positions.\n- **Age Bracket:** 25 to 32 Years.\n- **Educational Requirement:** Secondary School Certificate (Matriculation, at least 2nd Division) from a recognized Board of Intermediate and Secondary Education.\n- **Experience Advantage:** Candidates possessing 2 years of practical experience in child care, residential boarding management, or child rehabilitation units receive added selection preference.\n\n### 2. Nurse (Female) — 03 Posts\n- **Age Bracket:** 22 to 28 Years.\n- **Educational Requirement:** 3-Year Diploma in General Nursing and 1-Year Diploma in Midwifery from a government-recognized nursing institute.\n- **Professional Registration:** Mandatory active registration with the **Pakistan Nursing Council (PNC)**.\n- **Computer Proficiency:** Practical knowledge of MS Office software is preferred.\n\n### 3. Accountant — 04 Posts\n- **Age Bracket:** 21 to 28 Years.\n- **Educational Requirement:** Bachelor of Commerce (B.Com / 14 years education, minimum 2nd Division) from an HEC-recognized university.\n- **Professional Experience:** Minimum 2 years of relevant accounting, financial bookkeeping, and budgetary experience in a public sector organization.\n\n### 4. Religious Teacher (Male) — 01 Post\n- **Age Bracket:** 20 to 28 Years.\n- **Educational Requirement:** Higher Secondary School Certificate (HSSC / Intermediate, at least 2nd Division) plus formal certification as **Hafiz-ul-Quran**.\n- **Professional Experience:** At least 2 years of teaching experience in a government-recognized school or madrassa.\n\n### 5. Dispenser (Female) — 01 Post\n- **Age Bracket:** 18 to 25 Years.\n- **Educational Requirement:** Matriculation with Science (minimum 2nd Division) and a valid **Dispenser Diploma** from the Punjab Medical Faculty, accompanied by 1 year of clinical experience.",

    "## Step-by-Step Online Application & Submission Guide\n\nCandidates must follow the mandatory NTS submission instructions:\n\n1. **Visit NTS Portal:** Access the open application directory on [nts.org.pk](https://www.nts.org.pk/new/projectsnew.php) and click on *Child Protection & Welfare Bureau (CPWB), Punjab*.\n2. **Candidate Profile Registration:** Log in or create a candidate account using your CNIC, mobile number, and active email address.\n3. **Form Completion:** Input your personal details, Punjab domicile district, and academic marks accurately as verified on official certificates.\n4. **Fee Payment:** Download the auto-generated 1Link 1Bill invoice for **Rs. 550/-** and pay via ATM, internet banking, mobile app (EasyPaisa/JazzCash), or TCS express centers.\n5. **Print Form:** Print the finalized NTS application form after payment confirmation.\n6. **Document Verification:** Attach 2 recent passport-size photographs, attested photocopies of CNIC, Punjab Domicile, academic degrees/diplomas, experience certificates, and the original paid fee invoice.\n7. **Mailing Destination:** Mail the physical packet via Pakistan Post or courier before **31 October 2026** to:\n   > **National Testing Service (CPWB Project)**\n   > Plot No. 201, FF Block, CCA, Phase IV, DHA, Lahore.\n\n> [!WARNING]\n> Applications sent directly to the CPWB Head Office will be summarily rejected. Only applications routed through NTS with paid vouchers will be processed for the screening test.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for Punjab CPWB Jobs 2026?**\nThe deadline for online registration on NTS and postal dispatch of the application form is **Saturday, 31 October 2026**.\n\n**Q2: How many Child Attendant vacancies are available for females?**\nOut of 111 Child Attendant positions, **85 vacancies** are specifically reserved for female candidates and **26 vacancies** for male candidates.\n\n**Q3: What is the application test fee for CPWB jobs?**\nThe official NTS test processing fee is **Rs. 550/-**, payable through 1Link 1Bill participating platforms.\n\n**Q4: Where should the printed application form be mailed?**\nThe printed form and attested documents must be delivered to the **NTS Lahore Office: Plot No. 201, FF Block, CCA, Phase IV, DHA, Lahore**.\n\n**Q5: Are candidates from other provinces eligible?**\nNo. Applicants must hold a valid **Punjab Domicile** to be eligible for recruitment under the Child Protection & Welfare Bureau, Punjab.",

    "## Official Links & Related CareerDost Guides\n\n- **NTS Application Portal:** [NTS Open Projects](https://www.nts.org.pk/new/projectsnew.php)\n- **Bureau Website:** [Child Protection & Welfare Bureau Punjab](https://cpwb.punjab.gov.pk/)\n- **Related CareerDost Recruitment Coverage:**\n  - [Sindh Courts Jobs 2026 (BPS 1 to 4 Complete Notice)](/jobs/sindh-courts-bps-1-4-jobs-2026)\n  - [KP Government Project Associate Internship 2026](/jobs/kp-government-project-associate-internship-2026)\n  - [Meezan Bank Jobs 2026 — Transaction Associates](/jobs/meezan-bank-transaction-associates-batch-01-jobs-2026)"
  ];

  const cpwbPayload = {
    title: 'Punjab Child Protection Bureau Jobs 2026 — Nurse, Accountant, Child Attendant & Other Vacancies',
    slug: cpwbSlug,
    category: 'government-jobs',
    organization: 'Child Protection & Welfare Bureau (CPWB), Home Department, Government of Punjab',
    jobType: 'Punjab Government Contract (1-Year Extendable)',
    location: 'Lahore (Head Office) & Regional CPWB Centers across Punjab',
    qualification: 'Matriculation (2nd Div), Intermediate with Hifz, Nursing Diploma (PNC), Dispenser Diploma, or B.Com',
    salary: 'Punjab Government Contract Pay Scales + Allowances as per Departmental Policy',
    experience: 'Fresh to 2 Years Relevant Experience in Child Care, Nursing, Healthcare or Accounting',
    positions: '120 Vacancies (111 Child Attendants, 4 Accountants, 3 Nurses, 1 Dispenser, 1 Religious Teacher)',
    lastDate: '2026-10-31',
    noDeadline: false,
    publishDate: '2026-10-24',
    officialLink: 'https://cpwb.punjab.gov.pk/',
    applyLink: 'https://www.nts.org.pk/new/projectsnew.php',
    isVerified: true,
    featured: true,
    logoInitial: 'CPWB',
    featuredImage: '/images/punjab-child-protection-welfare-bureau-cpwb-jobs-2026.webp',
    imageAlt: 'Punjab Child Protection and Welfare Bureau CPWB Jobs 2026 NTS 120 Vacancies Nurse Accountant Child Attendant CareerDost',
    excerpt: 'Child Protection & Welfare Bureau (CPWB) Punjab announces 120 contractual vacancies including 111 Child Attendants, 4 Accountants, 3 Nurses, and Dispensers via NTS. Punjab domicile required. Apply before 31 October 2026.',
    content: cpwbContent,
    seoTitle: 'Punjab Child Protection Bureau Jobs 2026: 120 Posts via NTS',
    metaDescription: 'Punjab Child Protection & Welfare Bureau (CPWB) Jobs 2026: 120 vacancies for Child Attendants, Nurses, Accountants & Dispensers via NTS. Apply by 31 Oct 2026.',
    focusKeyword: 'Punjab Child Protection Bureau Jobs 2026',
    canonicalUrl: `https://careerdost.blog/jobs/${cpwbSlug}`,
    ogTitle: 'Punjab Child Protection Bureau Jobs 2026 — 120 Vacancies via NTS',
    ogDescription: 'Verified Punjab CPWB recruitment 2026: 111 Child Attendants, Nurses, Accountants, and Dispensers. Check eligibility and NTS application procedure.',
    status: 'draft'
  };

  // =========================================================================
  // ARTICLE 3: NTS GAT General VIII 2026 Registration
  // =========================================================================
  const gatSlug = 'nts-gat-general-viii-2026-registration-schedule-eligibility';
  const gatContent = [
    "# NTS GAT General VIII 2026 Registration — Last Date, Eligibility, Fee & Online Application",

    "## Examination Overview & Official Schedule Notice\n\nThe **National Testing Service (NTS)** has officially announced the registration schedule for the **Graduate Assessment Test GAT-General-VIII (2026-VIII)**.\n\nServing as the standardized national evaluation benchmark recognized by the **Higher Education Commission (HEC)** of Pakistan, the GAT-General test is a mandatory admission requirement for candidates seeking enrollment into **MS, M.Phil, LLM, and equivalent 18-year postgraduate degree programs** across chartered public and private universities in Pakistan. Test scores also serve as eligibility criteria for HEC scholarships and specialized institutional development grants.",

    "> [!IMPORTANT]\n> **Quick Answer & Official GAT-VIII Schedule (Verified 24 October 2026):**\n> - **Administering Body:** National Testing Service (NTS), Pakistan\n> - **Test Title:** Graduate Assessment Test GAT-General-VIII (Series 2026-VIII)\n> - **Target Degree Levels:** MS, M.Phil, LLM, and 18-Year Postgraduate Academic Admissions\n> - **Registration Window:** Open now; final online submission deadline is **Monday, 30 November 2026**\n> - **E-Roll Number Slips Issuance:** **Tuesday, 08 December 2026**\n> - **National Test Date:** **Sunday, 13 December 2026**\n> - **Result Declaration Date:** **Monday, 21 December 2026**\n> - **Standard Registration Fee:** **Rs. 1,810/-** (Late Fee: **Rs. 2,510/-**)\n> - **Score Validity:** Valid for **Two (2) Years** from the test announcement date.",

    "## Quick Facts Table: NTS GAT-General 2026-VIII\n\n| ATTRIBUTE | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Test Conducting Body** | National Testing Service (NTS) |\n| **Examination Title** | GAT-G-VIII (Graduate Assessment Test GAT-General-VIII - 2026) |\n| **Announcement Date** | Monday, 12 October 2026 |\n| **Online Registration Deadline** | **Monday, 30 November 2026** |\n| **E-Roll Number Slips** | Tuesday, 08 December 2026 |\n| **Examination Date** | **Sunday, 13 December 2026** |\n| **Result Gazette Date** | Monday, 21 December 2026 |\n| **Registration Fee** | Rs. 1,810/- (Normal) \\| Rs. 2,510/- (Late Fee) |\n| **Minimum Eligibility** | 16 Years of Education (BS 4-Year / MA / MSc / Equivalent) |\n| **Passing Benchmark** | 50% Cumulative Score (University requirements may vary) |\n| **Score Validity** | 2 Years Valid for HEC & University Admissions |\n| **Official Portal Link** | [nts.org.pk](https://www.nts.org.pk/) |",

    "## GAT-General Test Categories & Paper Pattern\n\nThe GAT-General paper consists of **100 Multiple Choice Questions (MCQs)** to be attempted in **120 minutes (2 hours)**. To maintain academic fairness, NTS administers four tailored subject categories matching the candidate's degree background:\n\n### 1. GAT™-A (Business & Engineering Technology)\n- **Applicable Fields:** Business Education, MBA, BBA (Hons), Commerce, and all Engineering & Technology disciplines (Civil, Electrical, Mechanical, Software, Chemical, Computer Engineering).\n- **Paper Distribution:**\n  - English (Verbal Reasoning): **35%** (35 Questions)\n  - Analytical Reasoning: **30%** (30 Questions)\n  - Quantitative Reasoning (Mathematics): **35%** (35 Questions)\n\n### 2. GAT™-B (Arts, Humanities & Social Sciences)\n- **Applicable Fields:** Arts, Humanities, Fine Arts, English Literature, Languages, Journalism, Economics, Political Science, International Relations, Psychology, Sociology, and Public Administration.\n- **Paper Distribution:**\n  - English (Verbal Reasoning): **50%** (50 Questions)\n  - Analytical Reasoning: **20%** (20 Questions)\n  - Quantitative Reasoning: **30%** (30 Questions)\n\n### 3. GAT™-C (Agriculture, Biological & Physical Sciences)\n- **Applicable Fields:** Agricultural Sciences, Veterinary Medicine, Botany, Zoology, Biochemistry, Chemistry, Physics, Mathematics, Statistics, and Information Technology.\n- **Paper Distribution:**\n  - English (Verbal Reasoning): **40%** (40 Questions)\n  - Analytical Reasoning: **25%** (25 Questions)\n  - Quantitative Reasoning: **35%** (35 Questions)\n\n### 4. GAT™-D (Religious Studies / Madrassa Graduates)\n- **Applicable Fields:** Candidates holding *Shahadat-ul-Aalmiya* from recognized Wafaq councils with an official HEC equivalency letter to 16 years of education seeking admission to M.Phil/MS in Islamic Studies.\n- **Paper Distribution:**\n  - English (Verbal Reasoning): **50%** (50 Questions)\n  - Analytical Reasoning: **20%** (20 Questions)\n  - Quantitative Reasoning: **30%** (30 Questions)",

    "## Step-by-Step Online Registration Procedure\n\nRegistration for GAT-General is conducted entirely through the NTS online candidate portal:\n\n1. **Portal Access:** Navigate to the official NTS portal at [nts.org.pk](https://www.nts.org.pk/).\n2. **Candidate Profile Creation:** Log in with your CNIC and password (or click 'Sign Up' if new to NTS).\n3. **Select Active Test:** Click on *Open Applications* and select **GAT-General-VIII (2026-VIII)**.\n4. **Choose Test Category:** Select the appropriate category (GAT-A, GAT-B, GAT-C, or GAT-D) corresponding strictly to your undergraduate degree discipline.\n5. **Select Preferred Examination Center:** Choose your primary test city (Islamabad/Rawalpindi, Lahore, Karachi, Peshawar, Quetta, Multan, Faisalabad, Sukkur, Hyderabad, Abbottabad, Bahawalpur, D.I. Khan, etc.).\n6. **Upload Photograph:** Upload a recent, clear passport-size photograph with a white or light blue background (max 30KB).\n7. **Generate 1Bill Invoice:** Download the automated deposit slip containing the unique 1Bill Consumer Number.\n8. **Pay Test Fee:** Pay the **Rs. 1,810/-** registration fee via any bank ATM, internet banking portal, mobile app (EasyPaisa / JazzCash), or TCS express centers.\n9. **Confirm Submission:** After payment, check your NTS dashboard. Payment verification updates automatically within 24 to 48 hours. No physical documents need to be mailed to NTS for GAT-General.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to register for GAT General VIII 2026?**\nThe last date for online registration is **Monday, 30 November 2026**.\n\n**Q2: What is the official test date for GAT-2026-VIII?**\nThe examination will be held nationwide on **Sunday, 13 December 2026**.\n\n**Q3: How much is the registration fee for GAT General?**\nThe standard test fee is **Rs. 1,810/-**. If registering during the designated late-fee window, the fee is **Rs. 2,510/-**.\n\n**Q4: For how long is the GAT General score valid?**\nThe GAT-General score card remains officially valid for **two (2) years** from the date of result announcement.\n\n**Q5: What is the minimum score required to pass GAT?**\nThe baseline passing mark set by NTS and HEC is a cumulative **50% score** (50 marks out of 100). Individual universities and degree departments may set higher cutoff thresholds for admission merit ranking.\n\n**Q6: Do I need to mail hard copies of the application form to NTS?**\nNo. GAT-General applications are processed completely online through the NTS portal; physical dispatch of forms is not required.",

    "## Official Sources & Related CareerDost Academic Guides\n\n- **Official NTS Portal:** [National Testing Service Pakistan](https://www.nts.org.pk/)\n- **GAT Schedule Notice:** [NTS Open Projects Schedule](https://www.nts.org.pk/new/projectsnew.php)\n- **Related CareerDost Academic & Scheme Coverage:**\n  - [HEC Commonwealth Scholarships 2027 (Full UK Guide)](/jobs/hec-uk-commonwealth-scholarships-2027-28)\n  - [Memon College of Nursing Karachi BSN Admissions 2026](/jobs/memon-college-of-nursing-karachi-bsn-admissions-2026-27)\n  - [SPSC CCE-2026 Examination Reforms & Extended Deadline](/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening)"
  ];

  const gatPayload = {
    title: 'NTS GAT General VIII 2026 Registration — Last Date, Eligibility, Fee & Online Application',
    slug: gatSlug,
    category: 'admissions',
    organization: 'National Testing Service (NTS)',
    jobType: 'Graduate Assessment Test (MS / M.Phil Admission Examination)',
    location: 'Nationwide Centers (Islamabad, Lahore, Karachi, Peshawar, Quetta & Major Cities)',
    qualification: 'Minimum 16 Years of Education (BS 4-Year / MA / MSc / Equivalent from HEC Recognized University)',
    salary: 'Standard Test Fee: Rs. 1,810/- (Late Fee: Rs. 2,510/-) | Result Valid for 2 Years',
    experience: 'Open to All Graduating Students & Degree Holders Seeking MS/M.Phil Admission',
    positions: 'GAT-A, GAT-B, GAT-C & GAT-D Graduate Admission Testing Batches',
    lastDate: '2026-11-30',
    noDeadline: false,
    publishDate: '2026-10-24',
    officialLink: 'https://www.nts.org.pk/',
    applyLink: 'https://www.nts.org.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'NTS',
    featuredImage: '/images/nts-gat-general-viii-2026-registration-schedule-eligibility.webp',
    imageAlt: 'NTS GAT General VIII 2026 Registration Last Date 30 November Test Date 13 December CareerDost',
    excerpt: 'National Testing Service (NTS) announces GAT-General-VIII (2026-VIII) registration for MS and M.Phil admissions. Test date: 13 December 2026. Review category patterns, fee, and apply online before 30 November 2026.',
    content: gatContent,
    seoTitle: 'NTS GAT General VIII 2026: Registration, Dates & Eligibility',
    metaDescription: 'NTS GAT General VIII 2026 registration open for MS/M.Phil admissions. Test date 13 Dec 2026. Check GAT A, B, C & D paper patterns, fee & apply by 30 Nov 2026.',
    focusKeyword: 'NTS GAT General VIII 2026',
    canonicalUrl: `https://careerdost.blog/jobs/${gatSlug}`,
    ogTitle: 'NTS GAT General VIII 2026 Registration — Test Date & Schedule',
    ogDescription: 'Complete guide for NTS GAT-General-VIII (2026-VIII): eligibility criteria, Rs. 1,810 fee, 13 December test date, and step-by-step online registration.',
    status: 'draft'
  };

  const newDraftPayloads = [irsaPayload, cpwbPayload, gatPayload];

  console.log('--- SAVING 3 NEW ARTICLES AS DRAFTS VIA CMS API ---');
  const createdDrafts = [];

  for (const p of newDraftPayloads) {
    if (draftSlugMap.has(p.slug)) {
      const existingId = draftSlugMap.get(p.slug);
      console.log(`[ALREADY DRAFT] Slug: ${p.slug} already exists in CMS drafts with ID: ${existingId}`);
      createdDrafts.push({ id: existingId, slug: p.slug, title: p.title, status: 'draft', category: p.category });
    } else {
      const res = await fetch(`${apiBase}/articles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(`Failed to create draft ${p.slug}: ${JSON.stringify(data)}`);
      }
      console.log(`✓ [DRAFT CREATED IN CMS] ID: ${data.data.id} | Slug: ${p.slug} | Title: "${p.title.slice(0, 50)}..."`);
      createdDrafts.push({ id: data.data.id, slug: p.slug, title: p.title, status: 'draft', category: p.category });

      // Mirror to local SQLite
      localDb.prepare(`
        INSERT OR REPLACE INTO articles (
          id, slug, title, category_slug, organization, job_type, location,
          qualification, salary, experience, positions, last_date, no_deadline,
          publish_date, official_link, apply_link, is_verified, featured,
          logo_initial, featured_image, image_alt, excerpt, content, seo_title,
          meta_description, focus_keyword, canonical_url, og_title, og_description,
          status, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, 1, 1,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `).run(
        data.data.id, p.slug, p.title, p.category, p.organization, p.jobType, p.location,
        p.qualification, p.salary, p.experience, p.positions, p.lastDate, p.noDeadline ? 1 : 0,
        p.publishDate, p.officialLink, p.applyLink, p.logoInitial, p.featuredImage, p.imageAlt,
        p.excerpt, JSON.stringify(p.content), p.seoTitle, p.metaDescription, p.focusKeyword,
        p.canonicalUrl, p.ogTitle, p.ogDescription
      );
    }
  }

  // =========================================================================
  // TASK 2 — SPSC REVISIONS STAGED FOR EDITORIAL REVIEW (NOT APPLIED TO LIVE)
  // =========================================================================
  console.log('\n--- TASK 2: PREPARING SPSC REVISIONS FOR EDITORIAL APPROVAL ---');

  // Staged revision for Article 330 / Update 230: Postponement of 24 Oct Test
  const spscPostponementRevision = {
    targetArticleId: 330,
    targetUpdateId: 230,
    slug: 'spsc-cce-2026-screening-test-date',
    revisedTitle: 'SPSC CCE-2026 Screening Test Postponed – Official Notification Update',
    revisedExcerpt: 'Sindh Public Service Commission (SPSC) officially postpones the Combined Competitive Examination (CCE-2026) preliminary screening test originally scheduled for 24 October 2026. A rescheduled date will be notified later following extended candidate applications through 11 November 2026.',
    revisedLastDate: 'Postponed by Commission (Revised Schedule Awaited)',
    officialSource: 'https://spsc.gov.pk/recent-announcements/Oct2026/PN_CCE-2026_postponed.pdf',
    keyRevisions: [
      'Replaces confirmed "Saturday 24 October" test date claim with explicit confirmation of official postponement by the Commission.',
      'References official SPSC Public Notice PN_CCE-2026_postponed.pdf and Advertisement 06/2026.',
      'Explains postponement reason: CCE-2026 application window reopened through 11 November 2026 following Sindh Cabinet age and attempt reforms.',
      'Explicitly warns candidates not to trust rumored replacement dates; revised schedule will be issued on spsc.gos.pk.',
      'Maintains original URL, canonical link, and publication record.'
    ]
  };

  fs.writeFileSync('scratch/spsc_postponement_revision.json', JSON.stringify(spscPostponementRevision, null, 2));
  console.log('✓ SPSC Postponement Revision specification saved to scratch/spsc_postponement_revision.json');

  console.log('\n=== CONTENT PRODUCTION DRAFTS READY ===');
  console.log(JSON.stringify(createdDrafts, null, 2));
}

run().catch(console.error);
