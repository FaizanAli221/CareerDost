import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

export const oct7Articles = [
  {
    slug: 'punjab-sti-jobs-2026-27',
    title: 'Punjab STI Jobs 2026–27 – School Teacher Interns Apply Online',
    category: 'internships',
    organization: 'School Education Department, Government of the Punjab (SED / PESRP)',
    jobType: 'Temporary School Teacher Internship (Session 2026–2027)',
    location: 'All 36 Districts of Punjab (Tehsil-Specific Primary, Elementary & High Schools)',
    qualification: 'Intermediate (FA/FSc) for Primary | BA/BSc for Elementary | BS/MA/MSc for High Schools',
    salary: 'Rs. 38,000 (Primary) | Rs. 40,000 (Elementary) | Rs. 45,000 (High / Higher Sec) Per Month',
    experience: 'Fresh Graduates / Master’s (B.Ed / M.Ed Carries Merit Preference)',
    positions: 'School-Wise Internships Across Punjab (Vacancies visible inside school portal)',
    lastDate: '2026-10-18',
    noDeadline: false,
    publishDate: '2026-10-07',
    officialLink: 'https://sti.pesrp.edu.pk/',
    applyLink: 'https://sti.pesrp.edu.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'STI',
    featuredImage: '/images/punjab-sti-2026-27.jpg',
    imageAlt: 'Punjab STI Jobs 2026-27 School Teacher Interns Apply Online Before 18 October CareerDost',
    excerpt: 'Punjab School Education Department opens online applications for School Teacher Interns (STI) 2026–27. Monthly stipends: Primary Rs 38,000, Elementary Rs 40,000, High Rs 45,000. Apply online at sti.pesrp.edu.pk by 18 October 2026.',
    seoTitle: 'Punjab STI Jobs 2026–27 – School Teacher Interns Apply Online | CareerDost',
    metaDescription: 'Punjab STI Jobs 2026–27: Apply online for School Teacher Internships at sti.pesrp.edu.pk before 18 October 2026. Verified monthly stipends (Rs 38,000 to Rs 45,000), schedule, merit formula, and eligibility.',
    focusKeyword: 'Punjab STI Jobs 2026-27',
    canonicalUrl: 'https://careerdost.blog/jobs/punjab-sti-jobs-2026-27',
    ogTitle: 'Punjab STI Jobs 2026–27 – School Teacher Interns Apply Online',
    ogDescription: 'Online registration is open for Punjab School Teacher Internship (STI) 2026–27. Verified stipend rates, Tehsil-level eligibility, preliminary merit list dates, and official application process.',
    schemaType: 'JobPosting',
    content: [
      "### Official Announcement & Program Overview",
      "The **School Education Department (SED), Government of the Punjab**, under the **Punjab Education Sector Reforms Programme (PESRP)**, has officially initiated the online recruitment cycle for the **School Teacher Internship (STI) Program 2026–27**.",
      "The program engages educated youth as temporary **School Teacher Interns** to address teacher shortages in government schools across all 36 districts of Punjab. Selected interns will be placed in **Primary, Elementary, High, and Higher Secondary Schools** for the duration of the current academic session.",
      "Online applications must be submitted directly through the centralized official STI portal at `https://sti.pesrp.edu.pk/` on or before the closing deadline of **18 October 2026 (Wednesday) up to 11:59 P.M.**",
      "### Quick Summary Table",
      "- **Administering Authority:** School Education Department (SED) / PESRP, Punjab\n- **Program Title:** School Teacher Internship (STI) Program 2026–27\n- **Target Institutions:** Primary, Elementary, High, and Higher Secondary Schools\n- **Placement Scope:** All 36 Districts of Punjab (Strictly within candidate's own Tehsil)\n- **Online Application Deadline:** **18 October 2026 (Wednesday) – 11:59 PM**\n- **Preliminary Merit List:** **23 October 2026** (On School Notice Boards)\n- **Grievance Redressal:** **26–27 October 2026** (Tehsil Committee by DEO)\n- **Interview Schedule:** **29–30 October 2026**\n- **Final Merit List Display:** **31 October 2026 (10:00 AM)**\n- **Issuance of Agreement Letters:** **2 November 2026**\n- **Internship Engagement Period:** **3 November 2026 to 31 May 2027**\n- **Official Application Portal:** [sti.pesrp.edu.pk](https://sti.pesrp.edu.pk/)\n- **Official Helpline:** 042-111-11-20-20 | Email: `Support@pesrp.edu.pk`",
      "### Important Notice on Total Vacancy Figures",
      "> [!IMPORTANT]\n> **Official Vacancy Clarification:** Multiple unofficial blogs and social media pages report speculative figures such as *\"25,000 vacancies\"* or *\"30,000 seats.\"*\n>\n> The School Education Department allocates vacancies on an **actual need basis per school**, not through a single centralized arbitrary total. Every government school lists its specific vacant STI spots directly inside the portal (`sti.pesrp.edu.pk/available_internships`). Applicants must search by their district and tehsil to view the verified vacancies in their immediate neighborhood.",
      "### Verified Monthly Stipend Breakdown",
      "Stipends are fixed by the Government of the Punjab according to the school category and instructional tier:\n\n| Internship Category | School Placement Level | Prescribed Monthly Stipend | Payment Disbursal Mode |\n| :--- | :--- | :--- | :--- |\n| **Primary STI** | Government Primary Schools (GPS / GGPS) | **Rs. 38,000 / month** | Monthly Bank Disbursal |\n| **Elementary STI** | Government Elementary Schools (GES / GGES) | **Rs. 40,000 / month** | Monthly Bank Disbursal |\n| **High & Higher Secondary STI** | Government High / Higher Sec Schools (GHS / GHSS) | **Rs. 45,000 / month** | Monthly Bank Disbursal |\n\n*Note: No Travelling Allowance or Daily Allowance (TA/DA) is admissible for applying, appearing in interviews, or joining duties.*",
      "### Nature of Engagement & Contract Duration",
      "> [!NOTE]\n> **Temporary Internship Notice:** School Teacher Intern positions are strictly **temporary, contractual internships** running from **3 November 2026 to 31 May 2027**.\n> \n> Engagement concludes automatically upon completion of the academic session or when a regular teacher is posted by the department. This internship does not confer any legal right, title, or claim to regular government employment or service regularization under the Punjab Civil Servants Act.",
      "### Strict Eligibility Criteria",
      "1. **Tehsil Residence Rule (Mandatory):** Candidates are eligible to apply **only for schools situated within their own Tehsil** (permanent address tehsil as verified on CNIC). Applications submitted for schools outside the candidate’s residential tehsil will be rejected during preliminary verification.\n2. **Gender Allocation Rule:** Male candidates can apply only to Boys' schools; Female candidates can apply only to Girls' schools.\n3. **Age Limits (Calculated as of 18 October 2026):**\n   - **Male Candidates:** 20 to 50 Years\n   - **Female Candidates:** 20 to 55 Years\n4. **Academic Qualifications:**\n   - **Primary Level:** Minimum Intermediate (FA / F.Sc / I.Com / ICS or 12 years HSSC equivalent) with at least 2nd Division.\n   - **Elementary Level:** Minimum Bachelor's Degree (BA / B.Sc / B.Com or 14 years equivalent) with at least 2nd Division.\n   - **High & Higher Secondary Level:** Minimum Master's Degree (MA / M.Sc or 16-Year BS 4-Year degree in relevant disciplines: English, Urdu, Mathematics, Physics, Chemistry, Biology, Computer Science, Pakistan Studies, Islamiyat) with at least 2nd Division.\n5. **Professional Qualifications:** Candidates with B.Ed, M.Ed, or Associate Degree in Education (ADE) will receive additional marks in the merit calculation formula.",
      "### Merit Calculation Formula & Selection Procedure",
      "- **Academic Weightage:** Marks obtained across Matric, Intermediate, Graduation, and Master's are calculated on percentage weightage set by the School Education Department.\n- **Professional Teaching Qualification:** Additional bonus marks are granted for verified B.Ed / M.Ed qualifications from HEC-recognized universities.\n- **Interview Score:** Shortlisted applicants appear before the Tehsil-Level School Management Committee for interview assessment covering subject command, communication, and teaching pedagogical approach.\n- **Merit Lists:** Preliminary lists are pasted on school notice boards on **23 October 2026**. Grievances can be lodged before the DEO Tehsil Committee on **26–27 October 2026**. Final merit lists will be published on **31 October 2026 at 10:00 AM**.",
      "### Step-by-Step Online Application Procedure",
      "Follow these verified steps to submit your application on the official portal:\n1. Visit the official portal: [sti.pesrp.edu.pk](https://sti.pesrp.edu.pk/).\n2. Click on **Register** at the top right corner.\n3. Enter your valid 13-digit CNIC number, mobile number, and active email address.\n4. Log in and navigate to the **Profile Builder** section. Complete all 4 tabs:\n   - Personal Information\n   - Academics (Matriculation, Intermediate, Graduation, Master's)\n   - Work Experience (if any)\n   - Professional Teaching Qualification (B.Ed / M.Ed / ADE)\n5. Review your profile data thoroughly to ensure accuracy.\n6. Click on **Available Internships** to browse schools within your Tehsil.\n7. Select the school and grade level matching your academic qualifications and click **Apply**.\n8. Track your application status using the **Track Application** module before **18 October 2026 at 11:59 PM**.",
      "### Official Contact & Helpline Support",
      "- **Official Portal:** [https://sti.pesrp.edu.pk/](https://sti.pesrp.edu.pk/)\n- **Official Policy Document:** [sti.pesrp.edu.pk/assets/user/dist/images/sti_policy.pdf](https://sti.pesrp.edu.pk/assets/user/dist/images/sti_policy.pdf)\n- **Helpline Phone:** 042-111-11-20-20\n- **Email Support:** Support@pesrp.edu.pk\n- **Administering Authority:** School Education Department Punjab, Lahore",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the last date to apply for Punjab STI 2026–27?**\nThe deadline to apply online through `sti.pesrp.edu.pk` is strictly **18 October 2026 (Wednesday) up to 11:59 P.M.**\n\n**Q2: What is the monthly stipend for School Teacher Interns?**\nStipends are fixed by the Punjab Government: Rs. 38,000 for Primary level, Rs. 40,000 for Elementary level, and Rs. 45,000 for High / Higher Secondary level.\n\n**Q3: Can I apply for schools located outside my residential Tehsil?**\nNo. According to STI rules, candidates can apply only to schools situated within their permanent address Tehsil as listed on their CNIC.\n\n**Q4: Is there an application fee for the STI program?**\nNo. Applying online through the official PESRP STI portal is 100% free of charge.\n\n**Q5: Can male candidates apply for vacancies in girls' schools?**\nNo. Male candidates can apply only to boys' schools, and female candidates can apply only to girls' schools.\n\n**Q6: What is the duration of the internship?**\nThe internship runs from 3 November 2026 until 31 May 2027. It is purely temporary and does not guarantee permanent government employment."
    ]
  },
  {
    slug: 'nums-spring-2027-admissions',
    title: 'NUMS Spring 2027 Admissions Open – PhD, MPhil, MS, MSN & More',
    category: 'admissions',
    organization: 'National University of Medical Sciences (NUMS)',
    jobType: 'Postgraduate Degree & Clinical Certification Admissions (Spring 2027 Intake)',
    location: 'NUMS Secretariat, The Mall, Rawalpindi / NUMS Constituent & Affiliated Institutes',
    qualification: 'MBBS / BDS / MPhil / MS / 16-Year BS / BSN Nursing (Program-Specific)',
    salary: 'Academic Admissions (Fee: Rs. 3,000 Regular / Rs. 5,000 Late)',
    experience: 'Fresh to Clinical / Teaching Experience (As per program requirements)',
    positions: 'Postgraduate Intake (PhD, MPhil, MS, MSc, MSN, Diplomas & Certifications)',
    lastDate: '2026-10-30',
    noDeadline: false,
    publishDate: '2026-10-07',
    officialLink: 'https://numspak.edu.pk/news-detail/admission-open-post-graduate-programs-spring-2027',
    applyLink: 'https://pgadmissions.numspak.edu.pk/forms/SignIn.aspx',
    isVerified: true,
    featured: true,
    logoInitial: 'NUMS',
    featuredImage: '/images/nums-spring-2027.jpg',
    imageAlt: 'NUMS Spring 2027 Postgraduate Admissions Open Apply Before 30 October CareerDost',
    excerpt: 'National University of Medical Sciences (NUMS) Rawalpindi opens online admissions for Spring 2027 session across PhD, MPhil, MS, MSc, MSN, Diploma in Cardiology, and Clinical Certifications. Regular deadline is 30 October 2026.',
    seoTitle: 'NUMS Spring 2027 Admissions Open – PhD, MPhil, MS, MSN & More | CareerDost',
    metaDescription: 'NUMS Spring 2027 Admissions announced: PhD, MPhil, MS Clinical Psychology, MHPE, MSN & Diploma in Cardiology. Check program-specific eligibility, entry test dates, and apply online at pgadmissions.numspak.edu.pk.',
    focusKeyword: 'NUMS Spring 2027 Admissions',
    canonicalUrl: 'https://careerdost.blog/jobs/nums-spring-2027-admissions',
    ogTitle: 'NUMS Spring 2027 Admissions Open – PhD, MPhil, MS, MSN & More',
    ogDescription: 'Apply online for NUMS Postgraduate Spring 2027 programs before 30 October 2026. Complete eligibility, fees, entry test schedule & official admission portal.',
    schemaType: 'EducationalOccupationalProgram',
    content: [
      "### Official Admission Announcement & Session Details",
      "The **National University of Medical Sciences (NUMS)**, Pakistan’s leading federally chartered military and public medical university located in Rawalpindi, has officially opened online admissions for **Postgraduate Degree Programs, Diplomas, and Clinical Certifications** for the **Spring 2027** academic session.",
      "Admissions opened formally on **6 October 2026**. Qualified medical practitioners, dental surgeons, allied health specialists, and natural science graduates can apply across diverse specializations spanning PhD, MPhil, MS, MSc, and specialized clinical credentials.",
      "Applications must be completed exclusively via the official NUMS Postgraduate Admission Portal (`pgadmissions.numspak.edu.pk`). Hardcopy forms dispatched via courier or post will not be accepted.",
      "### Quick Summary Table",
      "- **Awarding University:** National University of Medical Sciences (NUMS), Rawalpindi\n- **Academic Intake:** Spring Semester 2027\n- **Admissions Opening Date:** 6 October 2026\n- **Regular Application Deadline:** **30 October 2026 (Friday) at 4:00 PM PKT**\n- **Regular Application Processing Fee:** **Rs. 3,000 (Non-refundable)**\n- **Late Registration Deadline:** **4 November 2026 (Wednesday) at 4:00 PM PKT**\n- **Late Application Processing Fee:** **Rs. 5,000 (Non-refundable)**\n- **NUMS Entry Test Schedule:** **17–18 November 2026**\n- **Mode of Submission:** 100% Online via `pgadmissions.numspak.edu.pk`\n- **Official Admission Portal:** [pgadmissions.numspak.edu.pk](https://pgadmissions.numspak.edu.pk/forms/SignIn.aspx)\n- **Official Information Desk:** 051-9270686 | Email: `pg.admissions@numspak.edu.pk`",
      "### Comprehensive List of Offered Postgraduate Programs",
      "NUMS offers advanced academic and clinical programs grouped across the following specialized categories:\n\n1. **Doctor of Philosophy (PhD Programs):**\n   - PhD Biochemistry\n   - PhD Molecular Medicine\n   - PhD Pharmacology\n   - PhD Public Health\n   - PhD Dental Materials\n\n2. **Master of Philosophy (MPhil Programs):**\n   - MPhil Anatomy\n   - MPhil Physiology\n   - MPhil Biochemistry\n   - MPhil Pharmacology\n   - MPhil Molecular Medicine\n   - MPhil Community Medicine\n   - MPhil Oral Pathology\n   - MPhil Chemical Pathology\n   - MPhil Microbiology\n   - MPhil Hematology\n   - MPhil Psychology\n\n3. **Master of Science & Clinical Master’s Programs:**\n   - Masters in Health Professions Education (MHPE)\n   - MS Clinical Psychology\n   - MS Transfusion Medicine\n   - MSc Cardiac Anesthesia\n   - Master of Science in Nursing (MSN – *Exclusively for female candidates*)\n\n4. **Postgraduate Diplomas & Clinical Certifications:**\n   - Diploma in Cardiology (Dip Card)\n   - Clinical Certification in Interventional Radiology\n   - Clinical Certification in Hybrid Imaging (PET-CT Scan)",
      "### Program-Specific Eligibility Criteria & Test Requirements",
      "> [!IMPORTANT]\n> **CRITICAL TEST NOTICE:** Admission test and qualification requirements are program-specific. Do not assume every program follows the same admission test or criteria. Review your specific discipline carefully below:\n>\n> - **PhD Programs:** Candidates must hold an MS/MPhil/FCPS or 18-year equivalent degree in the relevant discipline from an HEC/PMDC-recognized institution with a minimum CGPA of 3.0 out of 4.0 (or first division). Applicants must present a valid GAT Subject / GRE Subject test score (minimum 60% percentile) or qualify the NUMS PhD Subject Entrance Test with at least 70% aggregate marks.\n> - **MPhil Basic Medical Sciences:** MBBS or BDS degree registered with PMDC/PMC with completed one-year house job. Must qualify the NUMS Entry Test or possess a valid GAT General score (minimum 50% cumulative).\n> - **MPhil Biological & Psychological Sciences:** 16 years of education (BS 4-Year or MSc) in relevant discipline with minimum 2.5/4.0 CGPA or 50% marks, plus qualifying the NUMS Entry Test / GAT General (50%).\n> - **MS Clinical Psychology:** 16-year BS Psychology or MSc Applied Psychology from an HEC-recognized university with at least 2.50 CGPA or 50% marks, followed by the NUMS departmental written test and interview.\n> - **MHPE:** MBBS or BDS with valid PMDC registration and minimum 2 years of teaching or clinical experience in a recognized healthcare institute.\n> - **MSN (Master of Science in Nursing):** 4-Year BSN or Post-RN BSN with valid Pakistan Nursing & Midwifery Council (PN&MC) registration and minimum 1 year of clinical experience post-graduation (*Female applicants only*).\n> - **Diploma in Cardiology & MSc Cardiac Anesthesia:** MBBS with valid PMDC registration and one-year completed house job with requisite clinical rotations.\n> - **Clinical Certifications in Interventional Radiology & Hybrid Imaging:** MBBS with FCPS Part-I / completed residency or post-fellowship clinical training in Radiology or relevant imaging field.",
      "### Important Academic & Admission Schedule",
      "- **Admissions Opened:** 6 October 2026\n- **Regular Application Deadline:** 30 October 2026 (4:00 PM PKT)\n- **Late Fee Application Deadline:** 4 November 2026 (4:00 PM PKT)\n- **NUMS Entry Test Conducted:** 17 and 18 November 2026\n- **Departmental Interviews:** Early December 2026\n- **Display of Merit Lists:** Mid-December 2026\n- **Commencement of Classes:** Spring Semester 2027 (February 2027)",
      "### Application Fee Structure & Payment Modes",
      "- **Regular Application Fee:** Rs. 3,000 (Non-refundable)\n- **Late Registration Fee:** Rs. 5,000 (Non-refundable)\n- **Payment Method:** The fee challan is automatically generated by the portal upon completing the online application form. It can be paid at any Habib Bank Limited (HBL) branch across Pakistan or through online banking / 1Link channels as indicated on the challan. Upload the paid receipt before final submission.",
      "### Step-by-Step Online Application Procedure",
      "1. Navigate to the official NUMS Postgraduate Admission portal: `https://pgadmissions.numspak.edu.pk/forms/SignIn.aspx`.\n2. Click on **New Registration** and create an account with your CNIC number, full name, and active email address.\n3. Log in to your candidate dashboard and fill in personal, contact, and academic details.\n4. Select your target program category (PhD, MPhil, MS, MSN, Diploma, or Certification).\n5. Generate and download the bank challan voucher.\n6. Pay the processing fee at HBL and upload the scanned copy of the paid challan.\n7. Upload scanned copies of all academic degrees, PMDC / PN&MC registration certificates, and house job certificates.\n8. Verify all entries, click **Submit Application**, and download your completed application PDF for your records.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the regular deadline for NUMS Spring 2027 Admissions?**\nThe regular deadline is **30 October 2026 at 4:00 PM PKT** with a fee of Rs. 3,000.\n\n**Q2: Can I apply after 30 October 2026?**\nYes. Late applications are accepted until **4 November 2026 at 4:00 PM PKT** with a late processing fee of Rs. 5,000.\n\n**Q3: Can male candidates apply for the MSN Nursing program?**\nNo. As per NUMS official criteria, the Master of Science in Nursing (MSN) program is open exclusively to female applicants.\n\n**Q4: When will the NUMS postgraduate admission tests be held?**\nThe NUMS entry test is scheduled for **17–18 November 2026** at designated test centers.\n\n**Q5: Are foreign degree holders eligible to apply?**\nYes, provided they submit an official Equivalence Certificate issued by the Higher Education Commission (HEC) or PMDC."
    ]
  },
  {
    slug: 'nums-mdcat-result-2026',
    title: 'NUMS MDCAT Result 2026 Announced – Check Result Online',
    category: 'results',
    organization: 'National University of Medical Sciences (NUMS)',
    jobType: 'National Medical & Dental College Admission Test (MDCAT NUMS 2026 Result)',
    location: 'Nationwide & Overseas Exam Centers / NUMS Islamabad',
    qualification: 'FSc Pre-Medical / A-Levels / Equivalent (MDCAT Candidates)',
    salary: 'Official Entrance Test Result (Pass / Score Card Download)',
    experience: 'Medical & Dental College Admission Applicants (Session 2026–2027)',
    positions: 'Official NUMS MDCAT Result & Merit Score Calculation',
    lastDate: '2026-10-31',
    noDeadline: true,
    publishDate: '2026-10-07',
    officialLink: 'https://numspak.edu.pk/',
    applyLink: 'https://mdcat.numspak.edu.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'NUMS',
    featuredImage: '/images/nums-mdcat-result-2026.jpg',
    imageAlt: 'NUMS MDCAT Result 2026 Announced Check Online Official Portal mdcat numspak edu pk CareerDost',
    excerpt: 'The National University of Medical Sciences (NUMS) has officially announced the NUMS MDCAT Result 2026. Candidates can now check their individual marks and download their official result card online at mdcat.numspak.edu.pk using their Roll Number and CNIC.',
    seoTitle: 'NUMS MDCAT Result 2026 Announced – Check Result Online | CareerDost',
    metaDescription: 'NUMS MDCAT Result 2026 announced! Step-by-step guide to check your official score card online at mdcat.numspak.edu.pk with Roll No and CNIC. Learn MBBS/BDS merit formula and upcoming admission steps.',
    focusKeyword: 'NUMS MDCAT Result 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/nums-mdcat-result-2026',
    ogTitle: 'NUMS MDCAT Result 2026 Announced – Check Result Online',
    ogDescription: 'NUMS MDCAT Result 2026 is live on mdcat.numspak.edu.pk. Securely check your individual score, download your result card, and review AMC and affiliated colleges admission next steps.',
    schemaType: 'Article',
    content: [
      "### Official Result Announcement Overview",
      "The **National University of Medical Sciences (NUMS)** has officially announced the results of the **NUMS MDCAT 2026** entrance examination.",
      "The nationwide test, conducted on **Sunday, 13 September 2026** across examination centers in Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad, Azad Jammu & Kashmir, and designated international overseas centers, determines admission eligibility for **MBBS and BDS** degree programs for the academic session **2026–2027**.",
      "Candidates can now view their subject-wise marks and download their official electronic result card directly through the official NUMS MDCAT result portal: `https://mdcat.numspak.edu.pk/`.",
      "### Candidate Privacy & Verification Commitment",
      "> [!NOTE]\n> **Strict Privacy Policy:** In compliance with national data privacy standards and ethical reporting guidelines, **CareerDost does NOT scrape, aggregate, or publish personal lists of candidates, CNICs, roll numbers, or individual marks.**\n>\n> Candidates must verify their individual results privately by entering their confidential credentials directly on the official NUMS verification portal.",
      "### Quick Summary Table",
      "- **Administering Authority:** National University of Medical Sciences (NUMS), Rawalpindi\n- **Examination Name:** NUMS MDCAT 2026 (Medical & Dental College Admission Test)\n- **Test Conduct Date:** Sunday, 13 September 2026\n- **Result Declaration Status:** **Officially Announced & Live Online**\n- **Result Retotaling Window:** Concluded on 6 October 2026 (4:00 PM PKT)\n- **Official Result Verification Portal:** [mdcat.numspak.edu.pk](https://mdcat.numspak.edu.pk/)\n- **Required Credentials:** Roll Number & 13-digit CNIC / B-Form / Passport Number\n- **Target Programs:** MBBS and BDS (Session 2026–2027)\n- **Constituent Medical College:** Army Medical College (AMC), Rawalpindi\n- **Affiliated Medical Colleges:** CMH Lahore, CMH Multan, QIMS Quetta, CMH Kharian, HITEC Taxila, KIMS Karachi, etc.",
      "### Step-by-Step Procedure to Check Your Result Online",
      "To check your individual score and download your official result card, follow these steps:\n1. Open the secure NUMS MDCAT result portal: [mdcat.numspak.edu.pk](https://mdcat.numspak.edu.pk/).\n2. Locate the search form on the homepage.\n3. Enter your **Examination Roll Number** in the specified field.\n4. Enter your **CNIC / Form-B / Passport Number** (enter digits without hyphens).\n5. Type the visual **CAPTCHA code** displayed on your screen.\n6. Click on the **Submit / Search Result** button.\n7. Your verified score card displaying subject-wise marks in Biology, Chemistry, Physics, and English, along with total marks and percentage, will be shown.\n8. Click on **Print / Download Result Card** and save a high-resolution PDF for your admission portfolio.",
      "### PMDC Minimum Passing Criteria & Aggregate Weightage",
      "As governed by Pakistan Medical & Dental Council (PMDC) and NUMS admission regulations, the following weightage applies to medical and dental college admissions:\n\n- **Minimum Passing Percentage:**\n  * **MBBS Programs:** Minimum **55% marks** in MDCAT\n  * **BDS Programs:** Minimum **50% marks** in MDCAT\n\n- **Official Merit Aggregate Formula:**\n  * **NUMS MDCAT Score:** **50% Weightage**\n  * **HSSC / F.Sc Pre-Medical (or A-Level Equivalence):** **40% Weightage**\n  * **SSC / Matriculation (or O-Level Equivalence):** **10% Weightage**\n\n$$\\text{Aggregate Percentage} = \\left(\\frac{\\text{MDCAT Marks}}{150} \\times 50\\right) + \\left(\\frac{\\text{F.Sc Marks}}{1100} \\times 40\\right) + \\left(\\frac{\\text{Matric Marks}}{1100} \\times 10\\right)$$",
      "### What Candidates Should Do Next: Admissions Roadmap",
      "1. **Download & Preserve Multiple Copies:** Print at least 3 color copies of your NUMS MDCAT 2026 Result Card. It will be required during physical interview and document verification.\n2. **Verify F.Sc Equivalence / Marks:** Ensure your official F.Sc Pre-Medical or IBCC Equivalence Certificate is attested and meets the minimum 60% eligibility requirement.\n3. **Monitor NUMS Admission Schedule:** Online admission preference forms for **Army Medical College (AMC) Rawalpindi** and affiliated military/private medical institutions will be announced shortly on `numspak.edu.pk`.\n4. **Document Preparation:** Prepare your Domicile certificate, CNIC/B-Form, Father's CNIC, Matric/F.Sc certificates, and verified passport-size photographs.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: Where can I check my NUMS MDCAT 2026 result?**\nYou can check your official result exclusively at `https://mdcat.numspak.edu.pk/`.\n\n**Q2: What information is needed to check the result?**\nYou need your assigned Exam Roll Number and your 13-digit CNIC, Form-B, or Passport number.\n\n**Q3: Can I apply for re-totaling now?**\nNo. The official window for submission of re-totaling applications closed on **6 October 2026 at 4:00 PM PKT**.\n\n**Q4: Is the NUMS MDCAT accepted for admission in provincial government medical colleges (e.g. UHS Punjab, DUHS Sindh)?**\nNo. Provincial government medical colleges admit candidates based on provincial MDCATs. The NUMS MDCAT is valid specifically for Army Medical College (AMC) and NUMS affiliated medical and dental colleges across Pakistan.\n\n**Q5: What is the minimum passing score required for MBBS?**\nPer PMDC regulations, candidates must secure at least 55% marks in NUMS MDCAT to be eligible for MBBS admissions."
    ]
  },
  {
    slug: 'shaikh-ayaz-university-admissions-2027',
    title: 'Shaikh Ayaz University Admissions 2027 – Only 3 Days Left to Apply',
    category: 'admissions',
    organization: 'The Shaikh Ayaz University (SAUS), Shikarpur',
    jobType: '1st Year BS (4-Year) & 3rd Year ADA/ADS (5th Semester) Admissions (Spring 2027)',
    location: 'Old National Highway, Near C&S College, Shikarpur, Sindh',
    qualification: 'Intermediate (HSSC) for 1st Year | Associate Degree (ADA/ADS/BSc) for 3rd Year (Minimum 20% Entry Test Score)',
    salary: 'Academic Admissions (Application Processing Fee: Rs. 2,500)',
    experience: 'Fresh Intermediate & Associate Degree Graduates',
    positions: 'Spring 2027 Undergraduate Intake (BS CS, IT, BBA, English, Mathematics & More)',
    lastDate: '2026-10-10',
    noDeadline: false,
    publishDate: '2026-10-07',
    officialLink: 'https://admissions.saus.edu.pk/admissions',
    applyLink: 'https://admissions.saus.edu.pk/apply',
    isVerified: true,
    featured: true,
    logoInitial: 'SAUS',
    featuredImage: '/images/shaikh-ayaz-university-admissions-2027.jpg',
    imageAlt: 'Shaikh Ayaz University Admissions 2027 Only 3 Days Left Apply Before 10 October CareerDost',
    excerpt: 'URGENT DEADLINE ALERT: Only 3 days left to apply for Spring 2027 Admissions at The Shaikh Ayaz University Shikarpur. Online application portal closes strictly on 10 October 2026. Pre-entry test scheduled for 7 November 2026. Merit formula: 80% Entry Test, 20% Intermediate.',
    seoTitle: 'Shaikh Ayaz University Admissions 2027 – Only 3 Days Left to Apply | CareerDost',
    metaDescription: 'Shaikh Ayaz University Shikarpur Spring 2027 Admissions close on 10 October 2026 (Only 3 Days Left!). Check verified 80/20 merit calculation, Rs2,500 fee, entry test schedule (7 Nov), and apply online.',
    focusKeyword: 'Shaikh Ayaz University Admissions 2027',
    canonicalUrl: 'https://careerdost.blog/jobs/shaikh-ayaz-university-admissions-2027',
    ogTitle: 'Shaikh Ayaz University Admissions 2027 – Only 3 Days Left to Apply',
    ogDescription: 'Last date to apply for Shaikh Ayaz University Shikarpur Spring 2027 Admissions is 10 October 2026. Entry test details, merit criteria, and online application portal.',
    schemaType: 'EducationalOccupationalProgram',
    content: [
      "### URGENT DEADLINE NOTICE: ONLY 3 DAYS REMAINING",
      "> [!WARNING]\n> **CRITICAL DEADLINE WARNING:** Online applications for Spring 2027 Admissions at **The Shaikh Ayaz University, Shikarpur** close strictly on **Saturday, 10 October 2026**.\n>\n> Today is 7 October 2026 — you have **ONLY 3 DAYS LEFT** to submit your electronic application form and fee voucher on `admissions.saus.edu.pk/apply`. Do not wait until the final evening when server traffic is heavy.",
      "### Overview of The Shaikh Ayaz University (SAUS) Admissions",
      "**The Shaikh Ayaz University (SAUS)**, chartered by the Government of Sindh and recognized by the Higher Education Commission (HEC), is an established public sector university located on the Old National Highway near C&S College, Shikarpur.",
      "The university is currently accepting online applications for its **Spring 2027** intake across First-Year 4-Year BS programs and Third-Year (5th semester) lateral entry programs for Associate Degree holders.",
      "### Quick Summary Table",
      "- **Institution:** The Shaikh Ayaz University (SAUS), Shikarpur\n- **Intake Session:** Spring 2027 Admissions\n- **Current Application Stage:** **Applications Open – Final 3 Days**\n- **Applications Opened:** 7 September 2026\n- **Final Application Deadline:** **10 October 2026**\n- **Application Processing Fee:** **Rs. 2,500 (Non-refundable)**\n- **Pre-Entry Test Date:** **7 November 2026 (Saturday)**\n- **Pre-Entry Test Time:** **09:00 AM PKT**\n- **Official Admission Schedule:** [admissions.saus.edu.pk/admissions](https://admissions.saus.edu.pk/admissions)\n- **Direct Application Portal:** [admissions.saus.edu.pk/apply](https://admissions.saus.edu.pk/apply)\n- **Admissions Office Contact:** (0726) 920367 | Email: `admissions@saus.edu.pk`",
      "### Verified Merit Calculation Formula (Official SAUS Criteria)",
      "> [!IMPORTANT]\n> The Directorate of Admissions has officially prescribed the merit calculation criteria for Spring 2027:\n>\n> #### 1. First Year Admissions (HSSC / Intermediate Intake)\n> | Component | Weightage |\n> | :--- | :---: |\n> | **SSC (Matriculation)** | 0% |\n> | **HSSC (Intermediate)** | **20%** |\n> | **Pre-Entry Test** | **80%** |\n> \n> *A minimum score of **20% in the Pre-Entry Test** is strictly mandatory to qualify for admission consideration.*\n>\n> #### 2. Third Year Admissions (Associate Degree / 5th Semester Intake)\n> | Component | Weightage |\n> | :--- | :---: |\n> | **Associate Degree (ADA / ADS)** | 0% |\n> | **Pre-Entry Test** | **100%** |\n> \n> *Third-year admission carries 100% weightage on the Pre-Entry Test. SSC and HSSC carry no weight. Minimum 20% in the entry test is mandatory.*",
      "### Academic Programs Offered for Spring 2027",
      "1. **Four-Year Undergraduate Degree Programs (1st Year Entry):**\n   - BS Computer Science (BSCS)\n   - BS Information Technology (BSIT)\n   - Bachelor of Business Administration (BBA - 4 Years)\n   - BS English Literature & Linguistics\n   - BS Mathematics\n   - BS Commerce (4 Years)\n   - B.Ed (Hons) Elementary / Education (4 Years)\n\n2. **Two-Year Lateral Programs (3rd Year / 5th Semester Entry):**\n   - BS 5th Semester programs for eligible ADA, ADS, and B.Com / BSc degree holders.",
      "### Application Processing Fee & Payment Mode",
      "- **Fee Amount:** Rs. 2,500 (Non-refundable application processing fee)\n- **Payment Method:** Generate the official bank fee challan through the online portal upon completing your registration. Deposit the fee at the designated bank branch or pay via online banking as specified on the invoice before the **10 October 2026** deadline.",
      "### Step-by-Step Online Application Procedure",
      "1. Visit the official portal: [admissions.saus.edu.pk/apply](https://admissions.saus.edu.pk/apply).\n2. Register a new candidate account using your CNIC / B-Form and email address.\n3. Enter your personal details, parent/guardian information, and residential address.\n4. Enter your academic qualifications (Matriculation, Intermediate, or Associate Degree marks).\n5. Generate and print the Rs. 2,500 application fee voucher.\n6. Deposit the fee at the bank and upload the clear scanned paid voucher image.\n7. Upload required documents (recent photograph, CNIC/B-Form copy, intermediate marks sheet).\n8. Review all entered details and click **Submit Application** before **10 October 2026**.\n9. Download and print the confirmation page for entry test verification.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the exact last date to apply for Shaikh Ayaz University?**\nThe final deadline is strictly **10 October 2026**. Candidates have only 3 days left to apply online.\n\n**Q2: When will the SAUS entry test be conducted?**\nThe pre-entry test will take place on **7 November 2026 at 09:00 AM PKT** on campus in Shikarpur.\n\n**Q3: How is merit calculated for first-year BS programs?**\nMerit is calculated as **80% Pre-Entry Test** and **20% Intermediate (HSSC)** marks. Matriculation carries 0% weightage. A minimum of 20% in the entry test is required.\n\n**Q4: What is the application processing fee?**\nThe application fee is Rs. 2,500 (non-refundable).\n\n**Q5: Are 5th-semester lateral admissions available?**\nYes, Associate Degree (ADA/ADS) holders can apply for 3rd-year lateral entry, with merit determined 100% by the pre-entry test."
    ]
  },
  {
    slug: 'sindh-agriculture-university-admissions-2027',
    title: 'Sindh Agriculture University Admissions 2027 – Apply Online',
    category: 'admissions',
    organization: 'Sindh Agriculture University (SAU) Tandojam & KCAMS Khairpur Mir’s',
    jobType: 'Undergraduate Degree Admissions (Academic Session 2027)',
    location: 'SAU Main Campus Tandojam, KCAMS Khairpur Mir’s & Sub-Campus Umerkot, Sindh',
    qualification: 'Intermediate (HSSC Pre-Medical / Pre-Engineering / Pre-Agriculture / ICS / General) Minimum 50% Marks',
    salary: 'Academic Admissions (Undergraduate Session 2027)',
    experience: 'Fresh Intermediate / Equivalent Qualified Candidates',
    positions: 'Undergraduate Admissions across 6 Faculties & Constituent Colleges',
    lastDate: '2026-10-30',
    noDeadline: false,
    publishDate: '2026-10-07',
    officialLink: 'https://applyonline.sau.edu.pk/',
    applyLink: 'https://applyonline.sau.edu.pk/login.php',
    isVerified: true,
    featured: true,
    logoInitial: 'SAU',
    featuredImage: '/images/sau-admissions-2027.jpg',
    imageAlt: 'Sindh Agriculture University Admissions 2027 SAU Tandojam Apply Online CareerDost',
    excerpt: 'Sindh Agriculture University (SAU) Tandojam announces Undergraduate Admissions for Session 2027 across main campus and KCAMS Khairpur Mir’s. Minimum 50% Intermediate marks required. Pre-entry test on 8 November 2026. Apply before 30 October 2026.',
    seoTitle: 'Sindh Agriculture University Admissions 2027 – Apply Online | CareerDost',
    metaDescription: 'SAU Tandojam Admissions 2027 Open: Apply online for undergraduate programs at applyonline.sau.edu.pk before 30 October 2026. Entry test date (8 Nov), eligibility, faculties, and merit formula.',
    focusKeyword: 'Sindh Agriculture University Admissions 2027',
    canonicalUrl: 'https://careerdost.blog/jobs/sindh-agriculture-university-admissions-2027',
    ogTitle: 'Sindh Agriculture University Admissions 2027 – Apply Online',
    ogDescription: 'Official admissions open for Sindh Agriculture University Tandojam & KCAMS Khairpur Mir’s Academic Session 2027. 50% Intermediate eligibility, entry test details & direct student portal.',
    schemaType: 'EducationalOccupationalProgram',
    content: [
      "### Official Admission Announcement & Session Overview",
      "**Sindh Agriculture University (SAU), Tandojam**, Pakistan’s premier institution for agricultural and allied sciences education, has announced the commencement of online admissions for **Undergraduate Programs (Academic Session 2027)**.",
      "The admission campaign covers programs offered at the **SAU Main Campus Tandojam**, **Khairpur College of Agricultural Engineering and Technology (KCAMS), Khairpur Mir’s**, and the **Sub-Campus Umerkot**.",
      "Applications officially commenced on **15 September 2026** and will remain open until **30 October 2026**. The centralized Pre-Entry Test will be held on **8 November 2026**.",
      "### Quick Summary Table",
      "- **Institution:** Sindh Agriculture University (SAU), Tandojam\n- **Constituent Campuses:** Main Campus Tandojam, KCAMS Khairpur Mir’s, Sub-Campus Umerkot\n- **Target Intake:** Undergraduate Academic Session 2027\n- **Application Commencement Date:** 15 September 2026\n- **Application Submission Deadline:** **30 October 2026**\n- **Pre-Entry Test Date:** **8 November 2026 (Sunday)**\n- **Minimum Academic Eligibility:** **Minimum 50% Marks in Intermediate (HSSC) or Equivalent**\n- **Official Online Portal:** [applyonline.sau.edu.pk](https://applyonline.sau.edu.pk/)\n- **Student Login Portal:** [applyonline.sau.edu.pk/login.php](https://applyonline.sau.edu.pk/login.php)\n- **Regional Target Audience:** Hyderabad, Tandojam, Mirpurkhas, Khairpur, Sukkur, Shaheed Benazirabad, Badin, Larkana, and all Sindh Districts",
      "### Undergraduate Faculties & Degree Programs Offered",
      "Candidates can seek admission across the following recognized faculties and specialized undergraduate degree programs:\n\n1. **Faculty of Crop Production:**\n   - B.Sc. (Hons.) Agriculture (Agronomy, Horticulture, Soil Science, Plant Breeding & Genetics)\n\n2. **Faculty of Crop Protection:**\n   - B.Sc. (Hons.) Agriculture (Entomology, Plant Pathology)\n\n3. **Faculty of Agricultural Social Sciences:**\n   - B.Sc. (Hons.) Agriculture (Agricultural Economics, Rural Sociology, Agricultural Extension)\n\n4. **Faculty of Agricultural Engineering:**\n   - B.E. Agricultural Engineering\n   - B.E. Energy & Environment\n\n5. **Faculty of Animal Husbandry & Veterinary Sciences:**\n   - Doctor of Veterinary Medicine (DVM – 5-Year Professional Degree)\n   - BS Poultry Science\n   - BS Animal Science\n\n6. **Faculty of Information Technology & Allied Sciences:**\n   - BS Computer Science (BSCS)\n   - BS Information Technology (BSIT)\n   - BS Software Engineering (BSSE)\n   - BS Food Science & Technology\n\n7. **KCAMS Khairpur Mir’s Campus:**\n   - B.E. Agricultural Engineering\n   - BS Agro-Industrial Technology",
      "### Minimum Eligibility Criteria",
      "- **Academic Benchmark:** Candidates must have secured at least **50% unadjusted marks** in Intermediate (HSSC) or equivalent qualification from any recognized Board of Intermediate and Secondary Education (BISE).\n- **Subject Group Eligibility:**\n  * **DVM & Crop Sciences:** Pre-Medical (Physics, Chemistry, Biology) or Pre-Agriculture.\n  * **Agricultural Engineering (B.E.):** Pre-Engineering (Physics, Chemistry, Mathematics).\n  * **Computer Science, IT & Software Engineering:** Pre-Engineering, Pre-Medical with Additional Math, or ICS (Physics, Mathematics, Computer Science).\n- **Domicile & Quota Allocation:** Admissions are distributed across district-based open merit quotas for Sindh province (Hyderabad, Tandojam, Mirpurkhas, Khairpur, Sukkur, Sanghar, Badin, Larkana, Dadu, etc.), alongside reserved seats for self-finance, other provinces, and sports categories.",
      "### Pre-Entry Test & Merit Calculation",
      "- The centralized pre-entry test is scheduled for **8 November 2026** at the SAU Tandojam main campus and designated regional centers.\n- The test evaluates candidates on English comprehension, General Science, Mathematics/Biology fundamentals, and Analytical Reasoning.\n- Merit list calculation aggregate combines intermediate examination percentage with the pre-entry test score.",
      "### Step-by-Step Online Application Procedure",
      "1. Navigate to the official admission portal: [applyonline.sau.edu.pk](https://applyonline.sau.edu.pk/).\n2. Click on the **Student** box and access `login.php`.\n3. Create your student account using your CNIC / B-Form number and a functional email address.\n4. Complete your applicant profile with personal details, district domicile, and academic records (Matriculation and Intermediate marks).\n5. Generate the official bank challan voucher.\n6. Deposit the non-refundable processing fee at designated bank branches.\n7. Upload the scanned copy of the paid challan along with your photograph and academic mark sheets.\n8. Submit your admission form before **30 October 2026** and download your test admit slip.",
      "### Frequently Asked Questions (FAQ)",
      "**Q1: What is the deadline to apply for SAU Tandojam Admissions 2027?**\nThe last date to submit online applications on `applyonline.sau.edu.pk` is **30 October 2026**.\n\n**Q2: When will the SAU Pre-Entry Test take place?**\nThe pre-entry test is scheduled for **8 November 2026**.\n\n**Q3: What is the minimum percentage required for admission?**\nA minimum of **50% marks** in Intermediate (HSSC) or equivalent is required to be eligible.\n\n**Q4: Which degree programs are offered at KCAMS Khairpur Mir’s?**\nKCAMS Khairpur Mir's offers B.E. Agricultural Engineering and BS Agro-Industrial Technology.\n\n**Q5: Can Pre-Engineering students apply for DVM?**\nNo. The Doctor of Veterinary Medicine (DVM) program strictly requires Intermediate Pre-Medical with Biology."
    ]
  }
]

export function publish() {
  console.log('=== PUBLISHING 5 FRESH OCT 7 ARTICLES ON CAREERDOST ===\n')

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

  for (const item of oct7Articles) {
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

  // Set explicit priority IDs for local SQLite (use temp offset to avoid unique constraint conflict)
  const idMap = [
    { slug: 'punjab-sti-jobs-2026-27', artId: 310, updId: 210 },
    { slug: 'nums-spring-2027-admissions', artId: 309, updId: 209 },
    { slug: 'nums-mdcat-result-2026', artId: 308, updId: 208 },
    { slug: 'shaikh-ayaz-university-admissions-2027', artId: 307, updId: 207 },
    { slug: 'sindh-agriculture-university-admissions-2027', artId: 306, updId: 206 }
  ]

  for (let i = 0; i < idMap.length; i++) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(5000 + i, idMap[i].slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(5000 + i, idMap[i].slug)
  }

  for (const m of idMap) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(m.artId, m.slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(m.updId, m.slug)
  }
  console.log('Updated priority IDs in local SQLite.')

  // 2. Prepend to src/data/listings.js
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')
  
  // Format each article as JSON object
  const formattedItems = oct7Articles.map(a => {
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

  // Prepend inside the `export const listings = [` array
  const arrayStart = listingsCode.indexOf('export const listings = [')
  if (arrayStart !== -1) {
    const insertPos = arrayStart + 'export const listings = [\n'.length
    const prependedCode = formattedItems.map(item => '  ' + item.replace(/\n/g, '\n  ') + ',\n').join('')
    
    // Check if not already inserted
    if (!listingsCode.includes('punjab-sti-jobs-2026-27')) {
      listingsCode = listingsCode.slice(0, insertPos) + prependedCode + listingsCode.slice(insertPos)
      listingsCode = listingsCode.replace(/Updated:\s*\d{4}-\d{2}-\d{2}/, 'Updated: 2026-10-07')
      fs.writeFileSync(listingsPath, listingsCode, 'utf8')
      console.log('Successfully updated src/data/listings.js with 5 new articles!')
    } else {
      console.log('src/data/listings.js already contains new articles.')
    }
  }

  // 3. Update scripts/generate_sitemap.js to include the 5 new updates
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')
  if (!sitemapScript.includes('punjab-sti-jobs-2026-27')) {
    const insertPattern = 'const publishedDailyUpdates = [\n'
    const newSitemapEntries = `  { slug: 'punjab-sti-jobs-2026-27', date: '2026-10-07' },\n  { slug: 'nums-spring-2027-admissions', date: '2026-10-07' },\n  { slug: 'nums-mdcat-result-2026', date: '2026-10-07' },\n  { slug: 'shaikh-ayaz-university-admissions-2027', date: '2026-10-07' },\n  { slug: 'sindh-agriculture-university-admissions-2027', date: '2026-10-07' },\n`
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + newSitemapEntries)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('Updated scripts/generate_sitemap.js with new slugs.')
  }
}

if (process.argv[1] && process.argv[1].endsWith('publish_oct7_articles.js')) {
  publish()
}
