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

const batch2Articles = [
  {
    id: 7,
    slug: 'meezan-bank-teller-2026',
    title: 'Meezan Bank Branch Teller / Customer Service Officer: Career & Selection Guide',
    lastDate: '2026-10-10',
    metaDescription: 'Meezan Bank Branch Teller (Customer Service Officer) recruitment guide. Review Islamic banking requirements, SBP age rules, screening stages, and archival status.',
    seoTitle: 'Meezan Bank Teller / CSO Jobs 2026 — Career & Selection Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Designation:** Customer Service Officer (CSO) / Branch Teller.\n> - **Application Window:** This intake cycle closed on **10 October 2026**.\n> - **Current Selection Stage:** Shortlisted candidates are appearing in written aptitude tests and panel interviews organized at Meezan Bank Regional Offices.\n> - **Official Careers Portal:** [meezanbank.com/careers](https://www.meezanbank.com/careers/).',
      '### Islamic Banking Career Overview',
      '**Meezan Bank Limited** is Pakistan’s first and largest Islamic commercial bank, operating a nationwide network of over 1,000 branches. The **Customer Service Officer (CSO) / Branch Teller** role is the primary entry-level professional track for branch banking operations, serving customers under strict Shariah-compliant frameworks.',
      '### Quick Facts & Operational Specifications',
      '| Parameter | Verified Official Specification |\n| :--- | :--- |\n| **Hiring Bank** | Meezan Bank Limited (Dedicated Islamic Commercial Bank) |\n| **Position Title** | Customer Service Officer (CSO) / Cash Officer / Branch Teller |\n| **Career Track** | Branch Banking Operations (Permanent Commercial Track) |\n| **Educational Requirement** | Bachelor’s Degree (14 or 16 Years) in B.Com, BBA, BS, or BA |\n| **Minimum Academic Record** | Minimum 2nd Division or 2.60 CGPA from an HEC-recognized university |\n| **Age Criteria** | Maximum **26 years** on closing date (Relaxed to 27 years for Hafiz-e-Quran) |\n| **Deployment Locations** | Nationwide Branch Network across all provinces |',
      '### Core Duties in Shariah-Compliant Branch Operations',
      '- **Cash & Clearing Counter Operations:** Processing cash deposits, withdrawals, utility payments, and remittances in compliance with State Bank of Pakistan (SBP) Prudential Regulations.\n- **KYC & AML Scrutiny:** Verifying customer CNIC validity through NADRA Verisys and ensuring complete Anti-Money Laundering (AML) documentation.\n- **Customer Relationship Management:** Introducing account holders to Riba-free savings products, Islamic term deposits, ATM/Debit cards, and Meezan mobile banking.',
      '### Selection Sequence & Training Process',
      '1. **Online Profile Screening:** Educational background and age eligibility verification.\n2. **Aptitude Written Test:** Administered via online proctoring or at physical testing centers, covering basic mathematics, English comprehension, general awareness, and introductory Islamic banking principles.\n3. **Panel Interview:** Assessment of communication skills, problem-solving abilities, and alignment with Islamic banking ethics.\n4. **Meezan Learning Center Induction:** Selected candidates undergo an intensive multi-week training program covering core banking software, cash handling protocols, and Shariah rulings before branch posting.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates with a 3rd division apply for Meezan Bank CSO posts?**\nNo. Meezan Bank strictly enforces a minimum 2nd division or 2.60 CGPA requirement for branch operations positions.',
      '**Q2: How often does Meezan Bank conduct recruitment for Branch Tellers?**\nMeezan Bank conducts quarterly and semi-annual recruitment drives across various regions based on branch expansion needs.',
      '**Q3: Where can I check future job openings at Meezan Bank?**\nDirect employment opportunities are posted on the bank’s official portal at [meezanbank.com/careers](https://www.meezanbank.com/careers/).'
    ]
  },
  {
    id: 19,
    slug: 'engro-management-trainee-2026',
    title: 'Engro Management Trainee Program 2026: Selection Stages & Eligibility Guide',
    lastDate: '2026-10-16',
    metaDescription: 'Engro Corporation Management Trainee Programme guide covering engineering, commercial, finance, and supply chain streams. Review assessment stages and eligibility.',
    seoTitle: 'Engro Management Trainee Program 2026 — Selection & Eligibility Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Intake Stream:** Engro Management Trainee Programme (MTP 2026).\n> - **Closing Date:** Online registration for this intake cycle closed on **16 October 2026**.\n> - **Current Selection Stage:** Candidates are completing gamified psychometric evaluations and video interview screenings.\n> - **Official Careers Gateway:** [engro.com/careers](https://www.engro.com/careers/).',
      '### Program Overview & Organizational Reach',
      '**Engro Corporation** is one of Pakistan’s premier industrial conglomerates, with market leadership in fertilizers, petrochemicals, energy, telecommunications infrastructure, and terminal operations. The **Engro Management Trainee Programme** is a rigorous 12-month structured rotational framework designed to accelerate early-career talent into leadership roles.',
      '### Functional Disciplines & Qualification Rubrics',
      '| Functional Stream | Eligible Degree Disciplines | Primary Operating Subsidiaries |\n| :--- | :--- | :--- |\n| **Engineering Tracks** | Chemical, Mechanical, Electrical, Mechatronics, Instrumentation | Engro Fertilizers (Daharki), Engro Polymer & Chemicals (Port Qasim) |\n| **Commercial & Marketing** | BBA / MBA / BS Marketing, Economics, Data Analytics | Engro Fertilizers Marketing Wing, Central Strategy |\n| **Finance & Accounting** | BS Accounting & Finance, BBA Finance, ACCA / CIMA | Engro Corporation Head Office (Karachi) |\n| **Supply Chain & Logistics** | BS / MS Supply Chain Management, Industrial Engineering | Engro Logistics & Manufacturing Hubs |',
      '### Eligibility Standards',
      '- **Educational Standard:** Final-year graduating students or recent graduates holding a Bachelor’s (16 years) or Master’s degree from an HEC-recognized university.\n- **Academic Performance:** Minimum **3.00 CGPA out of 4.00** (or equivalent academic aggregate).\n- **Experience Limit:** Maximum of 1 year of total professional experience post-graduation.\n- **Mobility:** Willingness to relocate across operational sites (Karachi, Daharki, Port Qasim, Lahore).',
      '### Selection Procedure Sequence',
      '1. **Digital Application:** Resume and educational credentials upload on the Engro Taleo portal.\n2. **Gamified Cognitive Assessment:** Online problem-solving, cognitive agility, and risk management evaluation.\n3. **On-Demand Video Interview:** Answering competency-based behavioral prompts via an automated video platform.\n4. **Assessment Center & Case Simulation:** Collaborative business case problem, presentation before senior leadership, and behavioral panel interviews.\n5. **Final Medical & Offer:** Medical examination followed by placement in a 12-month structured rotational training track.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates awaiting final semester results participate in Engro MTP?**\nYes. Final-year students completing all coursework within the intake year are eligible provided they meet the minimum 3.00 CGPA threshold.',
      '**Q2: What is the training duration and career progression?**\nThe management trainee program spans 12 months, after which successful trainees are confirmed into assistant manager or operational engineer positions.',
      '**Q3: Where can I verify official Engro corporate career updates?**\nAuthentic announcements are published exclusively on [engro.com/careers](https://www.engro.com/careers/).'
    ]
  },
  {
    id: 20,
    slug: 'unilever-future-leaders-2026',
    title: 'Unilever Future Leaders Programme (UFLP) 2026: Pakistan Selection & Career Guide',
    lastDate: '2026-10-19',
    metaDescription: 'Unilever Pakistan Future Leaders Programme (UFLP) career guide covering supply chain, marketing, customer development, and finance. Review selection stages and eligibility.',
    seoTitle: 'Unilever Future Leaders Programme 2026 Pakistan — Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Recruitment Track:** Unilever Future Leaders Programme (UFLP 2026).\n> - **Application Deadline:** The online application window closed on **19 October 2026**.\n> - **Current Status:** Shortlisted candidates are participating in digital gaming evaluations and HireVue video interview assessments.\n> - **Official Careers Portal:** [unilever.com.pk/careers](https://www.unilever.com.pk/careers/).',
      '### UFLP Program Structure & Scope',
      'The **Unilever Future Leaders Programme (UFLP)** is a globally acclaimed 3-year accelerated development track designed to groom young graduates into managerial roles within Unilever Pakistan. The program provides rotational leadership assignments across iconic brands in Nutrition, Personal Care, Beauty, and Home Care.',
      '### Functional Specializations in Pakistan',
      '| Career Function | Core Focus Areas | Deployment Hubs |\n| :--- | :--- | :--- |\n| **Supply Chain** | Manufacturing Operations, Logistics, Sustainability, Quality Assurance | Karachi, Rahim Yar Khan, Sheikhupura Factories |\n| **Marketing** | Brand Strategy, Consumer Market Insights, Digital Commerce, Brand Activation | Unilever Head Office (Karachi) |\n| **Customer Development** | Modern Trade, Key Account Management, Field Sales Distribution | Major Metros (Karachi, Lahore, Islamabad, Multan) |\n| **Finance** | Commercial Finance, Supply Chain Finance, Financial Planning & Analysis | Unilever Corporate Office |\n| **Human Resources** | Talent Development, Workplace Culture, Industrial Relations | Factory and Corporate Sites |',
      '### Eligibility Criteria',
      '- **Educational Background:** Bachelor’s or Master’s degree from an HEC-recognized university or international institution.\n- **Experience Limit:** Fresh graduates or professionals with less than 2 years of work experience.\n- **Core Attributes:** Strong leadership aptitude, analytical agility, adaptability, and resilience.',
      '### The 4-Stage Selection Workflow',
      '1. **Online Registration:** Basic demographic and academic profile submission.\n2. **Gamified Cognitive Assessment:** Interactive behavioral and cognitive exercises assessing situational judgment and problem-solving.\n3. **Digital Video Interview:** Competency-based scenario questions evaluated via digital video screening.\n4. **Discovery Center:** Comprehensive full-day immersion involving business presentations, simulated team tasks, and executive interviews.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is UFLP a permanent career employment program?**\nYes. UFLP is a full-time, permanent fast-track management trainee program offering structured rotations, mentorship, and accelerated leadership opportunities.',
      '**Q2: How often does Unilever Pakistan recruit for UFLP?**\nRecruitment occurs annually during the autumn cycle. Interested candidates should track announcements on [unilever.com.pk/careers](https://www.unilever.com.pk/careers/).'
    ]
  },
  {
    id: 67,
    slug: 'bank-of-punjab-relationship-officer-transaction-banking-2026',
    title: 'Bank of Punjab (BOP) Relationship Officer Jobs 2026: Transaction Banking Guide',
    lastDate: '2026-10-06',
    metaDescription: 'Bank of Punjab (BOP) Relationship Officer Transaction Banking recruitment guide for Karachi. Review commercial banking duties, eligibility criteria, and portal status.',
    seoTitle: 'Bank of Punjab Transaction Banking Jobs 2026 — Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Bank:** The Bank of Punjab (BOP).\n> - **Designation:** Relationship Officer — Transaction Banking Division.\n> - **Closing Date:** Online applications closed on **06 October 2026**.\n> - **Selection Stage:** Candidate screening and interview scheduling by BOP Human Resources Division in Karachi.\n> - **Official Careers Gateway:** [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).',
      '### Role Overview & Operational Significance',
      'The **Bank of Punjab (BOP)**—a scheduled commercial bank with extensive corporate and retail footprints—invited applications for **Relationship Officer — Transaction Banking** in Karachi. Transaction Banking officers manage institutional cash management, digital payroll solutions, supply chain finance, and trade collection workflows for corporate and mid-tier commercial clients.',
      '### Key Specifications Table',
      '| Parameter | Verified Job Requirement |\n| :--- | :--- |\n| **Employer** | The Bank of Punjab (BOP) |\n| **Division** | Corporate & Investment Banking / Transaction Banking Group |\n| **Deployment City** | Karachi, Sindh |\n| **Minimum Qualification** | Bachelor’s (16 Years) or Master’s in Business, Finance, Economics, Commerce |\n| **Experience Requirement** | 1 to 3 years in corporate cash management, operations, or commercial sales |\n| **Key Skills** | Cash management systems, corporate collections, client relationship building |',
      '### Primary Responsibilities',
      '- **Corporate Client Onboarding:** Implementing corporate cash management portals, host-to-host integrations, and automated bulk collection systems.\n- **Transaction Monitoring:** Ensuring fast settlement of high-value interbank transfers, RTGS transactions, and dividend payouts.\n- **Regulatory Compliance:** Adhering strictly to State Bank of Pakistan (SBP) Payment Systems guidelines and Foreign Exchange Manual directives.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: What is the typical selection process for experienced roles at BOP?**\nShortlisted candidates undergo technical interviews with the Group Head of Transaction Banking and HR, followed by credential verification and background checks.',
      '**Q2: Where does BOP advertise commercial and corporate banking vacancies?**\nAll verified openings are listed on the official portal: [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).'
    ]
  },
  {
    id: 68,
    slug: 'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026',
    title: 'Bank of Punjab Relationship Manager & Officer Jobs 2026: Corporate & Finance Centers',
    lastDate: '2026-10-08',
    metaDescription: 'Bank of Punjab (BOP) Corporate & Finance Center (CFC) career guide for Relationship Managers & Officers in Lahore, Karachi, and Multan. Review eligibility & portal guidelines.',
    seoTitle: 'BOP Relationship Manager & Officer CFC Jobs 2026 — Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** The Bank of Punjab (BOP) — Corporate & Finance Centers (CFC).\n> - **Positions:** Relationship Manager (RM) & Relationship Officer (RO).\n> - **Closing Date:** Online registration for these positions closed on **08 October 2026**.\n> - **Current Selection Status:** Portfolio and candidate profile review by regional Corporate Heads in Lahore, Karachi, Faisalabad, and Multan.\n> - **Official Job Portal:** [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).',
      '### Corporate & Finance Center (CFC) Overview',
      'Corporate & Finance Centers (CFCs) are specialized commercial hubs within **The Bank of Punjab** handling commercial loans, working capital financing, project finance, structured trade credit, and corporate deposits for mid-market and large commercial enterprises.',
      '### Vacancy Specifications',
      '| Job Title | Target Location | Experience Standard | Primary Responsibility |\n| :--- | :--- | :--- | :--- |\n| **Relationship Manager (RM)** | Lahore, Karachi, Multan, Faisalabad | 3 to 6 years commercial lending experience | Managing active corporate credit portfolios and deposit mobilization |\n| **Relationship Officer (RO)** | Regional CFC Branches | 1 to 3 years banking experience | Assisting RMs in credit proposal preparation (e-CIB, financial ratios) |',
      '### Mandatory Qualifications & Competencies',
      '- **Education:** Minimum Bachelor’s (16 years) or Master’s in Business Administration (MBA), Finance, Banking, or Accounting from an HEC-recognized university.\n- **Credit Analysis Skills:** Practical expertise in preparing Credit Proposal Memorandums (CPMs), assessing audited financial statements, debt-service coverage ratios (DSCR), and collateral valuation.\n- **Compliance:** Knowledge of SBP Prudential Regulations for Corporate and Commercial Banking.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates track submitted applications on the BOP portal?**\nYes. Registered applicants can view their application status by logging into their applicant account at [bop.com.pk/Available-Jobs](https://www.bop.com.pk/Available-Jobs).\n\n**Q2: What career advancement opportunities exist for CFC professionals?**\nSuccessful Relationship Officers advance to Senior RM, Team Leader Corporate Banking, and Regional Corporate Head positions within the commercial banking hierarchy.'
    ]
  },
  {
    id: 69,
    slug: 'askari-bank-sr-officer-artificial-intelligence-jobs-2026',
    title: 'Askari Bank AI Jobs 2026: Senior Officer Artificial Intelligence Recruitment Guide',
    lastDate: '2026-10-10',
    metaDescription: 'Askari Bank Limited career guide for Senior Officer Artificial Intelligence (Job ID 18053) in Islamabad. Review technical requirements, FinTech AI workflows, and portal details.',
    seoTitle: 'Askari Bank Senior Officer AI Jobs 2026 — FinTech Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Employer:** Askari Bank Limited (Digital Technology & Agile Division).\n> - **Job Reference:** Senior Officer Artificial Intelligence (Job ID: 18053).\n> - **Application Window:** This technical recruitment round closed on **10 October 2026**.\n> - **Selection Stage:** Technical code evaluations and virtual interviews conducted by the Digital Technology Group at Askari Bank Head Office in Islamabad.\n> - **Official Careers Gateway:** [careers.askaribank.com.pk](https://careers.askaribank.com.pk/).',
      '### Role Context: AI in Modern Banking',
      '**Askari Bank Limited** is advancing digital transformation across retail and commercial banking channels. The **Senior Officer Artificial Intelligence** role within the Digital Technology & Agile Division focuses on deploying predictive machine learning models, fraud detection algorithms, conversational AI agents, and automated credit scoring systems.',
      '### Position Profile & Technical Specifications',
      '| Attribute | Verified Official Requirement |\n| :--- | :--- |\n| **Hiring Division** | Digital Technology & Agile Division |\n| **Work Location** | Askari Bank Head Office, Islamabad |\n| **Educational Background** | BS / MS in Artificial Intelligence, Computer Science, Data Science, or Software Engineering |\n| **Experience Level** | 1 to 3 years hands-on experience in production machine learning / data science |\n| **Core Technical Stack** | Python, TensorFlow, PyTorch, Scikit-learn, SQL, Docker, FastAPI / Flask |\n| **Banking Use Cases** | Anti-fraud neural networks, credit scoring, NLP customer support bots |',
      '### Core Duties & Deliverables',
      '- **Machine Learning Pipeline Development:** Designing and fine-tuning predictive models using real-world banking transaction datasets.\n- **Fraud Prevention & Anomaly Detection:** Building automated triggers to identify suspicious debit card or mobile banking transaction spikes.\n- **NLP & Chatbots:** Integrating conversational agents to handle customer inquiries in English and Roman Urdu.\n- **Data Governance:** Ensuring all AI algorithms comply with State Bank of Pakistan (SBP) Framework for Risk Management in Digital Banking.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Are technical assessments conducted online?**\nYes. Shortlisted software and AI candidates typically complete an online programming and algorithmic assessment before panel interviews.\n\n**Q2: How can tech professionals track IT and software openings at Askari Bank?**\nAll technical positions are published on the official Askari Bank Careers Portal: [careers.askaribank.com.pk](https://careers.askaribank.com.pk/).'
    ]
  }
];

async function updateBatch2() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  console.log('Fetching live articles to build full payloads...');
  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allArticles = (await resAll.json()).data;

  console.log('=== UPDATING BATCH 2 (6 BANKING & CORPORATE ARTICLES) ===\n');

  for (const item of batch2Articles) {
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

  console.log('=== BATCH 2 UPDATES COMPLETE ===');
}

updateBatch2().catch(console.error);
