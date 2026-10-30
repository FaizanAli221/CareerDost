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

async function runCorrections() {
  console.log('=== CAREERDOST — SEO SPRINT 1: FINAL TARGETED CONTENT CORRECTIONS ===\n');
  console.log(`Execution Timestamp: ${new Date().toISOString()}`);

  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) throw new Error(`Failed to fetch articles from D1: HTTP ${res.status}`);
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  // -------------------------------------------------------------
  // 1. PHSA Paramedic General List (D1 ID 94, Local ID 498)
  // -------------------------------------------------------------
  console.log('\n--- Processing Target 1: PHSA Paramedic General List ---');
  const phsa = allD1.find(a => a.slug === 'phsa-paramedic-general-list-2026');
  if (!phsa) throw new Error('PHSA article not found in D1');

  const phsaNoticeSection = [
    '### Notice Board Update: BS Paramedics General List & Document Header Clarification (26 October 2026)',
    `> [!NOTE]\n> **PHSA Notice Board Release & Document Header Discrepancy Advisory:**\n> - **Official Notice Board Entry:** On **26 October 2026**, the official PHSA Notice Board published a new document entry titled **"General List - BS Paramedics - ZAB PGPI"**, valid for candidate scrutiny and grievance submission through **1 November 2026**.\n> - **Attached PDF Document Header Discrepancy:** While the portal notice title specifically labels the file for *ZAB PGPI*, the heading inside the attached official PDF (\`phsa-general-list-bs-paramedics-20261026-1456.pdf\`) reads **"Institute: All Institutes"** and displays the processing annotation **"Status: Returned for Correction, Document verified"**.\n> - **Provisional Scrutiny Status:** This document is a preliminary scrutiny/data verification list rather than an exclusive or final selection list. Candidates must not treat this release as a definitive interview call list.\n> - **Candidate Verification Guidance:** In light of the heading variance between the portal notice board and the document header, allied health candidates across all participating institutions are advised to check their entries on the [PHSA Notice Board](https://www.phsa.edu.pk/notice-details) and directly confirm institutional scope with the PHSA Admissions Directorate before **1 November 2026**.\n> - **Privacy Notice:** In strict compliance with candidate personal data security standards, CareerDost does not mirror applicant names, CNIC numbers, or personal scorecards. Please consult the official PHSA portal directly.`
  ];

  // Insert the clarification block after section 2 (Important Callout)
  const newPhsaContent = [
    phsa.content[0],
    phsa.content[1],
    phsa.content[2],
    phsaNoticeSection[0],
    phsaNoticeSection[1],
    ...phsa.content.slice(3)
  ];

  const phsaPayload = {
    title: phsa.title,
    slug: phsa.slug,
    category: phsa.categorySlug || phsa.category,
    organization: phsa.organization,
    jobType: phsa.jobType,
    location: phsa.location,
    qualification: phsa.qualification,
    salary: phsa.salary,
    experience: phsa.experience,
    positions: phsa.positions,
    lastDate: phsa.lastDate,
    noDeadline: phsa.noDeadline,
    publishDate: phsa.publishDate,
    officialLink: phsa.officialLink,
    applyLink: phsa.applyLink,
    isVerified: phsa.isVerified,
    featured: phsa.featured,
    logoInitial: phsa.logoInitial,
    featuredImage: phsa.featuredImage,
    imageAlt: phsa.imageAlt,
    excerpt: phsa.excerpt,
    content: newPhsaContent,
    seoTitle: phsa.seoTitle,
    metaDescription: phsa.metaDescription,
    focusKeyword: phsa.focusKeyword,
    canonicalUrl: phsa.canonicalUrl,
    ogTitle: phsa.seoTitle,
    ogDescription: phsa.metaDescription,
    status: 'published'
  };

  // -------------------------------------------------------------
  // 2. Sindh Wheat Subsidy (D1 ID 355, Local ID 355)
  // -------------------------------------------------------------
  console.log('\n--- Processing Target 2: Sindh Wheat Subsidy Benazir Hari Card ---');
  const wheat = allD1.find(a => a.slug === 'sindh-wheat-subsidy-benazir-hari-card-2026');
  if (!wheat) throw new Error('Wheat subsidy article not found in D1');

  const newWheatContent = [...wheat.content];
  newWheatContent[1] = `The **Sindh Agriculture, Supply & Prices Department**, pursuant to formal policy decisions by the Sindh Provincial Cabinet, has structured the **Sindh Wheat Growers Support Program for the Rabi 2026–27 cropping season**. Designed to lower agricultural input costs, boost provincial wheat acreage, and support smallholder farming households, the initiative utilizes the digital **Benazir Hari Card (BHC)** ecosystem and **Sindh Bank** for verified financial transfers.`;

  newWheatContent[2] = `> [!NOTE]\n> **Cabinet-Supported Policy Framework & Key Parameters:**\n> - **Landholding Ceiling:** Minimum **1 acre** up to a maximum upper threshold of **25 acres** of cultivable land (cabinet-ratified smallholder criteria).\n> - **Fertilizer Relief Framework:** Financial assistance framework covers Di-Ammonium Phosphate (DAP) and approved agricultural inputs. *Source Note:* The specific subsidy rate of **Rs. 4,000 per acre** was stated by the Sindh Minister for Agriculture in media remarks reported by *Daily Times* on 18 September 2026; this per-acre rate reflects ministerial press announcements under the Rs 14.9 billion provincial allocation rather than an official gazetted operational guideline.\n> - **Wheat Procurement Incentive:** A cabinet-ratified incentive bonus of **Rs. 2,000 per maund** disbursed above the baseline procurement price for verified farmers delivering harvested wheat to official Food Department centers.\n> - **Disbursement Mechanism:** Direct digital credit to verified farmer accounts via **Sindh Bank** Benazir Hari Card (BHC) debit/ATM cards.\n> - **Official Programme Portals:** [benazirharicard.gos.pk](https://benazirharicard.gos.pk/) & [sindh.gov.pk](https://sindh.gov.pk/)\n> - **Official Helpline:** \`0311-1646111\` (Mon–Fri, 9:00 AM to 5:00 PM)`;

  newWheatContent[4] = `Under the 2026 provincial policy framework, wheat assistance comprises two distinct pillars:\n1. **Direct Input & Fertilizer Relief:** Financial support aimed at Di-Ammonium Phosphate (DAP) or approved nutrient procurement for early Rabi sowing (with a relief rate of Rs. 4,000 per acre attributed to the Agriculture Minister in a 18 September 2026 *Daily Times* press report, pending individual disbursement schedule releases).\n2. **Harvest Delivery Incentive:** A cabinet-ratified procurement incentive bonus of **Rs. 2,000 per maund** disbursed above the baseline procurement rate upon verified crop delivery to Sindh Food Department procurement centers.`;

  newWheatContent[6] = `- **Landholding Limit:** Growers cultivating between **1 and 25 acres** dedicated to wheat cultivation in the 2026–27 Rabi cycle.\n- **Ownership Verification:** Landowners must hold authenticated **Form-VII / Deh / Khata revenue records** verified by the local Mukhtiarkar (Revenue).\n- **Tenant & Sharecropper Inclusion:** Verified tenants (Haris) registered through the local union council agriculture extension office with landowner concurrence.\n- **Biometric Banking Requirement:** An activated **Sindh Bank Benazir Hari Card account** linked with the farmer's biometric CNIC.`;

  newWheatContent[8] = `1. **Visit the Official Programme Portal:** Access [benazirharicard.gos.pk](https://benazirharicard.gos.pk/) or review provincial updates on [sindh.gov.pk](https://sindh.gov.pk/).\n2. **Check CNIC Verification Status:** Enter your 13-digit CNIC to verify whether your land revenue records are cleared.\n3. **Field Scrutiny:** If unverified or updating tenancy records, visit your local **Taluka Agriculture Extension Office** with original CNIC, land ownership title (Form-VII), and contact information.\n4. **Card Collection:** Upon administrative clearance, collect your biometric Benazir Hari Card from your designated **Sindh Bank** branch.\n5. **Disbursement:** Relief funds are credited directly to your Benazir Hari Card account for ATM withdrawal or POS seed/fertilizer transactions.`;

  newWheatContent[10] = `**Q1: What is the subsidy amount for wheat farmers under the Benazir Hari Card?**\nUnder the cabinet-approved package, smallholder farmers cultivating between 1 and 25 acres receive input assistance (with an intended rate of Rs. 4,000 per acre for DAP fertilizer widely cited in 18 September 2026 *Daily Times* press statements by the Agriculture Minister), alongside a verified Rs. 2,000/maund delivery incentive at harvest.\n\n**Q2: What is the maximum landholding eligible for the subsidy?**\nThe upper ceiling is 25 acres. Farmers owning or cultivating more than 25 acres are excluded from this smallholder support initiative.\n\n**Q3: Which financial institution handles the Benazir Hari Card?**\nSindh Bank is the official disbursement partner managing accounts and debit cards for verified farmers.\n\n**Q4: Where can farmers verify their registration or contact support?**\nVisit the official portal at [benazirharicard.gos.pk](https://benazirharicard.gos.pk/), consult [sindh.gov.pk](https://sindh.gov.pk/), or call the dedicated helpline at \`0311-1646111\`.`;

  newWheatContent[12] = `- **Benazir Hari Card Portal:** [benazirharicard.gos.pk](https://benazirharicard.gos.pk/)\n- **Government of Sindh Agriculture Department:** [sindh.gov.pk](https://sindh.gov.pk/)\n- **Related CareerDost Official Coverage:** [Sindh Government Jobs 2026 Guide](/jobs/sindh-government-jobs-2026-spsc-sts-vacancies-apply-online), [Sindh Courts BPS 1 to 4 Jobs 2026](/jobs/sindh-courts-bps-1-4-jobs-2026)`;

  const newWheatMetaDesc = 'Sindh Wheat Subsidy 2026–27: Benazir Hari Card DAP relief framework & Rs 2,000/maund harvest incentive for up to 25 acres. Check official eligibility rules.';

  const wheatPayload = {
    title: wheat.title,
    slug: wheat.slug,
    category: wheat.categorySlug || wheat.category,
    organization: wheat.organization,
    jobType: wheat.jobType,
    location: wheat.location,
    qualification: wheat.qualification,
    salary: wheat.salary,
    experience: wheat.experience,
    positions: wheat.positions,
    lastDate: wheat.lastDate,
    noDeadline: wheat.noDeadline,
    publishDate: wheat.publishDate,
    officialLink: wheat.officialLink,
    applyLink: wheat.applyLink,
    isVerified: wheat.isVerified,
    featured: wheat.featured,
    logoInitial: wheat.logoInitial,
    featuredImage: wheat.featuredImage,
    imageAlt: wheat.imageAlt,
    excerpt: wheat.excerpt,
    content: newWheatContent,
    seoTitle: wheat.seoTitle,
    metaDescription: newWheatMetaDesc,
    focusKeyword: wheat.focusKeyword,
    canonicalUrl: wheat.canonicalUrl,
    ogTitle: wheat.seoTitle,
    ogDescription: newWheatMetaDesc,
    status: 'published'
  };

  // -------------------------------------------------------------
  // 3. Bank of Punjab Karachi Manager (D1 ID 491, Local ID 502)
  // -------------------------------------------------------------
  console.log('\n--- Processing Target 3: Bank of Punjab Karachi Manager ---');
  const bop = allD1.find(a => a.slug === 'bank-of-punjab-karachi-manager-jobs-2026');
  if (!bop) throw new Error('BOP article not found in D1');

  const newBopContent = [...bop.content];
  newBopContent[2] = `> [!WARNING]\n> **Official Application Status Notice (Updated 29 October 2026):**\n> - **Regional Manager Alliances (Band-9 to Band-7):** **Closing today — 29 October 2026** (Candidates must submit applications before midnight tonight).\n> - **Manager - Projects and Governance (Band-9):** Official closing date was **20 October 2026** (Closed).\n> - **Fresh Opportunities:** Candidates seeking new banking positions are advised to monitor the official [BOP Available Jobs Portal](https://www.bop.com.pk/Available-Jobs) and [BOP Rozee Portal](https://bop.rozee.pk/) where new commercial, retail, and corporate banking roles are regularly advertised.`;

  newBopContent[4] = `| METRIC / PARAMETER | OFFICIAL SPECIFICATION |\n| :--- | :--- |\n| **Hiring Institution** | The Bank of Punjab (BOP) |\n| **Designations** | Regional Manager Alliances & Manager - Projects and Governance |\n| **Corporate Groups** | Digital Banking Group (Cards & Payments) & Treasury & Capital Markets |\n| **Corporate Grades** | Band-9 to Band-7 (Mid to Senior Management) |\n| **Job Location** | Karachi, Sindh |\n| **Minimum Qualification** | 16-Year Bachelor’s Degree (Master’s preferred) from HEC-recognized university |\n| **Experience Requirement** | Minimum 4 Years of Relevant Banking or Corporate Sector Experience |\n| **Maximum Age Limit** | Up to 55 Years as of Closing Date |\n| **Application Deadlines** | **Closing today — 29 October 2026** (Alliances) / **20 October 2026** (Projects & Governance - Closed) |\n| **Official Career Portal** | [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs) |`;

  newBopContent[6] = `#### 1. Regional Manager Alliances — Digital Banking Group (Band-9 to Band-7)\n- **Location:** Karachi  \n- **Closing Date:** **Closing today — 29 October 2026**  \n- **Core Functions:** Spearhead strategic commercial partnerships, merchant acquisition, loyalty discount alliances, and payment brand integrations across Sindh and Southern regions. Manage relationships with major retail brands, e-commerce platforms, and digital payment aggregators to drive debit/credit card usage and acquiring revenue.\n- **Eligibility Criteria:** Minimum Bachelor’s degree (16 years education) in Business Administration, Marketing, Economics, or Commerce from an HEC-recognized institution. Minimum 4 years of proven experience in card alliances, merchant sales, or consumer banking partnerships.`;

  newBopContent[13] = `**Q1: Can fresh graduates apply for these managerial positions?**\nNo. Both positions carry corporate rankings of Band-9/Band-7 and require at least 4 years of relevant post-qualification professional banking experience.\n\n**Q2: Is the Regional Manager Alliances position still open?**\nYes, but it is closing today — 29 October 2026. Interested applicants must complete and submit their profile via the official BOP portal before midnight tonight.\n\n**Q3: Where can I find new Bank of Punjab jobs?**\nActive openings are posted directly on [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).`;

  const newBopLastDate = 'Closing today — 29 October 2026';
  const newBopMetaDesc = 'Bank of Punjab (BOP) Karachi manager openings: Regional Manager Alliances closing today — 29 October 2026. Review verified eligibility and BOP career portal.';

  const bopPayload = {
    title: bop.title,
    slug: bop.slug,
    category: bop.categorySlug || bop.category,
    organization: bop.organization,
    jobType: bop.jobType,
    location: bop.location,
    qualification: bop.qualification,
    salary: bop.salary,
    experience: bop.experience,
    positions: bop.positions,
    lastDate: newBopLastDate,
    noDeadline: bop.noDeadline,
    publishDate: bop.publishDate,
    officialLink: bop.officialLink,
    applyLink: bop.applyLink,
    isVerified: bop.isVerified,
    featured: bop.featured,
    logoInitial: bop.logoInitial,
    featuredImage: bop.featuredImage,
    imageAlt: bop.imageAlt,
    excerpt: bop.excerpt,
    content: newBopContent,
    seoTitle: bop.seoTitle,
    metaDescription: newBopMetaDesc,
    focusKeyword: bop.focusKeyword,
    canonicalUrl: bop.canonicalUrl,
    ogTitle: bop.seoTitle,
    ogDescription: newBopMetaDesc,
    status: 'published'
  };

  const tasks = [
    { name: 'PHSA Paramedic General List', slug: phsa.slug, payload: phsaPayload },
    { name: 'Sindh Wheat Subsidy', slug: wheat.slug, payload: wheatPayload },
    { name: 'Bank of Punjab Karachi Manager', slug: bop.slug, payload: bopPayload }
  ];

  for (const task of tasks) {
    console.log(`\n>>> Updating Production D1 for: ${task.name} (${task.slug})`);
    const updateRes = await fetch(`https://careerdost.blog/api/admin/articles/${task.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(task.payload)
    });

    const updateJson = await updateRes.json();
    if (!updateRes.ok || !updateJson.success) {
      console.error(`Failed to update D1 for ${task.slug}:`, updateJson);
      throw new Error(`D1 update failed for ${task.slug}`);
    }
    console.log(`SUCCESS: Production D1 updated for ${task.slug}`);

    // Update Local SQLite for exact parity
    console.log(`>>> Updating Local SQLite for: ${task.slug}`);
    localDb.prepare(`
      UPDATE articles SET
        content = ?,
        last_date = ?,
        meta_description = ?,
        og_description = ?,
        og_title = ?,
        seo_title = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(
      JSON.stringify(task.payload.content),
      task.payload.lastDate,
      task.payload.metaDescription,
      task.payload.ogDescription,
      task.payload.ogTitle,
      task.payload.seoTitle,
      task.slug
    );
    console.log(`SUCCESS: Local SQLite updated for ${task.slug}`);
  }

  console.log('\n================ ALL UPDATES APPLIED ================');
}

runCorrections().catch(console.error);
