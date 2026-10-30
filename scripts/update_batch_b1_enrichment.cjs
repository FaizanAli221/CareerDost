const fs = require('fs');
const Database = require('better-sqlite3');
const localDb = new Database('careerdost.sqlite');
const crypto = require('crypto');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

const env = fs.readFileSync('.env.local', 'utf8');
const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

const batchB1Articles = [
  {
    slug: 'comsats-university-jobs-faculty-staff-2026',
    title: 'COMSATS University Islamabad Jobs 2026: Teaching Faculty & Administrative Vacancies Guide',
    lastDate: '2026-10-25',
    metaDescription: 'COMSATS University Islamabad (CUI) faculty and administrative recruitment guide. Review campus locations, HEC criteria, application portal status, and FAQs.',
    seoTitle: 'COMSATS University Islamabad Jobs 2026 — Faculty & Staff Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** COMSATS University Islamabad (CUI).\n> - **Designations:** Faculty (Professors, Associate Professors, Assistant Professors, Lecturers) and Administrative Staff.\n> - **Application Deadline:** The online application portal closed on **25 October 2026**.\n> - **Current Selection Stage:** Scrutiny of academic publications and qualification dossiers by campus HR scrutiny committees.\n> - **Official Careers Portal:** [careers.comsats.edu.pk](https://careers.comsats.edu.pk/).',
      '### Institution & Recruitment Overview',
      'COMSATS University Islamabad (CUI)—a premier public-sector chartered university established under federal charter—regularly invites applications from qualified academicians and research scholars across its multi-campus network in Islamabad, Lahore, Wah, Abbottabad, Attock, Sahiwal, and Vehari. The 2026 recruitment drive targeted specialized disciplines in Computer Science, Artificial Intelligence, Electrical Engineering, Management Sciences, and Basic Sciences.',
      '### Faculty Eligibility & Academic Standards',
      '| Academic Position | Minimum Academic Qualification | Mandatory Experience & Research Publications |\n| :--- | :--- | :--- |\n| **Professor (TTS / BPS)** | PhD in relevant discipline from an HEC-recognized university | 10 to 15 years teaching/research experience + minimum 15 HEC-indexed research papers |\n| **Associate Professor** | PhD in relevant discipline | 5 to 10 years postgraduate experience + minimum 10 research papers in recognized journals |\n| **Assistant Professor** | PhD in relevant field | Relevant research thesis; prior university teaching experience preferred |\n| **Lecturer** | MS / MPhil (18 Years) with minimum 3.0 CGPA | Sound academic record with no third division in entire academic career |',
      '### Selection Procedure & Scrutiny Framework',
      '1. **Online Dossier Submission:** Candidates completed profile creation and uploaded verified transcripts via [careers.comsats.edu.pk](https://careers.comsats.edu.pk/).\n2. **Processing Fee Verification:** Payment of non-refundable processing fee deposited in CUI designated collection accounts.\n3. **Subject Scrutiny Committee:** Verification of degree equivalence (for foreign degrees from HEC) and research impact factors.\n4. **Selection Board & Syndicate Approval:** Shortlisted candidates appear before the Statutory Selection Board for formal interview and teaching demonstration.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: How will shortlisted candidates be notified for interviews?**\nShortlisted applicants receive official call letters via registered email and post. Candidates can also check application tracking on the CUI careers dashboard.\n\n**Q2: Does COMSATS offer Tenure Track System (TTS) appointments?**\nYes. Qualified PhD scholars are recruited under both the standard Regular BPS scales and the Higher Education Commission Tenure Track System (TTS).'
    ]
  },
  {
    slug: 'punjab-university-jobs-faculty-staff-2026',
    title: 'Punjab University Jobs 2026: Teaching Faculty & Officer Positions Guide',
    lastDate: '2026-11-30',
    metaDescription: 'University of the Punjab (PU) Lahore 2026 jobs guide. Explore faculty openings, officer scales, HEC qualification requirements, and online application guidelines.',
    seoTitle: 'Punjab University Jobs 2026 — Faculty & Officer Careers Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Active Cycle):**\n> - **Hiring Institution:** University of the Punjab (PU), Quaid-e-Azam Campus (New Campus) & Allama Iqbal Campus (Old Campus), Lahore.\n> - **Positions:** Academic Faculty (Assistant Professors, Lecturers) and Administrative Officers.\n> - **Closing Date:** Official closing date for receipt of hard-copy dossiers is **30 November 2026**.\n> - **Official Recruitment Gateway:** [pu.edu.pk/careers](https://pu.edu.pk/careers/).',
      '### Overview of Academic & Departmental Openings',
      'The **University of the Punjab (PU)**, established in 1882, is Pakistan’s oldest comprehensive public university. PU periodically advertises statutory academic and officer vacancies across its constituent faculties, including Computing & Information Technology, Law, Pharmacy, Behavioral Sciences, and Engineering & Technology.',
      '### Eligibility Matrix by Cadre',
      '| Cadre / Position | Required Qualification | Department / Faculty |\n| :--- | :--- | :--- |\n| **Assistant Professor (BPS-19 / TTS)** | PhD in relevant discipline from HEC-recognized institution | Information Technology, Molecular Biology, Economics, Management |\n| **Lecturer (BPS-18)** | Master’s degree / MPhil (18 years) with first division | English, History, Sociology, Mass Communication |\n| **Assistant Registrar / Treasurer (BPS-17)** | Master’s or 16-year degree in Administration, Finance, or Commerce | General Administration & Accounts Branch |',
      '### Application Steps & Submission Protocol',
      '1. **Online Form Registration:** Applicants must fill out the prescribed application form online at the [PU Job Portal](https://pu.edu.pk/careers/).\n2. **Bank Challan Deposit:** Deposit the prescribed application fee at the Habib Bank Limited (HBL) PU branch or online via designated fee channels.\n3. **Hard-Copy Dossier Dispatch:** Print the completed form and dispatch signed copies along with attested photocopies of CNIC, academic degrees, transcripts, experience certificates, and research papers to the **Office of the Deputy Registrar (Admin-II), Punjab University, Lahore** before the closing deadline.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is hard-copy submission mandatory after online application?**\nYes. At Punjab University, applications are considered incomplete unless the signed physical dossier with all attested supporting documents reaches the Registrar’s Office within the specified deadline.\n\n**Q2: Are government employees eligible for age relaxation?**\nGovernment employees applying through proper channel (with departmental NOC) receive statutory age relaxation according to Punjab Government recruitment rules.'
    ]
  },
  {
    slug: 'pidcl-site-engineer-jobs-2026',
    title: 'PIDCL Site Engineer Jobs 2026: Civil Engineering Vacancies via National Job Portal',
    lastDate: '2026-10-11',
    metaDescription: 'PIDCL Site Engineer (Civil) recruitment guide (Job ID 9777) via NJP. Review eligibility, PEC registration requirement, test locations, and selection status.',
    seoTitle: 'PIDCL Site Engineer Jobs 2026 — Civil Engineering NJP Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Entity:** Pakistan Infrastructure Development Company Ltd. (PIDCL), Ministry of Communications.\n> - **Vacancy:** Site Engineer (Civil) — 5 Positions (Job ID 9777).\n> - **Application Window:** Registrations on the National Job Portal (NJP) closed on **11 October 2026**.\n> - **Current Selection Status:** Candidate credential evaluation and PEC registration verification.\n> - **Official Portal Gateway:** [njp.gov.pk](https://njp.gov.pk/).',
      '### Project Context & Role Responsibilities',
      'Pakistan Infrastructure Development Company Ltd. (PIDCL) executes federal road networks, bridge engineering, and multi-lane highway infrastructure projects across Pakistan. Site Engineers ensure on-site quality assurance, structural compliance with National Highway Authority (NHA) standards, material laboratory testing, and contractor progress certification.',
      '### Key Specifications Table',
      '| Parameter | Official Recruitment Criterion |\n| :--- | :--- |\n| **Hiring Enterprise** | Pakistan Infrastructure Development Company Ltd. (PIDCL) |\n| **Designation** | Site Engineer (Civil) |\n| **Total Vacancies** | 05 Posts (Federal Merit & Provincial Quotas) |\n| **Minimum Qualification** | BE / BSc in Civil Engineering from an HEC-recognized university |\n| **Professional Accreditation** | Valid Professional Engineer (PE) or Registered Engineer (RE) card from PEC |\n| **Minimum Experience** | 3 to 5 years in highway construction, asphalt testing, and site supervision |',
      '### Selection Procedure & Next Milestones',
      '- **Shortlisting:** Based on academic merit, PEC registration validity, and relevant infrastructure construction experience.\n- **Written / Technical Screening:** Candidates meeting preliminary criteria may be summoned for technical assessments covering structural mechanics, survey data analysis, and FIDIC contract conditions.\n- **Interview & Deployment:** Final interviews conducted at PIDCL head office in Islamabad prior to field site deployment.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Was PEC registration mandatory for this vacancy?**\nYes. Professional registration with the Pakistan Engineering Council (PEC) is a statutory requirement for all civil engineering appointments under PIDCL.\n\n**Q2: Where will selected engineers be stationed?**\nSuccessful candidates are deployed at active highway and infrastructure project sites across Punjab, Sindh, Khyber Pakhtunkhwa, and Balochistan.'
    ]
  },
  {
    slug: 'uoh-haripur-admissions-2026-deadline-today',
    title: 'University of Haripur Admissions 2026: Programs, Merit Criteria & Admission Guide',
    lastDate: '2026-09-29',
    metaDescription: 'University of Haripur (UOH) Fall 2026 admissions guide. Review BS, MPhil, and postgraduate degree offerings, entry test criteria, and admission cycle status.',
    seoTitle: 'University of Haripur Admissions 2026 — Programs & Merit Guide',
    content: [
      '> [!NOTE]\n> **Admissions Status Notice (Fall Cycle Concluded):**\n> - **Institution:** University of Haripur (UOH), Khyber Pakhtunkhwa.\n> - **Intake:** Fall 2026 Undergraduate (BS 4-Year), BS 5th Semester & Graduate Admissions.\n> - **Closing Date:** Online form submission closed on **29 September 2026**.\n> - **Admission Status:** Merit lists published and departmental fee deposits concluded. Prospective candidates should review guidelines for upcoming Spring intakes.\n> - **Official University Portal:** [uoh.edu.pk](https://www.uoh.edu.pk/).',
      '### Academic Offerings & Faculty Structure',
      'The **University of Haripur (UOH)** is a leading public university in the Hazara division of Khyber Pakhtunkhwa. It offers accredited degree programs across four major faculties: Natural Sciences, Social Sciences, Information Technology & Computing, and Management Sciences.',
      '### Program Eligibility & Weightage Framework',
      '| Degree Level | Eligible Disciplines | Minimum Entry Criteria |\n| :--- | :--- | :--- |\n| **BS 4-Year Programs** | Computer Science, Software Engineering, Biotechnology, English, BBA | Minimum 50% marks in HSSC / Intermediate (Pre-Engineering/Pre-Medical/ICS) |\n| **BS 5th Semester (Lateral Entry)** | Chemistry, Economics, Islamic Studies, Mathematics | 14-Year BA / BSc / ADP degree with at least 45% marks |\n| **MS / MPhil Programs** | Management Sciences, Computer Science, Environmental Sciences | 16-Year BS / MSc degree with minimum 2.5 CGPA + UOH / NTS GAT Test |',
      '### Merit Calculation Formula',
      '- **Matriculation (SSC):** 20% weightage.\n- **Intermediate (HSSC):** 50% weightage.\n- **Entry Screening / Academic Test:** 30% weightage.\n- Final merit lists are displayed on the university notice board and uploaded to the official website departmental portals.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: When does University of Haripur open Spring admissions?**\nUOH typically announces Spring admissions in December or January for select undergraduate, BS lateral entry, and postgraduate disciplines.\n\n**Q2: Does UOH provide transport and hostel facilities?**\nYes. UOH provides dedicated hostel accommodation for outstation students and extensive shuttle bus transport covering Haripur, Abbottabad, Wah Cantt, and Taxila.'
    ]
  },
  {
    slug: 'hec-usat-hat-registration-2026-etc-hec',
    title: 'HEC USAT & HAT Registration 2026: Test Dates, Syllabus & ETC Portal Guide',
    lastDate: '2026-10-02',
    metaDescription: 'HEC Undergraduate Studies Admission Test (USAT) & Higher Education Aptitude Test (HAT) guide via ETC portal. Explore syllabus breakdown, scoring, and test schedule.',
    seoTitle: 'HEC USAT & HAT 2026 Registration — ETC Test Guide',
    content: [
      '> [!NOTE]\n> **Testing Schedule Notice (Registration Concluded):**\n> - **Conducting Agency:** Education Testing Council (ETC), Higher Education Commission (HEC) Pakistan.\n> - **Test Categories:** USAT (Undergraduate Studies Admission Test) & HAT (Higher Education Aptitude Test for MS/MPhil/PhD).\n> - **Registration Window:** Online registrations closed on **02 October 2026**.\n> - **Portal Gateway:** [etc.hec.gov.pk](https://etc.hec.gov.pk/).',
      '### Purpose & Academic Scope of USAT and HAT',
      'The **Higher Education Commission (HEC)** conducts standardized aptitude tests through its specialized testing wing, the **Education Testing Council (ETC)**. USAT scores are utilized by major Pakistani universities for undergraduate bachelor admissions, while HAT scores are mandatory for HEC indigenous scholarships, overseas PhD schemes, and postgraduate admissions nationwide.',
      '### Test Categories & Curriculum Matrix',
      '| Test Name | Target Degree Level | Test Sections & Weightage |\n| :--- | :--- | :--- |\n| **USAT-E / USAT-M** | Pre-Engineering & Pre-Medical Undergraduates | Verbal Reasoning (35), Quantitative Reasoning (40), Physics/Chemistry/Math/Bio (25) |\n| **USAT-CS / USAT-A** | Computer Science & Arts / Humanities | Verbal Reasoning, Analytical Reasoning, General Math, Basic Computing |\n| **HAT-1 to HAT-4** | MS / MPhil & PhD Candidates across disciplines | English Verbal (30%), Analytical Reasoning (40%), Quantitative Reasoning (30%) |',
      '### Scoring Standards & Validity Period',
      '- **Passing Score:** Minimum 50 marks out of 100 for general qualification.\n- **Score Validity:** HEC USAT and HAT scorecards remain valid for admission and scholarship purposes for **two years** from the official result announcement date.\n- **Roll Number Slips:** Registered candidates download slips from the ETC portal one week prior to the designated test date.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: How can students verify their ETC test results?**\nScorecards are accessible by logging into [etc.hec.gov.pk](https://etc.hec.gov.pk/) using CNIC credentials, with official paper result cards dispatched to registered addresses.\n\n**Q2: Can a candidate reappear to improve their HAT / USAT score?**\nYes. Candidates can register for subsequent test quarters to improve their score; universities accept the highest valid score.'
    ]
  },
  {
    slug: 'sbbu-fully-funded-scholarship-2026',
    title: 'SBBU Fully Funded Scholarship 2026: 100% Tuition Fee Waiver & Eligibility Guide',
    lastDate: '2026-09-29',
    metaDescription: 'Shaheed Benazir Bhutto University (SBBU) Sheringal fully funded scholarship guide. Review financial aid criteria, eligible departments, and application rules.',
    seoTitle: 'SBBU Fully Funded Scholarship 2026 — Complete Student Guide',
    content: [
      '> [!NOTE]\n> **Financial Aid Status Notice (Application Cycle Concluded):**\n> - **Awarding University:** Shaheed Benazir Bhutto University (SBBU), Sheringal, Dir Upper, KP.\n> - **Scholarship Package:** 100% Tuition Fee Waiver and Merit Support for Needy Students.\n> - **Application Deadline:** The financial assistance application window closed on **29 September 2026**.\n> - **Current Status:** Applications reviewed by the Institutional Scholarship Award Committee (ISAC).\n> - **Official University Portal:** [sbbu.edu.pk](https://sbbu.edu.pk/).',
      '### Scholarship Objectives & Financial Coverage',
      'Shaheed Benazir Bhutto University (SBBU) Sheringal offers institutional merit and need-based scholarships to ensure that talented students from underprivileged districts of Khyber Pakhtunkhwa can pursue higher education without financial distress. The scheme covers complete semester tuition fees for eligible undergraduate and postgraduate programs.',
      '### Eligibility & Need Assessment Criteria',
      '| Parameter | Verified Criterion |\n| :--- | :--- |\n| **Eligible Programs** | Full-time BS 4-Year and MS / MPhil degree programs at SBBU Main Campus |\n| **Academic Standing** | Minimum 60% marks in intermediate or minimum 2.5 CGPA in ongoing university semesters |\n| **Household Income Ceiling** | Total family monthly income should not exceed Rs. 50,000 (verified via income certificate) |\n| **Ineligibility** | Students currently receiving other government or international scholarships (e.g., HEC Ehsaas) |',
      '### Required Documentation Checklist',
      '1. Salary slip or authorized income certificate from the Union Council / Revenue authority.\n2. Attested copies of electricity and gas utility bills for the preceding three months.\n3. Copy of Father / Guardian CNIC and applicant CNIC or B-Form.\n4. Educational marksheets and fee challan vouchers of enrolled siblings.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is the scholarship renewed automatically each semester?**\nRenewal is contingent upon maintaining a minimum semester GPA of 2.5 and satisfactory attendance.\n\n**Q2: Who decides the final scholarship award?**\nFinal selections are made by the SBBU Institutional Scholarship Award Committee (ISAC) following physical applicant interviews.'
    ]
  },
  {
    slug: 'sbbu-naushahro-feroze-entry-test-2027',
    title: 'SBBU Naushahro Feroze Entry Test 2027: Admit Cards, Syllabus & Test Schedule',
    lastDate: '2026-10-18',
    metaDescription: 'Shaheed Benazir Bhutto University (SBBU) SBA Naushahro Feroze Campus entry test guide for 2027. Review test pattern, syllabus, passing marks, and slip instructions.',
    seoTitle: 'SBBU Naushahro Feroze Entry Test 2027 — Syllabus & Schedule Guide',
    content: [
      '> [!NOTE]\n> **Examination Status Notice (Test Cycle Concluded):**\n> - **Conducting Campus:** Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad — Naushahro Feroze Campus.\n> - **Examination:** Pre-Admission Entry Test for Academic Year 2026–27.\n> - **Test Date:** Entry test was conducted on **18 October 2026**.\n> - **Current Stage:** Merit lists compiled and orientation schedules announced for admitted students.\n> - **Official Portal Gateway:** [sbbusba.edu.pk](https://sbbusba.edu.pk/).',
      '### Campus Background & Testing Scope',
      'The **Naushahro Feroze Campus** of Shaheed Benazir Bhutto University provides higher education opportunities in central Sindh. The annual entry test assesses candidate aptitude for undergraduate degrees in Computer Science, Business Administration, English, and Education.',
      '### Test Pattern & Component Breakdown',
      '| Subject Area | Number of MCQs | Syllabus Coverage |\n| :--- | :--- | :--- |\n| **English Language** | 30 MCQs | Vocabulary, grammar, reading comprehension, and error correction |\n| **General Mathematics** | 30 MCQs | Basic arithmetic, algebra, percentages, ratios, and geometry |\n| **General Knowledge & Pakistan Studies** | 20 MCQs | National current affairs, geography, Islamic studies, and history |\n| **Basic Computing & Analytical Aptitude** | 20 MCQs | Fundamental computing concepts and logical problem solving |',
      '### Examination Guidelines & Passing Threshold',
      '- **Total Marks:** 100 Marks (All multiple-choice questions).\n- **Negative Marking:** There is **no negative marking** in the SBBU entry test.\n- **Passing Standard:** Candidates must achieve at least 40% aggregate marks to qualify for the departmental merit ranking list.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Where are official test results published?**\nResults are posted on the university website [sbbusba.edu.pk](https://sbbusba.edu.pk/) and displayed on the campus notice board.\n\n**Q2: What is the weightage of the entry test in final admission merit?**\nFinal merit is computed with 50% weightage given to the entry test score and 50% to Intermediate (HSSC) marks.'
    ]
  },
  {
    slug: 'lums-electronic-technician-jobs-2026',
    title: 'LUMS Electronic Technician Jobs 2026: Laboratory Engineering Role Guide',
    lastDate: '2026-10-19',
    metaDescription: 'LUMS Lahore Electronic Technician recruitment guide for the National Centre for Nano-science & Nanotechnology. Review DAE / B.Tech criteria, duties, and portal details.',
    seoTitle: 'LUMS Electronic Technician Jobs 2026 — Engineering Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Institution:** Lahore University of Management Sciences (LUMS), Syed Babar Ali School of Science and Engineering (SBASSE).\n> - **Position:** Electronic Technician — National Centre for Nano-science & Nanotechnology (NCNN).\n> - **Application Deadline:** Applications closed on **19 October 2026**.\n> - **Current Selection Status:** Technical evaluation and laboratory practical interview scheduling.\n> - **Official Careers Gateway:** [hr.lums.edu.pk](https://hr.lums.edu.pk/).',
      '### Departmental Role & Technical Scope',
      'The **National Centre for Nano-science and Nanotechnology (NCNN)** at LUMS SBASSE is an advanced research facility housing electron microscopy, cleanrooms, and nanofabrication apparatus. The Electronic Technician ensures proper operation, circuit troubleshooting, PCB diagnostics, and routine preventative calibration for high-precision analytical equipment.',
      '### Job Specifications Table',
      '| Parameter | Verified Job Requirement |\n| :--- | :--- |\n| **Employer** | Lahore University of Management Sciences (LUMS) |\n| **Department** | Syed Babar Ali School of Science & Engineering (SBASSE) |\n| **Job Location** | DHA Phase 5, Lahore, Punjab |\n| **Required Qualification** | DAE (Diploma of Associate Engineering) or B.Tech in Electronics / Electrical |\n| **Technical Experience** | 2 to 4 years in electronics hardware maintenance, lab instrumentation, and soldering |\n| **Specialized Skills** | Oscilloscopes, power supplies, microcontroller circuits, cleanroom safety protocols |',
      '### Core Duties & Workflows',
      '- **Equipment Maintenance:** Diagnosing electronic instrumentation faults, repairing laboratory power distribution boards, and replacing sensitive electronic components.\n- **Preventative Servicing:** Maintaining calibration logs, checking grounding connections, and assisting graduate researchers during experiment setup.\n- **Laboratory Safety:** Ensuring compliance with high-voltage and laboratory chemical electrical safety standards.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Does LUMS offer medical insurance and staff benefits?**\nYes. LUMS offers market-competitive salaries, comprehensive health coverage, life insurance, and contributory provident fund facilities for full-time technical staff.\n\n**Q2: How does LUMS notify applicants for technical tests?**\nShortlisted technicians are contacted via email and telephone by the LUMS Human Resources department.'
    ]
  },
  {
    slug: 'isra-university-ms-mphil-phd-spring-2027',
    title: 'Isra University MS, MPhil & PhD Admissions Spring 2027: Programs & Schedule Guide',
    lastDate: '2026-11-17',
    metaDescription: 'Isra University Spring 2027 postgraduate admissions guide. Explore MS, MPhil, and PhD offerings in Health Sciences, Computing, and Management, with eligibility rules.',
    seoTitle: 'Isra University Spring 2027 Postgraduate Admissions — Complete Guide',
    content: [
      '> [!NOTE]\n> **Admissions Status Notice (Active Intake):**\n> - **Institution:** Isra University (Hyderabad, Karachi, and Islamabad Campuses).\n> - **Intake:** Spring 2027 Postgraduate Admissions (MS, MPhil, and PhD).\n> - **Application Deadline:** First admission drive closes on **17 November 2026**.\n> - **Official Admissions Gateway:** [apply.isra.edu.pk](https://apply.isra.edu.pk/).',
      '### Academic Overview & Postgraduate Disciplines',
      'Isra University—chartered by the Government of Sindh and recognized by HEC—offers multidisciplinary postgraduate degree programs. The Spring 2027 session invites applications across the Faculty of Medicine & Allied Medical Sciences, Faculty of Engineering & Technology, and Faculty of Commerce, Economics & Management Sciences.',
      '### Program Matrix & Entry Requirements',
      '| Degree Level | Faculty / Disciplines | Minimum Admission Requirements |\n| :--- | :--- | :--- |\n| **MS / MPhil Programs** | Computer Science, Software Engineering, Management Sciences, Physiology | 16-Year BS / MSc degree with minimum 2.50 CGPA (or 60% marks) + Isra GAT Test |\n| **MPhil Basic Medical Sciences** | Anatomy, Pathology, Pharmacology, Biochemistry | MBBS / BDS degree registered with PMDC + 1-year house job experience |\n| **PhD Programs** | Health Sciences, Computer Science, Management Sciences | 18-Year MS/MPhil in relevant field with minimum 3.00 CGPA + Research Synopsis |',
      '### Application Procedure & Admission Roadmap',
      '1. **Online Account Creation:** Register an applicant profile on [apply.isra.edu.pk](https://apply.isra.edu.pk/).\n2. **Academic Uploads:** Submit scanned copies of bachelor/master transcripts, PMDC registration (for medical graduates), and CNIC.\n3. **Application Fee Payment:** Pay the processing fee via 1Link, debit card, or designated bank branches.\n4. **Pre-Admission Aptitude Test:** Appear for the university postgraduate entrance test and departmental research interview.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is GAT General conducted by NTS acceptable at Isra University?**\nYes. Candidates with a valid NTS GAT General score of at least 50% are exempted from the university institutional entry test.\n\n**Q2: What campuses offer postgraduate computing programs?**\nMS and PhD programs in Computer Science and Software Engineering are offered at both the Hyderabad and Islamabad campuses.'
    ]
  },
  {
    slug: 'isra-university-mbbs-bds-scholarship-registration-2026',
    title: 'Isra University MBBS & BDS Scholarship 2026–27: Need & Merit Financial Aid Guide',
    lastDate: '2026-11-17',
    metaDescription: 'Isra University MBBS & BDS financial assistance and scholarship guide for 2026–27. Explore eligibility criteria, PMDC fee compliance, and scholarship rules.',
    seoTitle: 'Isra University MBBS & BDS Scholarship 2026 — Financial Aid Guide',
    content: [
      '> [!NOTE]\n> **Financial Assistance Advisory (Admissions Cycle 2026–27):**\n> - **Institution:** Isra University Faculty of Medicine & Allied Medical Sciences.\n> - **Programs:** MBBS & BDS (Hyderabad and Islamabad Campuses).\n> - **Application Window:** Financial assistance applications are submitted alongside the medical admission drive, closing on **17 November 2026**.\n> - **Official Medical Portal:** [apply.isra.edu.pk](https://apply.isra.edu.pk/).',
      '### Medical Scholarship Scope & Objectives',
      'Isra University provides institutional financial assistance, merit awards, and donor-sponsored bursaries for deserving medical and dental students. Because medical education represents a significant financial investment, the university operates a transparent need-cum-merit scholarship committee to support students facing economic hardship.',
      '### Scholarship Eligibility & Financial Tiers',
      '| Scholarship Category | Coverage Level | Qualification Standard |\n| :--- | :--- | :--- |\n| **Academic Merit Scholarship** | Up to 50% tuition waiver | Top 5% ranking in provincial MDCAT and high admission merit score |\n| **Need-Based Financial Assistance** | Partial tuition concession (20% to 50%) | Verified family income below financial aid threshold + strong academic performance |\n| **Kinship Concession** | 10% to 15% tuition concession | Enrolled siblings studying concurrently in Isra University degree programs |',
      '### Mandatory Verification Documents',
      '1. Verified MDCAT result scorecard and PMDC registration verification.\n2. Family income certificates (salary slips or audited tax returns of parents/guardians).\n3. Bank account statements for the past 6 months and municipal utility bills.\n4. Affidavit verifying that the student is not receiving any other commercial or governmental grant.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can first-year MBBS students apply for need-based aid?**\nYes. Admitted medical students can submit financial assistance dossiers to the Student Affairs and Financial Aid Office during orientation week.\n\n**Q2: Does the scholarship cover hostel and examination fees?**\nNo. Institutional scholarships apply exclusively to tuition fees; hostel, mess, and PMDC registration charges must be paid separately by the student.'
    ]
  },
  {
    slug: 'fjwu-paid-lab-engineer-internship-2026',
    title: 'FJWU Paid Lab Engineer Internship 2026: Rawalpindi Engineering Placement Guide',
    lastDate: '2026-10-14',
    metaDescription: 'Fatima Jinnah Women University (FJWU) paid lab engineer internship guide. Review PEC registration criteria, engineering disciplines, stipend, and placement details.',
    seoTitle: 'FJWU Paid Lab Engineer Internship 2026 — Engineering Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Institution:** Fatima Jinnah Women University (FJWU), Rawalpindi.\n> - **Position:** Paid Lab Engineer / Engineering Intern (with valid PEC Number).\n> - **Application Deadline:** The application window closed on **14 October 2026**.\n> - **Current Selection Stage:** Candidate screening and interview notifications by the FJWU Placement Office.\n> - **Official University Gateway:** [fjwu.edu.pk](https://fjwu.edu.pk/).',
      '### Program Overview & Professional Objectives',
      'Fatima Jinnah Women University (FJWU) is Pakistan’s first premier public women’s university. Through its specialized **Placement Office**, FJWU offers structured paid internships for engineering graduates to acquire hands-on laboratory operation, research instrumentation management, and student tutoring experience in accredited engineering departments.',
      '### Candidate Eligibility Specifications',
      '| Criterion | Verified Requirement |\n| :--- | :--- |\n| **Hiring Body** | Fatima Jinnah Women University (FJWU) Placement Office |\n| **Designation** | Paid Lab Engineer / Intern |\n| **Academic Degree** | BE / BSc in Electrical Engineering, Software Engineering, or Computer Engineering |\n| **Regulatory Requirement** | Valid Professional / Registered Engineer Number from Pakistan Engineering Council (PEC) |\n| **Academic Standing** | Minimum CGPA of 2.50 or first division from an HEC-accredited university |\n| **Tenure & Nature** | 6 to 12 months contractual engineering internship with monthly stipend |',
      '### Core Laboratory Responsibilities',
      '- **Lab Equipment Preparation:** Setting up hardware workstations, digital oscilloscopes, circuit trainers, and testing kits for undergraduate engineering practicals.\n- **Student Practical Supervision:** Assisting faculty members during laboratory experiments and demonstrating safe apparatus handling.\n- **Maintenance Logs:** Ensuring lab safety compliance, tracking consumables, and maintaining equipment calibration records.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Was this internship exclusively for female engineering graduates?**\nYes. In accordance with university charter and affirmative placement guidelines, positions at FJWU prioritize female graduates.\n\n**Q2: Does completion of this internship count toward PEC CPD points?**\nYes. Structured laboratory engineering experience under HEC-recognized university supervision counts toward continuing professional development credits.'
    ]
  },
  {
    slug: 'gimhs-hyderabad-bsn-dpt-admissions-2026-phase-2',
    title: 'GIMHS Hyderabad BS Nursing & DPT Admissions 2026: Phase-II Healthcare Programs',
    lastDate: '2026-10-30',
    metaDescription: 'Global Institute of Medical & Health Sciences (GIMHS) Hyderabad Phase-II admissions guide for BS Nursing and DPT. Review PNC criteria, fee structures, and deadlines.',
    seoTitle: 'GIMHS Hyderabad BS Nursing & DPT Admissions 2026 — Phase-II Guide',
    content: [
      '> [!NOTE]\n> **Admissions Status Notice (Phase-II Closed):**\n> - **Institution:** Global Institute of Medical & Health Sciences (GIMHS), Hyderabad, Sindh.\n> - **Programs:** BS Nursing (Generic 4-Year) & Doctor of Physical Therapy (DPT 5-Year).\n> - **Application Deadline:** Phase-II online form submission concluded on **30 October 2026**.\n> - **Current Selection Status:** Entrance test evaluation and interview scheduling for prospective candidates.\n> - **Official Institute Gateway:** [gimhs.edu.pk](https://gimhs.edu.pk/).',
      '### Institute Profile & Healthcare Accreditation',
      'The **Global Institute of Medical & Health Sciences (GIMHS)** in Hyderabad is affiliated with Liaquat University of Medical & Health Sciences (LUMHS), Jamshoro, and recognized by the Pakistan Nursing and Midwifery Council (PNMC) and the Higher Education Commission. Phase-II admissions addressed high demand for professional allied healthcare disciplines.',
      '### Program Eligibility & Duration Matrix',
      '| Degree Program | Duration | Statutory Council | Academic Eligibility |\n| :--- | :--- | :--- | :--- |\n| **BS Nursing (Generic)** | 4 Years + 1 Year Internship | Pakistan Nursing & Midwifery Council (PNMC) | FSc Pre-Medical with minimum 50% marks (Physics, Chemistry, Biology); Age 14–35 years |\n| **Doctor of Physical Therapy (DPT)** | 5 Years Degree | Recognized by HEC & Affiliated with LUMHS | FSc Pre-Medical with minimum 60% aggregate marks |\n| **BS Medical Lab Technology (BS MLT)** | 4 Years Degree | Allied Health Sciences Faculty | FSc Pre-Medical with minimum 50% marks |',
      '### Step-by-Step Admission Process',
      '1. **Online Registration:** Candidates submitted biodata and academic records on the [GIMHS Admission Portal](https://gimhs.edu.pk/).\n2. **Document Verification:** Submission of matric/intermediate certificates, domicile, PRC (Form-C), and CNIC.\n3. **Institutional Entry Test:** Candidates appear for the multiple-choice entrance test covering English, Biology, Chemistry, and Physics.\n4. **Panel Interview:** Assessment of communication skills and clinical career commitment prior to merit list finalization.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Does GIMHS provide clinical hospital attachments?**\nYes. GIMHS students complete mandatory clinical rotations and bed-side internships at designated tertiary teaching hospitals in Hyderabad and Jamshoro.\n\n**Q2: Is hostel accommodation available for female students?**\nYes. GIMHS provides secure, supervised hostel facilities with mess and transport services for female nursing and physical therapy students.'
    ]
  },
  {
    slug: 'niahs-hyderabad-bsn-nursing-admissions-2026-27',
    title: 'NIAHS Hyderabad BS Nursing Admissions 2026–27: 4-Year BSN Degree Guide via NTS',
    lastDate: '2026-10-30',
    metaDescription: 'National Institute of Allied Health Sciences (NIAHS) Hyderabad BS Nursing admissions guide (4th Batch). Review PNC eligibility, NTS entry test, and fee details.',
    seoTitle: 'NIAHS Hyderabad BS Nursing Admissions 2026–27 — Complete Guide',
    content: [
      '> [!NOTE]\n> **Admissions Status Notice (Application Window Closed):**\n> - **Institution:** National Institute of Allied Health Sciences (NIAHS), College of Nursing, Hyderabad.\n> - **Program:** BSc Nursing (Generic) 4-Year Degree (Academic Session 2026–27, 4th Batch).\n> - **Closing Date:** Online applications and fee voucher submission closed on **30 October 2026**.\n> - **Testing Body:** National Testing Service (NTS) Pakistan.\n> - **Official Institute Portal:** [niahs.edu.pk](https://niahs.edu.pk/).',
      '### Institutional Overview & Council Accreditation',
      'The **National Institute of Allied Health Sciences (NIAHS)** College of Nursing, located near Wadhu Wah on the National Highway in Qasimabad, Hyderabad, is a recognized nursing training facility accredited by the **Pakistan Nursing and Midwifery Council (PNMC)** and affiliated with the University of Sindh, Jamshoro. The 4-year degree prepares healthcare professionals for clinical practice in Pakistan and abroad.',
      '### Eligibility Matrix & Age Criteria',
      '| Requirement Parameter | Official Standard |\n| :--- | :--- |\n| **Degree Level** | 4-Year BSc Nursing (Generic) Degree Program |\n| **Academic Prerequisite** | FSc Pre-Medical (Physics, Chemistry, Biology) with minimum 50% marks from a recognized board |\n| **Candidate Age Bracket** | 16 to 35 years as on the application deadline |\n| **Gender Quotas** | Open to both male and female candidates (institutional quota ratio applies) |\n| **Testing Requirement** | Mandatory screening through National Testing Service (NTS) entrance examination |',
      '### Application Steps & Selection Milestones',
      '1. **NTS Online Registration:** Applicants submitted registration forms on the NTS portal and deposited the prescribed test fee at 1Link participating banks.\n2. **Admit Card Issuance:** Roll number slips with test center details in Hyderabad downloaded from the NTS portal.\n3. **Screening Examination:** Test assessing Biology (40%), Chemistry (20%), Physics (20%), and English (20%).\n4. **Merit List & Medical Fitness:** Successful candidates undergo medical examination before seat allocation.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates with an Arts or Computer Science background apply?**\nNo. As per strict Pakistan Nursing and Midwifery Council (PNMC) regulations, only candidates with FSc Pre-Medical (or equivalent O/A Levels with Biology) are eligible.\n\n**Q2: What career pathways follow graduation from NIAHS?**\nGraduates become registered nurses (RN) licensed by the PNMC, qualifying for hospital positions in BPS-16/17, armed forces nursing services, and overseas nursing licensing examinations.'
    ]
  },
  {
    slug: 'sindh-kisan-subsidy-2026-eligibility-payments',
    title: 'Sindh Kisan Subsidy 2026: 25-Acre Farmer Financial Assistance & Hari Card Rules',
    lastDate: 'Cabinet Policy Implementation Cycle',
    metaDescription: 'Sindh Kisan Subsidy and Benazir Hari Card financial package guide. Review 25-acre land eligibility, Rs 1,000 per bag subsidy, verification, and payment timeline.',
    seoTitle: 'Sindh Kisan Subsidy 2026 — 25-Acre Farmer Assistance Guide',
    content: [
      '> [!NOTE]\n> **Public Scheme Status (Active Policy Implementation):**\n> - **Sponsoring Authority:** Government of Sindh, Agriculture, Supply & Prices Department.\n> - **Programme:** Benazir Hari Card / Small Farmer Rabi Wheat Subsidy.\n> - **Coverage:** Small landholders owning or cultivating up to 25 acres across all 30 districts of Sindh.\n> - **Implementation Phase:** Farmer biometrics verification and card issuance underway for the Rabi sowing season.\n> - **Official Verification Portal:** [benazirharicard.gos.pk](https://benazirharicard.gos.pk/).',
      '### Executive Summary of Cabinet Package',
      'To support agricultural productivity and ease financial pressure on small growers, the Sindh Cabinet approved an expansive agricultural support package. The initiative delivers direct financial subsidies for certified wheat seed and fertilizer purchases to registered smallholders cultivating up to 25 acres.',
      '### Farmer Eligibility Matrix',
      '| Parameter | Official Programme Guideline |\n| :--- | :--- |\n| **Beneficiary Farmers** | Small agricultural landholders and tenants (Haris) in Sindh |\n| **Land Ownership Ceiling** | Maximum 25 acres of agricultural land documented in Sindh Board of Revenue records |\n| **Subsidy Amount** | Up to Rs. 1,000 per 50kg bag of certified wheat seed (credited via digital wallet) |\n| **Identification Method** | Computerized National Identity Card (CNIC) + Benazir Hari Card QR registration |\n| **Disbursement Channel** | Direct electronic cash transfer through designated partner banks and mobile wallets |',
      '### Verification & Payment Steps for Farmers',
      '1. **Deh & Taluqa Registration:** Farmers register land ownership records (Form VII / Khata) with the local Taluqa Agriculture Officer or Assistant Commissioner office.\n2. **NADRA Biometric Verification:** Beneficiary identity is authenticated against NADRA citizen records.\n3. **Benazir Hari Card Issuance:** Verified farmers receive their personalized Hari Card enabling digital subsidy redemption at registered seed and fertilizer dealers.\n4. **Subsidy Redemption:** Funds are credited directly to the farmer’s digital account for transparent procurement without middleman deductions.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can tenant farmers (Haris) who do not own land receive this subsidy?**\nYes. Documented tenants cultivating land with verification from the local revenue administration and landowner affidavit are eligible for the Benazir Hari Card scheme.\n\n**Q2: Which department should farmers contact for complaint redressal?**\nThe Sindh Agriculture Department operates field facilitation desks at all district agriculture extension offices.'
    ]
  },
  {
    slug: 'petrol-price-reduced-pakistan-september-2026',
    title: 'Petrol Price Reduction Pakistan: Fortnightly Petroleum Pricing & Tariff Matrix',
    lastDate: '2026-09-29',
    metaDescription: 'Pakistan petrol and diesel prices notification guide. Review fortnightly fuel adjustments, Petroleum Development Levy (PDL), and official pricing breakdown.',
    seoTitle: 'Pakistan Petrol Price Reduction — Fuel Pricing & Tariff Guide',
    content: [
      '> [!NOTE]\n> **Regulatory Notification Notice (Historical Pricing Record):**\n> - **Issuing Authority:** Ministry of Energy (Petroleum Division) / OGRA, Government of Pakistan.\n> - **Subject:** Fortnightly Petroleum Price Adjustment (Effective Late September / Early October 2026).\n> - **Current Status:** Superseded by subsequent fortnightly pricing notifications by the Federal Government.\n> - **Official Source:** [petroleum.gov.pk](https://petroleum.gov.pk/).',
      '### Overview of Fortnightly Fuel Pricing Mechanism',
      'In Pakistan, prices of motor gasoline (petrol) and High-Speed Diesel (HSD) are revised on a fortnightly basis (effective on the 1st and 16th of each month). The Oil and Gas Regulatory Authority (OGRA) computes recommended consumer rates based on international crude oil trends, exchange rate variations, freight charges, and Petroleum Development Levy (PDL) rates notified by the Federal Government.',
      '### Historical Fuel Pricing Matrix (Fortnight Under Review)',
      '| Petroleum Product | Previous Price (Per Litre) | Adjustment Rate | Notified Consumer Price |\n| :--- | :--- | :--- | :--- |\n| **Motor Gasoline (Petrol)** | Rs. 249.10 | - Rs. 2.07 | Rs. 247.03 per litre |\n| **High-Speed Diesel (HSD)** | Rs. 252.30 | - Rs. 3.40 | Rs. 248.90 per litre |\n| **Kerosene Oil (SKO)** | Rs. 165.20 | - Rs. 1.80 | Rs. 163.40 per litre |\n| **Light Diesel Oil (LDO)** | Rs. 147.50 | - Rs. 2.25 | Rs. 145.25 per litre |',
      '### Pricing Components & Levy Framework',
      '- **Ex-Refinery Price:** Represents the base cost of petroleum products based on international Arab Gulf benchmark import parity.\n- **Petroleum Development Levy (PDL):** Statutory federal levy applied in accordance with the Finance Act.\n- **Inland Freight Equalization Margin (IFEM):** Equalizes transport costs across all geographical regions so fuel prices remain uniform throughout Pakistan.\n- **Dealer & OMC Margins:** Fixed commission margins for oil marketing companies and retail petrol pump operators.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: How frequently are petroleum prices updated in Pakistan?**\nPrices are adjusted on a fortnightly cycle by the Ministry of Energy, with official announcements made around midnight on the 15th and the final day of each calendar month.\n\n**Q2: Where can citizens verify official notified fuel rates?**\nOfficial price notifications are uploaded directly on the [OGRA website](https://ogra.org.pk/) and published via state media wire services.'
    ]
  },
  {
    slug: 'uhs-mdcat-2026-result-recount-review-portal',
    title: 'UHS MDCAT Result Recounting 2026: Online Grievance Review & Score Audit Guide',
    lastDate: '2026-09-30',
    metaDescription: 'UHS MDCAT 2026 result recounting and grievance portal guide. Review score recalculation rules, fee voucher process, official timeline, and merit impact.',
    seoTitle: 'UHS MDCAT 2026 Result Recounting — Online Portal & Audit Guide',
    content: [
      '> [!NOTE]\n> **Result Audit Status Notice (Recounting Window Closed):**\n> - **Conducting Body:** University of Health Sciences (UHS), Lahore.\n> - **Scope:** MDCAT 2026 Paper Recounting and Grievance Redressal for Medical Candidates.\n> - **Application Window:** The online recounting application portal closed on **30 September 2026**.\n> - **Current Status:** Official recounting reports processed and consolidated medical merit lists notified by UHS.\n> - **Official Testing Gateway:** [uhs.edu.pk](https://uhs.edu.pk/).',
      '### Overview of MDCAT Result Review Framework',
      'Following the nationwide conduct and official declaration of the Medical & Dental College Admission Test (MDCAT 2026), the **University of Health Sciences (UHS) Lahore** activated an online recounting portal. This facility enabled candidates who suspected optical mark recognition (OMR) discrepancy to formally request a technical recalculation of their answer sheet marks.',
      '### Recounting Parameters & Scope Table',
      '| Review Parameter | Official UHS Statutory Regulation |\n| :--- | :--- |\n| **Governing Authority** | University of Health Sciences (UHS), Lahore |\n| **Eligible Candidates** | All registered candidates who appeared in the Punjab MDCAT center network |\n| **Recounting Scope** | Technical verification of OMR bubble readings, response tallying, and total score calculation |\n| **Re-evaluation Policy** | Under PMDC regulations, subjective reassessment of questions is strictly barred; only mechanical recount is permitted |\n| **Processing Fee** | Non-refundable fee of Rs. 2,000 per recounting application deposited via designated bank vouchers |',
      '### Verification Workflow & Redressal Protocol',
      '1. **Online Grievance Submission:** Candidates logged in with their MDCAT roll number and CNIC on the UHS examination portal.\n2. **Bank Challan Upload:** Candidates uploaded proof of fee payment.\n3. **Optical Response Audit:** The examination committee re-scanned the carbon-copy response sheet against the official answer key matrix.\n4. **Audit Report Issuance:** Candidates received formal outcome letters; if any score variation occurred, revised scorecards were issued and merit ranks updated.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Does paper recounting involve rechecking of question answers?**\nNo. Recounting consists strictly of re-checking that all marked bubbles were scanned and that the numerical addition of marks contains no clerical error.\n\n**Q2: How does a score change affect the MBBS merit list?**\nAny score revision is immediately integrated into the Punjab Centralized Medical and Dental Admission portal to determine adjusted merit rank.'
    ]
  },
  {
    slug: 'gwadar-shipyard-assistant-jobs-2026',
    title: 'Gwadar Shipyard Assistant Jobs 2026: BPS-15 Balochistan Quota Guide via NJP',
    lastDate: '2026-10-10',
    metaDescription: 'Gwadar Shipyard Project Assistant (BPS-15) recruitment guide via NJP. Review Balochistan quota rules, computer literacy criteria, and selection stages.',
    seoTitle: 'Gwadar Shipyard Assistant BPS-15 Jobs 2026 — Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** Project Management Cell, Gwadar Shipyard Project / Ministry of Defence Production.\n> - **Designation:** Assistant (BPS-15) — Special Balochistan Quota.\n> - **Application Deadline:** Registrations on the National Job Portal (NJP) closed on **10 October 2026**.\n> - **Selection Stage:** Document scrutiny and regional screening test scheduling for qualified candidates.\n> - **Official Portal Gateway:** [njp.gov.pk](https://njp.gov.pk/).',
      '### Project Significance & Institutional Role',
      'The **Gwadar Shipyard Project**—a joint mega-infrastructure initiative between the Federal Government of Pakistan and the Government of Balochistan—is developing modern commercial shipbuilding and naval repair capabilities on the Arabian Sea coast. Assistants (BPS-15) handle project correspondence, procurement documentation, record keeping, and coordination with federal ministries.',
      '### Vacancy Specifications Matrix',
      '| Parameter | Official Job Specification |\n| :--- | :--- |\n| **Hiring Enterprise** | Gwadar Shipyard Project, Ministry of Defence Production |\n| **Position Title** | Assistant (BPS-15) |\n| **Pay Scale** | Basic Pay Scale 15 (BPS-15) under Federal Government Rules |\n| **Domicile / Quota** | Strictly reserved for candidates possessing valid Balochistan Domicile / PRC |\n| **Minimum Education** | Bachelor’s Degree (14 Years) from an HEC-recognized university |\n| **IT Requirement** | 6-week Basic IT Training Course (including MS Office) conducted by NITB prior to completion of probation |\n| **Age Bracket** | 18 to 28 years (plus 5 years general federal age relaxation = up to 33 years) |',
      '### Selection Procedure & Testing Milestones',
      '- **Stage 1 — Online Profile Verification:** Candidate biodata, degree credentials, and Balochistan domicile verified via NJP.\n- **Stage 2 — Written / Screening Assessment:** Multiple-choice test covering General English, Pakistan Affairs, Basic Math, and MS Office applications.\n- **Stage 3 — Skill Assessment & Interview:** Typing/computer proficiency verification followed by interview before the Departmental Selection Committee (DSC).',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates from other provinces apply for this post?**\nNo. This specific vacancy is explicitly reserved under the special Balochistan federal provincial employment quota.\n\n**Q2: What is the initial posting location for this position?**\nSelected candidates may be deployed at the Project Management Cell headquarters in Islamabad or the on-site project office in Gwadar, Balochistan.'
    ]
  },
  {
    slug: 'pec-graduate-engineer-training-get-program-2026',
    title: 'PEC Graduate Engineer Training (GET) Program: Placement & Stipend Guide',
    lastDate: '2026-03-25',
    metaDescription: 'Pakistan Engineering Council (PEC) Graduate Engineer Training (GET) placement program guide. Review engineering disciplines, monthly stipend, and selection rules.',
    seoTitle: 'PEC Graduate Engineer Training (GET) Program — Official Guide',
    content: [
      '> [!NOTE]\n> **Official Scheme Status Notice (Batch Placement Active):**\n> - **Executing Authority:** Pakistan Engineering Council (PEC), Islamabad.\n> - **Initiative:** Graduate Engineer Training (GET) Scheme.\n> - **Target Batch:** Fresh engineering graduates holding valid PEC registration.\n> - **Current Operational Stage:** Host company industrial attachments underway for placed engineers; next batch intake notifications released biannually.\n> - **Official Regulatory Portal:** [pec.org.pk](https://www.pec.org.pk/).',
      '### Objectives & Industrial Scope of the GET Scheme',
      'The **Pakistan Engineering Council (PEC)**—the apex statutory regulatory body for the engineering profession—operates the **Graduate Engineer Training (GET)** program. This initiative bridges the transition between academia and industrial engineering practice by subsidizing paid industrial apprenticeships in construction, manufacturing, energy, and technology sectors.',
      '### Eligibility & Placement Specifications',
      '| Feature | Official Specification |\n| :--- | :--- |\n| **Target Beneficiaries** | Fresh Pakistani & AJ&K engineering graduates |\n| **Accreditation Requirement** | Registered Engineer (RE) card issued by PEC |\n| **Graduation Window** | Graduated within the preceding two calendar years from PEC-accredited programs |\n| **Training Duration** | 6 Months structured on-the-job industrial placement |\n| **Monthly Stipend** | Rs. 40,000 to Rs. 50,000 per month (co-funded by PEC and host industrial enterprise) |\n| **Eligible Engineering Disciplines** | Civil, Electrical, Mechanical, Chemical, Mining, Petroleum, and Software Engineering |',
      '### Placement Workflow & Host Enterprise Selection',
      '1. **Online Engineer Roster Registration:** Registered engineers submit profiles and CVs through the [PEC GET Portal](https://www.pec.org.pk/).\n2. **Enterprise Matching:** PEC pairs qualified candidates with accredited engineering consultancies, construction contractors, and industrial plants based on discipline and regional preference.\n3. **Practical Mentorship:** Host firms assign licensed Professional Engineers (PE) to supervise interns across real-world project workflows.\n4. **CPD Credit Certification:** Upon successful completion, interns receive an official PEC training certificate and Continuing Professional Development (CPD) credit points.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: How are candidates selected for placement?**\nSelection is merit-based according to engineering degree CGPA, graduation vintage, and provincial quota allocations.\n\n**Q2: Can GET participants be retained by host companies?**\nYes. A significant percentage of GET trainees receive permanent career job offers from their host firms based on job performance.'
    ]
  }
];

function isHttpUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

async function updateBatchB1() {
  console.log('=== STARTING BATCH B1 CONTENT ENRICHMENT ===');
  console.log('Fetching all live articles to build complete D1 payloads...');

  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });

  if (!resAll.ok) {
    throw new Error(`Failed to fetch admin articles list: ${resAll.status}`);
  }

  const allArticles = (await resAll.json()).data;
  console.log(`Successfully fetched ${allArticles.length} live articles from D1.\n`);

  for (const item of batchB1Articles) {
    const existing = allArticles.find(a => a.slug === item.slug);
    if (!existing) {
      console.warn(`WARNING: Slug not found in D1: ${item.slug}.`);
      continue;
    }

    const officialUrl = isHttpUrl(existing.officialLink) ? existing.officialLink : (isHttpUrl(existing.official_link) ? existing.official_link : 'https://careerdost.blog');
    const applyUrl = isHttpUrl(existing.applyLink) ? existing.applyLink : (isHttpUrl(existing.apply_link) ? existing.apply_link : officialUrl);

    const payload = {
      ...existing,
      title: item.title,
      content: item.content,
      lastDate: item.lastDate,
      category: existing?.category || existing?.category_slug || 'government-jobs',
      officialLink: officialUrl,
      applyLink: applyUrl,
      metaDescription: item.metaDescription,
      seoTitle: item.seoTitle,
      ogTitle: item.title,
      ogDescription: item.metaDescription,
      status: 'published'
    };

    console.log(`>>> Updating Cloudflare D1 for: ${item.slug}`);

    const res = await fetch(`https://careerdost.blog/api/admin/articles/${item.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      console.error(`Error updating D1 for ${item.slug}:`, json);
      throw new Error(`D1 update failed for ${item.slug}`);
    }
    console.log(`SUCCESS: Cloudflare D1 updated for ${item.slug}`);

    // Update local SQLite
    localDb.prepare(`
      UPDATE articles SET
        title = ?,
        content = ?,
        last_date = ?,
        official_link = ?,
        apply_link = ?,
        meta_description = ?,
        seo_title = ?,
        og_title = ?,
        og_description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(
      item.title,
      JSON.stringify(item.content),
      item.lastDate,
      officialUrl,
      applyUrl,
      item.metaDescription,
      item.seoTitle,
      item.title,
      item.metaDescription,
      item.slug
    );
    console.log(`SUCCESS: Local SQLite updated for ${item.slug}\n`);
  }

  console.log('=== BATCH B1 CONTENT ENRICHMENT COMPLETED SUCCESSFULLY ===');
}

updateBatchB1().catch(err => {
  console.error('Fatal error in updateBatchB1:', err);
  process.exit(1);
});
