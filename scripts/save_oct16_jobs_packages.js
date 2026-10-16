import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const db = new Database('careerdost.sqlite')

export const oct16JobsPackages = {
  // 1. KP Government Project Associate Internship 2026
  kpInternship: {
    slug: 'kp-government-project-associate-internship-2026',
    title: 'KP Government Project Associate Internship 2026: 5 Vacancies, Rs 25,000 Stipend & Portal Guide',
    category_slug: 'internships',
    category: 'Internships',
    organization: 'Industries, Commerce and Technical Education Department, Government of Khyber Pakhtunkhwa',
    job_type: 'Government Professional Internship (Project Associate)',
    location: 'Peshawar & KP Project Units (KP Domicile Mandatory)',
    qualification: 'Minimum 16 Years Education (BS / Master\'s) in CS, IT, Business Administration, Management Sciences or Economics',
    salary: 'PKR 25,000 Monthly Fixed Stipend (Official Government Notification Rate)',
    experience: 'Fresh Graduates (Graduated within Last 3 Years) with Valid KP / Merged Districts Domicile',
    positions: '5 Confirmed Vacancies (Project Associate Track)',
    last_date: '2026-10-28',
    no_deadline: 0,
    publish_date: '2026-10-16',
    official_link: 'https://internships.kp.gov.pk/',
    apply_link: 'https://internships.kp.gov.pk/',
    is_verified: 1,
    featured: 1,
    logo_initial: 'KP',
    featured_image: '/images/kp-project-associate-internship-2026.webp',
    image_alt: 'KP Government Project Associate Internship 2026 5 Positions Rs 25000 Stipend CareerDost',
    excerpt: 'The Industries, Commerce and Technical Education Department, Government of Khyber Pakhtunkhwa, invites fresh graduates for 5 Project Associate internship positions offering a monthly stipend of PKR 25,000. Learn verified eligibility criteria, 16-year education benchmark, KP domicile requirement, and online portal submission steps before 28 October 2026.',
    seo_title: 'KP Govt Project Associate Internship 2026: 5 Slots & Rs25k Stipend',
    meta_description: 'Apply for KP Government Project Associate Internship 2026: 5 vacancies, Rs 25,000 monthly stipend for 16-year degree holders in CS, BBA, Economics. Deadline: 28 October 2026.',
    focus_keyword: 'KP Government Project Associate Internship 2026',
    canonical_url: 'https://careerdost.blog/jobs/kp-government-project-associate-internship-2026',
    og_title: 'KP Government Project Associate Internship 2026: 5 Vacancies & Rs 25,000 Stipend',
    og_description: 'Official application guide for KP Government Project Associate Internship: 5 slots, Rs 25,000 stipend, KP domicile, and official portal link before 28 October 2026.',
    facebook_caption: `Khyber Pakhtunkhwa Government ki taraf se fresh graduates ke liye shandar internship! 🎓💼
Industries, Commerce and Technical Education Department KP ne 5 Project Associate positions ke liye rasmi portal (internships.kp.gov.pk) faal kar diya hai.
Monthly Stipend: Rs 25,000/- | Last Date: 28 October 2026
Taleem: 16 Years Education (BS / Master) in CS, IT, BBA, Management Sciences ya Economics.
KP aur Merged Districts ka domicile lazmi hai.
Mukammal eligibility criteria aur online apply ka tareeqa:
https://careerdost.blog/jobs/kp-government-project-associate-internship-2026
#KPInternship #ProjectAssociate #GovtJobs #CareerDost`,
    sindhi_facebook_caption: `خيبر پختونخواهه حڪومت پاران پروجيڪٽ ايسوسيئيٽ انٽرنشپ 2026 جو باضابطه اعلان! 🎓💼
صنعت، تجارت ۽ ٽيڪنيڪل ايجوڪيشن کاتي پاران 5 پروجيڪٽ ايسوسيئيٽ سيٽن لاءِ سرڪاري پورٽل کولي ڇڏيو آهي. چونڊيل اميدوارن کي ماهوار 25,000 رپيا وظيفو ڏنو ويندو.
اهليت: 16 سالا تعليم (BS / Master) ڪمپيوٽر سائنس، آءِ ٽي، بي بي اي يا اڪنامڪس ۾. خيبر پختونخواهه جو ڊوميسائل لازمي آهي.
آخري تاريخ: 28 آڪٽوبر 2026.
سرڪاري پورٽل تان آن لائن فارم ڀرڻ جو پورو طريقو:
https://careerdost.blog/jobs/kp-government-project-associate-internship-2026
#KPInternship #ProjectAssociate #GovtJobs #CareerDost`,
    whatsapp_caption: `💼 KP Government Project Associate Internship 2026 Announced!
Positions: 5 Confirmed Slots | Department: Industries, Commerce & Technical Education KP
Monthly Stipend: PKR 25,000/- | Deadline: 28 October 2026
Eligibility: 16-Year Degree (BS/MS in CS, IT, BBA, Economics) | KP Domicile Required
Apply Online: https://careerdost.blog/jobs/kp-government-project-associate-internship-2026`,
    content: [
      "# KP Government Project Associate Internship 2026: 5 Vacancies, Rs 25,000 Stipend & Portal Guide",
      "## Executive Summary & Official Opportunity Announcement\n\nThe **Industries, Commerce and Technical Education Department, Government of Khyber Pakhtunkhwa**, has formally invited online applications from qualified fresh graduates for **five (5) Project Associate internship vacancies** through the centralized provincial internship management system at [internships.kp.gov.pk](https://internships.kp.gov.pk/). This government-backed youth empowerment initiative provides selected candidates with professional public sector experience, hands-on administrative exposure, and a guaranteed **monthly stipend of PKR 25,000** for the duration of the internship tenure.",
      "> [!IMPORTANT]\n> **Key Recruitment Specifications (Verified 16 October 2026):**\n> - **Hiring Authority:** Industries, Commerce and Technical Education Department, KP.\n> - **Designation:** Project Associate (Internship Cadre).\n> - **Total Vacancies:** **5 Confirmed Positions**.\n> - **Monthly Stipend:** **PKR 25,000/-** per month (official notified rate).\n> - **Application Cutoff:** **28 October 2026** (11:59 PM PST).\n> - **Domicile Mandate:** Strictly restricted to candidates holding a valid domicile of **Khyber Pakhtunkhwa (including Merged Tribal Districts / FATA)**.\n> - **Educational Benchmark:** Minimum **16 years of education** (4-year BS or Master's degree) from an HEC-recognized university.\n> - **Official Application Gateway:** [internships.kp.gov.pk](https://internships.kp.gov.pk/).",
      "## Quick Facts & Programme Summary\n\n| RECRUITMENT PARAMETER | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Sponsoring Body** | Government of Khyber Pakhtunkhwa |\n| **Executing Department** | Industries, Commerce & Technical Education Department |\n| **Position Title** | Project Associate |\n| **Total Slots** | 5 Available Vacancies |\n| **Monthly Stipend** | PKR 25,000 Fixed Monthly Allowance |\n| **Minimum Education** | 16 Years (BS / BE / BBA / Master's Degree) |\n| **Target Academic Disciplines**| Computer Science, IT, Business Administration, Management Sciences, Economics |\n| **Maximum Age Limit** | Up to 29 Years |\n| **Domicile Restriction** | Khyber Pakhtunkhwa & Merged Tribal Districts Only |\n| **Application Deadline** | **28 October 2026** |\n| **Department Helpline** | +92-91-9210-048 / imanalysisunit@gmail.com |\n| **Official Portal Link** | [internships.kp.gov.pk](https://internships.kp.gov.pk/) |",
      "## Detailed Eligibility: Who Qualifies and Who Does Not\n\nTo ensure merit-based selection and regulatory compliance, the department enforces strict eligibility parameters:\n\n### Who Qualifies for the KP Project Associate Track\n1. **Educational Qualification:** Candidates must possess a 4-year Bachelor's degree (BS/BBA) or Master's degree (minimum 16 years of formal education) recognized by the Higher Education Commission (HEC) in:\n   - Computer Science (BS CS) or Information Technology (BS IT)\n   - Business Administration (BBA / MBA)\n   - Management Sciences or Public Administration\n   - Economics or Applied Statistics\n2. **Academic Standing:** Minimum Second Division (or equivalent 2.50+ CGPA out of 4.00) from an accredited university.\n3. **Graduation Recency:** Targeted primarily at **fresh graduates** who completed their terminal degree within the last three (3) years.\n4. **Domicile Criterion:** Must hold an authentic Computerized National Identity Card (CNIC) and Domicile Certificate of Khyber Pakhtunkhwa or any of the newly merged tribal districts.\n5. **Age Limit:** Maximum age of **29 years** as of 28 October 2026.\n\n### Who Does Not Qualify\n- Candidates holding domiciles of Sindh, Punjab, Balochistan, Islamabad, AJK, or Gilgit-Baltistan (provincial quota rules apply strictly).\n- Candidates with 14 years of education (Associate Degree / conventional BA / B.Sc) without a 16-year terminal degree.\n- Individuals currently employed in regular government service or already enrolled in another concurrent public-sector paid internship program.\n- Candidates exceeding 29 years of age.",
      "## Core Project Responsibilities & Professional Exposure\n\nSelected Project Associates will be deployed within designated project implementation units and departmental wings, assisting senior officers in:\n\n1. **Data Analytics & Reporting:** Analyzing industrial investment statistics, technical training center performance metrics, and commercial registry data.\n2. **Project Documentation & Monitoring:** Preparing PC-I project documentation, monthly monitoring briefs, and field inspection reports for development schemes.\n3. **Digital Management Information Systems (MIS):** Supporting the department's digital operations, database management, and electronic correspondence systems.\n4. **Public-Private Stakeholder Coordination:** Facilitating meetings with chambers of commerce, industrial estate managers, and technical training institutes across the province.",
      "## Step-by-Step Online Application Guide\n\nEligible applicants should complete their registration through the official portal before the 28 October deadline:\n\n1. **Access the Portal:** Open your web browser and navigate to [internships.kp.gov.pk](https://internships.kp.gov.pk/).\n2. **Create Applicant Account:** Register using your active mobile number, CNIC, and personal email address.\n3. **Fill Candidate Profile:** Enter your personal information, domicile district, date of birth, and permanent address.\n4. **Add Educational Credentials:** Input your academic history from Matriculation to your terminal 16-year degree, specifying university name, passing year, total marks, and obtained CGPA.\n5. **Select Vacancy:** Locate **Project Associate (Industries, Commerce and Technical Education Department)** and click **Apply**.\n6. **Upload Mandatory Documents:** Upload clear scanned PDF copies of your CNIC front/back, Domicile certificate, passport-sized photograph, and final degree transcript.\n7. **Submit & Download Application Slip:** Verify all entries and finalize your submission. Save your unique candidate registration number for test and interview call-up notices.",
      "## Documents Checklist for Verification\n\nCandidates called for formal scrutiny must present original and attested photocopies of:\n\n- Original 13-digit Computerized National Identity Card (CNIC).\n- Original Khyber Pakhtunkhwa Domicile Certificate.\n- Detailed Marks Certificate (DMC) and Degree Certificate of 16-Year terminal degree.\n- Matriculation and Intermediate educational certificates.\n- Two recent passport-size photographs with white background.\n- HEC degree equivalence certificate (only if degree was obtained from an overseas institution).",
      "## Crucial Anti-Fraud Advisory for Candidates\n\n> [!WARNING]\n> **Beware of Fraudulent Claims & Unauthorized Payment Demands:**\n> - **Zero Processing Fee:** The KP Internship Portal does **not** charge any application submission fee, bank challan, or registration charge. Do not transfer money to any individual claiming to provide 'verified selection.'\n> - **Official Domain Only:** Only submit your profile on `https://internships.kp.gov.pk/`. Beware of fake clones on unofficial domains.\n> - **Direct Government Recruitment:** Selection is based purely on merit, academic records, and screening evaluations conducted by the department.",
      "## Frequently Asked Questions (FAQ)\n\n**Q1: What is the monthly stipend for the KP Project Associate Internship?**\nSelected interns receive a fixed, officially notified monthly stipend of **PKR 25,000/-** per month.\n\n**Q2: Can candidates with a Sindh or Punjab domicile apply?**\nNo. The scheme is funded by the Government of Khyber Pakhtunkhwa and strictly mandates a valid domicile of Khyber Pakhtunkhwa or its Merged Districts.\n\n**Q3: Is previous work experience required for this role?**\nNo. The position is structured specifically for fresh graduates with 0 to 1 year of experience.\n\n**Q4: What is the last date to submit the online application?**\nThe application window closes at 11:59 PM PST on **28 October 2026**.\n\n**Q5: Who can I contact for technical issues on the portal?**\nCandidates encountering technical issues can contact the department's support unit at **+92-91-9210-048** or via email at `imanalysisunit@gmail.com`.",
      "## Official Source Attribution & Related CareerDost Resources\n\n- **Official Portal Source:** [Khyber Pakhtunkhwa Internship Portal](https://internships.kp.gov.pk/).\n- **Administrative Department:** [Industries, Commerce and Technical Education Department KP](https://kp.gov.pk).\n- **Related Career Opportunities:** [10Pearls SHINE Virtual Internship 2026](https://careerdost.blog/jobs/10pearls-shine-virtual-internship-2026), [MCB Bank Information Security Trainee 2026](https://careerdost.blog/jobs/mcb-bank-infosec-trainee-jobs-2026), and [Bank Alfalah Jobs & Internships Complete Guide](https://careerdost.blog/jobs/bank-alfalah-jobs-internships-2026)."
    ]
  },

  // 2. Aga Khan University (AKU) Karachi Jobs & Traineeships 2026
  akuKarachi: {
    slug: 'aku-karachi-jobs-traineeships-2026',
    title: 'Aga Khan University Jobs 2026: Karachi Traineeships, Hospital Vacancies & Taleo Portal Guide',
    category_slug: 'private-jobs',
    category: 'Private Jobs',
    organization: 'Aga Khan University (AKU) & Aga Khan University Hospital (AKUH)',
    job_type: 'Management Traineeship, Clinical Traineeship & Permanent Healthcare Staff',
    location: 'Karachi, Sindh (Stadium Road Campus, Clifton Medical Services & Secondary Hospitals)',
    qualification: 'Graduation to Post-Graduation (BBA, BS, BE, MBA, Nursing, Allied Health Sciences, MBBS)',
    salary: 'Paid On-The-Job Traineeship Stipend & Competitive Institutional Salary Scales',
    experience: 'Fresh Graduates to Experienced Professionals (Program Specific Criteria)',
    positions: 'Multiple Trainee & Specialist Postings Across Academic & Hospital Divisions',
    last_date: 'Departmental Rolling Deadlines (Check Specific Job ID on Taleo)',
    no_deadline: 1,
    publish_date: '2026-10-16',
    official_link: 'https://www.aku.edu/careers',
    apply_link: 'https://aku.taleo.net/careersection/',
    is_verified: 1,
    featured: 1,
    logo_initial: 'AKU',
    featured_image: '/images/aku-karachi-careers-traineeships-2026.webp',
    image_alt: 'Aga Khan University AKU Karachi Jobs and Traineeships 2026 Taleo Portal CareerDost',
    excerpt: 'Aga Khan University (AKU) and University Hospital in Karachi are accepting applications for its 12-month Management Traineeship, IT traineeships, clinical nursing, and research vacancies. Explore verified eligibility criteria across Karachi campuses, paid traineeship benefits, and step-by-step Taleo portal application guide.',
    seo_title: 'AKU Karachi Jobs & Traineeships 2026: Taleo Application Guide',
    meta_description: 'Apply for Aga Khan University (AKU) Karachi jobs & traineeships 2026. Management traineeships, IT, clinical, and research roles on Stadium Road & Clifton. Check Taleo portal.',
    focus_keyword: 'AKU Karachi Jobs 2026',
    canonical_url: 'https://careerdost.blog/jobs/aku-karachi-jobs-traineeships-2026',
    og_title: 'Aga Khan University Jobs 2026: Karachi Traineeships & Taleo Portal Guide',
    og_description: 'Comprehensive recruitment guide for Aga Khan University (AKU) in Karachi: 12-month Management Traineeships, IT & hospital vacancies, eligibility, and Taleo application steps.',
    facebook_caption: `Aga Khan University (AKU) Karachi mein fresh graduates aur professionals ke liye shandar jobs aur traineeships! 🏥🎓
AKU aur University Hospital ne 12-Mahina Management Traineeship Programme, IT Trainees, Clinical Nursing aur Research Specialists ke liye applications mangi hain.
Locations: Stadium Road Campus aur Clifton Medical Services, Karachi.
Taleem: BBA, MBA, BS, BE, Nursing ya Allied Health Sciences. Fresh graduates ke liye paid on-the-job training ka behtareen platform.
Taleo Portal se online apply ka tareeqa:
https://careerdost.blog/jobs/aku-karachi-jobs-traineeships-2026
#AKUKarachi #AgaKhanUniversity #KarachiJobs #HealthCareers #CareerDost`,
    sindhi_facebook_caption: `آغا خان يونيورسٽي (AKU) ڪراچي ۾ نوڪرين ۽ ٽرينيشپس جا شاندار موقعا! 🏥🎓
آغا خان يونيورسٽي ۽ يونيورسٽي اسپتال ڪراچي پاران 12 مهينن جي مئنيجمينٽ ٽريني پروگرام (MTP)، آءِ ٽي ٽرينيز، ڪلينيڪل نرسنگ، ليبارٽري ٽيڪنالوجسٽ ۽ ريسرچ شعبن لاءِ نيون خالي جايون جاري ڪيون ويون آهن.
اهليت: بي بي اي، ايم بي اي، بي ايس، بي اي يا نرسنگ جا تازو پاس ٿيل نوجوان.
لوڪيشن: اسٽيڊيم روڊ ۽ ڪلفٽن ڪيمپس، ڪراچي (سنڌ).
سرڪاري ٽيليو پورٽل تان اپلائي ڪرڻ جو پورو طريقو:
https://careerdost.blog/jobs/aku-karachi-jobs-traineeships-2026
#AKUKarachi #AgaKhanUniversity #KarachiJobs #HealthCareers #CareerDost`,
    whatsapp_caption: `🏥 Aga Khan University (AKU) Karachi Jobs & Traineeships 2026
Location: Stadium Road Campus & Clifton, Karachi, Sindh
Programs: 12-Month Management Traineeship (MTP), IT Trainees, Clinical & Research Roles
Eligibility: Fresh & Experienced Graduates (BS, BE, BBA, MBA, Nursing, Allied Health)
Apply Online via Taleo: https://careerdost.blog/jobs/aku-karachi-jobs-traineeships-2026`,
    content: [
      "# Aga Khan University Jobs 2026: Karachi Traineeships, Hospital Vacancies & Taleo Portal Guide",
      "## Executive Summary & Institutional Overview\n\nThe **Aga Khan University (AKU)** and its flagship **Aga Khan University Hospital (AKUH)** in Karachi maintain continuous talent acquisition drives across academic teaching faculties, hospital clinical wings, IT enterprise operations, and structured early-career traineeships. Widely recognized as one of South Asia's leading healthcare and higher education institutions, AKU offers structured **12-month Management Traineeships**, specialized **Allied Health & IT Traineeships**, and permanent career appointments at its main **Stadium Road Campus**, **Clifton Medical Services**, and regional diagnostic centers throughout Karachi and interior Sindh.",
      "> [!IMPORTANT]\n> **Recruitment Highlights at a Glance (Verified October 2026):**\n> - **Hiring Institution:** Aga Khan University (AKU) & University Hospital Karachi.\n> - **Primary Early-Career Track:** 12-Month Management Traineeship Programme (MTP) & On-The-Job Technical Traineeships.\n> - **Primary Deployment Locations:** Karachi (Stadium Road, Clifton, Karimabad, Garden & Secondary Centers).\n> - **Academic Disciplines:** Business Administration (BBA/MBA), Computer Science & IT (BS/BE), Nursing, Pharmacy, Laboratory Sciences, and General Sciences.\n> - **Financial Compensation:** Paid monthly stipend for all formalized traineeship cohorts; competitive institutional salary scales and provident fund for regular appointments.\n> - **Official Application Gateway:** [aku.taleo.net/careersection](https://aku.taleo.net/careersection/).",
      "## Quick Facts & Operational Specifications\n\n| RECRUITMENT PARAMETER | VERIFIED OFFICIAL DETAILS |\n| :--- | :--- |\n| **Organization** | Aga Khan University (AKU) & Hospital Karachi |\n| **Sector** | Autonomous Healthcare & Higher Education Institution |\n| **Primary Location** | Karachi, Sindh, Pakistan |\n| **Featured Intake 1** | Management Traineeship Programme (12-Month Accelerated Rotation) |\n| **Featured Intake 2** | IT & Technical Traineeships (Software, Networks & Systems) |\n| **Featured Intake 3** | Clinical Traineeships (Nursing, Pharmacy & Laboratory Tech) |\n| **Eligibility Benchmark** | Minimum CGPA of 3.0 out of 4.0 (for Management & IT Traineeships) |\n| **Experience Level** | Fresh Graduates to 1 Year Experience for Trainee Tracks |\n| **Application System** | Online Taleo Talent Management System |\n| **Official Careers Portal** | [aku.edu/careers](https://www.aku.edu/careers) |",
      "## Detailed Breakdown of Early-Career Traineeship Tracks\n\nAKU provides several distinct career entry points tailored to various academic disciplines:\n\n### 1. Management Traineeship Programme (MTP)\n- **Overview:** A premier 12-month fast-track development initiative designed to groom future institutional administrators, operational managers, and healthcare leadership talent.\n- **Rotations:** Trainees rotate across Human Resources, Finance, Hospital Operations, Supply Chain Management, Patient Services, and Internal Audit.\n- **Eligibility:** Fresh graduates holding a Bachelor's (BBA/BS) or Master's (MBA/MS) degree from HEC-recognized institutions with a minimum cumulative GPA of **3.0 out of 4.0**.\n- **Benefits:** Full monthly stipend, comprehensive medical benefits, and fast-track evaluation for regular Assistant Manager or Executive openings upon successful completion.\n\n### 2. Information Technology (IT) Traineeships\n- **Overview:** On-the-job training within AKU's central IT and Enterprise Technology Division, managing digital healthcare records, clinical software, data security, and network infrastructure.\n- **Eligibility:** BS Computer Science, Software Engineering, or Information Technology graduates with foundational knowledge of SQL, Python, network protocols, or web frameworks.\n\n### 3. Clinical & Laboratory Traineeships\n- **Overview:** Specialized hands-on hospital apprenticeships for graduates in Nursing (BScN), Medical Laboratory Technology (BS MLT), and Doctor of Pharmacy (Pharm-D), providing clinical ward and diagnostic exposure under accredited international medical standards.",
      "## Step-by-Step Taleo Application Process\n\nApplications for AKU positions must be submitted through the official Taleo Talent Management Portal:\n\n1. **Visit the Career Portal:** Open [aku.edu/careers](https://www.aku.edu/careers) and click on **Apply Online / Search Vacancies**.\n2. **Access Taleo Portal:** You will be redirected to the secure Taleo environment at [aku.taleo.net/careersection/](https://aku.taleo.net/careersection/).\n3. **Search Jobs by Location:** Set the location filter to **Pakistan > Karachi** to view active requisitions.\n4. **Create a Candidate Profile:** Click **Sign In** or **New User**. Register using your active email address and a secure password.\n5. **Upload Curriculum Vitae (CV):** Upload your resume in PDF or DOCX format. The system's resume parser will automatically populate work and educational fields.\n6. **Complete Qualifications & Questionnaires:** Complete mandatory questions regarding your graduation year, CGPA, degree discipline, and notice period.\n7. **Submit Application:** Review your information carefully and click **Submit**. Record your unique Taleo Job Submission ID.",
      "## Candidate Documents Checklist\n\nEnsure digital copies of the following documents are ready for upload and in-person verification:\n\n- Updated Curriculum Vitae (CV) emphasizing relevant project work and internships.\n- Final degree certificate and official academic transcripts showing cumulative CGPA.\n- Computerized National Identity Card (CNIC).\n- Professional registration certificates (e.g., PNC for Nurses, Pharmacy Council registration for Pharmacists, or PEC for Engineers).\n- Two professional or academic recommendation letters.",
      "## Institutional Transparency & Anti-Fraud Advisory\n\n> [!WARNING]\n> **Protect Yourself from Recruitment Impersonators:**\n> - **No Recruitment Fees:** Aga Khan University never demands any application fee, testing fee, or refundable security deposit from job applicants.\n> - **Official Email Domains Only:** Official communication is issued strictly from `@aku.edu` email domains. Disregard emails sent from Gmail, Yahoo, or WhatsApp numbers claiming to represent AKU HR.\n> - **Submit Exclusively on Taleo:** Never send confidential documents or fees to third-party recruitment agencies claiming 'guaranteed job placement' at AKU.",
      "## Frequently Asked Questions (FAQ)\n\n**Q1: Where are the primary job locations for AKU vacancies?**\nThe vast majority of administrative, teaching, and hospital vacancies are located at the Aga Khan University Stadium Road Campus and Clifton Medical Services in Karachi, Sindh.\n\n**Q2: What is the minimum CGPA required for the Management Traineeship Programme?**\nThe standard academic requirement for the Management Traineeship is a minimum CGPA of **3.0 out of 4.0** (or equivalent 70% in conventional grading).\n\n**Q3: Can candidates from outside Karachi apply for these roles?**\nYes. Graduates from universities across Sindh (such as Mehran UET, University of Sindh, Sukkur IBA) and nationwide are eligible to apply, provided they can relocate to Karachi for on-site duties.\n\n**Q4: Are AKU traineeships paid?**\nYes. All formalized AKU traineeship programs—including Management Traineeships and Allied Health Traineeships—provide a paid monthly stipend.\n\n**Q5: How can I check the status of my Taleo application?**\nLog into your candidate profile at [aku.taleo.net/careersection/](https://aku.taleo.net/careersection/) and open the **My Job Cart / My Applications** section to check real-time application review status.",
      "## Source Attribution & Related CareerDost Resources\n\n- **Official Career Portal:** [Aga Khan University Careers](https://www.aku.edu/careers) and [AKU Taleo Portal](https://aku.taleo.net/careersection/).\n- **Related Career Guides:** [MCB Bank Information Security Trainee 2026](https://careerdost.blog/jobs/mcb-bank-infosec-trainee-jobs-2026), [Bank Alfalah Jobs & Internships Complete Guide](https://careerdost.blog/jobs/bank-alfalah-jobs-internships-2026), and [10Pearls SHINE Virtual Internship 2026](https://careerdost.blog/jobs/10pearls-shine-virtual-internship-2026)."
    ]
  },

  // 3. Systems Limited Associate Software Engineer & Graduate Opportunities 2026
  systemsLimited: {
    slug: 'systems-limited-associate-software-engineer-jobs-2026',
    title: 'Systems Limited Jobs 2026: Associate Software Engineer, Trainee Program & Application Guide',
    category_slug: 'it-jobs',
    category: 'IT Jobs',
    organization: 'Systems Limited',
    job_type: 'Permanent IT Career (Associate Software Engineer / Graduate Trainee)',
    location: 'Karachi, Lahore, Islamabad & Remote / Hybrid Opportunities',
    qualification: 'BS / MS in Computer Science, Software Engineering, IT, or Computer Engineering',
    salary: 'Competitive Market Salary, Medical Insurance, Provident Fund & Annual Bonuses',
    experience: 'Fresh Graduates (0 to 1 Year Experience) or Final-Semester Students Awaiting Results',
    positions: 'Multiple Associate Development, Cloud, Data & Quality Assurance Positions',
    last_date: 'Rolling Quarterly Intakes (Q4 2026 Recruitment Drive)',
    no_deadline: 1,
    publish_date: '2026-10-16',
    official_link: 'https://www.systemsltd.com/careers',
    apply_link: 'https://www.systemsltd.com/careers',
    is_verified: 1,
    featured: 1,
    logo_initial: 'SYS',
    featured_image: '/images/systems-limited-ase-jobs-2026.webp',
    image_alt: 'Systems Limited Jobs 2026 Associate Software Engineer and Graduate Trainee Program CareerDost',
    excerpt: 'Systems Limited is accepting applications for Associate Software Engineer and Graduate Trainee positions across Karachi, Lahore, and Islamabad. Tailored for fresh Computer Science, Software Engineering, and IT graduates, the intake covers Full Stack, .NET, Java, Cloud, Data, and QA tracks. Learn eligibility benchmarks and how to apply.',
    seo_title: 'Systems Limited Jobs 2026: Associate Software Engineer Guide',
    meta_description: 'Apply for Systems Limited Associate Software Engineer jobs 2026. Fresh CS and IT graduates in Karachi, Lahore, Islamabad. Check .NET, Java, Cloud tracks and official portal.',
    focus_keyword: 'Systems Limited Jobs 2026',
    canonical_url: 'https://careerdost.blog/jobs/systems-limited-associate-software-engineer-jobs-2026',
    og_title: 'Systems Limited Jobs 2026: Associate Software Engineer & Trainee Program',
    og_description: 'Verified hiring guide for Systems Limited: Associate Software Engineer roles in Karachi, Lahore, and Islamabad for fresh CS/IT graduates. Tracks, eligibility, and portal steps.',
    facebook_caption: `Pakistan ki sab se badi IT company Systems Limited mein fresh graduates ke liye shandar jobs! 💻🚀
Systems Limited ne Associate Software Engineer (ASE) aur Graduate Trainee positions ke liye applications open kar di hain.
Tracks: Full-Stack (.NET, Java), Cloud (Azure/AWS), Data Engineering, Business Applications (Dynamics 365) aur Quality Assurance (QA).
Locations: Karachi, Lahore, Islamabad aur Hybrid/Remote options.
Taleem: BS / MS in Computer Science, Software Engineering ya IT. Fresh graduates aur final-semester students eligible hain.
Official careers portal se apply ka tareeqa:
https://careerdost.blog/jobs/systems-limited-associate-software-engineer-jobs-2026
#SystemsLimited #ITJobs #SoftwareEngineer #KarachiTech #CareerDost`,
    sindhi_facebook_caption: `پاڪستان جي سڀ کان وڏي آءِ ٽي ڪمپني سسٽمز لميٽيڊ ۾ فريش گريجوئيٽس لاءِ شاندار موقعا! 💻🚀
سسٽمز لميٽيڊ (Systems Limited) پاران ايسوسيئيٽ سافٽ ويئر انجنيئر (ASE) ۽ گريجوئيٽ ٽريني پوزيشنز لاءِ درخواستون گهريون ويون آهن.
ٽيڪنيڪل ٽريڪس: .NET، جاوا، فل اسٽيڪ، ڪلائوڊ، ڊيٽا انجنيئرنگ ۽ ڪوالٽي ايشورنس (QA).
لوڪيشنز: ڪراچي، لاهور، اسلام آباد ۽ هائبرڊ/ريموٽ سهولت.
اهليت: ڪمپيوٽر سائنس (BS CS/SE/IT) جا فريش گريجوئيٽس يا فائنل سيمسٽر جا شاگرد.
سرڪاري ڪيريئر پورٽل تان اپلائي ڪرڻ جو پورو طريقو:
https://careerdost.blog/jobs/systems-limited-associate-software-engineer-jobs-2026
#SystemsLimited #ITJobs #SoftwareEngineer #KarachiTech #CareerDost`,
    whatsapp_caption: `🚀 Systems Limited Jobs 2026: Associate Software Engineer (ASE) Openings!
Locations: Karachi, Lahore, Islamabad & Hybrid Work Options
Eligibility: Fresh BS/MS in Computer Science, Software Engineering, IT, or Computer Systems
Tracks: .NET, Java, Cloud, Data, Full-Stack & QA Engineering
Apply Directly via Official Careers Portal: https://careerdost.blog/jobs/systems-limited-associate-software-engineer-jobs-2026`,
    content: [
      "# Systems Limited Jobs 2026: Associate Software Engineer, Trainee Program & Application Guide",
      "## Executive Summary & IT Industry Leadership\n\n**Systems Limited**, Pakistan's premier global technology innovator and top software exporter, is actively hiring across its core engineering divisions for the position of **Associate Software Engineer (ASE)** and **Graduate Trainee**. Designed to induct high-potential computer science and software engineering talent graduating from recognized national universities, this program provides structured onboarding, direct exposure to enterprise client architectures, and mentorship from senior technology consultants across modern technology stacks in **Karachi, Lahore, Islamabad**, and flexible remote/hybrid models.",
      "> [!IMPORTANT]\n> **Key Hiring Highlights at a Glance:**\n> - **Hiring Enterprise:** Systems Limited (Global IT Innovations).\n> - **Target Role:** Associate Software Engineer (ASE) / Graduate Trainee.\n> - **Key Operational Centers:** Karachi (Clifton & Shahrah-e-Faisal Tech Hubs), Lahore, and Islamabad.\n> - **Educational Benchmark:** 4-Year BS or MS degree in Computer Science, Software Engineering, Computer Systems Engineering, or Information Technology.\n> - **Experience Requirement:** **0 to 1 Year (Fresh Graduates Welcome)**; final-semester students with confirmed degree completion timelines are eligible.\n> - **Work Format:** On-site at corporate tech campuses with hybrid working flexibility.\n> - **Official Application Gateway:** [systemsltd.com/careers](https://www.systemsltd.com/careers).",
      "## Quick Facts & Job Specifications\n\n| RECRUITMENT PARAMETER | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Company Name** | Systems Limited |\n| **Designation** | Associate Software Engineer (ASE) |\n| **Employment Status** | Permanent Staff Cadre |\n| **Target Cities** | Karachi, Lahore, Islamabad & Remote Hybrid |\n| **Minimum Degree** | BS in Computer Science, Software Engineering or IT |\n| **Minimum CGPA** | Minimum 2.80 to 3.00 CGPA (or 70% equivalent) |\n| **Technology Verticals** | .NET Core, Java, Cloud Native, Data Analytics, QA, Dynamics 365 |\n| **Benefits Package** | Market-Leading Salary, Health & OPD Insurance, Provident Fund, Certifications |\n| **Application Deadline** | Continuous Rolling Intakes (Q4 2026 Active Batch) |\n| **Official Portal Link** | [systemsltd.com/careers](https://www.systemsltd.com/careers) |",
      "## Core Technology Tracks for Associate Software Engineers\n\nSuccessful candidates are assigned to specialized business units based on their technical aptitude, algorithmic assessment results, and engineering interests:\n\n1. **Enterprise Full Stack & .NET Development:** Engineering scalable web services, microservices, and enterprise backends using C#, .NET Core, SQL Server, and modern frontend frameworks (Angular, React).\n2. **Java & Cloud-Native Engineering:** Developing distributed software solutions utilizing Java/Spring Boot, Docker containerization, Kubernetes clusters, and cloud environments (Microsoft Azure, AWS, GCP).\n3. **Data Engineering & Business Intelligence:** Building data extraction pipelines, ETL workflows, data warehousing, and predictive reporting dashboards using Python, PySpark, Power BI, and Databricks.\n4. **Software Quality Assurance & Automation:** Designing test strategies, developing automated testing scripts using Selenium, Cypress, and Postman, and performing performance/load testing.\n5. **Enterprise Business Applications (Microsoft Dynamics 365):** Configuring enterprise ERP and CRM platforms, building custom workflows, and deploying solutions for international Fortune 500 clients.",
      "## Detailed Eligibility & Academic Benchmarks\n\nApplicants must satisfy the following baseline criteria:\n\n- **Education:** BS or MS in Computer Science, Software Engineering, Computer Engineering, or Data Science from an HEC-accredited institution.\n- **Technical Proficiency:** Strong foundation in Object-Oriented Programming (OOP), Data Structures and Algorithms (DSA), Database Management Systems (RDBMS/SQL), and fundamental software architecture concepts.\n- **Final-Year Students:** Candidates currently in their 8th semester who have completed coursework and are awaiting degree conferment are eligible to apply.\n- **Sindh Talent Inclusion:** Graduates from engineering and CS institutes across Sindh—including FAST Karachi, NED University, IBA Karachi, SSUET, Dawood UET, and Sukkur IBA—are strongly prioritized for Karachi technology center placements.",
      "## Step-by-Step Application Procedure\n\nFollow these verified steps to submit your candidacy to Systems Limited:\n\n1. **Visit the Careers Hub:** Navigate to [systemsltd.com/careers](https://www.systemsltd.com/careers) or the dedicated [systemsltd.com/trainees](https://www.systemsltd.com/trainees) portal.\n2. **Filter Open Positions:** Search for **Associate Software Engineer** or filter by your preferred city (e.g., *Karachi* or *Lahore*).\n3. **Register Candidate Profile:** Fill out your personal details, contact number, degree institution, and CGPA.\n4. **Upload Resume & Portfolio:** Attach an updated PDF resume highlighting academic projects, GitHub repository links, personal tech stacks, and relevant software development internships.\n5. **Technical Screening:** Shortlisted candidates will receive an invitation to an online coding assessment evaluating algorithmic problem solving, logic puzzles, and core CS fundamentals.\n6. **Technical & HR Interviews:** Candidates who pass the assessment undergo a structured technical evaluation followed by an HR interview before final offer letter issuance.",
      "## Frequently Asked Questions (FAQ)\n\n**Q1: Can fresh graduates with no prior experience apply for Associate Software Engineer roles?**\nYes. The Associate Software Engineer role is specifically designed for fresh graduates and entry-level professionals with 0 to 1 year of experience.\n\n**Q2: Does Systems Limited hire candidates in Karachi?**\nYes. Systems Limited maintains major technology development centers in Karachi (including Clifton and Shahrah-e-Faisal offices), serving financial and international enterprise clients.\n\n**Q3: What technical subjects should candidates prepare for the screening test?**\nCandidates should thoroughly review Object-Oriented Programming (OOP), Data Structures & Algorithms, Basic SQL Database Queries, and problem-solving fundamentals in their language of choice (C++, C#, Java, or Python).\n\n**Q4: Are final-semester students eligible to apply?**\nYes. Students in their final semester who have finished their coursework or are completing their final capstone project can apply with their 7th-semester provisional transcript.\n\n**Q5: Does Systems Limited charge any application or testing fee?**\nNo. Systems Limited never charges any fee at any stage of the recruitment process. Applications submitted through official channels are completely free.",
      "## Source Attribution & Related CareerDost Resources\n\n- **Official Corporate Careers Portal:** [Systems Limited Careers](https://www.systemsltd.com/careers).\n- **Related Tech Opportunities:** [10Pearls SHINE Virtual Internship 2026](https://careerdost.blog/jobs/10pearls-shine-virtual-internship-2026), [MCB Bank Information Security Trainee 2026](https://careerdost.blog/jobs/mcb-bank-infosec-trainee-jobs-2026), and [Bank Alfalah Jobs & Internships Complete Guide](https://careerdost.blog/jobs/bank-alfalah-jobs-internships-2026)."
    ]
  },

  // 4. HBL Graduate & Early Careers — The League & Project Internships 2026
  hblCareers: {
    slug: 'hbl-jobs-internships-the-league-2026',
    title: 'HBL Jobs 2026: The League Management Trainee, Project Internships & Career Portal Guide',
    category_slug: 'bank-jobs',
    category: 'Bank Jobs',
    organization: 'Habib Bank Limited (HBL)',
    job_type: 'Management Trainee Program (MTP), Project Internship 2026 & Accelerate Graduates',
    location: 'Karachi (Head Office / Tech Hubs), Hyderabad, Sindh & Pan-Pakistan Network',
    qualification: 'Graduation to Post-Graduation (BBA, MBA, BS CS, IT, Data Analytics, Economics, Finance)',
    salary: 'Paid Trainee Allowance / Market-Competitive Banking Remuneration',
    experience: 'Fresh Graduates (0 to 2 Years) for MTP; Enrolled / Recent Graduates for Internships',
    positions: 'Nationwide Cohorts across Retail, Digital Banking, Corporate, Risk & Analytics',
    last_date: 'Rolling Annual & Project Batches (Check Official HBL People Cloud)',
    no_deadline: 1,
    publish_date: '2026-10-16',
    official_link: 'https://www.hbl.com/careers',
    apply_link: 'https://www.hbl.com/careers',
    is_verified: 1,
    featured: 1,
    logo_initial: 'HBL',
    featured_image: '/images/hbl-the-league-jobs-internships-2026.webp',
    image_alt: 'HBL Jobs 2026 The League Management Trainee and Project Internships CareerDost',
    excerpt: 'Habib Bank Limited (HBL) invites applications for its early-career talent programs, including \'The League\' Management Trainee Program, Project Internships 2026, and Accelerate Graduate tracks across Karachi, Hyderabad, and nationwide hubs. Explore verified qualification criteria, rotational streams, and Oracle Cloud application instructions.',
    seo_title: 'HBL Jobs 2026: The League & Project Internships Guide',
    meta_description: 'Apply for HBL Jobs 2026: The League Management Trainee Program & Project Internships in Karachi, Hyderabad, and nationwide. Check eligibility, CGPA, and official portal.',
    focus_keyword: 'HBL Jobs 2026',
    canonical_url: 'https://careerdost.blog/jobs/hbl-jobs-internships-the-league-2026',
    og_title: 'HBL Jobs 2026: The League Management Trainee & Project Internships Guide',
    og_description: 'Complete recruitment guide for HBL early careers: The League Management Trainees, Project Internships 2026 in Karachi and nationwide. Eligibility and Oracle Cloud portal steps.',
    facebook_caption: `Pakistan ke sab se bade bank HBL mein early careers aur internships ke behtareen mawaqe! 🏦📈
Habib Bank Limited (HBL) ne apne signature talent intake 'The League' (Management Trainee Program), Project Internships 2026 aur Accelerate Graduate roles ke liye applications open rakhi hain.
Streams: Digital Banking, Financial Technology, Retail, Corporate Banking, Risk Management aur Data Analytics.
Locations: Karachi Head Office, Hyderabad, Sukkur, Sindh aur Pan-Pakistan branches.
Taleem: BBA, MBA, BS CS, Finance ya Economics graduates.
HBL People Cloud (Oracle HCM) portal se online apply ka tareeqa:
https://careerdost.blog/jobs/hbl-jobs-internships-the-league-2026
#HBL #HBLTheLeague #BankingJobs #ManagementTrainee #CareerDost`,
    sindhi_facebook_caption: `حبيب بينڪ (HBL) ۾ مئنيجمينٽ ٽريني ۽ پروجيڪٽ انٽرنشپ 2026 جا موقعا! 🏦📈
ايڇ بي ايل پاران پنهنجي مشهور ارلي ڪيريئر پروگرام ’دي ليگ‘ (The League) تحت مئنيجمينٽ ٽريني پروگرام (MTP) ۽ پروجيڪٽ انٽرنشپ 2026 لاءِ ٽيلنٽ هائرنگ شروع ڪئي وئي آهي.
شعبا: ڊجيٽل بينڪنگ، آءِ ٽي، فنانس، ريسڪ مئنيجمينٽ، ڊيٽا اينالائيٽڪس ۽ ريٽيل بينڪنگ.
لوڪيشنز: ڪراچي (هيڊ آفيس)، حيدرآباد، سنڌ ۽ پوري پاڪستان جا مک شهر.
اهليت: بي بي اي، ايم بي اي، بي ايس ڪمپيوٽر سائنس، فنانس يا اڪنامڪس گريجوئيٽس. فريش اميدوار به اهڙي درخواست جمع ڪرائي سگهن ٿا.
ايڇ بي ايل جي باضابطه پيپل ڪلائوڊ پورٽل تان اپلائي ڪرڻ جو طريقو:
https://careerdost.blog/jobs/hbl-jobs-internships-the-league-2026
#HBL #HBLTheLeague #BankingJobs #ManagementTrainee #KarachiJobs #CareerDost`,
    whatsapp_caption: `🏦 HBL Jobs & Internships 2026: The League & Project Internships Guide
Programs: Management Trainee Program (The League), Project Internships 2026, Accelerate Graduates
Locations: Karachi Head Office, Hyderabad, Sindh & Nationwide Hubs
Eligibility: Fresh & Recent Graduates (BBA, MBA, BS CS, Finance, Economics)
Apply Online via HBL People Cloud: https://careerdost.blog/jobs/hbl-jobs-internships-the-league-2026`,
    content: [
      "# HBL Jobs 2026: The League Management Trainee, Project Internships & Career Portal Guide",
      "## Executive Summary & Banking Sector Leadership\n\n**Habib Bank Limited (HBL)**, Pakistan's largest commercial banking institution serving over 37 million customers globally, conducts structured talent acquisition drives through its flagship early-career framework branded **The League**. Designed to identify and cultivate future executive leaders and digital banking specialists, The League encompasses the **Management Trainee Program (MTP)**, the specialized **Accelerate Graduates** initiative, and seasonal **Project Internships**. Career opportunities span corporate strategy, retail branch banking, digital product innovation, information security, and financial analytics at the **HBL Plaza Head Office in Karachi**, regional offices in **Hyderabad and Sukkur**, and nationwide commercial banking networks.",
      "> [!IMPORTANT]\n> **Key Recruitment Specifications (Verified October 2026):**\n> - **Hiring Bank:** Habib Bank Limited (HBL).\n> - **Signature Talent Initiative:** The League (Management Trainee Program & Project Internships).\n> - **Target Intake Tracks:**\n>   1. **Management Trainee (MT):** Fresh Graduates with Bachelor's or Master's degrees (0 to 2 years experience).\n>   2. **Project Internships 2026:** Penultimate/final-year university students and fresh graduates (3 to 6-month specialized paid assignments).\n>   3. **Accelerate Graduates (AG):** Master's degree holders with 2 to 4 years of corporate experience.\n> - **Headquarters & Deployment Hubs:** Karachi Head Office, Innovation Labs, Hyderabad, Sukkur, Lahore, Islamabad, and nationwide branches.\n> - **Official Application Gateway:** [hbl.com/careers](https://www.hbl.com/careers) (redirecting to HBL People Cloud Oracle HCM portal).",
      "## Quick Facts & Programme Overview\n\n| PROGRAMME SPECIFICATION | VERIFIED DETAILS |\n| :--- | :--- |\n| **Institution** | Habib Bank Limited (HBL) |\n| **Program Name** | The League (Early Career Intake) & Project Internships |\n| **Employment Status** | Full-Time Trainee / Permanent Banking Career Track |\n| **Eligible Degree Disciplines** | Business Administration, Finance, Accounting, CS, IT, Data Analytics, Economics |\n| **Minimum Academic Benchmark** | Minimum 3.0 CGPA (out of 4.0) or First Class Division |\n| **Age Upper Limit** | 26 to 28 Years for Trainee Programs |\n| **Stipend & Compensation** | Paid Trainee Allowance / Market-Competitive Banking Remuneration |\n| **Primary Posting Centers** | Karachi, Hyderabad, Sindh Regional Hubs & Nationwide Branches |\n| **Application System** | HBL People Cloud (Oracle HCM Cloud Platform) |\n| **Official Portal Link** | [hbl.com/careers](https://www.hbl.com/careers) |",
      "## Comprehensive Functional Streams Across HBL\n\nSelected candidates undergo multi-departmental rotations before final placement across core banking verticals:\n\n1. **Digital Banking & FinTech:** Managing HBL Mobile, Konnect branchless banking, open banking APIs, digital payment gateways, and merchant ecosystems.\n2. **Corporate & Investment Banking:** Financial structuring, syndicated loans, corporate advisory, and treasury operations for multinational and large corporate clients.\n3. **Retail Banking & Consumer Assets:** Consumer lending products, auto financing, mortgage portfolios, and customer experience operations across Pakistan's widest branch network.\n4. **Risk Management & Compliance:** Credit risk assessment, SBP prudential regulation compliance, AML/CFT transaction monitoring, and financial crime prevention.\n5. **Data Analytics & Artificial Intelligence:** Predictive financial modeling, customer churn analysis, credit scoring algorithms, and business intelligence dashboards using modern computational toolsets.",
      "## Detailed Eligibility Criteria: Who Qualifies and Who Does Not\n\n### Who Qualifies for HBL Early-Career Programs\n- **Education:** 4-year Bachelor's degree (BBA, BS) or 2-year Master's degree (MBA, MS) from an HEC-recognized local or foreign university.\n- **Academic Performance:** Minimum CGPA of **3.0 out of 4.0** (or equivalent 70% in conventional grading systems).\n- **Experience Cap:** Fresh university graduates or individuals with up to **2 years** of post-qualification corporate experience.\n- **Age Criterion:** Maximum 26 to 28 years of age at the time of cohort induction.\n- **Talent Reach across Sindh:** Graduates from top universities across Sindh—including IBA Karachi, LUMS, NED University, FAST-NUCES, Mehran UET Jamshoro, and Sukkur IBA—are strongly encouraged to apply.",
      "## Step-by-Step Application Guide via HBL People Cloud\n\nAll legitimate applications must be lodged through HBL's secure Oracle Cloud career portal:\n\n1. **Access the Portal:** Open [hbl.com/careers](https://www.hbl.com/careers) and click **Apply Now**.\n2. **Navigate to Open Requisitions:** You will enter the **HBL People Cloud (Candidate Experience)** environment.\n3. **Search Keywords:** Type *Management Trainee*, *Project Internship*, or browse by location (e.g., *Karachi*, *Hyderabad*).\n4. **Create Profile:** Register your account using your personal email and national identity number (CNIC).\n5. **Enter Educational Profile:** Input your university name, terminal degree title, graduation year, and official CGPA.\n6. **Upload Professional Resume:** Attach your PDF resume highlighting academic honors, extracurricular leadership, technical projects, and internships.\n7. **Submit & Monitor Status:** Submit your profile and monitor your registered email for computerized online cognitive test invitations and panel interview schedules.",
      "## Frequently Asked Questions (FAQ)\n\n**Q1: What is 'The League' at HBL?**\nThe League is HBL's comprehensive umbrella framework for early-career talent, encompassing the Management Trainee Program, Project Internships, and Accelerate Graduate roles.\n\n**Q2: Are HBL Project Internships paid?**\nYes. Structured corporate project internships at HBL provide a monthly stipend to cover local transport and meals for the duration of the 3 to 6-month assignment.\n\n**Q3: Which cities have the most HBL trainee positions?**\nThe majority of strategic, digital, and head office rotations take place in **Karachi**, with regional operational placements across **Hyderabad, Sukkur, Lahore, and Islamabad**.\n\n**Q4: Can candidates awaiting their final results apply?**\nYes. Students in their final semester who have completed all coursework and have a certified provisional transcript reflecting a 3.0+ CGPA can submit their applications.\n\n**Q5: Does HBL charge any recruitment or test fees?**\nNo. HBL does not charge any application or processing fee. All official applications through the HBL People Cloud portal are completely free.",
      "## Source Attribution & Related CareerDost Resources\n\n- **Official Hiring Authority:** [Habib Bank Limited Careers Portal](https://www.hbl.com/careers).\n- **Related Banking Guides:** [MCB Bank Information Security Trainee 2026](https://careerdost.blog/jobs/mcb-bank-infosec-trainee-jobs-2026), [Bank Alfalah Jobs & Internships Complete Guide](https://careerdost.blog/jobs/bank-alfalah-jobs-internships-2026), and [10Pearls SHINE Virtual Internship 2026](https://careerdost.blog/jobs/10pearls-shine-virtual-internship-2026)."
    ]
  },

  // 5. JazzWorld AI Associate & Early Careers 2026
  jazzCareers: {
    slug: 'jazz-careers-ai-associate-programme-2026',
    title: 'Jazz Careers 2026: AI Associate Programme, Digital Internships & Application Guide',
    category_slug: 'it-jobs',
    category: 'IT Jobs',
    organization: 'Jazz (VEON Group)',
    job_type: 'Specialized 1-Year AI Associate Programme & Early-Career Digital Roles',
    location: 'Karachi, Islamabad, Lahore & Hybrid Work Options',
    qualification: 'Bachelor\'s or Master\'s in Data Science, Artificial Intelligence, CS, Software Engineering or Business Analytics',
    salary: 'Competitive Corporate Monthly Compensation, Medical Insurance, Mobile Allowance & Gym Access',
    experience: 'Fresh Graduates (0 to 1 Year) with Foundational Skills in Python, Machine Learning & Cloud Analytics',
    positions: 'Specialized Cohort Slots in Digital, Fintech, Data Science & AI Engineering',
    last_date: 'Rolling Annual Cohort Ingestion (Check Specific Requisitions on JazzWorld Portal)',
    no_deadline: 1,
    publish_date: '2026-10-16',
    official_link: 'https://careers.jazzworld.com.pk/',
    apply_link: 'https://careers.jazzworld.com.pk/',
    is_verified: 1,
    featured: 1,
    logo_initial: 'Jazz',
    featured_image: '/images/jazz-ai-associate-programme-careers-2026.webp',
    image_alt: 'Jazz Careers 2026 AI Associate Programme and Digital Early Careers Guide CareerDost',
    excerpt: 'Jazz introduces its future-focused JazzWorld AI Associate Programme and early-career digital specialist intakes for 2026 across Karachi, Islamabad, and Lahore. Open for fresh graduates in Data Science, Artificial Intelligence, Computer Science, and Software Engineering. Explore eligibility benchmarks, tech stack requirements, and how to apply.',
    seo_title: 'Jazz Careers 2026: AI Associate Programme & Digital Jobs',
    meta_description: 'Apply for Jazz Careers 2026: JazzWorld AI Associate Programme & digital specialist roles in Karachi, Islamabad, Lahore. Check AI/Data Science criteria and apply online.',
    focus_keyword: 'Jazz Careers 2026',
    canonical_url: 'https://careerdost.blog/jobs/jazz-careers-ai-associate-programme-2026',
    og_title: 'Jazz Careers 2026: AI Associate Programme & Digital Early Careers Guide',
    og_description: 'Official application guide for Jazz Pakistan: 1-Year AI Associate Programme and digital careers in Karachi, Islamabad, and Lahore for fresh AI/CS graduates.',
    facebook_caption: `Pakistan ke sab se bade digital operator Jazz (VEON) mein AI aur Data Science careers! 🤖📱
Jazz ne future-ready talent ke liye 'JazzWorld AI Associate Programme' (1 Year intensive track) aur early-career digital roles ki applications open rakhi hain.
Tech Stacks: Python, Machine Learning, Data Analytics, Natural Language Processing (NLP) aur Cloud AI.
Locations: Karachi, Islamabad, Lahore aur Hybrid work options.
Taleem: BS / MS in Data Science, Artificial Intelligence, Computer Science ya Software Engineering.
Official JazzWorld Careers portal se online apply ka tareeqa:
https://careerdost.blog/jobs/jazz-careers-ai-associate-programme-2026
#JazzCareers #AIAssociate #DataScience #KarachiTech #TelecomJobs #CareerDost`,
    sindhi_facebook_caption: `جاز (Jazz) ۾ آرٽيفيشل انٽيليجنس (AI) ايسوسيئيٽ پروگرام 2026 جا نوان موقعا! 🤖📱
پاڪستان جي معروف ڊجيٽل آپريٽر جاز (VEON گروپ) پاران 1 سالا ’جاز ورلڊ اي آءِ ايسوسيئيٽ پروگرام‘ (AI Associate) ۽ ڊجيٽل اسپيشلسٽ اسامن لاءِ ڀرتيون شروع ڪيون ويون آهن.
ٽيڪنالوجيز: ڊيٽا سائنس، مشين لرننگ، پائٿون (Python)، اين ايل پي (NLP) ۽ ڪلائوڊ اينالائيٽڪس.
لوڪيشنز: ڪراچي، اسلام آباد، لاهور ۽ هائبرڊ سسٽم.
اهليت: ڊيٽا سائنس، اي آءِ، ڪمپيوٽر سائنس يا سافٽ ويئر انجنيئرنگ ۾ تازو گريجوئيٽ ٿيل نوجوان.
جاز ورلڊ سرڪاري ڪيريئر پورٽل تان اپلائي ڪرڻ جو طريقو:
https://careerdost.blog/jobs/jazz-careers-ai-associate-programme-2026
#JazzCareers #AIAssociate #DataScience #KarachiTech #TelecomJobs #CareerDost`,
    whatsapp_caption: `🤖 Jazz Careers 2026: JazzWorld AI Associate Programme & Digital Roles!
Locations: Karachi, Islamabad, Lahore & Hybrid Work Flexibility
Role: 1-Year Specialized Future-Skills AI Associate Track
Eligibility: Fresh BS/MS in Data Science, Artificial Intelligence, CS, Software Engineering
Apply Online via JazzWorld: https://careerdost.blog/jobs/jazz-careers-ai-associate-programme-2026`,
    content: [
      "# Jazz Careers 2026: AI Associate Programme, Digital Internships & Application Guide",
      "## Executive Summary & Digital Transformation Leadership\n\n**Jazz (VEON Group)**, Pakistan's foremost digital communications operator serving over 70 million subscribers alongside digital financial and streaming ecosystems (including JazzCash, Tamasha, and Garaj Cloud), actively recruits emerging digital innovators through its specialized early-career initiatives. Prominent among these is the **JazzWorld AI Associate Programme**, a dedicated **1-year future-skills accelerator** engineered to cultivate next-generation Artificial Intelligence engineers, data scientists, and digital product specialists across its operational headquarters in **Karachi, Islamabad, and Lahore**.",
      "> [!IMPORTANT]\n> **Recruitment Highlights at a Glance (Verified October 2026):**\n> - **Hiring Enterprise:** Jazz (VEON Telecom & Digital Ecosystems).\n> - **Featured Initiative:** JazzWorld AI Associate Programme & Early-Career Digital Ingestion.\n> - **Duration:** 1-Year Accelerated Structured Programme (with performance-linked permanent cadre absorption).\n> - **Primary Hubs:** Karachi, Islamabad, and Lahore (featuring flexible hybrid work arrangements).\n> - **Target Disciplines:** Data Science, Artificial Intelligence, Computer Science, Software Engineering, and Business Analytics.\n> - **Experience Tier:** Fresh Graduates (0 to 1 Year Experience) or Master's graduates.\n> - **Official Application Gateway:** [careers.jazzworld.com.pk](https://careers.jazzworld.com.pk/).",
      "## Quick Facts & Programme Specifications\n\n| RECRUITMENT PARAMETER | VERIFIED OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Company** | Jazz (VEON Group Pakistan) |\n| **Program Name** | JazzWorld AI Associate Programme & Early Careers |\n| **Employment Model** | Full-Time (1-Year Specialized Fast-Track with Permanent Potential) |\n| **Location** | Karachi, Islamabad, Lahore & Hybrid Options |\n| **Minimum Education** | 16 Years (BS / BE / MS in Data Science, AI, CS, SE) |\n| **Minimum CGPA** | Minimum 3.0 out of 4.0 (or Equivalent Academic Merit) |\n| **Core Skillsets** | Python, Machine Learning, Deep Learning, SQL, Cloud Analytics |\n| **Compensation Package** | Market-Competitive Salary, Health Insurance, Monthly Mobile Allowance |\n| **Application Deadline** | Continuous Rolling Intake (Check Specific Requisitions on JazzWorld) |\n| **Official Portal Link** | [careers.jazzworld.com.pk](https://careers.jazzworld.com.pk/) |",
      "## Deep Dive into the AI Associate Tech Stack\n\nParticipants in the JazzWorld AI Associate Programme are embedded directly inside high-impact digital and fintech product squads, gaining real-world exposure to:\n\n1. **Telecom Big Data & Machine Learning:** Developing predictive subscriber analytics, network traffic forecasting models, and customer churn reduction algorithms using enterprise data lakes.\n2. **Generative AI & Natural Language Processing (NLP):** Enhancing conversational AI assistants for customer support in English and Roman Urdu, automated speech recognition, and smart intent detection for digital service platforms.\n3. **FinTech Analytics for JazzCash:** Constructing automated credit scoring algorithms, alternative data underwriting models for nano-loans, and fraud-detection neural networks.\n4. **Cloud Infrastructure & MLOps:** Deploying machine learning models to production using Docker, Kubernetes, CI/CD pipelines, and cloud computing architectures.",
      "## Detailed Eligibility: Who Should Apply\n\nCandidates must satisfy the following baseline qualifications:\n\n- **Academic Degree:** Bachelor's or Master's degree in **Data Science, Artificial Intelligence, Computer Science, Software Engineering, Mathematics, or Computational Statistics** from an HEC-recognized university.\n- **Academic Record:** Minimum CGPA of **3.0 out of 4.0** (or equivalent percentage).\n- **Technical Foundations:** Demonstrated proficiency in Python, common data science libraries (Pandas, NumPy, Scikit-Learn, TensorFlow, or PyTorch), relational database querying (SQL), and algorithmic problem solving.\n- **Portfolio / Projects:** Academic final-year project (FYP), Kaggle competition ranking, or GitHub repository demonstrating practical data modeling or AI applications.\n- **Fresh Graduate Status:** Fresh graduates who completed their degree in 2025 or 2026 are prioritized.",
      "## Step-by-Step Application Guide via JazzWorld Careers\n\nFollow these verified steps to submit your candidacy to Jazz:\n\n1. **Open the Careers Portal:** Navigate to [careers.jazzworld.com.pk](https://careers.jazzworld.com.pk/).\n2. **Search Relevant Roles:** Filter by department (*Digital, Technology, Data & Analytics*) or search *AI Associate* / *Specialist*.\n3. **Review Role Description:** Read the specific job requisition details, required tech stack, and location requirements.\n4. **Create Profile & Upload CV:** Complete your candidate profile with your contact details, education, and attach an updated PDF resume highlighting your AI/ML projects.\n5. **Complete Online Assessment:** Selected applicants will receive an invitation to an online technical evaluation covering Python coding, statistical analysis, and machine learning fundamentals.\n6. **Panel & Cultural Interviews:** Successful test candidates attend a technical interview with Jazz data science leads, followed by an HR culture-fit discussion.",
      "## Frequently Asked Questions (FAQ)\n\n**Q1: What is the JazzWorld AI Associate Programme?**\nIt is a specialized 1-year future-skills development initiative launched by Jazz to mentor and fast-track fresh graduates in Artificial Intelligence, Data Science, and Machine Learning.\n\n**Q2: Are there openings in Karachi?**\nYes. While Jazz maintains its corporate headquarters in Islamabad, significant commercial, digital, and technology operations are staffed at the Jazz regional offices in Karachi.\n\n**Q3: Can candidates with a general Computer Science degree apply?**\nYes. Graduates in Computer Science or Software Engineering who possess strong personal project experience or coursework in Python and Machine Learning are fully eligible.\n\n**Q4: Is the AI Associate position paid?**\nYes. The AI Associate Programme is a fully compensated, highly competitive corporate position offering monthly market-based pay, healthcare insurance, and corporate telecom allowances.\n\n**Q5: Does Jazz charge any fee to apply?**\nNo. Jazz never charges any application, registration, or processing fee. Never pay money to anyone claiming to offer job guarantees at Jazz.",
      "## Source Attribution & Related CareerDost Resources\n\n- **Official Hiring Authority:** [JazzWorld Careers Official Portal](https://careers.jazzworld.com.pk/).\n- **Related Tech & Banking Careers:** [Systems Limited Associate Software Engineer Jobs 2026](https://careerdost.blog/jobs/systems-limited-associate-software-engineer-jobs-2026), [10Pearls SHINE Virtual Internship 2026](https://careerdost.blog/jobs/10pearls-shine-virtual-internship-2026), and [MCB Bank Information Security Trainee 2026](https://careerdost.blog/jobs/mcb-bank-infosec-trainee-jobs-2026)."
    ]
  }
}

export function saveOct16Packages() {
  console.log('=== SAVING 5 VERIFIED JOBS/INTERNSHIPS PACKAGES TO SQLITE ===\n')

  const stmtArt = db.prepare(`
    INSERT INTO articles (
      slug, title, category_slug, organization, job_type, location,
      qualification, salary, last_date, publish_date, official_link,
      featured, logo_initial, excerpt, content, seo_title, meta_description,
      status, featured_image, image_alt, experience, positions, apply_link,
      is_verified, focus_keyword, canonical_url, og_title, og_description, no_deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title, category_slug=excluded.category_slug, organization=excluded.organization,
      job_type=excluded.job_type, location=excluded.location, qualification=excluded.qualification,
      salary=excluded.salary, last_date=excluded.last_date, publish_date=excluded.publish_date,
      official_link=excluded.official_link, featured=excluded.featured, logo_initial=excluded.logo_initial,
      excerpt=excluded.excerpt, content=excluded.content, seo_title=excluded.seo_title,
      meta_description=excluded.meta_description, status=excluded.status, featured_image=excluded.featured_image,
      image_alt=excluded.image_alt, experience=excluded.experience, positions=excluded.positions,
      apply_link=excluded.apply_link, is_verified=excluded.is_verified, focus_keyword=excluded.focus_keyword,
      canonical_url=excluded.canonical_url, og_title=excluded.og_title, og_description=excluded.og_description,
      no_deadline=excluded.no_deadline
  `)

  const stmtDaily = db.prepare(`
    INSERT INTO daily_updates (
      slug, title, category, short_description, content, featured_image, image_alt,
      official_link, apply_link, deadline, publish_date, organization,
      location, qualification, experience, positions, job_type, salary,
      is_verified, featured, seo_title, meta_description, focus_keyword,
      canonical_url, og_title, og_description, status, no_deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title, category=excluded.category, short_description=excluded.short_description,
      content=excluded.content, featured_image=excluded.featured_image, image_alt=excluded.image_alt,
      official_link=excluded.official_link, apply_link=excluded.apply_link, deadline=excluded.deadline,
      publish_date=excluded.publish_date, organization=excluded.organization, location=excluded.location,
      qualification=excluded.qualification, experience=excluded.experience, positions=excluded.positions,
      job_type=excluded.job_type, salary=excluded.salary, is_verified=excluded.is_verified,
      featured=excluded.featured, seo_title=excluded.seo_title, meta_description=excluded.meta_description,
      focus_keyword=excluded.focus_keyword, canonical_url=excluded.canonical_url, og_title=excluded.og_title,
      og_description=excluded.og_description, status=excluded.status, no_deadline=excluded.no_deadline
  `)

  for (const [key, p] of Object.entries(oct16JobsPackages)) {
    stmtArt.run(
      p.slug, p.title, p.category_slug, p.organization, p.job_type, p.location,
      p.qualification, p.salary, p.last_date, p.publish_date, p.official_link,
      p.featured ? 1 : 0, p.logo_initial, p.excerpt, JSON.stringify(p.content),
      p.seo_title, p.meta_description, 'published', p.featured_image, p.image_alt,
      p.experience, p.positions, p.apply_link, p.is_verified ? 1 : 0,
      p.focus_keyword, p.canonical_url, p.og_title, p.og_description, p.no_deadline
    )

    try {
      stmtDaily.run(
        p.slug, p.title, p.category, p.excerpt, JSON.stringify(p.content),
        p.featured_image, p.image_alt, p.official_link, p.apply_link, p.last_date,
        p.publish_date, p.organization, p.location, p.qualification, p.experience,
        p.positions, p.job_type, p.salary, p.is_verified ? 1 : 0, p.featured ? 1 : 0,
        p.seo_title, p.meta_description, p.focus_keyword, p.canonical_url,
        p.og_title, p.og_description, 'published', p.no_deadline
      )
    } catch (e) {
      console.log(`   daily_updates ${key} note:`, e.message)
    }

    console.log(`✓ Saved to SQLite: ${p.slug} (${p.title})`)
  }

  console.log('\nAll 5 packages saved to SQLite careerdost.sqlite successfully.')
}

if (process.argv[1] && process.argv[1].includes('save_oct16_jobs_packages.js')) {
  saveOct16Packages()
}
