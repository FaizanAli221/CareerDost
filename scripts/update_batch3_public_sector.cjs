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

const batch3Articles = [
  {
    id: 1,
    slug: 'fpsc-assistant-director-2026',
    title: 'FPSC Assistant Director (BPS-17) Jobs 2026: General Recruitment & Exam Guide',
    lastDate: '2026-10-12',
    metaDescription: 'FPSC Assistant Director (BPS-17) recruitment guide covering Commerce, FIA, and Cabinet Division. Review Treasury Challan Form 32-A, screening syllabus, and quotas.',
    seoTitle: 'FPSC Assistant Director Jobs 2026 (BPS-17) — Exam & Quota Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Commission:** Federal Public Service Commission (FPSC), Islamabad.\n> - **Designation:** Assistant Director (BPS-17) — Consolidated General Recruitment.\n> - **Closing Date:** Online registration on the FPSC portal closed on **12 October 2026**.\n> - **Current Selection Phase:** FPSC Scrutiny Branch is scrutinizing online submissions. Admission certificates (Roll Number Slips) for Phase-1 MCQ screening tests are scheduled for release 2–3 weeks prior to test commencement.\n> - **Official Examination Portal:** [online.fpsc.gov.pk](https://online.fpsc.gov.pk/).',
      '### Federal Assistant Director (BPS-17) Scope',
      'The **Federal Public Service Commission (FPSC)** conducts general recruitment for gazetted Class-I (BPS-17) Assistant Director posts across federal ministries and intelligence/investigation wings including the Ministry of Commerce, Federal Investigation Agency (FIA), Ministry of Interior, and Cabinet Division.',
      '### Vacancy Distribution & Provincial Quota Framework',
      '| Department / Ministry | Designation | Minimum Education | Provincial Quotas Observed |\n| :--- | :--- | :--- | :--- |\n| **Ministry of Commerce** | Assistant Director (Trade & Commerce) | Master’s / 4-Year BS (16 Years) in Economics, Commerce, Business | Merit, Punjab, Sindh (R), Sindh (U), KPK, Balochistan |\n| **Federal Investigation Agency (FIA)** | Assistant Director (Investigation / Legal) | Master’s / LLB / BS in Criminology, Law, Public Administration | All Pakistan Provincial & Regional Quotas |\n| **Cabinet Division** | Assistant Director (Policy & Planning) | Master’s / BS in Social Sciences, Management, Public Policy | Open Merit, Women & Minority Quotas |',
      '### Standard FPSC Eligibility & Fee Standards',
      '- **Educational Standard:** Second Class or Grade ‘C’ Master’s degree or 4-year Bachelor’s (16 years of education) from an HEC-recognized university.\n- **Age Bracket:** 22 to 28 years on the closing date, with standard **5-year general age relaxation** granted across all federal posts (effective ceiling **33 years**). Additional relaxations apply for government servants, scheduled castes, and armed forces veterans.\n- **Official Treasury Challan Fee:** Rs 300 deposited under National Bank of Pakistan (NBP) or State Bank of Pakistan (SBP) Head of Account `C02101-Organs of State-Exam Fee (FPSC Receipts)`. The original treasury receipt must be presented at the examination center.',
      '### Examination Architecture & Syllabus Breakdown',
      '1. **Phase 1: MCQ Screening Test (100 Marks - 100 Minutes):**\n   - **Part I: English (20 Marks):** Grammar usage, sentence structuring, vocabulary, and reading comprehension.\n   - **Part II: General Intelligence & Professional Subject (80 Marks):** Basic Arithmetic (20%), Current Affairs & Pakistan Affairs (20%), Everyday Science (20%), and Department-Specific Subject Knowledge (20%).\n2. **Phase 2: Descriptive Examination (Where Prescribed):** Administered to top screening qualifying candidates (typically 10 candidates per advertised vacancy).\n3. **Phase 3: Psychological Assessment & Viva Voce (300 Marks):** Comprehensive panel interview before an FPSC Member Board.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: What should candidates who applied before October 12 do now?**\nCandidates should retain their original paid Treasury Challan (Form 32-A) and printout of their online application. Admission certificates showing test center and roll number will be downloadable from `online.fpsc.gov.pk` before the test date.',
      '**Q2: Can candidates change their chosen examination center?**\nCenter change requests are entertained only through written application to the FPSC Secretary within specified deadlines prior to roll number slip issuance.',
      '**Q3: Where can I verify official FPSC exam schedules?**\nAll Phase schedules, syllabi, and roll number slips are published on the FPSC official portal: [fpsc.gov.pk](https://www.fpsc.gov.pk).'
    ]
  },
  {
    id: 2,
    slug: 'punjab-police-constable-recruitment-2026',
    title: 'Punjab Police Constable Recruitment 2026: Physical Standards & Selection Guide',
    lastDate: '2026-10-05',
    metaDescription: 'Punjab Police Constable (BPS-07) recruitment guide. Review physical measurement standards, running endurance criteria, written test syllabus, and selection workflow.',
    seoTitle: 'Punjab Police Constable Recruitment 2026 (BPS-07) — Complete Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Department:** Punjab Police Department (Government of the Punjab).\n> - **Cadre:** Constable / Lady Constable (BPS-07) & Special Protection Unit (SPU).\n> - **Closing Date:** Physical form submissions at District Police Lines closed on **05 October 2026**.\n> - **Current Selection Status:** District Police Recruitment Boards are conducting initial document verification and scheduling physical endurance and running measurements.\n> - **Official Department Portal:** [punjabpolice.gov.pk](https://www.punjabpolice.gov.pk/).',
      '### Recruitment Scope & Uniformed Policing Career',
      'The **Punjab Police Department** conducts district-wise recruitment for Constables and Lady Constables in basic pay scale **BPS-07** across all administrative districts of Punjab (Lahore, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, Bahawalpur, and tribal areas of Rajanpur and DG Khan).',
      '### Mandatory Physical Measurement & Endurance Standards',
      '| Physical Criterion | Male Candidates (General) | Female Candidates (General) | Tribal / Border Areas (DG Khan / Rajanpur) |\n| :--- | :--- | :--- | :--- |\n| **Minimum Height** | **5 feet 7 inches (5’ 7”)** | **5 feet 2 inches (5’ 2”)** | 5 feet 5 inches (Male) / 5’ 2” (Female) |\n| **Chest Measurement** | **33 inches with 1.5” expansion** (33” x 34.5”) | Not Applicable | 31 inches with 1.5” expansion |\n| **Running Endurance** | **1.6 Kilometers (1 Mile) in 7 Minutes** | **1.6 Kilometers in 10 Minutes** | 1.6 Kilometers in 7 Minutes |\n| **Age Bracket** | **18 to 22 Years** | **18 to 22 Years** | 18 to 25 Years |',
      '### Educational & Domicile Requirements',
      '- **Education:** Secondary School Certificate (Matriculation / SSC) with minimum **50% marks** from a recognized Board of Intermediate and Secondary Education (BISE) in Punjab.\n- **Domicile:** Candidates must hold a valid Punjab Domicile and Computerized National Identity Card (CNIC) corresponding to the district where they submitted their application.\n- **Criminal Record:** Clean record with no pending FIRs or criminal convictions; character scrutiny is conducted via the Punjab Police Special Branch.',
      '### Complete Selection Phase Sequence',
      '1. **Phase 1: Physical Measurement & Scrutiny:** Measuring exact height and chest dimensions at District Police Lines.\n2. **Phase 2: Timed Running Trial:** Electronic / biometric timed 1.6 km running trial.\n3. **Phase 3: Written Examination (100 Marks):** Administered by an independent testing agency or board, covering English grammar, Urdu comprehension, General Knowledge, Mathematics, and Basic Ethics.\n4. **Phase 4: Interview & Viva Voce (20 Marks):** Assessment of mental alertness, personality, and general communication.\n5. **Phase 5: Medical Examination & Background Scrutiny:** Comprehensive medical examination at District Headquarters (DHQ) Hospital followed by appointment letter issuance.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: What happens if a candidate fails the chest expansion test?**\nChest measurement is strictly non-negotiable under Punjab Police service rules. Candidates unable to demonstrate 1.5-inch expansion are disqualified on the spot.',
      '**Q2: What is the starting monthly salary for a Punjab Police Constable (BPS-07)?**\nConstables receive basic BPS-07 pay scale salary supplemented by police risk allowance, conveyance allowance, ration allowance, and medical allowance.',
      '**Q3: Where can applicants track district-wise test results and merit lists?**\nUpdates are posted on district notice boards and on the Punjab Police portal: [punjabpolice.gov.pk](https://www.punjabpolice.gov.pk/).'
    ]
  },
  {
    id: 3,
    slug: 'nadra-data-entry-operator-2026',
    title: 'NADRA Data Entry Operator / Junior Executive Jobs 2026: Walk-in Test Guide',
    lastDate: '2026-10-01',
    metaDescription: 'NADRA Data Entry Operator (Junior Executive Trainee) career guide. Review walk-in test procedures, typing speed benchmarks, age relaxation, and regional center rules.',
    seoTitle: 'NADRA Data Entry Operator Jobs 2026 — Walk-In Test Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Walk-in Window Concluded):**\n> - **Hiring Authority:** National Database and Registration Authority (NADRA), Ministry of Interior.\n> - **Designations:** Data Entry Operator (DEO) / Junior Executive (Trainee).\n> - **Walk-in Date:** The announced walk-in test schedule concluded on **01 October 2026**.\n> - **Current Selection Phase:** Typing speed test qualifiers are being scheduled for panel interviews and document verification at regional headquarters.\n> - **Official NADRA Careers Portal:** [nadra.gov.pk/careers](https://www.nadra.gov.pk/careers/).',
      '### Institutional Profile & Operational Mandate',
      'The **National Database and Registration Authority (NADRA)** operates the world’s largest biometric citizen identity database. Data Entry Operators and Junior Executives manage frontline Citizen Facilitation Centers (NRCs), handling Computerized National Identity Card (CNIC) issuance, Family Registration Certificates (FRC), Child Registration Certificates (CRC / B-Form), and biometric verification.',
      '### Core Position Specifications Table',
      '| Attribute | Verified Official Detail |\n| :--- | :--- |\n| **Recruitment Body** | National Database & Registration Authority (NADRA) |\n| **Designations** | Data Entry Operator / Junior Executive (Trainee) |\n| **Employment Model** | Initial Trainee / Contract (Extendable based on performance) |\n| **Minimum Education** | Intermediate (FA / F.Sc / I.Com / ICS) or Bachelor’s Degree |\n| **Mandatory Typing Benchmark**| Minimum **30 to 35 Words Per Minute (WPM)** on standard keyboard |\n| **Age Limit** | 25 to 28 Years (plus 5-year standard federal age relaxation up to 33 years) |\n| **Locations** | Regional Head Offices (Islamabad, Lahore, Karachi, Peshawar, Quetta, Sukkur, Multan) |',
      '### Walk-in Test Architecture & Evaluation',
      '1. **Phase 1: Computer-Based Typing Speed Test:** Candidates take a 5-minute software-monitored typing test. Candidates must score at least 30 WPM with high accuracy to qualify for the next stage.\n2. **Phase 2: Basic Computer Literacy & MCQs:** Basic questions covering MS Office (Word, Excel), keyboard shortcuts, Windows operations, and data entry integrity.\n3. **Phase 3: Formal Panel Interview:** Assessing communication skills, customer service orientation, and document fraud awareness.\n4. **Phase 4: Medical Fitness & Security Clearance:** Background check and medical fitness certification before posting to NADRA Registration Centers.',
      '### Mandatory Original Documents Required at Registration Centers',
      '- Original CNIC and two photocopies.\n- Original Matric and Intermediate certificates/mark sheets along with attested copies.\n- Original Domicile and PRC Form-D.\n- Detailed updated CV and passport-size photographs.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Does NADRA charge any registration fee for walk-in tests?**\nNo. NADRA walk-in recruitment is completely free. No candidate should pay any fee to unauthorized agents or private individuals.',
      '**Q2: How often does NADRA conduct walk-in hiring drives?**\nNADRA publishes district-specific walk-in schedules periodically in national newspapers and on its official website: [nadra.gov.pk/careers](https://www.nadra.gov.pk/careers/).'
    ]
  },
  {
    id: 18,
    slug: 'wapda-junior-engineer-2026',
    title: 'WAPDA Junior Engineer (BPS-17) Jobs 2026: Civil & Electrical Recruitment Guide',
    lastDate: '2026-10-14',
    metaDescription: 'WAPDA Junior Engineer (BPS-17 Civil & Electrical) recruitment guide. Review PEC registration criteria, PTS test syllabus, hydel project postings, and portal details.',
    seoTitle: 'WAPDA Junior Engineer Jobs 2026 (BPS-17) — Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** Water and Power Development Authority (WAPDA), Government of Pakistan.\n> - **Position:** Junior Engineer (BPS-17) — Civil, Electrical & Mechanical.\n> - **Closing Date:** Online registration via the testing agency closed on **14 October 2026**.\n> - **Current Selection Phase:** Candidate credential verification and roll number slip processing for the written screening test.\n> - **Official Authority Portal:** [wapda.gov.pk](https://www.wapda.gov.pk/).',
      '### Engineering Scope & Mega Hydel Projects',
      '**WAPDA** is Pakistan’s apex agency responsible for water resource development and hydroelectric power generation. Junior Engineers (BPS-17) are deployed across flagship mega infrastructure projects including **Diamer-Bhasha Dam**, **Mohmand Dam**, **Dasu Hydropower Project**, and operational facilities at Tarbela and Mangla.',
      '### Engineering Vacancy Breakdown',
      '| Engineering Discipline | Minimum Qualification | Mandatory Professional Registration | Primary Deployment Sites |\n| :--- | :--- | :--- | :--- |\n| **Junior Engineer (Civil)** | B.Sc / BE Civil Engineering (First Division / Min 2.8 CGPA) | Valid Pakistan Engineering Council (PEC) Registration | Diamer-Bhasha, Mohmand, Dasu Dam Sites |\n| **Junior Engineer (Electrical)** | B.Sc / BE Electrical / Electronics Engineering | Valid PEC Registration as Registered Engineer | Hydel Power Stations (Tarbela, Mangla, Ghazi Barotha) |\n| **Junior Engineer (Mechanical)** | B.Sc / BE Mechanical Engineering | Valid PEC Registration | Turbine & Powerhouse Maintenance Divisions |',
      '### Standard Eligibility Guidelines',
      '- **Academic Record:** First Division or minimum CGPA of 2.80/4.00 from an HEC-recognized university.\n- **PEC Status:** Must possess active PEC registration valid on or before the application closing date.\n- **Age Ceiling:** Maximum 33 years (inclusive of the federal government 5-year general age relaxation).\n- **Provincial Quotas:** Federal quotas (Merit 7.5%, Punjab 50%, Sindh Rural 11.4%, Sindh Urban 7.6%, KPK 11.5%, Balochistan 6%, Ex-FATA 3%, AJK 2%) are strictly observed.',
      '### Screening Test Structure (100 Marks)',
      '1. **Technical Engineering Subject (60%):** Discipline-specific core engineering concepts (Fluid Mechanics, Structural Analysis, Power Systems, Electrical Machines, Thermodynamics).\n2. **English Language (20%):** Grammar, vocabulary, and technical comprehension.\n3. **Analytical Reasoning & General Knowledge (20%):** Logical problem-solving, current affairs, and Pakistan Studies.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates awaiting PEC registration cards appear in the test?**\nCandidates must hold at least a valid PEC registration number at the time of application to be eligible for appointment.\n\n**Q2: Where will the written screening test take place?**\nTests are organized in major division headquarters including Islamabad, Lahore, Karachi, Peshawar, Quetta, and Gilgit. Updates appear on [wapda.gov.pk](https://www.wapda.gov.pk/).'
    ]
  },
  {
    id: 64,
    slug: 'gwadar-shipyard-assistant-jobs-2026',
    title: 'Gwadar Shipyard Assistant Jobs 2026: Balochistan Quota Recruitment Guide via NJP',
    lastDate: '2026-10-10',
    metaDescription: 'Gwadar Shipyard Assistant (BPS-15) recruitment guide via National Job Portal (NJP). Review Balochistan quota rules, NITB IT training requirements, and portal steps.',
    seoTitle: 'Gwadar Shipyard Assistant Jobs 2026 — NJP Balochistan Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** Gwadar Shipyard Project, Ministry of Maritime Affairs / Defence Production.\n> - **Designation:** Assistant (BPS-15) — Special Balochistan Quota.\n> - **Closing Date:** Online registration on the National Job Portal (NJP) closed on **10 October 2026**.\n> - **Selection Stage:** NJP profile scrutiny and candidate shortlisting for administrative evaluation.\n> - **Official Gateway:** [njp.gov.pk](https://njp.gov.pk/).',
      '### Strategic Scope of the Gwadar Shipyard Project',
      'The **Gwadar Shipyard & Engineering Works (GSEW)** project is a key maritime industrial initiative developed in Gwadar, Balochistan. Designed to establish commercial shipbuilding, ship repair, and maritime infrastructure facilities, this initiative provides dedicated employment opportunities for residents of Balochistan.',
      '### Position Profile & Pay Scale Details',
      '| Attribute | Official Specification |\n| :--- | :--- |\n| **Designation** | Assistant (BPS-15) |\n| **Supervisory Body** | Gwadar Shipyard Management / Ministry of Maritime Affairs |\n| **Pay Scale** | Federal Basic Pay Scale BPS-15 with federal allowances |\n| **Educational Requirement** | Bachelor’s Degree (14 or 16 Years) from an HEC-recognized university |\n| **Mandatory IT Training** | 6-week Basic IT Training Course (including MS Office) from NITB prior to probation completion |\n| **Domicile Restriction** | Verified Balochistan Local / Domicile Certificate |',
      '### Key Responsibilities & Selection Sequence',
      '- **Administrative Operations:** Maintaining official correspondence, project record archives, and procurement documentation.\n- **Selection Phases:** Initial NJP profile scrutiny, followed by a written screening test and viva voce interview before the project selection committee in Quetta/Gwadar.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates from other provinces apply for this Gwadar Shipyard post?**\nNo. This specific advertisement is strictly reserved under the Balochistan provincial/local quota.\n\n**Q2: What is the status of the National Job Portal submission?**\nCandidates can track their submitted status by logging into their applicant profile at [njp.gov.pk](https://njp.gov.pk/).'
    ]
  },
  {
    id: 66,
    slug: 'karachi-shipyard-technical-assistant-jobs-2026',
    title: 'Karachi Shipyard (KS&EW) Technical Assistant Jobs 2026: Career & Eligibility Guide',
    lastDate: '2026-10-10',
    metaDescription: 'Karachi Shipyard & Engineering Works (KS&EW) Technical Assistant recruitment guide. Review DAE requirements, naval construction workflows, and portal guidelines.',
    seoTitle: 'Karachi Shipyard Technical Assistant Jobs 2026 — Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Employer:** Karachi Shipyard & Engineering Works Limited (KS&EW).\n> - **Position:** Technical Assistant (Mechanical / Marine / Electrical / Fabrication).\n> - **Application Deadline:** Applications for this technical intake closed on **10 October 2026**.\n> - **Current Selection Stage:** Technical credential scrutiny and practical skills assessment by KS&EW Technical Training Centre (TTC).\n> - **Official Careers Gateway:** [karachishipyard.com.pk](https://www.karachishipyard.com.pk/).',
      '### Maritime Engineering Profile: KS&EW',
      '**Karachi Shipyard & Engineering Works Limited (KS&EW)** is Pakistan’s primary shipbuilding and maritime engineering facility, established at West Wharf, Karachi. Operating under the Ministry of Defence Production, KS&EW builds naval warships, commercial tugboats, submarine overhauls, and heavy offshore industrial structures.',
      '### Technical Specifications Table',
      '| Parameter | Verified Job Requirement |\n| :--- | :--- |\n| **Hiring Organization** | Karachi Shipyard & Engineering Works (KS&EW) Limited |\n| **Position Title** | Technical Assistant / Junior Technical Officer |\n| **Duty Location** | West Wharf Dockyard, Karachi, Sindh |\n| **Minimum Qualification** | 3-Year Diploma of Associate Engineering (DAE) in Mechanical, Electrical, Marine, or Metallurgy |\n| **Experience Requirement** | 1 to 3 years hands-on experience in industrial manufacturing, fabrication, or shipyard machinery |\n| **Age Limit** | Maximum 28 to 30 years (relaxable for experienced naval / defence personnel) |',
      '### Core Technical Responsibilities',
      '- **Shipyard Machinery & Piping:** Assisting senior engineers in ship hull fabrication, shaft alignment, valve overhauls, and marine propulsion systems.\n- **Quality Control & Testing:** Conducting dye penetrant tests, ultrasonic thickness measurements, and welding quality checks according to international maritime classification rules (Lloyd’s Register / Bureau Veritas).\n- **Safety Compliance:** Adhering strictly to shipyard occupational health and safety (OHS) standards in dry docks.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Where will the practical skills test take place?**\nShortlisted technical candidates take hands-on trade tests at the KS&EW Training Centre, West Wharf, Karachi.\n\n**Q2: Where are new vacancies at Karachi Shipyard published?**\nAll verified notices appear on [karachishipyard.com.pk](https://www.karachishipyard.com.pk/).'
    ]
  },
  {
    id: 70,
    slug: 'navttc-assistant-private-secretary-jobs-2026',
    title: 'NAVTTC Assistant Private Secretary (BPS-16) Jobs 2026: Complete NJP Guide',
    lastDate: '2026-10-10',
    metaDescription: 'NAVTTC Assistant Private Secretary (BPS-16) recruitment guide via National Job Portal. Review shorthand speed benchmarks, computer typing standards, and portal steps.',
    seoTitle: 'NAVTTC Assistant Private Secretary Jobs 2026 (BPS-16) — NJP Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Commission:** National Vocational & Technical Training Commission (NAVTTC), Islamabad.\n> - **Post:** Assistant Private Secretary (APS - BPS-16).\n> - **Closing Date:** Submissions on the National Job Portal (NJP) closed on **10 October 2026**.\n> - **Selection Stage:** Initial scrutiny of shorthand and typing qualifications prior to physical dictation screening.\n> - **Official Application Portal:** [njp.gov.pk](https://njp.gov.pk/).',
      '### Commission Profile & Administrative Function',
      '**NAVTTC** is the apex federal regulator for technical and vocational education and training in Pakistan, operating under the Ministry of Federal Education and Professional Training. The **Assistant Private Secretary (BPS-16)** manages confidential secretarial affairs, executive correspondence, and official records for Commission Executive Directors.',
      '### Mandatory Qualifications & Shorthand Benchmarks',
      '| Qualification Attribute | Federal BPS-16 Requirement |\n| :--- | :--- |\n| **Minimum Education** | Bachelor’s Degree (14 or 16 Years) from an HEC-recognized university |\n| **Shorthand Speed** | Minimum **100 Words Per Minute (WPM)** in English shorthand |\n| **Typing Speed** | Minimum **50 Words Per Minute (WPM)** on standard computer keyboard |\n| **Computer Literacy** | Proficiency in MS Word, Excel, PowerPoint, and official email handling |\n| **Age Bracket** | 20 to 28 Years (+ 5-year general federal age relaxation up to 33 years) |',
      '### Practical Test Sequence',
      '1. **English Shorthand Dictation Test:** 5-minute audio dictation passage at 100 WPM, followed by timed transcription into standard English.\n2. **Computer Typing Examination:** 5-minute speed and accuracy test on PC.\n3. **Panel Viva Voce:** Evaluating official correspondence knowledge, office decorum, and record preservation.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates appear in the shorthand test without an official certificate?**\nCandidates must demonstrate the required 100/50 WPM speeds during the practical evaluation conducted by the testing board.\n\n**Q2: How can candidates verify future federal secretarial recruitment?**\nAnnouncements are posted on the National Job Portal at [njp.gov.pk](https://njp.gov.pk/).'
    ]
  },
  {
    id: 71,
    slug: 'navttc-assistant-bps15-jobs-2026',
    title: 'NAVTTC Assistant (BPS-15) Jobs 2026: 15 Vacancies Recruitment Guide via NJP',
    lastDate: '2026-10-10',
    metaDescription: 'NAVTTC Assistant (BPS-15) recruitment guide for 15 federal vacancies via National Job Portal. Review eligibility criteria, NITB IT training requirements, and quotas.',
    seoTitle: 'NAVTTC Assistant Jobs 2026 (BPS-15) — 15 Federal Posts NJP Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** National Vocational and Technical Training Commission (NAVTTC).\n> - **Designation:** Assistant (BPS-15) — 15 Regular Posts.\n> - **Closing Date:** Online registration on the National Job Portal closed on **10 October 2026**.\n> - **Selection Stage:** Online applicant shortlisting and test roll number generation by the federal recruitment committee.\n> - **Official Portal:** [njp.gov.pk](https://njp.gov.pk/).',
      '### Role Overview in Federal Vocational Governance',
      'Assistants in **BPS-15** form the core clerical and operational backbone of NAVTTC headquarters in Islamabad and its regional directorates, maintaining official file diaries, drafting ministerial summaries, and managing vocational institute accreditation records.',
      '### Vacancy Profile & Quota Breakdown',
      '| Parameter | Verified Specification |\n| :--- | :--- |\n| **Total Vacancies** | **15 Regular Posts** (BPS-15) |\n| **Quota Observed** | Merit, Punjab, Sindh Rural, Sindh Urban, KPK, Balochistan, Ex-FATA |\n| **Educational Requirement** | Bachelor’s Degree (14 or 16 Years) in any discipline from an HEC-recognized university |\n| **Mandatory Course** | 6-week Basic IT Training Course (including MS Office) from NITB prior to probation completion |\n| **Age Ceiling** | 18 to 28 Years (+ 5-year general federal age relaxation up to 33 years) |',
      '### Selection Procedure',
      '1. **Screening Written Test:** 100 MCQs covering General Knowledge, Everyday Science, Basic Arithmetic, English Grammar, and Basic Computer Operations.\n2. **Academic Merit Scrutiny:** Cross-checking degrees, mark sheets, and domicile validity against NADRA records.\n3. **Interview Board:** Final interview at NAVTTC Headquarters, Islamabad.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is NITB certificate required at the time of application?**\nNo. As per Federal Establishment Division rules, the 6-week NITB IT course is completed during the initial probation period after appointment.\n\n**Q2: Where can candidates track NAVTTC test roll number slips?**\nRoll number slips and test center assignments are published on [njp.gov.pk](https://njp.gov.pk/).'
    ]
  },
  {
    id: 72,
    slug: 'navttc-director-bps18-jobs-2026',
    title: 'NAVTTC Director (BPS-18) Jobs 2026: 10 Management Vacancies Guide via NJP',
    lastDate: '2026-10-10',
    metaDescription: 'NAVTTC Director (BPS-18) recruitment guide for 10 management positions via National Job Portal. Review administrative qualifications, experience criteria, and selection stages.',
    seoTitle: 'NAVTTC Director Jobs 2026 (BPS-18) — 10 Posts NJP Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** National Vocational and Technical Training Commission (NAVTTC).\n> - **Cadre:** Director (BPS-18) — 10 Senior Administrative Vacancies.\n> - **Application Window:** Registrations via the National Job Portal (NJP) closed on **10 October 2026**.\n> - **Selection Stage:** Experience and educational dossier review by the Federal Departmental Selection Board.\n> - **Official Portal:** [njp.gov.pk](https://njp.gov.pk/).',
      '### Leadership Role in Technical Education',
      'Directors in **BPS-18** oversee regional technical training centers, international skill standardization agreements (such as qualification equivalence with Gulf and EU partners), national skill competitions, and public-private vocational partnerships under Prime Minister Youth Skill Initiatives.',
      '### Comprehensive Qualification & Experience Matrix',
      '| Attribute | Official BPS-18 Requirement |\n| :--- | :--- |\n| **Position Count** | **10 Vacancies** (BPS-18) |\n| **Educational Background** | Master’s Degree (16 or 18 Years) in Public Administration, Business Administration (MBA), Engineering, Education, or Social Sciences from an HEC-recognized university |\n| **Professional Experience** | Minimum **5 years** of post-qualification administrative, managerial, or educational planning experience in government or reputable private organizations |\n| **Age Limit** | 25 to 35 Years (+ 5-year federal general age relaxation up to 40 years) |',
      '### Selection Sequence for BPS-18 Officers',
      '1. **Preliminary Scrutiny:** Rigorous verification of accredited service experience certificates and HEC degrees.\n2. **Professional Written Test:** Focused on public policy, vocational curriculum development, financial management, and government rules of business.\n3. **Departmental Selection Board (DSB):** Interview with senior federal secretaries and vocational education experts.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Are government servants eligible for age relaxation beyond 35 years?**\nYes. In-service federal and provincial government servants with at least 2 years continuous service receive up to 10 years age relaxation under Federal Civil Servants rules.\n\n**Q2: Where can candidates track BPS-18 selection updates?**\nUpdates appear on the National Job Portal: [njp.gov.pk](https://njp.gov.pk/).'
    ]
  }
];

async function updateBatch3() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  console.log('Fetching live articles to build full payloads...');
  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allArticles = (await resAll.json()).data;

  console.log('=== UPDATING BATCH 3 (9 PUBLIC SECTOR ARTICLES) ===\n');

  for (const item of batch3Articles) {
    const existing = allArticles.find(a => a.slug === item.slug);
    if (!existing) {
      throw new Error(`Article not found on D1 for slug: ${item.slug}`);
    }

    const payload = {
      ...existing,
      title: item.title,
      content: item.content,
      lastDate: item.lastDate,
      metaDescription: item.metaDescription,
      seoTitle: item.seoTitle,
      ogTitle: item.title,
      ogDescription: item.metaDescription,
      status: 'published'
    };

    console.log(`>>> Updating Cloudflare D1 for: [ID ${item.id}] ${item.slug}`);

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
    console.log(`SUCCESS: Cloudflare D1 updated for [ID ${item.id}] ${item.slug}`);

    // Update local SQLite
    localDb.prepare(`
      UPDATE articles SET
        title = ?,
        content = ?,
        last_date = ?,
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
      item.metaDescription,
      item.seoTitle,
      item.title,
      item.metaDescription,
      item.slug
    );
    console.log(`SUCCESS: Local SQLite updated for ${item.slug}\n`);
  }

  console.log('=== BATCH 3 UPDATES COMPLETE ===');
}

updateBatch3().catch(console.error);
