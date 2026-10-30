const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

console.log('=== Saving October 22 Batch Drafts to careerdost.sqlite ===');

// 1. Update Askari Bank Draft (ID: 512)
const askariTitle = 'Askari Bank Jobs October 2026: Analyst Payment Screening & e-KYC, Operations & Branch Roles';
const askariExcerpt = 'Askari Bank Limited has expanded its October 2026 recruitment drive with a new vacancy for Analyst Payment Screening & e-KYC (Job ID 18466) at its Karachi Operations Group, alongside Branch Manager and Operations roles. Review verified requirements, AML/CFT screening duties, and official portal application guidance.';
const askariContent = JSON.stringify([
  "# Askari Bank Jobs October 2026: Analyst Payment Screening & e-KYC, Operations & Branch Roles",
  "## Executive Summary & Official Recruitment Verification\n\n**Askari Bank Limited**, one of Pakistan's premier scheduled commercial banking institutions, has expanded its ongoing October 2026 recruitment drive by announcing a critical technical compliance and operations vacancy: **Analyst Payment Screening & e-KYC (Job ID: 18466)** based at its **Karachi Operations Group**.\n\nVerified directly on the official [Askari Bank Careers Portal](https://careers.askaribank.com.pk/) on 22 October 2026, this role joins existing open vacancies across Karachi including Branch Manager (Job ID: 18419), Senior Officer CAD Operations (Job ID: 18430), and Officer Branch Operations (Job ID: 18220).",
  "## Quick Facts Table\n\n| Attribute | Verified Official Detail |\n|---|---|\n| **Hiring Institution** | Askari Bank Limited |\n| **Newly Added Position** | **Analyst Payment Screening & e-KYC (Job ID: 18466)** |\n| **Existing Active Roles** | Branch Manager, Sr. Officer CAD Operations, Officer Branch Operations |\n| **Job Location** | Karachi, Sindh (Head Office / Operations Group) |\n| **Business Unit** | Operations Transformation & IT |\n| **Employment Type** | Full-Time, Permanent (Officer / Senior Officer Scale) |\n| **Posting Date** | 21 October 2026 |\n| **Application Deadline** | **Rolling Intake (Apply Promptly via Official Portal)** |\n| **Minimum Education** | Bachelor's / Master's degree (16 years education in Business, Finance, Banking, or IT/CS) |\n| **Experience Required** | 1 to 3 Years in Payment Operations, AML/CFT Screening, or Compliance |\n| **Official Portal Link** | [careers.askaribank.com.pk](https://careers.askaribank.com.pk/) |",
  "## Detailed Job Profile: Analyst Payment Screening & e-KYC (Job ID: 18466)\n\n### Core Departmental Mandate\nOperating within the **Operations Transformation & IT** wing under the Operations Group, the Analyst Payment Screening & e-KYC plays a frontline role in shielding the bank from financial crime, sanctions breaches, and regulatory non-compliance. The analyst operates sophisticated real-time transaction screening systems to inspect payment messages originating from or terminating in Askari Bank branches and digital endpoints.",
  "### Key Responsibilities & Daily Functions\n1. **Real-Time Payment Filtering:** Screening incoming and outgoing financial transactions across real-time settlement rails (Raast, RTGS/PRISM, 1Link, and international SWIFT MT/MX messages) against updated sanctions databases.\n2. **Sanctions & PEP Adjudication:** Reviewing automated alerts against United Nations Security Council (UNSC), National Counter Terrorism Authority (NACTA), OFAC, and local Politically Exposed Persons (PEP) watchlists.\n3. **e-KYC & Digital Onboarding Audit:** Validating electronic Know Your Customer (e-KYC) data and digital customer onboarding profiles in strict adherence to State Bank of Pakistan (SBP) AML/CFT/CPF operational guidelines.\n4. **False Positive Disposition & Escalation:** Conducting root-cause investigation of system alert hits, documenting rationale for false positives, and promptly escalating genuine suspicious hits to the Compliance & Anti-Financial Crime (AFC) Division.\n5. **Regulatory Alignment & Audit Trail:** Maintaining comprehensive electronic logs of all screening decisions to support internal inspection, external statutory audit, and SBP regulatory reviews.",
  "### Eligibility & Candidate Requirements\n- **Education:** Bachelor's or Master's degree (14 to 16 years of education) in Banking & Finance, Business Administration (BBA/MBA), Commerce, Economics, or Computer Science / Information Systems from an HEC-recognized institution.\n- **Experience:** Minimum 1 to 3 years of demonstrated experience in commercial banking operations, payment screening, transaction monitoring, or AML compliance units.\n- **Technical Skills:** Familiarity with SBP AML/CFT regulations, core banking screening filters, Raast protocol basics, Excel analysis, and compliance audit procedures.",
  "## Step-by-Step Official Application Instructions\n1. Visit the official Askari Bank recruitment portal: [careers.askaribank.com.pk](https://careers.askaribank.com.pk/).\n2. Navigate to 'Job Search' and enter **Job ID: 18466** or filter by Location: 'Karachi'.\n3. Click on **Analyst Payment Screening & e-KYC** to open the full job specification.\n4. Click 'Apply Now' and log in to your Askari Bank candidate account (or register a new profile).\n5. Complete your academic details, employment history, CNIC, and upload an updated CV.\n6. Submit your application online before the intake closes.",
  "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the application deadline for Job ID 18466?**\nAskari Bank processes applications on a rolling intake basis. Candidates are advised to apply promptly through the official careers portal.\n\n**Q2: Is this role open to fresh graduates?**\nThe Analyst Payment Screening role requires 1 to 3 years of prior experience in payment operations, AML screening, or banking compliance.\n\n**Q3: Where is the job located?**\nThe position is based in Karachi, Sindh at the bank's Operations Transformation & IT department."
]);

db.prepare(`
  UPDATE articles SET
    title = ?,
    excerpt = ?,
    content = ?,
    seo_title = ?,
    meta_description = ?,
    status = 'draft',
    updated_at = ?
  WHERE id = 512
`).run(
  askariTitle,
  askariExcerpt,
  askariContent,
  'Askari Bank Jobs October 2026: Analyst Payment Screening & e-KYC Karachi',
  'Askari Bank Karachi jobs October 2026 for Analyst Payment Screening & e-KYC (Job ID 18466). Check verified requirements, AML/CFT screening duties, and apply online.',
  new Date().toISOString()
);
console.log('✓ Updated Askari Bank Draft (ID: 512)');

// 2. Insert EDB Jobs Draft (ID: 518)
const edbTitle = 'Engineering Development Board Jobs 2026 — Apply Online for IT, Accounts & Other Government Vacancies';
const edbExcerpt = 'Engineering Development Board (EDB), Ministry of Industries & Production, invites online applications on the National Job Portal (NJP) for IT Specialist, Accounts/Audit Analyst, Procurement Analyst, and M&E Assistant under the PAVE program. Deadline: 26 October 2026.';
const edbContent = JSON.stringify([
  "# Engineering Development Board Jobs 2026 — Apply Online for IT, Accounts & Other Government Vacancies",
  "## Executive Summary & Official Recruitment Notice\n\nThe **Engineering Development Board (EDB)**, an apex technical organization operating under the **Ministry of Industries and Production, Government of Pakistan**, has officially announced contractual professional vacancies under the **Pakistan Accelerated Vehicle Electrification (PAVE) Program**.\n\nVerified directly on the official **National Job Portal (NJP)** on 22 October 2026, the positions offer attractive **Project Pay Scales (PPS-05 to PPS-08)** and seek qualified professionals in information technology, accounting, public procurement, and project monitoring. The online application window is open until **26 October 2026**.",
  "## Quick Facts Table\n\n| Attribute | Verified Official Detail |\n|---|---|\n| **Recruiting Organization** | Engineering Development Board (EDB) |\n| **Ministry** | Ministry of Industries & Production, Government of Pakistan |\n| **Project Name** | Pakistan Accelerated Vehicle Electrification (PAVE) Program |\n| **Application Portal** | National Job Portal ([njp.gov.pk](https://njp.gov.pk)) |\n| **Application Deadline** | **Monday, 26 October 2026** |\n| **Job Placement** | Islamabad (Open Merit) |\n| **Key Vacancies** | IT Specialist, Accounts/Audit Analyst, Procurement/Contracts Analyst, M&E Assistant |\n| **Pay Scales** | Project Pay Scales (PPS-05, PPS-07, PPS-08) |\n| **Official Application Mode** | Strictly Online via NJP (No postal documents at this stage) |",
  "## Position-by-Position Vacancies & Eligibility Breakdown\n\n### 1. Information Technology (IT) Specialist (PPS-08)\n- **Vacancies:** 1 Post\n- **Educational Qualification:** Minimum 16 years of education in Computer Science, Software Engineering, Information Technology, or a related field from an HEC-recognized university.\n- **Professional Experience:** 4 to 7 years of post-qualification experience in enterprise MIS development, database management, cloud systems, and portal administration.\n- **Age Limit:** 25 to 50 Years.\n\n### 2. Accounts / Audit Analyst (PPS-07)\n- **Vacancies:** 1 Post\n- **Educational Qualification:** Minimum 16 years of education in Accounting & Finance, MBA (Finance), M.Com, CA Inter, or ACCA.\n- **Professional Experience:** 2 to 5 years of relevant public or private sector experience in financial reconciliation, budgetary accounting, and audit compliance.\n- **Age Limit:** 25 to 45 Years.\n\n### 3. Procurement / Contracts Analyst (PPS-07)\n- **Vacancies:** 1 Post\n- **Educational Qualification:** Minimum 16 years of education in Business Administration, Supply Chain Management, Engineering, Law, or relevant discipline.\n- **Professional Experience:** 2 to 5 years of demonstrated experience in public procurement lifecycle, PPRA rules, bidding document drafting, and contract monitoring.\n- **Age Limit:** 25 to 45 Years.\n\n### 4. Monitoring & Evaluation (M&E) Assistant (PPS-05/06)\n- **Vacancies:** 1 Post\n- **Educational Qualification:** Minimum Intermediate (FA/FSc) or Bachelor's degree with strong computer literacy and office software skills.\n- **Professional Experience:** 1 to 3 years of experience in project documentation, progress data entry, and record management.\n- **Age Limit:** 25 to 45 Years.",
  "## Step-by-Step Online Application Guide (NJP)\n1. Visit the National Job Portal: [njp.gov.pk](https://njp.gov.pk).\n2. Search for **Engineering Development Board** under employer listings.\n3. Select the desired position and click 'View Details'.\n4. Log in to your NJP profile or create a new account with your CNIC and mobile number.\n5. Fill out all sections: Personal Profile, Education, Experience, and Skills.\n6. Review and submit your online application before **26 October 2026**.\n7. Keep a copy of your submitted application tracking number for future reference.",
  "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for EDB jobs?**\nThe last date for online application submission on NJP is **26 October 2026**.\n\n**Q2: Do I need to send hard copies of my documents?**\nNo. The application process is entirely online through njp.gov.pk. Hard copies are only required if shortlisted for interview.\n\n**Q3: Where will the appointed candidates be posted?**\nAll positions are based at the EDB project office in Islamabad."
]);

db.prepare(`
  INSERT OR REPLACE INTO articles (
    id, slug, title, category_slug, organization, job_type, location,
    qualification, salary, last_date, publish_date, official_link,
    featured, logo_initial, excerpt, content, seo_title, meta_description,
    status, created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?
  )
`).run(
  518,
  'engineering-development-board-jobs-october-2026',
  edbTitle,
  'government-jobs',
  'Engineering Development Board (EDB)',
  'Contract (PPS-05 to PPS-08)',
  'Islamabad, Pakistan',
  "Intermediate to Master's / CA / ACCA",
  'Project Pay Scale (PPS-05 to PPS-08)',
  '2026-10-26',
  '2026-10-22',
  'https://njp.gov.pk',
  1,
  'E',
  edbExcerpt,
  edbContent,
  'Engineering Development Board Jobs 2026: Apply Online via NJP',
  'Engineering Development Board (EDB) government jobs October 2026 for IT Specialist, Accounts Analyst, and Procurement Analyst on NJP. Apply by 26 October 2026.',
  'draft',
  new Date().toISOString(),
  new Date().toISOString()
);
console.log('✓ Inserted EDB Jobs Draft (ID: 518)');

// 3. Insert PSEB Jobs Draft (ID: 519)
const psebTitle = 'PSEB Jobs 2026 — Pakistan Software Export Board Government IT Vacancies';
const psebExcerpt = 'Pakistan Software Export Board (PSEB), Ministry of IT & Telecom, invites online applications via National Job Portal (NJP) for APM HR Skills, Research Consultant, and APO HR Skills (PPS-07/08). Review verified qualifications, experience mandates, and apply by 25 October 2026.';
const psebContent = JSON.stringify([
  "# PSEB Jobs 2026 — Pakistan Software Export Board Government IT Vacancies",
  "## Executive Summary & Official Recruitment Notice\n\nThe **Pakistan Software Export Board (PSEB)**, an apex body under the **Ministry of Information Technology and Telecommunication (MoITT), Government of Pakistan**, has advertised specialized professional vacancies on the **National Job Portal (NJP)**.\n\nVerified directly on official government portals on 22 October 2026, the positions offer competitive **Project Pay Scales (PPS-07 and PPS-08)** in Islamabad, aimed at accelerating national IT human resource development, industry skills programs, and software export research. The closing date for online applications is **25 October 2026**.",
  "## Quick Facts Table\n\n| Attribute | Verified Official Detail |\n|---|---|\n| **Hiring Organization** | Pakistan Software Export Board (PSEB) |\n| **Ministry** | Ministry of Information Technology & Telecommunication (MoITT) |\n| **Official Application Portal** | National Job Portal ([njp.gov.pk](https://njp.gov.pk)) |\n| **Application Deadline** | **Sunday, 25 October 2026** |\n| **Duty Location** | Islamabad, Pakistan |\n| **Advertised Posts** | APM HR Skills (2 Posts), Research Consultant (1 Post), APO HR Skills (1 Post) |\n| **Pay Scales** | PPS-07 & PPS-08 (Market-competitive Project Pay Scales) |\n| **Experience Requirement** | **Mandatory 2 to 6 Years Experience (Not for Fresh Graduates)** |",
  "> [!IMPORTANT]\n> **Critical Candidate Notice: Experience Mandates**\n> All advertised PSEB positions require prior post-qualification professional experience ranging from **2 to 6 years**. Candidates are advised that these are specialized mid-level project roles and **are not suitable for fresh graduates** without documented experience.",
  "## Position-by-Position Vacancies & Eligibility Breakdown\n\n### 1. Assistant Program Manager (APM) HR Skills (PPS-08)\n- **Number of Vacancies:** 2 Posts\n- **Educational Qualification:** Minimum 16 years of education from an HEC-recognized university in Management Sciences, Human Resource Management, Business Administration, Computer Science, or Information Technology.\n- **Experience Requirement:** **Minimum 4 years** of relevant post-qualification experience in IT workforce development, technical skills training programs, or public sector project management.\n- **Age Limit:** Up to 45 Years.\n\n### 2. Research Consultant (PPS-08)\n- **Number of Vacancies:** 1 Post\n- **Educational Qualification:** Minimum 16 years of education in Economics, Management Sciences, Research, Public Policy, or Business Administration.\n- **Experience Requirement:** **Minimum 6 years** of demonstrated professional experience in economic and sectoral research, IT industry market analysis, policy brief formulation, and data evaluation.\n- **Age Limit:** Up to 50 Years.\n\n### 3. Assistant Program Officer (APO) HR Skills (PPS-07)\n- **Number of Vacancies:** 1 Post\n- **Educational Qualification:** Minimum 16 years of education in Management Sciences, Human Resource, Business Administration, Computer Science, or IT.\n- **Experience Requirement:** **Minimum 2 years** of professional experience in project administration, training coordination, and record management.\n- **Age Limit:** Up to 40 Years.",
  "## How to Apply Online via National Job Portal (NJP)\n1. Go to the official portal: [njp.gov.pk](https://njp.gov.pk).\n2. Search for 'Pakistan Software Export Board' in the Organization field.\n3. Open the job listing of your choice and verify eligibility.\n4. Log in or create an NJP profile with complete educational and employment records.\n5. Submit your application online before **25 October 2026**.\n6. No manual or paper applications will be entertained by PSEB.",
  "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the application deadline for PSEB jobs?**\nThe deadline to apply online through NJP is **25 October 2026**.\n\n**Q2: Can fresh graduates apply for these positions?**\nNo. All three positions require documented post-qualification experience (between 2 and 6 years) in relevant domains.\n\n**Q3: Where is the place of posting?**\nAll appointed candidates will be posted in Islamabad."
]);

db.prepare(`
  INSERT OR REPLACE INTO articles (
    id, slug, title, category_slug, organization, job_type, location,
    qualification, salary, last_date, publish_date, official_link,
    featured, logo_initial, excerpt, content, seo_title, meta_description,
    status, created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?
  )
`).run(
  519,
  'pseb-government-it-jobs-october-2026',
  psebTitle,
  'government-jobs',
  'Pakistan Software Export Board (PSEB)',
  'Contract (PPS-07 / PPS-08)',
  'Islamabad, Pakistan',
  '16 Years Education (BS/BBA/MS) + 2–6 Yrs Exp',
  'Project Pay Scale (PPS-07 / PPS-08)',
  '2026-10-25',
  '2026-10-22',
  'https://njp.gov.pk',
  1,
  'P',
  psebExcerpt,
  psebContent,
  'PSEB Jobs 2026: Pakistan Software Export Board IT Vacancies NJP',
  'Pakistan Software Export Board (PSEB) government IT jobs October 2026 for APM HR Skills, Research Consultant, and APO on NJP. Apply by 25 October 2026.',
  'draft',
  new Date().toISOString(),
  new Date().toISOString()
);
console.log('✓ Inserted PSEB Jobs Draft (ID: 519)');

// 4. Insert Sindh High Court Test Daily Update Draft (ID: 389)
const shcTitle = 'Sindh High Court Personal Assistant Shorthand Test Schedule 2026 — 24 October Reporting Details';
const shcShortDesc = "High Court of Sindh, Karachi has announced the shorthand test schedule for 195 shortlisted candidates for Personal Assistant (BPS-17) on Saturday, 24 October 2026 at Justice Sabihuddin Block. Review reporting time, roll number rules, and mandatory instructions.";
const shcContent = JSON.stringify([
  "# Sindh High Court Personal Assistant Shorthand Test Schedule 2026 — 24 October Reporting Details",
  "## Official Recruitment Test Notice: High Court of Sindh, Karachi\n\nThe **High Court of Sindh, Principal Seat, Karachi**, has officially issued the schedule and instructions for the **Shorthand Test** for recruitment to the posts of **Personal Assistant to Judge / Personal Assistant to Officer (BPS-17)**.\n\nVerified directly on the official [Sindh High Court Jobs Portal](https://sindhhighcourt.gov.pk/jobs.php) on 22 October 2026, this test is organized for **195 shortlisted candidates** who successfully passed the initial MCQs-based screening examination conducted by **SIBA Testing Services (STS)**.",
  "## Quick Facts & Schedule Table\n\n| Attribute | Verified Official Detail |\n|---|---|\n| **Testing Authority** | High Court of Sindh, Principal Seat, Karachi |\n| **Position** | Personal Assistant to Judge / Officer (BPS-17) |\n| **Test Type** | Shorthand / Dictation Speed Test |\n| **Shortlisted Candidates** | **195 Candidates (STS Qualifiers)** |\n| **Test Date** | **Saturday, 24 October 2026** |\n| **Reporting Time** | **09:00 AM Sharp** |\n| **Test Commences** | **10:00 AM Sharp (Entry strictly closed after 10:00 AM)** |\n| **Test Venue** | **Hon'ble Mr. Justice Sabihuddin Block, High Court of Sindh, Principal Seat, Karachi** |\n| **Official Notice URL** | [sindhhighcourt.gov.pk/jobs.php](https://sindhhighcourt.gov.pk/jobs.php) |",
  "> [!CAUTION]\n> **Strict Entry Cutoff at 10:00 AM**\n> As per the official notification, candidate reporting starts at **09:00 AM**. No candidate will be allowed to enter the examination hall after the test begins at **10:00 AM** under any circumstances.",
  "## Mandatory Candidate Instructions & Document Checklist\n\n1. **Original Photo Identity Document:** Candidates must produce an **original, valid Computerized National Identity Card (CNIC)**, original Passport, or original valid Driving License at the entry gate. Photocopied or soft copies will not be accepted.\n2. **Roll Number Clarification:** The **Serial Number (Sr. No.)** allocated in the final result list of the MCQs test issued by STS serves as the candidate's Roll Number for this shorthand test. This number must be written accurately on the test copy.\n3. **Stationery & Clipboards:** Candidates must bring their own hard writing clipboards, lead pencils, sharpener, and ballpoint pens. Official test paper copies will be supplied by the Court.\n4. **Electronic Devices Strictly Prohibited:** Mobile phones, smartwatches, recording devices, Bluetooth earphones, and calculators are strictly banned inside the test premises. Possession of any electronic gadget will result in immediate disqualification and legal proceedings.",
  "## Frequently Asked Questions (FAQs)\n\n**Q1: Where will the shorthand test take place?**\nAt Hon'ble Mr. Justice Sabihuddin Block, High Court of Sindh, Principal Seat, Court Road, Karachi.\n\n**Q2: What is the reporting time on 24 October 2026?**\nCandidates must report at 09:00 AM. The test starts at 10:00 AM sharp.\n\n**Q3: How many candidates are called for this shorthand test?**\nA total of 195 candidates who qualified the STS screening test have been called."
]);

db.prepare(`
  INSERT OR REPLACE INTO daily_updates (
    id, slug, title, category, short_description, content,
    featured_image, image_alt, official_link, apply_link,
    deadline, publish_date, seo_title, meta_description,
    status, created_at, updated_at, organization, location,
    qualification, experience, positions, job_type, salary,
    is_verified, focus_keyword, canonical_url, og_title, og_description,
    no_deadline, featured
  ) VALUES (
    389, 'sindh-high-court-personal-assistant-shorthand-test-2026', ?, 'results', ?, ?,
    '/images/sindh-high-court-personal-assistant-shorthand-test-2026.webp', 'Sindh High Court Personal Assistant Shorthand Test Schedule 2026 CareerDost',
    'https://sindhhighcourt.gov.pk/jobs.php', 'https://sindhhighcourt.gov.pk/jobs.php',
    '2026-10-24', '2026-10-22', ?, ?,
    'draft', ?, ?, 'High Court of Sindh, Karachi', 'Karachi, Sindh',
    'Graduation + Shorthand (STS Qualifiers)', 'Shortlisted Candidates', 'Personal Assistant (BPS-17)',
    'Recruitment Test Schedule', 'BPS-17 Scale', 1, 'Sindh High Court Personal Assistant Shorthand Test',
    'https://careerdost.blog/daily-updates/sindh-high-court-personal-assistant-shorthand-test-2026',
    'Sindh High Court Personal Assistant Shorthand Test Schedule 2026',
    'Sindh High Court Karachi Personal Assistant (BPS-17) shorthand test on 24 October 2026 for 195 candidates. Check venue and reporting rules.',
    0, 1
  )
`).run(
  shcTitle,
  shcShortDesc,
  shcContent,
  'Sindh High Court Personal Assistant Shorthand Test Schedule 2026',
  'Sindh High Court Karachi Personal Assistant (BPS-17) shorthand test on 24 October 2026 for 195 candidates. Check venue, reporting time, and roll number rules.',
  new Date().toISOString(),
  new Date().toISOString()
);
console.log('✓ Inserted Sindh High Court Daily Update Draft (ID: 389)');

console.log('\nAll drafts successfully saved in careerdost.sqlite with status = draft!');
