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

const batch6Articles = [
  {
    id: 8,
    slug: 'phec-phd-scholarship-2026',
    title: 'Punjab HEC Fully Funded International PhD Scholarship 2026: Complete Application Guide',
    lastDate: '2026-11-01',
    metaDescription: 'Punjab Higher Education Commission (PHEC) International PhD Scholarship 2026 guide for QS Top 300 universities. Review living stipend, tuition coverage, and portal steps.',
    seoTitle: 'Punjab HEC International PhD Scholarship 2026 — Fully Funded Guide',
    content: [
      '> [!IMPORTANT]\n> **Official Scholarship Overview & Verification Notice:**\n> - **Awarding Body:** Punjab Higher Education Commission (PHEC), Government of the Punjab.\n> - **Scholarship Category:** Fully Funded International PhD Scholarships (QS World Top 300 Universities).\n> - **Closing Date:** Online application portal closes on **01 November 2026**.\n> - **Eligible Beneficiaries:** Regular public university faculty and prospective doctoral scholars holding a valid Punjab Domicile.\n> - **Official Application Gateway:** [phec.punjab.gov.pk](https://phec.punjab.gov.pk/).',
      '### Purpose & Strategic Research Focus',
      'The **Punjab Higher Education Commission (PHEC)** established the **International PhD Scholarship Scheme** to elevate research and development standards across public-sector higher education institutions in Punjab. The initiative finances comprehensive 3-to-4-year doctoral studies at world-leading universities ranked in the top 300 of QS World University Rankings.',
      '### Priority Thematic Research Areas',
      '| Thematic Area | Specialized Academic Disciplines | National Development Relevance |\n| :--- | :--- | :--- |\n| **Advanced Engineering & Technology** | Artificial Intelligence, Robotics, Cyber Security, Nanotechnology | Digital transition and industrial automation |\n| **Agriculture & Food Security** | Climate-resilient crops, Precision agriculture, Water resource engineering | Alleviating food inflation and climate impact in Punjab |\n| **Biomedical & Healthcare Sciences** | Molecular biology, Immunology, Vaccine development, Public health epidemiology | Strengthening provincial tertiary healthcare systems |\n| **Social Sciences & Public Policy** | Educational economics, Governance reform, Environmental law | Reforming provincial administrative frameworks |',
      '### Financial Package & Scholar Entitlements',
      '- **100% Tuition Fee Coverage:** Complete payment of international tuition fees directly to the host university.\n- **Monthly Living Stipend:** Benchmark-adjusted monthly living stipend covering accommodation, meals, and utility costs.\n- **Airfare:** Return economy-class air ticket between Pakistan and the study destination.\n- **Health Coverage:** Overseas student health cover (OSHC) throughout the approved doctoral program.\n- **Settlement Allowance:** One-time initial settlement grant disbursed upon arrival at the host institution.',
      '### Mandatory Eligibility Criteria',
      '1. **Domicile:** Must possess a valid Punjab Domicile Certificate and CNIC.\n2. **Academic Background:** Minimum 18 years of education (MS / MPhil) in the relevant field with minimum **CGPA 3.50 out of 4.00** from an HEC-recognized university.\n3. **Age Limit:** Maximum **35 years** for general candidates, relaxable up to **40 years** for regular permanent faculty members of public-sector universities in Punjab.\n4. **Admission Offer:** Valid unconditional or conditional letter of admission from an institution ranked among the QS World Top 300.\n5. **Service Bond:** Scholars must sign a legally binding deed to return to Pakistan and serve in Punjab for a minimum of 5 years following completion of their PhD.',
      '### Application Procedure & Documentation',
      '1. Register online at [phec.punjab.gov.pk](https://phec.punjab.gov.pk).\n2. Upload verified academic degrees and transcripts attested by HEC.\n3. Upload research proposal, university acceptance letter, and academic supervisor credentials.\n4. Shortlisted applicants undergo evaluation by the PHEC Technical Review Committee followed by panel interviews.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can private university faculty apply for the PHEC International PhD Scholarship?**\nYes, eligible scholars meeting the Punjab domicile and academic CGPA criteria can apply under the open category, though preferential quotas exist for public university teachers.\n\n**Q2: What is the last date to apply?**\nThe verified closing date is **01 November 2026** on the PHEC portal.\n\n**Q3: Where can applicants track application status?**\nApplicants can monitor their status by logging into [phec.punjab.gov.pk](https://phec.punjab.gov.pk).'
    ]
  },
  {
    id: 9,
    slug: 'turkiye-burslari-scholarship-2026',
    title: 'Türkiye Burslari Scholarship 2026–2027: Full Funding, Stipend & Pakistani Applicant Guide',
    lastDate: '2026-02-20',
    metaDescription: 'Türkiye Burslari (Turkiye Scholarships) guide for Pakistani students. Review full tuition, dormitory accommodation, monthly stipend, academic marks thresholds, and TBBS portal.',
    seoTitle: 'Türkiye Burslari Scholarship 2026–2027 Pakistan — Complete Guide',
    content: [
      '> [!NOTE]\n> **Official Intake Status Notice (Annual Cycle Concluded):**\n> - **Awarding Authority:** Presidency for Turks Abroad and Related Communities (YTB), Government of Türkiye.\n> - **Intake Cycle:** Annual Türkiye Burslari intake for the 2026 academic entry concluded on **20 February 2026**.\n> - **Current Status:** Selected scholars have commenced their mandatory 1-year Turkish language preparatory program in Ankara, Istanbul, and Izmir. Online registrations for the **2027–2028 intake** open officially in **January 2027**.\n> - **Official Application Gateway:** [turkiyeburslari.gov.tr](https://www.turkiyeburslari.gov.tr/).',
      '### Overview: Premier Turkish Government Scholarship',
      '**Türkiye Burslari** is an internationally competitive, government-funded higher education scholarship program provided by the Republic of Türkiye. Designed for outstanding international students, the award funds undergraduate, master’s, and PhD degree programs across prestigious state and foundation universities in Türkiye.',
      '### Complete Financial Entitlements Breakdown',
      '| Benefit Stream | Verified Official Entitlement |\n| :--- | :--- |\n| **Tuition Exemption** | **100% Free Tuition** for the entire duration of the degree program |\n| **Monthly Living Allowance** | Substantial monthly cash stipend disbursed directly to student bank accounts |\n| **Free Student Housing** | Guaranteed room in state-operated university dormitories (KYK) |\n| **Language Preparation** | Full **1-Year Turkish Language (TÖMER) Course** with zero fee |\n| **Health Coverage** | Comprehensive General Health Insurance (SGK) under the Turkish healthcare system |\n| **International Travel** | One return economy flight ticket (Pakistan to Türkiye and back upon graduation) |',
      '### Academic Minimum Score Thresholds',
      '- **Undergraduate Degrees (Engineering, Social Sciences, Business):** Minimum **70% aggregate marks** in Intermediate / HSSC or British GCE A-Levels; age under **21 years**.\n- **Master’s & PhD Programs:** Minimum **75% aggregate marks** in Bachelor’s (16 years) or Master’s degree; age under **30 years** (Master’s) and under **35 years** (PhD).\n- **Health Sciences (MBBS / Medicine, Dentistry, Pharmacy):** Minimum **90% academic score** in FSc Pre-Medical.',
      '### How to Prepare for the Upcoming 2027 Intake',
      '1. **Academic Transcripts:** Keep attested copies of Matric, Intermediate, and University degrees ready with English translations.\n2. **Letters of Recommendation:** Procure two academic recommendation letters on official university letterhead.\n3. **Statement of Purpose (SoP):** Draft a compelling narrative detailing academic goals, why you selected Türkiye, and your post-study contribution.\n4. **Official Submission:** Submit free of cost on the **TBBS Portal** (`tbbs.turkiyeburslari.gov.tr`) between 10 January and 20 February.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is IELTS or TOEFL mandatory for Türkiye Burslari?**\nNo. IELTS is not mandatory for programs taught in Turkish. However, if you choose an English-medium program, the university may require an English proficiency certificate.\n\n**Q2: Does Türkiye Burslari charge any application fee?**\nNo. The application is completely free of charge on the official Turkish government portal: [turkiyeburslari.gov.tr](https://www.turkiyeburslari.gov.tr).'
    ]
  },
  {
    id: 12,
    slug: 'nust-undergraduate-admissions-fall-2026',
    title: 'NUST Undergraduate Admissions 2026: NET Schedule, Merit Formula & Programs Guide',
    lastDate: '2026-10-30',
    metaDescription: 'National University of Sciences & Technology (NUST) undergraduate admissions guide. Review NUST Entry Test (NET) series schedule, 75% merit weightage formula, and programs.',
    seoTitle: 'NUST Undergraduate Admissions 2026 — NET Schedule & Merit Guide',
    content: [
      '> [!NOTE]\n> **Admissions Status Notice (Fall 2026 Intake Concluded):**\n> - **University:** National University of Sciences and Technology (NUST), Islamabad.\n> - **Session:** Fall 2026 Undergraduate Admissions.\n> - **Current Status:** Final merit lists for the Fall 2026 semester have concluded. Prospective applicants can now prepare for **NET-1 (Series-1)** of the **2027 Academic Cycle**, opening in November/December.\n> - **Official Admissions Gateway:** [nust.edu.pk/admissions](https://nust.edu.pk/admissions/).',
      '### Institution Profile: Pakistan’s Top Multidisciplinary University',
      '**NUST** is Pakistan’s top-ranked engineering, computing, and multidisciplinary institution according to global QS rankings. Its main campus at Sector H-12 Islamabad features specialized colleges in Electrical Engineering & Computer Science (SEECS), Mechanical & Civil Engineering (SMME/NICE), Chemical Engineering (SCME), Business (NBS), and Applied Biosciences (ASAB).',
      '### Academic Disciplines & Program Offerings',
      '| Faculty Wing | Degree Offerings | Primary Campus |\n| :--- | :--- | :--- |\n| **School of Computing & AI (SEECS)** | BS Software Engineering, BS Computer Science, BS Data Science, BS Artificial Intelligence | Islamabad H-12 Campus |\n| **School of Engineering (SMME / NICE)** | BE Electrical, BE Mechanical, BE Civil, BE Aerospace, BE Mechatronics | Islamabad / Risalpur |\n| **NUST Business School (NBS)** | BBA, BS Accounting & Finance, BS Tourism & Hospitality | Islamabad H-12 Campus |\n| **School of Social Sciences & Humanities**| BS Economics, BS Psychology, BS Public Administration, LLB | Islamabad H-12 Campus |\n| **School of Architecture & Design (SADA)** | Bachelor of Architecture (5 Years), Bachelor of Industrial Design | Islamabad H-12 Campus |',
      '### Official NUST Merit Weightage Formula',
      'Undergraduate admission merit at NUST is calculated strictly on the following standardized ratio:\n- **NUST Entry Test (NET) Score:** **75% Weightage** (Crucial determinant of selection).\n- **HSSC / Intermediate Part-I / A-Level:** **15% Weightage**.\n- **SSC / Matriculation / O-Level Equivalence:** **10% Weightage**.',
      '### Eligibility Standards',
      '- **FSc Pre-Engineering:** Minimum **60% aggregate marks** for all engineering and computing programs.\n- **ICS with Physics / Stats:** Eligible for Computer Science, Software Engineering, and AI disciplines.\n- **FSc Pre-Medical:** Eligible for Applied Biosciences, Biotechnology, Food Sciences, and Computing programs (with additional mathematics leveling courses).\n- **O/A Levels:** Must hold official equivalence certificate issued by the Inter Board Coordination Commission (IBCC) with at least 60% marks.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: How many times can a student take the NET entry test?**\nNUST conducts NET in four series (NET-1, NET-2, NET-3, NET-4) throughout the year. The highest score obtained in any series is automatically considered for final merit calculation.\n\n**Q2: Where are NET computerized tests conducted?**\nComputer-based tests are conducted at NUST Main Campus, Islamabad. Paper-based tests are also held in Karachi and Quetta during later series.\n\n**Q3: Where can prospective candidates register?**\nRegistrations are processed on the NUST portal: [nust.edu.pk/admissions](https://nust.edu.pk/admissions/).'
    ]
  },
  {
    id: 13,
    slug: 'punjab-medical-university-admissions-2026',
    title: 'Punjab Medical Colleges MDCAT Admissions 2026: MBBS & BDS Centralized Induction Guide',
    lastDate: '2026-10-22',
    metaDescription: 'Punjab Government MBBS and BDS medical college admissions guide via University of Health Sciences (UHS). Review PMDC 50:40:10 aggregate formula, merit lists, and quota rules.',
    seoTitle: 'Punjab Medical Colleges MDCAT Admissions 2026 — UHS MBBS Guide',
    content: [
      '> [!NOTE]\n> **Admissions Status Notice (Centralized Processing Underway):**\n> - **Admitting Authority:** University of Health Sciences (UHS), Lahore (Designated by Punjab Government).\n> - **Programs:** Bachelor of Medicine & Bachelor of Surgery (MBBS) & Bachelor of Dental Surgery (BDS).\n> - **Registration Window:** Online submission on the UHS portal closed on **22 October 2026**.\n> - **Current Status:** UHS Scrutiny Committees are reviewing uploaded academic credentials, Hafiz-e-Quran marks, and disability certifications prior to provisional merit list release.\n> - **Official UHS Admissions Portal:** [uhs.edu.pk](https://uhs.edu.pk/).',
      '### Centralized Medical Induction Framework',
      'The **University of Health Sciences (UHS)** oversees centralized merit admissions for all public-sector medical and dental institutions across Punjab, including **King Edward Medical University (KEMU)**, **Allama Iqbal Medical College (AIMC)**, **Services Institute of Medical Sciences (SIMS)**, **Rawalpindi Medical University (RMU)**, and **Nishtar Medical University Multan**.',
      '### PMDC Standardized Merit Aggregate Calculation',
      'As mandated by the Pakistan Medical & Dental Council (PM&DC), medical admission aggregate is computed using the following weights:\n- **MDCAT Score:** **50% Weightage** (Mandatory passing threshold: 55% for MBBS, 50% for BDS).\n- **HSSC / FSc Pre-Medical:** **40% Weightage** (Minimum 60% marks in Biology, Chemistry, Physics/Maths).\n- **SSC / Matriculation:** **10% Weightage**.\n\n$$\\text{Aggregate } \\% = (\\text{MDCAT \\%} \\times 0.50) + (\\text{FSc \\%} \\times 0.40) + (\\text{Matric \\%} \\times 0.10)$$',
      '### Seat Quotas & Categories in Punjab Medical Colleges',
      '| Admission Category | Governing Eligibility | Target Districts / Groups |\n| :--- | :--- | :--- |\n| **Open Merit Seats** | Highest province-wide aggregate score | All districts of Punjab and Islamabad ICT |\n| **Underdeveloped Districts** | Domicile and continuous schooling in designated district | D.G. Khan, Rajanpur, Layyah, Muzaffargarh, Bhakkar, Lodhran |\n| **Reciprocal Seats** | Inter-provincial quota exchange | Balochistan, AJK, Gilgit-Baltistan, and Sindh nominees |\n| **Overseas / Dual National** | Proof of foreign schooling and dual citizenship | Overseas Pakistani children meeting PMDC criteria |',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates modify college preference order after portal closing?**\nNo. The order of preference submitted during the online application window is strictly binding and cannot be altered once the portal closes.\n\n**Q2: What is the procedure if a candidate is upgraded in subsequent merit lists?**\nIf a student is upgraded to a higher-preference college in subsequent rounds, the admission fee and original documents are automatically transferred to the newly assigned college by UHS.\n\n**Q3: Where can applicants view official provisional merit lists?**\nAll merit lists are published officially on the UHS portal: [uhs.edu.pk](https://uhs.edu.pk).'
    ]
  },
  {
    id: 76,
    slug: 'sbbu-admissions-2026-deadline-extended',
    title: 'SBBU Admissions 2026: Extended Schedule, Programs & Entry Test Guide',
    lastDate: '2026-09-29',
    metaDescription: 'Shaheed Benazir Bhutto University (SBBU) Shaheed Benazirabad admissions guide for Nawabshah, Sanghar, and Naushahro Feroze campuses. Review entry test schedules and fee vouchers.',
    seoTitle: 'SBBU Admissions 2026 — Extended Schedule & Entry Test Guide',
    content: [
      '> [!NOTE]\n> **Admissions Status Notice (Registration Window Concluded):**\n> - **University:** Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad (Nawabshah).\n> - **Academic Session:** Undergraduate & Postgraduate Admissions 2026–2027.\n> - **Extended Closing Date:** The online application window concluded on **29 September 2026**.\n> - **Current Status:** Pre-admission entry tests have concluded across Nawabshah, Sanghar, and Naushahro Feroze campuses; departmental interviews and merit lists are in progress.\n> - **Official Admissions Gateway:** [admissions.sbbusba.edu.pk](https://admissions.sbbusba.edu.pk/).',
      '### Regional Academic Focus in Central Sindh',
      '**Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad** is a public-sector university chartered by the Government of Sindh, serving students across central Sindh with faculties in Computer Science, Business Administration, Education, Media Studies, Natural Sciences, and Law.',
      '### Campus Network & Degree Disciplines',
      '| Campus | Degree Programs Offered | Entry Test Centers |\n| :--- | :--- | :--- |\n| **Main Campus Nawabshah** | BS Computer Science, BS IT, BS Software Engg, BBA, BS English, LLB (5-Year), MBA, MPhil | SBBU Main Campus Examination Complex |\n| **Sanghar Campus** | BS Computer Science, BS English, BBA, B.Ed (Hons) | SBBU Sanghar Sub-Campus |\n| **Naushahro Feroze Campus** | BS Computer Science, BS Information Technology, BBA, BS English | SBBU NF Sub-Campus |',
      '### Pre-Admission Test & Selection Workflow',
      '1. **Pre-Admission Entry Test:** Objective MCQs evaluating English (30%), General Science / Subject Knowledge (40%), and General Knowledge / Mathematics (30%).\n2. **Merit Formula:** Combined aggregate computed from Entry Test score (50%) and Intermediate/HSSC score (50%).\n3. **Fee Payment:** Selected students deposit academic semester dues at designated Habib Bank Limited (HBL) branches using university-generated fee vouchers.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: What should candidates who took the SBBU entry test do now?**\nCandidates should check their roll number on the provisional merit lists uploaded on `admissions.sbbusba.edu.pk` and attend physical document verification.\n\n**Q2: Can students apply for transport and hostel accommodation?**\nYes. Hostels and bus routes connecting Nawabshah, Sanghar, Sakrand, and surrounding towns are allocated upon semester fee clearance.'
    ]
  },
  {
    id: 77,
    slug: 'sbbu-fully-funded-scholarship-2026',
    title: 'SBBU Fully Funded Scholarship 2026: 100% Tuition Fee Waiver & Eligibility Guide',
    lastDate: '2026-09-29',
    metaDescription: 'Shaheed Benazir Bhutto University (SBBU) 100% tuition-free scholarship and financial assistance guide. Review Sindh domicile criteria, income thresholds, and verification steps.',
    seoTitle: 'SBBU 100% Tuition-Free Scholarship 2026 — Complete Guide',
    content: [
      '> [!NOTE]\n> **Scholarship Status Notice (Cycle Concluded):**\n> - **Awarding Institution:** Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad.\n> - **Scheme:** 100% Tuition Fee Waiver & Need-Based Institutional Financial Aid.\n> - **Application Window:** Financial assistance applications closed alongside admission registrations on **29 September 2026**.\n> - **Current Status:** Institutional Scholarship Award Committee (ISAC) is conducting income verification interviews for enrolled students.\n> - **Official Portal:** [admissions.sbbusba.edu.pk](https://admissions.sbbusba.edu.pk/).',
      '### Overview of the SBBU Financial Assistance Scheme',
      'The **SBBU 100% Tuition-Free Scholarship Program** was established by the university administration to ensure talented students from low-income rural households in Sindh can pursue higher education without financial distress. Awards are distributed across both merit-based academic excellence and need-based financial distress categories.',
      '### Scholarship Coverage Categories',
      '| Category | Award Level | Eligible Candidate Pool |\n| :--- | :--- | :--- |\n| **Top Entry Test Merit Award** | **100% Full Tuition Exemption** | Top-scoring candidates in SBBU pre-admission entry tests across each department |\n| **Need-Based Financial Assistance**| 50% to 100% Tuition Waiver | Low-income rural families with verified monthly income below statutory poverty thresholds |\n| **Sindh HEC / Ehsaas Grants** | Tuition + Monthly Living Stipend | Enrolled students meeting Sindh HEC / Benazir Undergraduate Scholarship criteria |',
      '### Mandatory Documentation for Verification',
      '- Candidate CNIC / B-Form and Father’s / Guardian’s CNIC.\n- Verified Sindh Domicile and PRC Form-D.\n- Father’s / Guardian’s Salary Slip, Income Certificate from Union Council, or Pension Book.\n- Utility bills (Electricity, Gas, Water) of the family residence for the past six months.\n- Rent agreement copy (if living in rented accommodation).',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is the scholarship renewed automatically every semester?**\nContinuation of the tuition waiver requires maintaining a minimum Semester GPA (typically 3.00/4.00) and satisfactory attendance records.\n\n**Q2: Where are scholarship award lists published?**\nFinal lists are posted on university departmental notice boards and at [admissions.sbbusba.edu.pk](https://admissions.sbbusba.edu.pk).'
    ]
  },
  {
    id: 82,
    slug: 'hec-peridot-research-program-phase-13-2026',
    title: 'HEC PERIDOT Research Program Phase XIII: Franco-Pakistani Grant Guide',
    lastDate: '2026-09-30',
    metaDescription: 'HEC PERIDOT Research Program Phase XIII guide for Franco-Pakistani academic collaboration. Review joint research themes, mobility grant coverage, and HEC E-Portal steps.',
    seoTitle: 'HEC PERIDOT Research Grant Phase XIII — Franco-Pakistani Guide',
    content: [
      '> [!NOTE]\n> **Call for Proposals Status Notice (Submission Closed):**\n> - **Joint Managing Bodies:** Higher Education Commission (HEC) Pakistan & Campus France / French Ministry of Foreign Affairs.\n> - **Program Name:** PERIDOT Research Grant — Phase XIII (Hubert Curien Partnership / PHC).\n> - **Closing Deadline:** Submissions on the HEC E-Portal closed on **30 September 2026** at 16:00 PST.\n> - **Evaluation Phase:** Joint Pakistani-French scientific committees are conducting peer reviews and mobility budget assessments.\n> - **Official Grant Portal:** [eportal.hec.gov.pk](https://eportal.hec.gov.pk/).',
      '### Strategic Scope of the PERIDOT Program',
      '**PERIDOT** is the flagship bilateral research collaboration between Pakistan and France, implemented jointly by HEC Pakistan and Campus France. The program funds mobility grants for faculty researchers, post-docs, and PhD scholars traveling between Pakistani and French university laboratories to execute high-impact scientific projects.',
      '### Thematic Priority Pillars for Phase XIII',
      '| Research Pillar | Sub-Themes & Focus Areas | Target Scientific Outcomes |\n| :--- | :--- | :--- |\n| **Health Sciences** | Virology, antimicrobial resistance, cancer genetics, pharmacology | Joint diagnostic patents and scientific publications |\n| **Sustainable Energy & Food Security** | Solar PV efficiency, precision irrigation, crop drought resilience | Field-tested agricultural and energy transition models |\n| **Economics of Climate Change** | Carbon pricing, flood mitigation economics, green finance policies | Policy briefs for Pakistan’s climate adaptation strategies |',
      '### Grant Funding Model & Mobility Support',
      '- **Travel & Subsistence:** Covers economy international airfare and daily living allowances for Pakistani researchers visiting France and French researchers visiting Pakistan.\n- **Project Duration:** Up to **2 to 3 years** of funded research collaboration.\n- **Joint Mandate:** Proposals had to be submitted simultaneously by the Pakistani Principal Investigator (PI) on HEC E-Portal and the French Co-PI via Campus France.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: When will results for Phase XIII be announced?**\nJoint Franco-Pakistani selection results are finalized following bilateral committee reviews, typically 3 to 4 months after proposal closing.\n\n**Q2: Where can researchers verify future HEC research grants?**\nAnnouncements appear on the HEC Research & Innovation portal: [hec.gov.pk](https://www.hec.gov.pk).'
    ]
  },
  {
    id: 339,
    slug: 'isra-university-spring-2027-undergraduate-admissions',
    title: 'Isra University Spring 2027 Admissions: Multi-Round Schedule & Programs Guide',
    lastDate: '2026-11-17',
    metaDescription: 'Isra University Spring 2027 undergraduate admissions guide for Hyderabad, Karachi, and Islamabad campuses. Review multi-round entry test dates, degree faculties, and portal steps.',
    seoTitle: 'Isra University Spring 2027 Admissions — Multi-Round Guide',
    content: [
      '> [!IMPORTANT]\n> **Official Admissions Timeline & Round Schedule Notice:**\n> - **Institution:** Isra University (Chartered Private University in Sindh).\n> - **Campuses:** Hyderabad Main Campus, Karachi Campus, and Islamabad Campus.\n> - **Academic Intake:** Spring 2027 Semester (Undergraduate & Graduate Programs).\n> - **Verified Round-I Closing Date:** Round-I online application window closes on **17 November 2026** as per the official university timeline.\n> - **Official Admissions Gateway:** [apply.isra.edu.pk](https://apply.isra.edu.pk/).',
      '### University Profile & Campus Footprint',
      '**Isra University** is a recognized chartered institution renowned for excellence in Medical Sciences, Allied Health, Computer Science, Electrical Engineering, and Management. With its main teaching hospital and sprawling campus in Hyderabad and purpose-built campuses in Karachi and Islamabad, the university accommodates students through structured multi-round admissions.',
      '### Multi-Round Progressive Admission Framework',
      '| Campus | Total Admission Rounds | Round-I Closing Date | Entry Test Window |\n| :--- | :--- | :--- | :--- |\n| **Hyderabad Main Campus** | 3 Progressive Rounds | **17 November 2026** | Scheduled inside applicant dashboard |\n| **Karachi Campus** | 4 Progressive Rounds | **17 November 2026** | Rolling computerized testing |\n| **Islamabad Campus** | 4 Progressive Rounds | **17 November 2026** | Scheduled at Islamabad campus |',
      '### Academic Degree Programs Offered',
      '- **Faculty of Engineering, Science & Technology (FEST):** BS Computer Science, BS Software Engineering, BS Artificial Intelligence, BE Electrical Engineering.\n- **Faculty of Commerce, Economics & Management Sciences (FCE&MS):** BBA (4-Year), BS Accounting & Finance, MBA, MS Management Sciences.\n- **Faculty of Allied Medical & Social Sciences:** Doctor of Physical Therapy (DPT), BS Medical Laboratory Technology (MLT), BS Nursing, BS Psychology.',
      '### Step-by-Step Online Application Process',
      '1. **Access Admissions Portal:** Visit [apply.isra.edu.pk](https://apply.isra.edu.pk).\n2. **Account Creation:** Register using a valid email address and CNIC/B-Form.\n3. **Campus & Program Choice:** Select your desired campus (Hyderabad, Karachi, Islamabad) and order of degree preferences.\n4. **Credential Upload:** Upload intermediate mark sheets, matric certificate, and passport-size photo.\n5. **Voucher Payment:** Generate and pay the admission processing voucher at designated banks or online mobile banking channels.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can students who miss Round-I apply in subsequent rounds?**\nYes. Isra University operates successive rounds (Round-II, Round-III) subject to seat availability in each department.\n\n**Q2: What is the minimum eligibility criteria for BS Computer Science?**\nCandidates must have at least 50% marks in Intermediate (Pre-Engineering, ICS, or Pre-Medical with mathematics).\n\n**Q3: Where can applicants verify test dates?**\nTesting slots and venue instructions appear inside the student dashboard at [apply.isra.edu.pk](https://apply.isra.edu.pk).'
    ]
  }
];

async function updateBatch6() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  console.log('Fetching live articles to build full payloads...');
  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allArticles = (await resAll.json()).data;

  console.log('=== UPDATING BATCH 6 (8 ADMISSIONS & SCHOLARSHIP ARTICLES) ===\n');

  for (const item of batch6Articles) {
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

  console.log('=== BATCH 6 UPDATES COMPLETE ===');
}

updateBatch6().catch(console.error);
