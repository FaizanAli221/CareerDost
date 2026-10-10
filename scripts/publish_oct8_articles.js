import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

export const oct8Articles = [
  {
    slug: 'sbbu-merit-list-2027',
    title: 'SBBU Merit List 2027 Announced – Check BS Admission Result Online',
    category: 'results',
    organization: 'Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad (SBA)',
    jobType: 'Undergraduate BS Admissions Merit List (Admission Batch 2027)',
    location: 'SBBU Main Campus, Nawabshah / Shaheed Benazirabad, Sindh',
    qualification: 'HSC (Intermediate) / Pre-Entry Test Qualified Candidates',
    salary: 'Admission Fee: Rs. 68,500 (General BS) | Rs. 88,500 (AI & Cyber Security)',
    experience: 'Session 2026–2027 Applicants',
    positions: 'Provisional BS Merit List Across All University Departments',
    lastDate: '2026-10-22',
    noDeadline: false,
    publishDate: '2026-10-08',
    officialLink: 'https://mail.sbbusba.edu.pk/sbbu-main/first-merit-list_bs_program_sbbu.html',
    applyLink: 'https://mail.sbbusba.edu.pk/sbbu-main/first-merit-list_bs_program_sbbu.html',
    isVerified: true,
    featured: true,
    logoInitial: 'SBBU',
    featuredImage: '/images/sbbu-merit-list-2027.jpg',
    imageAlt: 'SBBU Merit List 2027 BS Admissions Result Announced Online Shaheed Benazir Bhutto University Nawabshah CareerDost',
    excerpt: 'Shaheed Benazir Bhutto University (SBBU) Shaheed Benazirabad has released the Provisional Merit List for BS Programs Batch 2027. Successful candidates must submit fees (Rs 68,500 for General BS, Rs 88,500 for AI & Cyber Security) between 12 and 22 October 2026.',
    seoTitle: 'SBBU Merit List 2027 Announced – Check BS Admission Result Online | CareerDost',
    metaDescription: 'SBBU SBA has released the Provisional BS Merit List for Batch 2027. Check result online, fee challan collection, required original documents, and deadline (12–22 October 2026).',
    focusKeyword: 'SBBU Merit List 2027',
    canonicalUrl: 'https://careerdost.blog/jobs/sbbu-merit-list-2027',
    ogTitle: 'SBBU Merit List 2027 Announced – Check BS Admission Result Online',
    ogDescription: 'Shaheed Benazir Bhutto University SBA releases Provisional BS Merit List Batch 2027. Check fee structure, mandatory documents, and submission procedure before 22 October 2026.',
    schemaType: 'Article',
    content: [
      "### Official Announcement & Provisional Merit List Release",
      "**Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad (SBA)**, has officially released the **Provisional Merit List for BS Programs (Admission Batch 2027)**.",
      "The provisional merit list was published on **7 October 2026**, covering all undergraduate academic disciplines at the **SBBU Main Campus, Nawabshah**.",
      "Candidates who appeared in the pre-entry test and submitted their admission applications can now verify their selection online. Successful candidates are directed to collect their admission fee challans from the Facilitation Centre and complete their payment process within the prescribed schedule.",
      "### Privacy & Candidate Verification Notice",
      "> [!NOTE]\n> **Candidate Privacy Commitment:** In accordance with personal data privacy guidelines, **CareerDost does NOT scrape, reproduce, or republish personal student records, names, marks, parent names, or form IDs.**\n>\n> Candidates must verify their individual results directly on the official university portal at `https://mail.sbbusba.edu.pk/sbbu-main/first-merit-list_bs_program_sbbu.html`.",
      "### Quick Summary Table",
      "- **University:** Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad\n- **Campus Covered:** **SBBU Main Campus, Nawabshah**\n- **Admission Intake:** BS Programs Admission Batch 2027\n- **List Status:** **Provisional Merit List (Subject to Document Scrutiny & Fee Payment)**\n- **Provisional List Release Date:** 7 October 2026\n- **Fee Challan Collection Venue:** Facilitation Centre, SBBU Main Campus\n- **Fee Submission Period:** **12 October 2026 to 22 October 2026**\n- **General BS Programs Fee:** **Rs. 68,500/=**\n- **BS AI & Cyber Security Fee:** **Rs. 88,500/=**\n- **Departmental Copy Submission Deadline:** **22 October 2026**\n- **Official University Website:** [sbbusba.edu.pk](https://sbbusba.edu.pk/)\n- **Direct Merit List Link:** [mail.sbbusba.edu.pk](https://mail.sbbusba.edu.pk/sbbu-main/first-merit-list_bs_program_sbbu.html)",
      "### Important Fee Structure & Due Dates",
      "> [!IMPORTANT]\n> Candidates are advised to collect the official fee challan from the **Facilitation Centre** and pay their admission fees within the verified timeframe:\n>\n> - **All General BS Program Departments:** **Rs. 68,500/=**\n> - **BS Cyber Security & BS Artificial Intelligence:** **Rs. 88,500/=**\n> - **Payment Schedule:** **12 October 2026 to 22 October 2026**\n>\n> **Critical Warning:** In case of non-payment of fee within the due date, the candidate's name will be permanently removed from the merit list, and the seat will be offered to the next candidate on waiting.",
      "### Mandatory Submission of Paid Departmental Copy",
      "Paying the fee at the bank is not enough to finalize your seat:\n- It is **mandatory to submit the paid departmental copy of the fee challan** to the Admission Office latest by **22 October 2026** for the final confirmation of admission.\n- Failure to submit the paid departmental copy will result in the forfeiture of admission, and no subsequent claims will be entertained.",
      "### Mandatory Documents Required at Facilitation Centre",
      "Admission fee challans will **NOT** be issued without verification of the following documents:\n\n#### 1. Original Documents:\n1. **HSC (Intermediate) Original Marksheet**\n2. **Original Affidavit** (on prescribed judicial stamp paper)\n\n#### 2. Required Attested Photocopies:\n1. HSC (Intermediate) Marksheet (Photocopy)\n2. CNIC or B-Form (Photocopy)\n3. Domicile & PRC (Form C) Certificate (Photocopy)\n4. SSC (Matriculation) Marksheet (Photocopy)\n5. Two Passport-Size Recent Photographs\n6. No Objection Certificate (NOC) if employed, or for candidates domiciled in other provinces",
      "### University Disclaimers & Rectification Rights",
      "> [!WARNING]\n> **Provisional Admission Notice:** Do not describe or treat this as a final merit list. The university reserves the absolute right to rectify errors or omissions.\n>\n> In case any candidate’s documents are found forged, counterfeit, or if incorrect information was provided at any stage, their provisional admission is liable to immediate cancellation, and legal proceedings may be initiated.",
      "### Step-by-Step Guide to Check Your Name on the Merit List",
      "1. Visit the official SBBU merit portal: [mail.sbbusba.edu.pk](https://mail.sbbusba.edu.pk/sbbu-main/first-merit-list_bs_program_sbbu.html).\n2. Use the on-page search box or press `Ctrl + F` on your computer.\n3. Enter your assigned **Form ID** or your **Full Name** to locate your record.\n4. Verify your Department, Test Score, and merit allocation status.\n5. If selected, prepare your original HSC marksheet and affidavit.\n6. Visit the Facilitation Centre at SBBU Main Campus Nawabshah between **12 and 22 October 2026** to obtain your fee voucher.\n7. Pay the fee (Rs. 68,500 or Rs. 88,500) at the designated bank branch.\n8. Submit the paid departmental copy back to the Admission Office before **22 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: Is this the final merit list for SBBU BS Admissions Batch 2027?**\nNo. This is strictly a Provisional Merit List. Final admission is subject to physical verification of original documents and submission of the paid fee challan by 22 October 2026.\n\n**Q2: What is the fee submission deadline?**\nThe fee submission window is from **12 October 2026 to 22 October 2026**.\n\n**Q3: What is the admission fee amount for BS programs?**\nThe admission fee is **Rs. 68,500** for general BS departments, and **Rs. 88,500** for BS Artificial Intelligence and BS Cyber Security.\n\n**Q4: Which documents must I present to collect the fee challan?**\nYou must present your original HSC marksheet and affidavit, along with photocopies of HSC marksheet, Matric marksheet, CNIC/B-Form, Domicile, PRC, and 2 passport photos.\n\n**Q5: Can I claim my seat if I pay the fee but do not submit the departmental copy?**\nNo. Submitting the paid departmental copy to the Admission Office by 22 October 2026 is mandatory. Unsubmitted receipts will lead to cancellation of provisional admission."
    ]
  },
  {
    slug: 'ismo-jobs-2026',
    title: 'ISMO Jobs 2026 Pakistan – Last Date Today, Apply Through NTS',
    category: 'government-jobs',
    organization: 'Independent System & Market Operator (ISMO) Pakistan',
    jobType: 'Government / State-Owned Enterprise Contractual Vacancies',
    location: 'Islamabad / Nationwide Placement',
    qualification: 'Bachelor’s / Master’s / BS in Electrical/Electronics Engineering, Finance, IT, Law, HR',
    salary: 'Market Competitive Pay Package (Per ISMO Corporate Scales)',
    experience: 'Fresh to 5+ Years Experience (Post-Specific)',
    positions: 'Engineering, Finance, IT & Corporate Operations Roles',
    lastDate: '2026-10-08',
    noDeadline: false,
    publishDate: '2026-10-08',
    officialLink: 'https://nts.org.pk/Test&Products/Announced/06_26/ISMO_June2026_Online/ISMO.php',
    applyLink: 'https://nts.org.pk/Test&Products/Announced/06_26/ISMO_June2026_Online/index.php',
    isVerified: true,
    featured: true,
    logoInitial: 'ISMO',
    featuredImage: '/images/ismo-jobs-2026.jpg',
    imageAlt: 'ISMO Jobs 2026 Pakistan Last Date Today 8 October Apply Through NTS CareerDost',
    excerpt: 'URGENT DEADLINE ALERT: Online applications for Independent System & Market Operator (ISMO) jobs close today, 8 October 2026. Opportunities available in Engineering, Finance, IT, and Corporate operations via NTS.',
    seoTitle: 'ISMO Jobs 2026 Pakistan – Last Date Today, Apply Through NTS | CareerDost',
    metaDescription: 'ISMO Jobs 2026 closes today, 8 October 2026. Apply online via NTS portal for Engineering, Finance, IT, and Corporate positions. Check requirements, 1Link fee payment, and procedure.',
    focusKeyword: 'ISMO Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/ismo-jobs-2026',
    ogTitle: 'ISMO Jobs 2026 Pakistan – Last Date Today, Apply Through NTS',
    ogDescription: 'Final hours to apply for Independent System & Market Operator (ISMO) jobs on NTS. Closing strictly today, 8 October 2026. Online registration and 1Link payment details.',
    schemaType: 'JobPosting',
    content: [
      "### URGENT RECRUITMENT NOTICE: LAST DATE TODAY — 8 OCTOBER 2026",
      "> [!WARNING]\n> **CRITICAL DEADLINE NOTICE:** Online applications for recruitment at the **Independent System & Market Operator (ISMO) Pakistan** close strictly **TODAY, 8 October 2026**.\n>\n> Eligible candidates must submit their electronic application forms on the official National Testing Service (NTS) portal before midnight. The online registration portal will close once the deadline expires.",
      "### About Independent System & Market Operator (ISMO)",
      "The **Independent System & Market Operator (ISMO)** is a landmark state-owned corporate entity established by the Government of Pakistan to oversee national transmission system operations and operate the competitive wholesale electricity market (CTBCM) in Pakistan.",
      "To strengthen its technical, regulatory, and corporate workforce, ISMO invited applications from qualified Pakistani professionals nationwide through the National Testing Service (NTS).",
      "### Quick Summary Table",
      "- **Organization:** Independent System & Market Operator (ISMO) Pakistan\n- **Testing Agency:** National Testing Service (NTS)\n- **Recruitment Type:** Professional Contractual Appointments\n- **Work Location:** Islamabad Head Office / Regional Operational Centers\n- **Application Deadline:** **TODAY, 8 October 2026**\n- **Submission Mode:** Strictly Online via NTS Website\n- **Payment Method:** 1Link 1Bill (Banks, ATM, Internet/Mobile Banking, Easypaisa, JazzCash)\n- **Biometric Requirement:** Updated NADRA Fingerprint Registration Mandatory\n- **Official NTS Project Link:** [nts.org.pk ISMO Project](https://nts.org.pk/Test&Products/Announced/06_26/ISMO_June2026_Online/ISMO.php)\n- **Online Application Form:** [nts.org.pk Online Form](https://nts.org.pk/Test&Products/Announced/06_26/ISMO_June2026_Online/index.php)",
      "### Advertised Positions & Professional Categories",
      "The ISMO recruitment drive encompasses key technical and corporate disciplines:\n\n1. **Engineering Wing:**\n   - **Senior Engineers (Power Systems / Electrical):** Minimum 16-Year Bachelor’s degree in Electrical or Electronics Engineering from an HEC-recognized university with active Pakistan Engineering Council (PEC) registration and 5+ years relevant power utility/transmission experience.\n   - **Engineer-I & Engineer-II:** Bachelor’s degree in Electrical/Electronics Engineering with valid PEC registration; 1–3 years experience in power system dispatch, protection, or grid operations.\n\n2. **Finance & Regulatory Wing:**\n   - **Assistant Manager (Sales Tax / Taxation):** Master’s degree in Commerce/Finance, CA Inter, CMA, or ACCA with 3+ years corporate tax compliance experience.\n   - **Assistant Manager (Business & Regulatory Finance):** Master’s/BS in Finance, Economics, or Business Administration with power market regulatory modeling expertise.\n   - **Senior Analyst (Tariff Analysis & Financial Modelling):** Qualified financial analyst with hands-on experience in financial modeling, power purchase tariffs, and cash flow forecasting.\n\n3. **Information Technology & Systems Wing:**\n   - **System Administrator & Network Administrator:** BS in Computer Science, Software Engineering, or Information Technology with certifications (CCNA, CCNP, MCSE) and 3+ years data center/network operations experience.\n   - **Quality Assurance (QA) Engineer:** BS in Computer Science/SE with software quality assurance and automation testing background.\n   - **Senior Analyst (IT Governance & Compliance):** BS/MS in CS/IT with knowledge of ISO 27001, cybersecurity frameworks, and IT audit.\n   - **IT Support Specialists:** Bachelor's degree in CS/IT with desktop support, hardware, and OS troubleshooting expertise.\n\n4. **Corporate & Communications:**\n   - **Senior Analyst (Corporate Communication):** Master’s/BS in Mass Communication, Public Relations, or Media Studies with corporate reporting and stakeholder engagement experience.",
      "### Official NTS Fee Payment Instructions",
      "> [!IMPORTANT]\n> - The application processing fee can be paid via **1Link 1Bill Participating Banks, ATM, Internet Banking, Mobile Banking Apps (Easypaisa / JazzCash), or TCS Express Counters** using the unique consumer number generated upon completing the NTS online form.\n> - **Strict Prohibition on Manual Forms:** Submit your Application Form online. Only online filled Application Forms will be entertained. Hand-written application forms will strictly NOT be entertained.\n> - Do not post physical copies or bank deposit slips to NTS headquarters.",
      "### Mandatory NADRA Biometric Verification",
      "All prospective candidates must ensure that their fingerprints are updated in the NADRA biometric database. NTS will conduct mandatory biometric identification of candidates at entry gates of test centers on the examination day.",
      "### Step-by-Step Application Process on NTS",
      "1. Navigate to the official NTS project page: `https://nts.org.pk/Test&Products/Announced/06_26/ISMO_June2026_Online/ISMO.php`.\n2. Click on **For Online Application Form** (`index.php`).\n3. Log in with your CNIC and password, or create a new candidate profile.\n4. Select the desired position matching your qualification and PEC/HEC credentials.\n5. Fill in academic qualifications, employment history, and upload your recent photograph.\n6. Generate the 1Link 1Bill payment invoice.\n7. Pay the fee through your mobile banking application (Easypaisa, JazzCash, or bank app) before the system closes tonight.\n8. Verify that the payment status is marked as **Paid** and print your application receipt before the deadline of **8 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for ISMO Jobs 2026?**\nThe last date to submit online applications through NTS is strictly **TODAY, 8 October 2026**.\n\n**Q2: Can I submit a printed form by post to NTS?**\nNo. As officially notified by NTS, only online-filled forms are accepted. Handwritten or posted forms will be rejected.\n\n**Q3: How do I pay the NTS application fee?**\nFees can be paid online via 1Link 1Bill using any mobile banking app, Easypaisa, JazzCash, ATM, or at TCS Express counters.\n\n**Q4: Is PEC registration mandatory for engineering posts?**\nYes. Engineers must hold valid registration with the Pakistan Engineering Council (PEC).\n\n**Q5: Will there be a written screening test?**\nYes. Eligible shortlisted candidates will receive roll number slips from NTS for the written screening test."
    ]
  },
  {
    slug: 'nicvd-jobs-2026',
    title: 'NICVD Jobs 2026 – Latest Healthcare Vacancies, Apply Online',
    category: 'government-jobs',
    organization: 'National Institute of Cardiovascular Diseases (NICVD), Karachi',
    jobType: 'Government Autonomous Healthcare Institution Vacancies',
    location: 'Karachi, Sindh (NICVD Main Hospital & Regional Cardiac Units)',
    qualification: 'MBBS / FCPS / Generic BSN Nursing / General Nursing Diploma / BS / Master’s',
    salary: 'Market Competitive & Institutional Pay Package',
    experience: 'Fresh to 5+ Years Specialized Healthcare Experience',
    positions: 'Staff Nurses, Trainee Staff Nurses, Specialists, Technologists & Administrative Roles',
    lastDate: '2026-10-11',
    noDeadline: false,
    publishDate: '2026-10-08',
    officialLink: 'https://nts.org.pk/Test&Products/Announced/09_26/NICVD_Sep2026_Online/NICVD.php',
    applyLink: 'https://nts.org.pk/Test&Products/Announced/09_26/NICVD_Sep2026_Online/index.php',
    isVerified: true,
    featured: true,
    logoInitial: 'NICVD',
    featuredImage: '/images/nicvd-jobs-2026.jpg',
    imageAlt: 'NICVD Jobs 2026 Latest Healthcare Vacancies Apply Online Through NTS Before 11 October CareerDost',
    excerpt: 'National Institute of Cardiovascular Diseases (NICVD) Karachi invites online applications for multiple healthcare positions including Staff Nurses, Trainee Staff Nurses, Specialists, and Allied Health Staff. Deadline is 11 October 2026.',
    seoTitle: 'NICVD Jobs 2026 – Latest Healthcare Vacancies, Apply Online | CareerDost',
    metaDescription: 'NICVD Jobs 2026: Apply online before 11 October 2026 for Staff Nurse, Trainee Staff Nurse, and allied healthcare vacancies. Complete vacancy table, NTS test fee (Rs 800), and eligibility.',
    focusKeyword: 'NICVD Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/nicvd-jobs-2026',
    ogTitle: 'NICVD Jobs 2026 – Latest Healthcare Vacancies, Apply Online',
    ogDescription: 'Healthcare recruitment at National Institute of Cardiovascular Diseases (NICVD). Apply online through NTS for nursing and healthcare roles by 11 October 2026.',
    schemaType: 'JobPosting',
    content: [
      "### Healthcare Recruitment Notice: NICVD Karachi",
      "The **National Institute of Cardiovascular Diseases (NICVD), Karachi**, the country’s flagship tertiary cardiac healthcare institution, has announced career opportunities across medical, nursing, allied health, and administrative departments.",
      "The positions are open to candidates possessing a valid **Sindh Domicile**. Depending on the position, applications are being processed through the **National Testing Service (NTS)** and the official NICVD careers portal.",
      "The final closing date for application submission is strictly **11 October 2026**.",
      "### Quick Summary Table",
      "- **Institution:** National Institute of Cardiovascular Diseases (NICVD), Karachi\n- **Administering Authority:** NICVD Sindh / NTS Testing Services\n- **Vacancies Announced:** Staff Nurses, Trainee Staff Nurses, Medical Faculty & Technical Staff\n- **Regional Eligibility:** Candidates holding valid Sindh Domicile\n- **Application Deadline:** **11 October 2026**\n- **NTS Written Test Fee:** **Rs. 800 (for Nursing positions)**\n- **Payment Method:** 1Link 1Bill (Banks, ATM, Easypaisa, JazzCash)\n- **Helpline Numbers:** 021-34546930 & 051-8444441\n- **Official NTS Portal:** [nts.org.pk NICVD Portal](https://nts.org.pk/Test&Products/Announced/09_26/NICVD_Sep2026_Online/NICVD.php)\n- **NICVD Institutional Careers:** [nicvd.org/careers](https://nicvd.org/careers)",
      "### Verified Vacancy Table (Current Advertisement)",
      "The following positions are officially advertised in the current recruitment cycle with closing date of **11 October 2026**:\n\n| Position Title | Prescribed Qualification | Minimum Experience | Application Channel & Deadline |\n| :--- | :--- | :--- | :--- |\n| **Staff Nurse** | 4-Year Generic BSN Degree or 3-Year General Nursing Diploma + 1-Year Midwifery; Valid PNC Registration | 1–2 Years Clinical Hospital Experience | **Apply via NTS** (Deadline: 11 Oct 2026) |\n| **Trainee Staff Nurse** | 4-Year Generic BSN or 3-Year General Nursing Diploma; Valid PNC Registration | Fresh Graduates / Entry Level | **Apply via NTS** (Deadline: 11 Oct 2026) |\n| **Consultant Interventional Radiologist** | MBBS with FCPS in Radiology + Certified Sub-Specialty Fellowship in Interventional Radiology | 3+ Years Post-Fellowship Clinical Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Assistant Professor (Paeds Critical Care / Emergency)** | MBBS with FCPS / MS in Paediatrics or Paediatric Critical Care | 2+ Years Post-Fellowship Teaching/Hospital Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Senior Registrar (Paeds Cardiac Surgery)** | MBBS with FCPS Part-II / MS in Cardiac Surgery | Completed Residency in Cardiac Surgery | Apply via NICVD Careers (11 Oct 2026) |\n| **Senior Registrar (Cardiac Imaging / Critical Care)** | MBBS with FCPS in Cardiology / Radiology / Critical Care | 1+ Year Senior Resident Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Dietitian** | BS / M.Sc in Food & Nutrition / Clinical Dietetics from HEC-recognized institute | 1–2 Years Hospital Clinical Nutrition Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Radiation Protection Officer** | M.Sc / BS in Medical Physics or Nuclear Physics | PNRA Certification / Clinical Hospital Exposure | Apply via NICVD Careers (11 Oct 2026) |\n| **Echo Technologist** | BS in Cardiac Technology / Allied Health Sciences | 1–2 Years Adult/Paediatric Echocardiography Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Echo Technician / CSSD Technician** | Diploma in Cardiac / OT / CSSD Technology from Sindh Medical Faculty | 1+ Year Relevant Practical Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Surgical Assistant** | Diploma / BS in Surgical Technology / Operation Theatre Sciences | 1–2 Years Cardiac OT Practical Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Multimedia Specialist** | Bachelor’s degree in Computer Science, Multimedia Arts, or Graphic Design | 2+ Years Video Production & Medical Media Experience | Apply via NICVD Careers (11 Oct 2026) |\n| **Junior Assistant (Human Resources)** | BBA / Bachelor’s in Public Administration / Commerce | 1–2 Years Clerical / HR Operations Experience | Apply via NICVD Careers (11 Oct 2026) |",
      "### Application Channels & Fee Payment Details",
      "> [!IMPORTANT]\n> Candidates must apply through the designated portal according to their target position:\n>\n> 1. **For Staff Nurse & Trainee Staff Nurse (S. No. 08 & 09):**\n>    - Applications must be submitted online exclusively through the **NTS portal** at `https://nts.org.pk/Test&Products/Announced/09_26/NICVD_Sep2026_Online/NICVD.php`.\n>    - The NTS written test fee is **Rs. 800/-**, payable via 1Link 1Bill participating banks, ATMs, Internet/Mobile Banking, Easypaisa, or JazzCash.\n>    - Only online-filled application forms are entertained. Handwritten or posted forms will be rejected.\n>\n> 2. **For Medical, Specialist & Administrative Positions:**\n>    - Candidates should submit their detailed CV and application through the official **NICVD careers portal** at `www.nicvd.org/careers` before **11 October 2026**.",
      "### Eligibility Guidelines & Sindh Domicile Requirement",
      "- **Domicile:** All advertised positions are reserved for candidates holding a valid Domicile and PRC of Sindh Province.\n- **Council Registrations:** Medical doctors must possess valid PMDC registration; Nurses must hold valid registration with the Pakistan Nursing & Midwifery Council (PN&MC).\n- **Age Relaxation:** Admissible under Government of Sindh service rules where applicable.",
      "### Step-by-Step Procedure to Apply Through NTS (Nursing Posts)",
      "1. Open the official NTS project page: `https://nts.org.pk/Test&Products/Announced/09_26/NICVD_Sep2026_Online/NICVD.php`.\n2. Click on **For Online Application Form** (`index.php`).\n3. Register using your CNIC and active mobile number, or sign in to your existing NTS account.\n4. Select your role: **Staff Nurse** or **Trainee Staff Nurse**.\n5. Fill in personal, educational, and professional nursing details.\n6. Generate the 1Link 1Bill fee voucher of Rs. 800.\n7. Pay the fee via your banking app or Easypaisa/JazzCash.\n8. Verify payment confirmation on the NTS candidate portal and download the application copy before **11 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the application deadline for NICVD Jobs 2026?**\nThe application deadline for all advertised positions is **11 October 2026**.\n\n**Q2: Who should apply through NTS?**\nCandidates applying for **Staff Nurse** and **Trainee Staff Nurse** positions must apply online through the NTS portal.\n\n**Q3: Where do applicants for specialist and doctor roles apply?**\nCandidates applying for medical faculty, consultant, registrar, technologist, and HR roles should apply via the official NICVD careers portal at `www.nicvd.org/careers`.\n\n**Q4: What is the NTS test fee for nursing candidates?**\nThe written test fee is Rs. 800, payable via 1Link 1Bill.\n\n**Q5: Are candidates from outside Sindh eligible?**\nNo. The advertised positions strictly require a valid Sindh Domicile."
    ]
  },
  {
    slug: 'sindh-bs-nursing-admissions-2026-27',
    title: 'BS Nursing Admissions 2026–27 in Sindh – Apply Online Through NTS',
    category: 'admissions',
    organization: 'National Testing Service (NTS) / Pakistan Nursing & Midwifery Council (PN&MC)',
    jobType: 'Generic BS Nursing 4-Year Degree Program Admissions (Session 2026–2027)',
    location: 'Karachi, Hyderabad, Khairpur, Sukkur & Gambat (Sindh)',
    qualification: 'FSc Pre-Medical (Physics, Chemistry, Biology) with Minimum 50% Marks',
    salary: 'Undergraduate Professional Degree Admissions',
    experience: 'Matric & FSc Pre-Medical Science Graduates',
    positions: '4-Year BSN Generic Degree Seats across 5 Recognized Nursing Colleges',
    lastDate: '2026-10-30',
    noDeadline: false,
    publishDate: '2026-10-08',
    officialLink: 'https://www.nts.org.pk/new/projectsnew.php',
    applyLink: 'https://portal.nts.org.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'BSN',
    featuredImage: '/images/sindh-bs-nursing-admissions-2026-27.jpg',
    imageAlt: 'BS Nursing Admissions 2026-27 in Sindh Apply Online Through NTS Memon NIAH Leaders Visionary Lareb CareerDost',
    excerpt: 'Admissions are open for 4-Year Generic BS Nursing (Session 2026–27) across 5 premier nursing colleges in Sindh through NTS: Memon Karachi, NIAH Hyderabad, Leaders Khairpur, Visionary Sukkur, and Lareb Gambat. Deadline is 30 October 2026.',
    seoTitle: 'BS Nursing Admissions 2026–27 in Sindh – Apply Online Through NTS | CareerDost',
    metaDescription: 'BS Nursing Admissions 2026–27 in Sindh: Apply online via NTS before 30 October 2026 for Memon Karachi, NIAH Hyderabad, Leaders Khairpur, Visionary Sukkur & Lareb Gambat. Comparison table, eligibility & links.',
    focusKeyword: 'BS Nursing Admissions 2026-27 Sindh',
    canonicalUrl: 'https://careerdost.blog/jobs/sindh-bs-nursing-admissions-2026-27',
    ogTitle: 'BS Nursing Admissions 2026–27 in Sindh – Apply Online Through NTS',
    ogDescription: 'Generic BS Nursing admissions open in Sindh via NTS for Session 2026–27. Check college-by-college criteria, fees, test pattern, and direct application links.',
    schemaType: 'EducationalOccupationalProgram',
    content: [
      "### Comprehensive Admissions Overview: Generic BS Nursing 2026–27",
      "Admissions for the **BS Nursing (Generic) 4-Year Degree Program (Session 2026–2027)** are now officially open across **five prominent recognized nursing colleges in Sindh**, with the **National Testing Service (NTS)** administering the centralized online registration and entrance testing process.",
      "The program offers recognized nursing education accredited by the **Pakistan Nursing & Midwifery Council (PN&MC)** and affiliated with leading public medical universities in Sindh.",
      "The closing deadline for online application submission for all five institutions is **Friday, 30 October 2026**.",
      "### Quick Summary Table",
      "- **Academic Program:** BS Nursing (Generic) 4-Year Degree Program\n- **Academic Intake:** Session 2026–2027\n- **Testing Agency:** National Testing Service (NTS)\n- **Regulatory Body:** Pakistan Nursing & Midwifery Council (PN&MC)\n- **Number of Participating Colleges:** 5 Recognized Nursing Institutions across Sindh\n- **Application Deadline:** **Friday, 30 October 2026**\n- **Minimum Eligibility:** F.Sc Pre-Medical (Physics, Chemistry, Biology) with at least **50% Marks**\n- **Age Limit:** 14 to 35 Years (as per PN&MC Regulations)\n- **Gender Eligibility:** Male & Female (as per college-specific quota)\n- **Fee Payment Channel:** 1Link 1Bill (Banks, ATM, Mobile Banking, Easypaisa, JazzCash, TCS)\n- **Official NTS Admissions Hub:** [nts.org.pk Projects Page](https://www.nts.org.pk/new/projectsnew.php)",
      "### College-by-College Comparison Table",
      "Below is the verified comparative breakdown of all five nursing colleges currently admitting candidates through NTS:\n\n| College Name | Location | Affiliation & Recognition | Test Center City | Application Deadline | Official NTS Portal |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Memon College of Nursing** | Karachi, Sindh | Recognized by PN&MC | Karachi | **30 October 2026** | [Apply for Memon](https://nts.org.pk/Test&Products/Announced/10_26/Memon_Oct2026_Online/Memon.php) |\n| **National Institute of Allied Health Sciences (NIAH)** | Hyderabad, Sindh | Recognized by PN&MC | Hyderabad | **30 October 2026** | [Apply for NIAH](https://nts.org.pk/Test&Products/Announced/08_26/NIAH_Hyd_Aug2026_Online/NIAH.php) |\n| **Leaders Institute of Medical & Allied Health Sciences** | Khairpur Mir’s, Sindh | Recognized by PN&MC | Sukkur / Khairpur | **30 October 2026** | [Apply for Leaders](https://nts.org.pk/Test&Products/Announced/08_26/Leaders_Aug2026_Online/Leaders.php) |\n| **Visionary Institute of Nursing & Allied Health Sciences** | Sukkur, Sindh | Recognized by PN&MC | Sukkur | **30 October 2026** | [Apply for Visionary](https://nts.org.pk/Test&Products/Announced/08_26/Visionary_Sukkur_Aug2026_Online/Visionary.php) |\n| **Lareb Mustafa Institute of Nursing** | Gambat, Sindh | Recognized by PN&MC | Gambat / Sukkur | **30 October 2026** | [Apply for Lareb](https://nts.org.pk/Test&Products/Announced/08_26/LaraibMustafa_Aug2026_Online/Lareb.php) |",
      "### Strict Eligibility Criteria & PN&MC Standards",
      "> [!IMPORTANT]\n> Applicants must satisfy the statutory admission standards prescribed by the Pakistan Nursing & Midwifery Council (PN&MC):\n>\n> 1. **Academic Qualification:** Candidates must have passed the **Higher Secondary School Certificate (HSSC / F.Sc Pre-Medical)** with Physics, Chemistry, and Biology, securing a minimum of **50% unadjusted marks** from a recognized BISE board.\n> 2. **Matriculation Standard:** SSC (Matric) with Science (Physics, Chemistry, Biology) with at least 50% marks.\n> 3. **Age Requirement:** Candidates must be between **14 and 35 years of age** on the closing date (30 October 2026).\n> 4. **Gender Eligibility:** Both male and female candidates are eligible, subject to individual institute quota distributions.\n> 5. **Domicile:** Preference and seat quotas are allocated to candidates holding Sindh Domicile and PRC.",
      "### NTS Admission Screening Test Format",
      "The NTS written pre-admission test comprises multiple-choice questions (MCQs) structured as follows:\n- **Biology:** 40%\n- **Chemistry:** 20%\n- **Physics:** 20%\n- **English Language Comprehension:** 10%\n- **General Knowledge & Analytical Reasoning:** 10%\n\nTest date and venue will be communicated via NTS Roll Number Slips dispatched to candidates' registered accounts prior to the test.",
      "### Step-by-Step Online Application Procedure",
      "1. Visit the NTS portal and locate the specific college project link:\n   - **Memon College Karachi:** `https://nts.org.pk/Test&Products/Announced/10_26/Memon_Oct2026_Online/Memon.php`\n   - **NIAH Hyderabad:** `https://nts.org.pk/Test&Products/Announced/08_26/NIAH_Hyd_Aug2026_Online/NIAH.php`\n   - **Leaders Institute Khairpur:** `https://nts.org.pk/Test&Products/Announced/08_26/Leaders_Aug2026_Online/Leaders.php`\n   - **Visionary Institute Sukkur:** `https://nts.org.pk/Test&Products/Announced/08_26/Visionary_Sukkur_Aug2026_Online/Visionary.php`\n   - **Lareb Mustafa Gambat:** `https://nts.org.pk/Test&Products/Announced/08_26/LaraibMustafa_Aug2026_Online/Lareb.php`\n2. Click on **Online Application Form** and log in or register a new candidate account.\n3. Enter your personal details, intermediate pre-medical marks, and upload a passport-size photo.\n4. Generate the 1Link 1Bill fee invoice and deposit the test fee through mobile banking, Easypaisa, JazzCash, or bank branch.\n5. Confirm payment on the candidate dashboard and submit before **30 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for BS Nursing admissions in Sindh?**\nThe deadline for all five colleges on NTS is **Friday, 30 October 2026**.\n\n**Q2: What is the minimum F.Sc percentage required for BS Nursing?**\nA minimum of **50% marks in F.Sc Pre-Medical** (Physics, Chemistry, Biology) is mandatory per PN&MC regulations.\n\n**Q3: Can male students apply for these nursing programs?**\nYes. Both male and female candidates can apply, subject to the quota policy of each individual institution.\n\n**Q4: How do I pay the NTS admission test fee?**\nFees can be paid online via 1Link 1Bill using any bank app, ATM, Easypaisa, JazzCash, or TCS Express counters.\n\n**Q5: Can I apply to more than one college?**\nYes. Candidates can apply to multiple institutions by submitting separate online application forms and test fees on NTS."
    ]
  },
  {
    slug: 'szabist-scholarship-2026-27',
    title: 'SZABIST Need-Based Scholarship 2026–27 – Eligibility & How to Apply',
    category: 'scholarships',
    organization: 'Shaheed Zulfikar Ali Bhutto Institute of Science and Technology (SZABIST) University Karachi',
    jobType: 'Undergraduate & Graduate Need-Based Financial Assistance (Session 2026–2027)',
    location: 'Room No. 5, ERFA Department, 153 Campus, SZABIST University, Clifton, Karachi',
    qualification: 'Newly Enrolled Undergraduate & Graduate Students (Excluding PhD)',
    salary: 'Need-Based Tuition Fee Assistance / Scholarship Award',
    experience: 'Financial Need Assessment (Annual Family Income Up to Rs. 1,500,000)',
    positions: 'Need-Based Scholarships for Session 2026–2027',
    lastDate: '2026-10-21',
    noDeadline: false,
    publishDate: '2026-10-08',
    officialLink: 'https://szabist.edu.pk/announcements/',
    applyLink: 'https://bit.ly/SNBSPOnlineForm',
    isVerified: true,
    featured: true,
    logoInitial: 'SZABIST',
    featuredImage: '/images/szabist-scholarship-2026-27.jpg',
    imageAlt: 'SZABIST Need-Based Scholarship 2026-27 Eligibility and How to Apply ERFA Department Karachi CareerDost',
    excerpt: 'SZABIST University Karachi has opened applications for the Need-Based Scholarship 2026–27 for newly registered undergraduate and graduate students. Maximum annual family income limit is Rs 1,500,000. Physical form deadline is 21 October 2026.',
    seoTitle: 'SZABIST Need-Based Scholarship 2026–27 – Eligibility & How to Apply | CareerDost',
    metaDescription: 'SZABIST Need-Based Scholarship 2026–27: Apply before 21 October 2026. Check eligibility (family income <= Rs 1.5M), required documents, appointment booking, and ERFA physical submission.',
    focusKeyword: 'SZABIST Scholarship 2026-27',
    canonicalUrl: 'https://careerdost.blog/jobs/szabist-scholarship-2026-27',
    ogTitle: 'SZABIST Need-Based Scholarship 2026–27 – Eligibility & How to Apply',
    ogDescription: 'Financial assistance for newly registered undergraduate and graduate students at SZABIST University Karachi. Step-by-step application procedure, ERFA appointment details, and deadline.',
    schemaType: 'EducationalOccupationalProgram',
    content: [
      "### Program Overview: SZABIST Need-Based Scholarship 2026–27",
      "**SZABIST University Karachi** has officially invited applications for the **SZABIST Need-Based Scholarship (SNBSP) 2026–27**, dedicated to supporting newly registered students facing financial hardship.",
      "Administered by the **External Relations & Financial Assistance (ERFA) Department**, the scholarship provides tuition fee coverage to ensure talented students can pursue higher education without financial distress.",
      "The final deadline to complete the online application, schedule an appointment, and submit the physical form along with all supporting financial documents is **21 October 2026**.",
      "### Quick Summary Table",
      "- **Administering Body:** ERFA Department, SZABIST University Karachi\n- **Scholarship Name:** SZABIST Need-Based Scholarship 2026–27 for New Students\n- **Target Students:** Newly Registered Undergraduate and Graduate Students\n- **Excluded Programs:** **PhD Students are strictly NOT eligible**\n- **Income Eligibility Ceiling:** Maximum Annual Family Income **Rs. 1,500,000/- (Rs 1.5 Million)**\n- **Academic Criterion:** Enrolled students in good standing (CGPA > 2.5 where applicable)\n- **Physical Submission Venue:** Room No. 5, ERFA Department, 153 Campus, SZABIST University, Karachi\n- **Submission Days & Timings:** Monday to Thursday | 10:00 AM to 3:15 PM\n- **Application Deadline:** **21 October 2026**\n- **Official Announcements Portal:** [szabist.edu.pk/announcements](https://szabist.edu.pk/announcements/)\n- **ERFA Department Contact:** `erfa@szabist.edu.pk` | Phone: 021-35823433 (Ext: 371)",
      "### Financial Need Eligibility Criteria",
      "> [!IMPORTANT]\n> Prospective applicants must fulfill the following mandatory criteria:\n>\n> 1. **Enrollment Status:** Must be a newly registered student in any undergraduate or graduate degree program at SZABIST Karachi for the current academic session.\n> 2. **PhD Ineligibility:** PhD students are strictly not eligible for this need-based assistance.\n> 3. **Family Income Ceiling:** Total gross annual family income from all sources must **not exceed Rs. 1,500,000/-**.\n> 4. **Academic Standing:** Must maintain satisfactory academic standing (minimum 2.5 CGPA where applicable).\n> 5. **Award Value Clarification:** The exact scholarship quantum is evaluated case-by-case by the Financial Assistance Committee based on demonstrated financial need. No fixed or uniform sum is pre-guaranteed.",
      "### Mandatory Supporting Financial Documents",
      "Applicants must attach complete verified photocopies of the following records to their physical application:\n1. Salary slips / income certificate / pension book of parent(s) or guardian (for self-employed parents, an affidavit declaring business income on legal stamp paper).\n2. Bank statements of all active family bank accounts for the last six months.\n3. Copies of paid utility bills (Electricity, Gas, Water, and Telephone/Internet) for the last six months.\n4. Copy of rental agreement (if residing in a rented house).\n5. Paid fee receipts of siblings currently studying in schools, colleges, or universities.\n6. Medical bills or prescription records (in case of serious or chronic medical illness of any family member).\n7. Copy of CNIC of applicant and parents/guardian.\n8. Death certificate of father/guardian (if applicable).",
      "### Two-Tier Application Submission Procedure",
      "Applying for the scholarship requires completing both an online form and a physical form by appointment:\n\n1. **Step 1 – Download the Physical Form:**\n   - Download the official physical application form: [https://bit.ly/SNBSPPhysicalForm](https://bit.ly/SNBSPPhysicalForm) (or [https://bit.ly/SNBSP26PForm](https://bit.ly/SNBSP26PForm)).\n   - Fill out the form completely and attach all mandatory supporting documents listed above.\n\n2. **Step 2 – Submit the Online Form:**\n   - Access the online form: [https://bit.ly/SNBSPOnlineForm](https://bit.ly/SNBSPOnlineForm) (or [https://bit.ly/SNBSP26OnlineForm](https://bit.ly/SNBSP26OnlineForm)).\n   - **Important:** The online form can only be accessed using your official SZABIST student email address ending with `@szabist.pk`.\n\n3. **Step 3 – Book an In-Person Appointment:**\n   - Once your online form is submitted, the ERFA Department will email you a dedicated appointment booking link.\n   - Select an available date and time slot.\n\n4. **Step 4 – Physical Submission at ERFA Department:**\n   - Visit **Room No. 5, ERFA Department, 153 Campus, SZABIST University Karachi** on your scheduled appointment date.\n   - Hand over the completed physical form and all original and photocopied supporting documents.",
      "### Critical Appointment Rules & Submission Warnings",
      "> [!WARNING]\n> - **Strict Appointment Policy:** Physical forms will strictly **NOT be accepted without a prior appointment**.\n> - **No Walk-Ins:** Walk-in submissions will be turned away immediately.\n> - **Single Booking Rule:** Each student is allowed to book **only one appointment**. Multiple bookings will result in the immediate cancellation of all appointments, and the student will forfeit the opportunity to apply.\n> - **Punctuality:** Students must arrive at least 5 minutes before their scheduled appointment time.\n> - **Completeness:** Both online and physical submissions are mandatory. Missing either step will result in immediate disqualification.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for SZABIST Need-Based Scholarship 2026–27?**\nThe final deadline for form submission is **21 October 2026**.\n\n**Q2: What is the maximum family income limit?**\nThe total annual gross family income must not exceed **Rs. 1,500,000/-** (1.5 Million PKR).\n\n**Q3: Are PhD students eligible for this scholarship?**\nNo. As per official SZABIST policy, PhD students are strictly not eligible for this need-based assistance.\n\n**Q4: Can I submit the physical form without booking an appointment?**\nNo. Physical forms will strictly not be accepted without a prior appointment. Walk-in submissions are prohibited.\n\n**Q5: Can I access the online application form with a personal Gmail account?**\nNo. The online form can only be accessed using your official university student email address ending with `@szabist.pk`.\n\n**Q6: What is the contact email for the ERFA Department?**\nYou can contact the department at `erfa@szabist.edu.pk` or call 021-35823433 (Ext 371)."
    ]
  }
]

export function publish() {
  console.log('=== PUBLISHING 5 FRESH OCT 8 ARTICLES ON CAREERDOST ===\n')

  // 1. Seed local careerdost.sqlite database
  const db = new Database('careerdost.sqlite')

  const insertArticle = db.prepare(`
    INSERT OR REPLACE INTO articles (
      slug, title, category_slug, organization, job_type, location,
      qualification, salary, last_date, publish_date, official_link,
      featured, logo_initial, excerpt, content, seo_title, meta_description,
      status, featured_image, image_alt, experience, positions, apply_link,
      is_verified, focus_keyword, canonical_url, og_title, og_description, updated_at
    ) VALUES (
      @slug, @title, @category_slug, @organization, @job_type, @location,
      @qualification, @salary, @last_date, @publish_date, @official_link,
      @featured, @logo_initial, @excerpt, @content, @seo_title, @meta_description,
      'published', @featured_image, @image_alt, @experience, @positions, @apply_link,
      @is_verified, @focus_keyword, @canonical_url, @og_title, @og_description, CURRENT_TIMESTAMP
    )
  `)

  const insertDailyUpdate = db.prepare(`
    INSERT OR REPLACE INTO daily_updates (
      slug, title, category, short_description, content, featured_image,
      image_alt, official_link, apply_link, deadline, publish_date,
      organization, location, qualification, experience, positions,
      job_type, salary, is_verified, featured, seo_title, meta_description,
      focus_keyword, canonical_url, og_title, og_description, status, updated_at
    ) VALUES (
      @slug, @title, @category, @short_description, @content, @featured_image,
      @image_alt, @official_link, @apply_link, @deadline, @publish_date,
      @organization, @location, @qualification, @experience, @positions,
      @job_type, @salary, @is_verified, @featured, @seo_title, @meta_description,
      @focus_keyword, @canonical_url, @og_title, @og_description, 'published', CURRENT_TIMESTAMP
    )
  `)

  const catMap = {
    scholarships: 'Scholarships',
    admissions: 'Admissions',
    internships: 'Internships',
    results: 'Results',
    'government-jobs': 'Government Jobs'
  }

  for (const item of oct8Articles) {
    const contentJson = JSON.stringify(item.content)
    const catLabel = catMap[item.category] || 'Admissions'

    insertArticle.run({
      slug: item.slug,
      title: item.title,
      category_slug: item.category,
      organization: item.organization,
      job_type: item.jobType,
      location: item.location,
      qualification: item.qualification,
      salary: item.salary,
      last_date: item.lastDate,
      publish_date: item.publishDate,
      official_link: item.officialLink,
      featured: item.featured ? 1 : 0,
      logo_initial: item.logoInitial,
      excerpt: item.excerpt,
      content: contentJson,
      seo_title: item.seoTitle,
      meta_description: item.metaDescription,
      featured_image: item.featuredImage,
      image_alt: item.imageAlt,
      experience: item.experience,
      positions: item.positions,
      apply_link: item.applyLink,
      is_verified: item.isVerified ? 1 : 0,
      focus_keyword: item.focusKeyword,
      canonical_url: item.canonicalUrl,
      og_title: item.ogTitle,
      og_description: item.ogDescription
    })

    insertDailyUpdate.run({
      slug: item.slug,
      title: item.title,
      category: catLabel,
      short_description: item.excerpt,
      content: contentJson,
      featured_image: item.featuredImage,
      image_alt: item.imageAlt,
      official_link: item.officialLink,
      apply_link: item.applyLink,
      deadline: item.lastDate,
      publish_date: item.publishDate,
      organization: item.organization,
      location: item.location,
      qualification: item.qualification,
      experience: item.experience,
      positions: item.positions,
      job_type: item.jobType,
      salary: item.salary,
      is_verified: item.isVerified ? 1 : 0,
      featured: item.featured ? 1 : 0,
      seo_title: item.seoTitle,
      meta_description: item.metaDescription,
      focus_keyword: item.focusKeyword,
      canonical_url: item.canonicalUrl,
      og_title: item.ogTitle,
      og_description: item.ogDescription
    })
  }

  console.log('Seeded local careerdost.sqlite successfully.')

  // Set explicit priority IDs for local SQLite (using temp offset to avoid uniqueness conflicts)
  // Desired Priority:
  // 1. SBBU Merit List -> 315 / 215
  // 2. ISMO Jobs -> 314 / 214
  // 3. NICVD Jobs -> 313 / 213
  // 4. Sindh BS Nursing -> 312 / 212
  // 5. SZABIST Scholarship -> 311 / 211
  const idMap = [
    { slug: 'sbbu-merit-list-2027', artId: 315, updId: 215 },
    { slug: 'ismo-jobs-2026', artId: 314, updId: 214 },
    { slug: 'nicvd-jobs-2026', artId: 313, updId: 213 },
    { slug: 'sindh-bs-nursing-admissions-2026-27', artId: 312, updId: 212 },
    { slug: 'szabist-scholarship-2026-27', artId: 311, updId: 211 }
  ]

  for (let i = 0; i < idMap.length; i++) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(6000 + i, idMap[i].slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(6000 + i, idMap[i].slug)
  }

  for (const m of idMap) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(m.artId, m.slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(m.updId, m.slug)
  }
  console.log('Updated priority IDs in local SQLite.')

  // 2. Prepend to src/data/listings.js
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')
  
  const formattedItems = oct8Articles.map(a => {
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
    
    if (!listingsCode.includes('sbbu-merit-list-2027')) {
      listingsCode = listingsCode.slice(0, insertPos) + prependedCode + listingsCode.slice(insertPos)
      listingsCode = listingsCode.replace(/Updated:\s*\d{4}-\d{2}-\d{2}/, 'Updated: 2026-10-08')
      fs.writeFileSync(listingsPath, listingsCode, 'utf8')
      console.log('Successfully updated src/data/listings.js with 5 new articles!')
    } else {
      console.log('src/data/listings.js already contains new articles.')
    }
  }

  // 3. Update scripts/generate_sitemap.js to include the 5 new updates
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')
  if (!sitemapScript.includes('sbbu-merit-list-2027')) {
    const insertPattern = 'const publishedDailyUpdates = [\n'
    const newSitemapEntries = `  { slug: 'sbbu-merit-list-2027', date: '2026-10-08' },\n  { slug: 'ismo-jobs-2026', date: '2026-10-08' },\n  { slug: 'nicvd-jobs-2026', date: '2026-10-08' },\n  { slug: 'sindh-bs-nursing-admissions-2026-27', date: '2026-10-08' },\n  { slug: 'szabist-scholarship-2026-27', date: '2026-10-08' },\n`
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + newSitemapEntries)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('Updated scripts/generate_sitemap.js with new slugs.')
  }
}

if (process.argv[1] && process.argv[1].endsWith('publish_oct8_articles.js')) {
  publish()
}
