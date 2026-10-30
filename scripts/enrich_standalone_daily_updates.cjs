const fs = require('fs');
const Database = require('better-sqlite3');
const localDb = new Database('careerdost.sqlite');
const crypto = require('crypto');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

const env = fs.readFileSync('.env.local', 'utf8');
const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

const standaloneUpdates = [
  {
    slug: 'fpsc-consolidated-advertisement-09-2026-announced',
    title: 'FPSC Consolidated Advertisement No. 09/2026: 450+ Federal Posts Announced',
    shortDescription: 'Federal Public Service Commission (FPSC) Consolidated Advertisement 09/2026 released for 450+ general recruitment posts across FIA, MoD, and FGEI.',
    category: 'government-jobs',
    organization: 'Federal Public Service Commission (FPSC)',
    location: 'Islamabad (Nationwide Exam Centers)',
    qualification: 'Bachelor’s / Master’s Degree (14 to 16 Years) from HEC recognized university',
    experience: 'Fresh graduates & experienced candidates depending on post scale',
    positions: '450+ Vacancies across Federal Ministries',
    jobType: 'Regular Federal Government Employment',
    salary: 'BPS-16 to BPS-19 Scales with Federal Allowances',
    deadline: '2026-10-20',
    officialLink: 'https://fpsc.gov.pk',
    applyLink: 'https://online.fpsc.gov.pk',
    content: [
      'The **Federal Public Service Commission (FPSC)** has officially released **Consolidated Advertisement No. 09/2026**, announcing over 450 general recruitment vacancies across key federal ministries, autonomous divisions, and statutory defense establishments.',
      '### Major Departments & Cadres Included',
      'The recruitment drive includes critical appointments across the **Federal Investigation Agency (FIA)** (Assistant Directors and Inspectors), **Ministry of Defence** (Civilian technical and administrative cadres), **Federal Government Educational Institutions (FGEI)** (Lecturers and Trained Graduate Teachers), and the **Inland Revenue Department / FBR**.',
      '### Application Fee & Challan Submission Instructions',
      '1. **Fee Challan Download:** Candidates must download Treasury Challan Form 32-A from the official FPSC portal.\n2. **Bank Deposit:** Pay the prescribed examination fee (Rs. 300 for BPS-16/17, Rs. 750 for BPS-18, Rs. 1,200 for BPS-19) at any branch of National Bank of Pakistan (NBP) or the State Bank of Pakistan under head *C02101-Org of State Exam Fee (FPSC Receipt)*.\n3. **Online Submission:** Submit the online application at [online.fpsc.gov.pk](https://online.fpsc.gov.pk) retaining the original paid challan receipt for admission into the examination hall.'
    ]
  },
  {
    slug: 'hec-fully-funded-phd-scholarships-2026-open',
    title: 'HEC Fully Funded Overseas PhD Scholarships 2026: Phase-III Call for Top 300 Global Universities',
    shortDescription: 'Higher Education Commission (HEC) invites applications for Phase-III Overseas PhD Scholarships covering full tuition, living stipends, and travel allowance.',
    category: 'scholarships',
    organization: 'Higher Education Commission (HEC) Pakistan',
    location: 'Top 300 QS Ranked Global Universities',
    qualification: 'MS / MPhil (18 Years) with minimum 3.0 CGPA',
    experience: 'Academic research aptitude in high-priority national disciplines',
    positions: 'Subsidized PhD Fellowships across STEM & Social Sciences',
    jobType: 'Fully Funded International Fellowship',
    salary: 'Full Tuition Fee + Monthly Living Allowance + Return Airfare',
    deadline: '2026-11-15',
    officialLink: 'https://hec.gov.pk',
    applyLink: 'https://scholarship.hec.gov.pk',
    content: [
      'The **Higher Education Commission (HEC) Pakistan** has officially invited applications for its flagship **Overseas Scholarship Scheme (Phase-III)**, supporting Pakistani and AJ&K scholars to pursue PhD studies at top 300 QS-ranked global universities in the US, UK, Europe, Australia, and Asia.',
      '### Priority Research Disciplines & Coverage',
      'Priority funding allocations focus on emerging technology sectors, including Artificial Intelligence, Data Science, Climate Change, Renewable Energy, Biotechnology, Materials Engineering, and Public Policy. The scholarship provides comprehensive financial coverage including full university tuition fees, a monthly living stipend, round-trip economy airfare, and comprehensive health insurance.',
      '### Eligibility Matrix & Testing Requirement',
      '- **Citizenship:** Pakistani / AJ&K nationals with no dual nationality.\n- **Education:** Minimum 18 years of education (MS/MPhil/equivalent) with no third division in entire academic career.\n- **Aptitude Score:** Mandatory qualification in the **Higher Education Aptitude Test (HAT)** conducted by the Education Testing Council (ETC) with minimum 50% cumulative score.\n- **Submission:** Applications are processed exclusively through the HEC e-portal at [scholarship.hec.gov.pk](https://scholarship.hec.gov.pk).'
    ]
  },
  {
    slug: 'nts-nat-2026-october-test-roll-number-slips-uploaded',
    title: 'NTS NAT 2026 October Test: Admit Cards & Test Center Slip Download Portal',
    shortDescription: 'National Testing Service (NTS) has uploaded roll number slips and test center seat allocations for the October NAT examination series.',
    category: 'admissions',
    organization: 'National Testing Service (NTS) Pakistan',
    location: 'Designated Examination Centers Nationwide',
    qualification: 'Registered Candidates for NAT-IE, NAT-IM, NAT-ICS, NAT-IA, NAT-IG',
    experience: 'Entry-level university admission test',
    positions: 'Nationwide University Admission Screening',
    jobType: 'National Aptitude Test (Admissions)',
    salary: 'Standardized University Admission Credential',
    deadline: '2026-10-18',
    officialLink: 'https://nts.org.pk',
    applyLink: 'https://nts.org.pk',
    content: [
      'The **National Testing Service (NTS) Pakistan** has officially uploaded candidate **Roll Number Slips and Test Center Allocations** for the October National Aptitude Test (NAT 2026) cycle.',
      '### How to Download Roll Number Slips',
      '1. Visit the official NTS candidate gateway at [nts.org.pk](https://nts.org.pk).\n2. Navigate to the **Roll Number Slip** portal and select *National Aptitude Test (NAT 2026-X)*.\n3. Enter your Computerized National Identity Card (CNIC) or B-Form number without dashes.\n4. Download and print the generated admit card on clear A4 paper.',
      '### Test Day Mandatory Instructions',
      '- **Identification:** Candidates must present their printed Roll Number Slip alongside their **Original CNIC or Smart Card**. Photocopied IDs are strictly prohibited.\n- **Stationery:** Bring clipboards, blue/black ballpoint pens, and transparent water bottles. Mobile phones, smartwatches, and scientific calculators are barred inside test halls.'
    ]
  },
  {
    slug: 'pm-youth-laptop-scheme-phase-4-registration-alert',
    title: 'PM Youth Laptop Scheme Phase IV: Student Data Verification & Portal Guidelines',
    shortDescription: 'Prime Minister Youth Laptop Scheme Phase-IV verification reminder for enrolled students in public sector universities across Pakistan.',
    category: 'government-schemes',
    organization: 'Prime Minister Youth Programme (PMYP) & HEC',
    location: 'Public Sector Higher Education Institutions Nationwide',
    qualification: 'Enrolled in accredited BS, Master’s, or PhD degree programs',
    experience: 'Active university enrollment with good academic standing',
    positions: '100,000+ Laptops Distribution Nationwide',
    jobType: 'Federal Student Technology Empowerment Scheme',
    salary: 'High-Performance Laptop with Licensed Software',
    deadline: '2026-10-31',
    officialLink: 'https://pmyp.gov.pk',
    applyLink: 'https://laptop.pmyp.gov.pk',
    content: [
      'The **Prime Minister Youth Programme (PMYP)** in coordination with the Higher Education Commission has issued an urgent verification advisory for registered students under the **PM Youth Laptop Scheme (Phase IV)**.',
      '### Student Data Validation Protocol',
      'All undergraduate, graduate, and doctoral scholars enrolled in recognized public-sector universities must ensure their academic records, enrollment numbers, CGPA, and disability quota statuses are fully validated on the PMYP portal at [laptop.pmyp.gov.pk](https://laptop.pmyp.gov.pk).',
      '### Merit Determination & Distribution Quotas',
      '- **Provincial & Regional Allocation:** Laptops are distributed based on national enrollment ratios, with dedicated affirmative quotas for Balochistan, Gilgit-Baltistan, and merged districts.\n- **Departmental Verification:** The focal person at each public university verifies applicant credentials against official university gazettes before generating the provisional institutional merit list.'
    ]
  }
];

async function updateStandaloneDailyUpdates() {
  console.log('=== STARTING STANDALONE DAILY UPDATES ENRICHMENT ===');

  for (const item of standaloneUpdates) {
    console.log(`Updating daily update: ${item.slug} ...`);

    const payload = {
      slug: item.slug,
      title: item.title,
      shortDescription: item.shortDescription,
      category: item.category,
      organization: item.organization,
      location: item.location,
      qualification: item.qualification,
      experience: item.experience,
      positions: item.positions,
      jobType: item.jobType,
      salary: item.salary,
      deadline: item.deadline,
      officialLink: item.officialLink,
      applyLink: item.applyLink,
      isVerified: true,
      content: item.content,
      status: 'published'
    };

    // Update D1
    const putRes = await fetch(`https://careerdost.blog/api/admin/updates/${item.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    const json = await putRes.json();
    if (!putRes.ok || !json.success) {
      console.error(`FAILED to update D1 for update ${item.slug}:`, json);
    } else {
      console.log(`  -> SUCCESS: Cloudflare D1 daily update updated for ${item.slug}`);
    }

    // Update local SQLite
    localDb.prepare(`
      UPDATE daily_updates SET
        title = ?,
        short_description = ?,
        category = ?,
        organization = ?,
        location = ?,
        qualification = ?,
        experience = ?,
        positions = ?,
        job_type = ?,
        salary = ?,
        deadline = ?,
        official_link = ?,
        apply_link = ?,
        content = ?,
        is_verified = 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(
      item.title,
      item.shortDescription,
      item.category,
      item.organization,
      item.location,
      item.qualification,
      item.experience,
      item.positions,
      item.jobType,
      item.salary,
      item.deadline,
      item.officialLink,
      item.applyLink,
      JSON.stringify(item.content),
      item.slug
    );
    console.log(`  -> SUCCESS: Local SQLite daily update updated for ${item.slug}\n`);
  }

  console.log('=== STANDALONE DAILY UPDATES ENRICHMENT COMPLETE ===');
}

updateStandaloneDailyUpdates().catch(console.error);
