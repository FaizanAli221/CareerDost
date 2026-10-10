import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

export const oct9Articles = [
  {
    slug: 'women-university-ajk-admissions-2026',
    title: 'Women University AJK Admissions 2026 – Last Date Today, Apply Online',
    category: 'admissions',
    organization: 'Women University of Azad Jammu & Kashmir (WUAJK), Bagh',
    jobType: 'Fall 2026 Academic Intake (BS, Lateral Entry 5th Sem, MS/MPhil, PhD)',
    location: 'Bagh, Azad Jammu & Kashmir (AJ&K)',
    qualification: 'Intermediate (FA/FSc/ICS) for BS | Associate Degree / BA/BSc for Lateral 5th Sem | 16-Year Degree for MS | 18-Year MS/MPhil for PhD',
    salary: 'HEC Need-Based, Ehsaas & University Welfare Fund Scholarships Available',
    experience: 'Open Merit & Reserved Quotas for Female Candidates',
    positions: 'Undergraduate & Postgraduate Degree Programs Across 3 Faculties',
    lastDate: '2026-10-09',
    noDeadline: false,
    publishDate: '2026-10-09',
    officialLink: 'https://wuajk.edu.pk/news/view/848',
    applyLink: 'https://umis.wuajk.edu.pk/admissions/ADM',
    isVerified: true,
    featured: true,
    logoInitial: 'WUAJK',
    featuredImage: '/images/women-university-ajk-admissions-2026.jpg',
    imageAlt: 'Women University AJK Admissions 2026 Last Date Today 9 October Apply Online Fall 2026 Intake CareerDost',
    excerpt: 'CRITICAL DEADLINE TODAY: Online admission applications for Women University of Azad Jammu & Kashmir (WUAJK) Bagh Fall 2026 close today, 9 October 2026. BS, Lateral Entry 5th Semester, MS/MPhil, and PhD programs available.',
    seoTitle: 'Women University AJK Admissions 2026 – Last Date Today, Apply Online | CareerDost',
    metaDescription: 'Women University AJK admissions 2026 close today, 9 October 2026. Apply online via UMIS portal for BS, Lateral 5th Semester, MS/MPhil, and PhD programs. Check eligibility and entry test details.',
    focusKeyword: 'Women University AJK Admissions 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/women-university-ajk-admissions-2026',
    ogTitle: 'Women University AJK Admissions 2026 – Last Date Today, Apply Online',
    ogDescription: 'Final hours to submit admission forms for Women University of Azad Jammu & Kashmir Fall 2026. Entry test scheduled for 12 October 2026. Register online at umis.wuajk.edu.pk.',
    schemaType: 'Article',
    content: [
      "### URGENT ADMISSION NOTICE: LAST DATE TODAY — 9 OCTOBER 2026",
      "> [!WARNING]\n> **CRITICAL DEADLINE ALERT:** Today, **9 October 2026**, is officially the final extended deadline to submit online admission applications for the **Fall 2026 Academic Session** at **Women University of Azad Jammu & Kashmir (WUAJK), Bagh**.\n>\n> Prospective female students across Azad Jammu & Kashmir, Gilgit-Baltistan, and all provinces of Pakistan must submit their electronic admission forms via the official university portal (`umis.wuajk.edu.pk/admissions/ADM`) before midnight tonight.",
      "### About Women University of Azad Jammu & Kashmir (WUAJK)",
      "Established to empower women through high-quality higher education, **Women University of Azad Jammu & Kashmir (WUAJK)** is a premier public-sector higher education institution situated in the scenic district of Bagh, AJ&K. The university offers career-oriented degree programs approved by the Higher Education Commission (HEC) of Pakistan across natural sciences, social sciences, management studies, computing, and allied health sciences.",
      "### Quick Summary Table",
      "- **University:** Women University of Azad Jammu & Kashmir (WUAJK), Bagh\n- **Intake Session:** **Fall 2026**\n- **Programs Offered:** BS (4-Year), Lateral Entry (5th Semester), MS / MPhil, and PhD\n- **Extended Application Deadline:** **TODAY, 9 October 2026**\n- **Tentative Entry Test Date:** **12 October 2026**\n- **Mode of Application:** Strictly Online via UMIS Admission Portal\n- **Official News Notification:** [wuajk.edu.pk News 848](https://wuajk.edu.pk/news/view/848)\n- **Online Admission Portal:** [umis.wuajk.edu.pk/admissions/ADM](https://umis.wuajk.edu.pk/admissions/ADM)\n- **Fee Challan Generator:** [wuajk.edu.pk Challan System](https://wuajk.edu.pk/welcome/generate_challan_common)",
      "### Offered Academic Programs Across Faculties",
      "WUAJK Bagh offers comprehensive degree programs across three distinguished faculties:\n\n1. **Faculty of Science & Technology:**\n   - Computer Science (BS, MS, PhD)\n   - Information Technology (BS)\n   - Biotechnology (BS, MS, PhD)\n   - Botany (BS, MS, PhD)\n   - Chemistry (BS, MS, PhD)\n   - Mathematics (BS, MS, PhD)\n   - Physics (BS, MS)\n   - Zoology (BS, MS, PhD)\n\n2. **Faculty of Arts & Social Sciences:**\n   - Economics (BS, MS)\n   - Management Sciences / BBA (BS, MS, PhD)\n   - Education / B.Ed 1.5, 2.5 & 4 Years (BS, MS, PhD)\n   - English Literature & Linguistics (BS, MS)\n   - International Relations (IR) & History (BS, MS)\n   - Health & Physical Education / Sports Sciences (BS)\n\n3. **Faculty of Medicine, Dentistry and Allied Health Sciences:**\n   - Allied Health Sciences / Medical Laboratory Technology (BS)",
      "### Program-Wise Eligibility Criteria",
      "> [!IMPORTANT]\n> - **BS Programs (4 Years):** Minimum 45% to 50% marks in Higher Secondary School Certificate (HSSC / Intermediate / FA / FSc / ICS) or IBCC equivalent from a recognized education board.\n> - **Lateral Entry (5th Semester):** 14 years of relevant prior education (Associate Degree Program ADP / BA / BSc) with at least 45% marks or 2.0/4.0 CGPA.\n> - **MS / MPhil Programs:** Minimum 16 years of education (BS 4-Year or MA/MSc) in the relevant subject with at least 2.50/4.00 CGPA (semester system) or 50% marks (annual system) from an HEC-recognized university, plus qualifying the university entry test.\n> - **PhD Programs:** Minimum 18 years of education (MS/MPhil) in the relevant field with minimum 3.00/4.00 CGPA or 60% marks, plus clearance of university subject entry test and interview.",
      "### Tentative Entry Test Schedule",
      "According to the official WUAJK notification, the tentative entry test for postgraduate (MS/MPhil/PhD) and specified undergraduate programs is scheduled to be held on **12 October 2026** at the main university campus in Bagh. Applicants must bring their printed admit cards and original CNIC/B-Form to the examination center.",
      "### Required Documents for Online Admission Form",
      "Applicants must upload scanned, legible copies of the following documents during online registration:\n1. Recent passport-sized photograph (white background)\n2. CNIC / Form-B of candidate\n3. CNIC of Father or Guardian\n4. SSC / Matriculation Certificate & Marksheet\n5. HSSC / Intermediate Marksheet / Result Card\n6. Terminal Degree Transcript & Certificate (for Lateral, MS, or PhD applicants)\n7. State Subject Certificate / Domicile Certificate (AJ&K / Provincial Quota)\n8. Paid Admission Fee Challan receipt",
      "### Step-by-Step Online Application Procedure",
      "1. Open the official university admission portal: [umis.wuajk.edu.pk/admissions/ADM](https://umis.wuajk.edu.pk/admissions/ADM).\n2. Register a new student account using your CNIC/B-Form and valid email address.\n3. Log in and select your desired program level (Undergraduate, Lateral Entry, MS/MPhil, or PhD).\n4. Enter personal, guardian, and domicile details carefully.\n5. Fill in academic qualifications from Matric onwards along with marks obtained.\n6. Generate and print the prescribed admission processing fee challan from the bank voucher link.\n7. Deposit the fee at the designated bank branch or online channel, and upload the paid receipt.\n8. Verify all entered data and click **Submit Application** before the deadline closes tonight, **9 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for WUAJK Fall 2026 admissions?**\nThe official extended deadline is strictly **TODAY, 9 October 2026**.\n\n**Q2: When will the entry test be conducted?**\nThe entry test is tentatively scheduled to take place on **12 October 2026** at WUAJK Bagh.\n\n**Q3: Can male candidates apply for admission at WUAJK?**\nNo. Women University of Azad Jammu & Kashmir is exclusively dedicated to female higher education.\n\n**Q4: Is lateral entry into the 5th semester offered?**\nYes. Graduates holding a 2-year Associate Degree (ADP), BA, or BSc are eligible for 5th-semester lateral admission in relevant disciplines.\n\n**Q5: What financial assistance is available for deserving students?**\nWUAJK provides HEC Need-Based Scholarships, Ehsaas Undergraduate Scholarships, and University Student Welfare Fund concessions to deserving students."
    ]
  },
  {
    slug: 'security-papers-jobs-2026',
    title: 'Security Papers Limited Jobs 2026 Karachi – Salary Up to Rs75,000',
    category: 'government-jobs',
    organization: 'Security Papers Limited (SPL), Karachi',
    jobType: 'Technical Non-Management Positions (Project Code: 2610502)',
    location: 'Karachi, Sindh',
    qualification: 'Intermediate (FSc/ICS) or Relevant 3-Year DAE (Mechanical, Electrical, Electronics, Instrumentation, Process Control)',
    salary: 'Rs. 45,000 – Rs. 75,000 per month (Plus Corporate Benefits & Allowances)',
    experience: '1 to 5 Years Relevant Industrial / Technical Experience',
    positions: 'Technical Non-Management Program (Production, Electrical, Instrumentation, Mould)',
    lastDate: '2026-10-11',
    noDeadline: false,
    publishDate: '2026-10-09',
    officialLink: 'https://portal.nts.org.pk/Alldetail/MTAxMzcx',
    applyLink: 'https://portal.nts.org.pk/register',
    isVerified: true,
    featured: true,
    logoInitial: 'SPL',
    featuredImage: '/images/security-papers-jobs-2026.jpg',
    imageAlt: 'Security Papers Limited Jobs 2026 Karachi Salary Up to Rs 75000 Apply Online Through NTS CareerDost',
    excerpt: 'Security Papers Limited (SPL) Karachi invites applications for Non-Management Technical positions with monthly salaries ranging from Rs. 45,000 to Rs. 75,000. Maximum age 25 years. Apply online via NTS before 11 October 2026.',
    seoTitle: 'Security Papers Limited Jobs 2026 Karachi – Salary Up to Rs75,000 | CareerDost',
    metaDescription: 'Security Papers Limited (SPL) Karachi announces Non-Management jobs 2026. Monthly salary Rs 45,000–75,000. Age up to 25 years. Apply online via NTS portal before 11 October 2026.',
    focusKeyword: 'Security Papers Limited Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/security-papers-jobs-2026',
    ogTitle: 'Security Papers Limited Jobs 2026 Karachi – Salary Up to Rs75,000',
    ogDescription: 'Non-Management technical vacancies at Security Papers Limited Karachi. Pay scale Rs. 45,000 to 75,000. DAE / Intermediate eligible. Apply on NTS by 11 October 2026.',
    schemaType: 'JobPosting',
    content: [
      "### Official Recruitment Announcement: Security Papers Limited (SPL)",
      "**Security Papers Limited (SPL), Karachi**, a national industrial manufacturer operating under strict security protocols to produce banknote paper and security documents for the State Bank of Pakistan and commercial banks, has announced vacancies under its **Non-Management Program (Project Code: 2610502)** through the National Testing Service (NTS).",
      "This recruitment campaign provides well-remunerated industrial technical career pathways for young diploma holders and intermediate candidates, offering attractive monthly compensation packages ranging from **Rs. 45,000 to Rs. 75,000** along with fringe benefits.",
      "### Quick Summary Table",
      "- **Organization:** Security Papers Limited (SPL), Karachi\n- **Project Name:** SPL Non-Management Positions (Code: 2610502)\n- **Testing Agency:** National Testing Service (NTS)\n- **Work Location:** Jinnah Avenue, Malir Halt, Karachi, Sindh\n- **Monthly Salary Range:** **Rs. 45,000/= to Rs. 75,000/=** (commensurate with post and experience)\n- **Maximum Age Limit:** **25 Years** (as of application closing date)\n- **Application Deadline:** **11 October 2026**\n- **Tentative Test Date:** **20 October 2026**\n- **Submission Mode:** Strictly Online via NTS Candidate Portal\n- **Official NTS Project Link:** [portal.nts.org.pk/Alldetail/MTAxMzcx](https://portal.nts.org.pk/Alldetail/MTAxMzcx)\n- **Online Application Form:** [portal.nts.org.pk/register](https://portal.nts.org.pk/register)",
      "### Specialized Technical Disciplines Advertised",
      "Positions under the SPL Non-Management Program are open in four core engineering and manufacturing streams:\n\n1. **Production & Mechanical:**\n   - Machine operators, paper manufacturing technicians, and mechanical maintenance crews.\n2. **Electrical & Electronics:**\n   - Power distribution maintenance, electric motor technicians, and industrial electronics troubleshooting.\n3. **Instrumentation & Process Control:**\n   - Calibration, sensor diagnostics, automated control systems, and SCADA instrumentation.\n4. **Mould & Cylinder:**\n   - Security paper watermarking, cylinder mould preparation, and precision tooling operations.",
      "### Detailed Eligibility & Qualification Criteria",
      "> [!IMPORTANT]\n> - **Education:** Diploma of Associate Engineering (DAE) in Mechanical, Electrical, Electronics, or Instrumentation & Process Control from a recognized Board of Technical Education (PBTE/SBTE/KP BTE), OR Intermediate (FSc Pre-Engineering / ICS) with technical aptitude.\n> - **Experience:** Minimum **1 to 5 years** of practical hands-on experience in a reputed manufacturing, industrial, or process plant environment.\n> - **Age Ceiling:** Candidates must **NOT exceed 25 years of age** on 11 October 2026.\n> - **Fitness & Integrity:** Stringent security clearance and physical medical fitness are mandatory prerequisites.",
      "### Salary Package & Corporate Benefits",
      "Security Papers Limited offers one of the most competitive remuneration structures in the national manufacturing sector:\n- Starting monthly consolidated salary ranging between **Rs. 45,000 and Rs. 75,000**.\n- Medical coverage for self and family as per institutional policy.\n- Group life insurance and provident fund benefits.\n- Subsidized transport and factory cafeteria facilities in Karachi.",
      "### Selection Process & Written Screening Test",
      "1. **Written Screening Test:** NTS will administer a specialized screening test tentatively on **20 October 2026**. Official sample papers are available for download directly on the NTS portal.\n2. **Practical Skills Assessment:** Shortlisted candidates will undergo practical trade tests at SPL facilities.\n3. **Panel Interview:** High-scoring applicants will appear before the SPL Departmental Selection Committee.\n4. **Medical Examination & Background Check:** Final appointment is subject to comprehensive security vetting.",
      "### Step-by-Step Online Application Process on NTS",
      "1. Visit the NTS portal project link: [portal.nts.org.pk/Alldetail/MTAxMzcx](https://portal.nts.org.pk/Alldetail/MTAxMzcx).\n2. Click on **Apply Now** or navigate to the registration portal (`portal.nts.org.pk/register`).\n3. Register using your CNIC and secure password.\n4. Fill in academic credentials, technical diploma records, and industrial work experience.\n5. Upload recent passport-size photograph and scanned CNIC.\n6. Generate the 1Link 1Bill invoice for application fee payment.\n7. Pay the fee via ATM, Internet Banking, Easypaisa, or JazzCash before **11 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for SPL Jobs 2026?**\nThe deadline to submit online applications on NTS is **11 October 2026**.\n\n**Q2: What is the salary range for these non-management posts?**\nThe advertised salary ranges from **Rs. 45,000 to Rs. 75,000 per month**, depending on qualifications and relevant experience.\n\n**Q3: What is the maximum age limit?**\nThe upper age limit is strictly **25 years**.\n\n**Q4: Where will the appointed candidates be posted?**\nSelected candidates will be posted at the Security Papers Limited manufacturing complex in **Karachi**.\n\n**Q5: Is there a physical form submission required?**\nNo. Applications are accepted strictly online via the NTS candidate portal. Do not send postal packages to NTS or SPL."
    ]
  },
  {
    slug: 'gepco-jobs-2026',
    title: 'GEPCO Jobs 2026 – Assistant Manager Vacancies, Apply Online Through NTS',
    category: 'government-jobs',
    organization: 'Gujranwala Electric Power Company (GEPCO)',
    jobType: 'Federal Power Sector Professional Positions (Project Code: 2610202)',
    location: 'Gujranwala / GEPCO Jurisdiction, Punjab',
    qualification: '16-Year Bachelor’s / Master’s / BS in Computer Science, Software Engineering, IT, or Electrical/Telecom Engineering',
    salary: 'BPS-17 Equivalent / Attractive Corporate Pay Package',
    experience: 'Fresh to Relevant Professional Experience in DBA, Network Support, or Smart Metering / MDM',
    positions: 'Assistant Manager (Database Administration), Assistant Manager (Network Support), Assistant Manager (Meter Data Management)',
    lastDate: '2026-10-23',
    noDeadline: false,
    publishDate: '2026-10-09',
    officialLink: 'https://portal.nts.org.pk/Alldetail/MTAxMzcz',
    applyLink: 'https://portal.nts.org.pk/register',
    isVerified: true,
    featured: true,
    logoInitial: 'GEPCO',
    featuredImage: '/images/gepco-jobs-2026.jpg',
    imageAlt: 'GEPCO Jobs 2026 Assistant Manager Vacancies Apply Online Through NTS CareerDost',
    excerpt: 'Gujranwala Electric Power Company (GEPCO) has announced Assistant Manager vacancies in Database Administration, Network Support, and Meter Data Management. Age limit 21–33 years. Fee Rs. 280. Apply online through NTS by 23 October 2026.',
    seoTitle: 'GEPCO Jobs 2026 – Assistant Manager Vacancies, Apply Online Through NTS | CareerDost',
    metaDescription: 'GEPCO Jobs 2026 announced for Assistant Manager DBA, Network Support, and Meter Data Management. Age 21–33 years. Fee Rs 280. Apply online via NTS portal before 23 October 2026.',
    focusKeyword: 'GEPCO Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/gepco-jobs-2026',
    ogTitle: 'GEPCO Jobs 2026 – Assistant Manager Vacancies, Apply Online Through NTS',
    ogDescription: 'Exciting career opportunities at GEPCO Gujranwala for Assistant Managers (BPS-17 equivalent). Project Code 2610202. Online registration open at portal.nts.org.pk until 23 October 2026.',
    schemaType: 'JobPosting',
    content: [
      "### Official Recruitment Announcement: GEPCO Career Opportunities",
      "**Gujranwala Electric Power Company (GEPCO)**, a prominent power distribution utility operating under the Ministry of Energy (Power Division), Government of Pakistan, has officially announced technical and IT professional vacancies under **Project Code: 2610202** through the National Testing Service (NTS).",
      "Announced on **6 October 2026**, this recruitment drive invites qualified professionals nationwide to apply for officer-level Assistant Manager positions dedicated to modernizing power grid databases, automated metering infrastructure (AMI), and enterprise network communications.",
      "### Quick Summary Table",
      "- **Organization:** Gujranwala Electric Power Company (GEPCO)\n- **Project Code:** 2610202\n- **Testing Agency:** National Testing Service (NTS)\n- **Announcement Date:** 6 October 2026\n- **Application Deadline:** **23 October 2026**\n- **Tentative Written Test Date:** **30 October 2026**\n- **Application Fee:** **Rs. 270 + Rs. 10 Service Charges = Rs. 280/=**\n- **Age Bracket:** **21 to 33 Years** (including general Federal 5-year age relaxation)\n- **Official NTS Portal Link:** [portal.nts.org.pk/Alldetail/MTAxMzcz](https://portal.nts.org.pk/Alldetail/MTAxMzcz)\n- **Apply Online Link:** [portal.nts.org.pk/register](https://portal.nts.org.pk/register)",
      "### Advertised Vacancies & Post Breakdown",
      "GEPCO has advertised three specialized Assistant Manager positions with **one vacancy per post**:\n\n1. **Assistant Manager (Database Administration) — 1 Post:**\n   - *Role:* Administration, optimization, backup, and high-availability clustering of GEPCO billing and enterprise databases (Oracle / SQL Server / PostgreSQL).\n   - *Qualification:* 16-Year BS/BE/BSc in Computer Science, Software Engineering, Information Technology, or equivalent from an HEC-recognized university.\n   - *Experience:* Professional database administrator certification (OCP / MCSE) and hands-on DBA experience is highly preferred.\n\n2. **Assistant Manager (Network Support) — 1 Post:**\n   - *Role:* Managing enterprise LAN/WAN topology, firewalls, routing protocols, VPNs, and secure transmission communication.\n   - *Qualification:* 16-Year BS/BE/BSc in Computer Systems Engineering, Telecommunication, Computer Science, or Electrical Engineering.\n   - *Experience:* Network certification (CCNA / CCNP / Network+) and routing/switching experience.\n\n3. **Assistant Manager (Meter Data Management) — 1 Post:**\n   - *Role:* Operational oversight of Advanced Metering Infrastructure (AMI), Smart Metering data acquisition, MDM software analytics, and meter communication protocols.\n   - *Qualification:* 16-Year BS/BE in Electrical / Electronics Engineering or Computer Science / IT from an HEC-recognized institution.",
      "### Age Limit & Federal Age Relaxation Rules",
      "> [!IMPORTANT]\n> - **Prescribed Age Limit:** **21 to 33 Years**.\n> - The upper age limit already incorporates the **5 years general age relaxation** granted by the Federal Government of Pakistan.\n> - Additional relaxation is applicable for candidates belonging to Scheduled Castes, Buddhist Community, AJK, Northern Areas, and disabled candidates as per Federal Government civil service recruitment policies.",
      "### NTS Application Fee & Payment Method",
      "- The test processing fee is **Rs. 270 + Rs. 10 service charges (Total Rs. 280/=)** per applied post.\n- Candidates can deposit the fee using the unique 1Link 1Bill consumer number generated by the NTS portal through:\n  - Mobile Banking Apps (Easypaisa, JazzCash, Nayapay)\n  - 1Link Member ATM machines\n  - Internet Banking / Over-the-counter participating bank branches",
      "### Written Screening Test & Selection Mechanism",
      "NTS is tentatively scheduled to conduct the written screening test on **30 October 2026** at major urban centers across Pakistan. Shortlisted candidates scoring highest in the screening test will be invited for physical document scrutiny and final interview at GEPCO Headquarters in Gujranwala.",
      "### Step-by-Step Guide to Apply Online via NTS",
      "1. Navigate to the official project detail page: `https://portal.nts.org.pk/Alldetail/MTAxMzcz`.\n2. Click on **Apply Now** or log into the NTS Candidate Portal (`portal.nts.org.pk/register`).\n3. Fill in your personal profile, CNIC details, and contact numbers.\n4. Enter your academic qualifications, marks percentages, and university accreditation.\n5. Select the specific Assistant Manager post matching your degree.\n6. Generate the 1Link 1Bill payment slip and note down the consumer number.\n7. Pay the fee (Rs. 280) via your preferred banking app.\n8. Ensure the payment status reflects as **Paid** before the closing date of **23 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the deadline to apply for GEPCO Jobs 2026?**\nThe last date to submit online applications via NTS is **23 October 2026**.\n\n**Q2: How many total vacancies are announced?**\nThere are 3 total vacancies: 1 for AM Database Administration, 1 for AM Network Support, and 1 for AM Meter Data Management.\n\n**Q3: What is the age limit for these positions?**\nThe age limit is **21 to 33 years**.\n\n**Q4: What is the application fee?**\nThe fee is **Rs. 280** (Rs. 270 test fee + Rs. 10 service charges).\n\n**Q5: Can I submit the application form by hand or post?**\nNo. As explicitly stated by NTS, by-hand or postal submissions are strictly prohibited. All applications must be submitted online."
    ]
  },
  {
    slug: 'engineering-development-board-jobs-2026',
    title: 'Engineering Development Board Jobs 2026 – 19 Government Vacancies',
    category: 'government-jobs',
    organization: 'Engineering Development Board (EDB), Ministry of Industries & Production',
    jobType: 'Federal Government Professional Contract Appointments (Project-Based PPS Pay Scales)',
    location: 'Islamabad, Federal Capital',
    qualification: 'B.Sc./B.E. Engineering, CA/ACMA/ACCA, Master’s / MS / PhD in Economics, Finance, Marketing, Business Administration',
    salary: 'Project Pay Scales (PPS-6, PPS-7, PPS-11) as per Federal Government Pay Policy',
    experience: '2 to 16+ Years Experience (Strictly Senior & Mid-Career Roles; Not All Suitable for Fresh Graduates)',
    positions: '19 Total Vacancies Across 8 Specialized Professional Roles',
    lastDate: '2026-10-21',
    noDeadline: false,
    publishDate: '2026-10-09',
    officialLink: 'https://njp.gov.pk/jobs/search?q=Engineering+Development+Board',
    applyLink: 'https://njp.gov.pk/jobs/search?q=Engineering+Development+Board',
    isVerified: true,
    featured: true,
    logoInitial: 'EDB',
    featuredImage: '/images/engineering-development-board-jobs-2026.jpg',
    imageAlt: 'Engineering Development Board EDB Jobs 2026 19 Government Vacancies Apply Online Through NJP National Job Portal CareerDost',
    excerpt: 'Engineering Development Board (EDB), Ministry of Industries and Production, invites online applications on the National Job Portal (NJP) for 19 vacancies across 8 specialized positions (PPS-6 to PPS-11). Deadline: 21 October 2026.',
    seoTitle: 'Engineering Development Board Jobs 2026 – 19 Government Vacancies | CareerDost',
    metaDescription: 'Engineering Development Board (EDB) announces 19 vacancies for Research Assistants, Managers, Consultants, and Analysts on NJP. Pay scales PPS-6 to PPS-11. Apply online before 21 October 2026.',
    focusKeyword: 'Engineering Development Board Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/engineering-development-board-jobs-2026',
    ogTitle: 'Engineering Development Board Jobs 2026 – 19 Government Vacancies',
    ogDescription: 'Federal Government jobs at Engineering Development Board (EDB) Islamabad. 19 advertised positions on National Job Portal (NJP). Detailed eligibility and application guidelines.',
    schemaType: 'JobPosting',
    content: [
      "### Official Recruitment Notice: Engineering Development Board (EDB)",
      "The **Engineering Development Board (EDB)**, an apex technical organization operating under the **Ministry of Industries and Production, Government of Pakistan**, has advertised **19 contractual vacancies** across **8 professional roles** to drive national industrialization, electric vehicle (EV) policy implementation, and global engineering exports.",
      "The positions carry attractive **Project Pay Scales (PPS-6, PPS-7, and PPS-11)** and are published live on the official **National Job Portal (NJP)**. The application window is open until **21 October 2026**.",
      "### Quick Summary Table",
      "- **Organization:** Engineering Development Board (EDB) Pakistan\n- **Supervising Ministry:** Ministry of Industries & Production, Federal Government\n- **Total Advertised Vacancies:** **19 Positions**\n- **Number of Job Profiles:** 8 Distinct Professional Roles\n- **Pay Scales:** PPS-6, PPS-7, and PPS-11\n- **Application Deadline:** **21 October 2026**\n- **Work Location:** Islamabad, Pakistan\n- **Official Application Portal:** [National Job Portal (njp.gov.pk)](https://njp.gov.pk/jobs/search?q=Engineering+Development+Board)",
      "### Complete Vacancy & Eligibility Matrix",
      "The complete breakdown of all 19 positions advertised on the National Job Portal is detailed below:\n\n| Position Title | Vacancies | Grade / Scale | Required Qualification | Minimum Experience | Application Deadline |\n| :--- | :---: | :---: | :--- | :--- | :---: | \n| **Research Assistant** (Job #9817) | 6 | PPS-6 | 16-Year Degree in Business Admin, Management Sciences, Marketing, Engineering, or Economics | 2+ Years Experience (EV / Battery manufacturing preferred) | 21 Oct 2026 |\n| **Accounts Officer / DDO** (Job #9816) | 1 | PPS-7 | 16-Year Degree in Finance, Accounting, Commerce, or Economics | 5+ Years Experience in public sector accounting, budgeting & audit | 21 Oct 2026 |\n| **Business Development Manager** (Job #9815) | 2 | PPS-7 | 16-Year Degree in Business Admin, Management Sciences, Marketing/PR, or Economics | 5+ Years Experience in stakeholder coordination & event management | 21 Oct 2026 |\n| **Consultants** (Job #9814) | 6 | PPS-11 | B.Sc. / B.E. Engineering (Chemical, Steel, Electrical, Heavy Engg, Industrial Process) | 16 Years (B.Sc.) / 12 Years (MS) / 8 Years (PhD) in relevant engineering field | 21 Oct 2026 |\n| **Business Development / Marketing Outreach** (Job #9813) | 1 | PPS-11 | Master’s / MS / PhD in Business Admin, Marketing, PR, or related field | 16 Years (Master's) / 12 Years (MS) / 8 Years (PhD) professional experience | 21 Oct 2026 |\n| **Economist** (Job #9812) | 1 | PPS-11 | Master’s / MS / PhD in Economics or Development Economics | 16 Years (Master's) / 12 Years (MS) / 8 Years (PhD) economic modeling experience | 21 Oct 2026 |\n| **Cost Accountant** (Job #9811) | 1 | PPS-11 | CA / ACMA / ACCA or Master's in Finance from recognized institution | 10 to 15 Years post-qualification experience as Cost Accountant | 21 Oct 2026 |\n| **Financial Analyst** (Job #9810) | 1 | PPS-11 | CA / ACMA / ACCA or Master's in Finance from recognized institution | 10 to 15 Years post-qualification experience as Financial Analyst | 21 Oct 2026 |",
      "### Critical Advisory on Senior vs Fresh Roles",
      "> [!WARNING]\n> **Important Career Advisory:** Candidates must note that **the majority of these positions (PPS-7 and PPS-11) are strictly senior-level and mid-career specialist roles requiring between 5 and 16 years of post-qualification experience.**\n>\n> Fresh graduates are **NOT eligible** for PPS-7 or PPS-11 roles. Junior professionals holding 16 years of education with at least 2 years of relevant experience may apply for the **Research Assistant (PPS-6)** position.",
      "### How to Apply Online on National Job Portal (NJP)",
      "1. Navigate to the official National Job Portal: `https://njp.gov.pk/jobs/search?q=Engineering+Development+Board`.\n2. If you already have an NJP profile, click **Login**; otherwise, create a new candidate account with your CNIC.\n3. Complete your digital CV, including basic details, academic qualifications, and verified employment history.\n4. Open the specific job listing you qualify for (Job IDs 9810 through 9817).\n5. Review the specific eligibility criteria and click **Apply Now**.\n6. Confirm your submission. No physical hard copies or postal applications need to be submitted to EDB or NJP.",
      "### Selection Procedure",
      "- Shortlisting of candidates will be based strictly on merit, academic records, and relevant post-qualification experience verified through NJP.\n- Only shortlisted candidates will be summoned for test/interview at Islamabad.\n- No TA/DA will be admissible for appearing in test/interview.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for EDB Jobs 2026?**\nThe application deadline is **21 October 2026** on the National Job Portal.\n\n**Q2: How many total vacancies are advertised?**\nThere are **19 total vacancies** distributed across 8 different professional roles.\n\n**Q3: Are fresh graduates eligible for all positions?**\nNo. Only the Research Assistant position accepts candidates with a minimum of 2 years of experience. All other positions require between 5 and 16+ years of post-qualification experience.\n\n**Q4: Where will the appointed officers work?**\nSelected professionals will be posted at the Engineering Development Board (EDB) Headquarters in **Islamabad**.\n\n**Q5: Is there any application fee on NJP?**\nApplications through the National Job Portal (NJP) for these federal project positions are free of application processing charges."
    ]
  },
  {
    slug: 'university-of-malakand-admissions-2026',
    title: 'University of Malakand MS MPhil PhD Admissions 2026 – Apply Through NTS',
    category: 'admissions',
    organization: 'University of Malakand (UOM), Chakdara Dir Lower, Khyber Pakhtunkhwa',
    jobType: 'Postgraduate Admissions (Fall 2026-I Admission Test, Project Code: 2609401)',
    location: 'Chakdara, Dir Lower, Khyber Pakhtunkhwa (KP)',
    qualification: '16-Year Degree (BS 4-Year / MA/MSc) with Min 2.5 CGPA or 50% marks for MS/MPhil | 18-Year MS/MPhil with Min 3.0 CGPA for PhD',
    salary: 'Merit Scholarships, HEC Indigenous & Need-Based Financial Aid Available',
    experience: 'Session Fall 2026-I Applicants',
    positions: 'MS, MPhil & PhD Admissions in Computer Science, Pharmacy, Biotechnology, Mathematics, Management & Social Sciences',
    lastDate: '2026-10-12',
    noDeadline: false,
    publishDate: '2026-10-09',
    officialLink: 'https://portal.nts.org.pk/Alldetail/MTAxMzY0',
    applyLink: 'https://portal.nts.org.pk/register',
    isVerified: true,
    featured: true,
    logoInitial: 'UOM',
    featuredImage: '/images/university-of-malakand-admissions-2026.jpg',
    imageAlt: 'University of Malakand MS MPhil PhD Admissions 2026 Apply Through NTS Chakdara Dir Lower CareerDost',
    excerpt: 'University of Malakand (UOM) Chakdara Dir Lower announces Fall 2026-I MS, MPhil, and PhD admissions. Screening tests GAT-A, GAT-B, GAT-C, and PhD subject tests conducted by NTS. Test fee Rs. 1,310. Apply online before 12 October 2026.',
    seoTitle: 'University of Malakand MS MPhil PhD Admissions 2026 – Apply Through NTS | CareerDost',
    metaDescription: 'University of Malakand announces Fall 2026-I MS, MPhil, and PhD admissions through NTS. Test fee Rs 1,310. Check test categories (GAT-A/B/C) and apply online before 12 October 2026.',
    focusKeyword: 'University of Malakand Admissions 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/university-of-malakand-admissions-2026',
    ogTitle: 'University of Malakand MS MPhil PhD Admissions 2026 – Apply Through NTS',
    ogDescription: 'Postgraduate admissions Fall 2026-I at University of Malakand. NTS screening test registration open for MS, MPhil, and PhD. Deadline: 12 October 2026.',
    schemaType: 'Article',
    content: [
      "### Official Announcement: University of Malakand Postgraduate Admissions",
      "The **University of Malakand (UOM)**, a leading public university situated in Chakdara, Dir Lower, Khyber Pakhtunkhwa, has formally announced the commencement of admissions for **MS, MPhil, and PhD Programs (Fall 2026-I Admission Test)**.",
      "In collaboration with the **National Testing Service (NTS)** under **Project Code: 2609401**, the university will conduct standardized screening tests (GAT-A, GAT-B, GAT-C, and PhD Subject Tests) for all eligible candidates seeking postgraduate admission.",
      "### Quick Summary Table",
      "- **University:** University of Malakand (UOM), Chakdara Dir Lower, KP\n- **Intake Session:** Fall 2026-I Postgraduate Admissions\n- **Testing Agency:** National Testing Service (NTS)\n- **Project Code:** 2609401\n- **Application Deadline:** **12 October 2026**\n- **Tentative Test Date:** **18 October 2026**\n- **NTS Application Fee:** **Rs. 1,300 + Rs. 10 Service Charges = Rs. 1,310/=**\n- **Official NTS Project Link:** [portal.nts.org.pk/Alldetail/MTAxMzY0](https://portal.nts.org.pk/Alldetail/MTAxMzY0)\n- **Online Registration:** [portal.nts.org.pk/register](https://portal.nts.org.pk/register)",
      "### Test Categories & Offered Academic Disciplines",
      "The NTS screening test is structured into specific GAT test categories according to academic faculty:\n\n#### 1. GAT-A (MS / MPhil Programs):\n- **Management Studies** (Finance, Human Resource Management, Marketing)\n\n#### 2. GAT-B (MS / MPhil Programs):\n- **Sociology**\n- **Social Work**\n- **Pashto**\n- **Journalism & Mass Communication**\n\n#### 3. GAT-C (MS / MPhil Programs):\n- **Computer Science**\n- **Pharmacy** (Pharmaceutics, Pharmacognosy, Pharmacology)\n- **Mathematics**\n- **Biotechnology**\n- **Geology**\n\n#### 4. PhD Subject Admission Tests:\n- Computer Science\n- Mathematics\n- Pharmacy\n- Biotechnology\n- Management Studies\n- Sociology\n- Social Work",
      "### Program-Specific Eligibility Criteria",
      "> [!IMPORTANT]\n> - **MS / MPhil Eligibility:**\n>   - Minimum 16 years of education (BS 4-Year or Master's 2-Year degree) in the relevant field from an HEC-recognized university.\n>   - Minimum 2.50/4.00 CGPA under the semester system, or 50% marks under the annual examination system.\n>   - Valid NTS GAT General / University Admission Test score of at least 50%.\n> - **PhD Eligibility:**\n>   - Minimum 18 years of education (MS / MPhil degree with thesis) in the relevant field.\n>   - Minimum 3.00/4.00 CGPA under the semester system, or 60% marks under the annual system.\n>   - Valid NTS Subject Test / University Subject Admission Test score of at least 60%.",
      "### NTS Application Fee & Payment Guidelines",
      "- The test fee for each candidate is **Rs. 1,300 + Rs. 10 service charges (Total: Rs. 1,310/=)**.\n- After filling out the online application form, generate the 1Link 1Bill invoice.\n- Pay through any mobile banking application (Easypaisa, JazzCash, Upaisa, bank apps), ATM, or bank branch.\n- Keep your transaction receipt safe; manual deposit slips are not required to be posted to NTS.",
      "### Test Format & Preparation Guidance",
      "- **GAT-General (MS/MPhil):** Covers Verbal Reasoning (English vocabulary, comprehension), Analytical Reasoning (logical deduction, pattern recognition), and Quantitative Reasoning (basic mathematics, algebra, arithmetic).\n- **PhD Subject Test:** Focuses primarily on advanced subject knowledge (70% subject-specific content, 15% English, and 15% analytical reasoning).\n- Candidates should review standard NTS past papers and syllabus guidelines available on the NTS portal.",
      "### Step-by-Step Online Registration Guide",
      "1. Open the official NTS project portal: `https://portal.nts.org.pk/Alldetail/MTAxMzY0`.\n2. Click **Apply Now** for your respective category (GAT-A, GAT-B, GAT-C, or PhD Subject Test).\n3. Register a new candidate profile with your CNIC and mobile number.\n4. Complete academic background details and upload a recent passport-style photograph.\n5. Select your preferred test center (e.g., Chakdara, Peshawar, Islamabad).\n6. Generate the 1Link 1Bill invoice and pay the fee of Rs. 1,310 before **12 October 2026**.\n7. Download and print the confirmation page for your records.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for UOM MS/MPhil/PhD admissions?**\nThe deadline to register for the NTS admission test is **12 October 2026**.\n\n**Q2: When will the NTS admission test be held?**\nThe tentative test date is **18 October 2026**.\n\n**Q3: What is the test fee amount?**\nThe fee is **Rs. 1,310** (Rs. 1,300 test fee + Rs. 10 service charges).\n\n**Q4: Can I apply for both MS and PhD at the same time?**\nCandidates must possess 18 years of education (completed MS/MPhil) to be eligible for PhD. You can apply for the program matching your completed qualification.\n\n**Q5: Is physical submission of the NTS form required?**\nNo. The application is completely paperless and submitted online via the NTS candidate portal."
    ]
  }
]

export function publish() {
  console.log('=== PUBLISHING 5 FRESH OCT 9 ARTICLES ON CAREERDOST ===\n')

  // 1. Local SQLite update
  const db = new Database('careerdost.sqlite')

  const catMap = {
    scholarships: 'Scholarships',
    admissions: 'Admissions',
    internships: 'Internships',
    results: 'Results',
    'government-jobs': 'Government Jobs'
  }

  for (const item of oct9Articles) {
    const contentJson = JSON.stringify(item.content)
    const catLabel = catMap[item.category] || 'Admissions'

    const stmtArt = db.prepare(`
      INSERT INTO articles (
        slug, title, category_slug, organization, job_type, location,
        qualification, salary, last_date, publish_date, official_link,
        featured, logo_initial, excerpt, content, seo_title, meta_description,
        status, featured_image, image_alt, experience, positions, apply_link,
        is_verified, focus_keyword, canonical_url, og_title, og_description
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        'published', ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        category_slug = excluded.category_slug,
        organization = excluded.organization,
        job_type = excluded.job_type,
        location = excluded.location,
        qualification = excluded.qualification,
        salary = excluded.salary,
        last_date = excluded.last_date,
        publish_date = excluded.publish_date,
        official_link = excluded.official_link,
        featured = excluded.featured,
        logo_initial = excluded.logo_initial,
        excerpt = excluded.excerpt,
        content = excluded.content,
        seo_title = excluded.seo_title,
        meta_description = excluded.meta_description,
        status = 'published',
        featured_image = excluded.featured_image,
        image_alt = excluded.image_alt,
        experience = excluded.experience,
        positions = excluded.positions,
        apply_link = excluded.apply_link,
        is_verified = excluded.is_verified,
        focus_keyword = excluded.focus_keyword,
        canonical_url = excluded.canonical_url,
        og_title = excluded.og_title,
        og_description = excluded.og_description,
        updated_at = CURRENT_TIMESTAMP;
    `)

    stmtArt.run(
      item.slug, item.title, item.category, item.organization, item.jobType, item.location,
      item.qualification, item.salary, item.lastDate, item.publishDate, item.officialLink,
      item.featured ? 1 : 0, item.logoInitial, item.excerpt, contentJson, item.seoTitle, item.metaDescription,
      item.featuredImage, item.imageAlt, item.experience, item.positions, item.applyLink,
      item.isVerified ? 1 : 0, item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
    )

    const stmtDaily = db.prepare(`
      INSERT INTO daily_updates (
        slug, title, category, short_description, content, featured_image,
        image_alt, official_link, apply_link, deadline, publish_date,
        organization, location, qualification, experience, positions,
        job_type, salary, is_verified, featured, seo_title, meta_description,
        focus_keyword, canonical_url, og_title, og_description, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, 'published'
      )
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        short_description = excluded.short_description,
        content = excluded.content,
        featured_image = excluded.featured_image,
        image_alt = excluded.image_alt,
        official_link = excluded.official_link,
        apply_link = excluded.apply_link,
        deadline = excluded.deadline,
        publish_date = excluded.publish_date,
        organization = excluded.organization,
        location = excluded.location,
        qualification = excluded.qualification,
        experience = excluded.experience,
        positions = excluded.positions,
        job_type = excluded.job_type,
        salary = excluded.salary,
        is_verified = excluded.is_verified,
        featured = excluded.featured,
        seo_title = excluded.seo_title,
        meta_description = excluded.meta_description,
        focus_keyword = excluded.focus_keyword,
        canonical_url = excluded.canonical_url,
        og_title = excluded.og_title,
        og_description = excluded.og_description,
        status = 'published',
        updated_at = CURRENT_TIMESTAMP;
    `)

    stmtDaily.run(
      item.slug, item.title, catLabel, item.excerpt, contentJson, item.featuredImage,
      item.imageAlt, item.officialLink, item.applyLink, item.lastDate, item.publishDate,
      item.organization, item.location, item.qualification, item.experience, item.positions,
      item.jobType, item.salary, item.isVerified ? 1 : 0, item.featured ? 1 : 0, item.seoTitle, item.metaDescription,
      item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
    )
  }
  console.log('Seeded local careerdost.sqlite successfully.')

  // Homepage priority order:
  // 1. Women University AJK (artId: 320, updId: 220)
  // 2. Security Papers Jobs (artId: 319, updId: 219)
  // 3. GEPCO Jobs (artId: 318, updId: 218)
  // 4. Engineering Development Board Jobs (artId: 317, updId: 217)
  // 5. University of Malakand Admissions (artId: 316, updId: 216)
  const idMap = [
    { slug: 'women-university-ajk-admissions-2026', artId: 320, updId: 220 },
    { slug: 'security-papers-jobs-2026', artId: 319, updId: 219 },
    { slug: 'gepco-jobs-2026', artId: 318, updId: 218 },
    { slug: 'engineering-development-board-jobs-2026', artId: 317, updId: 217 },
    { slug: 'university-of-malakand-admissions-2026', artId: 316, updId: 216 }
  ]

  for (let i = 0; i < idMap.length; i++) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(7000 + i, idMap[i].slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(7000 + i, idMap[i].slug)
  }

  for (const m of idMap) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(m.artId, m.slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(m.updId, m.slug)
  }
  console.log('Updated priority IDs in local SQLite.')

  // 2. Prepend to src/data/listings.js
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')
  
  const formattedItems = oct9Articles.map(a => {
    return JSON.stringify({
      slug: a.slug,
      title: a.title,
      category: a.category,
      organization: a.organization,
      jobType: a.jobType,
      location: a.location,
      qualification: a.qualification,
      salary: a.salary,
      experience: a.experience,
      positions: a.positions,
      lastDate: a.lastDate,
      noDeadline: a.noDeadline,
      publishDate: a.publishDate,
      officialLink: a.officialLink,
      applyLink: a.applyLink,
      isVerified: a.isVerified,
      featured: a.featured,
      logoInitial: a.logoInitial,
      featuredImage: a.featuredImage,
      imageAlt: a.imageAlt,
      excerpt: a.excerpt,
      seoTitle: a.seoTitle,
      metaDescription: a.metaDescription,
      focusKeyword: a.focusKeyword,
      canonicalUrl: a.canonicalUrl,
      ogTitle: a.ogTitle,
      ogDescription: a.ogDescription,
      schemaType: a.schemaType,
      content: a.content
    }, null, 2)
  })

  const arrayStart = listingsCode.indexOf('export const listings = [')
  if (arrayStart !== -1) {
    const insertPos = arrayStart + 'export const listings = [\n'.length
    const prependedCode = formattedItems.map(item => '  ' + item.replace(/\n/g, '\n  ') + ',\n').join('')
    
    if (!listingsCode.includes('women-university-ajk-admissions-2026')) {
      listingsCode = listingsCode.slice(0, insertPos) + prependedCode + listingsCode.slice(insertPos)
      listingsCode = listingsCode.replace(/Updated:\s*\d{4}-\d{2}-\d{2}/, 'Updated: 2026-10-09')
      fs.writeFileSync(listingsPath, listingsCode, 'utf8')
      console.log('Successfully updated src/data/listings.js with 5 new articles!')
    } else {
      console.log('src/data/listings.js already contains new articles.')
    }
  }

  // 3. Update scripts/generate_sitemap.js
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')
  if (!sitemapScript.includes('women-university-ajk-admissions-2026')) {
    const insertPattern = 'const publishedDailyUpdates = [\n'
    const newSitemapEntries = `  { slug: 'women-university-ajk-admissions-2026', date: '2026-10-09' },\n  { slug: 'security-papers-jobs-2026', date: '2026-10-09' },\n  { slug: 'gepco-jobs-2026', date: '2026-10-09' },\n  { slug: 'engineering-development-board-jobs-2026', date: '2026-10-09' },\n  { slug: 'university-of-malakand-admissions-2026', date: '2026-10-09' },\n`
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + newSitemapEntries)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('Updated scripts/generate_sitemap.js with new slugs.')
  }
}

if (process.argv[1] && process.argv[1].endsWith('publish_oct9_articles.js')) {
  publish()
}
