import fs from 'fs';
import Database from 'better-sqlite3';
import { listings } from '../src/data/listings.js';

console.log(`Current listings count in listings.js: ${listings.length}`);

// 1. Updated Article: HEC Commonwealth Scholarships 2027-28 (ID: 24)
const updatedCommonwealth = {
  id: 24,
  slug: "hec-uk-commonwealth-scholarships-2027-28",
  title: "HEC UK Commonwealth Scholarship 2027–28: Master’s & PhD Application Guide (Closing Today 20 October 2026)",
  category: "scholarships",
  organization: "Higher Education Commission (HEC) & Commonwealth Scholarship Commission (CSC) UK",
  jobType: "Fully Funded International Postgraduate Scholarship (1-Year Master's & 3-Year PhD)",
  location: "United Kingdom (UK)",
  qualification: "16 Years Education (BS/BSc/BE) for Master’s | 17/18 Years Education (MS/MPhil) for PhD with First Division (No 2nd/3rd Division in Terminal Degree)",
  salary: "100% Tuition Fees, Return Airfare, Monthly Living Stipend, Warm Clothing Allowance & Thesis Grant",
  experience: "Academic Merit with Minimum 60/100 in HEC HAT Test (Categories I to IV)",
  positions: "Flagship Annual Nominations for Master's and PhD Cohort 2027–28",
  lastDate: "2026-10-20",
  noDeadline: false,
  publishDate: "2026-09-27",
  officialLink: "https://www.hec.gov.pk/english/HECAnnouncements/Pages/CW-Scholarship.aspx",
  applyLink: "https://scholarships.hec.gov.pk/",
  isVerified: true,
  featured: true,
  logoInitial: "HEC",
  featuredImage: "/images/hec-commonwealth-scholarship-2027.jpg",
  imageAlt: "HEC UK Commonwealth Scholarship 2027 28 Master's PhD Fully Funded Studies",
  excerpt: "The UK Commonwealth Scholarships 2027–28 call via HEC Pakistan and CSC UK is closing today, Tuesday, 20 October 2026. Complete dual submission on HEC e-portal (by 4:00 PM PKT) and CSC EAS portal (by 16:00 BST).",
  seoTitle: "HEC UK Commonwealth Scholarship 2027–28 — Master's & PhD Guide",
  metaDescription: "HEC Commonwealth Scholarship 2027–28 for UK Master's and PhD closes today, 20 Oct 2026. Review HEC portal (4 PM PKT) and CSC portal (16:00 BST) submission rules.",
  focusKeyword: "HEC UK Commonwealth Scholarship 2027-28",
  createdAt: "2026-09-27 10:00:00",
  updatedAt: "2026-10-20 01:00:00",
  content: [
    "### URGENT FINAL DEADLINE NOTICE: Applications Close Today, 20 October 2026",
    "> [!WARNING]\n> **Final Hours Submission Alert (No Deadline Extension):**\n> Online applications for the prestigious **UK Commonwealth Scholarships for the 2027–2028 academic year** close today, **Tuesday, 20 October 2026**.\n> - **HEC E-Portal Deadline:** **4:00 PM Pakistan Standard Time (16:00 PKT)** sharp.\n> - **CSC UK Portal (EAS) Deadline:** **16:00 British Summer Time (BST)** (equivalent to **8:00 PM / 20:00 PKT**).\n> - **Extension Status:** As of 20 October 2026, **no extension has been announced** by the Higher Education Commission or the Commonwealth Scholarship Commission. Dual submission to **both portals** is strictly mandatory before the respective cutoffs.",
    "### Overview of the UK Commonwealth Scholarship Program",
    "The **Higher Education Commission (HEC)** of Pakistan, in formal partnership with the **Commonwealth Scholarship Commission (CSC) in the United Kingdom**, manages annual national nominations for fully funded postgraduate study at prestigious UK universities. Funded by the UK Foreign, Commonwealth & Development Office (FCDO), the program is tailored for high-achieving Pakistani and Azad Jammu & Kashmir (AJK) citizens committed to driving sustainable socio-economic development across Pakistan.",
    "The scholarship covers two core degree programs:\n1. **1-Year Taught Master’s Degree:** Full tuition, monthly stipend, and travel coverage at participating UK higher education institutions.\n2. **3-Year (up to 36 Months) Doctoral (PhD) Research Degree:** Comprehensive research funding, tuition waiver, return airfare, and academic allowances.",
    "### Mandatory Dual-Portal Application Rule",
    "To be considered for official Pakistani nomination, candidates must complete **both steps** prior to the deadline. Failure to submit either form results in immediate disqualification:\n- **Step 1 (CSC UK Portal):** Complete and submit the electronic application on the Commonwealth Scholarship Commission Electronic Application System (EAS) at [cscuk.fcdo.gov.uk/about-us/scholarships](https://cscuk.fcdo.gov.uk/about-us/scholarships/).\n- **Step 2 (HEC E-Portal):** Submit the online application on HEC’s portal at [scholarships.hec.gov.pk](https://scholarships.hec.gov.pk/) under the section *\"Learning Opportunities Abroad\"* before **4:00 PM PKT**.",
    "### Eligibility Criteria & Academic Thresholds",
    "Candidates must strictly fulfill the following academic and statutory parameters:\n- **Nationality:** Pakistani or AJK national and permanent resident. Dual citizens holding foreign nationality are **strictly ineligible**.\n- **Master’s Degree Requirements:** A minimum 16-year Bachelor’s degree (4-year BS/BSc/BE or equivalent) in a relevant field with a **First Division** (minimum 60% marks in annual system or 3.0/4.0 CGPA in semester system). No 2nd or 3rd division is permissible in the terminal degree.\n- **PhD Degree Requirements:** A minimum 17/18-year Master’s/MS/MPhil degree with First Division (min 60% or 3.0/4.0 CGPA). No 2nd or 3rd division in the terminal degree.\n- **HEC Higher Education Aptitude Test (HAT) Benchmark:** A valid HAT score with a **minimum of 60 out of 100** is mandatory for HEC shortlisting. Valid test categories include **HAT-I** (Engineering, IT, Computer Science), **HAT-II** (Management & Social Sciences), **HAT-III** (Arts & Humanities), and **HAT-IV** (Agriculture, Veterinary, Biological & Medical Sciences). Standard local university admission tests are not accepted.\n- **Age Limit:** There is no upper age limit for Commonwealth scholarship candidates.",
    "### Complete Supporting Documentation Checklist",
    "Ensure the following verified credentials are submitted through the portals:\n1. Scanned copies of all academic degrees and detailed marks certificates (DMCs) from Matriculation through terminal degree, attested by HEC / IBCC.\n2. Valid National Identity Card (CNIC) or NICOP and valid Passport.\n3. Detailed Research Proposal (strictly required for PhD candidates, aligned with UN Sustainable Development Goals).\n4. Two confidential academic letters of recommendation uploaded directly by referees.\n5. Formal Development Impact Statement explaining how your UK studies will address economic, social, or environmental priorities in Pakistan.",
    "### Comprehensive Financial Benefits",
    "Commonwealth Scholarships provide 100% financial coverage with zero out-of-pocket costs for selected scholars:\n- **Approved Tuition Fees:** Fully paid directly to the UK university.\n- **Return International Airfare:** Economy class travel from Pakistan to the UK and return flight upon completion.\n- **Living Allowance (Stipend):** Monthly maintenance stipend (£1,347 per month, or £1,652 per month for universities in the London metropolitan area).\n- **Warm Clothing Allowance:** Arrival grant to assist with UK seasonal clothing requirements.\n- **Study Travel Grant:** Approved costs toward academic field trips within the UK or overseas.\n- **Thesis Grant:** Financial assistance toward preparation and submission of the doctoral thesis.",
    "### Post-Deadline Selection & Nomination Roadmap",
    "Following portal closure on 20 October 2026, the selection process follows a structured timeline:\n1. **Scrutiny & HAT Merit Ranking (November 2026):** HEC shortlists candidates based on academic weightage and HAT score.\n2. **HEC Nomination Interviews (December 2026):** Shortlisted candidates undergo formal evaluation by subject specialist panels.\n3. **Forwarding to CSC UK (January 2027):** HEC transmits official national nominations to the Commonwealth Scholarship Commission in London.\n4. **CSC Final Awards & Visa Clearance (April–June 2027):** CSC notifies selected awardees and issues formal award letters.\n5. **Departure for Academic Session (September/October 2027):** Scholars commence full-time studies at their chosen UK universities."
  ]
};

// 2. Updated Article: Sindh Wheat Subsidy 2026 (ID: 355)
const updatedWheat = {
  id: 355,
  slug: "sindh-wheat-subsidy-benazir-hari-card-2026",
  title: "Sindh Wheat Subsidy 2026–27: Benazir Hari Card Rs 4,000/Acre DAP Relief & Form-VII Verification",
  category: "government-schemes",
  organization: "Sindh Agriculture Department & Sindh Bank",
  jobType: "Provincial Agricultural Relief Package (Rabi Wheat Cropping Season 2026–27)",
  location: "All 24+ Agricultural Districts of Sindh",
  qualification: "Small & Medium Wheat Cultivators (Landholding 1 to 25 Acres with Form-VII)",
  salary: "Rs 4,000 per Acre DAP Subsidy + Rs 2,000 per Maund Procurement Incentive",
  experience: "Registered Farmers & Verified Tenants across Sindh",
  positions: "Targeting ~550,000 Wheat Growers for Direct Digital Disbursement",
  lastDate: "Ongoing Registration & Revalidation (Rabi Sowing 2026–27)",
  noDeadline: true,
  publishDate: "2026-10-12",
  officialLink: "https://agri.sindh.gov.pk/",
  applyLink: "https://benazirharicard.gos.pk/",
  isVerified: true,
  featured: true,
  logoInitial: "BHC",
  featuredImage: "/images/sindh-wheat-subsidy-benazir-hari-card-2026.webp",
  imageAlt: "Sindh Wheat Subsidy 2026 Benazir Hari Card Rs 4000 per acre DAP relief and Form VII registration",
  excerpt: "Sindh Cabinet and Agriculture Department have approved the Rabi 2026–27 wheat support framework providing Rs 4,000 per acre DAP fertilizer relief and a Rs 2,000/maund procurement incentive via Benazir Hari Card. Check Form-VII verification rules.",
  seoTitle: "Sindh Wheat Subsidy 2026–27 | Benazir Hari Card Rs 4,000/Acre Relief",
  metaDescription: "Sindh Wheat Subsidy 2026–27 approved: Rs 4,000/acre DAP relief and Rs 2,000/maund procurement incentive via Benazir Hari Card. Form-VII verification & helpline details.",
  focusKeyword: "Sindh Wheat Subsidy 2026 Benazir Hari Card",
  createdAt: "2026-10-12 11:00:00",
  updatedAt: "2026-10-20 01:00:00",
  content: [
    "### Executive Summary: Approved Wheat Support Framework (October 2026)",
    "The **Sindh Agriculture, Supply & Prices Department**, following formal ratification by the Sindh Cabinet, has officially operationalized the **Sindh Wheat Growers Support Program for the Rabi 2026–27 cropping season**. Designed to lower soaring agricultural input costs and protect smallholder livelihoods, the enhanced relief package channels direct financial assistance into the digital **Benazir Hari Card (BHC)** ecosystem.",
    "> [!NOTE]\n> **Official Policy Highlights (October 2026 Cabinet Directives):**\n> - **DAP Fertilizer Relief:** Cash subsidy of **Rs. 4,000 per acre** designated for small and medium wheat growers.\n> - **Landholding Eligibility:** Minimum **1 acre** up to an upper ceiling of **25 acres** of cultivable land.\n> - **Procurement Incentive:** An additional incentive bonus of **Rs. 2,000 per maund** for verified farmers delivering harvested wheat directly to provincial Food Department centers.\n> - **Target Beneficiaries:** Approximately **550,000 verified wheat farmers** across all rural districts of Sindh.\n> - **Disbursement Partner:** Direct digital crediting via **Sindh Bank** Benazir Hari Card ATM/debit cards.\n> - **Official Portal:** [benazirharicard.gos.pk](https://benazirharicard.gos.pk/)\n> - **Dedicated Helpline:** `0311-1646111` (Mon–Fri, 9:00 AM to 5:00 PM)",
    "### Land Revenue Verification: Mandatory Form-VII Protocols",
    "To ensure complete fiscal transparency and eliminate unauthorized intermediaries, eligibility requires certified revenue documentation through the **Board of Revenue Sindh**:\n1. **Form-VII (Form 7 - Record of Rights):** Farmers must present certified Form-VII issued by the local land revenue office confirming legal ownership or registered tenancy.\n2. **Verification Chain:** Land claims are physically authenticated by the village revenue official (**Tapedar**) and officially endorsed by the respective Sub-Divisional / Taluka executive magistrate (**Mukhtiarkar**).\n3. **Joint Landholdings (Khata Sharik):** In properties registered jointly among family members or co-heirs, the primary applicant must provide a certified **No-Objection Affidavit (NOA)** signed by all co-sharers.\n4. **Tenant Farmers (Haris):** Registered tenant farmers cultivating land on sharecropping or cash lease agreements must submit tenancy verification counter-signed by the landowner and verified by local Agriculture Extension officials.",
    "### Digital Disbursement Mechanism via Sindh Bank",
    "All financial relief under the program is disbursed strictly through the **Benazir Hari Card (BHC)**, eliminating cash handovers:\n- **Bank Integration:** Beneficiary accounts are operated through **Sindh Bank**, providing farmers with secure chip-enabled ATM debit cards.\n- **Input Procurement Flexibility:** Funds credited to the card can be withdrawn as cash at any 1Link ATM network nationwide or used via point-of-sale (POS) terminals at authorized fertilizer and seed dealers.\n- **Biometric Authentication:** Cash collections at mobile bank vans and branch counters require live biometric NADRA verification.",
    "### Geographic Scope Across Sindh",
    "The 2026–27 wheat support rollout is fully active across all key agricultural belts of the province:\n- **Lower Sindh:** Hyderabad, Badin, Thatta, Sujawal, Tando Muhammad Khan, Tando Allahyar, and Matiari.\n- **Central Sindh:** Shaheed Benazirabad (Nawabshah), Sanghar, Mirpurkhas, Umerkot, and Jamshoro.\n- **Upper Sindh:** Sukkur, Khairpur, Ghotki, Larkana, Shikarpur, Jacobabad, Kashmore-Kandhkot, Dadu, and Qambar Shahdadkot.",
    "### How to Register and Check Application Status",
    "Follow these verified steps to register or verify your existing Benazir Hari Card account:\n1. **Online Status Inquiry:** Visit the official portal at [benazirharicard.gos.pk](https://benazirharicard.gos.pk/) and enter your 13-digit CNIC (without dashes) to verify registration status.\n2. **In-Person Field Registration:** Farmers not yet enrolled can visit their local **Taluka Agriculture Extension Office** or Field Assistant center with:\n   - Original CNIC and photocopies.\n   - Biometric mobile SIM registered in the applicant's name.\n   - Certified copy of Form-VII and recent land tax (Dhal) receipt.\n3. **Revalidation for Existing Cardholders:** Farmers who received flood or crop assistance in previous cycles must re-verify their active cropping status with the local Tapedar to activate 2026–27 fertilizer subsidies.\n4. **Helpline Assistance:** In case of biometric mismatch, delays, or grievances, call the official Agriculture Department Helpline at **0311-1646111**."
  ]
};

// 3. Updated Article: GEPCO Jobs 2026 (ID: 318)
const updatedGepco = {
  id: 318,
  slug: "gepco-jobs-2026",
  title: "GEPCO Jobs 2026: Assistant Manager Vacancies via NTS (3 Days Remaining — Apply by 23 Oct)",
  category: "government-jobs",
  organization: "Gujranwala Electric Power Company (GEPCO)",
  jobType: "Contract Basis (3 Years Initial Term with Lump-Sum Monthly Pay Package)",
  location: "Gujranwala Head Office (Punjab)",
  qualification: "Bachelor’s or Master’s Degree in Computer Science (CS), IT, or Software Engineering with 2 Years Experience",
  salary: "Market Competitive Lump-Sum Pay Package (AMI Project Scale)",
  experience: "Minimum 2 Years Post-Qualification IT / Database / Network Experience",
  positions: "03 Strategic IT Posts under Advanced Metering Infrastructure (AMI) Project",
  lastDate: "2026-10-23",
  noDeadline: false,
  publishDate: "2026-10-09",
  officialLink: "https://portal.nts.org.pk/Alldetail/MTAxMzcz",
  applyLink: "https://portal.nts.org.pk/register",
  isVerified: true,
  featured: true,
  logoInitial: "GEPCO",
  featuredImage: "/images/gepco-jobs-2026.webp",
  imageAlt: "GEPCO Jobs 2026 Assistant Manager Vacancies Apply Online Through NTS by 23 October",
  excerpt: "GEPCO is accepting online applications for Assistant Manager roles in Database Administration, Network Support, and Meter Data Management under the AMI project. 3 days remaining — apply via NTS by 23 October 2026.",
  seoTitle: "GEPCO Jobs 2026 — Assistant Manager IT Vacancies via NTS",
  metaDescription: "GEPCO Assistant Manager IT recruitment 2026 closes 23 October. Review eligibility, NTS fee (Rs 280), Project Code 2610202, and apply online before the deadline.",
  focusKeyword: "GEPCO Jobs 2026 NTS",
  createdAt: "2026-10-09 11:00:00",
  updatedAt: "2026-10-20 01:00:00",
  content: [
    "### FINAL APPLICATION COUNTDOWN: 3 Days Remaining (Closes 23 October 2026)",
    "> [!WARNING]\n> **Urgent Deadline Reminder:**\n> The online registration window for **Gujranwala Electric Power Company (GEPCO) Assistant Manager IT vacancies** closes on **Friday, 23 October 2026 at 11:59:59 PM**.\n> - **NTS Project Code:** **2610202**\n> - **NTS Portal ID:** `MTAxMzcz` ([Direct Project Detail Link](https://portal.nts.org.pk/Alldetail/MTAxMzcz))\n> - **Tentative Test Date:** **30 October 2026**\n> - By-hand form submission is strictly prohibited. Applications must be completed online via the NTS Candidate Portal.",
    "### Recruitment Context: Advanced Metering Infrastructure (AMI) Project",
    "Operating under the Ministry of Energy (Power Division), Government of Pakistan, **GEPCO** is rapidly modernizing its power distribution infrastructure across central Punjab. The utility has established a dedicated **Advanced Metering Infrastructure (AMI) Project Directorate** to eliminate electricity theft, automate meter readings, and deploy real-time smart grid telemetry.",
    "This targeted recruitment drive, published under **Notice Ref: DMPR 12-2026-27**, invites applications from experienced Pakistani IT professionals for three specialized Assistant Manager requisitions on an initial **3-year contractual basis**.",
    "### Active Vacancies & Position Details",
    "All three positions are open on a nationwide merit quota with competitive lump-sum monthly remuneration:\n1. **Assistant Manager (Database Administration) — 01 Post (Open Merit):** Responsible for Oracle / SQL enterprise database management, automated backup routines, database clustering, and high-availability operations for smart metering data.\n2. **Assistant Manager (Network Support) — 01 Post (Open Merit):** Oversees wide-area network (WAN) architecture, optical fiber connectivity, VPN tunnels, firewall security, and cellular APN gateways connecting field AMI meters.\n3. **Assistant Manager (Meter Data Management) — 01 Post (Open Merit):** Directs the enterprise Meter Data Management System (MDMS), automated billing integration, time-of-use (TOU) data feeds, and outage reporting engines.",
    "### Minimum Eligibility & Age Limits",
    "- **Educational Benchmark:** 4-year Bachelor’s degree (BS/BSc Engg) or Master’s degree in Computer Science, Information Technology, or Computer Software Engineering from an HEC-recognized university.\n- **Professional Experience:** Minimum of **2 years post-qualification demonstrable experience** in database administration, network engineering, or enterprise software management.\n- **Age Bracket:** **21 to 33 years** (inclusive of the federal government’s general 5-year age relaxation).\n- **Special Age Relaxations:** Regular employees of WAPDA / DISCOs / GENCOs with at least 2 years continuous service are eligible up to **43 years**. Candidates belonging to Scheduled Castes and Buddhist communities receive an additional 3 years relaxation.",
    "### Subsidized Test Fee Structure & Payment",
    "- **Total Assessment Fee:** Rs. 540/- per applicant.\n- **GEPCO Subsidy:** GEPCO subsidizes 50% of the cost. **The candidate pays only Rs. 270/- + Rs. 10 portal fee = Rs. 280/-**.\n- **Fee Exemption for Persons with Disabilities:** Candidates possessing a valid NADRA Disability Certificate are entitled to **100% fee exemption (Rs. 0)**.\n- **Payment Method:** Generated 1Link 1Bill invoice payable through ATM, Internet Banking, Mobile Banking Apps (EasyPaisa, JazzCash, Nayapay, SadaPay), or TCS Express Counters.",
    "### Clarification Regarding Non-IT & Field Positions",
    "> [!NOTE]\n> **Candidate Advisory:** CareerDost's research desk confirms that there are currently **no general recruitment vacancies** active for Assistant Line Man (ALM), Commercial Superintendent, Revenue Officer, or Sub-Divisional Officer (SDO) in this specific GEPCO batch. Candidates are cautioned against misleading social media notices claiming mass field recruitment.",
    "### Step-by-Step Online Application Procedure",
    "1. Visit the verified NTS Candidate Portal at [portal.nts.org.pk](https://portal.nts.org.pk/).\n2. Register a new user account using your CNIC and active personal mobile number (do not use ported SIMs to ensure SMS alerts).\n3. Navigate to **Project Code: 2610202 (GEPCO Career Opportunities)**.\n4. Select your target Assistant Manager discipline and upload a recent passport-sized photograph and CNIC copy.\n5. Generate the 1Bill fee invoice and submit payment before **23 October 2026**."
  ]
};

// 4. New Article: NTS NAT-XI 2026 (ID: 505)
const newNatXi = {
  id: 505,
  slug: "nts-nat-xi-2026-november-registration-guide",
  title: "NTS NAT-XI 2026: November Test Registration, Late Fee Deadline & Roll Number Slip Schedule",
  category: "admissions",
  organization: "National Testing Service (NTS)",
  jobType: "National Aptitude Screening Test for University Admissions (1-Year Score Validity)",
  location: "Nationwide Test Centers (Karachi, Hyderabad, Sukkur, Lahore, Islamabad, Peshawar, Quetta, Multan, Faisalabad, Rawalpindi)",
  qualification: "Intermediate / 12 Years Education or Equivalent (FSc Pre-Medical, Pre-Engineering, ICS, ICom, FA, A-Levels) & 14 Years Bachelor's for NAT-II",
  salary: "Test Fee: Rs 1,510 (Payable via 1Link 1Bill Invoice)",
  experience: "Fresh Intermediate Graduates & University Admission Aspirants (Spring 2027 Admissions)",
  positions: "Standardized Entrance Test for 30+ NTS Associated Universities & Degree Awarding Institutes",
  lastDate: "2026-10-26",
  noDeadline: false,
  publishDate: "2026-10-20",
  officialLink: "https://www.nts.org.pk/new/NAT.php",
  applyLink: "https://portal.nts.org.pk/Alldetail/MTAxMzc1",
  isVerified: true,
  featured: true,
  logoInitial: "NTS",
  featuredImage: "/images/nts-nat-xi-november-2026.jpg",
  imageAlt: "NTS NAT-XI 2026 November Test Registration Schedule and Roll Number Slip Guide",
  excerpt: "NTS has opened online registration for NAT-XI 2026 under Project Code 2611311. Late fee registration closes on 26 October 2026, e-roll number slips issue on 3 November, and the nationwide test will take place on Sunday, 15 November 2026.",
  seoTitle: "NTS NAT-XI 2026 — November Test Schedule & Registration",
  metaDescription: "NTS NAT-XI 2026 November registration is open until 26 October. Check Project Code 2611311, roll number slip date (3 Nov), fee (Rs 1,510), and test pattern.",
  focusKeyword: "NTS NAT-XI 2026 November Registration",
  createdAt: "2026-10-20 01:10:00",
  updatedAt: "2026-10-20 01:10:00",
  content: [
    "### Announcement Overview: NTS NAT-XI 2026 Schedule",
    "The **National Testing Service (NTS)** has formally opened the registration cycle for the **National Aptitude Test (NAT-XI 2026)** under **Project Code: 2611311**. NAT is Pakistan’s premier standardized assessment mechanism, serving as the mandatory or recognized entrance evaluation for undergraduate and postgraduate admissions across more than **30 affiliated public and private universities** and Degree Awarding Institutes (DAIs).",
    "Students aiming for **Spring 2027 university admissions** must secure their NAT scores to qualify for admissions in engineering, computing, medical sciences, business, and humanities faculties.",
    "> [!IMPORTANT]\n> **Official NAT-XI 2026 Key Dates (Project Code: 2611311):**\n> - **Announcement Date:** Monday, 12 October 2026\n> - **Online Registration & Fee Deadline:** **Monday, 26 October 2026**\n> - **Issuance of E-Roll Number Slips:** **Tuesday, 03 November 2026**\n> - **Official Test Date:** **Sunday, 15 November 2026**\n> - **Result Declaration Date:** **Monday, 23 November 2026**\n> - **Score Validity:** **One (01) Full Year** from the result announcement date\n> - **Authorized Portal Link:** [portal.nts.org.pk/Alldetail/MTAxMzc1](https://portal.nts.org.pk/Alldetail/MTAxMzc1)",
    "### Test Categories & Eligibility Streams",
    "NAT is categorized based on the candidate's prior academic qualification and target degree level:\n\n#### Category 1: For 12-Year / Intermediate Education (Undergraduate Intake)\n- **NAT-IE (Pre-Engineering):** For students with FSc Pre-Engineering applying for BS Engineering, Technology, or Physical Sciences.\n- **NAT-IM (Pre-Medical):** For students with FSc Pre-Medical applying for Biotechnology, Pharmacy, Nursing, or Allied Health Sciences.\n- **NAT-ICS (Computer Science):** For students with Intermediate in Computer Science applying for BS Software Engineering, Computer Science, AI, or Data Science.\n- **NAT-ICOM (Commerce):** For students with ICom applying for BBA, BS Accounting & Finance, or Commerce programs.\n- **NAT-IA (Arts & Humanities):** For students with FA applying for Social Sciences, English, Psychology, or Mass Communication.\n- **NAT-IGS (General Science):** For students with General Science (Math/Statistics) applying for Economics, Actuarial Sciences, or Statistics.\n\n#### Category 2: For 14-Year Education (Master’s / 16-Year Intake)\n- **NAT-IIA** (Arts & Social Sciences), **NAT-IIB** (Biological Sciences), **NAT-IIM** (Management Sciences), **NAT-IIP** (Physical Sciences), and **NAT-IIO** (Oriental & Islamic Studies).",
    "### Standardized Paper Pattern & Syllabus (90 MCQs / 120 Minutes)",
    "The NAT examination carries a total of **90 Multiple Choice Questions (MCQs)** to be attempted within **120 minutes (2 hours)**. There is **no negative marking**:\n1. **Verbal Section (20 MCQs):** Evaluates English vocabulary, sentence completion, analogies, and critical reading comprehension.\n2. **Analytical Reasoning (20 MCQs):** Tests logical deductive reasoning, scenario analysis, and pattern identification.\n3. **Quantitative Reasoning (20 MCQs):** Evaluates basic arithmetic, algebra, ratios, percentages, and basic geometry.\n4. **Subject Knowledge (30 MCQs):** Discipline-specific questions drawn from core Higher Secondary curricula (e.g., Physics, Chemistry, Math, Biology, Computer Science, or Accounting).",
    "### Fee Structure & Digital Payment Methods",
    "- **Test Assessment Fee:** **Rs. 1,500/-** per candidate (+ Rs. 10 portal transaction processing fee = **Rs. 1,510/-**).\n- *Important Fee Note:* Historical guides quoting Rs. 1,000 or Rs. 1,050 reflect obsolete tariff schedules; NTS officially standardizes the NAT examination fee at Rs. 1,510.\n- **Digital Payment Channels:** Pay via generated 1Link 1Bill Invoice using:\n  - Mobile Banking Apps (All Pakistani commercial and microfinance banks).\n  - Digital Wallets (EasyPaisa, JazzCash, Nayapay, SadaPay).\n  - ATM Terminals nationwide.\n  - TCS Express Centers.",
    "### Step-by-Step Registration & Roll Number Slip Download Guide",
    "1. Navigate to the verified NTS Candidate Portal at [portal.nts.org.pk](https://portal.nts.org.pk/).\n2. Create an account with your CNIC / B-Form number and verified mobile number.\n3. Search for **Project: National Aptitude Test, NAT-XI 2026 (Code: 2611311)**.\n4. Select your specific test discipline (e.g., NAT-IE, NAT-IM, or NAT-ICS) and choose your preferred test city (e.g., Karachi, Hyderabad, Lahore, Islamabad).\n5. Generate the 1Bill fee voucher and complete payment before **26 October 2026**.\n6. **Downloading E-Roll Number Slip (03 November 2026):** Return to the portal on 3 November 2026, enter your CNIC, and print your official E-Roll Number Slip showing your test center, reporting time, and roll number.\n7. **Mandatory Test Day Documents:** On 15 November 2026, bring your printed Roll Number Slip, original computerized CNIC or B-Form, a clipboard, and blue/black ballpoint pens to your designated test center."
  ]
};

// 5. New Article: Memon College of Nursing Karachi (ID: 506)
const newMemonNursing = {
  id: 506,
  slug: "memon-college-of-nursing-karachi-bsn-admissions-2026-27",
  title: "Memon College of Nursing Karachi: BS Nursing Admissions 2026–27 via NTS (Batch-X)",
  category: "admissions",
  organization: "Memon College of Nursing (MMIH / MHEF Karachi)",
  jobType: "4-Year Generic BS Nursing Degree Program (Session 2026–2027 / Batch-X)",
  location: "Karachi (Sindh) — Safoora Chowrangi, KDA Scheme 33",
  qualification: "FSc Pre-Medical (Physics, Chemistry, Biology) with Minimum 50% Marks",
  salary: "NTS Application Processing Fee: Rs 3,000 (Payable via 1Link 1Bill)",
  experience: "Open to Fresh Intermediate Graduates (Pre-Medical Stream)",
  positions: "Annual Admissions Intake for Generic BSN Degree Program",
  lastDate: "2026-10-30",
  noDeadline: false,
  publishDate: "2026-10-20",
  officialLink: "https://mmi.edu.pk/",
  applyLink: "https://nts.org.pk/Test&Products/Announced/10_26/Memon_Oct2026_Online/Memon.php",
  isVerified: true,
  featured: true,
  logoInitial: "MCON",
  featuredImage: "/images/memon-college-nursing-karachi-bsn-2026.jpg",
  imageAlt: "Memon College of Nursing Karachi BS Nursing Generic Admissions 2026 27 via NTS Batch X",
  excerpt: "Memon College of Nursing (MCON) at Memon Medical Institute Hospital (MMIH) Karachi has opened admissions for the 4-Year Generic BSN Degree Program (Batch-X, 2026–27) affiliated with Dow University (DUHS). Apply online through NTS by 30 October 2026.",
  seoTitle: "Memon College of Nursing Karachi BS Nursing Admissions 2026–27",
  metaDescription: "Memon College of Nursing Karachi BS Nursing (Generic) admissions 2026–27 (Batch-X) open via NTS. DUHS affiliated, PNMC recognized. Apply online by 30 October 2026.",
  focusKeyword: "Memon College of Nursing Karachi BSN Admissions 2026",
  createdAt: "2026-10-20 01:15:00",
  updatedAt: "2026-10-20 01:15:00",
  content: [
    "### Institutional Overview: Memon College of Nursing (MCON) Karachi",
    "The **Memon College of Nursing (MCON)**, a key healthcare education division of the **Memon Health & Education Foundation (MHEF)**, has officially announced admissions for its **4-Year Generic Bachelor of Science in Nursing (BSN) Degree Program (Batch-X, Academic Session 2026–2027)**. Situated within the state-of-the-art **Memon Medical Institute Hospital (MMIH)** complex in Karachi, the college provides comprehensive collegiate nursing training integrated with direct clinical ward experience.",
    "The admission screening and aptitude testing process is conducted exclusively through the **National Testing Service (NTS)**.",
    "> [!NOTE]\n> **Official Admission Parameters:**\n> - **Program:** Bachelor of Science in Nursing (BSN Generic) — 4-Year Degree (Batch-X)\n> - **Affiliated University:** **Dow University of Health Sciences (DUHS) Karachi**\n> - **Accreditation:** Recognized by the **Pakistan Nursing & Midwifery Council (PNMC)** Islamabad\n> - **Clinical Training:** 332-bed tertiary care teaching hospital at Memon Medical Institute Hospital (MMIH)\n> - **Application Deadline:** **Friday, 30 October 2026**\n> - **Testing Agency:** National Testing Service (NTS)\n> - **Official NTS Gateway:** [nts.org.pk Memon Project](https://nts.org.pk/Test&Products/Announced/10_26/Memon_Oct2026_Online/Memon.php)",
    "### Eligibility Criteria for BSN (Generic)",
    "Applicants must strictly meet the statutory requirements established by the PNMC and DUHS:\n- **Educational Qualification:** Intermediate (FSc Pre-Medical) or equivalent qualification with a **minimum of 50% marks** (Physics, Chemistry, and Biology as mandatory subjects).\n- **Age Bracket:** **14 to 35 years** on the closing date of application.\n- **Gender Inclusivity:** Co-education program — open to both male and female candidates.\n- **Domicile:** Open to candidates holding valid domicile from Sindh (Karachi and interior districts) and across Pakistan.",
    "### Merit Formulation & Selection Policy",
    "Admission is awarded strictly on competitive merit, evaluated across four structured benchmarks:\n1. **Matriculation (SSC / Science):** 10% academic weightage.\n2. **Intermediate (FSc Pre-Medical):** 20% academic weightage.\n3. **NTS Aptitude Entry Test:** **50% weightage** (testing English, Biology, Chemistry, Physics, and General Knowledge).\n4. **Structured Panel Interview & Medical Fitness:** 20% weightage conducted by the MCON admissions committee.",
    "### Step-by-Step Online Application Process",
    "Candidates must strictly complete the formal **two-step submission**:\n\n#### Step 1: Online Application on NTS Portal\n1. Visit the dedicated NTS Memon College portal at [https://nts.org.pk/Test&Products/Announced/10_26/Memon_Oct2026_Online/Memon.php](https://nts.org.pk/Test&Products/Announced/10_26/Memon_Oct2026_Online/Memon.php).\n2. Click **Online Application Form** and create a candidate profile using your CNIC / B-Form and password.\n3. Select **BS NURSING (GENERIC) (04 YEARS PROGRAM)**.\n4. Fill in academic credentials, contact details, and upload required passport photograph.\n5. Generate the 1Link 1Bill fee invoice and deposit the non-refundable test processing fee of **Rs. 3,000/-** via Mobile Banking Apps, ATM, EasyPaisa, JazzCash, or TCS Express Counters.\n6. Hand-written forms are strictly rejected.\n\n#### Step 2: Institutional Registration on MCON Portal\n1. Following fee submission, visit the Memon College of Nursing official portal at [mcon.mmi.edu.pk](https://mcon.mmi.edu.pk/).\n2. Register your candidate profile and submit the institutional application referencing your NTS roll number / tracking ID.\n\n### Official Contacts & Campus Details",
    "- **Campus Location:** 3rd Floor, Memon Medical Institute Hospital, Hyder Bakhsh Gabol Road, Safoora Chowrangi, KDA Scheme 33, Gulzar-e-Hijri, Karachi.\n- **College UAN Phone:** 021-111-664-664 (Ext: 1294, 1295)\n- **Admissions Email:** `admission@mhef.edu.pk`\n- **NTS Karachi Regional Helpline:** `021-34546930`\n- **Application Deadline:** **Friday, 30 October 2026**"
  ]
};

// 6. New Article: NIAHS Hyderabad BSN Nursing (ID: 507)
const newNiahsNursing = {
  id: 507,
  slug: "niahs-hyderabad-bsn-nursing-admissions-2026-27",
  title: "National Institute of Allied Health Sciences (NIAHS) Hyderabad: BS Nursing Admissions 2026–27 via NTS",
  category: "admissions",
  organization: "National Institute of Allied Health Sciences (NIAHS), College of Nursing, Hyderabad",
  jobType: "4-Year Generic BSc Nursing Degree Program (Session 2026–2027 / 4th Batch)",
  location: "Hyderabad (Sindh) — Near Wadhu Wah, Main National Highway, Qasimabad",
  qualification: "FSc Pre-Medical (Physics, Chemistry, Biology) with Minimum 50% Marks",
  salary: "Semester Tuition Fee: Rs 110,000 | NTS Entry Test Processing Fee Payable via 1Bill",
  experience: "Open to Fresh Intermediate Graduates (Pre-Medical Stream)",
  positions: "Annual Admissions Intake for Generic BSN Degree Program",
  lastDate: "2026-10-30",
  noDeadline: false,
  publishDate: "2026-10-20",
  officialLink: "https://niahs.edu.pk/",
  applyLink: "https://nts.org.pk/Test&Products/Announced/08_26/NIAH_Hyd_Aug2026_Online/NIAH.php",
  isVerified: true,
  featured: true,
  logoInitial: "NIAHS",
  featuredImage: "/images/niahs-hyderabad-bsn-nursing-2026.jpg",
  imageAlt: "National Institute of Allied Health Sciences NIAHS Hyderabad BS Nursing Admissions 2026 27 NTS",
  excerpt: "National Institute of Allied Health Sciences (NIAHS) Hyderabad has announced admissions for its 4-Year BS Nursing (Generic) program (Session 2026–27 / 4th Batch). Affiliated with SMBBMU Larkana and recognized by PNMC. Apply via NTS by 30 October 2026.",
  seoTitle: "NIAHS Hyderabad BS Nursing Admissions 2026–27 via NTS",
  metaDescription: "National Institute of Allied Health Sciences (NIAHS) Hyderabad BS Nursing admissions 2026–27 open via NTS. SMBBMU affiliated, PNMC recognized. Apply by 30 October 2026.",
  focusKeyword: "NIAHS Hyderabad BS Nursing Admissions 2026",
  createdAt: "2026-10-20 01:20:00",
  updatedAt: "2026-10-20 01:20:00",
  content: [
    "### Academic Announcement: NIAHS College of Nursing Hyderabad",
    "The **National Institute of Allied Health Sciences (NIAHS), College of Nursing, Hyderabad** has officially launched admissions for its **4-Year BSc Nursing (Generic) Degree Program for the Academic Session 2026–2027 (4th Batch)**. Serving healthcare education needs across Hyderabad, Jamshoro, Matiari, Badin, Mirpurkhas, and lower Sindh, the institute offers comprehensive clinical training in modern hospital environments.",
    "Aptitude assessment and candidate screening for this intake are conducted through the **National Testing Service (NTS)**.",
    "> [!NOTE]\n> **Official Institutional Credentials & Affiliations:**\n> - **Degree Program:** BSc Nursing (Generic) — 4-Year Professional Degree (4th Batch)\n> - **Regulatory Recognition:** Recognized by the **Pakistan Nursing & Midwifery Council (PNMC / PNC)**, Islamabad\n> - **University Affiliation (Important Verification):** Affiliated with **Shaheed Mohtarma Benazir Bhutto Medical University (SMBBMU) Larkana** *(CareerDost clarifies that degree-awarding authority is SMBBMU Larkana, not LUMHS Jamshoro)*\n> - **Examination Board Approval:** Approved by the **Sindh Nursing Examination Board (SNEB)**\n> - **Application Deadline:** **Friday, 30 October 2026**\n> - **Testing Partner:** National Testing Service (NTS)\n> - **Authorized Portal Link:** [nts.org.pk NIAHS Project](https://nts.org.pk/Test&Products/Announced/08_26/NIAH_Hyd_Aug2026_Online/NIAH.php)",
    "### Eligibility & Academic Requirements",
    "Candidates must fulfill the statutory eligibility criteria mandated by the PNMC and SMBBMU:\n- **Educational Qualification:** Intermediate (FSc Pre-Medical) or equivalent qualification with a **minimum of 50% marks**.\n- **Mandatory Subjects:** Biology, Physics, and Chemistry must be passed at the Higher Secondary level.\n- **Age Limit:** **14 to 35 years** on the date of application submission.\n- **Gender Eligibility:** Open merit for both male and female candidates.\n- **Domicile:** Open to candidates holding a valid domicile from Sindh province.",
    "### Institutional Fee Structure (BSN Generic)",
    "According to the official schedule of fees published by NIAHS Hyderabad:\n- **Admission Fee (One-Time):** PKR 35,000/-\n- **Tuition Fee (Per Semester):** PKR 110,000/-\n- **Clinical Training Fee (Per Semester):** PKR 15,000/-\n- *Note:* Additional university enrollment, exam fees, and clinical laboratory charges apply as per SMBBMU guidelines.",
    "### Step-by-Step Online Application via NTS",
    "1. Access the official NTS project portal at [https://nts.org.pk/Test&Products/Announced/08_26/NIAH_Hyd_Aug2026_Online/NIAH.php](https://nts.org.pk/Test&Products/Announced/08_26/NIAH_Hyd_Aug2026_Online/NIAH.php).\n2. Click on **Online Application Form** to sign up with your CNIC / B-Form and password.\n3. Select **BS NURSING (GENERIC) (04 YEARS PROGRAM)**.\n4. Complete the candidate bio-data, academic records, and upload a clear digital photograph.\n5. Submit the form online and print the generated 1Bill fee invoice.\n6. Deposit the NTS screening test processing fee through 1Link 1Bill participating banks, ATM, Mobile Banking Apps (EasyPaisa, JazzCash, etc.), or TCS Express Counters.\n7. Hand-written applications are strictly rejected.\n8. Keep your submitted form copy and paid deposit receipt safe for presentation at the NTS test center.",
    "### Campus Location & Contact Channels",
    "- **Campus Address:** National Institute of Allied Health Sciences, College of Nursing, Near Wadhu Wah, Main National Highway, Qasimabad, Hyderabad, Sindh.\n- **Direct Telephone / WhatsApp Helpdesk:** 0306-3063529 | 0333-2616874 | 0310-3038281\n- **Official Email:** `niahsthyderabad@gmail.com`\n- **NTS Regional Helpline (Karachi/Sindh):** `021-34546930`\n- **Application Deadline:** **Friday, 30 October 2026**"
  ]
};

// Apply updates to existing listings
const finalMap = new Map();

// Insert the 3 new articles at the beginning (latest published)
finalMap.set(newNiahsNursing.id, newNiahsNursing);
finalMap.set(newMemonNursing.id, newMemonNursing);
finalMap.set(newNatXi.id, newNatXi);

// Now process existing listings
for (const item of listings) {
  if (item.id === 24) {
    finalMap.set(24, { ...item, ...updatedCommonwealth });
  } else if (item.id === 355) {
    finalMap.set(355, { ...item, ...updatedWheat });
  } else if (item.id === 318) {
    finalMap.set(318, { ...item, ...updatedGepco });
  } else if (!finalMap.has(item.id)) {
    finalMap.set(item.id, item);
  }
}

const finalArray = Array.from(finalMap.values());
console.log(`New total listings count: ${finalArray.length}`);

// Write back to src/data/listings.js
const listingsFileContent = `// Auto-generated listings from CareerDost database
export const listings = ${JSON.stringify(finalArray, null, 2)};
`;

fs.writeFileSync('src/data/listings.js', listingsFileContent, 'utf8');
console.log('Successfully written updated src/data/listings.js');

// Also sync with careerdost.sqlite
try {
  const db = new Database('careerdost.sqlite');
  
  // Update Commonwealth
  db.prepare(`
    UPDATE articles 
    SET title = ?, excerpt = ?, content = ?, last_date = ?, updated_at = ?
    WHERE slug = ? OR id = ?
  `).run(
    updatedCommonwealth.title,
    updatedCommonwealth.excerpt,
    JSON.stringify(updatedCommonwealth.content),
    updatedCommonwealth.lastDate,
    updatedCommonwealth.updatedAt,
    updatedCommonwealth.slug,
    24
  );

  // Update Wheat
  db.prepare(`
    UPDATE articles 
    SET title = ?, excerpt = ?, content = ?, last_date = ?, updated_at = ?
    WHERE slug = ? OR id = ?
  `).run(
    updatedWheat.title,
    updatedWheat.excerpt,
    JSON.stringify(updatedWheat.content),
    updatedWheat.lastDate,
    updatedWheat.updatedAt,
    updatedWheat.slug,
    355
  );

  // Update GEPCO
  db.prepare(`
    UPDATE articles 
    SET title = ?, excerpt = ?, content = ?, last_date = ?, updated_at = ?
    WHERE slug = ? OR id = ?
  `).run(
    updatedGepco.title,
    updatedGepco.excerpt,
    JSON.stringify(updatedGepco.content),
    updatedGepco.lastDate,
    updatedGepco.updatedAt,
    updatedGepco.slug,
    318
  );

  // Insert or Replace the 3 new articles in SQLite
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO articles (
      id, slug, title, category_slug, organization, job_type, location,
      qualification, salary, last_date, publish_date, official_link,
      featured, logo_initial, excerpt, content, seo_title, meta_description,
      status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  [newNatXi, newMemonNursing, newNiahsNursing].forEach(a => {
    insertStmt.run(
      a.id,
      a.slug,
      a.title,
      a.category,
      a.organization,
      a.jobType,
      a.location,
      a.qualification,
      a.salary,
      a.lastDate,
      a.publishDate,
      a.officialLink,
      a.featured ? 1 : 0,
      a.logoInitial,
      a.excerpt,
      JSON.stringify(a.content),
      a.seoTitle,
      a.metaDescription,
      'published',
      a.createdAt,
      a.updatedAt
    );
    console.log(`Inserted article [${a.id}] ${a.slug} into SQLite`);
  });

  console.log('Successfully synchronized careerdost.sqlite');
} catch (dbErr) {
  console.warn('SQLite sync warning (non-fatal):', dbErr.message);
}
