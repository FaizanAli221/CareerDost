const fs = require('fs');
const crypto = require('crypto');

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
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encHeader}.${encPayload}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest());
  return `${dataToSign}.${signature}`;
}

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Fetch error (${err.message}). Retrying in ${backoff}ms...`);
      await new Promise(r => setTimeout(r, backoff));
      backoff *= 2;
    }
  }
}

async function run() {
  console.log('=== CAREERDOST: SAVING ARTICLE 2 & ARTICLE 3 AS DRAFTS VIA CMS API ===\n');

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secret = envLocal.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  // 1. Fetch current drafts to ensure idempotency
  const checkRes = await fetchWithRetry(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const checkData = await checkRes.json();
  const currentDraftSlugs = new Set((checkData.data || []).map(a => a.slug));

  // --- ARTICLE 2: PSEB Creative Lead ---
  const psebSlug = 'pseb-creative-lead-jobs-2026';
  const psebContent = [
    "# PSEB Creative Lead Jobs 2026 — PPS-8 Government IT Vacancy",
    
    "## Executive Summary & Official Recruitment Notice\n\nThe **Pakistan Software Export Board (PSEB)**, an apex autonomous body operating under the **Ministry of Information Technology and Telecommunication (MoITT), Government of Pakistan**, has officially announced a high-profile creative vacancy for **Creative Lead (PPS-08)**.\n\nVerified directly on the official [National Job Portal (NJP)](https://www.njp.gov.pk/jobs/9847) under **Job Requisition ID: 9847**, this recruitment drive invites experienced graphic designers, visual storytellers, and creative communication specialists to lead PSEB's national and international branding, promotional marketing campaigns, and digital media production.",

    "## Quick Facts Table\n\n| Attribute | Verified Official Detail |\n|---|---|\n| **Hiring Organization** | Pakistan Software Export Board (PSEB) |\n| **Ministry** | Ministry of Information Technology & Telecommunication (MoITT) |\n| **Position Title** | **Creative Lead** |\n| **Pay Scale / Grade** | **PPS-08 (Project Pay Scale-8)** |\n| **Job Requisition ID** | 9847 (NJP) |\n| **Employment Type** | Federal Project Contract |\n| **Posting Date** | 23 October 2026 |\n| **Application Deadline** | **05 November 2026 (11:59 PM PKT)** |\n| **Vacancies Announced** | 01 Position (Open Merit) |\n| **Duty Station** | Islamabad, Pakistan (PSEB Head Office) |\n| **Minimum Education** | 16 Years Degree (Management Sciences, Marketing, Business Admin, or IT) |\n| **Required Experience** | Minimum 04 Years in Professional Graphic Design, Animation, or Caricature |\n| **Maximum Age Limit** | **45 Years** (Inclusive of general relaxation) |\n| **Performance Incentive** | **3% Annual Increment** linked to KPI achievement |\n| **Official Portal Link** | [njp.gov.pk/jobs/9847](https://www.njp.gov.pk/jobs/9847) |",

    "## Core Job Responsibilities & Creative Mandate\n\nAs the Creative Lead at PSEB, the appointed officer will spearhead the visual identity and design execution across all corporate and government outreach channels:\n\n1. **Digital & Print Design Execution:** Conceptualizing and developing layouts for websites, digital campaigns, social media channels, international trade show pavilions, print advertisements, corporate brochures, and magazines.\n2. **Branding & Visual Identity Management:** Safeguarding and enhancing PSEB's brand guidelines across all stakeholder communications, ensuring visual alignment between Pakistan's national IT initiatives and global tech audiences.\n3. **Marketing Collateral & Publications:** Designing comprehensive annual reports, sector white papers, government presentations, executive decks, and high-impact investor pitch materials.\n4. **Creative Brainstorming & Concept Direction:** Leading creative brainstorms, pitching innovative design concepts, and translating strategic IT export goals into compelling visual narratives.\n5. **Cross-Departmental Collaboration:** Collaborating closely with marketing, international trade delegation, and PR teams to deliver high-quality creative assets within tight project timelines.\n6. **Annual Increment Policy:** Under official contract terms, a **3% annual salary increment** is awarded based on annual KPI milestones and performance appraisals.",

    "## Educational Qualifications & Mandatory Skillset\n\n### Minimum Educational Criteria\n- **Degree Level:** Minimum 16 years of education from an HEC-recognized local or foreign university.\n- **Accepted Disciplines:**\n  - Management Sciences\n  - Marketing or Business Development\n  - Business Administration (BBA 4-Year / MBA)\n  - Information Technology (BS IT / BS CS / Software Engineering)\n\n### Technical Experience & Design Proficiency\n- **Post-Qualification Experience:** At least **4 years** of hands-on professional experience in graphic design, digital animation, illustration, caricature, or visual brand identity.\n- **Software Mastery:** Expert proficiency in **Adobe Photoshop, Adobe Illustrator / CorelDraw, and Adobe InDesign** is mandatory.\n- **Typography & Layout Principles:** In-depth understanding of typography, color harmony, visual hierarchy, spatial balance, and print preparation standards.\n- **Office Productivity:** Well-versed in MS Office (PowerPoint, Word, Excel), internet tools, and project management applications.",

    "## Relationship to Concurrent PSEB October Vacancies\n\nCandidates should note that PSEB is currently executing two distinct hiring tracks on the National Job Portal:\n- **Creative Lead (Job ID: 9847):** Focused exclusively on visual design, creative marketing, and brand architecture with an application deadline of **05 November 2026**.\n- **HR & Research Openings (Job IDs: 9801/9802):** Covering Assistant Project Manager HR Skills (PPS-8), Research Consultant (PPS-8), and Assistant Project Officer HR Skills (PPS-7), which close earlier on **25 October 2026** (see CareerDost's coverage of [PSEB Government IT Jobs](/jobs/pseb-government-it-jobs-october-2026)).\n\nCandidates possessing creative and design backgrounds are encouraged to apply specifically under this dedicated Creative Lead announcement.",

    "## Step-by-Step Online Application Guide on NJP\n\nApplications are processed strictly through the Federal Government's centralized portal:\n\n1. Navigate to the official listing: [National Job Portal — PSEB Creative Lead (Job 9847)](https://www.njp.gov.pk/jobs/9847).\n2. Click on **Login to Apply** (or **Sign Up** using your CNIC, mobile number, and verified email if new to NJP).\n3. Complete or update your standardized NJP Resume Builder profile (education, employment history, and key software skills).\n4. Select your degree discipline and input exact CGPA / percentage as validated by your degree transcripts.\n5. Ensure your contact telephone and postal details are current.\n6. Submit the electronic application before the closing time of **05 November 2026**.\n\n> [!TIP]\n> Prepare a digital portfolio or link to your Behance / Dribbble / online creative work to provide during subsequent interview rounds.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for PSEB Creative Lead?**\nThe last date for online application submission on NJP is **05 November 2026**.\n\n**Q2: What is the pay scale for this position?**\nThe position is offered under Federal Project Pay Scale **PPS-08**, which includes performance-linked 3% annual increments.\n\n**Q3: Is an online portfolio required?**\nWhile the initial NJP application collects degree and experience details, candidates shortlisted for technical assessment and interviews will be evaluated on their creative portfolio.\n\n**Q4: What is the maximum age limit?**\nThe maximum age limit is **45 years** as of the closing date of the advertisement."
  ];

  const psebPayload = {
    title: 'PSEB Creative Lead Jobs 2026 — PPS-8 Government IT Vacancy',
    slug: psebSlug,
    category: 'government-jobs',
    organization: 'Pakistan Software Export Board (PSEB)',
    jobType: 'Federal Government Contract (PPS-08)',
    location: 'Islamabad, Pakistan',
    qualification: 'Minimum 16 Years Education in Management Sciences, Marketing, Business Admin, or IT from HEC Recognized University',
    salary: 'PPS-08 Scale (Federal Project Pay Scale + 3% Annual Increment)',
    experience: 'Minimum 04 Years Post-Qualification Experience in Graphic Design, Animation, or Related Fields',
    positions: '1 Vacancy',
    lastDate: '2026-11-05',
    noDeadline: false,
    publishDate: '2026-10-23',
    officialLink: 'https://www.njp.gov.pk/jobs/9847',
    applyLink: 'https://www.njp.gov.pk/jobs/9847',
    isVerified: true,
    featured: true,
    logoInitial: 'PSEB',
    featuredImage: '/images/pseb-creative-lead-jobs-2026.webp',
    imageAlt: 'PSEB Creative Lead Jobs 2026 PPS-8 National Job Portal CareerDost',
    excerpt: 'Pakistan Software Export Board (PSEB) has announced a PPS-08 Creative Lead vacancy on the National Job Portal (NJP). Requires 16 years education, 4 years graphic design/animation experience, and expertise in Adobe Creative Suite. Apply online before 05 November 2026.',
    content: psebContent,
    seoTitle: 'PSEB Creative Lead Jobs 2026 — PPS-8 Government IT Vacancy',
    metaDescription: 'Apply for PSEB Creative Lead Jobs 2026. Check PPS-8 eligibility, four years of experience, age limit and 5 November deadline.',
    focusKeyword: 'PSEB Creative Lead Jobs 2026',
    canonicalUrl: `https://careerdost.blog/jobs/${psebSlug}`,
    ogTitle: 'PSEB Creative Lead Jobs 2026 — PPS-8 Government IT Vacancy',
    ogDescription: 'Apply for PSEB Creative Lead Jobs 2026. Check PPS-8 eligibility, four years of experience, age limit and 5 November deadline.',
    status: 'draft'
  };

  if (currentDraftSlugs.has(psebSlug)) {
    console.log(`[SKIP] ${psebSlug} already exists as a draft in production CMS.`);
  } else {
    console.log(`Creating draft [${psebSlug}] via CMS API...`);
    const res = await fetchWithRetry(`${apiBase}/articles`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(psebPayload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(`PSEB draft creation failed: ${JSON.stringify(json)}`);
    console.log(`-> SUCCESS! Created PSEB Creative Lead draft ID: ${json.data.id} (Status: ${json.data.status})`);
  }

  // --- ARTICLE 3: Ministry of Planning (Accountant & Assistant Private Secretary) ---
  const mopSlug = 'ministry-of-planning-jobs-october-2026';
  const mopContent = [
    "# Ministry of Planning Jobs 2026 — Accountant & APS PPS-6 Vacancies",
    
    "## Executive Summary & Official Recruitment Notice\n\nThe **Ministry of Planning, Development & Special Initiatives**, Government of Pakistan, has officially announced new contractual recruitment for two key executive support positions: **Accountant (PPS-06)** and **Assistant Private Secretary (APS, PPS-06)**.\n\nVerified directly on the official **National Job Portal (NJP)** under Requisition IDs **9842** (Accountant) and **9840** (Assistant Private Secretary), these appointments are based at Islamabad to support federal development projects. Both positions offer federal project pay scales, structured public-sector experience, and merit-based selection.",

    "## Quick Facts & Comparative Overview\n\n| Attribute | Position A: Accountant | Position B: Assistant Private Secretary (APS) |\n|---|---|---|\n| **Hiring Ministry** | Ministry of Planning, Development & Special Initiatives | Ministry of Planning, Development & Special Initiatives |\n| **Pay Scale / Grade** | **PPS-06 (Project Pay Scale-6)** | **PPS-06 (Project Pay Scale-6)** |\n| **NJP Requisition ID** | **9842** | **9840** |\n| **Vacancies Announced** | **01 Position** | **01 Position** |\n| **Employment Type** | Federal Project Contract | Federal Project Contract |\n| **Posting Date** | 19 October 2026 | 19 October 2026 |\n| **Application Deadline** | **02 November 2026** | **02 November 2026** |\n| **Duty Station** | Islamabad, Pakistan | Islamabad, Pakistan |\n| **Minimum Qualification** | B.Com / Associate Degree / BBA / BS Accounting & Finance / ACCA / CA-Inter | BA / B.Com / BBA / BSc / Associate Degree (14–16 Years) |\n| **Minimum Experience** | **01 Year** in Accounting / AGPR | **02 Years** in Secretarial / Administrative Support |\n| **Age Limit** | **Max 45 Years** | **Max 50 Years** |\n| **Official NJP Apply Link** | [njp.gov.pk/jobs/9842](https://www.njp.gov.pk/jobs/9842) | [njp.gov.pk/jobs/9840](https://www.njp.gov.pk/jobs/9840) |",

    "## Position Profile A: Accountant (PPS-06) — NJP Requisition 9842\n\n### Core Accounting Functions\nThe appointed Accountant will manage day-to-day project finance, accounting reconciliations, and statutory reporting:\n1. **Preparation of NIS:** Formulating New Item Statements (NIS) for development projects in accordance with Planning Commission and Finance Division financial rules.\n2. **Cash Book & Ledger Maintenance:** Managing project cash books, processing contractor/vendor invoices, and handling official cash receipts and disbursements.\n3. **AGPR Reconciliation:** Conducting monthly and annual reconciliation of project accounts with the **Accountant General Pakistan Revenues (AGPR)**.\n4. **Audit Compliance:** Assisting Project Directors during statutory internal audits, Auditor General of Pakistan (AGP) inspections, and preparing audit compliance reports.\n\n### Eligibility Criteria for Accountant\n- **Education:** B.Com (2 or 3 Years), Associate Degree in Commerce / Business Administration, BS Accounting & Finance, BBA, ACCA, CA-Inter, or MBA Finance from an HEC-recognized university.\n- **Experience:** Minimum **01 year** of post-qualification experience in public sector project accounting, AGPR procedures, or corporate accounts.\n- **Age Limit:** Maximum **45 years** as of the closing date.",

    "## Position Profile B: Assistant Private Secretary (APS, PPS-06) — NJP Requisition 9840\n\n### Secretarial & Administrative Mandate\nThe Assistant Private Secretary (APS) serves as the primary administrative and confidential assistant to executive project leadership:\n1. **Official Correspondence:** Managing confidential and official correspondence, drafting official memoranda, and processing ministerial noting and summaries.\n2. **Meeting & Calendar Coordination:** Scheduling high-level project meetings, preparing working papers, recording minutes of meetings, and tracking action items.\n3. **Record Management:** Supervising diary, dispatch, filing registers, and ensuring secure custody of classified project files.\n4. **Dictation & Secretarial Support:** Taking dictation, shorthand transcription, and fast computerized typing in English and Urdu.\n\n### Eligibility Criteria for APS\n- **Education:** Bachelor of Arts (BA), B.Com, BBA, BSc, or Associate Degree in Arts / English / Commerce / Public Administration (14 years minimum graduation) from an HEC-recognized institution.\n- **Experience:** Minimum **02 years** of proven secretarial, administrative, or office management experience in government ministries, autonomous bodies, or reputable corporate organizations.\n- **Age Limit:** Maximum **50 years** as of the closing date.",

    "## Important Service Conditions & Terms\n\n- **Contract Nature:** Appointments are purely on contract under the Federal Government Project Pay Scales (PPS) policy for the project execution period.\n- **Quota & Domicile:** Both positions are filled on an open merit basis for Pakistani nationals.\n- **No TA/DA:** No traveling allowance or daily allowance will be admissible for test or interview rounds.\n- **Document Verification:** Candidates summoned for interviews must produce original educational degrees, transcripts, experience certificates, and valid CNIC.",

    "## Step-by-Step Online Application Process on NJP\n\n1. Visit the National Job Portal listings:\n   - For Accountant: [njp.gov.pk/jobs/9842](https://www.njp.gov.pk/jobs/9842)\n   - For Assistant Private Secretary: [njp.gov.pk/jobs/9840](https://www.njp.gov.pk/jobs/9840)\n2. Log in with your NJP credentials or register a new profile using your CNIC.\n3. Complete your profile details, ensuring that qualifications and experience dates strictly align with your certificates.\n4. Select the desired position and submit your application online.\n5. Both listings close on **02 November 2026**; early submission is advised to avoid last-minute portal congestion.\n\n> [!NOTE]\n> Candidates eligible for both positions must submit separate online applications through their respective NJP job links.",

    "## Frequently Asked Questions (FAQs)\n\n**Q1: What is the last date to apply for Ministry of Planning jobs?**\nThe application deadline for both Accountant and APS positions is **02 November 2026**.\n\n**Q2: What is the maximum age limit for Assistant Private Secretary?**\nThe maximum age limit for APS is **50 years**, allowing seasoned administrative professionals to apply.\n\n**Q3: Is experience with AGPR required for the Accountant post?**\nYes, familiarity with AGPR reconciliation, NIS preparation, and project cash books is a primary responsibility under the official job description.\n\n**Q4: Can candidates apply through postal mail?**\nNo. Applications are accepted exclusively online through the National Job Portal (njp.gov.pk)."
  ];

  const mopPayload = {
    title: 'Ministry of Planning Jobs 2026 — Accountant & APS PPS-6 Vacancies',
    slug: mopSlug,
    category: 'government-jobs',
    organization: 'Ministry of Planning, Development & Special Initiatives',
    jobType: 'Federal Government Contract (PPS-06)',
    location: 'Islamabad, Pakistan',
    qualification: 'B.Com, BBA, BS Accounting & Finance, BA, or Equivalent Graduation (14–16 Years) from HEC Recognized University',
    salary: 'PPS-06 Scale (Federal Project Pay Scale)',
    experience: '1 to 2 Years Relevant Experience (1 Year for Accountant, 2 Years for APS)',
    positions: '2 Vacancies (1 Accountant, 1 Assistant Private Secretary)',
    lastDate: '2026-11-02',
    noDeadline: false,
    publishDate: '2026-10-23',
    officialLink: 'https://www.njp.gov.pk/jobs/9842',
    applyLink: 'https://www.njp.gov.pk/jobs/9842',
    isVerified: true,
    featured: true,
    logoInitial: 'MOPD',
    featuredImage: '/images/ministry-of-planning-jobs-october-2026.webp',
    imageAlt: 'Ministry of Planning Jobs 2026 Accountant APS PPS-6 National Job Portal CareerDost',
    excerpt: 'Ministry of Planning, Development & Special Initiatives invites online applications via National Job Portal for PPS-06 positions: Accountant (1 vacancy) and Assistant Private Secretary (1 vacancy). Check eligibility, AGPR accounting duties, secretarial skills, and apply by 02 November 2026.',
    content: mopContent,
    seoTitle: 'Ministry of Planning Jobs 2026 — Accountant & APS PPS-6 Vacancies',
    metaDescription: 'Ministry of Planning Jobs 2026 for Accountant and Assistant Private Secretary. Check PPS-6 eligibility, experience, deadline and NJP apply links.',
    focusKeyword: 'Ministry of Planning Jobs 2026',
    canonicalUrl: `https://careerdost.blog/jobs/${mopSlug}`,
    ogTitle: 'Ministry of Planning Jobs 2026 — Accountant & APS PPS-6 Vacancies',
    ogDescription: 'Ministry of Planning Jobs 2026 for Accountant and Assistant Private Secretary. Check PPS-6 eligibility, experience, deadline and NJP apply links.',
    status: 'draft'
  };

  if (currentDraftSlugs.has(mopSlug)) {
    console.log(`[SKIP] ${mopSlug} already exists as a draft in production CMS.`);
  } else {
    console.log(`Creating draft [${mopSlug}] via CMS API...`);
    const res = await fetchWithRetry(`${apiBase}/articles`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(mopPayload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(`Ministry of Planning draft creation failed: ${JSON.stringify(json)}`);
    console.log(`-> SUCCESS! Created Ministry of Planning draft ID: ${json.data.id} (Status: ${json.data.status})`);
  }

  // --- VERIFY IN CMS DRAFTS LIST ---
  console.log('\n--- VERIFYING CMS DRAFT LISTINGS ---');
  const verifyRes = await fetchWithRetry(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const verifyData = await verifyRes.json();
  const allDrafts = verifyData.data || [];

  const foundPseb = allDrafts.find(a => a.slug === psebSlug);
  const foundMop = allDrafts.find(a => a.slug === mopSlug);

  console.log(`PSEB Creative Lead: ${foundPseb ? `CONFIRMED IN CMS (ID: ${foundPseb.id}, status: ${foundPseb.status})` : 'NOT FOUND'}`);
  console.log(`Ministry of Planning: ${foundMop ? `CONFIRMED IN CMS (ID: ${foundMop.id}, status: ${foundMop.status})` : 'NOT FOUND'}`);
  console.log(`\nTotal draft articles in production CMS: ${allDrafts.length}`);
}

run().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
