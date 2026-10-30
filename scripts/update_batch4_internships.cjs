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

const batch4Articles = [
  {
    id: 10,
    slug: 'ufone-summer-internship-2026',
    title: 'Ufone Summer Internship Program 2026: PTCL Group Selection & Eligibility Guide',
    lastDate: '2026-10-25',
    metaDescription: 'Ufone 4G (PTCL Group) Summer Internship Programme guide covering technology, marketing, finance, and digital tracks. Review stipend details and eligibility.',
    seoTitle: 'Ufone Summer Internship Program 2026 — PTCL Group Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Organization:** Ufone 4G & PTCL Group.\n> - **Program:** Summer Internship Programme (SIP 2026).\n> - **Application Window:** Registrations for this batch closed on **25 October 2026**.\n> - **Selection Stage:** Departmental mentors are evaluating shortlisted candidates for project assignments at PTCL/Ufone Towers in Islamabad, Lahore, and Karachi.\n> - **Official Portal:** [ufone.com](https://www.ufone.com/).',
      '### Telecom Internship Overview',
      'The **Ufone Summer Internship Programme** is an intensive 6-to-8-week paid professional development initiative operated by **PTCL Group** (Pakistan Telecommunication Company Limited and Pak Telecom Mobile Limited). The internship immerses students in real-world cellular network operations, digital FinTech (UPaisa), customer intelligence, and telecom infrastructure.',
      '### Functional Specializations & Placement Wings',
      '| Internship Track | Core Learning Modules | Target Degree Disciplines |\n| :--- | :--- | :--- |\n| **Technology & Network Operations** | 4G/LTE Radio Frequency (RF), Fiber Transmission, NOC 24/7 Monitoring | BE / BS Electrical, Telecom, Electronics Engineering |\n| **Digital & Information Technology** | Cloud Infrastructure, Data Engineering, Cyber Security, Software QA | BS Computer Science, Software Engineering, IT |\n| **Commercial & Marketing** | Brand Strategy, Product Pricing, Digital Media Planning, UPaisa Analytics | BBA / MBA Marketing, Media Sciences, Business Analytics |\n| **Finance & Corporate Strategy** | Revenue Assurance, Capex/Opex Auditing, Treasury Settlements | BS Accounting & Finance, BBA Finance, ACCA |',
      '### Mandatory Eligibility Criteria',
      '- **Academic Standing:** Students currently enrolled in their 3rd or 4th year of Bachelor’s (16 Years) or Master’s degree at an HEC-recognized university.\n- **Minimum CGPA:** Minimum **3.00 out of 4.00** in completed semesters.\n- **Internship Deliverable:** Each intern is assigned a dedicated senior mentor and must present a capstone business or engineering project at the end of the internship period.',
      '### Program Benefits & Perks',
      '- **Monthly Stipend:** Competitive monthly stipend disbursed directly via bank transfer / digital wallet.\n- **Executive Mentorship:** Direct supervision by industry executives and exposure to executive leadership.\n- **MTO Fast-Track:** High-performing interns receive priority interview shortlisting for PTCL Group’s annual Management Trainee Officer (MTO) program.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can graduated students apply for the Ufone Summer Internship?**\nNo. The summer internship is strictly reserved for currently enrolled university students who have not yet completed their degree.\n\n**Q2: What is the total duration of the internship?**\nThe internship spans 6 to 8 weeks during the summer and autumn academic breaks.\n\n**Q3: Where are official PTCL Group internship updates posted?**\nOfficial announcements appear on the group’s careers pages: [ufone.com](https://www.ufone.com/) and [ptcl.com.pk](https://www.ptcl.com.pk/).'
    ]
  },
  {
    id: 11,
    slug: 'planning-commission-internship-2026',
    title: 'Planning Commission Research Internship 2026: Young Development Fellows Guide',
    lastDate: '2026-10-18',
    metaDescription: 'Planning Commission of Pakistan Research Internship & Young Development Fellows (YDF) guide. Review macroeconomic policy sections, eligibility, and federal stipend details.',
    seoTitle: 'Planning Commission Research Internship 2026 — Complete Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Issuing Ministry:** Ministry of Planning, Development & Special Initiatives, Islamabad.\n> - **Scheme:** Young Development Fellows (YDF) & Research Internship Programme.\n> - **Closing Date:** Online registration for this cohort closed on **18 October 2026**.\n> - **Selection Stage:** Scrutiny of research proposals and academic transcripts by the Chief Economists Selection Committee.\n> - **Official Authority Portal:** [pc.gov.pk](https://www.pc.gov.pk/).',
      '### Institutional Role in National Development',
      'The **Planning Commission of Pakistan** is the federal apex institution responsible for macroeconomic planning, financial programming, and monitoring the **Public Sector Development Programme (PSDP)**. The Research Internship Programme embeds young economists and policy researchers directly inside federal policy drafting sections at ‘P’ Block, Pakistan Secretariat, Islamabad.',
      '### Core Research Wings & Thematic Sections',
      '| Planning Section | Research Mandate | Relevant Educational Fields |\n| :--- | :--- | :--- |\n| **Macroeconomic Framework Section** | Fiscal policy, inflation analysis, foreign trade balances, GDP forecasting | MPhil / MS / BS in Economics, Econometrics, Statistics |\n| **CPEC & International Cooperation** | China-Pakistan Economic Corridor projects, industrial zone monitoring | Public Policy, International Relations, Trade Economics |\n| **Social Sector Development Wing** | Poverty alleviation, national education standards, public healthcare finance | Development Studies, Public Health, Sociology |\n| **Infrastructure & Energy Section** | Energy transition, water storage, hydel/solar project financial feasibility | Civil / Energy Engineering, Project Management |',
      '### Standard Eligibility & Qualifications',
      '- **Academic Record:** First Division or minimum CGPA of 3.00/4.00 in Master’s / 4-year BS from an HEC-recognized university.\n- **Analytical Skills:** Demonstrated proficiency in quantitative analysis (STATA, SPSS, R, or advanced Excel) and academic policy drafting.\n- **Federal Stipend:** Fellows receive a competitive federal monthly stipend and official research certificate signed by the Federal Minister / Deputy Chairman Planning Commission.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is the Planning Commission internship based in Islamabad only?**\nYes. Selected research fellows are stationed at the Planning Commission Secretariat in Islamabad for the duration of the fellowship.\n\n**Q2: What is the duration of the research fellowship?**\nThe fellowship typically ranges from 6 months to 1 year, aligned with federal PSDP project cycles.\n\n**Q3: Where can citizens track future calls for research fellows?**\nAll official calls for proposals and internships are published on [pc.gov.pk](https://www.pc.gov.pk/).'
    ]
  },
  {
    id: 65,
    slug: 'imarat-finance-intern-jobs-2026',
    title: 'IMARAT Finance Intern Jobs 2026: Corporate Accounts & Real Estate Finance Guide',
    lastDate: '2026-09-30',
    metaDescription: 'IMARAT Group of Companies Finance Internship Programme guide for Islamabad and Rawalpindi. Review financial analysis requirements, ACCA/BBA criteria, and portal steps.',
    seoTitle: 'IMARAT Finance Intern Jobs 2026 — Corporate Finance Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Group:** IMARAT Group of Companies (Graana / Agency21).\n> - **Position:** Finance & Accounts Intern.\n> - **Closing Date:** Online applications closed on **30 September 2026**.\n> - **Selection Stage:** Shortlisted accounting candidates are completing practical Excel modeling assessments and interviews at the IMARAT Corporate Office in Islamabad.\n> - **Official Careers Portal:** [careers.imarat.com.pk](https://careers.imarat.com.pk/).',
      '### Corporate Finance Overview',
      '**IMARAT Group of Companies** is a prominent real estate development, construction, and hospitality conglomerate in Pakistan. The **Finance Internship Program** provides hands-on practical training in corporate financial reporting, treasury operations, property ledger management, and ERP billing systems.',
      '### Quick Facts & Operational Specifications',
      '| Attribute | Official Specification |\n| :--- | :--- |\n| **Hiring Entity** | IMARAT Group of Companies |\n| **Functional Division** | Finance, Accounts & Treasury Department |\n| **Placement Locations** | Islamabad & Rawalpindi Corporate Offices |\n| **Program Duration** | 2 to 3 Months (with performance-based placement track) |\n| **Eligible Qualifications**| BBA Finance, BS Accounting & Finance, M.Com, or ACCA / CMA students |\n| **Stipend Support** | Monthly corporate training stipend provided |',
      '### Core Duties & Learning Objectives',
      '- **Financial Record Keeping:** Assisting senior accountants in invoice verification, vendor payments, and daily bank reconciliations.\n- **Real Estate Project Costing:** Tracking construction material procurement expenditures and contractor billing across active real estate developments.\n- **Tax Compliance:** Assisting in Federal Board of Revenue (FBR) withholding tax calculation and sales tax on services deductions under provincial revenue authorities (PRA/SRB).',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates with ACCA Foundation or partially qualified ACCA apply?**\nYes. Students with partial ACCA/ICMA qualifications or completed BBA/BS degrees are eligible for corporate accounting internships.\n\n**Q2: Where are new vacancies at IMARAT announced?**\nOpen corporate and management trainee roles are published on [careers.imarat.com.pk](https://careers.imarat.com.pk/).'
    ]
  },
  {
    id: 84,
    slug: 'pec-graduate-engineer-training-get-program-2026',
    title: 'PEC Graduate Engineer Training (GET) Program 2026: Official Status & Next Batch Guide',
    lastDate: '2026-03-25',
    metaDescription: 'Pakistan Engineering Council (PEC) Graduate Engineer Training (GET) placement program guide. Review Registered Engineer (RE) eligibility, stipend standards, and next batch status.',
    seoTitle: 'PEC Graduate Engineer Training (GET) Program 2026 — Official Guide',
    content: [
      '> [!NOTE]\n> **Official Status Notice (Application Cycle Concluded):**\n> - **Executing Regulatory Body:** Pakistan Engineering Council (PEC), Islamabad.\n> - **Scheme Name:** Graduate Engineer Training (GET) Placement Program.\n> - **Latest Registration Window:** The registration window for the designated graduating batch concluded on **25 March 2026**.\n> - **Current Status:** Selected engineers are completing their 6-month hands-on placements across contracted public and private engineering firms. There is **no active open registration deadline** today.\n> - **Official Authority Portal:** [pec.org.pk/get](https://www.pec.org.pk/get/).',
      '### Purpose of the PEC GET Program',
      'The **Pakistan Engineering Council (PEC)** instituted the **Graduate Engineer Training (GET) Program** to serve as a funded professional "house-job" bridge for fresh engineering graduates. By partnering with leading engineering contractors, consulting firms, state-owned enterprises (WAPDA, NESPAK, OGDCL), and industrial plants, the scheme ensures fresh graduates acquire verifiable site engineering experience.',
      '### Program Specifications & Placement Framework',
      '| Program Dimension | Official PEC Policy Specification |\n| :--- | :--- |\n| **Regulating Authority** | Pakistan Engineering Council (Under Ministry of Science & Technology) |\n| **Training Duration** | **6 Months** Continuous Full-Time Industry Placement |\n| **Funding Structure** | Co-funded stipend disbursed directly to trainee engineers via bank accounts |\n| **Mandatory Qualification** | Bachelor of Engineering (BSc / BE / BS Engg) from PEC-accredited programs |\n| **Mandatory Professional Status** | Active **Registered Engineer (RE)** license issued by PEC |\n| **Participating Sectors** | Civil Construction, Power Generation, Telecom, Chemical Processing, Manufacturing |',
      '### Eligibility Rules for Future GET Intakes',
      '1. **Accredited Degree:** Graduation from an engineering program listed in the First Schedule of the PEC Act 1976.\n2. **Active RE Number:** Candidates must hold a valid Green Card / Registered Engineer registration number with no outstanding disciplinary issues.\n3. **Graduation Year Restriction:** Typically restricted to graduates from the immediate past 1 to 2 graduating years to ensure fresh talent receives frontline placement support.',
      '### What Fresh Engineers Should Prepare for the Next Call',
      '- Ensure your PEC permanent registration is processed immediately upon university degree issuance.\n- Create and update your profile on the **PEC Online Job & Placement Portal** (`get.pec.org.pk`).\n- Keep digital copies of your PEC registration card, HEC-verified degree transcript, and CNIC ready for fast submission when the next batch is notified.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates apply for PEC GET without an active PEC registration number?**\nNo. Having an active Registered Engineer (RE) registration number is an absolute statutory prerequisite.\n\n**Q2: Does completion of GET guarantee permanent employment?**\nWhile not legally guaranteed, many host engineering organizations absorb high-performing trainee engineers into regular junior engineer or project engineer roles.\n\n**Q3: Where can engineers check official PEC placement announcements?**\nUpdates are published on the official PEC placement portal at [pec.org.pk/get](https://www.pec.org.pk/get/) and emailed to registered engineers.'
    ]
  }
];

async function updateBatch4() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  console.log('Fetching live articles to build full payloads...');
  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allArticles = (await resAll.json()).data;

  console.log('=== UPDATING BATCH 4 (4 INTERNSHIP ARTICLES) ===\n');

  for (const item of batch4Articles) {
    const existing = allArticles.find(a => a.slug === item.slug);
    if (!existing) {
      throw new Error(`Article not found on D1 for slug: ${item.slug}`);
    }

    const payload = {
      ...existing,
      title: item.title,
      content: item.content,
      lastDate: item.lastDate,
      metaDescription: item.metaDescription,
      seoTitle: item.seoTitle,
      ogTitle: item.title,
      ogDescription: item.metaDescription,
      status: 'published'
    };

    console.log(`>>> Updating Cloudflare D1 for: [ID ${item.id}] ${item.slug}`);

    const res = await fetch(`https://careerdost.blog/api/admin/articles/${item.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      console.error(`Error updating D1 for ${item.slug}:`, json);
      throw new Error(`D1 update failed for ${item.slug}`);
    }
    console.log(`SUCCESS: Cloudflare D1 updated for [ID ${item.id}] ${item.slug}`);

    // Update local SQLite
    localDb.prepare(`
      UPDATE articles SET
        title = ?,
        content = ?,
        last_date = ?,
        meta_description = ?,
        seo_title = ?,
        og_title = ?,
        og_description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(
      item.title,
      JSON.stringify(item.content),
      item.lastDate,
      item.metaDescription,
      item.seoTitle,
      item.title,
      item.metaDescription,
      item.slug
    );
    console.log(`SUCCESS: Local SQLite updated for ${item.slug}\n`);
  }

  console.log('=== BATCH 4 UPDATES COMPLETE ===');
}

updateBatch4().catch(console.error);
