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

const mofaContent = [
  '### Ministry of Foreign Affairs (MoFA) Regular Recruitment Overview (32 Vacancies)',
  'The **Ministry of Foreign Affairs (MoFA)**, Government of Pakistan, has officially announced 32 regular public service vacancies across six administrative and support staff cadres through the **National Job Portal (NJP)** at [njp.gov.pk](https://njp.gov.pk).\n\nAll advertised positions are situated at the Ministry Headquarters in Islamabad (or designated provincial liaison stations) and offer regular career employment under Federal Government Basic Pay Scales ranging from **BPS-01 to BPS-14**.',
  '> [!IMPORTANT]\n> **Provincial Domicile Restriction — Balochistan Quota Only:**\n> - **Recruitment Scope:** This recruitment round is **not** an all-Pakistan open merit drive. All 32 advertised posts are strictly reserved for candidates possessing a valid **Balochistan Local / Domicile Certificate** under the Federal Government\'s special Balochistan Employment Initiative.\n> - **Eligibility Verification:** Applicants from other provinces (Punjab, Sindh, Khyber Pakhtunkhwa, ICT, AJK, or Gilgit-Baltistan) are **not eligible** for these specific 32 vacancies and should not apply.\n> - **Application Window:** Online submissions close on **Monday, 30 November 2026**.',
  '### Detailed Vacancy Breakdown & Quota Distribution',
  '| Post Designation | BPS Scale | Number of Posts | Domicile / Quota | Minimum Education | Key Technical Skill / Condition |\n| :--- | :---: | :---: | :---: | :--- | :--- |\n| **Stenotypist** | BPS-14 | 05 | Balochistan (Merit/Women/Minority) | Intermediate (FA / F.Sc / Equivalent) | Shorthand: 80 w.p.m.; Typing: 40 w.p.m.; Computer literate |\n| **Upper Division Clerk (UDC)** | BPS-13 | 03 | Balochistan | Intermediate | Basic IT Training Course (NITB) within probation |\n| **Lower Division Clerk (LDC)** | BPS-11 | 02 | Balochistan | Matriculation | Typing Speed: 30 w.p.m.; Basic IT Training Course (NITB) |\n| **Driver** | BPS-04 | 02 | Balochistan | Primary Pass | Valid LTV/HTV Driving License with traffic rules knowledge |\n| **Naib Qasid** | BPS-01 | 18 | Balochistan | Primary Pass | Physically fit for office support duties |\n| **Sanitary Worker** | BPS-01 | 02 | Balochistan (Minority quota) | Primary Pass / Literate | Sanitation and housekeeping duties |\n| **Total Positions** | — | **32** | **Balochistan Quota** | **Primary to Intermediate** | **Regular Federal Service** |',
  '### Cadre-Wise Eligibility & Educational Criteria',
  '#### 1. Stenotypist (BPS-14) — 05 Posts\n- **Minimum Qualification:** Intermediate (12 years of education) from a recognized Board of Intermediate and Secondary Education (BISE).\n- **Skill Requirements:** Minimum shorthand speed of **80 words per minute** and typing speed of **40 words per minute**. Candidates must demonstrate working proficiency in computer software (MS Word, Excel, and Windows).\n- **Age Limit:** 18 to 25 years (+ 5 years general age relaxation = maximum **30 years**).\n\n#### 2. Upper Division Clerk - UDC (BPS-13) — 03 Posts\n- **Minimum Qualification:** Intermediate (FA, F.Sc, I.Com, or equivalent) from an accredited board.\n- **Mandatory Condition:** Selected candidates must successfully undergo a 3-week Basic IT Training Course (including MS Office) conducted by the National Information Technology Board (NITB) before the end of their probation period.\n- **Age Limit:** 18 to 25 years (+ 5 years relaxation = maximum **30 years**).\n\n#### 3. Lower Division Clerk - LDC (BPS-11) — 02 Posts\n- **Minimum Qualification:** Matriculation (Secondary School Certificate) from a recognized board.\n- **Skill Requirements:** Minimum English typing speed of **30 words per minute** on a computer keyboard. Completion of a 3-week NITB IT Training Course is required prior to confirmation.\n- **Age Limit:** 18 to 25 years (+ 5 years relaxation = maximum **30 years**).\n\n#### 4. Driver (BPS-04) — 02 Posts\n- **Minimum Qualification:** Primary pass with reading/writing knowledge of Urdu.\n- **License Requirement:** Must possess a valid, authenticated LTV or HTV driving license with a clean driving history and sound knowledge of national traffic regulations.\n- **Age Limit:** 18 to 30 years (+ 5 years relaxation = maximum **35 years**).\n\n#### 5. Naib Qasid (BPS-01) — 18 Posts & Sanitary Worker (BPS-01) — 02 Posts\n- **Minimum Qualification:** Primary pass from a recognized school.\n- **Duties:** Office document dispatch, file carrying, general administrative assistance, and cleanliness maintenance.\n- **Age Limit:** 18 to 25 years (+ 5 years relaxation = maximum **30 years**).',
  '### Age Limit & Federal Age Relaxation Rules',
  'The baseline recruitment age is **18 to 25 years** as of the closing date (30 November 2026). In accordance with the Federal Government Civil Servants (Appointment, Promotion and Transfer) Rules:\n- **General Age Relaxation:** 5 years across-the-board upper age relaxation is granted to all candidates (raising the cutoff to 30 years, and 35 years for Drivers).\n- **Scheduled Castes, Buddhist Community & Recognized Tribes:** Up to 3 additional years of relaxation.\n- **Disabled Candidates:** Up to 10 years upper age relaxation for designated quotas upon production of a valid disability assessment certificate.\n- **Armed Forces Personnel:** Released or retired armed forces officers/personnel are granted up to 15 years or the number of years served, whichever is less.',
  '### Step-by-Step Online Application Procedure on NJP',
  'All applications must be submitted digitally through the Federal Government\'s centralized recruitment gateway. No physical applications or hard copies will be entertained at this stage:\n1. **Access the Portal:** Visit the official National Job Portal at [https://njp.gov.pk](https://njp.gov.pk).\n2. **Account Registration:** Register an account using your 13-digit Computerized National Identity Card (CNIC) number and active mobile phone number.\n3. **Build Candidate Profile:** Enter your personal information, address, educational qualifications, typing/shorthand skills, and upload an updated passport-size photograph.\n4. **Select Employer:** Search for **Ministry of Foreign Affairs** in the organization directory.\n5. **Apply for Specific Post:** Select your desired vacancy (e.g., Stenotypist, UDC, LDC, Driver, Naib Qasid) and confirm your Balochistan domicile details.\n6. **Submit Application:** Review your entered data carefully before final submission. Note down your unique NJP Application Tracking ID for future reference.',
  '### Anti-Scam Notice & Transparent Recruitment Standards',
  '- **Zero Application Fee:** The National Job Portal does **NOT** charge any application fee, processing fee, or security deposit for Ministry of Foreign Affairs posts. Beware of fraudulent agents claiming to process applications for money.\n- **Original Documents at Interview:** Candidates qualifying the preliminary screening or skill tests will be called for interviews and must present original CNIC, Domicile/Local certificate, Educational DMCs/Degrees, and experience certificates.\n- **Dual Applications:** Candidates possessing multiple qualifications may apply for more than one position separately through their NJP dashboard.',
  '### Frequently Asked Questions (FAQs)',
  '**Q1: Can candidates with a Punjab, Sindh, or KP domicile apply for these MoFA posts?**\nNo. All 32 vacancies announced in this batch are strictly earmarked for candidates holding a verified Balochistan Domicile / Local Certificate under the federal quota.\n\n**Q2: What is the last date to submit the application?**\nThe last date for online application submission on the National Job Portal is **30 November 2026**.\n\n**Q3: Do I need to send physical copies of certificates to the Foreign Office in Islamabad?**\nNo. Applications are accepted strictly online via `njp.gov.pk`. Shortlisted candidates will be instructed to bring physical documents at the time of practical skill tests and formal interviews.\n\n**Q4: Is any application fee required for MoFA jobs on NJP?**\nNo. Applying on the National Job Portal is completely free of cost.',
  '### Official Links & Verification Resources',
  '- **Apply Online via National Job Portal:** [njp.gov.pk](https://njp.gov.pk)\n- **Ministry of Foreign Affairs Official Website:** [mofa.gov.pk](https://mofa.gov.pk)\n- **Related Verified Federal Job Coverage:** [NEPRA Support Staff Jobs 2026](/jobs/nepra-support-staff-jobs-2026), [Cabinet Division Driver Jobs 2026](/jobs/cabinet-division-driver-jobs-bps-04-2026)'
];

const nhmpContent = [
  '### NHMP Constable / Junior Patrol Officer (BPS-07) Recruitment Overview',
  'The **National Highways & Motorway Police (NHMP)**, operating under the Ministry of Communications, Government of Pakistan, has announced **80 regular posts for Constable / Junior Patrol Officer (BPS-07)** under the Federal Government’s **Balochistan Special Employment Initiative**.\n\nAll applications are invited digitally via the **National Job Portal (NJP)** at [njp.gov.pk](https://njp.gov.pk). Selected candidates will be appointed into the premier uniformed highway law enforcement service, entitled to regular BPS-07 salary along with NHMP special risk/patrol allowances.',
  '> [!IMPORTANT]\n> **Balochistan Local / Domicile Restriction:**\n> - **Eligibility Scope:** This recruitment advertisement is strictly reserved for candidates holding a verified **Balochistan Local / Domicile Certificate**.\n> - **No Nationwide General Merit:** Candidates from other provinces (Punjab, Sindh, KPK, Islamabad, AJK, or Gilgit-Baltistan) are **not eligible** for these 80 posts.\n> - **Application Deadline:** The online registration window closes on **Thursday, 12 November 2026**.',
  '### Quota Breakdown: 80 Junior Patrol Officer Slots',
  'The 80 Constable / Junior Patrol Officer (BPS-07) positions are allocated within the Balochistan regional pool as follows:\n\n| Category / Quota Stream | Vacancy Count | Eligible Gender | Domicile Requirement | Educational Standard |\n| :--- | :---: | :---: | :---: | :--- |\n| **Balochistan Open Merit** | **44** | Male & Female | Balochistan Province | Intermediate (FA / F.Sc / 2nd Div) |\n| **Balochistan Women Quota** | **24** | Female Only | Balochistan Province | Intermediate (FA / F.Sc / 2nd Div) |\n| **Balochistan Minority Quota** | **12** | Non-Muslim Candidates | Balochistan Province | Intermediate (FA / F.Sc / 2nd Div) |\n| **Total Junior Patrol Officers** | **80** | **All Eligible Categories** | **Balochistan Only** | **Intermediate (BPS-07)** |\n\n*(Note on Recruitment Round: These 80 posts form the frontline law enforcement component of NHMP\'s wider 94-post Balochistan Special Recruitment Package, which also includes 1 Assistant, 5 Photographers, 3 Stenotypists, 3 LDCs, and 2 Paramedics).*',
  '### Mandatory Physical Fitness & Measurement Standards',
  'Because Constable / Junior Patrol Officer is an active uniformed field policing designation, candidates must meet non-negotiable physical measurements and physical endurance standards:\n\n#### 1. Physical Measurements (Balochistan Special Standards)\n- **Minimum Height (Male):** **5 feet 6 inches (5\' 6")** *(relaxed from the standard 5\' 8" for other provincial quotas)*.\n- **Minimum Height (Female):** **5 feet 3 inches (5\' 3")** *(relaxed from 5\' 4")*.\n- **Chest Measurement (Male Candidates Only):** Minimum **33 inches** with normal breathing, expanding to **34.5 to 35 inches** upon full chest expansion (1.5" to 2" mandatory expansion).\n- **Body Mass Index (BMI):** Height and weight must correspond to standard physical fitness medical charts.\n\n#### 2. Physical Endurance & Running Tests\n- **Male Candidates:**\n  - **Running:** Complete **01 Mile (1.6 km) in 09 minutes**.\n  - **Push-ups:** Minimum **10 repetitions in 01 minute**.\n  - **Crunches / Sit-ups:** Minimum **10 repetitions in 01 minute**.\n- **Female Candidates:**\n  - **Running:** Complete **01 Mile (1.6 km) in 14 minutes** (walking or running).',
  '### Educational Qualifications, Age Limits & Driving Requirements',
  '- **Educational Qualification:** Intermediate (Higher Secondary School Certificate — FA / F.Sc / I.Com / ICS or equivalent) with at least **2nd Division (minimum 45% marks)** from a recognized Board of Intermediate and Secondary Education (BISE).\n- **Age Limit:** **18 to 25 Years** as of the closing date (12 November 2026). In line with uniformed police service recruitment regulations, **no upper age relaxation** is permitted for police constable cadres unless formally authorized under specific statutory clauses.\n- **Driving License Requirement:** Candidates must hold a valid **Motorcar / Jeep and Motorcycle Driving License**. Candidates currently possessing only a learner permit must ensure their permanent license is processed prior to practical driving tests.\n- **Computer Literacy:** Basic operating knowledge of computers and keyboard handling.',
  '### Step-by-Step Selection Workflow',
  'The NHMP recruitment process is structured across four progressive screening phases:\n1. **Initial Online Scrutiny:** Preliminary verification of domicile, age, and academic qualifications submitted on NJP.\n2. **Physical Measurement & Endurance Test:** Conducted at designated police training grounds in Balochistan (Quetta and regional centers). Physical measurement of height, chest, and timed 1-mile running trials.\n3. **Written Aptitude Examination:** Multiple Choice Questions (MCQs) covering General Knowledge, Pakistan Studies, Basic English, Islamic Studies (Ethics for minorities), and Motorway / Traffic Safety Rules.\n4. **Practical Driving Test:** Demonstration of vehicle handling, reversing, parallel parking, and traffic signs comprehension before an NHMP driving evaluation board.\n5. **Interview & Medical Screening:** Final viva voce followed by comprehensive medical examination at designated government civil hospitals before dispatch to the NHMP Training College.',
  '### How to Apply Online on National Job Portal (NJP)',
  '1. **Access NJP:** Go to the official federal portal at [https://njp.gov.pk](https://njp.gov.pk).\n2. **Profile Completion:** Log in or register with your CNIC. Enter education details, height/measurements, and upload a recent photograph.\n3. **Search Post:** Select **National Highways & Motorway Police** in the department drop-down.\n4. **Choose Designation:** Select **Junior Patrol Officer (BPS-07) - Balochistan Quota**.\n5. **Verify Details:** Ensure your Balochistan district of local/domicile is accurately specified.\n6. **Submit:** Submit online before **12 November 2026**. No physical form submission is required.',
  '### Anti-Fraud & Regulatory Warning',
  '- **No Processing Fees:** NHMP does **NOT** charge any application or registration fee for submissions on the National Job Portal.\n- **Merit-Only Recruitment:** NHMP adheres to zero-tolerance anti-corruption policies. Any candidate attempting to exert external influence, present fake driving licenses, or engage middlemen will be permanently disqualified and prosecuted under the Pakistan Penal Code.\n- **Original Credentials:** Original Local/Domicile certificate, CNIC, Matric/Intermediate mark sheets, and valid Driving License are mandatory at physical testing centers.',
  '### Frequently Asked Questions (FAQs)',
  '**Q1: Can candidates from Sindh, Punjab, or KPK apply for these NHMP posts?**\nNo. This recruitment round is strictly restricted to candidates having a valid Balochistan Domicile / Local Certificate.\n\n**Q2: What is the minimum height requirement for Balochistan candidates?**\nMale candidates must be at least 5 feet 6 inches (5\' 6"), and female candidates must be at least 5 feet 3 inches (5\' 3").\n\n**Q3: Is a driving license mandatory at the time of application?**\nYes. Candidates must possess a valid Car/Jeep and Motorcycle driving license as an essential qualification for Junior Patrol Officer duties.\n\n**Q4: What is the last date to apply?**\nThe official deadline on the National Job Portal is **12 November 2026**.',
  '### Official Links & Verification Resources',
  '- **Apply Online via National Job Portal:** [njp.gov.pk](https://njp.gov.pk)\n- **National Highways & Motorway Police Official Website:** [nhmp.gov.pk](https://nhmp.gov.pk)\n- **Related Law Enforcement Career Coverage:** [Punjab Police Constable Recruitment 2026](/jobs/punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables), [Sindh Courts BPS 1-4 Walk-in Schedule](/jobs/sindh-courts-bps-1-4-jobs-2026)'
];

async function createDrafts() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  const drafts = [
    {
      title: 'Ministry of Foreign Affairs Jobs 2026: Vacancies & Apply Online',
      slug: 'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online',
      category: 'government-jobs',
      organization: 'Ministry of Foreign Affairs (MoFA), Government of Pakistan',
      jobType: 'Full Time / Regular Federal Public Service',
      location: 'Islamabad (Headquarters) / Regional Camps',
      qualification: 'Primary to Intermediate (FA / F.Sc / I.Com / Equivalent)',
      salary: 'BPS-01 to BPS-14 Federal Government Pay Scales with Allowances',
      experience: 'Fresh to Experienced (Shorthand/Typing/Driving where applicable)',
      positions: '32 Vacancies (Balochistan Special Quota Initiative)',
      lastDate: '2026-11-30',
      noDeadline: false,
      publishDate: '2026-10-29',
      officialLink: 'https://mofa.gov.pk',
      applyLink: 'https://njp.gov.pk',
      isVerified: true,
      featured: false,
      logoInitial: 'MFA',
      featuredImage: '/images/ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online.webp',
      imageAlt: 'Ministry of Foreign Affairs Islamabad Jobs 2026 Official Notice CareerDost',
      excerpt: 'The Ministry of Foreign Affairs (MoFA) has announced 32 regular vacancies under the Federal Balochistan Special Quota Initiative for Stenotypists, Clerks, Drivers, and Support Staff. Applications are accepted exclusively online via the National Job Portal by 30 November 2026.',
      content: mofaContent,
      seoTitle: 'MoFA Jobs 2026: Vacancies & Apply Online — CareerDost',
      metaDescription: 'Ministry of Foreign Affairs announces 32 vacancies under Balochistan Quota (BPS-01 to BPS-14). Check eligibility, criteria & apply on NJP by 30 Nov 2026.',
      focusKeyword: 'Ministry of Foreign Affairs Jobs 2026',
      canonicalUrl: 'https://careerdost.blog/jobs/ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online',
      ogTitle: 'MoFA Jobs 2026: Vacancies & Apply Online — CareerDost',
      ogDescription: 'Ministry of Foreign Affairs announces 32 vacancies under Balochistan Quota (BPS-01 to BPS-14). Check eligibility, criteria & apply on NJP by 30 Nov 2026.',
      status: 'draft'
    },
    {
      title: 'NHMP Jobs 2026: 80 Junior Patrol Officer Posts — Balochistan Quota Apply Online',
      slug: 'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online',
      category: 'government-jobs',
      organization: 'National Highways & Motorway Police (NHMP), Ministry of Communications',
      jobType: 'Full Time / Regular Uniformed Police Service',
      location: 'Balochistan (Highway / Motorway Patrol Sectors & Training Colleges)',
      qualification: 'Intermediate (FA / F.Sc / I.Com / Equivalent) with Minimum 2nd Division',
      salary: 'BPS-07 Federal Police Pay Scale with Motorway Police Special Allowances',
      experience: 'Fresh Candidates Meeting Mandatory Physical & Driving Standards',
      positions: '80 Posts (Constable / Junior Patrol Officer BPS-07)',
      lastDate: '2026-11-12',
      noDeadline: false,
      publishDate: '2026-10-29',
      officialLink: 'https://nhmp.gov.pk',
      applyLink: 'https://njp.gov.pk',
      isVerified: true,
      featured: false,
      logoInitial: 'NHMP',
      featuredImage: '/images/nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online.webp',
      imageAlt: 'NHMP Junior Patrol Officer Balochistan Quota Jobs 2026 Official Notice CareerDost',
      excerpt: 'National Highways & Motorway Police (NHMP) has opened online recruitment for 80 Constable / Junior Patrol Officer (BPS-07) posts under the Balochistan Special Employment Initiative. Review physical fitness criteria, quota distribution, and submit your application on NJP by 12 November 2026.',
      content: nhmpContent,
      seoTitle: 'NHMP Jobs 2026: 80 Junior Patrol Officer Posts — CareerDost',
      metaDescription: 'NHMP announces 80 Junior Patrol Officer (BPS-07) posts under Balochistan Quota on NJP. Check physical standards, eligibility & apply online by 12 Nov 2026.',
      focusKeyword: 'NHMP Jobs 2026 Junior Patrol Officer',
      canonicalUrl: 'https://careerdost.blog/jobs/nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online',
      ogTitle: 'NHMP Jobs 2026: 80 Junior Patrol Officer Posts — CareerDost',
      ogDescription: 'NHMP announces 80 Junior Patrol Officer (BPS-07) posts under Balochistan Quota on NJP. Check physical standards, eligibility & apply online by 12 Nov 2026.',
      status: 'draft'
    }
  ];

  console.log('=== SAVING DRAFTS TO PRODUCTION D1 & LOCAL SQLITE ===\n');

  for (const draft of drafts) {
    console.log(`Creating Draft: "${draft.title}" (${draft.slug})...`);

    // 1. Post to Production D1 via Admin API
    const res = await fetch('https://careerdost.blog/api/admin/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(draft)
    });

    const resJson = await res.json();
    if (!res.ok || !resJson.success) {
      console.error(`Failed to create ${draft.slug} in D1:`, resJson);
      throw new Error(`D1 draft creation failed for ${draft.slug}`);
    }

    const createdD1 = resJson.data;
    console.log(`✓ D1 Draft Created! ID: ${createdD1.id} | Status: "${createdD1.status}"`);

    // 2. Insert into Local SQLite
    const insertStmt = localDb.prepare(`
      INSERT INTO articles (
        slug, title, category_slug, organization, job_type, location,
        qualification, salary, experience, positions, last_date, no_deadline, publish_date, official_link, apply_link,
        is_verified, featured, logo_initial, featured_image, image_alt, excerpt, content, seo_title, meta_description,
        focus_keyword, canonical_url, og_title, og_description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const localResult = insertStmt.run(
      draft.slug,
      draft.title,
      draft.category,
      draft.organization,
      draft.jobType,
      draft.location,
      draft.qualification,
      draft.salary,
      draft.experience,
      draft.positions,
      draft.lastDate,
      draft.noDeadline ? 1 : 0,
      draft.publishDate,
      draft.officialLink,
      draft.applyLink,
      draft.isVerified ? 1 : 0,
      draft.featured ? 1 : 0,
      draft.logoInitial,
      draft.featuredImage,
      draft.imageAlt,
      draft.excerpt,
      JSON.stringify(draft.content),
      draft.seoTitle,
      draft.metaDescription,
      draft.focusKeyword,
      draft.canonicalUrl,
      draft.ogTitle,
      draft.ogDescription,
      draft.status
    );

    console.log(`✓ Local SQLite Draft Created! ID: ${localResult.lastInsertRowid} | Status: "draft"\n`);
  }

  console.log('=== BOTH DRAFTS CREATED AS DRAFT ONLY ===');
}

createDrafts().catch(console.error);
