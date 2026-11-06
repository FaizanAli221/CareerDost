const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('careerdost.sqlite');

const articleData = {
  id: 585,
  slug: "economic-affairs-division-jobs-balochistan-2026",
  title: "Economic Affairs Division Jobs 2026: Balochistan Quota Vacancies in Islamabad",
  category_slug: "government-jobs",
  organization: "Economic Affairs Division, Ministry of Economic Affairs",
  job_type: "Regular (Federal Government)",
  location: "Islamabad, Pakistan (Balochistan Quota)",
  qualification: "Primary, Matriculation, Intermediate, Graduation (Bachelor's Degree)",
  salary: "BPS-01 to BPS-15 (Standard Federal Pay Scales: Rs. 28,000 – Rs. 75,000 / Month + Allowances)",
  last_date: "2026-11-18",
  publish_date: "2026-11-06",
  official_link: "https://www.ead.gov.pk",
  apply_link: "https://www.njp.gov.pk",
  featured: 1,
  is_verified: 1,
  logo_initial: "EAD",
  positions: "6 Posts",
  experience: "Fresh to 2 Years (Post-qualification typing/shorthand skills required for clerical cadres)",
  no_deadline: 0,
  focus_keyword: "Economic Affairs Division Jobs 2026 Balochistan",
  seo_title: "Economic Affairs Division Jobs 2026 (Balochistan Quota) — CareerDost",
  meta_description: "Economic Affairs Division Jobs 2026 in Islamabad announced under 6% Balochistan Quota for Assistant (BPS-15), Stenotypist (BPS-14), UDC, LDC & Naib Qasid. Apply via NJP by 18 Nov.",
  canonical_url: "https://careerdost.blog/jobs/economic-affairs-division-jobs-balochistan-2026",
  og_title: "Economic Affairs Division Jobs 2026 — Balochistan Quota (Islamabad)",
  og_description: "Ministry of Economic Affairs announces regular vacancies under 6% Balochistan Quota in Islamabad. Complete eligibility, age relaxation, and NJP online apply guide.",
  featured_image: "/images/economic-affairs-division-jobs-balochistan-2026.webp",
  image_alt: "Economic Affairs Division Jobs 2026 Balochistan Quota Islamabad Official Recruitment Guide CareerDost",
  status: "published",
  excerpt: "The Ministry of Economic Affairs (Economic Affairs Division), Islamabad has announced regular federal jobs under the 6% Balochistan Quota for Assistant (BPS-15), Stenotypist (BPS-14), UDC (BPS-13), LDC (BPS-11), and Naib Qasid (BPS-01). Apply online via the National Job Portal (njp.gov.pk) by 18 November 2026."
};

const content = [
  "# Economic Affairs Division Jobs 2026: Balochistan Quota Vacancies in Islamabad (Apply Online via NJP)",
  "## Executive Summary & Official Federal Recruitment Notice\n\nThe **Ministry of Economic Affairs (Economic Affairs Division)**, Government of Pakistan, has officially announced regular public sector vacancies specifically designated for candidates possessing a valid **Balochistan Domicile** against the constitutional **6% Provincial Quota**.\n\nAll advertised positions are stationed at the Federal Secretariat in **Islamabad**, offering permanent career pathways under standard federal government service terms. The advertised cadres span administrative, secretarial, clerical, and support roles ranging from **BPS-01 up to BPS-15**, including **Assistant (BPS-15)**, **Stenotypist (BPS-14)**, **Upper Division Clerk (UDC, BPS-13)**, **Lower Division Clerk (LDC, BPS-11)**, and **Naib Qasid (BPS-01)**.\n\nIn accordance with federal recruitment standards, eligible male, female, and transgender candidates from Balochistan must submit their applications exclusively through the official **National Job Portal (NJP)** at [njp.gov.pk](https://www.njp.gov.pk). No manual, postal, or courier submissions are accepted at this initial stage.",
  "> [!IMPORTANT]\n> **Balochistan Provincial Quota Exclusivity:**\n> These vacancies are strictly reserved for candidates holding a verifiable **Domicile and Permanent Residence Certificate (PRC / Form D)** from any district of **Balochistan province**. Applicants holding domiciles from Punjab, Sindh, Khyber Pakhtunkhwa, Gilgit-Baltistan, AJK, or the Federal Capital are not eligible for this specific recruitment drive.",
  "## Job Overview & Summary Details\n\n| Parameter | Official Details |\n| :--- | :--- |\n| **Hiring Department** | Economic Affairs Division (EAD) |\n| **Ministry** | Ministry of Economic Affairs, Government of Pakistan |\n| **Recruitment Category** | Federal Government Regular Employment (Civil Service) |\n| **Total Vacancies** | 06 Positions (All Cadres) |\n| **Designated Quota** | 6% Balochistan Regional Quota (Merit across Balochistan) |\n| **Duty Station / Location** | Islamabad (Secretariat Block C), Pakistan |\n| **Basic Pay Scales (BPS)** | BPS-01 to BPS-15 |\n| **Gender Eligibility** | Male, Female, and Transgender candidates |\n| **Application Mode** | 100% Online via National Job Portal ([njp.gov.pk](https://www.njp.gov.pk)) |\n| **Application Fee** | Rs. 0 (Free of Cost on National Job Portal) |\n| **Official Notice Date** | 29–30 October 2026 |\n| **Closing / Last Date** | **15 November 2026** (EAD Gazette 15-day timeline) / **18 November 2026** (NJP Active Portal Deadline) |",
  "## Detailed Vacancy Breakdown & Eligibility Criteria\n\nThe Economic Affairs Division has advertised 6 vacancies across 5 distinct cadres. Below is the complete eligibility criteria, minimum educational qualifications, required technical proficiencies, and age ceilings for each post:",
  "### 1. Assistant (BPS-15) — 01 Post\n- **Number of Vacancies:** 01 (Balochistan Quota — Merit)\n- **Educational Qualification:** Bachelor's Degree (Graduate — BA, BSc, BCom, BBA, BS 14–16 Years) from a recognized university chartered by the Higher Education Commission (HEC).\n- **Technical Proficiency:** Computer literacy (familiarity with word processing and spreadsheets) is preferable.\n- **Mandatory Training:** Selected candidates must successfully undertake a mandatory **6-week Basic IT Training Course** (including MS Office) conducted by the **National Information Technology Board (NITB)** before completion of their probationary period.\n- **Age Limit:** 18 to 28 Years (+ 5 Years General Federal Age Relaxation = **33 Years maximum**).",
  "### 2. Stenotypist (BPS-14) — 02 Posts\n- **Number of Vacancies:** 02 (Balochistan Quota — Merit)\n- **Educational Qualification:** Intermediate (Higher Secondary School Certificate — FA, F.Sc, I.Com, ICS, or equivalent from an accredited BISE board).\n- **Shorthand & Typing Standards:**\n  - Minimum shorthand speed: **80 words per minute (w.p.m.)**\n  - Minimum computer typing speed: **40 words per minute (w.p.m.)**\n- **Technical Proficiency:** Must be computer literate (MS Word, Windows navigation, English clerical drafting).\n- **Age Limit:** 18 to 25 Years (+ 5 Years General Federal Age Relaxation = **30 Years maximum**).",
  "### 3. Upper Division Clerk / UDC (BPS-13) — 01 Post\n- **Number of Vacancies:** 01 (Balochistan Quota — Merit)\n- **Educational Qualification:** Intermediate (FA / F.Sc / I.Com / ICS or equivalent 12 years of education).\n- **Mandatory Training:** Selected candidates must complete a **3-week Basic IT Training Course** (including MS Office) conducted by NITB prior to confirmation of service.\n- **Age Limit:** 18 to 25 Years (+ 5 Years General Federal Age Relaxation = **30 Years maximum**).",
  "### 4. Lower Division Clerk / LDC (BPS-11) — 01 Post\n- **Number of Vacancies:** 01 (Balochistan Quota — Merit)\n- **Educational Qualification:** Matriculation (Secondary School Certificate — SSC) from a recognized Board of Intermediate and Secondary Education.\n- **Typing Standard:** Minimum typing speed of **30 words per minute (w.p.m.)** on a standard computer keyboard.\n- **Mandatory Training:** Selected candidates must complete a **3-week Basic IT Training Course** (including MS Office) conducted by NITB prior to confirmation of service.\n- **Age Limit:** 18 to 25 Years (+ 5 Years General Federal Age Relaxation = **30 Years maximum**).",
  "### 5. Naib Qasid (BPS-01) — 01 Post\n- **Number of Vacancies:** 01 (Balochistan Quota — Merit)\n- **Educational Qualification:** Primary School Certificate pass (Class 5).\n- **Physical & Mental Fitness:** Good physical stamina, punctuality, and ability to deliver office dispatch and internal files.\n- **Age Limit:** 18 to 25 Years (+ 5 Years General Federal Age Relaxation = **30 Years maximum**).",
  "## Federal Government Age Relaxation Guidelines\n\nAll advertised posts include the general 5-year age relaxation granted by the Federal Government across the board under the *Initial Appointment to Civil Posts (Relaxation of Upper Age Limit) Rules, 1993*. Furthermore, candidates entitled to regional or special relaxations can claim the following cumulative benefits:\n\n1. **General Relaxation:** 05 years automatically applied to all candidates.\n2. **Recognized Tribes of Balochistan & Backward Areas:** 03 years additional upper age relaxation for candidates belonging to Scheduled Castes, Buddhist Community, recognized tribes of Tribal Areas, Azad Kashmir, Northern Areas, and Balochistan.\n3. **Disabled Candidates:** 10 years upper age relaxation upon presenting a valid Disability Certificate issued by the National Council for the Rehabilitation of Disabled Persons (NCRDP) or provincial social welfare boards.\n4. **In-Service Government Employees:** Up to 10 years relaxation (capped at age 55) for regular civil servants who have completed a minimum of 2 years continuous government service on the closing date.\n5. **Retired/Released Armed Forces Personnel:** 15 years or the number of years actually served in the Armed Forces of Pakistan, whichever is less.\n6. **Deceased Civil Servants' Children:** 05 years upper age relaxation for the child/widow of a federal civil servant who died while serving.",
  "> [!TIP]\n> Where a candidate is eligible for age relaxation under more than one clause above, they are entitled only to the single relaxation that is most beneficial to them, in addition to the 5-year general federal grant.",
  "## Domicile & District Verification Standards for Balochistan\n\nTo ensure transparency and equitable representation for Balochistan youth, the Economic Affairs Division enforces strict domicile authenticity rules:\n\n- **Authentic Documents:** Applicants must possess an original Domicile Certificate and Permanent Residence Certificate (Form D) issued by the relevant Deputy Commissioner (DC) or District Magistrate in Balochistan (e.g., Quetta, Gwadar, Khuzdar, Turbat, Pishin, Zhob, Loralai, Lasbela, Sibi, Jaffarabad, etc.).\n- **Strict Prohibition of Dual Domicile:** Applicants who hold dual domicile certificates or who obtained a Balochistan domicile through fraudulent means will be disqualified, and their cases referred for criminal prosecution under federal civil service statutes.\n- **Verification at Interview:** Candidates called for physical tests or interviews will be required to present their original CNIC, original educational transcripts, and original domicile certificates.",
  "## Step-by-Step Online Application Guide on National Job Portal (NJP)\n\nApplying for the Economic Affairs Division jobs is conducted entirely through the National Job Portal ([njp.gov.pk](https://www.njp.gov.pk)). Follow these verified steps to ensure your application is submitted error-free:\n\n1. **Create / Log In to Your NJP Account:**\n   - Visit the official portal: [njp.gov.pk](https://www.njp.gov.pk).\n   - If you are a new applicant, click **Register / Sign Up**, enter your valid 13-digit CNIC number, active mobile number, and verified email address.\n   - Complete SMS OTP verification to activate your account.\n2. **Complete Your Digital Profile / CV:**\n   - Fill out your personal details exactly as they appear on your CNIC.\n   - In the **Domicile** section, select **Balochistan** and specify your exact district.\n   - Enter your complete academic qualifications from Matriculation up to Graduation.\n   - If applying for Stenotypist or Clerk roles, add your shorthand and typing certifications under technical skills.\n3. **Search for Economic Affairs Division Vacancies:**\n   - On the NJP home dashboard, type `Economic Affairs Division` in the search bar, or filter by **Ministry of Economic Affairs** under Department filters.\n   - Alternatively, review listings tagged with the **Balochistan Initiative / Quota** banner.\n4. **Select Position & Confirm Eligibility:**\n   - Select your target post (**Assistant**, **Stenotypist**, **UDC**, **LDC**, or **Naib Qasid**).\n   - Verify that your age, qualifications, and domicile match the job profile.\n5. **Submit Application (No Fee Required):**\n   - Click **Apply Now**.\n   - There is **no challan fee, postal order, or processing charge** for applying via the National Job Portal for federal ministries.\n   - Confirm submission and download or screenshot your generated **Application Tracking ID** for future reference.\n\nFor a deeper audit of portal pitfalls, read our detailed guide on [12 Common NJP Mistakes That Lead to Application Rejection](/jobs/njp-application-rejection-12-common-mistakes-avoid).",
  "## Required Documents for Test and Interview\n\nAlthough documents are not uploaded in hard copy at the time of initial online application, shortlisted candidates summoned for the skill test or departmental interview must present the following original documents along with two sets of attested photocopies:\n\n- Original CNIC (Computerized National Identity Card).\n- Original Domicile Certificate and Form-D (PRC) of Balochistan.\n- Educational Certificates and Degrees (Matric, Intermediate, Graduation Marksheets & Transcripts).\n- Shorthand and Typing Speed certificates from recognized commercial/technical institutes (for Stenotypist and LDC applicants).\n- 04 recent passport-size photographs with blue/white background.\n- Departmental Permission Certificate (NOC) for candidates currently employed in federal, provincial, or semi-government organizations.\n- Valid Disability Certificate or Armed Forces Discharge Certificate (where claiming respective age or quota relaxations).\n\nFor general attestation procedures and requirements, consult our printable [Government Jobs Documents Checklist for Pakistan](/jobs/government-jobs-documents-checklist-pakistan-2026).",
  "## Important Application Instructions & Recruitment Rules\n\n- **No Postal Applications:** Do not send hard copies, photocopies of degrees, or hand-written applications to the Economic Affairs Division office in Islamabad. Applications sent via courier or postal mail will be rejected summarily.\n- **Multiple Applications:** Eligible candidates may apply for more than one position; however, separate online applications must be submitted for each respective post on the NJP portal.\n- **Screening & Skill Tests:** For the posts of Stenotypist and LDC, typing and shorthand speed tests will be administered on computer systems. Only candidates who attain the minimum required speed benchmarks (80 w.p.m. shorthand and 40/30 w.p.m. typing) will be eligible for interview.\n- **NITB Training Condition:** Selected candidates for Assistant, UDC, and LDC posts must pass the mandatory NITB Basic IT Training Course during their probationary period. Failure to qualify the course will result in termination of service in accordance with federal rules.\n- **No TA/DA:** No Traveling Allowance (TA) or Daily Allowance (DA) will be paid to candidates appearing for screening tests, typing tests, or interviews.\n- **Government Employees:** Candidates already serving in federal or provincial departments must apply through proper channel and produce a Departmental NOC at the time of interview.",
  "## Frequently Asked Questions (FAQs)\n\n### Q1: Can candidates holding Punjab, Sindh, or KP domicile apply for these posts?\n**No.** These specific vacancies are announced strictly against the 6% Balochistan provincial quota. Only candidates holding a genuine Balochistan Domicile and PRC are eligible to apply. Applicants from other provinces can explore federal openings under our [Government Jobs Category](/category/government-jobs).\n\n### Q2: What is the application fee for Economic Affairs Division jobs?\n**There is zero application fee.** Applying through the official National Job Portal ([njp.gov.pk](https://www.njp.gov.pk)) is completely free. Never pay any private agent or online account claiming to collect test fees on behalf of EAD.\n\n### Q3: What is the exact last date to submit the application?\nThe official newspaper advertisement issued by EAD specifies a 15-day application window from the date of publication (ending **15 November 2026**), while the National Job Portal displays an active portal closing deadline of **18 November 2026**. CareerDost strongly advises all Balochistan candidates to submit their online forms before **15 November 2026** to eliminate any risk of technical cut-off issues.\n\n### Q4: Is a computer certificate required at the time of online application?\nNo. While basic computer literacy is advantageous, the official mandatory **Basic IT Training Course** is conducted by the National Information Technology Board (NITB) *after selection* during the probationary period.\n\n### Q5: What is the posting station if selected?\nAll positions are regular posts based at the **Economic Affairs Division, Federal Secretariat (Block C), Islamabad**. Appointees will receive standard federal government allowances, including federal house rent ceiling, medical allowance, and conveyance allowance as per government pay scales.\n\n### Q6: How will candidates be informed about the test or interview?\nShortlisted candidates will receive official SMS alerts and email notifications via the contact information registered in their National Job Portal profile. Additionally, roll number slips and test schedules will be published on the NJP candidate dashboard.",
  "## Official Links & Application Portals\n\nEnsure you access only verified government resources when completing your registration:\n\n- **Official Online Application Portal:** [National Job Portal (NJP) — njp.gov.pk](https://www.njp.gov.pk)\n- **Hiring Ministry Official Website:** [Ministry of Economic Affairs (EAD) — ead.gov.pk](https://www.ead.gov.pk)\n- **Related Federal Recruitment Guides:** Explore the [NEPRA Balochistan Jobs Guide](/jobs/nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider), [Cabinet Division Driver Recruitment](/jobs/cabinet-division-staff-car-driver-jobs-bps-04-2026), and all live gazetted vacancies in [Government Jobs in Pakistan](/category/government-jobs).\n\n*CareerDost is an independent Pakistani career guidance platform committed to verified employment notices, authentic syllabus breakdowns, and transparent application support for youth nationwide.*"
];

articleData.content = JSON.stringify(content);

// 1. Insert into careerdost.sqlite
const stmt = db.prepare(`
  INSERT OR REPLACE INTO articles (
    id, slug, title, category_slug, organization, job_type, location,
    qualification, salary, last_date, publish_date, official_link, apply_link,
    featured, logo_initial, featured_image, image_alt, excerpt, content,
    seo_title, meta_description, focus_keyword, canonical_url, og_title,
    og_description, status, experience, positions, is_verified, no_deadline,
    created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?
  )
`);

const now = new Date().toISOString();
stmt.run(
  articleData.id, articleData.slug, articleData.title, articleData.category_slug, articleData.organization,
  articleData.job_type, articleData.location, articleData.qualification, articleData.salary, articleData.last_date,
  articleData.publish_date, articleData.official_link, articleData.apply_link, articleData.featured,
  articleData.logo_initial, articleData.featured_image, articleData.image_alt, articleData.excerpt,
  articleData.content, articleData.seo_title, articleData.meta_description, articleData.focus_keyword,
  articleData.canonical_url, articleData.og_title, articleData.og_description, articleData.status,
  articleData.experience, articleData.positions, articleData.is_verified, articleData.no_deadline,
  now, now
);

console.log('✓ Successfully inserted article into careerdost.sqlite');

// 2. Generate SQL for D1
function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  return `'` + String(val).replace(/'/g, "''") + `'`;
}

const sqlD1 = `INSERT OR REPLACE INTO articles (
  id, slug, title, category_slug, organization, job_type, location,
  qualification, salary, last_date, publish_date, official_link, apply_link,
  featured, logo_initial, featured_image, image_alt, excerpt, content,
  seo_title, meta_description, focus_keyword, canonical_url, og_title,
  og_description, status, experience, positions, is_verified, no_deadline,
  created_at, updated_at
) VALUES (
  ${escapeSql(articleData.id)},
  ${escapeSql(articleData.slug)},
  ${escapeSql(articleData.title)},
  ${escapeSql(articleData.category_slug)},
  ${escapeSql(articleData.organization)},
  ${escapeSql(articleData.job_type)},
  ${escapeSql(articleData.location)},
  ${escapeSql(articleData.qualification)},
  ${escapeSql(articleData.salary)},
  ${escapeSql(articleData.last_date)},
  ${escapeSql(articleData.publish_date)},
  ${escapeSql(articleData.official_link)},
  ${escapeSql(articleData.apply_link)},
  ${escapeSql(articleData.featured)},
  ${escapeSql(articleData.logo_initial)},
  ${escapeSql(articleData.featured_image)},
  ${escapeSql(articleData.image_alt)},
  ${escapeSql(articleData.excerpt)},
  ${escapeSql(articleData.content)},
  ${escapeSql(articleData.seo_title)},
  ${escapeSql(articleData.meta_description)},
  ${escapeSql(articleData.focus_keyword)},
  ${escapeSql(articleData.canonical_url)},
  ${escapeSql(articleData.og_title)},
  ${escapeSql(articleData.og_description)},
  ${escapeSql(articleData.status)},
  ${escapeSql(articleData.experience)},
  ${escapeSql(articleData.positions)},
  ${escapeSql(articleData.is_verified)},
  ${escapeSql(articleData.no_deadline)},
  ${escapeSql(now)},
  ${escapeSql(now)}
);`;

fs.writeFileSync('scripts/insert_ead_d1.sql', sqlD1);
console.log('✓ Generated scripts/insert_ead_d1.sql for remote D1 execution');
