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

const batch5Articles = [
  {
    id: 15,
    slug: 'punjab-rozgar-scheme-2026',
    title: 'Punjab Rozgar Scheme 2026: Subsidized Business Loans & Online Application Guide',
    lastDate: '2026-10-31',
    metaDescription: 'Punjab Rozgar Scheme 2026 guide for subsidized business loans up to Rs 10 Million via PSIC & Bank of Punjab. Review eligibility tiers, markup rates, and portal steps.',
    seoTitle: 'Punjab Rozgar Scheme 2026 — Subsidized Loans & Apply Online',
    content: [
      '> [!IMPORTANT]\n> **Official Scheme Overview & Verification Notice:**\n> - **Executing Bodies:** Punjab Small Industries Corporation (PSIC), Industries Department & The Bank of Punjab (BOP).\n> - **Financing Scope:** Priority subsidized micro and small enterprise loans from **Rs. 100,000 up to Rs. 10 Million (1 Crore)**.\n> - **Target Beneficiaries:** Educated youth, university graduates, TEVTA/PBTE certified technicians, women entrepreneurs, and existing micro-enterprises in Punjab.\n> - **Official Application Gateway:** [rozgar.psic.punjab.gov.pk](https://rozgar.psic.punjab.gov.pk/).',
      '### Purpose of the Punjab Rozgar Scheme',
      'The **Punjab Rozgar Scheme** is a flagship provincial economic empowerment initiative launched by the Government of Punjab to curb youth unemployment and stimulate micro-industrialization. In collaboration with **The Bank of Punjab (BOP)**, the government subsidizes commercial lending mark-up rates, enabling young entrepreneurs to establish new ventures or expand existing production capacity.',
      '### Loan Categories & Financing Tiers',
      '| Financing Tier | Loan Amount Range | Security / Guarantee Required | Target Beneficiary Group |\n| :--- | :--- | :--- | :--- |\n| **Micro-Enterprise Loans** | **Rs. 100,000 to Rs. 1,000,000** | Personal Guarantee / Third-Party Citizen Guarantee | Startups, skilled artisans, home-based businesses, women entrepreneurs |\n| **Small Business Loans** | **Rs. 1,000,001 to Rs. 10,000,000** | Tangible Property / Commercial Asset Collateral | Expanding manufacturers, tech software houses, retail chains, food processing |',
      '### Key Financial Specifications',
      '- **Subsidized Mark-Up:** Approximately **4% to 5% flat/subsidized rate** (the Punjab Government reimburses the differential interest to the commercial lending bank).\n- **Repayment Tenor:** Flexible repayment schedule spanning **2 to 5 years** with an initial **6-month grace period** on principal repayment.\n- **Equity Contribution:** Borrower must contribute nominal equity (typically 20% for startups; 10% to 15% for existing operating businesses).',
      '### Mandatory Eligibility Criteria',
      '1. **Domicile & Age:** Resident citizen holding a valid **Punjab Domicile** and Computerized National Identity Card (CNIC), aged between **20 and 50 years**.\n2. **Academic / Vocational Qualification:** University graduates, diploma holders from TEVTA or Punjab Board of Technical Education (PBTE), or certified artisans.\n3. **Credit History:** Clean credit record on State Bank of Pakistan electronic Credit Information Bureau (e-CIB) with no active default on commercial bank facilities.',
      '### Step-by-Step Online Application Workflow',
      '1. **Access Official Portal:** Visit the dedicated government portal at [rozgar.psic.punjab.gov.pk](https://rozgar.psic.punjab.gov.pk).\n2. **User Registration:** Register using your 13-digit CNIC and verified mobile number.\n3. **Business Feasibility Submission:** Input your business concept, projected revenue, equipment purchase list, and required loan amount.\n4. **Document Uploads:** Upload scanned copies of CNIC, Domicile, academic degrees/diplomas, business premises proof (rent deed or property ownership), and passport photograph.\n5. **Bank Processing Fee:** Deposit the non-refundable Rs. 2,000 processing challan at any designated Bank of Punjab branch.\n6. **Scrutiny & Interview:** PSIC conducts preliminary project feasibility scrutiny, followed by credit evaluation and disbursement by The Bank of Punjab.',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can women entrepreneurs get priority under the Punjab Rozgar Scheme?**\nYes. The scheme features dedicated preferential quota allocations and faster credit scrutiny windows for female entrepreneurs and women-led startups.\n\n**Q2: Can existing businesses apply for expansion funding?**\nYes. Operating businesses registered with FBR / provincial revenue authorities can apply for small business loans up to Rs. 10 Million for machinery modernization or working capital.\n\n**Q3: Where can applicants track their loan approval status?**\nApplicants can log in to their dashboard at [rozgar.psic.punjab.gov.pk](https://rozgar.psic.punjab.gov.pk) or contact the PSIC Helpline at `042-99201596`.'
    ]
  },
  {
    id: 16,
    slug: 'bise-lahore-matric-result-2026',
    title: 'BISE Lahore Matric (SSC Part-II) Result 2026: Official Check, SMS & Rechecking Guide',
    lastDate: '2026-09-30',
    metaDescription: 'BISE Lahore Matric (SSC Part-II) 2026 result checking guide. Review roll number search methods, official 800291 SMS code, e-gazette download, and rechecking rules.',
    seoTitle: 'BISE Lahore Matric Result 2026 — Official Check & SMS Guide',
    content: [
      '> [!NOTE]\n> **Examination Authority & Result Verification Notice:**\n> - **Board:** Board of Intermediate and Secondary Education (BISE) Lahore.\n> - **Examination:** Secondary School Certificate (SSC Annual Part-II / 10th Class).\n> - **Jurisdiction Districts:** Lahore, Kasur, Sheikhupura, and Nankana Sahib.\n> - **Official Result Portal:** [biselahore.com](https://www.biselahore.com/).',
      '### Official Result Declaration Overview',
      'The **Board of Intermediate and Secondary Education (BISE) Lahore** is the largest examination board in Punjab, conducting matriculation and intermediate examinations for over 300,000 regular and private candidates annually. The official Matric (SSC Part-II) result gazette provides detailed subject-wise marks, grading scales, and qualification credentials.',
      '### 3 Verified Ways to Check BISE Lahore Matric Result',
      '| Checking Method | Access Pathway | Operational Instructions |\n| :--- | :--- | :--- |\n| **1. Online Web Portal** | [biselahore.com](https://www.biselahore.com/) | Navigate to Results section -> Enter 6-digit Roll Number -> Click "View Result" |\n| **2. Mobile SMS Service** | **SMS to 800291** | Type your Roll Number in SMS body -> Send to **800291** -> Receive subject-wise marks via reply |\n| **3. Institutional E-Gazette** | PDF Gazette on Board Server | Download full PDF gazette searchable via candidate name or school code (EMIS Code) |',
      '### Paper Rechecking & Grievance Schedule',
      'Candidates who wish to have their answer scripts re-checked must apply through the **BISE Lahore Online E-Services Portal** within **15 days** of result declaration:\n- **Scope of Rechecking:** Under Punjab Boards regulations, rechecking comprises: (1) verifying that all questions have been marked, (2) checking totaling errors on the title page, (3) verifying that answer sheet pages are intact, and (4) ensuring candidate handwriting matches the script.\n- **Application Fee:** Rechecking fee per paper must be deposited via automated online challan in designated Habib Bank Limited (HBL) branches or 1Link mobile banking.\n- **Physical Attendance:** The candidate will be assigned a date to review their marked answer script in the presence of the Rechecking Committee at BISE Lahore Headquarters (86-Mozang Road, Lahore).',
      '### Official Detailed Marks Certificate (DMC) Collection',
      '- **Regular School Candidates:** Official hard-copy DMCs with security holograms and barcodes are dispatched directly to candidate schools within 15 working days.\n- **Private Candidates:** DMCs are delivered via registered postal parcel to the residential address specified in the admission form.',
      '### Next Steps: Intermediate College Admissions in Punjab',
      'Qualifying candidates can proceed with online admissions for Higher Secondary School Certificate (HSSC / Intermediate) programs across Punjab colleges (Pre-Medical, Pre-Engineering, ICS, I.Com, Humanities) via the **Online College Admissions System (OCAS Punjab)** at [ocas.punjab.gov.pk](https://ocas.punjab.gov.pk).',
      '### Frequently Asked Questions (FAQs)',
      '**Q1: Can a candidate request re-marking or re-evaluation of an answer?**\nNo. Under board regulations, an examiner’s award cannot be re-evaluated; rechecking is strictly confined to totaling verification and unmarked question checks.\n\n**Q2: What is the official BISE Lahore SMS shortcode?**\nThe official SMS code for BISE Lahore is **800291**.\n\n**Q3: How can candidates apply for duplicate result cards or verification?**\nDuplicate result cards and online verifications for HEC or foreign embassies can be applied for via the BISE Lahore E-Service Portal at [biselahore.com](https://www.biselahore.com/).'
    ]
  }
];

async function updateBatch5() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);
  const localDb = new Database('careerdost.sqlite');

  console.log('Fetching live articles to build full payloads...');
  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allArticles = (await resAll.json()).data;

  console.log('=== UPDATING BATCH 5 (2 SCHEMES & RESULTS ARTICLES) ===\n');

  for (const item of batch5Articles) {
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

  console.log('=== BATCH 5 UPDATES COMPLETE ===');
}

updateBatch5().catch(console.error);
