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

async function run() {
  console.log('=== CREATING MEEZAN BANK ARTICLE 1 DRAFT VIA PRODUCTION CMS API ===\n');

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secretMatch = envLocal.match(/ADMIN_JWT_SECRET=(.+)/);
  const secret = secretMatch ? secretMatch[1].trim() : null;
  const admin = { id: 2, username: '4330426358809', email: '4330426358809', role: 'superadmin' };
  const jwt = generateJwt(admin, secret);

  const slug = 'meezan-bank-transaction-associates-batch-01-jobs-2026';

  // Check if already exists in CMS
  const checkRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const checkData = await checkRes.json();
  const existing = (checkData.data || []).find(a => a.slug === slug);
  if (existing) {
    console.log(`[ALREADY EXISTS] Draft article already exists in production CMS with ID: ${existing.id}`);
    return;
  }

  const contentParagraphs = [
    "# Meezan Bank Jobs 2026: Transaction Associates (Batch 01) — Nationwide Branch & Payroll Openings",
    
    "## Official Recruitment Notice & Vacancy Overview\n\n**Meezan Bank Limited**, Pakistan's premier Islamic commercial bank, has announced fresh career opportunities under **Transaction Associates (Batch No. 01 — Transaction Solutions)**. Verified directly on the official [Meezan Bank Oracle Cloud Recruitment Portal](https://fa-ewvh-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_3002/job/10699/) (Job Requisition ID: **10699**) on 23 October 2026, this nationwide hiring drive offers distinct career pathways for both **Intermediate diploma/certificate holders** and **University Graduates** across multiple cities in Pakistan.\n\nThe position functions within the bank's **Transaction Solutions** division, focusing primarily on client engagement, payroll corporate partner account facilitation, biometric authentication, and field-level documentation under strict Shariah-compliant banking standards.",

    "## Quick Facts Table\n\n| Attribute | Verified Official Detail |\n|---|---|\n| **Hiring Institution** | Meezan Bank Limited |\n| **Recruitment Drive** | **Transaction Associates — Batch No. 01** |\n| **Department** | Transaction Solutions |\n| **Requisition ID** | 10699 |\n| **Official Posting Date** | 22 October 2026 |\n| **Application Deadline** | **03 November 2026 (18:59 UTC / 23:59 PKT)** |\n| **Job Locations** | Multiple Cities Nationwide (Pakistan) |\n| **Minimum Education** | Intermediate (FA / FSc / I.Com) or Bachelor's Degree (Graduates Preferred) |\n| **Employment Arrangement** | **Permanent Scale** for Graduates; **Bank Contract** for Intermediate Holders |\n| **Age Criteria** | 18 to 26 Years (as of 30 November 2026) |\n| **Age Relaxation** | 2 Years (Up to 28 Years) for Hafiz-e-Quran, Dars-e-Nizami / Shahadat-ul-Alamiyah, & Differently-Abled |\n| **Experience Level** | Fresh Candidates / Entry Level Welcome |\n| **Official Portal Link** | [meezanbank.com/careers](https://www.meezanbank.com/careers/) |",

    "## Intermediate vs. Graduate Eligibility & Employment Terms\n\nA pivotal feature of this Meezan Bank recruitment drive is the structured career tier based on the candidate's educational level:\n\n1. **Permanent Employment Track for Graduates:**\n   - **Eligibility:** Candidates possessing an HEC-recognized Bachelor’s degree (BA, BSc, B.Com, BBA, BS 4-Year) in any discipline. Graduates with coursework or certification in **Islamic Finance** receive an added selection advantage.\n   - **Compensation & Perks:** Market-competitive permanent salary scale, annual increments, performance-linked bonuses, Provident Fund, Gratuity, Subsidized Housing Finance facility, **Auto Financing at Zero Percent**, and comprehensive Health and Life Takaful coverage.\n\n2. **Bank Contract Track for Intermediate Candidates:**\n   - **Eligibility:** Candidates with completed Intermediate (FA, FSc Pre-Medical/Pre-Engineering, I.Com, or ICS).\n   - **Compensation & Perks:** Market-competitive monthly salary package, performance bonuses, career progression opportunities, and comprehensive Health and Life Takaful coverage.",

    "## Age Eligibility & Government-Recognized Relaxations\n\nCandidates must be between **18 and 26 years of age as of 30 November 2026**.\n\nA **2-year age relaxation (up to 28 years)** is officially granted to:\n- **Hafiz-e-Quran** (holding recognized certification).\n- Candidates who have completed **Dars-e-Nizami** or **Shahadat-ul-Alamiyah** and possess an official HEC equivalency letter.\n- **Differently-abled individuals** holding a valid disability registration certificate.",

    "## Key Job Responsibilities & Daily Functions\n\nTransaction Associates within the Transaction Solutions team carry out frontline onboarding and relationship-building tasks:\n- **Corporate Payroll Visits:** Conducting structured field visits to Meezan Bank’s designated Payroll Partner companies to facilitate on-site salary account opening for corporate employees.\n- **Biometric Authentication:** Performing mandatory digital biometric verification via handheld biometric terminals and ensuring complete documentation in line with State Bank of Pakistan (SBP) AML/KYC regulations.\n- **Discrepancy Resolution:** Collaborating directly with branch operations managers and customer onboarding units to rectify document discrepancies and expedite account activation.\n- **Record Maintenance & Reporting:** Maintaining precise electronic logs of daily field visits, account applications initiated, and success rates.\n- **Shariah & Regulatory Compliance:** Upholding Meezan Bank’s Islamic banking protocols and regulatory guidelines during all corporate interactions.",

    "## Desired Skills & Core Competencies\n\n- Strong verbal and written communication skills in Urdu and English.\n- Customer-centric mindset with relationship-building capability.\n- Willingness to undertake local field travel within assigned city zones.\n- Fundamental comprehension of digital banking and customer onboarding workflows.\n- High degree of integrity, professional grooming, and adherence to Islamic ethical conduct.",

    "## Step-by-Step Online Application Procedure\n\nCandidates meeting the criteria must apply exclusively through the official Meezan Bank Oracle Cloud portal:\n\n1. Visit the verified Meezan Bank Oracle Recruitment portal: [Job ID 10699 Requisition Page](https://fa-ewvh-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_3002/job/10699/).\n2. Click on the orange **Apply Now** button.\n3. Enter your active email address to create or log in to your Candidate Experience profile.\n4. Upload your updated Resume/CV (PDF or DOCX format, max 5MB).\n5. Complete the educational history section accurately (specifying Intermediate or Graduation details).\n6. Fill in personal details, CNIC number, date of birth, and claim age relaxation if eligible (Hafiz-e-Quran / Dars-e-Nizami).\n7. Review the declaration and submit before the cutoff deadline of **03 November 2026**.\n\n> [!IMPORTANT]\n> Only applications submitted through the official portal will be entertained. Meezan Bank does not charge any application processing or registration fee at any stage of recruitment."
  ];

  const payload = {
    title: 'Meezan Bank Jobs 2026: Transaction Associates (Batch 01) — Nationwide Branch & Payroll Openings',
    slug: slug,
    category: 'bank-jobs',
    organization: 'Meezan Bank Limited',
    jobType: 'Full-Time (Permanent / Contract)',
    location: 'Multiple Cities, Pakistan',
    qualification: 'Minimum Intermediate (FA / FSc / I.Com) or Bachelor’s Degree (Graduates Preferred)',
    salary: 'Market-Competitive Islamic Banking Scale + Takaful, Bonus & Auto/Housing Finance Facilities',
    experience: 'Fresh Candidates / Entry Level Welcome',
    positions: 'Multiple Nationwide Vacancies',
    lastDate: '2026-11-03',
    noDeadline: false,
    publishDate: '2026-10-23',
    officialLink: 'https://fa-ewvh-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_3002/job/10699/',
    applyLink: 'https://fa-ewvh-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_3002/job/10699/',
    isVerified: true,
    featured: true,
    logoInitial: 'MBL',
    featuredImage: '/images/meezan-bank-jobs-october-2026.webp',
    imageAlt: 'Meezan Bank Jobs 2026 Transaction Associates Batch 01 CareerDost',
    excerpt: 'Meezan Bank Limited has announced Transaction Associates (Batch No. 01 — Transaction Solutions) for multiple cities. Minimum Intermediate or Graduation required. Permanent roles for graduates with auto/housing financing facilities. Apply online before 03 November 2026.',
    content: contentParagraphs,
    seoTitle: 'Meezan Bank Jobs 2026: Transaction Associates Batch 01',
    metaDescription: 'Meezan Bank Jobs 2026: Transaction Associates (Batch 01) across Pakistan. Intermediate and graduate tracks, Shariah banking perks. Apply online by 3 Nov 2026.',
    focusKeyword: 'Meezan Bank Jobs 2026 Transaction Associates',
    canonicalUrl: `https://careerdost.blog/jobs/${slug}`,
    ogTitle: 'Meezan Bank Jobs 2026: Transaction Associates (Batch 01)',
    ogDescription: 'Verified Meezan Bank recruitment 2026: Transaction Associates (Batch 01) nationwide. Check qualifications, benefits, and apply online.',
    status: 'draft' // Strictly draft
  };

  console.log(`Sending POST /api/admin/articles to create draft [${slug}]...`);
  const createRes = await fetch(`${apiBase}/articles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const createJson = await createRes.json();
  if (!createRes.ok || !createJson.success) {
    throw new Error(`Failed to create article: ${JSON.stringify(createJson)}`);
  }

  console.log(`\n-> SUCCESS! Created production draft article ID: ${createJson.data.id} (Status: ${createJson.data.status})`);
  console.log(`Title: ${createJson.data.title}`);
  console.log(`Slug: ${createJson.data.slug}`);

  // Verify in draft list
  const verifyRes = await fetch(`${apiBase}/articles?status=draft`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  const verifyData = await verifyRes.json();
  const found = (verifyData.data || []).find(a => a.slug === slug);
  console.log(`Verification: ${found ? `CONFIRMED VISIBLE IN CMS DRAFTS (ID: ${found.id})` : 'NOT FOUND IN DRAFTS'}`);
}

run().catch(err => {
  console.error('Error creating draft:', err);
  process.exit(1);
});
