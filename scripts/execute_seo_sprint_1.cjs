const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const apiBase = 'https://careerdost.blog/api/admin';

function base64UrlEncode(strOrBuffer) {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateJwt(admin, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encHeader}.${encPayload}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest());
  return `${dataToSign}.${signature}`;
}

async function updateArticle(apiBase, jwt, localDb, slug, updates) {
  // 1. Fetch current D1 article
  const getRes = await fetch(`${apiBase}/articles`, { headers: { Authorization: `Bearer ${jwt}` } });
  const articles = (await getRes.json()).data;
  const current = articles.find(a => a.slug === slug);
  if (!current) {
    throw new Error(`Article not found in D1: ${slug}`);
  }

  const payload = {
    ...current,
    ...updates,
    status: current.status // preserve status exactly
  };

  // 2. Update Production D1
  const putRes = await fetch(`${apiBase}/articles/${slug}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const putJson = await putRes.json();
  if (!putRes.ok || !putJson.success) {
    throw new Error(`Failed to update ${slug} in D1: ${JSON.stringify(putJson)}`);
  }

  // 3. Update Local SQLite
  const localArt = localDb.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
  if (localArt) {
    const updateStmt = localDb.prepare(`
      UPDATE articles
      SET title = COALESCE(?, title),
          seo_title = COALESCE(?, seo_title),
          meta_description = COALESCE(?, meta_description),
          last_date = COALESCE(?, last_date),
          excerpt = COALESCE(?, excerpt),
          content = COALESCE(?, content),
          updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `);
    const contentStr = updates.content ? JSON.stringify(updates.content) : null;
    updateStmt.run(
      updates.title || null,
      updates.seoTitle || null,
      updates.metaDescription || null,
      updates.lastDate || null,
      updates.excerpt || null,
      contentStr,
      slug
    );
  }

  console.log(`  ✓ Updated '${slug}':`);
  console.log(`    - SEO Title: "${putJson.data.seoTitle}" (${putJson.data.seoTitle?.length} chars)`);
  console.log(`    - Last Date: "${putJson.data.lastDate}"`);
  console.log(`    - Status:    "${putJson.data.status}"`);
  return putJson.data;
}

async function main() {
  console.log('=== CAREERDOST: EXECUTING GSC SEO SPRINT 1 ===\n');

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);
  const localDb = new Database('careerdost.sqlite');

  // -------------------------------------------------------------
  // A. PHSA Paramedic General List (phsa-paramedic-general-list-2026)
  // -------------------------------------------------------------
  console.log('\n--- A. Updating PHSA Paramedic General List Article ---');
  await updateArticle(apiBase, jwt, localDb, 'phsa-paramedic-general-list-2026', {
    seoTitle: 'PHSA Merit List 2026 PDF Download — CareerDost',
    metaDescription: 'Download PHSA Paramedic Diploma General Merit Lists 2026–28 for PIMT Swat, Abbottabad, DI Khan & PGPI Peshawar. Check official PDF links & objection guidance.',
    excerpt: 'PHSA released the 2-Year Paramedic Diploma General Merit Lists 2026–28 for PIMT D.I. Khan, Swat, Abbottabad, and PGPI Peshawar. Download official institute PDFs and submit objections online.',
    content: [
      "### Direct PDF Download & Verification: PHSA Paramedic General Merit Lists 2026",
      "Candidates looking for the **PHSA Paramedic Diploma General Merit List 2026–2028** can directly access and download the official institute-wise candidate lists published under **Notice #40** on the **Provincial Health Services Academy (PHSA)** portal at [phsa.edu.pk/notice-details](https://www.phsa.edu.pk/notice-details).",
      "> [!IMPORTANT]\n> **Critical Clarification: General Provisional List vs. Final Selection List:**\n> - **Current Release (Provisional General List):** Contains all received applications, verified matric/science scores, and quota tags for public review and discrepancy correction.\n> - **Action Required:** Check your name, marks calculation, and district allocation using `Ctrl + F`.\n> - **Objection Window:** Any errors in marks, names, or quotas must be formally lodged with the respective admission committee before final list generation.\n> - **Final Selection / Call List:** Will be published separately following the resolution of objections for candidate interviews and fee deposits.",
      "### Quick Summary: PHSA Paramedic Admissions 2026–2028",
      "- **Administering Authority:** Provincial Health Services Academy (PHSA), Department of Health, Government of Khyber Pakhtunkhwa\n- **Programs Offered:** 2-Year Paramedic Diplomas across 8+ specialized clinical tracks\n- **Participating Institutes:**\n  - Post Graduate Paramedical Institute (PGPI) Peshawar\n  - Paramedical Institute of Medical Technologies (PIMT) Abbottabad\n  - Paramedical Institute of Medical Technologies (PIMT) Swat\n  - Paramedical Institute of Medical Technologies (PIMT) D.I. Khan\n- **Official Notice Reference:** Notice #40 (Dated 01-Oct-2026)\n- **Direct Notice Portal:** [phsa.edu.pk/notice-details](https://www.phsa.edu.pk/notice-details)\n- **Official PHSA Domain:** [phsa.edu.pk](https://www.phsa.edu.pk/)",
      "### Paramedic Diploma Disciplines Covered in Merit Lists",
      "The published provisional lists encompass applicants across major allied health clinical diplomas:\n1. **Cardiology Technology:** Electrocardiography, catheterization lab support, and cardiac telemetry.\n2. **Pathology / Medical Laboratory Technology (MLT):** Diagnostic pathology, hematology, and clinical microbiology.\n3. **Surgical / Operation Theater (OT) Technology:** Pre-operative sterilization, surgical assistance, and instrumentation.\n4. **Radiology / X-Ray & Imaging Technology:** Diagnostic radiography and CT/MRI imaging workflows.\n5. **Dental Health Technology:** Maxillofacial assistance, dental hygiene, and chairside clinical support.\n6. **Anesthesia Technology:** Anesthetic workstation setup, gas monitoring, and recovery patient care.\n7. **Dialysis / Nephrology Technology:** Hemodialysis machine preparation and patient monitoring.\n8. **Pharmacy Technician / Dispenser Diploma:** Pharmaceutical compounding, hospital dispensary, and stock control.",
      "### Step-by-Step Guide to Locate Your Name on the PDF",
      "1. Open the official PHSA portal: [https://www.phsa.edu.pk/notice-details](https://www.phsa.edu.pk/notice-details).\n2. Navigate to **Notice #40: General Lists – Paramedic Diploma Programs (2 Years)**.\n3. Click on your respective institute PDF link (PIMT Abbottabad, PIMT Swat, PIMT D.I. Khan, or PGPI Peshawar).\n4. Download and open the PDF file on your computer or mobile device.\n5. Press `Ctrl + F` (or the search magnifying glass on mobile) and search by your **Application Form Number**, **CNIC / B-Form Number**, or **Full Name**.\n6. Review your Matric Science marks percentage, total calculated score, and allocated category quota.",
      "### Official Objection Filing Procedure",
      "If you identify any discrepancy in your name, father's name, matriculation marks calculation, district of domicile, or quota classification:\n- **Filing Location:** Contact the Admission Cell of the respective training institute (PIMT Peshawar, Abbottabad, Swat, or D.I. Khan).\n- **Required Documentation:** Submit a written application along with attested photocopies of your Matric Science Detailed Marks Certificate (DMC), Domicile certificate, CNIC/B-Form, and paid application fee voucher.\n- **Resolution:** Valid objections will be corrected before the compilation of the final merit selection list.",
      "### Candidate Privacy & Security Notice",
      "In strict adherence to official privacy and candidate security protocols, **CareerDost does NOT host or mirror private candidate marks sheets, personal phone numbers, or CNIC databases**. Candidates are directed exclusively to official PHSA Khyber Pakhtunkhwa portals.",
      "### Frequently Asked Questions (FAQs)",
      "**Q1: How can I download the PHSA Paramedic Merit List 2026 PDF?**\nVisit [phsa.edu.pk/notice-details](https://www.phsa.edu.pk/notice-details), locate Notice #40, and select the PDF download link for your respective training institute.\n\n**Q2: What should I do if my name is missing from the list?**\nIf you submitted a complete application and paid fee before the deadline but your name is omitted, visit your respective institute admission desk with your original paid fee voucher and submission receipt immediately.\n\n**Q3: When will the Final Selection List be announced?**\nPHSA publishes the Final Selection Call List following the scrutiny and resolution of all candidate objections. The call list includes interview dates and semester fee submission deadlines.",
      "### Official Verification Links",
      "- **Official PHSA Notice Board:** [phsa.edu.pk/notice-details](https://www.phsa.edu.pk/notice-details)\n- **PHSA Main Website:** [phsa.edu.pk](https://www.phsa.edu.pk/)\n- **Related KP Health Coverage:** [KP Government BS Nursing Admissions 2026–2030](/jobs/phsa-kp-bs-nursing-admissions-2026)"
    ]
  });

  // -------------------------------------------------------------
  // B. EZY Business Applications Internship (ezy-business-applications-paid-internship-karachi-2026)
  // -------------------------------------------------------------
  console.log('\n--- B. Updating EZY Business Applications Internship Article ---');
  await updateArticle(apiBase, jwt, localDb, 'ezy-business-applications-paid-internship-karachi-2026', {
    seoTitle: 'EZY Paid Internship Karachi 2026 — Rs 30,000 — CareerDost',
    metaDescription: 'Apply for EZY Business Applications paid sales internship in Karachi. Rs 30,000 stipend, night shift (6 PM–3 AM), Gulistan-e-Johar location. Apply by 31 Oct.',
    excerpt: 'EZY Business Applications is hiring Sales Interns in Gulistan-e-Johar, Karachi. Rs 30,000 monthly stipend, 3-month duration, night shift (6 PM–3 AM). Review shift disclosures, requirements, and apply by 31 October 2026.',
    content: [
      "### Executive Overview: Paid Sales Internship in Karachi",
      "**EZY Business Applications**, a growing software and digital business solutions provider based in Karachi, is accepting applications for its **Paid Sales Internship Program (October–November 2026)**. Based at their **Gulistan-e-Johar (Block 3)** office, this 3-month paid program offers comprehensive on-the-job training in international corporate business development, sales pipeline management, and client relationship handling.",
      "> [!IMPORTANT]\n> **Key Internship Parameters at a Glance:**\n> - **Hiring Company:** EZY Business Applications\n> - **Designation:** Sales Intern (Paid Corporate Internship)\n> - **Monthly Stipend:** **PKR 30,000 per month** + performance-based incentive bonuses\n> - **Program Duration:** 3 Months (with fast-track conversion to full-time employment upon performance review)\n> - **Work Location:** On-site at Gulistan-e-Johar (Block 3), Karachi, Sindh\n> - **Working Schedule:** **Night Shift (6:00 PM to 3:00 AM PST, Monday through Friday)**\n> - **Application Window:** Open through **31 October 2026**\n> - **Official HR Application Email:** `hr@ezyapps.net` (Subject: *Sales Intern - Karachi*)",
      "### Crucial Shift & Commute Disclosures",
      "> [!WARNING]\n> **Mandatory Candidate Suitability Requirements:**\n> - **Night-Shift Commitment:** This role strictly operates on international business hours (**6:00 PM to 3:00 AM PST**). Applicants must be physically able and available to work night hours consistently.\n> - **Commute Reliability:** Candidates must reside within reasonable commuting distance of **Gulistan-e-Johar** or possess reliable personal transportation for late-night return commutes.\n> - **Gender Inclusivity:** The company provides a professional, CCTV-monitored office environment. Female candidates are welcome to apply provided night shift hours align with personal transport arrangements.",
      "### Eligibility Criteria & Required Skillsets",
      "- **Academic Qualifications:** Intermediate (HSSC), Bachelor’s degree (BBA, BS English, BS Media, or Commerce), or fresh university graduates.\n- **Language Proficiency:** **100% Fluent Spoken & Written English** is mandatory. Interns interact directly with international B2B clients across North American and European time zones.\n- **Communication Skills:** Confident telephone etiquette, professional email correspondence, and active listening skills.\n- **Experience Level:** **Fresh candidates are strongly encouraged**. Prior customer support, telemarketing, or cold-calling exposure is an added advantage.",
      "### Core Training Modules & Daily Responsibilities",
      "During the 3-month paid internship, participants receive direct mentorship under senior account executives:\n1. **Lead Generation & Market Prospecting:** Utilizing B2B sales databases and LinkedIn Sales Navigator to identify qualified enterprise leads.\n2. **Outbound Client Engagement:** Conducting discovery calls, scheduling product demonstrations, and managing pipeline follow-ups.\n3. **CRM Architecture:** Gaining hands-on proficiency with modern CRM software, tracking deal stages, and recording customer interaction logs.\n4. **Negotiation & Objection Handling:** Learning value-based consultative selling and closing techniques.",
      "### Benefits & Compensation Package",
      "- **Fixed Monthly Stipend:** **Rs. 30,000** disbursed monthly.\n- **Performance Incentives:** Additional commission payouts based on successfully booked client meetings and closed transactions.\n- **Medical & Paid Leave:** Standard company casual leave policy applies.\n- **Career Pathway:** High-performing interns are offered permanent, full-time Business Development Executive (BDE) roles at conclusion.",
      "### How to Apply Directly",
      "1. Update your CV/Resume highlighting your educational background, English communication capabilities, and Karachi residential address.\n2. Send your CV via email to **`hr@ezyapps.net`**.\n3. **Subject Line Requirement:** Set subject to: `Application for Sales Intern - [Your Full Name]`.\n4. You may also apply through verified listings on Pakistani job boards such as *Mustakbil.com* and *Rozee.pk*.\n5. **Closing Date:** Submit applications before the final deadline on **Saturday, 31 October 2026**.",
      "### Frequently Asked Questions (FAQs)",
      "**Q1: Is this internship remote or on-site?**\nThis is a 100% on-site internship located at EZY Business Applications, Block 3, Gulistan-e-Johar, Karachi.\n\n**Q2: What are the shift hours?**\nThe working schedule is Monday to Friday, 6:00 PM to 3:00 AM (night shift).\n\n**Q3: Are fresh graduates eligible to apply?**\nYes. Fresh graduates and intermediate certificate holders with strong spoken English fluency are eligible.\n\n**Q4: Is the Rs 30,000 stipend guaranteed?**\nYes. The PKR 30,000 monthly stipend is fixed, with additional performance incentives.",
      "### Official Verification & Related Links",
      "- **Company Website:** [ezyapps.net](https://ezyapps.net/)\n- **Official HR Contact:** `hr@ezyapps.net`\n- **Related Karachi Opportunities:** Explore [Bank of Punjab Karachi Manager Jobs 2026](/jobs/bank-of-punjab-karachi-manager-jobs-2026) and [Memon College of Nursing BSN Admissions 2026](/jobs/memon-college-of-nursing-karachi-bsn-admissions-2026-27)."
    ]
  });

  // -------------------------------------------------------------
  // C. NTS NAT-XI November 2026 (nts-nat-xi-2026-november-registration-guide)
  // -------------------------------------------------------------
  console.log('\n--- C. Updating NTS NAT-XI November 2026 Article ---');
  await updateArticle(apiBase, jwt, localDb, 'nts-nat-xi-2026-november-registration-guide', {
    seoTitle: 'NTS NAT-XI November 2026: Test & Slip Date — CareerDost',
    lastDate: '2026-10-26 (Registration Closed)',
    metaDescription: 'NTS NAT-XI November 2026 registration closed on 26 Oct. E-roll number slips issue on 3 Nov, and test takes place 15 Nov. Check slip download & result dates.',
    excerpt: 'NTS NAT-XI (November 2026) online registration closed on 26 October 2026. E-roll number slips are scheduled for issuance on 3 November, with the nationwide test taking place on Sunday, 15 November 2026.',
    content: [
      "### Official Status Update: NTS NAT-XI (November 2026)",
      "> [!IMPORTANT]\n> **Registration Closed — Examination Schedule Active:**\n> - **Online Registration Window:** Officially **CLOSED on Monday, 26 October 2026** (23:59 PST).\n> - **Project Code:** 2611311 (NAT-XI 2026)\n> - **E-Roll Number Slip Upload Date:** **Tuesday, 3 November 2026** on `nts.org.pk`\n> - **Nationwide Test Date:** **Sunday, 15 November 2026**\n> - **Result Declaration Date:** **Monday, 23 November 2026**\n>\n> Fresh online applications and new fee challan generation are no longer accepted for the November NAT session. Registered applicants should prepare for admit card downloads on 3 November.",
      "### Official NTS NAT-XI Examination Calendar 2026",
      "According to the official **National Testing Service (NTS) Schedule 2026**, the key operational milestones for NAT-XI are confirmed as follows:",
      "| OPERATIONAL MILESTONE | OFFICIAL NTS SCHEDULE DATE | STATUS |\n| :--- | :--- | :--- |\n| **Official Announcement Date** | Monday, 12 October 2026 | Completed |\n| **Online Form Submission Deadline** | **Monday, 26 October 2026** | **CLOSED** |\n| **Issuance of E-Roll Number Slips** | **Tuesday, 3 November 2026** | **Upcoming** |\n| **Nationwide Written Test Date** | **Sunday, 15 November 2026** | **Confirmed** |\n| **Official Result Announcement** | **Monday, 23 November 2026** | **Scheduled** |",
      "### How to Download NTS NAT-XI Roll Number Slip (Available 3 Nov)",
      "Registered candidates can download their individualized test admit card on or after **3 November 2026** by following these steps:\n1. Visit the official NTS portal at [nts.org.pk](https://www.nts.org.pk/).\n2. Navigate to the **Roll Number Slip** / **Candidate Portal** section.\n3. Select **NAT-XI (2026) - Project 2611311** from the active test list.\n4. Enter your 13-digit **CNIC Number** (without dashes).\n5. Enter the security captcha and click **Search / Download**.\n6. Print your colored or black-and-white admit card containing your test center, reporting time, and roll number.",
      "### Test Day Rules & Mandatory Checklist",
      "- **Original Identity Proof:** Bring your original Computerized National Identity Card (CNIC), Juvenile Card, or original Passport. Photocopies are strictly rejected.\n- **Printed Admit Card:** A clear printed copy of the NTS Roll Number Slip.\n- **Writing Material:** Black or blue ballpoint pens and a clean clipboard. Lead pencils and markers are barred.\n- **Electronic Gadgets Prohibited:** Cellphones, smartwatches, digital calculators, and Bluetooth accessories are barred from all testing halls.",
      "### NAT Paper Structure & Discipline Categories",
      "The 90-minute examination carries 90 multiple-choice questions (MCQs) structured across four core sections:\n- **Verbal Reasoning (20 MCQs):** Synonyms, antonyms, sentence completion, analogies, and reading comprehension.\n- **Analytical Reasoning (20 MCQs):** Analytical deduction, scenario puzzles, and logical relations.\n- **Quantitative Reasoning (20 MCQs):** Basic arithmetic, algebra, percentages, ratios, and geometry.\n- **Subject-Specific Knowledge (30 MCQs):** Discipline-based questions based on intermediate academic background:\n  - *NAT-IE:* Pre-Engineering (Physics, Chemistry, Math)\n  - *NAT-IM:* Pre-Medical (Physics, Chemistry, Biology)\n  - *NAT-IA:* Arts & Humanities (Civics, Economics, Islamiyat)\n  - *NAT-ICS:* Computer Science (Physics, Math, Computer Science)\n  - *NAT-ICOM:* General Commerce (Accounting, Commerce, Economics)\n  - *NAT-IGS:* General Science (Math, Statistics, Computer/Physics)",
      "### Next Available Session: NAT-XII (December 2026)",
      "Candidates who missed the 26 October deadline for NAT-XI can apply for the final session of the calendar year:\n- **Upcoming Session:** NAT-XII (December 2026)\n- **Registration Window:** Expected to open in mid-November 2026 on `nts.org.pk`.\n- **December Test Date:** Scheduled for mid-December 2026 for Spring 2027 late admissions.",
      "### Frequently Asked Questions (FAQs)",
      "**Q1: Can I still apply for NTS NAT-XI November 2026?**\nNo. The application deadline closed on Monday, 26 October 2026. You can register for the upcoming NAT-XII December session.\n\n**Q2: When will NAT-XI roll number slips be released?**\nE-roll number slips will be available for download starting Tuesday, 3 November 2026 on the NTS website.\n\n**Q3: When is the NAT-XI test date?**\nThe nationwide test will take place on Sunday, 15 November 2026.\n\n**Q4: How long is the NTS NAT score valid?**\nNAT results remain valid for exactly **one calendar year** from the date of result declaration for admissions across all participating universities.",
      "### Official Links & Verification Resources",
      "- **Official NTS Website:** [nts.org.pk](https://www.nts.org.pk/)\n- **NTS Schedule Calendar:** [nts.org.pk/Schedule](https://www.nts.org.pk/)\n- **Related CareerDost Guides:** [SPSC CCE-2026 Screening Test Date & Guide](/jobs/spsc-cce-2026-screening-test-date), [Memon College of Nursing BSN Admissions 2026](/jobs/memon-college-of-nursing-karachi-bsn-admissions-2026-27)"
    ]
  });

  // -------------------------------------------------------------
  // D. Memon College of Nursing (memon-college-of-nursing-karachi-bsn-admissions-2026-27)
  // -------------------------------------------------------------
  console.log('\n--- D. Updating Memon College of Nursing Article ---');
  await updateArticle(apiBase, jwt, localDb, 'memon-college-of-nursing-karachi-bsn-admissions-2026-27', {
    seoTitle: 'Memon College of Nursing 2026 BSN Admissions — CareerDost',
    lastDate: '2026-10-30',
    metaDescription: 'Apply online for Memon College of Nursing Karachi BSN admissions 2026–27 via NTS portal. Check Rs 3,000 fee, eligibility criteria, and 30 October deadline.',
    excerpt: 'Memon College of Nursing (MCON) at Memon Hospital Karachi has opened admissions for the 4-Year BSN Generic Degree Program (2026–27) affiliated with Dow University (DUHS). Apply online via NTS by 30 October 2026.',
    content: [
      "### Institutional Admission Notice: Memon College of Nursing Karachi (Batch-X)",
      "The **Memon College of Nursing (MCON)**, operating under the **Memon Medical Institute Hospital (MMIH)** campus in Safoora Goth / KDA Scheme 33, Karachi, is accepting online applications for admission to the **4-Year Generic Bachelor of Science in Nursing (BSN) Degree Program (Academic Session 2026–2027)**.",
      "> [!IMPORTANT]\n> **Key Admission Parameters & Deadlines:**\n> - **Program:** BSN Generic (4-Year Professional Nursing Degree)\n> - **Affiliating University:** **Dow University of Health Sciences (DUHS)**\n> - **Statutory Accreditation:** **Pakistan Nursing & Midwifery Council (PNMC)**\n> - **Clinical Training Hospital:** Memon Medical Institute Hospital (MMIH) — 332-bed tertiary care hospital\n> - **Testing Agency:** **National Testing Service (NTS)**\n> - **Application Mode:** Strictly online via NTS portal (`nts.org.pk`)\n> - **NTS Test Processing Fee:** **Rs. 3,000** (Payable via 1Link 1Bill, EasyPaisa, JazzCash, ATM)\n> - **Final Application Deadline:** **Friday, 30 October 2026**\n> - **Admission Helpline:** `021-34546930` / `021-34691147`",
      "### Eligibility Criteria for BSN (Generic)",
      "- **Academic Qualification:** F.Sc (Pre-Medical) with minimum **50% marks** (Physics, Chemistry, and Biology mandatory) from a recognized Board of Intermediate and Secondary Education (BISE).\n- **Age Bracket:** **14 to 35 Years** as of the closing date, strictly conforming to PNMC regulatory guidelines.\n- **Gender Allocation:** Open to both **Male and Female** candidates across Sindh and Pakistan.\n- **Domicile:** Sindh domicile preferred; national applicants welcome subject to open-merit allocation.",
      "### Step-by-Step Online Application Procedure",
      "1. **Access NTS Portal:** Visit the official National Testing Service portal at [nts.org.pk](https://www.nts.org.pk/).\n2. **Locate Admission Project:** Click on **Memon College of Nursing, Karachi - BSN Generic (Session 2026-27)**.\n3. **Candidate Registration:** Sign up using your CNIC/B-Form number and create a candidate password.\n4. **Fill Application Profile:** Enter your personal information, Matriculation science marks, and F.Sc Pre-Medical marks.\n5. **Generate 1Link 1Bill Fee Voucher:** Download the system-generated fee voucher of **Rs. 3,000**.\n6. **Deposit Fee:** Pay via any 1Bill-supported banking app, ATM, JazzCash, EasyPaisa, or TCS express counter.\n7. **Final Submission:** Confirm your payment status on the NTS portal and print your completed application confirmation page before **Friday, 30 October 2026**.",
      "> [!WARNING]\n> **Important Admission Safeguards:**\n> - Handwritten or manual paper admission forms are **strictly rejected** by MCON and NTS.\n> - Candidates awaiting F.Sc supplementary or re-checking results must present verified provisional result sheets.\n> - Appearing in the NTS aptitude test is mandatory for consideration in final merit lists.",
      "### Selection Framework & Clinical Training Advantages",
      "Admissions follow a transparent, merit-driven sequence:\n1. **Written Aptitude Test (via NTS):** English, Biology, Chemistry, Physics, and General Knowledge.\n2. **Panel Interview:** Personal interview and behavioral evaluation conducted at the MMIH campus.\n3. **Medical Fitness:** Comprehensive medical screening through MMIH clinical diagnostics.\n4. **Hospital Rotations:** Enrolled students complete clinical clerkships in ICU, CCU, Emergency, Pediatrics, and Surgery wards at Memon Hospital.",
      "### Frequently Asked Questions (FAQs)",
      "**Q1: What is the last date to apply for Memon College of Nursing BSN 2026?**\nThe official deadline for online form submission on NTS is **Friday, 30 October 2026**.\n\n**Q2: What is the NTS test fee?**\nThe application and test fee is Rs. 3,000 payable via 1Bill banking channels.\n\n**Q3: Is Memon College of Nursing recognized by PNMC and DUHS?**\nYes. MCON is recognized by the Pakistan Nursing & Midwifery Council (PNMC) and affiliated with Dow University of Health Sciences (DUHS).\n\n**Q4: Can male students apply for BSN Generic?**\nYes. The program is open to both male and female candidates.",
      "### Official Verification Links",
      "- **Official NTS Portal:** [nts.org.pk](https://www.nts.org.pk/)\n- **Memon Medical Institute Hospital:** [mmi.edu.pk](https://mmi.edu.pk/)\n- **Related Sindh Health Programs:** [Sindh Courts Jobs 2026 Walk-in Schedule](/jobs/sindh-courts-bps-1-4-jobs-2026), [PHSA Paramedic General Merit List 2026](/jobs/phsa-paramedic-general-list-2026)"
    ]
  });

  // -------------------------------------------------------------
  // E. Bank of Punjab Karachi Manager Jobs (bank-of-punjab-karachi-manager-jobs-2026)
  // -------------------------------------------------------------
  console.log('\n--- E. Updating Bank of Punjab Karachi Manager Jobs Article ---');
  await updateArticle(apiBase, jwt, localDb, 'bank-of-punjab-karachi-manager-jobs-2026', {
    seoTitle: 'Bank of Punjab (BOP) Karachi Jobs 2026 — Manager Openings',
    lastDate: '2026-10-29 (Closing Today)',
    metaDescription: 'The Bank of Punjab (BOP) announced managerial vacancies in Karachi. Regional Manager Alliances closes 29 Oct 2026. Explore requirements & current BOP careers.',
    excerpt: 'The Bank of Punjab (BOP) is hiring for managerial positions in Karachi across Digital Banking and Treasury Governance. The Regional Manager Alliances vacancy closes on 29 October 2026. Explore requirements and live BOP career portals.',
    content: [
      "### Executive Opportunity Overview: Bank of Punjab Karachi Region",
      "**The Bank of Punjab (BOP)**, one of Pakistan's premier scheduled commercial banking institutions operating with over 800 branches nationwide, announced specialized managerial vacancies for its **Karachi Regional Office**. These openings are situated within the bank’s **Digital Banking Group (Cards & Payment Division)** and the **Treasury & Capital Markets Group (Projects and Governance Division)**.",
      "> [!WARNING]\n> **Official Application Status Notice (Updated 29 October 2026):**\n> - **Manager - Projects and Governance (Band-9):** Official closing date was **20 October 2026** (Now Closed).\n> - **Regional Manager Alliances (Band-9 to Band-7):** Official application window closes **TODAY, Thursday, 29 October 2026**.\n> - **Fresh Opportunities:** Candidates seeking new banking positions are advised to monitor the official [BOP Available Jobs Portal](https://www.bop.com.pk/Available-Jobs) and [BOP Rozee Portal](https://bop.rozee.pk/) where new commercial, retail, and corporate banking roles are regularly advertised.",
      "### Summary Table: BOP Karachi Manager Openings",
      "| METRIC / PARAMETER | OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Hiring Institution** | The Bank of Punjab (BOP) |\n| **Designations** | Regional Manager Alliances & Manager - Projects and Governance |\n| **Corporate Groups** | Digital Banking Group (Cards & Payments) & Treasury & Capital Markets |\n| **Corporate Grades** | Band-9 to Band-7 (Mid to Senior Management) |\n| **Job Location** | Karachi, Sindh |\n| **Minimum Qualification** | 16-Year Bachelor’s Degree (Master’s preferred) from HEC-recognized university |\n| **Experience Requirement** | Minimum 4 Years of Relevant Banking or Corporate Sector Experience |\n| **Maximum Age Limit** | Up to 55 Years as of Closing Date |\n| **Application Deadlines** | **20 October 2026** (Projects & Governance) / **29 October 2026** (Alliances) |\n| **Official Career Portal** | [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs) |",
      "### Detailed Role Profiles & Responsibilities",
      "#### 1. Regional Manager Alliances — Digital Banking Group (Band-9 to Band-7)\n- **Location:** Karachi  \n- **Closing Date:** **29 October 2026** (Closing Today)  \n- **Core Functions:** Spearhead strategic commercial partnerships, merchant acquisition, loyalty discount alliances, and payment brand integrations across Sindh and Southern regions. Manage relationships with major retail brands, e-commerce platforms, and digital payment aggregators to drive debit/credit card usage and acquiring revenue.\n- **Eligibility Criteria:** Minimum Bachelor’s degree (16 years education) in Business Administration, Marketing, Economics, or Commerce from an HEC-recognized institution. Minimum 4 years of proven experience in card alliances, merchant sales, or consumer banking partnerships.",
      "#### 2. Manager - Projects and Governance — Treasury & Capital Markets Group (Band-9)\n- **Location:** Karachi  \n- **Closing Date:** **20 October 2026** (Closed)  \n- **Core Functions:** Departmental project governance, portfolio implementation tracking, statutory reporting, and audit compliance across Treasury & Capital Market operations in accordance with State Bank of Pakistan prudential regulations.\n- **Eligibility Criteria:** Minimum Bachelor’s or Master’s degree in Finance, Accounting, Business Administration, or Commerce. Minimum 4 years of solid banking experience with exposure to treasury operations, internal controls, or project management.",
      "### How to Check Live BOP Career Opportunities",
      "1. Visit the Bank of Punjab official careers page: [https://www.bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs) or [https://bop.rozee.pk/](https://bop.rozee.pk/).\n2. Filter vacancies by province (**Sindh**) and city (**Karachi**).\n3. Review the job description, eligibility parameters, and closing date for open vacancies.\n4. Complete the candidate profile and attach your structured resume directly on the portal.",
      "### Anti-Fraud & Regulatory Notice",
      "The Bank of Punjab strictly observes merit-based recruitment and State Bank of Pakistan governance codes:\n- **No Processing Fees:** BOP **never requests any registration fee, security deposit, or cash payment** at any stage.\n- **Verification:** Always verify employment notices on `bop.com.pk`.",
      "### Frequently Asked Questions (FAQs)",
      "**Q1: Can fresh graduates apply for these managerial positions?**\nNo. Both positions carry corporate rankings of Band-9/Band-7 and require at least 4 years of relevant post-qualification professional banking experience.\n\n**Q2: Is the Regional Manager Alliances position still open?**\nThe official closing date is Thursday, 29 October 2026. Candidates must submit their application before midnight tonight.\n\n**Q3: Where can I find new Bank of Punjab jobs?**\nActive openings are posted directly on [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).",
      "### Official Links & Verification Resources",
      "- **Official BOP Career Portal:** [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs)\n- **BOP Rozee Job Board:** [bop.rozee.pk](https://bop.rozee.pk/)\n- **Related Commercial Banking Openings:** [Bank of Punjab Sukkur Relationship Manager Agri Jobs 2026](/jobs/bank-of-punjab-jobs-2026-sukkur-relationship-manager-agri), [EZY Business Applications Paid Internship Karachi](/jobs/ezy-business-applications-paid-internship-karachi-2026)"
    ]
  });

  // -------------------------------------------------------------
  // F. Sindh Courts BPS 1 to 4 Jobs (sindh-courts-bps-1-4-jobs-2026)
  // -------------------------------------------------------------
  console.log('\n--- F. Updating Sindh Courts Article ---');
  await updateArticle(apiBase, jwt, localDb, 'sindh-courts-bps-1-4-jobs-2026', {
    seoTitle: 'Sindh Courts Jobs 2026: BPS 1 to 4 Walk-in — CareerDost',
    lastDate: '2026-10-31',
    excerpt: 'Sindh Courts Jobs 2026: 232 Head Office posts at High Court Karachi plus 28 District Courts under Criminal Prosecution Department. Check verified walk-in interview schedule, documents, and 31 October 2026 deadline.',
    content: [
      "### Official Recruitment Circular: Criminal Prosecution Services Department, Sindh",
      "The **Criminal Prosecution Services Department, Government of Sindh**, through the **Office of the Prosecutor General Sindh** (located at 4th Floor, Administration Block, High Court of Sindh, Karachi), has officially published **Circular No. 000000221 (Advertisement INF-KRY No. 4363-26)** announcing walk-in interviews for regular **BPS-01 to BPS-04 vacancies**.",
      "The recruitment drive covers **232 posts at the Head Office in Karachi** and Class-IV positions across **all 28 District Public Prosecutor Offices** throughout Sindh.",
      "> [!IMPORTANT]\n> **Official Recruitment Parameters & Schedule:**\n> - **Issuing Authority:** Office of the Prosecutor General, High Court of Sindh Building, Karachi\n> - **Cadres:** Naib Qasid (BPS-01), Driver (BPS-04), Dispatch Rider (BPS-04), Chowkidar (BPS-01), Sanitary Worker (BPS-01)\n> - **Head Office Posts:** 232 Regular Vacancies\n> - **District Coverage:** 28 District Public Prosecutor Offices across Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas, and Shaheed Benazirabad divisions\n> - **Selection Mode:** Direct Walk-in Interviews with original documents\n> - **Interview Cutoff Deadline:** **Saturday, 31 October 2026**",
      "### Quick Summary Table: Sindh Courts Walk-in Recruitment",
      "| PARAMETER | OFFICIAL DETAILS |\n| :--- | :--- |\n| **Hiring Department** | Criminal Prosecution Services Department, Government of Sindh |\n| **Recruitment Authority** | Office of the Prosecutor General Sindh, High Court Building, Karachi |\n| **Announced Grades** | BPS-01 to BPS-04 Regular Posts |\n| **Total Head Office Posts** | **232 Vacancies** |\n| **Eligible Domicile** | Sindh Province (Karachi Domicile for Head Office; Respective District Domicile for Field Offices) |\n| **Age Limit** | **18 to 28 Years** (Plus 15 Years General Age Relaxation granted by Govt of Sindh) |\n| **Academic Qualifications** | Primary, Middle, and Matriculation depending on post |\n| **Walk-in Interview Period** | Active through **31 October 2026** |\n| **Official Application Mode** | Direct appearance with original dossier at announced venues |",
      "### District-Wise Interview Locations & Venues",
      "Candidates must report in person to their designated interview venue corresponding to their district domicile:\n- **Karachi Division (Head Office & Districts):** Office of the Prosecutor General, 4th Floor, Administration Block, High Court of Sindh, Karachi.\n- **Hyderabad Division:** Office of the District Public Prosecutor, Sessions Court Complex, Hyderabad.\n- **Sukkur Division:** Office of the District Public Prosecutor, District Courts Building, Sukkur.\n- **Larkana Division:** Office of the District Public Prosecutor, Sessions Court, Larkana.\n- **Mirpurkhas Division:** Office of the District Public Prosecutor, Mirpurkhas.\n- **Shaheed Benazirabad Division:** Office of the District Public Prosecutor, Nawabshah.",
      "### Mandatory Document Dossier for Walk-in Interview",
      "Candidates must present original credentials along with two sets of attested photocopies:\n1. Detailed CV / Handwritten Application specifying the applied post.\n2. Original CNIC (Computerized National Identity Card).\n3. Original Domicile Certificate and Permanent Residence Certificate (PRC / Form-D) of Sindh.\n4. Educational Certificates (Primary/Middle/Matric School Leaving Certificates or DMC).\n5. Valid LTV/HTV Driving License (strictly for Driver and Dispatch Rider applicants).\n6. Four (04) recent passport-sized photographs.",
      "### Related Current Sindh Government Jobs & Opportunities",
      "> [!NOTE]\n> **Explore Other Verified, Active Sindh Opportunities on CareerDost:**\n> - [SPSC CCE-2026 Screening Test on 28 Nov & Apply by 11 Nov Deadline](/jobs/spsc-cce-2026-screening-test-date) — Provincial executive cadres (AC, SO, ETO) under historic 33-year age limit and 5-attempt reforms.\n> - [Sindh Government Jobs 2026 Comprehensive Vacancy Guide](/jobs/sindh-government-jobs-2026-spsc-sts-vacancies-apply-online) — Department-wise breakdown covering SPSC, STS, High Court, and Secretariat openings.\n> - [Sindh Education RSU Consultant Jobs 2026 (PPS-8/PPS-9)](/jobs/sindh-education-rsu-consultant-jobs-2026) — Social Safeguard and Learning Specialist advisory roles.",
      "### Frequently Asked Questions (FAQs)",
      "**Q1: What is the last date for walk-in interviews?**\nWalk-in interviews across designated divisional centers continue through **Saturday, 31 October 2026**.\n\n**Q2: What is the age limit with Sindh Government relaxation?**\nThe base age limit is 18 to 28 years. Under the general 15-year age relaxation notification issued by the Government of Sindh, candidates up to 43 years are eligible.\n\n**Q3: Can candidates from other provinces apply?**\nNo. Candidates must hold a permanent domicile and PRC (Form-D) of Sindh province.\n\n**Q4: Is there an application fee for these posts?**\nNo. The Criminal Prosecution Services Department does not charge any application or testing fee.",
      "### Official Verification Links",
      "- **High Court of Sindh Official Portal:** [sindhhighcourt.gov.pk](https://sindhhighcourt.gov.pk/)\n- **Government of Sindh Official Portal:** [sindh.gov.pk](https://sindh.gov.pk/)\n- **SIBA Testing Services (STS):** [apply.sts.net.pk](https://apply.sts.net.pk/)"
    ]
  });

  // -------------------------------------------------------------
  // G. Sindh Wheat Subsidy (sindh-wheat-subsidy-benazir-hari-card-2026)
  // -------------------------------------------------------------
  console.log('\n--- G. Updating Sindh Wheat Subsidy Article ---');
  await updateArticle(apiBase, jwt, localDb, 'sindh-wheat-subsidy-benazir-hari-card-2026', {
    seoTitle: 'Sindh Wheat Subsidy 2026: Benazir Hari Card — CareerDost',
    metaDescription: 'Sindh Wheat Subsidy 2026–27 approved: Rs 4,000/acre DAP fertilizer relief & Rs 2,000/maund procurement incentive via Benazir Hari Card. Check eligibility.',
    excerpt: 'Sindh Cabinet and Agriculture Department approved the Rabi 2026–27 wheat support framework providing Rs 4,000 per acre DAP fertilizer relief and a Rs 2,000/maund procurement incentive via Benazir Hari Card. Check Form-VII verification rules.',
    content: [
      "### Executive Summary: Approved Wheat Support Framework (October 2026)",
      "The **Sindh Agriculture, Supply & Prices Department**, following formal ratification by the Sindh Provincial Cabinet, has operationalized the **Sindh Wheat Growers Support Program for the Rabi 2026–27 cropping season**. Designed to lower agricultural input costs, boost provincial wheat acreage, and protect smallholder farmers, the relief package channels direct financial assistance into the digital **Benazir Hari Card (BHC)** ecosystem.",
      "> [!NOTE]\n> **Official Policy Highlights (October 2026 Cabinet Directives):**\n> - **DAP Fertilizer Relief:** Cash subsidy of **Rs. 4,000 per acre** designated for small and medium wheat growers.\n> - **Landholding Eligibility:** Minimum **1 acre** up to an upper ceiling of **25 acres** of cultivable land.\n> - **Procurement Incentive:** An additional incentive bonus of **Rs. 2,000 per maund** for verified farmers delivering harvested wheat directly to provincial Food Department centers.\n> - **Target Beneficiaries:** Approximately **550,000 verified wheat farmers** across all rural districts of Sindh.\n> - **Disbursement Partner:** Direct digital crediting via **Sindh Bank** Benazir Hari Card ATM/debit cards.\n> - **Official Registration Portal:** [benazirharicard.gos.pk](https://benazirharicard.gos.pk/)\n> - **Dedicated Helpline:** `0311-1646111` (Mon–Fri, 9:00 AM to 5:00 PM)",
      "### Core Query Themes & Subsidy Entitlements",
      "Under the verified 2026 framework, financial assistance is structured into two complementary pillars:\n1. **Direct Sowing DAP Subsidy:** A flat cash credit of **Rs. 4,000 per acre** allocated specifically for Di-Ammonium Phosphate (DAP) fertilizer procurement during early Rabi land preparation.\n2. **Harvest Delivery Incentive:** Guaranteed procurement bonus of **Rs. 2,000 per maund** disbursed above the baseline procurement rate upon official grain handover to Sindh Food Department procurement centers.",
      "### Eligibility Criteria for Sindh Wheat Growers",
      "- **Landholding Limit:** Growers cultivating between **1 and 25 acres** of land dedicated to wheat production in the 2026–27 Rabi cycle.\n- **Ownership Verification:** Landowners must hold authenticated **Form-VII / Deh / Khata land revenue records** verified by the local Mukhtiarkar (Revenue).\n- **Tenant & Sharecropper Inclusion:** Verified tenants (Haris) registered through the local union council agriculture extension office with landowner concurrence.\n- **Banking Requirement:** An activated **Sindh Bank Benazir Hari Card account** linked with the farmer's biometric CNIC.",
      "### How to Register & Verify Status on the Portal",
      "1. **Visit the Official Portal:** Access [benazirharicard.gos.pk](https://benazirharicard.gos.pk/).\n2. **Check Registration Status:** Enter your 13-digit CNIC number to verify whether your land records are pre-cleared by the Revenue Department.\n3. **Field Verification:** If unverified, visit your local **Taluka Agriculture Extension Office** with your original CNIC, land ownership title (Form-VII), and bank details.\n4. **Card Issuance:** Upon field verification, collect your biometric Benazir Hari Card from your designated **Sindh Bank** branch.\n5. **Cash Withdrawal:** The Rs. 4,000/acre subsidy is credited directly to your account and can be withdrawn via 1Link ATMs or POS biometric merchants.",
      "### Frequently Asked Questions (FAQs)",
      "**Q1: What is the subsidy amount for wheat farmers under Benazir Hari Card?**\nVerified wheat farmers receive **Rs. 4,000 per acre** for landholdings up to 25 acres, plus a Rs. 2,000/maund procurement incentive at harvest.\n\n**Q2: What is the maximum landholding eligible for the subsidy?**\nThe upper ceiling is 25 acres. Farmers owning more than 25 acres are not eligible for this smallholder relief package.\n\n**Q3: Which bank issues the Benazir Hari Card?**\nSindh Bank is the official disbursement partner managing biometric card accounts across Sindh.\n\n**Q4: Where can farmers lodge complaints or verify registration?**\nFarmers can verify records at [benazirharicard.gos.pk](https://benazirharicard.gos.pk/) or call the official helpline at `0311-1646111`.",
      "### Official Verification Links",
      "- **Benazir Hari Card Portal:** [benazirharicard.gos.pk](https://benazirharicard.gos.pk/)\n- **Government of Sindh Agriculture Department:** [sindh.gov.pk](https://sindh.gov.pk/)\n- **Related CareerDost Official Coverage:** [Sindh Government Jobs 2026 Guide](/jobs/sindh-government-jobs-2026-spsc-sts-vacancies-apply-online), [Sindh Courts BPS 1 to 4 Jobs 2026](/jobs/sindh-courts-bps-1-4-jobs-2026)"
    ]
  });

  console.log('\n=== ALL TARGETED SEO SPRINT 1 UPDATES EXECUTED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
