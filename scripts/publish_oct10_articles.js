import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

export const oct10Articles = [
  {
    slug: 'sbbu-ms-mphil-mba-merit-list-2027',
    title: 'SBBU Merit List 2027 Announced – MS, MPhil, MBA & BS Bridge Results',
    category: 'results',
    organization: 'Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad',
    jobType: 'Postgraduate & BS-Bridge Provisional Merit Lists (Admission Batch 2027)',
    location: 'SBBU Main Campus, Nawabshah / Shaheed Benazirabad, Sindh',
    qualification: 'Pre-Entry Test Qualified Candidates for MS, MPhil, MBA & BS Bridge Programs',
    salary: 'Fee Structure & Interview Schedule To Be Announced Soon',
    experience: 'Session 2026–2027 Postgraduate & Lateral Applicants',
    positions: 'Provisional Merit Lists for MS, MPhil, MBA & BS-Bridge Programs',
    lastDate: '2026-10-31',
    noDeadline: false,
    publishDate: '2026-10-10',
    officialLink: 'https://mail.sbbusba.edu.pk/sbbu-main/ms_mphil_mba_merit_list_2027.html',
    applyLink: 'https://mail.sbbusba.edu.pk/sbbu-main/bs_bridge_merit_list_2027.html',
    isVerified: true,
    featured: true,
    logoInitial: 'SBBU',
    featuredImage: '/images/sbbu-ms-mphil-mba-merit-list-2027.jpg',
    imageAlt: 'SBBU Merit List 2027 MS MPhil MBA BS Bridge Provisional Results Announced Shaheed Benazir Bhutto University CareerDost',
    excerpt: 'Shaheed Benazir Bhutto University (SBBU) Shaheed Benazirabad has released the Provisional Merit Lists for MS, MPhil, MBA, and BS-Bridge programs (Batch 2027). Interview schedule and fee structure to be announced soon.',
    seoTitle: 'SBBU Merit List 2027 Announced – MS, MPhil, MBA & BS Bridge Results | CareerDost',
    metaDescription: 'SBBU SBA has published the Provisional Merit Lists for MS, MPhil, MBA, and BS Bridge admissions Batch 2027. Check test qualified status, interview eligibility, and official links.',
    focusKeyword: 'SBBU Merit List 2027',
    canonicalUrl: 'https://careerdost.blog/jobs/sbbu-ms-mphil-mba-merit-list-2027',
    ogTitle: 'SBBU Merit List 2027 Announced – MS, MPhil, MBA & BS Bridge Results',
    ogDescription: 'Provisional merit lists released for SBBU Nawabshah MS, MPhil, MBA, and BS Bridge Batch 2027. Check qualified candidate lists and upcoming interview guidelines.',
    schemaType: 'Article',
    content: [
      "### Official Announcement: Provisional Merit Lists Released",
      "**Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad**, has officially released the **Provisional Merit Lists for MS, M.Phil & MBA Programs and the BS-Bridge Program (Admission Batch 2027)**.",
      "Both provisional merit lists were published on **8 October 2026**, covering postgraduate and lateral bridge degree disciplines at the **SBBU Main Campus, Nawabshah**.",
      "Candidates who appeared in the university pre-entry screening test can now verify their qualified status online through the official institutional links.",
      "### Privacy & Candidate Protection Notice",
      "> [!NOTE]\n> **Candidate Privacy Commitment:** In strict compliance with personal data protection policies, **CareerDost does NOT scrape, copy, or reproduce personal candidate names, fathers' names, test scores, or form IDs.**\n>\n> All prospective students must check their selection status directly on the official university servers:\n> - **MS, MPhil & MBA Merit List:** `https://mail.sbbusba.edu.pk/sbbu-main/ms_mphil_mba_merit_list_2027.html`\n> - **BS-Bridge Program Merit List:** `https://mail.sbbusba.edu.pk/sbbu-main/bs_bridge_merit_list_2027.html`",
      "### Quick Summary Table",
      "- **University:** Shaheed Benazir Bhutto University (SBBU), Shaheed Benazirabad\n- **Campus Covered:** **SBBU Main Campus, Nawabshah**\n- **Programs Included:** **MS, MPhil, MBA & BS-Bridge Programs**\n- **Batch:** **Admission Batch 2027**\n- **List Status:** **Provisional Merit List (Interview Eligibility Only)**\n- **Publication Date:** 8 October 2026\n- **Interview Schedule:** **To Be Announced Soon by University**\n- **Fee Structure:** **To Be Announced Soon by University**\n- **Official University Website:** [sbbusba.edu.pk](https://sbbusba.edu.pk/)\n- **Direct MS/MPhil/MBA List:** [mail.sbbusba.edu.pk MS List](https://mail.sbbusba.edu.pk/sbbu-main/ms_mphil_mba_merit_list_2027.html)\n- **Direct BS-Bridge List:** [mail.sbbusba.edu.pk BS-Bridge List](https://mail.sbbusba.edu.pk/sbbu-main/bs_bridge_merit_list_2027.html)",
      "### Academic Disciplines Covered in the Merit Lists",
      "The published provisional lists cover candidates who qualified the pre-entry test across various departments:\n\n1. **MS & MPhil Programs:**\n   - MS Information Technology (MS IT)\n   - MS Computer Science (MS CS)\n   - MPhil English Literature & Linguistics\n   - MPhil Chemistry\n   - MPhil Education & other academic disciplines\n\n2. **Master of Business Administration (MBA):**\n   - MBA Morning & Evening programs\n\n3. **BS-Bridge (Lateral Entry) Programs:**\n   - BS Chemistry (Bridge)\n   - BS English (Bridge)\n   - BS Mathematics (Bridge)\n   - Other approved bridge transition departments",
      "### Crucial Clarification: Provisional Status & Interviews",
      "> [!IMPORTANT]\n> **Not Final Admission Confirmation:** Inclusion in this provisional list confirms that the candidate has qualified the Pre-Entry Test and is eligible to appear for the **Departmental Interview**.\n>\n> The university has explicitly notified:\n> *\"Congratulations to the following candidates who have successfully qualified the Pre-Entry Test of Shaheed Benazir Bhutto University, Shaheed Benazirabad, and are eligible to appear for the interview... Note: Interview Schedule and Fee Structure will be announced soon.\"*\n>\n> Candidates are not finally admitted until they clear the departmental interview, complete physical document verification, and submit the prescribed admission fees.",
      "### Documents to Prepare for Upcoming Interviews",
      "Qualified candidates are advised to organize the following original documents and attested sets in advance:\n1. Original Matriculation (SSC) Certificate & Marksheet\n2. Original Intermediate (HSC) Certificate & Marksheet\n3. Original Bachelor’s / Terminal Degree Transcripts & Degree Certificates\n4. Original CNIC or Form-B\n5. Original Domicile and PRC (Form C) Certificates\n6. Four recent passport-sized photographs\n7. Departmental No Objection Certificate (NOC) if currently in government or corporate employment",
      "### Step-by-Step Guide to Check Your Result Online",
      "1. Open the relevant official SBBU portal link:\n   - For MS, MPhil, or MBA: [mail.sbbusba.edu.pk/sbbu-main/ms_mphil_mba_merit_list_2027.html](https://mail.sbbusba.edu.pk/sbbu-main/ms_mphil_mba_merit_list_2027.html)\n   - For BS-Bridge: [mail.sbbusba.edu.pk/sbbu-main/bs_bridge_merit_list_2027.html](https://mail.sbbusba.edu.pk/sbbu-main/bs_bridge_merit_list_2027.html)\n2. On desktop, press `Ctrl + F` (or `Cmd + F` on Mac); on mobile, use the browser menu 'Find in page'.\n3. Search using your assigned **Form ID** or **Candidate Name**.\n4. Check your Test Score and department allocation.\n5. Keep visiting the official university website `sbbusba.edu.pk` for the upcoming interview timetable.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: Does appearing on this list guarantee final admission at SBBU?**\nNo. This is strictly a Provisional Merit List for pre-entry test qualified candidates. Final admission depends on qualifying the interview and fulfilling document/fee requirements.\n\n**Q2: When will the interview schedule be announced?**\nThe university has stated that the interview timetable will be published soon on the official website.\n\n**Q3: What is the fee structure for MS, MPhil, MBA, and BS-Bridge programs?**\nThe official fee structure for these postgraduate and bridge programs will be released alongside the interview notification.\n\n**Q4: Which campus are these merit lists for?**\nThese provisional lists cover admissions at the **SBBU Main Campus, Nawabshah**.\n\n**Q5: What should I do if my name is on the provisional list?**\nGather your original educational credentials, degrees, CNIC, and domicile, and monitor the official SBBU portal for your departmental interview date."
    ]
  },
  {
    slug: 'nts-nat-gat-roll-number-slip-2026',
    title: 'NTS NAT & GAT Roll Number Slip 2026 – October 11 Test Details',
    category: 'admissions',
    organization: 'National Testing Service (NTS) Pakistan',
    jobType: 'Standardized National Admission & Assessment Tests (NAT 2026-X & GAT General 2026-VII)',
    location: 'Nationwide Test Centers (Islamabad, Lahore, Karachi, Peshawar, Quetta, Multan, etc.)',
    qualification: 'Intermediate (HSSC) for NAT | 16-Year Degree (BS/MA/MSc) for GAT General',
    salary: 'Scorecard Valid for 1 Year (NAT) and 2 Years (GAT General) Across Associated Universities',
    experience: 'Registered Candidates for October 2026 Tests',
    positions: 'National Aptitude Test (NAT 2026-X) & Graduate Assessment Test (GAT 2026-VII)',
    lastDate: '2026-10-11',
    noDeadline: false,
    publishDate: '2026-10-10',
    officialLink: 'https://www.nts.org.pk/new/candidates.php',
    applyLink: 'https://portal.nts.org.pk/login',
    isVerified: true,
    featured: true,
    logoInitial: 'NTS',
    featuredImage: '/images/nts-nat-gat-roll-number-slip-2026.jpg',
    imageAlt: 'NTS NAT and GAT Roll Number Slip 2026 Download October 11 Test Details National Testing Service CareerDost',
    excerpt: 'NTS has issued Roll Number Slips for NAT 2026-X and GAT General 2026-VII scheduled for Sunday, 11 October 2026. Check reporting time, test day instructions, and download your slip from portal.nts.org.pk.',
    seoTitle: 'NTS NAT & GAT Roll Number Slip 2026 – October 11 Test Details | CareerDost',
    metaDescription: 'Download NTS Roll Number Slips for NAT 2026-X and GAT General 2026-VII scheduled for Sunday, 11 October 2026. Check test centers, reporting time, and mandatory candidate instructions.',
    focusKeyword: 'NTS NAT GAT Roll Number Slip 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/nts-nat-gat-roll-number-slip-2026',
    ogTitle: 'NTS NAT & GAT Roll Number Slip 2026 – October 11 Test Details',
    ogDescription: 'Official NTS Roll Number Slips available for NAT-X and GAT General-VII tests on Sunday 11 October 2026. Access your test venue and reporting instructions online.',
    schemaType: 'Article',
    content: [
      "### Official Examination Notice: Sunday, 11 October 2026 Tests",
      "The **National Testing Service (NTS) Pakistan** has issued official **Roll Number Slips and Candidate Lists** for two major nationwide standardized tests scheduled to be conducted on **Sunday, 11 October 2026**:",
      "1. **National Aptitude Test — NAT 2026-X** (for undergraduate admissions)\n2. **Graduate Assessment Test — GAT General 2026-VII** (for MS / M.Phil admissions and scholarships)",
      "Registered candidates across Pakistan and Azad Jammu & Kashmir can now log in to the official NTS candidate portal to verify their test center allocation, reporting time, and download their printed admit card.",
      "### Privacy & Direct Access Protocol",
      "> [!NOTE]\n> **Safe Access Notice:** CareerDost does **NOT** collect, request, or process candidates' CNIC numbers or personal credentials.\n>\n> Applicants must log into the official NTS secure portal directly at `https://portal.nts.org.pk/login` to retrieve their personalized examination admit slips.",
      "### Quick Summary Table",
      "- **Testing Organization:** National Testing Service (NTS) Pakistan\n- **Upcoming Test Date:** **Sunday, 11 October 2026**\n- **Undergraduate Test:** **National Aptitude Test (NAT 2026-X)**\n- **Postgraduate Test:** **Graduate Assessment Test (GAT General 2026-VII)**\n- **Roll Number Slip Status:** **Available for Download Online**\n- **Portal Link:** [portal.nts.org.pk/login](https://portal.nts.org.pk/login)\n- **Candidate List Directory:** [nts.org.pk/new/candidates.php](https://www.nts.org.pk/new/candidates.php)",
      "### Mandatory Documents for Test Day Entry",
      "> [!IMPORTANT]\n> Candidates will **NOT** be permitted to enter the examination center without the following mandatory documents:\n>\n> 1. **Printed NTS Roll Number Slip** (with candidate photograph clearly visible).\n> 2. **Original Computerized National Identity Card (CNIC)**, Smart Card, or Original Valid Passport. *(Under-18 candidates without CNIC must present their Original NADRA Smart Card or Original B-Form along with a photographic educational identity card / matric certificate).* \n> 3. Clean transparent writing clipboard, black or blue ballpoint pens, and HB pencils.\n> \n> **Strict Warning:** Photocopies of CNIC or expired identity documents are strictly **NOT** acceptable.",
      "### Strict Prohibitions & Center Rules",
      "> [!WARNING]\n> The following items are strictly prohibited inside the examination hall:\n> - Mobile phones, smartwatches, Bluetooth devices, and recording gadgets\n> - Calculators, mathematical tables, and electronic storage media\n> - Bags, weapon replicas, and unauthorized study notes\n>\n> Any candidate found possessing a mobile phone or unauthorized electronic device will be disqualified immediately and blacklisted from future NTS examinations.",
      "### Reporting Times & Exam Sessions",
      "- NTS tests are conducted in morning and afternoon sessions depending on your specific category (NAT-IA, NAT-IE, NAT-IM, NAT-ICS, NAT-IG, or GAT-A, GAT-B, GAT-C, GAT-D).\n- Candidates must reach their designated test center at least **45 minutes prior** to the reporting time stated on their individual roll number slips.\n- Entry gates close strictly 15 minutes before the test begins, and late arrivals will not be accommodated under any circumstances.",
      "### How to Download Your NTS Roll Number Slip",
      "1. Navigate to the official NTS candidate login portal: [portal.nts.org.pk/login](https://portal.nts.org.pk/login).\n2. Enter your registered CNIC number (without dashes) and password.\n3. Access the **Active Applications / Admit Slips** section on your dashboard.\n4. Select your registered project (NAT 2026-X or GAT General 2026-VII).\n5. Click **Download Roll Number Slip** and print a clean copy on A4 white paper.\n6. Verify your test center address, roll number, and session timings carefully.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the date of the NAT 2026-X and GAT General 2026-VII tests?**\nBoth tests will be conducted nationwide on **Sunday, 11 October 2026**.\n\n**Q2: How can I download my roll number slip?**\nYou can download it by logging into your profile on the official NTS portal (`portal.nts.org.pk/login`).\n\n**Q3: Can I sit in the exam if I only have a photocopy of my CNIC?**\nNo. You must carry your original, valid CNIC/Smart Card or original passport. Photocopies are strictly rejected.\n\n**Q4: Are calculators allowed in GAT General?**\nNo. Calculators of any type are prohibited in both NAT and GAT General examinations.\n\n**Q5: How long is the NTS test score valid?**\nNAT scores are valid for **1 year**, while GAT General scores remain valid for **2 years** for admissions across associated universities."
    ]
  },
  {
    slug: 'punjab-ophthalmology-college-jobs-2026',
    title: 'Punjab Ophthalmology College Jobs 2026 – Apply Online Through NTS',
    category: 'government-jobs',
    organization: 'College of Ophthalmology & Allied Vision Sciences Lahore (KEMU / Mayo Hospital)',
    jobType: 'Specialized Healthcare & Medical Education Department Vacancy (Code: 2610203)',
    location: 'Lahore, Punjab',
    qualification: 'FSc Pre-Medical with 1-Year / 2-Year Diploma in Ophthalmic Technology / Vision Sciences from recognized medical faculty',
    salary: 'Pay & Allowances as per Punjab Government Pay Scales / Contract Policy',
    experience: 'Fresh to 1+ Year Relevant Clinical Ophthalmic Experience',
    positions: 'Junior Ophthalmic Technician (3 Vacancies)',
    lastDate: '2026-10-20',
    noDeadline: false,
    publishDate: '2026-10-10',
    officialLink: 'https://portal.nts.org.pk/Alldetail/MTAxMzc0',
    applyLink: 'https://portal.nts.org.pk/register',
    isVerified: true,
    featured: true,
    logoInitial: 'COAVS',
    featuredImage: '/images/punjab-ophthalmology-college-jobs-2026.jpg',
    imageAlt: 'Punjab Ophthalmology College Jobs 2026 Lahore Apply Online Through NTS CareerDost',
    excerpt: 'Government of the Punjab Specialized Healthcare & Medical Education Department announces Junior Ophthalmic Technician jobs (3 posts) at College of Ophthalmology & Allied Vision Sciences Lahore. Apply via NTS by 20 October 2026.',
    seoTitle: 'Punjab Ophthalmology College Jobs 2026 – Apply Online Through NTS | CareerDost',
    metaDescription: 'College of Ophthalmology & Allied Vision Sciences Lahore announces Junior Ophthalmic Technician jobs. 3 vacancies, Punjab domicile. Apply online through NTS before 20 October 2026.',
    focusKeyword: 'Punjab Ophthalmology College Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/punjab-ophthalmology-college-jobs-2026',
    ogTitle: 'Punjab Ophthalmology College Jobs 2026 – Apply Online Through NTS',
    ogDescription: 'Healthcare vacancies under Specialized Healthcare Dept Punjab at College of Ophthalmology Lahore (KEMU/Mayo Hospital). Apply online on NTS by 20 October 2026.',
    schemaType: 'JobPosting',
    content: [
      "### Official Recruitment Announcement: Punjab Healthcare Department",
      "The **Government of the Punjab, Specialized Healthcare & Medical Education Department**, has announced fresh contractual vacancies at the prestigious **College of Ophthalmology & Allied Vision Sciences (COAVS), King Edward Medical University (KEMU) / Mayo Hospital Lahore**.",
      "Conducted through the **National Testing Service (NTS)** under **Project Code: 2610203**, this recruitment drive invites qualified clinical vision science technicians holding Punjab domicile to join the public health sector.",
      "### Quick Summary Table",
      "- **Organization:** College of Ophthalmology & Allied Vision Sciences (COAVS) Lahore\n- **Administrative Department:** Specialized Healthcare & Medical Education Department, Govt. of Punjab\n- **Affiliated Institution:** KEMU / Mayo Hospital Lahore\n- **Project Code:** 2610203\n- **Testing Agency:** National Testing Service (NTS)\n- **Announcement Date:** 9 October 2026\n- **Application Deadline:** **20 October 2026**\n- **Tentative Test Date:** **30 October 2026**\n- **Application Fee:** **Rs. 450 + Rs. 10 Service Charges = Rs. 460/=**\n- **Official NTS Project Link:** [portal.nts.org.pk/Alldetail/MTAxMzc0](https://portal.nts.org.pk/Alldetail/MTAxMzc0)\n- **Apply Online Portal:** [portal.nts.org.pk/register](https://portal.nts.org.pk/register)",
      "### Advertised Vacancy Breakdown Table",
      "The official details of the advertised position are as follows:\n\n| Post Title | Total Vacancies | Prescribed Qualification | Age Limit | Domicile | Application Deadline |\n| :--- | :---: | :--- | :---: | :---: | :---: |\n| **Junior Ophthalmic Technician** | 3 | F.Sc (Pre-Medical) with Diploma in Ophthalmic Technology from a recognized Medical Faculty / Board | 18–25 Years (Plus general age relaxation) | Punjab | 20 October 2026 |",
      "### Detailed Eligibility & Qualification Rules",
      "> [!IMPORTANT]\n> - **Educational Criteria:** Higher Secondary School Certificate (F.Sc Pre-Medical) second division from a recognized Board of Intermediate and Secondary Education, along with a relevant diploma in Ophthalmic Technology / Vision Sciences.\n> - **Age Limit:** **18 to 25 Years** on the closing date.\n> - **Age Relaxation:** General age relaxation as per Punjab Government recruitment rules (up to 5 years for male candidates and 8 years for female candidates) is applicable.\n> - **Domicile Requirement:** Candidates must hold a valid domicile of any district within the province of **Punjab**.",
      "### NTS Application Fee & Payment Method",
      "- The test fee is **Rs. 450 + Rs. 10 service charges (Total Rs. 460/=)**.\n- After filling out the online form, generate the unique 1Link 1Bill invoice.\n- Pay through Mobile Banking (Easypaisa, JazzCash, Upaisa, bank apps), ATM, or bank branches.\n- Only online forms are entertained. Do not send postal applications or bank receipts to NTS headquarters.",
      "### Selection Mechanism & Screening Test",
      "1. **NTS Written Screening Test:** Tentatively scheduled for **30 October 2026** in Lahore. Test questions cover ophthalmic techniques, clinical optics, basic anatomy, and general English.\n2. **Departmental Scrutiny:** Top-ranking candidates will be called for document verification at COAVS Mayo Hospital Lahore.\n3. **Interview & Merit Formulation:** Final selection will be determined in accordance with the Punjab Government Contract Appointment Policy.",
      "### Step-by-Step Online Application Process",
      "1. Navigate to the official NTS project portal: [portal.nts.org.pk/Alldetail/MTAxMzc0](https://portal.nts.org.pk/Alldetail/MTAxMzc0).\n2. Click on **Apply Now** or log into your candidate profile on `portal.nts.org.pk/register`.\n3. Complete your personal bio-data, Punjab domicile details, and educational background.\n4. Upload your recent photograph and CNIC copy.\n5. Select the post **Junior Ophthalmic Technician**.\n6. Generate the 1Link 1Bill payment voucher and deposit the Rs. 460 fee.\n7. Submit your application online before the deadline of **20 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for Punjab Ophthalmology College jobs?**\nThe deadline to apply online is **20 October 2026**.\n\n**Q2: How many vacancies are available?**\nThere are **3 vacancies** for the post of Junior Ophthalmic Technician.\n\n**Q3: Can candidates from Sindh or KPK apply?**\nNo. The positions are strictly reserved for candidates possessing a valid **Punjab domicile**.\n\n**Q4: What is the test fee?**\nThe application test fee is **Rs. 460** (Rs. 450 fee + Rs. 10 service charges) payable via 1Link 1Bill.\n\n**Q5: When will the NTS test be held?**\nThe screening test is tentatively scheduled for **30 October 2026**."
    ]
  },
  {
    slug: 'shifa-university-pharmd-admissions-2026',
    title: 'Shifa University PharmD Admissions 2026 – Apply Before October 15',
    category: 'admissions',
    organization: 'Shifa Tameer-e-Millat University (STMU) Islamabad',
    jobType: 'Doctor of Pharmacy (Pharm. D) – Class of 2031 (Project Code: 2608102)',
    location: 'Shifa College of Pharmaceutical Sciences, Islamabad',
    qualification: 'FSc Pre-Medical or IBCC Equivalent with Minimum 60% Marks (PCP Guidelines)',
    salary: 'Merit & Need-Based Financial Assistance Available for Enrolled Students',
    experience: 'Session 2026–2031 (5-Year Professional Degree Program)',
    positions: 'Doctor of Pharmacy (Pharm. D) 5-Year Professional Degree',
    lastDate: '2026-10-15',
    noDeadline: false,
    publishDate: '2026-10-10',
    officialLink: 'https://portal.nts.org.pk/Alldetail/MTAxMjk1',
    applyLink: 'https://portal.nts.org.pk/register',
    isVerified: true,
    featured: true,
    logoInitial: 'STMU',
    featuredImage: '/images/shifa-university-pharmd-admissions-2026.jpg',
    imageAlt: 'Shifa University PharmD Admissions 2026 Shifa College of Pharmaceutical Sciences Class of 2031 NTS Test CareerDost',
    excerpt: 'Shifa Tameer-e-Millat University Islamabad invites online applications for Doctor of Pharmacy (Pharm. D) Class of 2031. Admission test conducted by NTS. Deadline: 15 October 2026. Minimum 60% in FSc Pre-Medical required.',
    seoTitle: 'Shifa University PharmD Admissions 2026 – Apply Before October 15 | CareerDost',
    metaDescription: 'Shifa Tameer-e-Millat University announces Doctor of Pharmacy (Pharm. D) Class of 2031 admissions. Admission test via NTS. Deadline: 15 October 2026. Check eligibility and fee details.',
    focusKeyword: 'Shifa University PharmD Admissions 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/shifa-university-pharmd-admissions-2026',
    ogTitle: 'Shifa University PharmD Admissions 2026 – Apply Before October 15',
    ogDescription: '5-Year Doctor of Pharmacy (Pharm.D) admissions at Shifa College of Pharmaceutical Sciences Islamabad. Class of 2031. Apply online via NTS by 15 October 2026.',
    schemaType: 'Article',
    content: [
      "### Official Admission Notice: Doctor of Pharmacy (Pharm. D) Class of 2031",
      "**Shifa Tameer-e-Millat University (STMU), Islamabad**, has announced admissions for its prestigious **Doctor of Pharmacy (Pharm. D) Program — Class of 2031** at the **Shifa College of Pharmaceutical Sciences (SCPS)**.",
      "The pre-admission entrance examination is administered in collaboration with the **National Testing Service (NTS)** under **Project Code: 2608102**. Online registrations are currently open and will conclude on **15 October 2026**.",
      "### Quick Summary Table",
      "- **University:** Shifa Tameer-e-Millat University (STMU) Islamabad\n- **College:** Shifa College of Pharmaceutical Sciences (SCPS)\n- **Degree Awarded:** Doctor of Pharmacy (Pharm. D)\n- **Graduating Batch:** **Class of 2031** (5-Year Professional Degree)\n- **Accreditation:** Pharmacy Council of Pakistan (PCP) & Higher Education Commission (HEC)\n- **Application Deadline:** **15 October 2026**\n- **Tentative Admission Test Date:** **8 November 2026**\n- **NTS Application Processing Fee:** **Rs. 5,300 + Rs. 10 Service Charges = Rs. 5,310/=**\n- **Testing Agency:** National Testing Service (NTS)\n- **Official NTS Project Link:** [portal.nts.org.pk/Alldetail/MTAxMjk1](https://portal.nts.org.pk/Alldetail/MTAxMjk1)\n- **Apply Online Portal:** [portal.nts.org.pk/register](https://portal.nts.org.pk/register)",
      "### Crucial Distinction: Admission Test Registration vs Final Admission Selection",
      "> [!WARNING]\n> **Important Academic Advisory:** Candidates must recognize that **registration for the NTS Admission Test does NOT guarantee final admission selection at Shifa University.**\n>\n> Appearing in the NTS entry test is the initial mandatory screening requirement. Final admission selection will be conducted by STMU based on aggregate merit (Matric, F.Sc, Entry Test score, and formal interview).",
      "### Program Overview & Academic Eligibility Criteria",
      "> [!IMPORTANT]\n> - **Minimum Qualification:** Higher Secondary School Certificate (HSSC / F.Sc Pre-Medical) or equivalent with Biology, Chemistry, and Physics from a recognized Pakistani board, OR an equivalent foreign qualification (A-Levels / American High School Diploma) with an official IBCC Equivalence Certificate.\n> - **Minimum Marks:** At least **60% aggregate marks** in F.Sc Pre-Medical in accordance with Pharmacy Council of Pakistan (PCP) regulations.\n> - **Program Duration:** **5 Academic Years** of comprehensive didactic instruction, advanced laboratory training, and clinical pharmacy rotations at Shifa International Hospital Islamabad.",
      "### Application Processing Fee & Payment Mode",
      "- The non-refundable application test processing fee is **Rs. 5,300 + Rs. 10 service charges (Total Rs. 5,310/=)**.\n- Fee payment can be executed through 1Link 1Bill using:\n  - Mobile Banking apps (Easypaisa, JazzCash, Bank apps)\n  - 1Link participating ATM kiosks\n  - Over-the-counter banking branches across Pakistan",
      "### Admission Test Structure & Schedule",
      "- The NTS Admission Test is tentatively scheduled for **Sunday, 8 November 2026**.\n- The test syllabus comprises Biology, Chemistry, Physics, English, and General Aptitude matching the standard F.Sc Pre-Medical curriculum.\n- Roll number slips indicating assigned test centers (Islamabad and major regional cities) will be issued online a week prior to the examination date.",
      "### Step-by-Step Online Registration Guide",
      "1. Visit the NTS project page: `https://portal.nts.org.pk/Alldetail/MTAxMjk1`.\n2. Click on **Apply Now** to open the registration system (`portal.nts.org.pk/register`).\n3. Register with your CNIC/B-Form and password.\n4. Enter personal information, parent details, and educational background.\n5. Select **Doctor of Pharmacy (Pharm. D) — Class of 2031**.\n6. Generate the 1Link 1Bill payment invoice and pay the fee of Rs. 5,310.\n7. Verify payment confirmation on your dashboard and download your application summary before **15 October 2026**.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the deadline to apply for Shifa University PharmD admissions?**\nThe application deadline on the NTS portal is **15 October 2026**.\n\n**Q2: What is the minimum percentage required for PharmD eligibility?**\nCandidates must have secured at least **60% marks in F.Sc Pre-Medical** or equivalent.\n\n**Q3: When will the admission test take place?**\nThe admission test is tentatively scheduled for **8 November 2026**.\n\n**Q4: What is the application fee amount?**\nThe application test fee is **Rs. 5,310** (Rs. 5,300 fee + Rs. 10 service charges).\n\n**Q5: Is Shifa College of Pharmaceutical Sciences recognized by the Pharmacy Council of Pakistan?**\nYes. SCPS is fully recognized by the Pharmacy Council of Pakistan (PCP) and the Higher Education Commission (HEC)."
    ]
  },
  {
    slug: 'nts-gat-subject-2026-vi',
    title: 'NTS GAT Subject 2026-VI Registration Open – Last Date October 19',
    category: 'admissions',
    organization: 'National Testing Service (NTS) Pakistan',
    jobType: 'Graduate Assessment Test – GAT Subject 2026-VI (Project Code: 2611906)',
    location: 'Major Nationwide Cities Across Pakistan',
    qualification: '18-Year Education (MS / M.Phil) or 16-Year Relevant Degree for PhD Admissions & Assessment',
    salary: 'Scorecard Valid for 2 Years for PhD Admissions Nationwide',
    experience: 'Session 2026-VI Applicants',
    positions: 'Standardized Subject Test for PhD Admission in Various Disciplines',
    lastDate: '2026-10-19',
    noDeadline: false,
    publishDate: '2026-10-10',
    officialLink: 'https://portal.nts.org.pk/Alldetail/MTAxMzUy',
    applyLink: 'https://portal.nts.org.pk/register',
    isVerified: true,
    featured: true,
    logoInitial: 'GAT',
    featuredImage: '/images/nts-gat-subject-2026-vi.jpg',
    imageAlt: 'NTS GAT Subject 2026-VI Registration Open Apply Online Last Date 19 October National Testing Service CareerDost',
    excerpt: 'NTS has opened online registrations for Graduate Assessment Test GAT Subject 2026-VI. Required for PhD admissions nationwide. Fee: Rs. 2,210. Test Date: 15 November 2026. Apply before 19 October 2026.',
    seoTitle: 'NTS GAT Subject 2026-VI Registration Open – Last Date October 19 | CareerDost',
    metaDescription: 'Register online for NTS GAT Subject 2026-VI for PhD admissions. Registration closes 19 October 2026. Test date: 15 November 2026. Check test format, fee, and disciplines.',
    focusKeyword: 'NTS GAT Subject 2026-VI',
    canonicalUrl: 'https://careerdost.blog/jobs/nts-gat-subject-2026-vi',
    ogTitle: 'NTS GAT Subject 2026-VI Registration Open – Last Date October 19',
    ogDescription: 'National Testing Service announces GAT Subject 2026-VI test for PhD admissions. Score valid for 2 years. Online application open until 19 October 2026.',
    schemaType: 'Article',
    content: [
      "### Official Announcement: GAT Subject 2026-VI Registrations",
      "The **National Testing Service (NTS) Pakistan** has formally commenced online registrations for the **Graduate Assessment Test — GAT Subject 2026-VI (Project Code: 2611906)**.",
      "The GAT Subject test is the national standardized assessment required by the Higher Education Commission (HEC) and recognized universities across Pakistan for **admission into PhD degree programs** and specialized academic recruitment.",
      "### Critical Distinction: GAT Subject vs GAT General",
      "> [!WARNING]\n> **Important Candidate Advisory:** Students must confirm the exact test requirement of their target university before applying:\n>\n> - **GAT General:** Designed for **MS / M.Phil admissions** and assesses general aptitude across Verbal, Quantitative, and Analytical Reasoning.\n> - **GAT Subject:** Designed specifically for **PhD admissions** and assesses advanced subject-specific knowledge in the candidate's chosen discipline (70% subject specialization).\n>\n> Do not register for GAT Subject if your university requires GAT General.",
      "### Quick Summary Table",
      "- **Testing Authority:** National Testing Service (NTS) Pakistan\n- **Project Title:** Graduate Assessment Test (GAT Subject 2026-VI)\n- **Project Code:** 2611906\n- **Target Audience:** Prospective PhD Scholars & Postgraduate Applicants\n- **Registration Deadline:** **19 October 2026**\n- **Tentative Written Test Date:** **15 November 2026**\n- **Registration Fee:** **Rs. 2,200 + Rs. 10 Service Charges = Rs. 2,210/=**\n- **Scorecard Validity:** **2 Years**\n- **Official NTS Portal Link:** [portal.nts.org.pk/Alldetail/MTAxMzUy](https://portal.nts.org.pk/Alldetail/MTAxMzUy)\n- **Online Registration:** [portal.nts.org.pk/register](https://portal.nts.org.pk/register)",
      "### Test Pattern & Examination Structure",
      "The GAT Subject examination comprises **100 multiple-choice questions (MCQs)** with a total duration of **120 minutes (2 Hours)**, formatted as follows:\n\n1. **Subject Specialization:** **70%** (covers advanced core undergraduate and master's level concepts in the chosen academic field)\n2. **English (Verbal Reasoning):** **15%** (academic vocabulary, advanced sentence completion, and critical reading comprehension)\n3. **Analytical Reasoning:** **15%** (logical deduction, analytical problem solving, and analytical data inference)",
      "### Academic Disciplines Offered in GAT Subject",
      "GAT Subject is offered across numerous academic faculties, including:\n- **Biological Sciences:** Biochemistry, Biotechnology, Botany, Microbiology, Molecular Biology, Zoology, Environmental Sciences\n- **Physical Sciences:** Chemistry, Computer Science, Information Technology, Mathematics, Physics, Statistics\n- **Engineering & Technology:** Electrical Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering\n- **Social Sciences & Humanities:** Economics, Management Sciences, Education, English (Literature/Linguistics), International Relations, Political Science, Psychology, Sociology\n- **Medical & Pharmacy:** Pharmacy (Pharmacology, Pharmaceutics), Veterinary Sciences",
      "### Minimum Qualifying Score & Validity",
      "> [!IMPORTANT]\n> - **Passing Threshold:** A minimum score of **60% (cumulative percentile)** is mandatory to qualify the GAT Subject test for HEC-recognized PhD program enrollment.\n> - **Validity:** The official GAT Subject score card remains valid for **2 years** from the test date.",
      "### Step-by-Step Online Registration Process",
      "1. Open the official NTS candidate registration portal: [portal.nts.org.pk/Alldetail/MTAxMzUy](https://portal.nts.org.pk/Alldetail/MTAxMzUy).\n2. Click on **Apply Now** or log into your candidate account on `portal.nts.org.pk/register`.\n3. Enter your educational details (16-year BS / 18-year MS/MPhil credentials).\n4. Select your specific **GAT Subject** matching your postgraduate academic qualification.\n5. Select your preferred test city (e.g., Islamabad, Lahore, Karachi, Peshawar, Quetta, Multan, Faisalabad).\n6. Generate the 1Link 1Bill payment slip and note down the consumer number.\n7. Pay the fee of Rs. 2,210 via mobile banking apps, ATM, or bank counter before **19 October 2026**.\n8. Verify payment confirmation on your NTS dashboard.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to register for GAT Subject 2026-VI?**\nThe deadline to submit online registration is **19 October 2026**.\n\n**Q2: When will the test take place?**\nThe tentative test date is **Sunday, 15 November 2026**.\n\n**Q3: What is the registration fee for GAT Subject?**\nThe fee is **Rs. 2,210** (Rs. 2,200 test fee + Rs. 10 service charges).\n\n**Q4: What is the qualifying score for PhD admission?**\nA minimum of **60% marks** is required to qualify GAT Subject for PhD admissions per HEC rules.\n\n**Q5: How long is the GAT Subject score valid?**\nThe GAT Subject score card is valid for **2 years** from the date of the test."
    ]
  }
]

export function publish() {
  console.log('=== PUBLISHING 5 FRESH OCT 10 ARTICLES ON CAREERDOST ===\n')

  // 1. Local SQLite update
  const db = new Database('careerdost.sqlite')

  const catMap = {
    scholarships: 'Scholarships',
    admissions: 'Admissions',
    internships: 'Internships',
    results: 'Results',
    exams: 'Exams',
    'daily-updates': 'Exams',
    'government-jobs': 'Government Jobs'
  }

  for (const item of oct10Articles) {
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
  // 1. SBBU Merit Lists (artId: 325, updId: 225)
  // 2. NTS NAT/GAT Roll Number Slips (artId: 324, updId: 224)
  // 3. Punjab Healthcare Jobs (artId: 323, updId: 223)
  // 4. Shifa PharmD Admissions (artId: 322, updId: 222)
  // 5. GAT Subject Registration (artId: 321, updId: 221)
  const idMap = [
    { slug: 'sbbu-ms-mphil-mba-merit-list-2027', artId: 325, updId: 225 },
    { slug: 'nts-nat-gat-roll-number-slip-2026', artId: 324, updId: 224 },
    { slug: 'punjab-ophthalmology-college-jobs-2026', artId: 323, updId: 223 },
    { slug: 'shifa-university-pharmd-admissions-2026', artId: 322, updId: 222 },
    { slug: 'nts-gat-subject-2026-vi', artId: 321, updId: 221 }
  ]

  for (let i = 0; i < idMap.length; i++) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(8000 + i, idMap[i].slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(8000 + i, idMap[i].slug)
  }

  for (const m of idMap) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(m.artId, m.slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(m.updId, m.slug)
  }
  console.log('Updated priority IDs in local SQLite.')

  // 2. Prepend to src/data/listings.js
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')
  
  const formattedItems = oct10Articles.map(a => {
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
    
    if (!listingsCode.includes('sbbu-ms-mphil-mba-merit-list-2027')) {
      listingsCode = listingsCode.slice(0, insertPos) + prependedCode + listingsCode.slice(insertPos)
      listingsCode = listingsCode.replace(/Updated:\s*\d{4}-\d{2}-\d{2}/, 'Updated: 2026-10-10')
      fs.writeFileSync(listingsPath, listingsCode, 'utf8')
      console.log('Successfully updated src/data/listings.js with 5 new articles!')
    } else {
      console.log('src/data/listings.js already contains new articles.')
    }
  }

  // 3. Update scripts/generate_sitemap.js
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')
  if (!sitemapScript.includes('sbbu-ms-mphil-mba-merit-list-2027')) {
    const insertPattern = 'const publishedDailyUpdates = [\n'
    const newSitemapEntries = `  { slug: 'sbbu-ms-mphil-mba-merit-list-2027', date: '2026-10-10' },\n  { slug: 'nts-nat-gat-roll-number-slip-2026', date: '2026-10-10' },\n  { slug: 'punjab-ophthalmology-college-jobs-2026', date: '2026-10-10' },\n  { slug: 'shifa-university-pharmd-admissions-2026', date: '2026-10-10' },\n  { slug: 'nts-gat-subject-2026-vi', date: '2026-10-10' },\n`
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + newSitemapEntries)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('Updated scripts/generate_sitemap.js with new slugs.')
  }
}

if (process.argv[1] && process.argv[1].endsWith('publish_oct10_articles.js')) {
  publish()
}
