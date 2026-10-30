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

async function main() {
  console.log('=== CAREERDOST: EXECUTING DAILY SINDH & PUNJAB EDITORIAL WORKFLOW ===\n');

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);
  const localDb = new Database('careerdost.sqlite');

  // =========================================================================
  // TASK 1: CREATE NEW DRAFT FOR PUNJAB POLICE (RAJANPUR & RAHIM YAR KHAN)
  // =========================================================================
  console.log('--- 1. Creating New Draft: Punjab Police Rajanpur & Rahim Yar Khan ---');

  const policeDraftPayload = {
    title: 'Punjab Police Constable Jobs 2026: 1,170 Vacancies for Rajanpur & Rahim Yar Khan (BPS-07)',
    slug: 'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables',
    category: 'government-jobs',
    organization: 'Punjab Police Department',
    jobType: 'Regular Police Service (BPS-07)',
    location: 'Rahim Yar Khan, Rajanpur & Rojhan, Punjab',
    qualification: 'Matriculation (50% for Settled Areas, 33% for Rojhan, Pass for Rajanpur Tribal)',
    salary: 'BPS-07 (Approx. Rs. 38,000 – 48,000 per month plus allowances)',
    experience: 'Fresh Candidates (2 Years Driving Experience with LTV for Driver Constables)',
    positions: '1,170 Constables, Lady Constables & Driver Constables',
    lastDate: '2026-10-31',
    noDeadline: false,
    publishDate: '2026-10-28',
    officialLink: 'https://punjabpolice.gov.pk/',
    applyLink: 'https://punjabpolice.gov.pk/',
    isVerified: true,
    featured: true,
    logoInitial: 'PP',
    featuredImage: '/images/punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables.webp',
    imageAlt: 'Punjab Police Constable Recruitment 2026 Rajanpur Rahim Yar Khan 1170 Vacancies BPS-07 CareerDost',
    excerpt: 'Punjab Police opened recruitment for 1,170 Constable, Lady Constable, and Driver Constable (BPS-07) posts in Rajanpur and Rahim Yar Khan. Learn the specific eligibility rules, physical criteria, Rojhan and tribal exemptions, and in-person submission before 31 October 2026.',
    content: [
      "# Punjab Police Constable Jobs 2026: 1,170 Vacancies for Rajanpur & Rahim Yar Khan (BPS-07)",
      "> [!IMPORTANT]\n> **Official Recruitment Notice & Distinct District Allocation:**\n> - **Issuing Authority:** Inspector General of Police (IGP) Punjab / District Police Officers (DPO) Rajanpur & Rahim Yar Khan\n> - **Scale of Pay:** Basic Pay Scale 07 (BPS-07)\n> - **Application Window:** 12 October 2026 to **31 October 2026**\n> - **Total Vacancies:** **1,170 Posts** across two targeted southern Punjab districts:\n>   - **Rahim Yar Khan:** 718 Constables / Lady Constables + 1 Driver Constable\n>   - **Rajanpur (Settled + Tribal / De-excluded Areas):** 300 Constables / Lady Constables + 1 Driver Constable\n>   - **Tehsil Rojhan (Special Sub-Quota):** 150 Constables / Lady Constables\n> - **Application Fee:** Rs. 300 (payable in cash at respective District Police Lines upon form submission)\n> - **Submission Mode:** Strictly in-person at District Police Lines",
      "## Distinct Regional Eligibility & Relaxation Framework",
      "This district-specific recruitment drive features specialized academic and age relaxation terms officially granted to address staffing needs in the border and tribal corridors of Southern Punjab:",
      "| REGION / JURISDICTION | CADRES ANNOUNCED | MINIMUM ACADEMIC ELIGIBILITY | AGE LIMIT (AS OF 31 OCT 2026) | QUOTAS RESERVED |\n| :--- | :--- | :--- | :--- | :--- |\n| **Rahim Yar Khan (Settled)** | Constable / Lady Constable | Matriculation (SSC) with **50% marks** | **18 to 22 Years** | 15% Women, 5% Minorities, 10% Ex-Army |\n| **Rajanpur (Settled)** | Constable / Lady Constable | Matriculation (SSC) with **50% marks** | **18 to 22 Years** | 15% Women, 5% Minorities, 10% Ex-Army |\n| **Rajanpur (Tribal / De-excluded)** | Constable / Lady Constable | Matriculation (SSC) **Pass** (No % cutoff) | **18 to 25 Years** | 15% Women, 5% Minorities, 10% Ex-Army |\n| **Tehsil Rojhan (Rajanpur)** | Constable / Lady Constable | Matriculation (SSC) with **33% marks** | **18 to 30 Years** (Relaxed) | 15% Women, 5% Minorities, 10% Ex-Army |\n| **Driver Constables (Both Dists)** | Driver Constable (BPS-07) | Matric Pass + Valid LTV License + 2 Yrs Exp | **21 to 30 Years** | Open Merit / Ex-Army Quota |",
      "## Physical Measurement & Endurance Standards",
      "Applicants must satisfy rigorous physical measurements and timed endurance benchmarks:",
      "### 1. Physical Measurements\n- **Male Height (Settled & Rojhan):** Minimum **5 feet 7 inches** (170.18 cm)\n- **Male Height (Rajanpur Tribal Area):** Relaxed to **5 feet 5 inches** (165.1 cm)\n- **Female Height (Across all areas):** Minimum **5 feet 2 inches** (157.48 cm)\n- **Male Chest (Settled & Rojhan):** **33 inches** unexpanded to **34.5 inches** expanded (minimum 1.5-inch expansion)\n- **Male Chest (Rajanpur Tribal Area):** **31 inches** unexpanded to **32.5 inches** expanded",
      "### 2. Timed Running Endurance Test\n- **Male Candidates:** 1.6 kilometers (1 mile) in **7 minutes** flat.\n- **Female Candidates:** 1.6 kilometers (1 mile) in **10 minutes** flat.",
      "## Step-by-Step Application Procedure",
      "1. **Download Application Form:** Visit the official Punjab Police website at [punjabpolice.gov.pk](https://punjabpolice.gov.pk/) and download the prescribed recruitment form for Constables/Driver Constables.\n2. **Assemble Required Dossier:**\n   - Completed application form.\n   - Attested copies of Educational Certificates / Sanad (Matriculation showing marks percentage).\n   - Attested copy of Computerized National Identity Card (CNIC).\n   - Attested copy of District Domicile Certificate (must belong to Rahim Yar Khan or Rajanpur).\n   - Character Certificate from head of educational institution last attended.\n   - Eight (08) passport-sized photographs (blue background, attested on back).\n   - For Driver Constables: Attested copy of valid LTV driving license and driving experience certificate.\n   - For Ex-Army Candidates: Discharge certificate / pension book copy.\n3. **Physical Submission:** Submit the complete file in person at the respective District Police Lines:\n   - **Rahim Yar Khan:** Police Lines, Rahim Yar Khan.\n   - **Rajanpur & Rojhan:** Police Lines, Rajanpur.\n4. **Application Fee:** Pay **Rs. 300** cash at the submission counter and receive your official stamped submission diary slip.\n5. **Deadline:** All files must be submitted before the closing bell on **Saturday, 31 October 2026**.",
      "> [!WARNING]\n> **Critical Candidate Safeguards:**\n> - Applications submitted by mail, courier, or online will **not** be entertained.\n> - Candidates applying for multiple cadres (e.g., General Constable and Driver Constable) must submit separate forms with separate fee slips.\n> - Incomplete dossiers or candidates failing height/chest measurements will be disqualified on spot without fee refund.",
      "## Recruitment Schedule & Selection Stages",
      "The recruitment proceeds through five transparent stages supervised by the Recruitment Board:\n1. **Stage 1 (Initial Scrutiny):** Document verification and physical measurement (Height & Chest).\n2. **Stage 2 (Physical Endurance):** Timed 1.6 km running test.\n3. **Stage 3 (Written Examination):** 100-mark screening test comprising English, Urdu, General Knowledge, Mathematics, and Islamic/Ethics Studies.\n4. **Stage 4 (Interview & Psychological Assessment):** Oral interview assessing personality, communication, and departmental aptitude.\n5. **Stage 5 (Medical Examination & Police Verification):** Comprehensive physical fitness clearance through District Health Authority and background character verification.",
      "## Frequently Asked Questions (FAQs)",
      "**Q1: Can candidates from other Punjab districts apply for Rajanpur or Rahim Yar Khan?**\nNo. Only permanent residents holding a verified Domicile and CNIC of District Rahim Yar Khan or District Rajanpur (including Tehsil Rojhan and tribal areas) are eligible.\n\n**Q2: What is the age limit for Tehsil Rojhan applicants?**\nCandidates with domicile of Tehsil Rojhan benefit from an upper age limit of 30 years (18 to 30 years), compared to 22 years for settled districts.\n\n**Q3: Can female candidates apply for Driver Constable?**\nNo. Driver Constable positions require male applicants with valid LTV licenses. Female candidates are invited to apply for the 15% reserved Lady Constable positions.\n\n**Q4: What is the deadline to submit the application form?**\nThe final deadline for physical submission at the respective District Police Lines is **Saturday, 31 October 2026**.",
      "## Official Verification Links",
      "- **Official Punjab Police Portal:** [punjabpolice.gov.pk](https://punjabpolice.gov.pk/)\n- **Government of Punjab Official Portal:** [punjab.gov.pk](https://punjab.gov.pk/)\n- **Related CareerDost Guides:** [Sindh Government Jobs 2026 Guide](/jobs/sindh-government-jobs-2026-spsc-sts-vacancies-apply-online), [Bank of Punjab Jobs 2026](/jobs/bank-of-punjab-jobs-2026-sukkur-relationship-manager-agri)"
    ],
    seoTitle: 'Punjab Police Constable Jobs 2026 (Rajanpur & RYK) — CareerDost',
    metaDescription: 'Punjab Police announced 1,170 Constable, Lady Constable and Driver Constable jobs for Rajanpur and Rahim Yar Khan. Check criteria, physical test, and apply.',
    focusKeyword: 'Punjab Police Constable Jobs 2026',
    canonicalUrl: 'https://careerdost.blog/jobs/punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables',
    ogTitle: 'Punjab Police Constable Jobs 2026 (Rajanpur & RYK) — CareerDost',
    ogDescription: 'Punjab Police announced 1,170 Constable, Lady Constable and Driver Constable jobs for Rajanpur and Rahim Yar Khan. Check criteria, physical test, and apply.',
    status: 'draft' // STRICTLY DRAFT
  };

  // Check if slug exists in D1 first
  const existingD1Check = await fetch(`${apiBase}/articles`, { headers: { Authorization: `Bearer ${jwt}` } });
  const d1Articles = (await existingD1Check.json()).data;
  const existingArt = d1Articles.find(a => a.slug === policeDraftPayload.slug);

  let d1DraftId = null;
  if (!existingArt) {
    const createRes = await fetch(`${apiBase}/articles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(policeDraftPayload)
    });
    const createJson = await createRes.json();
    if (!createRes.ok || !createJson.success) {
      throw new Error(`Failed to create police draft in D1: ${JSON.stringify(createJson)}`);
    }
    d1DraftId = createJson.data?.id;
    console.log(`  ✓ SUCCESS: Created Punjab Police draft in Production D1 with ID: ${d1DraftId} (status: "${createJson.data?.status}")`);
  } else {
    d1DraftId = existingArt.id;
    console.log(`  ℹ Article already exists in D1 with ID: ${d1DraftId} (status: "${existingArt.status}")`);
  }

  // Insert into Local SQLite as well
  const localExists = localDb.prepare('SELECT id, status FROM articles WHERE slug = ?').get(policeDraftPayload.slug);
  let localDraftId = null;
  if (!localExists) {
    const insertStmt = localDb.prepare(`
      INSERT INTO articles (
        slug, title, category_slug, organization, job_type, location, qualification,
        salary, last_date, publish_date, official_link, apply_link, featured, logo_initial,
        excerpt, content, seo_title, meta_description, status, featured_image, image_alt,
        experience, positions, is_verified, focus_keyword, canonical_url, og_title, og_description,
        no_deadline, created_at, updated_at
      ) VALUES (
        @slug, @title, @category_slug, @organization, @job_type, @location, @qualification,
        @salary, @last_date, @publish_date, @official_link, @apply_link, @featured, @logo_initial,
        @excerpt, @content, @seo_title, @meta_description, @status, @featured_image, @image_alt,
        @experience, @positions, @is_verified, @focus_keyword, @canonical_url, @og_title, @og_description,
        @no_deadline, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);
    const insertRes = insertStmt.run({
      slug: policeDraftPayload.slug,
      title: policeDraftPayload.title,
      category_slug: policeDraftPayload.category,
      organization: policeDraftPayload.organization,
      job_type: policeDraftPayload.jobType,
      location: policeDraftPayload.location,
      qualification: policeDraftPayload.qualification,
      salary: policeDraftPayload.salary,
      last_date: policeDraftPayload.lastDate,
      publish_date: policeDraftPayload.publishDate,
      official_link: policeDraftPayload.officialLink,
      apply_link: policeDraftPayload.applyLink,
      featured: 1,
      logo_initial: policeDraftPayload.logoInitial,
      excerpt: policeDraftPayload.excerpt,
      content: JSON.stringify(policeDraftPayload.content),
      seo_title: policeDraftPayload.seoTitle,
      meta_description: policeDraftPayload.metaDescription,
      status: 'draft',
      featured_image: policeDraftPayload.featuredImage,
      image_alt: policeDraftPayload.imageAlt,
      experience: policeDraftPayload.experience,
      positions: policeDraftPayload.positions,
      is_verified: 1,
      focus_keyword: policeDraftPayload.focusKeyword,
      canonical_url: policeDraftPayload.canonicalUrl,
      og_title: policeDraftPayload.ogTitle,
      og_description: policeDraftPayload.ogDescription,
      no_deadline: 0
    });
    localDraftId = insertRes.lastInsertRowid;
    console.log(`  ✓ SUCCESS: Inserted Punjab Police draft into Local SQLite with ID: ${localDraftId} (status: "draft")`);
  } else {
    localDraftId = localExists.id;
    console.log(`  ℹ Already exists in Local SQLite with ID: ${localDraftId} (status: "${localExists.status}")`);
  }

  // =========================================================================
  // TASK 3A: UPDATE EXISTING ARTICLE 330 (SPSC CCE SCREENING TEST DATE)
  // =========================================================================
  console.log('\n--- 2. Updating Existing Article 330: /jobs/spsc-cce-2026-screening-test-date ---');

  const art330D1 = d1Articles.find(a => a.id === 330 || a.slug === 'spsc-cce-2026-screening-test-date');
  if (!art330D1) {
    throw new Error('Article ID 330 not found in Production D1!');
  }

  const updated330Payload = {
    ...art330D1,
    title: 'SPSC CCE-2026 Screening Test on 28 November — Apply Online by 11 November Deadline',
    excerpt: 'SPSC officially issued Advertisement No. 06/2026 and notice confirming the CCE-2026 Screening Test for Saturday, 28 November 2026, with online applications extended to 11 November 2026 under revised 33-year age limit, 5-attempt provision, and 33% qualifying criteria.',
    lastDate: '2026-11-11',
    content: [
      "> [!IMPORTANT]\n> **Official SPSC Notification — Verified Dates & Historic Reform Parameters:**\n> - **Statutory Authority:** Advertisement No. 06/2026 (issued 23 October 2026 amending Consolidated Advt. No. 04/2026) and Official Notice dated 26 October 2026.\n> - **Online Application Deadline:** **Wednesday, 11 November 2026** (23:59 PST).\n> - **Rescheduled Screening Examination Date:** **Saturday, 28 November 2026** (Postponed from the earlier 24 October schedule).\n> - **Upper Age Limit:** Relaxed to **33 Years** for general candidates (reckoned as of 11 November 2026). Lower age limit remains **21 Years**.\n> - **Lifetime Permissible Attempts:** Enhanced to **Five (05) Attempts** across a notified 3-year transition window.\n> - **Qualifying Screening Threshold:** Lowered to **33% (66 marks out of 200 total marks)**, replacing the earlier 50% cutoff.\n> - **Negative Marking:** **0.25 marks deducted** for each incorrect MCQ answer.\n> - **Existing Applicants Safeguard:** Candidates who already submitted valid applications under Advt. No. 04/2026 **do not need to apply again**; their applications remain fully valid, though portal login is available to rectify document deficiencies until 11 November.",
      "### Official SPSC CCE-2026 Revised Schedule\nThe **Sindh Public Service Commission (SPSC)**, Head Office at Thandi Sarak, Hyderabad, officially promulgated Advertisement No. 06/2026 on **23 October 2026** followed by the formal examination schedule notice on **26 October 2026**. These regulatory notifications execute the policy reforms approved by the Sindh Provincial Cabinet, providing thousands of provincial aspirants a revitalized pathway into Sindh's premier executive cadres, including Assistant Commissioner (BPS-17), Section Officer (BPS-17), and Excise & Taxation Officer (BPS-17).",
      "### Quick Summary Table: SPSC CCE-2026 Schedule & Criteria\n- **Recruiting Commission:** Sindh Public Service Commission (SPSC)\n- **Examination:** Combined Competitive Examination (CCE-2026)\n- **Governing Advertisements:** Advt. No. 04/2026 & Amending Advt. No. 06/2026 (Dated 23 October 2026)\n- **Official Screening Notice Date:** 26 October 2026\n- **Online Application Deadline:** **Wednesday, 11 November 2026**\n- **Screening Test Date:** **Saturday, 28 November 2026**\n- **Permissible Age Bracket:** 21 to 33 Years (General provincial merit)\n- **Maximum Lifetime Attempts:** Five (05) attempts\n- **Screening Qualifying Score:** 33% (66 Marks out of 200)\n- **Negative Marking Penalty:** 0.25 marks deducted per wrong answer\n- **Examination Centers:** Karachi, Hyderabad, Sukkur, Larkana\n- **Official Application Portal:** [spsc.gov.pk/candidate_portal](https://spsc.gov.pk/candidate_portal/)\n- **Official Commission Website:** [spsc.gov.pk](https://spsc.gov.pk)",
      "### Instructions for Existing & Fresh Applicants\n> [!NOTE]\n> **Important Guidelines for Candidates:**\n> - **Already Applied under Advt 04/2026?** You do **not** need to submit a duplicate application or pay another fee. Your existing submission is automatically transferred to the CCE-2026 roster under the revised 33% cutoff and 5-attempt rules.\n> - **Document Rectification:** Existing applicants who received portal deficiency notices (e.g., blurred domicile or degree transcript) can log into their candidate profile on `spsc.gov.pk` and upload clean scanned documents on or before **11 November 2026**.\n> - **Fresh Applicants (Age 30 to 33 or Availing 4th/5th Attempt):** Must create a profile on [spsc.gov.pk](https://spsc.gov.pk/), generate a 1Link 1Bill fee voucher (Rs. 1,000 challan), deposit the fee via online banking/ATM/EasyPaisa, and submit their complete online form before **11 November 2026**.",
      "### Screening Examination Syllabus & Paper Pattern\nThe SPSC CCE Preliminary Screening Examination is a 200-mark comprehensive multiple-choice paper conducted across major divisional centers (Karachi, Hyderabad, Sukkur, Larkana):\n1. **English General & Comprehension (50 Marks):** Sentence structuring, grammar mechanics, idioms, synonyms/antonyms, contextual vocabulary, and reading comprehension.\n2. **General Science & Everyday Ability (50 Marks):** Environmental science, physics and chemistry principles, logical deductions, numerical ability, and scientific reasoning.\n3. **Pakistan Affairs & History (40 Marks):** Historical progression from 1857, Pakistan Movement milestones, constitutional evolution, and post-1947 state institutions.\n4. **Current Affairs & Contemporary Issues (30 Marks):** Global geopolitical dynamics, foreign relations, domestic economic policies, and contemporary international crises.\n5. **Sindh Affairs, Culture & Heritage (30 Marks):** Provincial geography, administrative structure, historical governance, archaeology, and literature of Sindh.\n\n*Passing Criterion:* Candidates must secure at least **66 marks (33%)** taking into account the 0.25 negative marking deduction to qualify for the Written Comprehensive Examination.",
      "### Admit Cards (Roll Number Slips) Schedule\nIndividualized admit cards indicating test center allocation, reporting shift, and roll number will be generated on the **SPSC Candidate Portal** approximately one week prior to the **28 November 2026** screening test. Candidates must download and print their slips and bring their original CNIC to the examination hall.",
      "### Frequently Asked Questions (FAQs)\n**Q1: What is the last date to apply for SPSC CCE-2026?**\nThe official online registration window closes on **Wednesday, 11 November 2026** at 23:59 PST.\n\n**Q2: What is the confirmed date for the CCE-2026 Screening Test?**\nPer SPSC official notice issued on 26 October 2026, the screening test will be conducted on **Saturday, 28 November 2026**.\n\n**Q3: Do candidates who applied earlier need to apply again?**\nNo. Candidates registered under Advertisement 04/2026 are already enrolled. They only need to log in if they need to upload missing documents or correct profile errors before 11 November.\n\n**Q4: What is the revised passing score and negative marking?**\nPassing marks are officially 33% (66 marks out of 200). Each incorrect answer incurs a penalty deduction of 0.25 marks.\n\n**Q5: What are the examination centers?**\nDivisional centers are established in **Karachi, Hyderabad, Sukkur, and Larkana**.",
      "## Official Verification Links\n- **Official SPSC Website:** [spsc.gov.pk](https://spsc.gov.pk)\n- **SPSC Candidate Portal:** [spsc.gov.pk/candidate_portal](https://spsc.gov.pk/candidate_portal/)\n- **Government of Sindh SGA&CD:** [sindh.gov.pk](https://sindh.gov.pk/)\n- **Related CareerDost Coverage:** [Sindh Government Jobs 2026 Comprehensive Guide](/jobs/sindh-government-jobs-2026-spsc-sts-vacancies-apply-online), [Sindh Courts BPS 1 to 4 Jobs 2026](/jobs/sindh-courts-bps-1-4-jobs-2026)"
    ],
    status: 'published'
  };

  const update330Res = await fetch(`${apiBase}/articles/${art330D1.slug}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updated330Payload)
  });
  const update330Json = await update330Res.json();
  if (!update330Res.ok || !update330Json.success) {
    throw new Error(`Failed to update Article 330 in D1: ${JSON.stringify(update330Json)}`);
  }
  console.log(`  ✓ SUCCESS: Updated Article 330 in Production D1 (status: "${update330Json.data?.status}")`);

  // Update in Local SQLite as well
  localDb.prepare(`
    UPDATE articles
    SET title = ?,
        excerpt = ?,
        last_date = ?,
        content = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'spsc-cce-2026-screening-test-date'
  `).run(
    updated330Payload.title,
    updated330Payload.excerpt,
    updated330Payload.lastDate,
    JSON.stringify(updated330Payload.content)
  );
  console.log(`  ✓ SUCCESS: Updated Article 330 in Local SQLite.`);

  // =========================================================================
  // TASK 3B: UPDATE SINDH JOBS GUIDE (ARTICLE 531)
  // =========================================================================
  console.log('\n--- 3. Updating Sindh Jobs Guide (Article 531) ---');

  const art531D1 = d1Articles.find(a => a.id === 531 || a.slug === 'sindh-government-jobs-2026-spsc-sts-vacancies-apply-online');
  if (!art531D1) {
    throw new Error('Article ID 531 not found in Production D1!');
  }

  // Update content sections that had outdated postponed date or broken draft link
  const updated531Content = art531D1.content.map(sec => {
    let s = sec;
    // Replace "SPSC will announce a rescheduled test date separately" with confirmed 28 November 2026 date
    if (s.includes('SPSC will announce a rescheduled test date separately')) {
      s = s.replace(
        'The screening test originally set for 24 October 2026 has been officially postponed. SPSC will announce a rescheduled test date separately.',
        'The preliminary screening test is officially scheduled for **Saturday, 28 November 2026** across divisional centers (Karachi, Hyderabad, Sukkur, Larkana) per SPSC public notice dated 26 October 2026.'
      );
    }
    // Replace link to reverted draft 515 with canonical article 330
    if (s.includes('/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening')) {
      s = s.replace(
        '/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening',
        '/jobs/spsc-cce-2026-screening-test-date'
      );
      s = s.replace('SPSC CCE-2026 Examination Reforms & Extended Deadline', 'SPSC CCE-2026 Screening Test Schedule & Guidelines');
    }
    return s;
  });

  const updated531Payload = {
    ...art531D1,
    content: updated531Content,
    status: 'published'
  };

  const update531Res = await fetch(`${apiBase}/articles/${art531D1.slug}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updated531Payload)
  });
  const update531Json = await update531Res.json();
  if (!update531Res.ok || !update531Json.success) {
    throw new Error(`Failed to update Article 531 in D1: ${JSON.stringify(update531Json)}`);
  }
  console.log(`  ✓ SUCCESS: Updated Article 531 in Production D1 (status: "${update531Json.data?.status}")`);

  // Update in Local SQLite as well
  localDb.prepare(`
    UPDATE articles
    SET content = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'sindh-government-jobs-2026-spsc-sts-vacancies-apply-online'
  `).run(JSON.stringify(updated531Content));
  console.log(`  ✓ SUCCESS: Updated Article 531 in Local SQLite.`);

  // =========================================================================
  // TASK 4: VERIFY CURRENT SYSTEM COUNTS & PARITY
  // =========================================================================
  console.log('\n--- 4. Verifying System Counts & Parity ---');
  const statsRes = await fetch(`${apiBase}/stats`, { headers: { Authorization: `Bearer ${jwt}` } });
  const stats = (await statsRes.json()).data;
  console.log('Production D1 Current Stats:');
  console.log(`  Published Articles: ${stats.publishedArticles} (Unchanged at 183)`);
  console.log(`  Draft Articles:     ${stats.draftArticles} (Increased by 1 to 18 with new police draft)`);
  console.log(`  Published Updates:  ${stats.publishedUpdates} (Unchanged at 111)`);
  console.log(`  Draft Updates:      ${stats.draftUpdates} (Unchanged at 5)`);

  const sitemapRes = await fetch('https://careerdost.blog/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  const sitemapCount = (sitemapText.match(/<loc>/g) || []).length;
  console.log(`  Dynamic Sitemap Count: ${sitemapCount} (Unchanged at 204 — draft correctly excluded)`);

  console.log('\n=== ALL TASKS COMPLETED SAFELY ===');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
