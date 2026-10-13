import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

export const oct11Articles = [
  {
    slug: 'spsc-jobs-2026-54-vacancies',
    title: 'SPSC Jobs 2026 – 54 Government Vacancies, Apply Before 23 October',
    category: 'government-jobs',
    organization: 'Sindh Public Service Commission (SPSC)',
    jobType: 'Provincial Government Recruitment (Consolidated Advertisement No. 05/2026)',
    location: 'Hyderabad & Sindh Provincial Postings',
    qualification: 'Bachelor in IT/CS (16-Yr) | MBBS with PMDC | Master in Mass Comm | Master in PA/HRM/Econ | Graduate in Law/General',
    salary: 'BPS-16 to BPS-18 Pay Scales with Provincial Allowances',
    experience: 'Fresh to 5 Years Relevant Experience (Post-Specific)',
    positions: '54 Government Vacancies across 8 Categories',
    lastDate: '2026-10-23',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://spsc.gov.pk/advertisement/2026/adv-05-2026.pdf',
    applyLink: 'https://spsc.gov.pk/candidate_portal/',
    isVerified: true,
    featured: true,
    logoInitial: 'SPSC',
    featuredImage: '/images/spsc-jobs-2026-54-vacancies.jpg',
    imageAlt: 'SPSC Jobs 2026 54 Government Vacancies Sindh Public Service Commission Advertisement 05 2026 CareerDost',
    excerpt: 'Sindh Public Service Commission (SPSC) announces Consolidated Advertisement No. 05/2026 with 54 gazetted vacancies in BPS-16, BPS-17, and BPS-18 across Sindh departments. Apply online before 23 October 2026.',
    seoTitle: 'SPSC Jobs 2026 – 54 Government Vacancies, Apply Before 23 October | CareerDost',
    metaDescription: 'Sindh Public Service Commission (SPSC) Adv 05/2026: 54 vacancies for Medical Officers, IT Directors, Assistants, and Law officers. Check qualifications, quota, and online apply process.',
    focusKeyword: 'SPSC Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/spsc-jobs-2026-54-vacancies',
    ogTitle: 'SPSC Jobs 2026 – 54 Government Vacancies, Apply Before 23 October',
    ogDescription: 'Official SPSC Advertisement 05/2026 released with 54 posts in BPS-16 to BPS-18. Check post-wise quota, age relaxation, and online PSID fee submission.',
    schemaType: 'JobPosting',
    content: [
      "### Official Recruitment Notice: SPSC Advertisement No. 05/2026",
      "The **Sindh Public Service Commission (SPSC)**, Thandi Sarak, Hyderabad, has officially issued its **Consolidated Advertisement No. 05/2026 (Dated: 25.09.2026)** inviting online applications for **54 permanent government vacancies** across various provincial departments.",
      "The positions range from **Basic Pay Scale 16 (BPS-16)** to **Basic Pay Scale 18 (BPS-18)** and cover the Enquiries & Anti-Corruption Establishment, Home Department, Information Department, Planning & Development Department, and Law, Parliamentary Affairs & Criminal Prosecution Department.",
      "Eligible male, female, and minority candidates holding Sindh domicile (Rural and Urban quotas) can apply exclusively online through the SPSC portal before the closing deadline of **23 October 2026 at 5:00 PM**.",
      "> [!IMPORTANT]\n> **Manual Applications Barred:** As stated in the official circular, manual hardcopy applications will **NOT** be entertained under any circumstances. All applicants must submit their application electronically via the official SPSC candidate portal (`spsc.gov.pk/candidate_portal/`).",
      "### Quick Overview Summary Table",
      "- **Recruiting Body:** Sindh Public Service Commission (SPSC), Hyderabad\n- **Advertisement Number:** Consolidated Advertisement No. 05/2026\n- **Issue Date:** 25 September 2026\n- **Application Deadline:** **23 October 2026 (Strictly by 5:00 PM)**\n- **Total Vacancies:** **54 Positions**\n- **Job Categories:** 8 Distinct Posts (BPS-16 to BPS-18)\n- **Application Fee:** **Rs. 500 per post** (Payable via PSID 1Bill)\n- **Eligible Domicile:** Sindh (Rural & Urban Quotas as specified)\n- **Official Notification PDF:** [spsc.gov.pk Adv 05/2026](https://spsc.gov.pk/advertisement/2026/adv-05-2026.pdf)\n- **Online Registration Portal:** [spsc.gov.pk/candidate_portal](https://spsc.gov.pk/candidate_portal/)",
      "### Detailed Vacancy Breakdown & Quota Comparison Table",
      "The 54 advertised vacancies are distributed across departments and quota categories as follows:\n\n| Sr | Department | Post Name with Scale | Total Posts | Rural | Urban | Age Limit | Minimum Qualification & Experience |\n| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |\n| 1 | Enquiries & Anti-Corruption Establishment | **Deputy Director (I.T) / Senior Manager I.T (BPS-18)** | 01 | 01 | 00 | 28–35 | 16-Year Bachelor in IT or CS (2nd Div/equivalent CGPA) from HEC recognized university + 5 years relevant experience in IT project implementation and management. |\n| 2 | Enquiries & Anti-Corruption Establishment | **Assistant Director (I.T) / System Analyst (BPS-17)** | 01 | 01 | 00 | 21–28 | 16-Year Bachelor in IT or CS (2nd Div/equivalent CGPA) from HEC recognized university. |\n| 3 | Home Department | **Medical Officer (Male) (BPS-17)** | 32 | 19 | 13 | 21–28 | MBBS from HEC recognized university, PM&DC registration, and completion of 1-year house job. (Rural: 17 Open, 1 Disabled, 1 Minority; Urban: 11 Open, 1 Disabled, 1 Minority). |\n| 4 | Home Department | **Lady Medical Officer (BPS-17)** | 04 | 02 | 02 | 21–28 | MBBS from HEC recognized university, PM&DC registration, and completion of 1-year house job. (All Open Merit). |\n| 5 | Information Department | **Information Officer (BPS-17)** | 04 | 02 | 02 | 18–30 | Master's in Mass Communication / Journalism from HEC recognized university + 3 to 5 years relevant experience. (Rural: 1 Open, 1 Female Minority; Urban: 1 Open, 1 Male Differently Abled). |\n| 6 | Planning & Development Department | **Assistant Director (BPS-17)** | 01 | 00 | 01 | 21–28 | Master's / 16-Year Degree in Public Administration / Human Resource Management / M.A Economics / Public Policy (2nd Div/equivalent CGPA). (Urban Open Merit). |\n| 7 | Planning & Development Department | **Programme Officer (BPS-17)** | 01 | 00 | 01 | 21–28 | 16-Year Graduation in Computer Science / IT / Software Engineering (2nd Div/equivalent CGPA). (Urban Open Merit). |\n| 8 | Law, Parliamentary Affairs & Criminal Prosecution | **Assistant (BPS-16)** | 10 | 06 | 04 | 21–31 | Graduate at least in 2nd Division from HEC recognized university. (Rural: 5 Open, 1 Female; Urban: 3 Open, 1 Female). |",
      "### Age Relaxation Guidelines",
      "> [!NOTE]\n> General upper age relaxation is admissible in accordance with Government of Sindh Notification **NO.SOII (SGA&CD) 5-64/2011(Part-II) Dated 06.03.2025** across provincial posts, providing qualified candidates appropriate relief as per Sindh civil servant rules.",
      "### Online Application Procedure & PSID Fee Generation",
      "1. **Access the Official Portal:** Navigate to [spsc.gov.pk](https://spsc.gov.pk/) and enter the Candidate Portal at `https://spsc.gov.pk/candidate_portal/`.\n2. **Account Registration:** Register using your Computerized National Identity Card (CNIC) number and valid mobile/email contacts.\n3. **Profile Setup:** Fill in your personal bio-data, academic qualifications, PRC Form-D, and district domicile.\n4. **Select Advertised Job:** Click on **Available Jobs** and choose your desired position under Advertisement No. 05/2026.\n5. **Generate PSID:** Generate your individual **1Bill / PSID** invoice for the application fee of **Rs. 500/-** per post.\n6. **Deposit Challan Fee:** Pay electronically through 1Bill using any Mobile Banking app (Easypaisa, JazzCash, 1Link banking apps, ATM, or over-the-counter).\n7. **Final Submit:** Complete verification and submit your form before the portal locks at **5:00 PM on 23 October 2026**.",
      "### Mandatory Documents for Candidate Verification",
      "Candidates qualifying the written test will be called for interview and document scrutiny, where they must present:\n- Original CNIC / NADRA Smart Card\n- Original Domicile Certificate & PRC on Form-D\n- Degree certificates and marks sheets (Matriculation to Terminal Degree)\n- PM&DC Registration Certificate (for Medical Officers)\n- Valid Experience Certificates where required by the service rules\n- Departmental NOC for existing government employees",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for SPSC Advertisement 05/2026?**\nThe closing deadline is **23 October 2026 at 5:00 PM (Office Hours)**.\n\n**Q2: What is the application fee per post in SPSC?**\nThe application fee is **Rs. 500 per post**, payable online through 1Bill invoice/PSID.\n\n**Q3: Can candidates with non-Sindh domicile apply?**\nNo. All posts under SPSC Adv 05/2026 require a valid Sindh Domicile and PRC (Form-D) under either Rural or Urban quotas.\n\n**Q4: Can one candidate apply for multiple positions?**\nYes. Candidates eligible for more than one post may submit separate online applications with separate PSID payments.\n\n**Q5: Is house job mandatory for Medical Officer (BPS-17) posts?**\nYes. Medical Officer and Lady Medical Officer posts strictly require completion of a one-year regular house job alongside valid PM&DC registration."
    ]
  },
  {
    slug: 'spsc-departmental-exam-slips-2026',
    title: 'SPSC Departmental Exam Slips 2026 Available – Examinations Start 12 October',
    category: 'results',
    organization: 'Sindh Public Service Commission (SPSC)',
    jobType: 'Provincial Departmental Examinations 2026 Admission Slips & Center Guidelines',
    location: 'Hyderabad & Karachi Centers, Sindh',
    qualification: 'Registered In-Service Provincial Officers & Cadre Candidates',
    salary: 'Departmental Promotion & Service Qualifying Examination',
    experience: 'Eligible In-Service Government Officials in Sindh',
    positions: 'Online Admission Slips for Departmental Examinations Commencing 12 October 2026',
    lastDate: '2026-10-12',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://spsc.gov.pk/recent-announcements/Oct2026/PR_Departmentalonlineadmissionslip.jpg',
    applyLink: 'https://spsc.gov.pk/candidate_portal/dde/slips',
    isVerified: true,
    featured: true,
    logoInitial: 'SPSC',
    featuredImage: '/images/spsc-departmental-exam-slips-2026.jpg',
    imageAlt: 'SPSC Departmental Exam Slips 2026 Download Admission Slip Sindh Public Service Commission CareerDost',
    excerpt: 'SPSC releases official online Admission Slips for Departmental Examinations starting Monday, 12 October 2026. Review digital reference tablet rules, center protocols, and access your slip on spsc.gov.pk.',
    seoTitle: 'SPSC Departmental Exam Slips 2026 Available – Examinations Start 12 October | CareerDost',
    metaDescription: 'Download SPSC Departmental Exam Slips 2026. Exams commence 12 October. Read mandatory digital reference tablet rules, answer book guidelines, and portal link.',
    focusKeyword: 'SPSC Departmental Exam Slips 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/spsc-departmental-exam-slips-2026',
    ogTitle: 'SPSC Departmental Exam Slips 2026 Available – Examinations Start 12 October',
    ogDescription: 'Sindh Public Service Commission issues official press release NO. PSC/EXAM-II/2026/93. Departmental examination admission slips online with electronic tablet guidelines.',
    schemaType: 'Article',
    content: [
      "### Official Notification: SPSC Departmental Examination Slips Released",
      "The **Sindh Public Service Commission (SPSC)** has issued official **Press Release No. PSC/EXAM-II/2026/93 (Dated: 09-10-2026)** informing all concerned departmental officers and candidates that **Admission Slips for Departmental Examinations commencing from 12th October 2026** are now available for online download.",
      "The examinations commence on **Monday, 12 October 2026**, across designated examination halls in Sindh. All appearing officers must print their admission slips and carry them to the exam venue.",
      "### Privacy & Candidate Protection Notice",
      "> [!NOTE]\n> **Candidate Privacy Commitment:** In strict compliance with digital privacy standards, **CareerDost does NOT collect, store, or process candidates' CNIC numbers.**\n>\n> To retrieve your official admission slip safely, visit the authorized SPSC portal directly: `https://spsc.gov.pk/candidate_portal/dde/slips`.",
      "### Quick Summary Table",
      "- **Issuing Authority:** Sindh Public Service Commission (SPSC), Hyderabad\n- **Press Release Reference:** No. PSC/EXAM-II/2026/93\n- **Press Release Date:** 9 October 2026\n- **Examinations Commencement:** **Monday, 12 October 2026**\n- **Admission Slip Status:** **Live and Available Online**\n- **Official Slip Portal:** [spsc.gov.pk/candidate_portal/dde/slips](https://spsc.gov.pk/candidate_portal/dde/slips)\n- **Official Press Release Image:** [spsc.gov.pk PR Image](https://spsc.gov.pk/recent-announcements/Oct2026/PR_Departmentalonlineadmissionslip.jpg)",
      "### Revolutionary Exam Hall Guidelines: Electronic Tablets for Reference Books",
      "In a major technological advancement for provincial examinations, the SPSC examination branch has implemented new paper rules:\n\n1. **No Physical Books Permitted:** No physical printed books or law manuals will be allowed inside the examination hall, nor will SPSC provide any printed books.\n2. **Digital Reference Facility on SPSC Electronic Tablets:** All prescribed reference books will be provided in digital format on **electronic tablets supplied by SPSC**.\n3. **Interactive Search & Navigation:** Candidates can select the relevant Paper and Book on the tablet, navigate forward/backward through pages, and utilize **advanced keyword search** to locate rules, legal sections, and statutory material rapidly.\n4. **No Supplementary Answer Sheets:** The Commission has explicitly notified that **no additional or supplementary answer sheets will be provided** under any circumstances. Candidates must organize their handwriting and time within the sufficient pages provided in the original Answer Copy.",
      "### Mandatory Center Instructions",
      "> [!WARNING]\n> - **Mandatory Slip:** No candidate shall be allowed to sit in the examination hall without presenting a clear printed copy of their official Admission Slip.\n> - **Original CNIC:** Candidates must also present their original NADRA CNIC alongside the admission slip.\n> - **Strict Ban on Personal Gadgets:** Personal smartphones, smartwatches, recording devices, or personal tablets are strictly banned in the exam center.",
      "### Step-by-Step Guide to Download SPSC Admission Slips",
      "1. Open the official SPSC portal: [spsc.gov.pk/candidate_portal/dde/slips](https://spsc.gov.pk/candidate_portal/dde/slips).\n2. Enter your valid 13-digit Computerized National Identity Card (CNIC) number without hyphens.\n3. Select your designated departmental examination category from the dropdown.\n4. Click **Search / Download Admission Slip**.\n5. Print your admission slip on clean A4 white paper and verify your center location and roll number.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: When do the SPSC Departmental Examinations 2026 begin?**\nThe examinations commence on **Monday, 12 October 2026**.\n\n**Q2: Can candidates bring their own law books or bare acts to the hall?**\nNo. SPSC has strictly prohibited physical books. Prescribed reference books will be accessible via SPSC-provided digital tablets.\n\n**Q3: Will supplementary answer copies be provided if pages run out?**\nNo. SPSC has confirmed that no supplementary sheets will be issued, and candidates must utilize the available answer book pages carefully.\n\n**Q4: Where can I download my departmental admission slip?**\nAdmission slips can be downloaded directly from the official portal at `https://spsc.gov.pk/candidate_portal/dde/slips`."
    ]
  },
  {
    slug: 'sindh-courts-bps-1-4-jobs-2026',
    title: 'Sindh Courts Jobs 2026 – BPS 1 to 4 Vacancy Notice & Walk-in Interview Schedule',
    category: 'government-jobs',
    organization: 'Criminal Prosecution Services Department, Government of Sindh',
    jobType: 'Regular Class-IV Government Vacancies (Circular No. 000000221 / INF-KRY 4363-26)',
    location: 'High Court of Sindh, Karachi (Head Office) & All 28 Districts of Sindh',
    qualification: 'Literate / Primary Pass (Valid Motorcycle / Car / LTV License for Drivers & Dispatch Riders)',
    salary: 'BPS-01 to BPS-04 Pay Scales + Sindh Government Allowances',
    experience: 'Fresh to 2 Years Driving / Office Experience (Post-Specific)',
    positions: '232 Head Office Posts + District Public Prosecutor Posts across 28 Districts',
    lastDate: '2026-10-31',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://www.sindh.gov.pk/storage/jobs/G4Icmpe10ofBomVMkntpOEisisUvCt2Tl9Uo8mK0.pdf',
    applyLink: 'https://www.iwork4sindh.com',
    isVerified: true,
    featured: true,
    logoInitial: 'CPSD',
    featuredImage: '/images/sindh-courts-bps-1-4-jobs-2026.jpg',
    imageAlt: 'Sindh Courts Jobs 2026 BPS 1 to 4 Vacancies Criminal Prosecution Services Department High Court Karachi CareerDost',
    excerpt: 'Criminal Prosecution Services Department Sindh announces BPS 1–4 vacancies (Circular 000000221) for 232 Head Office posts at High Court Karachi plus 28 District Courts. Walk-in interviews 19–31 October 2026.',
    seoTitle: 'Sindh Courts Jobs 2026 – BPS 1 to 4 Vacancy Notice & Walk-in Schedule | CareerDost',
    metaDescription: 'Sindh Courts Jobs 2026: 232 Head Office posts at High Court Karachi plus 28 District Courts under Criminal Prosecution Services Dept. Complete walk-in interview schedule.',
    focusKeyword: 'Sindh Courts Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/sindh-courts-bps-1-4-jobs-2026',
    ogTitle: 'Sindh Courts Jobs 2026 – BPS 1 to 4 Vacancy Notice & Walk-in Schedule',
    ogDescription: 'Official Circular No. 000000221 / INF-KRY 4363-26. Walk-in interviews from 19 to 31 October 2026 for Naib Qasid, Daftari, Driver, Dispatch Rider, and Chowkidar.',
    schemaType: 'JobPosting',
    content: [
      "### Official Recruitment Circular: Criminal Prosecution Services Department, Sindh",
      "The **Criminal Prosecution Services Department, Government of Sindh**, through the **Office of the Prosecutor General Sindh** (located at 4th Floor, Administration Block, High Court of Sindh, Karachi), has officially published **Circular No. 000000221 (Advertisement INF-KRY No. 4363-26)** announcing walk-in interviews for regular **BPS-01 to BPS-04 vacancies**.",
      "The recruitment drive covers **232 posts at the Head Office in Karachi** and hundreds of Class-IV positions across **all 28 District Public Prosecutor Offices** throughout Sindh.",
      "### Quick Summary Table",
      "- **Recruiting Department:** Criminal Prosecution Services Department, Government of Sindh\n- **Headquarters Venue:** 4th Floor, Administration Block, High Court of Sindh, Karachi\n- **Circular Reference:** Circular No. 000000221 / INF-KRY 4363-26\n- **Notification Date:** 6 October 2026\n- **Walk-in Interview Window:** **19 October 2026 to 31 October 2026 (District-wise dates)**\n- **Age Bracket:** **18 to 30 Years** (General upper age relaxation admissible per Govt Policy)\n- **Provincial Quotas:** Rural 60% & Urban 40% (Head Office); District Domicile/PRC for District Offices\n- **Special Quotas:** 5% Minorities, 5% Women, 5% Persons with Disabilities\n- **Official Circular PDF:** [sindh.gov.pk Circular 221](https://www.sindh.gov.pk/storage/jobs/G4Icmpe10ofBomVMkntpOEisisUvCt2Tl9Uo8mK0.pdf)\n- **Official Sindh Job Portal:** [iwork4sindh.com](https://www.iwork4sindh.com)",
      "### Vacant Posts & Prescribed Qualifications",
      "| Sr | Name of Post | Basic Scale | Minimum Qualification & Recruitment Method |\n| :---: | :--- | :---: | :--- |\n| 1 | **Dispatch Rider** | BPS-04 | At least Primary Pass & valid Driving License for Motor Cycle. |\n| 2 | **Driver** | BPS-04 | At least Primary Pass & valid Driving License of Car/LTV with at least two (02) years driving experience with capacity to maintain log book. |\n| 3 | **Daftari** | BPS-02 | Primary Pass will be preferred. |\n| 4 | **Chowkidar** | BPS-01 | Preferably literate. |\n| 5 | **Naib Qasid** | BPS-01 | Preferably literate. |\n| 6 | **Sanitary Worker** | BPS-01 | Experience in sanitary and cleaning work. |",
      "### Head Office Vacancy Distribution (High Court Karachi)",
      "For the Office of the Prosecutor General Sindh, Karachi (Head Office), the 232 vacancies are divided as:\n- **Naib Qasid (BPS-01):** 105 Posts\n- **Daftari (BPS-02):** 41 Posts\n- **Dispatch Rider (BPS-04):** 33 Posts\n- **Sanitary Worker (BPS-01):** 32 Posts\n- **Driver (BPS-04):** 19 Posts\n- **Chowkidar (BPS-01):** 02 Posts",
      "### Complete Verified Walk-in Interview Schedule",
      "> [!IMPORTANT]\n> **Schedule 1: Head Office Posts (Venue: Prosecutor General Sindh, 4th Floor, Administration Block, High Court of Sindh, Karachi)**\n>\n> - **Day-1 (Monday, 19 October 2026):** Candidates holding Domicile/PRC of District South, East, West, Central & Malir Karachi.\n> - **Day-2 (Tuesday, 20 October 2026):** District Sujawal, Thatta, Hyderabad, Jamshoro, Badin & Matiari.\n> - **Day-3 (Wednesday, 21 October 2026):** District Tando Muhammad Khan, Tando Allahyar, Mirpurkhas, Tharparkar (Mithi), Sanghar.\n> - **Day-4 (Thursday, 22 October 2026):** District Dadu, Umerkot, Sukkur, Ghotki, Naushahro Feroze & Khairpur.\n> - **Day-5 (Saturday, 24 October 2026):** District Shaheed Benazirabad, Larkana, Kamber-Shahdadkot, Jacobabad, Shikarpur & Kashmore.",
      "> [!IMPORTANT]\n> **Schedule 2: District Public Prosecutor Office Posts (Venue: Respective District Public Prosecutor Office)**\n>\n> - **Day-1 (Monday, 26 October 2026):** District Sujawal, Thatta, Hyderabad & Jamshoro.\n> - **Day-2 (Tuesday, 27 October 2026):** District Badin, Tando Muhammad Khan, Tando Allahyar & Mirpurkhas.\n> - **Day-3 (Wednesday, 28 October 2026):** District Tharparkar (Mithi), Dadu, Umerkot, Sukkur, Ghotki & Naushahro Feroze.\n> - **Day-4 (Thursday, 29 October 2026):** District Shaheed Benazirabad, Larkana, Kamber-Shahdadkot, Jacobabad, Shikarpur.\n> - **Day-5 (Saturday, 31 October 2026):** District Kashmore, Khairpur, Sanghar & Matiari.",
      "### How to Appear for the Walk-in Interview",
      "1. Prepare a written job application on plain paper stating the post applied for.\n2. Candidates applying for more than one post must submit a separate application for each post.\n3. Attach attested photocopies of:\n   - CNIC / Smart Card\n   - Domicile & PRC (Form-D)\n   - Educational certificates / Primary school leaving pass\n   - Valid Driving License (for Drivers & Dispatch Riders)\n   - Two recent passport-size photographs\n4. Bring original documents on the interview date corresponding to your district.\n5. Selected candidates will be notified via official telephone calls within 15 days following the interview.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: Where will the interviews for Head Office posts take place?**\nAt the Office of the Prosecutor General Sindh, 4th Floor, Administration Block, High Court of Sindh, Karachi.\n\n**Q2: What is the age limit for these BPS 1–4 positions?**\nThe basic age limit is **18 to 30 years**, with general upper age relaxation admissible under Sindh Government policy.\n\n**Q3: Can candidates from interior Sindh apply for the Head Office posts?**\nYes. Head Office posts maintain 60% rural and 40% urban Sindh quotas according to the assigned district dates.\n\n**Q4: Is there an application fee?**\nNo. Walk-in interviews for these BPS 1–4 positions carry no application or processing fee."
    ]
  },
  {
    slug: 'quest-nawabshah-phd-me-ms-admissions-2026',
    title: 'QUEST Nawabshah PhD, ME/MS Admissions 2026 – Apply Before 23 October',
    category: 'admissions',
    organization: 'Quaid-e-Awam University of Engineering, Science & Technology (QUEST)',
    jobType: 'Postgraduate Admissions (17th Batch PhD & 26th Batch ME/MS Phase-II)',
    location: 'Nawabshah, Shaheed Benazirabad, Sindh',
    qualification: '16-Year BE/BS (Min 2.00/4.00 CGPA) for ME/MS | 18-Year ME/MS (Min 3.00/4.00 CGPA) for PhD',
    salary: 'Online Entry Test Fee: Rs. 5,000/- (Payable at any HBL Branch via Challan)',
    experience: 'Eligible Postgraduate Aspirants & Final Year (22-Batch) BE/BS Students',
    positions: '17th Batch PhD (12 Disciplines) & 26th Batch ME/MS (22 Disciplines)',
    lastDate: '2026-10-23',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://www.quest.edu.pk/news/290/',
    applyLink: 'https://pgs.quest.edu.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'QUEST',
    featuredImage: '/images/quest-nawabshah-phd-me-ms-admissions-2026.jpg',
    imageAlt: 'QUEST Nawabshah PhD ME MS Admissions 2026 17th Batch PhD 26th Batch ME MS Phase II Quaid-e-Awam University CareerDost',
    excerpt: 'QUEST Nawabshah opens online admissions for 17th Batch PhD and 26th Batch ME/MS (Phase-II). 22-Batch final semester students eligible. Apply on pgs.quest.edu.pk by 23 October 2026.',
    seoTitle: 'QUEST Nawabshah PhD, ME/MS Admissions 2026 – Apply Before 23 October | CareerDost',
    metaDescription: 'Quaid-e-Awam University (QUEST Nawabshah) PhD & ME/MS admissions open. 17th Batch PhD & 26th Batch ME/MS Phase-II. Eligibility, Rs 5,000 fee, last date 23 October.',
    focusKeyword: 'QUEST Admissions 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/quest-nawabshah-phd-me-ms-admissions-2026',
    ogTitle: 'QUEST Nawabshah PhD, ME/MS Admissions 2026 – Apply Before 23 October',
    ogDescription: 'Official postgraduate admissions at QUEST Nawabshah for 17th PhD & 26th ME/MS batches. Apply online via pgs.quest.edu.pk before 23 October 2026.',
    schemaType: 'Article',
    content: [
      "### Official Admission Announcement: Postgraduate Admissions (Phase-II)",
      "**Quaid-e-Awam University of Engineering, Science & Technology (QUEST), Nawabshah**, has officially announced admissions for the **17th Batch of Doctor of Philosophy (PhD)** and **26th Batch of Master of Engineering (ME) / Master of Science (MS)** for the Phase-II cycle.",
      "Degree tracks are offered under both **Course Work Only** and **Course Work + Research Work (Mixed Mode)** across engineering, computing, mathematics, and linguistics faculties.",
      "Online registration opened on **03 October 2026** and will remain active until **23 October 2026**.",
      "> [!IMPORTANT]\n> **Final Year (22-Batch) Students Eligible:** Candidates currently appearing in their 2nd semester final year (22-Batch) BE/BS programs are explicitly declared eligible to apply for ME/MS programs by the Directorate of Postgraduate Studies.",
      "### Quick Summary Table",
      "- **University:** Quaid-e-Awam University of Engineering, Science & Technology (QUEST), Nawabshah\n- **Covered Batches:** 17th Batch PhD & 26th Batch ME/MS (Phase-II)\n- **Announcement Date:** 02 October 2026\n- **Online Portal Start Date:** 03 October 2026\n- **Application Deadline:** **23 October 2026**\n- **Entry Test Fee:** **Rs. 5,000/-** (Deposited at any Habib Bank Limited branch via generated challan)\n- **Official Admission Portal:** [pgs.quest.edu.pk](https://pgs.quest.edu.pk/)\n- **University Notice:** [quest.edu.pk/news/290](https://www.quest.edu.pk/news/290/)\n- **PGS Focal Contact:** Mr. Pir Riaz Ahmed, Assistant Director (PGS), Ph: 0332-4068888",
      "### Academic Disciplines Offered",
      "1. **PhD Programs (12 Disciplines):**\n   - Civil Engineering\n   - Mechanical Engineering\n   - Electrical Engineering\n   - Electronic Engineering\n   - Computer Systems Engineering\n   - Energy & Environment Engineering\n   - Environmental Engineering\n   - Telecommunication Engineering\n   - Information Technology\n   - Mathematics\n   - Software Engineering\n   - Computer Science\n\n2. **Master of Engineering (ME) Programs (16 Disciplines):**\n   - Civil Engineering, Construction Engineering & Management, Structural Engineering\n   - Power Engineering, Manufacturing Engineering, Industrial Engineering & Management\n   - Computer Systems Engineering, Computer Communication & Networks\n   - Energy & Environment Engineering, Environmental Engineering, Energy Systems Engineering\n   - Communication Engineering, Industrial Automation & Control\n   - Telecommunication Systems & Networks, Electronic Engineering, Software Engineering\n\n3. **Master of Science (MS) Programs (6 Disciplines):**\n   - Information Technology\n   - Software Engineering\n   - Computer Science\n   - Data Science\n   - Mathematics\n   - English Linguistics",
      "### Eligibility Criteria & Minimum Passing Marks",
      "- **For PhD Programs:** Minimum CGPA of **3.00/4.00** in relevant 18-year Master's degree from QUEST or HEC recognized university. Applicants must achieve at least **60% marks** in International GRE/HAT General or the university-administered computer-based test.\n- **For ME/MS Programs:** Minimum CGPA of **2.00/4.00** in relevant 16-year Bachelor's degree (BE/BS). Candidates must obtain at least **50% marks** in GRE/HAT General, NTS-GAT General, or the university computer-based entry test.\n- **Entry Test Schedule:** Computer-based entry test dates will be officially announced by the university following application scrutiny.",
      "### Step-by-Step Online Application Process",
      "1. Visit the official QUEST postgraduate portal: [pgs.quest.edu.pk](https://pgs.quest.edu.pk/).\n2. Register your user profile with your CNIC and email.\n3. Fill in your academic credentials, graduation records, and personal details.\n4. Download and print the **Rs. 5,000/- Entry Test Fee Challan**.\n5. Deposit the fee at any branch of Habib Bank Limited (HBL) across Pakistan.\n6. Upload scanned copies of your paid bank challan, recent photograph, and educational transcripts.\n7. Finalize and submit the application before **23 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for QUEST postgraduate admissions?**\nThe last date for online application submission is **23 October 2026**.\n\n**Q2: Can final year 22-batch BE/BS students apply?**\nYes. Candidates appearing in their final semester (22-Batch) BE/BS can apply for ME/MS programs.\n\n**Q3: What is the entry test fee and where is it paid?**\nThe test fee is **Rs. 5,000/-**, payable through computerized challan at any HBL branch.\n\n**Q4: Has the entry test date been announced?**\nNo. QUEST has officially stated that the computer-based test timetable will be announced after application screening."
    ]
  },
  {
    slug: 'quest-special-exams-timetable-2026',
    title: 'QUEST Special Exams 2026 – Timetable and Exam Centres Announced',
    category: 'results',
    organization: 'Quaid-e-Awam University of Engineering, Science & Technology (QUEST)',
    jobType: 'Special Supplementary Examination (1st Semester First Year Theory)',
    location: 'Nawabshah & Larkano Campuses, Sindh',
    qualification: 'Enrolled Undergraduates of 2020, 2021 & 2022 Batches (BE/BS/Tech)',
    salary: 'Official Notification Reference: No. QUEST/NH/EXAM/-856',
    experience: 'Eligible 20-, 21- & 22-Batches Registered Students',
    positions: 'Special Supplementary Theory Examination Schedule Starting 12 October 2026',
    lastDate: '2026-10-19',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://www.quest.edu.pk/news/291/',
    applyLink: 'https://www.quest.edu.pk/downloads/',
    isVerified: true,
    featured: true,
    logoInitial: 'QUEST',
    featuredImage: '/images/quest-special-exams-timetable-2026.jpg',
    imageAlt: 'QUEST Special Exams Timetable 2026 1st Semester 20 to 22 Batches Examination Centres Quaid-e-Awam University CareerDost',
    excerpt: 'QUEST Nawabshah releases official timetable and examination centres (Annexure A) for Special Supplementary Exams of 20 to 22 Batches starting Monday, 12 October 2026.',
    seoTitle: 'QUEST Special Exams 2026 – Timetable & Centres Announced | CareerDost',
    metaDescription: 'QUEST Nawabshah announces Special Supplementary Exam timetable & centres for 20, 21, and 22 batches. Exams commence 12 October 2026. Review full paper schedule.',
    focusKeyword: 'QUEST Special Exams 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/quest-special-exams-timetable-2026',
    ogTitle: 'QUEST Special Exams 2026 – Timetable and Exam Centres Announced',
    ogDescription: 'Official timetable for 1st Semester First Year Special Exams of 20–22 Batches at QUEST Nawabshah & Larkano Campus starting 12 October 2026.',
    schemaType: 'Article',
    content: [
      "### Official Notification: Special Supplementary Examination Schedule Released",
      "**Quaid-e-Awam University of Engineering, Science & Technology (QUEST), Nawabshah**, has officially notified the complete timetable and center distribution for the **Special Supplementary Examination of First Semester First Year (1st Semester) BE/BS/Tech for 20-, 21- & 22-Batches (Notification No. /QUEST/NH/EXAM/-856, Dated: 05.10.2026)**.",
      "The theory examinations will be conducted from **Monday, 12 October 2026, to Monday, 19 October 2026**, covering eligible students of the QUEST Main Campus (Nawabshah) and Larkano Campus (Old).",
      "### Quick Summary Table",
      "- **University:** Quaid-e-Awam University of Engineering, Science & Technology (QUEST), Nawabshah\n- **Notification Number:** No. /QUEST/NH/EXAM/-856\n- **Notification Date:** 05 October 2026 (Published: 07 October 2026)\n- **Examination Start Date:** **Monday, 12 October 2026**\n- **Examination End Date:** **Monday, 19 October 2026**\n- **Eligible Batches:** **20-, 21-, and 22-Batches (BE / BS / Technology)**\n- **Semester Covered:** **First Semester - First Year (Theory)**\n- **Campuses:** Nawabshah Main Campus & Larkano Campus (Old)\n- **Official Notice Link:** [quest.edu.pk/news/291](https://www.quest.edu.pk/news/291/)",
      "### Official Examination Centers (Annexure A)",
      "The Controller of Examinations has established designated departmental examination centres as follows:\n\n| Examination Centre | Assigned Departments |\n| :--- | :--- |\n| **Civil Centre** | Civil Engineering, Building & Architectural Engineering, Civil Engineering Technology |\n| **Mechanical Centre** | Mechanical Engineering, Industrial & Manufacturing Engineering, Mathematics |\n| **Electrical Centre** | Electrical Engineering, Electrical (Automation Control), Electronic & Bio-Medical Engineering |\n| **Computer Systems Centre** | Computer Systems Engineering, Software Engineering |\n| **Environment Centre** | Environment Engineering, Energy System, Chemical Engineering, Physics, Chemistry, Food |\n| **Telecommunication Centre** | Telecommunication Engineering, Cyber Security, Artificial Intelligence |\n| **English Centre** | English Department |\n| **Computer Science Centre** | Computer Science, Information Technology, Data Science |",
      "### Daily Paper Timetable Schedule",
      "Theory examinations will be held in the afternoon session:\n- **Monday, 12.10.2026 (01:00 PM – 04:00 PM):** Civil Engineering Materials, Applied Physics, Engineering Materials, Engineering Mechanics.\n- **Tuesday, 13.10.2026 (01:00 PM – 04:00 PM):** Functional English across engineering and computing disciplines.\n- **Wednesday, 14.10.2026 (01:00 PM – 04:00 PM):** Applied Calculus, Calculus & Analytical Geometry, Linear Algebra & Analytical Geometry, Basic Mathematics / Biology.\n- **Thursday, 15.10.2026 (01:00 PM – 04:00 PM):** Pakistan Studies, History of Building Technology, Introduction to Bio-Medical Engineering.\n- **Friday, 16.10.2026 (02:00 PM – 05:00 PM):** Islamic Studies / Ethics, Engineering Drawing, Engineering Statics, Electrical Engineering, Applied Mechanics, Computer Programming, Programming Fundamentals.\n- **Monday, 19.10.2026 (01:00 PM – 04:00 PM):** Engineering Mechanics, Introduction to Computing, Computing Fundamentals, Introduction to ICT, Introduction to Computers.",
      "### Mandatory Candidate Guidelines",
      "> [!IMPORTANT]\n> 1. **Early Arrival:** Candidates must reach their designated examination hall at least **15 minutes prior** to the scheduled paper time.\n> 2. **Mandatory Admit Slip:** Candidates will **NOT** be permitted to appear without their official Admit Slip.\n> 3. **Strict Ban on Electronics:** Bringing mobile phones, unauthorized written papers, or recording gadgets into the hall is strictly prohibited.\n> 4. **Ineligible Candidate Warning:** Any appearance by an ineligible candidate will be declared illegal and the result of the concerned subject will stand cancelled automatically.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: When do the QUEST Special Supplementary Exams begin?**\nExaminations start on **Monday, 12 October 2026** and conclude on **Monday, 19 October 2026**.\n\n**Q2: Which student batches are eligible for this special exam?**\nOnly students belonging to the **20-, 21-, and 22-Batches** appearing for First Semester First Year subjects.\n\n**Q3: What are the examination timings on Friday?**\nOn Friday, 16 October 2026, papers will be conducted from **02:00 PM to 05:00 PM** (standard weekday timing is 01:00 PM to 04:00 PM).\n\n**Q4: Is the examination center the same for all students?**\nNo. Center allocations are organized department-wise according to Annexure A."
    ]
  },
  {
    slug: 'spsc-cce-2026-screening-test-date',
    title: 'SPSC CCE-2026 Screening Test Date Announced – Saturday 24 October',
    category: 'results',
    organization: 'Sindh Public Service Commission (SPSC)',
    jobType: 'Combined Competitive Examination (CCE-2026) Provincial Civil Service Screening Test',
    location: 'Karachi, Hyderabad, Sukkur & Larkana Centers, Sindh',
    qualification: 'Registered Applicants for SPSC Combined Competitive Examination 2026',
    salary: 'Provincial Civil Service (BPS-16 / BPS-17 Assistant Commissioner, Section Officer)',
    experience: 'Eligible Graduates with Sindh Domicile',
    positions: 'Combined Competitive Examination 2026 Screening Test',
    lastDate: '2026-10-24',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://spsc.gov.pk/recent-announcements/Sep2026/screenig2026.pdf',
    applyLink: 'https://spsc.gov.pk/candidate_portal/',
    isVerified: true,
    featured: true,
    logoInitial: 'SPSC',
    featuredImage: '/images/spsc-cce-2026-screening-test-date.jpg',
    imageAlt: 'SPSC CCE 2026 Screening Test Date 24 October Sindh Public Service Commission Competitive Examination CareerDost',
    excerpt: 'SPSC officially confirms Saturday, 24 October 2026, as the Screening Test date for the Combined Competitive Examination (CCE-2026). Check official guidelines and portal update.',
    seoTitle: 'SPSC CCE-2026 Screening Test Date Announced – 24 October | CareerDost',
    metaDescription: 'Sindh Public Service Commission (SPSC) announces CCE-2026 Screening Test date for Saturday, 24 October 2026. Roll number slip status, syllabus scope, and preparation tips.',
    focusKeyword: 'SPSC CCE-2026',
    canonicalUrl: 'https://careerdost.blog/jobs/spsc-cce-2026-screening-test-date',
    ogTitle: 'SPSC CCE-2026 Screening Test Date Announced – Saturday 24 October',
    ogDescription: 'Official SPSC notification: Combined Competitive Examination (CCE-2026) screening test to be conducted on 24 October 2026 across Sindh centers.',
    schemaType: 'Article',
    content: [
      "### Official Announcement: SPSC CCE-2026 Screening Test Date",
      "The **Sindh Public Service Commission (SPSC)**, Thandi Sarak, Hyderabad, has issued an official **Press Release (Dated: 29th September 2026)** notifying that the **Screening Test for the Combined Competitive Examination (CCE-2026)** will be conducted on **Saturday, 24th October 2026**.",
      "The CCE examination serves as the premier gateway for recruitment to prestigious executive positions in the Government of Sindh, including Assistant Commissioner (BPS-17), Section Officer (BPS-17), and Excise & Taxation Officer (BPS-17).",
      "### Quick Summary Table",
      "- **Commission:** Sindh Public Service Commission (SPSC)\n- **Examination:** Combined Competitive Examination (CCE-2026)\n- **Stage:** **Preliminary Screening Test (MCQ Based)**\n- **Official Test Date:** **Saturday, 24 October 2026**\n- **Notification Date:** 29 September 2026\n- **Testing Centers:** Karachi, Hyderabad, Sukkur, Larkana\n- **Roll Number Slip Status:** **To Be Issued on Candidate Portal Prior to Test**\n- **Official Notification:** [spsc.gov.pk screening2026.pdf](https://spsc.gov.pk/recent-announcements/Sep2026/screenig2026.pdf)\n- **Official Candidate Portal:** [spsc.gov.pk/candidate_portal](https://spsc.gov.pk/candidate_portal/)",
      "### Roll Number Slip Status Clarification",
      "> [!IMPORTANT]\n> **Roll Number Slip Status:** As of 11 October 2026, the SPSC examination branch has notified the **test date**; individualized roll number slips will be uploaded to the official Candidate Portal closer to the examination date.\n>\n> Candidates are advised to keep their CNIC and login passwords ready and check `spsc.gov.pk/candidate_portal` regularly for their assigned venue and shift timing.",
      "### Screening Test Structure & Scope",
      "The CCE Screening Test is an objective multiple-choice paper designed to short-list candidates for the Written Comprehensive Examination. The standard syllabus components comprise:\n1. **English General & Comprehension:** Grammar, vocabulary, sentence correction, synonyms/antonyms, and reading comprehension.\n2. **General Science & Ability:** Basic everyday science, mathematical reasoning, logical analytical deduction, and numerical ability.\n3. **Pakistan Affairs & History:** Movement history, constitutional milestones, post-independence developments, and current political structures.\n4. **Current Affairs & Global Issues:** National and international contemporary affairs, climate change, geopolitical events, and economic indicators.\n5. **Sindh Affairs & Heritage:** Geography, culture, history, administrative setup, and literature of Sindh.",
      "### Essential Examination Day Instructions",
      "- **Mandatory Original Documents:** Candidates must present their original Computerized National Identity Card (CNIC) and printed admit card slip.\n- **Stationery:** Use only blue or black transparent ballpoint pens. Pencils and markers are not allowed for filling OMR sheets.\n- **Electronic Devices Banned:** Mobile phones, digital watches, calculators, and Bluetooth accessories are strictly prohibited inside the center.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: When will the SPSC CCE-2026 Screening Test take place?**\nThe screening test is officially scheduled for **Saturday, 24 October 2026**.\n\n**Q2: Are CCE-2026 roll number slips currently available for download?**\nThe Commission releases admit slips a few days prior to the test on the official candidate portal (`spsc.gov.pk/candidate_portal`).\n\n**Q3: Which cities host CCE examination centers?**\nMajor examination centers are established in **Karachi, Hyderabad, Sukkur, and Larkana**.\n\n**Q4: What is the format of the screening test?**\nThe screening test consists of 100 multiple-choice questions (MCQs) covering General Knowledge, English, Current Affairs, Everyday Science, and Pakistan/Sindh Affairs."
    ]
  },
  {
    slug: 'sbbu-naushahro-feroze-entry-test-2027',
    title: 'SBBU Naushahro Feroze Entry Test 2027 – October 17–18 Schedule Announced',
    category: 'admissions',
    organization: 'Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad',
    jobType: 'Pre-Entry Test Schedule for Undergraduate & Postgraduate Admissions (Batch 2027)',
    location: 'SBBU Naushahro Feroze (NF) Sub-Campus, Sindh',
    qualification: 'Intermediate (HSSC) / Terminal Degree Holders for Batch 2027 Programs',
    salary: 'Academic Session 2026–2027 Admissions at NF Campus',
    experience: 'Session 2026–2027 Registered Applicants for Naushahro Feroze Campus',
    positions: 'Pre-Entry Test Conducted on 17 & 18 October 2026 at NF Campus',
    lastDate: '2026-10-18',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://sbbusba.edu.pk/sbbu-main/news-updates.html',
    applyLink: 'https://admissions.sbbusba.edu.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'SBBU',
    featuredImage: '/images/sbbu-naushahro-feroze-entry-test-2027.jpg',
    imageAlt: 'SBBU Naushahro Feroze Entry Test 2027 Schedule 17-18 October Shaheed Benazir Bhutto University CareerDost',
    excerpt: 'SBBU Shaheed Benazirabad announces Pre-Entry Test for Naushahro Feroze Campus on 17 & 18 October 2026. Check test timing, required admit cards, and affiliated college dates.',
    seoTitle: 'SBBU Naushahro Feroze Entry Test 2027 – October 17–18 Schedule | CareerDost',
    metaDescription: 'SBBU Naushahro Feroze Campus Entry Test scheduled for 17 & 18 October 2026 for Batch 2027 admissions. Test guidelines, reporting time, and distinction from affiliated colleges.',
    focusKeyword: 'SBBU Entry Test 2027',
    canonicalUrl: 'https://careerdost.blog/jobs/sbbu-naushahro-feroze-entry-test-2027',
    ogTitle: 'SBBU Naushahro Feroze Entry Test 2027 – October 17–18 Schedule Announced',
    ogDescription: 'Official schedule for SBBU Naushahro Feroze Campus Entry Test 2027 on 17–18 October. Review candidate instructions and admission updates.',
    schemaType: 'Article',
    content: [
      "### Official Announcement: Naushahro Feroze Sub-Campus Pre-Entry Test",
      "**Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad**, has officially confirmed the Pre-Entry Test schedule for regular admissions to the **Naushahro Feroze (NF) Campus (Admission Batch 2027)**.",
      "As notified on the university's official news and updates portal, the **NF Campus Pre-Entry Test will be held on 17th and 18th October 2026** for registered candidates across undergraduate and graduate programs.",
      "### Crucial Distinction: NF Campus vs. Affiliated Colleges",
      "> [!IMPORTANT]\n> **Do Not Confuse the Two Admission Tracks:**\n>\n> 1. **SBBU Naushahro Feroze Sub-Campus Entry Test:** Scheduled for **17 & 18 October 2026**. This test is specifically for candidates who applied for degree programs taught directly at the SBBU NF Sub-Campus.\n> 2. **SBBU Affiliated Colleges Admissions:** The online application deadline for public/private affiliated degree colleges is **28 October 2026**, with their separate entrance test for District NF and Dadu colleges to be conducted later on **7 November 2026**.",
      "### Quick Summary Table",
      "- **University:** Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad\n- **Campus Venue:** **SBBU Naushahro Feroze (NF) Sub-Campus**\n- **Entry Test Dates:** **Saturday 17 & Sunday 18 October 2026**\n- **Admission Cycle:** Admission Batch 2027\n- **Affiliated Colleges Deadline:** **28 October 2026**\n- **Affiliated Colleges NF Test Date:** **7 November 2026**\n- **Official University Updates:** [sbbusba.edu.pk/news-updates](https://sbbusba.edu.pk/sbbu-main/news-updates.html)\n- **Online Admissions Portal:** [admissions.sbbusba.edu.pk](https://admissions.sbbusba.edu.pk/)",
      "### Programs Offered at NF Sub-Campus",
      "The Naushahro Feroze campus provides higher education access across interior Sindh in faculties such as:\n- **Bachelor of Business Administration (BBA)**\n- **BS Computer Science (BS CS)**\n- **BS Information Technology (BS IT)**\n- **BS English (Literature & Linguistics)**\n- **BS Education & Social Sciences**\n- **BS Bridge Programs & Postgraduate Diplomas**",
      "### Test Day Mandatory Instructions",
      "> [!WARNING]\n> - **Printed Admit Card:** Candidates must present their original online Pre-Entry Test Admit Card downloaded from `admissions.sbbusba.edu.pk`.\n> - **Identity Proof:** Original CNIC or NADRA Smart Card / B-Form with educational photo card is compulsory.\n> - **Reporting Time:** Candidates should report to the NF campus gates at least **45 minutes prior** to the test session time stated on their admit card.\n> - **Electronics Prohibited:** Mobile phones, calculators, smartwatches, and study notes are strictly forbidden inside the testing hall.",
      "### Useful University Contacts",
      "- **Directorate of Admissions SBBU:** Tel: 0244-9370524\n- **NF Campus Administrative Office:** Contact via main university helpdesk or visit the sub-campus admissions desk.\n- **Official Portal:** `admissions.sbbusba.edu.pk`",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: When will the SBBU Naushahro Feroze Campus Entry Test be conducted?**\nThe entry test will take place on **17th and 18th October 2026**.\n\n**Q2: What is the difference between this test and the 7 November test?**\nThe 17–18 October test is for the university's own Naushahro Feroze Sub-Campus programs. The 7 November test is for undergraduate admissions at affiliated degree colleges in NF and Dadu districts.\n\n**Q3: What is the last date to apply for affiliated degree colleges?**\nThe online application deadline for affiliated colleges is **28 October 2026**.\n\n**Q4: Where do I download my entry test slip for the NF campus?**\nLog in to your profile at `https://admissions.sbbusba.edu.pk/` to download your computerized admit card."
    ]
  },
  {
    slug: 'pnsc-jobs-2026-karachi-shipping',
    title: 'PNSC Jobs 2026 Karachi – Latest Government Shipping Vacancies on NJP',
    category: 'government-jobs',
    organization: 'Pakistan National Shipping Corporation (PNSC), Ministry of Maritime Affairs',
    jobType: 'Maritime Engineering & Senior Corporate Positions (Contract Basis)',
    location: 'PNSC Building, M.T. Khan Road, Karachi, Sindh',
    qualification: 'CoC Class 1 (Motor/Deck) / Bachelor in Naval Architecture/Marine/Mechanical / MBA/MPA/BBA',
    salary: 'Market-Competitive Executive Remuneration Package (PNSC Grade 12 / Deputy Manager)',
    experience: '1 to 10+ Years Specialized Maritime Sailing or Engineering / HR Experience',
    positions: 'Executive Maritime & Technical Vacancies (Deputy Managers & Superintendents)',
    lastDate: '2026-10-25',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://www.pnsc.com.pk/home',
    applyLink: 'https://njp.gov.pk/jobs/search',
    isVerified: true,
    featured: true,
    logoInitial: 'PNSC',
    featuredImage: '/images/pnsc-jobs-2026-karachi-shipping.jpg',
    imageAlt: 'PNSC Jobs 2026 Karachi Pakistan National Shipping Corporation Vacancies National Jobs Portal CareerDost',
    excerpt: 'Pakistan National Shipping Corporation (PNSC) Karachi announces high-level technical and managerial careers on National Jobs Portal. Apply online via njp.gov.pk before 25 October 2026.',
    seoTitle: 'PNSC Jobs 2026 Karachi – Government Shipping Vacancies on NJP | CareerDost',
    metaDescription: 'PNSC Jobs 2026 Karachi: Deputy Manager Ship Personnel, PMO Incharge, Superintendent Fleet & Tanker Engineer vacancies. Apply on National Jobs Portal before 25 October.',
    focusKeyword: 'PNSC Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/pnsc-jobs-2026-karachi-shipping',
    ogTitle: 'PNSC Jobs 2026 Karachi – Latest Government Shipping Vacancies on NJP',
    ogDescription: 'Official PNSC recruitment 2026 for maritime engineers, technical managers, and fleet superintendents in Karachi. Apply online through njp.gov.pk by 25 October.',
    schemaType: 'JobPosting',
    content: [
      "### Official Recruitment Announcement: Maritime Sector Careers at PNSC",
      "The **Pakistan National Shipping Corporation (PNSC)**, the national flag carrier operating under the **Ministry of Maritime Affairs, Government of Pakistan**, has announced high-level technical, maritime, and managerial vacancies at its Head Office in Karachi.",
      "Listed officially through the **National Jobs Portal (NJP)** and the PNSC corporate career portal, these contractual appointments offer market-competitive compensation packages for experienced maritime and corporate professionals.",
      "The application window closes on **25 October 2026**.",
      "> [!WARNING]\n> **Specialized Professional Positions:** These are senior technical and managerial appointments requiring certified maritime competencies or extensive post-qualification experience. They are **NOT** entry-level positions.",
      "### Quick Summary Table",
      "- **Employer:** Pakistan National Shipping Corporation (PNSC)\n- **Ministry:** Ministry of Maritime Affairs, Government of Pakistan\n- **Head Office:** PNSC Building, Moulvi Tamizuddin Khan (M.T.) Road, Karachi, Sindh\n- **Application Portal:** [National Jobs Portal (njp.gov.pk)](https://njp.gov.pk/jobs/search)\n- **Official PNSC Website:** [pnsc.com.pk](https://www.pnsc.com.pk/home)\n- **Announcement Date:** 04 October 2026\n- **Application Deadline:** **25 October 2026**\n- **Employment Nature:** Contract-based appointment with market-based remuneration",
      "### Advertised Vacancy Breakdown Table",
      "| Post Title | Grade | Max Age | Prescribed Qualifications & Experience |\n| :--- | :---: | :---: | :--- |\n| **Superintendent Engineer (Tanker)** | Grade-12 | 57 Years | Certificate of Competency (CoC) Class 1 (Motor) with at least 1 year sailing experience as Chief Engineer in the last 7 years on Foreign Going (FG) Tanker vessels. |\n| **Superintendent Engineer (Bulk Carrier)** | Grade-12 | 57 Years | Certificate of Competency (CoC) Class 1 (Motor) with at least 1 year sailing experience as Chief Engineer in the last 7 years on Foreign Going (FG) General Cargo / Container / Tanker vessels. |\n| **Superintendent Fleet** | Grade-12 | 57 Years | Certificate of Competency (CoC) Class 1 (Deck) with at least 1 year sailing experience as Chief Officer or Master in the last 7 years on Foreign Going vessels. |\n| **Incharge / Deputy Manager (PMO)** | Deputy Manager | 55 Years | Bachelor’s Degree in Naval Architecture, Shipbuilding, Marine Engineering, or Mechanical Engineering + 10 years relevant experience (with at least 5 years in ship design, shipyard supervision, FATs/HATs, and sea trials). |\n| **Deputy Manager (Ship Personnel)** | Deputy Manager | 50 Years | Class I / II CoC (Deck / Engineer) with sailing or shore experience OR MBA / MPA / BBA (HRM) from HEC recognized university with at least 5 years HR experience. |\n| **Incharge / Deputy Manager (DPP & CPP – Tanker)** | Deputy Manager | 55 Years | Relevant technical / commercial maritime qualification with proven tanker operations experience. |",
      "### Step-by-Step Online Application via National Jobs Portal",
      "1. Go to the official National Jobs Portal: [njp.gov.pk/jobs/search](https://njp.gov.pk/jobs/search).\n2. Search for employer **Pakistan National Shipping Corporation**.\n3. Create or sign in to your verified candidate profile on NJP.\n4. Complete all professional resume sections, educational degrees, and maritime certifications (CoC details).\n5. Select your desired vacancy (e.g. *Superintendent Engineer*, *Deputy Manager PMO*, or *Deputy Manager Ship Personnel*).\n6. Review your application and submit online before **25 October 2026**.\n7. Only shortlisted applicants will be called for interviews in Karachi.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for PNSC jobs?**\nThe application deadline is **25 October 2026**.\n\n**Q2: How do I submit my application?**\nApplications must be submitted online through the National Jobs Portal at `njp.gov.pk`.\n\n**Q3: Are these jobs open for fresh graduates?**\nNo. These positions are senior technical roles requiring Certificate of Competency (CoC Class 1) or 5 to 10 years of specialized shipyard, tanker, or HR experience.\n\n**Q4: Where will the job posting be located?**\nAll executive roles are based at the PNSC Head Office in Karachi, Sindh."
    ]
  },
  {
    slug: 'hec-irsip-batch-60-scholarship-2026',
    title: 'HEC IRSIP Batch 60 Scholarship 2026 – Research Fellowship Applications Open',
    category: 'scholarships',
    organization: 'Higher Education Commission (HEC) of Pakistan',
    jobType: 'International Research Support Initiative Program (IRSIP Batch 60)',
    location: 'Pakistan to Top Foreign Universities Worldwide',
    qualification: 'Full-time Enrolled PhD Scholars in Pakistani Universities (Enrolment Spring 2023 to Spring 2025)',
    salary: 'Fully Funded 6-Month Fellowship Abroad (Living Stipend, Return Airfare & Bench Fee)',
    experience: 'Completed 18 Credit Hours Coursework & BASR Approved Research Synopsis',
    positions: 'IRSIP Batch 60 Fellowship Abroad (6-Month Research Period)',
    lastDate: '2026-10-30',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://www.hec.gov.pk/english/scholarshipsgrants/IRSIP',
    applyLink: 'https://scholarship.hec.gov.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'HEC',
    featuredImage: '/images/hec-irsip-batch-60-scholarship-2026.jpg',
    imageAlt: 'HEC IRSIP Batch 60 Scholarship 2026 International Research Fellowship Higher Education Commission CareerDost',
    excerpt: 'HEC Pakistan opens Batch 60 applications for the International Research Support Initiative Program (IRSIP). Enrolled PhD students can apply for a fully funded 6-month research fellowship abroad by 30 October 2026.',
    seoTitle: 'HEC IRSIP Batch 60 Scholarship 2026 – Research Fellowship | CareerDost',
    metaDescription: 'HEC IRSIP Batch 60 Research Fellowship: 6-month fully funded doctoral research abroad. Eligibility for Spring 2023–Spring 2025 PhD cohorts. Apply by 30 October 2026.',
    focusKeyword: 'HEC IRSIP Batch 60',
    canonicalUrl: 'https://careerdost.blog/jobs/hec-irsip-batch-60-scholarship-2026',
    ogTitle: 'HEC IRSIP Batch 60 Scholarship 2026 – Research Fellowship Applications Open',
    ogDescription: 'Official HEC announcement for IRSIP Batch 60. Six-month doctoral research fellowship at top-ranked universities abroad. Applications close 30 October 2026.',
    schemaType: 'Article',
    content: [
      "### Official Announcement: HEC IRSIP Batch 60 Applications Open",
      "The **Higher Education Commission (HEC) of Pakistan** has officially invited applications for **Batch 60** of its flagship **International Research Support Initiative Program (IRSIP)**.",
      "IRSIP provides a **fully funded 6-month research fellowship** at world-class laboratories and research facilities abroad for outstanding full-time doctoral scholars enrolled in Pakistani universities.",
      "The program aims to elevate doctoral research standards in Pakistan, expose scholars to cutting-edge global methodologies, and build lasting institutional linkages between Pakistani universities and top international institutions.",
      "The official deadline for Batch 60 online applications is **30 October 2026**.",
      "### Quick Summary Table",
      "- **Funding Agency:** Higher Education Commission (HEC) Pakistan\n- **Program Name:** International Research Support Initiative Program (IRSIP)\n- **Cycle:** **Batch 60**\n- **Fellowship Duration:** **6 Months Abroad**\n- **Eligibility Cohort:** PhD enrolment date between **Spring 2023 and Spring 2025 (Inclusive)**\n- **Application Deadline:** **30 October 2026**\n- **Application Portal:** [scholarship.hec.gov.pk](https://scholarship.hec.gov.pk/)\n- **HEC Program Guidelines:** [hec.gov.pk/IRSIP](https://www.hec.gov.pk/english/scholarshipsgrants/IRSIP)",
      "### Detailed Eligibility Criteria for Batch 60",
      "As verified from the official HEC eligibility regulations:\n1. **Nationality & Enrolment:** The applicant must be a Pakistani or Azad Jammu & Kashmir (AJK) national enrolled as a **full-time PhD student** at an HEC-recognized university in Pakistan.\n2. **Enrolment Date Requirement:** For **Batch 60**, the applicant's official PhD enrolment date must fall strictly between **Spring 2023 and Spring 2025**, inclusive.\n3. **Coursework Completion:** The applicant must have completed at least **18 credit hours of PhD coursework**.\n4. **Program Duration Window:** The applicant must have completed at least **18 months of PhD enrolment** and must **not have exceeded 3.5 years** in the doctoral program at the time of application.\n5. **Entry Test Standard:** The scholar must have passed either the local GAT Subject Test or the recognized University Admission Test at the time of PhD enrolment.\n6. **Approved Synopsis:** The candidate must hold an approved PhD research topic and synopsis endorsed by the Board of Advanced Studies and Research (BASR) or Directorate of Advanced Studies and Research (DASR).\n7. **Foreign Acceptance Letter:** The scholar must possess an official acceptance / invitation letter from an advanced research laboratory or university abroad.",
      "### Host Institution & Supervisor Requirements",
      "> [!IMPORTANT]\n> - **Host University Ranking:** The host institution must be located in a developed country and ranked among the **top world universities** (overall or subject-wise) according to the Times Higher Education (THE) World University Rankings or QS World University Rankings.\n> - **Foreign Supervisor Status:** The proposed foreign supervisor must be a full-time faculty member ranked Assistant Professor or above.\n> - **Independence Rule:** The foreign supervisor must **not** be a former supervisor of the scholar's local PhD supervisor.",
      "### Step-by-Step Online Application Process",
      "1. Navigate to the official HEC scholarship portal: [scholarship.hec.gov.pk](https://scholarship.hec.gov.pk/).\n2. Create or log in to your verified HEC e-portal account.\n3. Complete your personal, academic, and doctoral enrolment information.\n4. Select **International Research Support Initiative Program (IRSIP) - Batch 60**.\n5. Upload your approved BASR synopsis, coursework transcripts, foreign acceptance letter, CV of the foreign supervisor, and local university endorsement.\n6. Submit your application online before **30 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the deadline for HEC IRSIP Batch 60?**\nThe application deadline for Batch 60 is **30 October 2026**.\n\n**Q2: What is the duration of the IRSIP research fellowship?**\nThe fellowship is awarded for a strict duration of **6 months** at a foreign university.\n\n**Q3: Which PhD batches are eligible for Batch 60?**\nOnly PhD scholars whose enrolment date falls between **Spring 2023 and Spring 2025** and who have completed at least 18 credit hours of coursework.\n\n**Q4: Can scholars already availing an HEC scholarship apply?**\nYes. Scholars holding other HEC scholarships are eligible provided they obtain and submit a No Objection Certificate (NOC) from their designated HEC project officer."
    ]
  },
  {
    slug: 'ministry-climate-change-jobs-2026',
    title: 'Ministry of Climate Change Jobs 2026 – IT Specialist & Animator Vacancies on NJP',
    category: 'government-jobs',
    organization: 'Ministry of Climate Change and Environmental Coordination, Govt of Pakistan',
    jobType: 'Federal PSDP Project Recruitment (Strengthening Technical Capacities Project - STC-PSDP)',
    location: 'Islamabad, Pakistan',
    qualification: '16-Year Education in IT/CS/SE (for IT Specialist) | Degree in Animation/Multimedia/Graphic Design (for Animator)',
    salary: 'Project Pay Scales: PPS-10 (IT Specialist) & PPS-09 (Motion Design Lead / Animator)',
    experience: '8+ Years Relevant Post-Qualification Experience (IT) | 6+ Years Animation Experience + Portfolio',
    positions: 'IT and Data Specialist (PPS-10) & Motion Design Lead / Senior Animator (PPS-09)',
    lastDate: '2026-10-19',
    noDeadline: false,
    publishDate: '2026-10-11',
    officialLink: 'https://www.mocc.gov.pk/Jobs',
    applyLink: 'https://njp.gov.pk/jobs/search',
    isVerified: true,
    featured: true,
    logoInitial: 'MOCC',
    featuredImage: '/images/ministry-climate-change-jobs-2026.jpg',
    imageAlt: 'Ministry of Climate Change Jobs 2026 IT Specialist Senior Animator Federal Government Vacancies NJP CareerDost',
    excerpt: 'Ministry of Climate Change and Environmental Coordination invites online applications on National Jobs Portal for IT Specialist (PPS-10) and Senior Animator (PPS-09). Apply before 19 October 2026.',
    seoTitle: 'Ministry of Climate Change Jobs 2026 – IT Specialist & Animator | CareerDost',
    metaDescription: 'Ministry of Climate Change Jobs 2026 (STC-PSDP Project): IT & Data Specialist (PPS-10) and Motion Design Lead / Animator (PPS-09). Apply on NJP by 19 October 2026.',
    focusKeyword: 'Ministry of Climate Change Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/ministry-climate-change-jobs-2026',
    ogTitle: 'Ministry of Climate Change Jobs 2026 – IT Specialist & Animator Vacancies on NJP',
    ogDescription: 'Federal Government project recruitment under MoCC&EC Islamabad. High-paying PPS-10 and PPS-09 positions. Online applications open on njp.gov.pk until 19 October.',
    schemaType: 'JobPosting',
    content: [
      "### Official Federal Recruitment Announcement: STC-PSDP Project",
      "The **Ministry of Climate Change and Environmental Coordination (MoCC&EC), Government of Pakistan**, has announced high-level contractual vacancies under its Federal PSDP Project titled **\"Strengthening Technical Capacities of Ministry of Climate Change and Environmental Coordination\" (STC - PSDP Project)**.",
      "Published officially on **04 October 2026**, the recruitment drive invites qualified professionals across Pakistan to apply online through the **National Jobs Portal (njp.gov.pk)** before the closing deadline of **19 October 2026**.",
      "> [!WARNING]\n> **Mid-to-Senior Professional Roles:** These are competitive project positions requiring 6 to 8+ years of professional post-qualification experience. They are **NOT** fresh-graduate entry-level posts.",
      "### Quick Summary Table",
      "- **Ministry:** Ministry of Climate Change and Environmental Coordination, Islamabad\n- **Project Name:** Strengthening Technical Capacities (STC - PSDP Project)\n- **Announcement Date:** 04 October 2026\n- **Application Deadline:** **19 October 2026**\n- **Project Pay Scales:** PPS-10 & PPS-09\n- **Employment Type:** Contractual Project Appointment\n- **Official Ministry Portal:** [mocc.gov.pk/Jobs](https://www.mocc.gov.pk/Jobs)\n- **Online Application Portal:** [National Jobs Portal (njp.gov.pk)](https://njp.gov.pk/jobs/search)\n- **Terms of Reference PDF:** [mocc.gov.pk TORs PDF](https://www.mocc.gov.pk/SiteImage/Jobs/tors-02.10.2026.pdf)",
      "### Advertised Vacancy Breakdown Table",
      "| Post Title | Project Pay Scale | Max Age | Prescribed Qualifications & Experience |\n| :--- | :---: | :---: | :--- |\n| **IT and Data Specialist** | PPS-10 | 52 Years | 16 years of education in IT, Computer Science, or Software Engineering from an HEC recognized university + At least 08 years of relevant post-qualification experience in IT operations, cybersecurity, database management, systems, and digital solutions. Experience with Python/Java/PHP, network administration, and e-Office is required. |\n| **Motion Design Lead / Senior Animator** | PPS-09 | 45 Years | Bachelor’s degree in Animation, Multimedia Arts, Graphic Design, or related field + Minimum 6 years of professional experience in motion design, animation, or visual storytelling. Strong proficiency in Adobe After Effects (2.5D, expressions), Illustrator, Photoshop, Premiere Pro (optional 3D tools Blender/Cinema 4D). A professional creative portfolio is mandatory. |",
      "### Core Responsibilities & Terms of Reference (TORs)",
      "1. **IT and Data Specialist (PPS-10):**\n   - Initiate and lead the establishment of a centralized climate data repository for the ministry.\n   - Provide technical leadership for climate data management, environmental monitoring, and E-Governance.\n   - Manage and maintain ministerial IT infrastructure, servers, network policies, security firewalls, and hardware inventory.\n   - Upgrade and maintain the official MoCC&EC website, e-office system, and project dashboards.\n\n2. **Motion Design Lead / Senior Animator (PPS-09):**\n   - Lead creative visual storytelling, animation styles, and mood boards for national climate campaigns.\n   - Conceptualize and produce motion graphics, animated explainers, and infographic videos explaining complex climate data (e.g. rainfall anomalies, temperature shifts, flood mitigation).\n   - Optimize motion content for social channels (YouTube Shorts, Reels, presentations, TV spots).\n   - Execute bilingual (Urdu & English) animations ensuring accessibility, regional diversity, and cultural inclusivity.",
      "### Step-by-Step Online Application via NJP",
      "1. Navigate to the official National Jobs Portal: [njp.gov.pk/jobs/search](https://njp.gov.pk/jobs/search).\n2. Search for employer **Ministry of Climate Change and Environmental Coordination** or project **STC - PSDP Project**.\n3. Log in to your candidate account and verify your CNIC, education, and detailed work experience.\n4. For Animator candidates, ensure a clickable URL to your digital portfolio or demo reel is provided.\n5. Select your desired vacancy and submit online before **19 October 2026**.\n6. Applications submitted through postal mail or directly to the ministry will not be entertained.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for Ministry of Climate Change jobs?**\nThe closing deadline is **19 October 2026**.\n\n**Q2: What pay scales are offered for these positions?**\nThe IT and Data Specialist is offered at **PPS-10**, while the Motion Design Lead / Senior Animator is offered at **PPS-09**.\n\n**Q3: Where can I submit my application?**\nApplications must be submitted online through the National Jobs Portal at `https://njp.gov.pk/`.\n\n**Q4: Is a portfolio required for the Animator post?**\nYes. A professional portfolio demonstrating quality and range in animated work and visual storytelling is mandatory."
    ]
  }
]

export function publish() {
  console.log('=== PUBLISHING 10 VERIFIED OCT 11 ARTICLES ===\n')

  const db = new Database('careerdost.sqlite')

  const catMap = {
    'government-jobs': 'Government Jobs',
    admissions: 'Admissions',
    scholarships: 'Scholarships',
    results: 'Results'
  }

  // 1. Seed into careerdost.sqlite
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

  for (const item of oct11Articles) {
    console.log(`Inserting into SQLite: ${item.slug}`)
    const contentJson = JSON.stringify(item.content)
    const catLabel = catMap[item.category] || 'Jobs'

    stmtArt.run(
      item.slug, item.title, item.category, item.organization, item.jobType, item.location,
      item.qualification, item.salary, item.lastDate, item.publishDate, item.officialLink,
      item.featured ? 1 : 0, item.logoInitial, item.excerpt, contentJson, item.seoTitle, item.metaDescription,
      item.featuredImage, item.imageAlt, item.experience, item.positions, item.applyLink,
      item.isVerified ? 1 : 0, item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
    )

    stmtDaily.run(
      item.slug, item.title, catLabel, item.excerpt, contentJson, item.featuredImage,
      item.imageAlt, item.officialLink, item.applyLink, item.lastDate, item.publishDate,
      item.organization, item.location, item.qualification, item.experience, item.positions,
      item.jobType, item.salary, item.isVerified ? 1 : 0, item.featured ? 1 : 0, item.seoTitle, item.metaDescription,
      item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
    )
  }
  console.log('Seeded local careerdost.sqlite successfully.')

  // Homepage priority order (Sindh prioritized at top):
  // 1. SPSC 54 Government Jobs (artId: 335, updId: 235)
  // 2. SPSC Departmental Exam Slips (artId: 334, updId: 234)
  // 3. Sindh Courts BPS 1-4 Jobs (artId: 333, updId: 233)
  // 4. QUEST Postgraduate Admissions (artId: 332, updId: 232)
  // 5. QUEST Special Exams (artId: 331, updId: 231)
  // 6. SPSC CCE Screening Test (artId: 330, updId: 230)
  // 7. SBBU Naushahro Feroze Entry Test (artId: 329, updId: 229)
  // 8. PNSC Karachi Shipping Jobs (artId: 328, updId: 228)
  // 9. HEC IRSIP Batch 60 Scholarship (artId: 327, updId: 227)
  // 10. Ministry of Climate Change Jobs (artId: 326, updId: 226)
  const idMap = [
    { slug: 'spsc-jobs-2026-54-vacancies', artId: 335, updId: 235 },
    { slug: 'spsc-departmental-exam-slips-2026', artId: 334, updId: 234 },
    { slug: 'sindh-courts-bps-1-4-jobs-2026', artId: 333, updId: 233 },
    { slug: 'quest-nawabshah-phd-me-ms-admissions-2026', artId: 332, updId: 232 },
    { slug: 'quest-special-exams-timetable-2026', artId: 331, updId: 231 },
    { slug: 'spsc-cce-2026-screening-test-date', artId: 330, updId: 230 },
    { slug: 'sbbu-naushahro-feroze-entry-test-2027', artId: 329, updId: 229 },
    { slug: 'pnsc-jobs-2026-karachi-shipping', artId: 328, updId: 228 },
    { slug: 'hec-irsip-batch-60-scholarship-2026', artId: 327, updId: 227 },
    { slug: 'ministry-climate-change-jobs-2026', artId: 326, updId: 226 }
  ]

  for (let i = 0; i < idMap.length; i++) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(9000 + i, idMap[i].slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(9000 + i, idMap[i].slug)
  }

  for (const m of idMap) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(m.artId, m.slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(m.updId, m.slug)
  }
  console.log('Updated priority IDs in local SQLite.')

  // 2. Prepend to src/data/listings.js
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')

  const formattedItems = oct11Articles.map(a => {
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

    if (!listingsCode.includes('spsc-jobs-2026-54-vacancies')) {
      listingsCode = listingsCode.slice(0, insertPos) + prependedCode + listingsCode.slice(insertPos)
      listingsCode = listingsCode.replace(/Updated:\s*\d{4}-\d{2}-\d{2}/, 'Updated: 2026-10-11')
      fs.writeFileSync(listingsPath, listingsCode, 'utf8')
      console.log('Successfully updated src/data/listings.js with 10 new articles!')
    } else {
      console.log('src/data/listings.js already contains new articles.')
    }
  }

  // 3. Update scripts/generate_sitemap.js
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')
  if (!sitemapScript.includes('spsc-jobs-2026-54-vacancies')) {
    const insertPattern = 'const publishedDailyUpdates = [\n'
    const newSitemapEntries = idMap.map(m => `  { slug: '${m.slug}', date: '2026-10-11' },\n`).join('')
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + newSitemapEntries)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('Updated scripts/generate_sitemap.js with new slugs.')
  }
}

if (process.argv[1] && process.argv[1].endsWith('publish_oct11_articles.js')) {
  publish()
}
