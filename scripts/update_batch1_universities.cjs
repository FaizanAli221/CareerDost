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

const batch1Articles = [
  {
    id: 54,
    slug: 'university-of-chakwal-uoc-jobs-2026',
    title: 'University of Chakwal (UOC) Jobs 2026: Teaching Faculty & Administrative Staff Guide',
    lastDate: '2026-10-15',
    metaDescription: 'University of Chakwal (UOC) recruitment guide for Adv No. 05 & 06/2026 covering faculty and staff posts. Review HEC eligibility criteria, test status, and archival guidelines.',
    seoTitle: 'University of Chakwal Jobs 2026 (Adv 05 & 06/2026) — CareerDost',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Intake Round:** Advertisement No. 05/2026 (Teaching Faculty) & 06/2026 (Non-Teaching Staff).\n> - **Closing Date:** The initial application window closed on **15 October 2026**.\n> - **Current Selection Stage:** The Registrar Scrutiny Committee is reviewing candidate dossiers, academic equivalence certificates, and fee receipts. Eligible shortlisted candidates will receive call letters / SMS for screening tests and Selection Board interviews.\n> - **Official Portal:** [uoc.edu.pk/jobs.php](https://www.uoc.edu.pk/jobs.php).',
      '### University Overview & Recruitment Scope',
      'The **University of Chakwal (UOC)**—a public-sector chartered university established by the Government of Punjab—announced recruitment for permanent and contract-based academic faculty and administrative personnel under Advertisements 05/2026 and 06/2026.',
      'Positions encompass multiple faculties including Computer Science & Information Technology, Law, Pharmacy, English Literature, and Natural Sciences, alongside administrative support staff.',
      '### Verified Faculty & Administrative Vacancies',
      '| Designation / Role | Department / Discipline | Minimum HEC Qualification | Appointment Framework |\n| :--- | :--- | :--- | :--- |\n| **Assistant Professor** | CS, Law, Pharmacy, English, Physics | PhD in relevant field from HEC-recognized university | Regular / TTS / Contract |\n| **Lecturer** | Computer Science, Law, Chemistry, English | MS / MPhil (18 Years education) in relevant discipline | Regular / Contract |\n| **Assistant Registrar** | Central University Administration | Master’s degree / BS (16 Years) with administrative experience | Regular BPS-17 |\n| **Accounts Officer** | Treasurer Department | M.Com / MBA (Finance) / BS Accounting & Finance | Regular BPS-17 |\n| **Sub-Engineer / Lab Staff**| Engineering & Science Laboratories | DAE (Civil/Electrical) or B.Sc in relevant scientific field | BPS-11 to BPS-14 |',
      '### Eligibility & Document Requirements',
      '- **Academic Standards:** All academic degrees, transcripts, and diplomas must be issued by HEC-recognized institutions or the Punjab Board of Technical Education (PBTE).\n- **HEC Equivalence:** Candidates with foreign degrees must submit an official Equivalence Certificate issued by the Higher Education Commission (HEC) Islamabad.\n- **In-Service Candidates:** Government or semi-government employees must have applied through proper channels with a departmental No Objection Certificate (NOC).\n- **Required Dossier for Shortlisted Candidates:**\n  1. Printed and signed UOC Job Application Form.\n  2. Three passport-size attested photographs.\n  3. Attested copies of CNIC, Domicile, Matric, Intermediate, Bachelor’s, and Master’s/PhD transcripts.\n  4. Paid original bank challan deposit receipt (retained for verification).',
      '### What Shortlisted Applicants Should Expect Next',
      '1. **Scrutiny Phase:** The Scrutiny Committee verifies eligibility, marks distribution, and research publication metrics in HEC-recognized journals (HJRS).\n2. **Written Screening Test (Where Applicable):** For administrative and clerical positions with a high volume of candidates, a written screening test is organized before the interview.\n3. **Selection Board & Syndicate:** Qualified academic candidates are invited for classroom teaching demonstrations followed by a formal interview before the UOC Selection Board.\n4. **Merit List Publication:** Final appointment recommendations are submitted to the University Syndicate for formal approval and issuance of appointment letters.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can candidates still submit applications for Adv 05/2026 and 06/2026?**\nNo. The application deadline of 15 October 2026 has passed. Candidates should monitor the official UOC jobs portal for future advertisement cycles.',
      '**Q2: How will shortlisted applicants be notified for tests and interviews?**\nShortlisted candidates are notified via official call letters dispatched to their postal addresses, SMS notifications, and notifications uploaded on the university website.',
      '**Q3: Where can I check future recruitment notices for the University of Chakwal?**\nOfficial career notifications are published exclusively on the University of Chakwal jobs portal at [uoc.edu.pk/jobs.php](https://www.uoc.edu.pk/jobs.php).'
    ]
  },
  {
    id: 55,
    slug: 'air-university-islamabad-jobs-2026',
    title: 'Air University Islamabad Jobs 2026: Faculty & Professional Staff Recruitment Guide',
    lastDate: '2026-10-20',
    metaDescription: 'Air University Islamabad recruitment guide covering faculty, Fazaia Medical College, and administrative positions. Review eligibility standards, selection stages, and portal details.',
    seoTitle: 'Air University Islamabad Jobs 2026 — Faculty & Staff Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** Air University, Islamabad (Established under Pakistan Air Force / PAF).\n> - **Closing Date:** Online applications for this recruitment cycle closed on **20 October 2026**.\n> - **Selection Stage:** Departments are conducting applicant credential scrutiny and candidate shortlisting for faculty evaluations and written/technical assessments.\n> - **Official Job Portal:** [portals.au.edu.pk/jobs](https://portals.au.edu.pk/jobs/).',
      '### Institutional Overview',
      '**Air University (AU)** is a premier federal public chartered university headquartered in Islamabad, with regional campuses in Multan, Kamra, and Kharian. Operating under the auspices of the Pakistan Air Force, AU maintains recognized faculties in Engineering, Computer Science, Cyber Security, Management Sciences, and Healthcare (Fazaia Medical College).',
      '### Positions & Departmental Breakdown',
      '| Faculty / Department | Positions Offered | Mandatory Qualification (HEC / PM&DC) | Location |\n| :--- | :--- | :--- | :--- |\n| **Faculty of Computing & AI** | Assistant Professor, Lecturer, Lab Engineer | MS / MPhil / PhD in Computer Science, AI, Cyber Security | Islamabad Main Campus |\n| **Faculty of Aerospace & Avionics** | Associate Professor, Assistant Professor | PhD in Aerospace, Avionics, or Mechanical Engineering | Islamabad / Kamra |\n| **Fazaia Medical College** | Assistant Professor, Senior Registrar | MBBS + FCPS / MD or MPhil in Anatomy, Pathology, Surgery | FMC Islamabad |\n| **University Administration** | Assistant Director Finance, HR Officer, ORIC Specialist | Master’s / 16 Years Degree in Finance, Management, HR | Islamabad Campus |',
      '### Standard Eligibility & Selection Framework',
      '- **Engineering Disciplines:** Must hold valid Pakistan Engineering Council (PEC) registration as a Registered or Professional Engineer.\n- **Medical Faculty:** Must hold valid Pakistan Medical & Dental Council (PM&DC) permanent license and verified supervisory/clinical experience.\n- **Computing & Management:** Minimum 18 years of education (MS/MPhil) with a strong academic record (minimum CGPA 3.0/4.0) for Lecturer positions; PhD with verified publications in HEC HJRS recognized journals for Professorial tracks.\n- **Competitive Package:** Air University provides semi-government pay packages including provident fund, group insurance, and medical coverage.',
      '### Selection Procedure Workflow',
      '1. **Online Scrutiny:** Preliminary filtering based on academic credentials, CGPA, and relevance of specialization.\n2. **Technical Presentation / Teaching Demo:** Shortlisted faculty candidates deliver a demonstration lecture before a departmental expert committee.\n3. **Selection Board Interview:** Formal interview with the university leadership, external subject experts, and Air Headquarters representatives.\n4. **Appointment:** Final selection requires clearance from the Air University Board of Governors.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can applicants modify submitted profiles after the 20 October deadline?**\nNo. Once the portal deadline has expired, submissions are locked for formal scrutiny.',
      '**Q2: Are Air University positions open to civilian applicants?**\nYes. While established under the PAF, faculty and professional staff appointments are open to qualified civilian professionals from across Pakistan on merit.',
      '**Q3: Where can I check future job openings at Air University?**\nAll official vacancies are posted directly on the Air University Job Portal at [portals.au.edu.pk/jobs](https://portals.au.edu.pk/jobs/).'
    ]
  },
  {
    id: 57,
    slug: 'sarhad-university-suit-peshawar-jobs-2026',
    title: 'Sarhad University (SUIT) Peshawar Jobs 2026: Faculty & Pharmacy Recruitment Guide',
    lastDate: '2026-10-02',
    metaDescription: 'Sarhad University of Science & IT (SUIT) Peshawar career guide for faculty and pharmacy vacancies. Review eligibility criteria, Pharmacy Council standards, and portal details.',
    seoTitle: 'Sarhad University Peshawar Jobs 2026 — Faculty Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Institution:** Sarhad University of Science & Information Technology (SUIT), Peshawar.\n> - **Closing Date:** Online registration for these faculty vacancies closed on **02 October 2026** (Islamic Studies) and **30 September 2026** (Pharmaceutical Sciences).\n> - **Current Status:** Applications are under administrative scrutiny by the Registrar Office and Faculty Deans.\n> - **Official Career Portal:** [career.suit.edu.pk](https://career.suit.edu.pk/).',
      '### University Profile & Academic Focus',
      '**Sarhad University of Science & Information Technology (SUIT)** is a chartered private-sector university recognized by the Higher Education Commission (HEC) of Pakistan and the Government of Khyber Pakhtunkhwa. The university operates state-of-the-art academic departments in Pharmacy, Allied Health Sciences, Computer Science, Engineering, and Social Sciences at its Ring Road campus in Peshawar.',
      '### Vacancy Categories & Qualification Requirements',
      '| Academic Department | Positions Advertised | Minimum Qualification | Regulatory Accreditation |\n| :--- | :--- | :--- | :--- |\n| **Faculty of Pharmaceutical Sciences** | Assistant Professor, Lecturer (Vacancies 63 to 67) | Pharm-D + MPhil / PhD in Pharmacology, Pharmaceutics, Pharmacognosy | Valid Pharmacy Council of Pakistan (PCP) Registration |\n| **Department of Islamic Studies** | Assistant Professor, Lecturer (Vacancies 68 & 69) | MPhil / PhD in Islamic Studies from an HEC-recognized university | HEC Faculty Appointment Criteria |',
      '### Key Competencies & Application Scrutiny Criteria',
      '- **Pharmacy Roles:** Candidates must hold an active registration number from the Pharmacy Council of Pakistan and demonstrate laboratory research experience.\n- **Academic Integrity:** Only degrees recognized by the HEC are accepted; third division in the academic career is generally not permissible under university service statutes.\n- **Selection Process:** Eligible candidates undergo departmental interviews, evaluation of research publications, and demonstration lectures before the Board of Faculty.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: What should candidates who applied before October 2 do now?**\nCandidates should monitor the email address provided in their online application on `career.suit.edu.pk` for interview call letters and demonstration schedules.',
      '**Q2: Does SUIT Peshawar recruit faculty on a rolling basis?**\nYes. SUIT frequently posts academic and clinical vacancies across each academic semester on its official career portal: [career.suit.edu.pk](https://career.suit.edu.pk/).'
    ]
  },
  {
    id: 59,
    slug: 'times-university-multan-tum-jobs-2026',
    title: 'TIMES University Multan Jobs 2026: Academic Faculty & Lecturer Recruitment Guide',
    lastDate: '2026-10-01',
    metaDescription: 'TIMES University Multan (TUM) recruitment guide for academic faculty and lecturer positions. Review HEC eligibility standards, subject disciplines, and portal guidelines.',
    seoTitle: 'TIMES University Multan Jobs 2026 — Faculty Career Guide',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Institution:** TIMES Institute / University Multan (TUM).\n> - **Closing Date:** Submissions for this recruitment round closed on **01 October 2026**.\n> - **Current Stage:** Academic credentials review and preliminary candidate shortlisting by the Directorate of Human Resources.\n> - **Official Website:** [tum.edu.pk/jobs](https://www.tum.edu.pk/jobs/).',
      '### Institution Overview',
      '**TIMES University Multan (TUM)** is a chartered higher education institution located in South Punjab, offering undergraduate and graduate degree programs in Natural Sciences, Management, Economics, Computer Sciences, and Law.',
      '### Advertised Faculty Positions & Eligibility Standards',
      '| Academic Department | Position Level | Minimum Education Requirement | Preferred Experience |\n| :--- | :--- | :--- | :--- |\n| **Microbiology & Biochemistry** | Lecturer / Assistant Professor | MPhil / MS (18 Years) or PhD in Microbiology / Biochemistry | 1-2 years university laboratory teaching experience |\n| **Economics** | Lecturer | MS / MPhil in Economics with strong quantitative background | Research thesis in applied or developmental economics |\n| **Management Sciences** | Lecturer | MS / MPhil in Management Sciences / MBA (18-year equivalent) | Relevant industry or academic teaching background |',
      '### Standard University Selection Process',
      '1. **Application Scrutiny:** Verification of HEC-recognized degrees, transcripts, and cumulative grade point average (minimum CGPA 3.0/4.0 in semester system).\n2. **Departmental Evaluation:** Shortlisted applicants are invited for in-person demonstration lectures and panel interviews in Multan.\n3. **Final Offer:** Selected candidates receive contractual appointments with university allowances.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Is TIMES University recognized by HEC?**\nYes, TIMES Institute / University Multan is a chartered institution recognized by the Higher Education Commission of Pakistan.\n\n**Q2: How can interested candidates track future teaching openings?**\nUpcoming employment announcements are published on the official university portal at [tum.edu.pk/jobs](https://www.tum.edu.pk/jobs/).'
    ]
  },
  {
    id: 61,
    slug: 'university-of-lahore-uol-jobs-2026',
    title: 'University of Lahore (UOL) Jobs 2026: Teaching Faculty & Hospital Staff Recruitment Guide',
    lastDate: '2026-10-10',
    metaDescription: 'University of Lahore (UOL) career guide covering professorial faculty and teaching hospital vacancies. Review HEC/PM&DC criteria, hospital tracks, and portal details.',
    seoTitle: 'University of Lahore Jobs 2026 — Teaching & Healthcare Careers',
    content: [
      '> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Institution:** The University of Lahore (UOL) & The University of Lahore Teaching Hospital.\n> - **Closing Date:** Online submissions for this recruitment phase closed on **10 October 2026**.\n> - **Current Status:** Applications are under administrative and medical board review for academic demonstration and clinical interviews.\n> - **Official Careers Gateway:** [careers.uol.edu.pk](https://careers.uol.edu.pk/).',
      '### University & Healthcare Complex Overview',
      '**The University of Lahore (UOL)** is one of Pakistan’s largest private-sector universities, chartered by the Government of Punjab with a nationwide presence. It encompasses extensive faculties in Engineering, Computer Science, Law, and Allied Health Sciences, along with the 700+ bed University of Lahore Teaching Hospital and University Institute of Radiological Sciences.',
      '### Faculty & Clinical Hospital Openings',
      '| Stream / Wing | Roles Advertised | Minimum Required Credentials | Governing Regulatory Body |\n| :--- | :--- | :--- | :--- |\n| **Academic Faculty** | Professor, Associate Professor, Assistant Professor | PhD / MPhil in Engineering, Computer Science, Allied Health | Higher Education Commission (HEC) |\n| **Clinical Healthcare** | Senior Registrar, Specialist Consultant | MBBS + FCPS / MD / MS in specialized clinical disciplines | Pakistan Medical & Dental Council (PM&DC) |\n| **Allied Health Sciences** | Clinical Lecturer, Lab Technologist | BS / MS in Medical Laboratory Technology, Radiology, Physical Therapy | Respective Allied Health Councils |',
      '### Standard Eligibility Guidelines',
      '- **Teaching Faculty:** Must fulfill HEC criteria for appointment at respective ranks (verified impact factor publications for Associate/Full Professor ranks).\n- **Hospital Staff:** Must hold valid permanent PM&DC registration without clinical malpractice history.\n- **Compensation:** Market-competitive private university pay package with hospital allowances and group health insurance.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: How can applicants check the status of their UOL online application?**\nApplicants can log in to their candidate dashboard on the UOL careers portal at [careers.uol.edu.pk](https://careers.uol.edu.pk/) using their registered email and password.\n\n**Q2: How frequently does UOL post new career openings?**\nUOL publishes open positions on a rolling basis across both academic semesters and clinical hospital expansions at [careers.uol.edu.pk](https://careers.uol.edu.pk/).'
    ]
  }
];

async function updateBatch1() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  console.log('Fetching live articles to build full payloads...');
  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allArticles = (await resAll.json()).data;

  console.log('=== UPDATING BATCH 1 (5 UNIVERSITY ARTICLES) ===\n');

  for (const item of batch1Articles) {
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

  console.log('=== BATCH 1 UPDATES COMPLETE ===');
}

updateBatch1().catch(console.error);
