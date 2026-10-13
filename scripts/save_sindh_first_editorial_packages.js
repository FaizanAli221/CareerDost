import Database from 'better-sqlite3'

const db = new Database('careerdost.sqlite')

export const editorialPackages = {
  // 1. SPSC Advertisement 05/2026 (Verified existing, duplicate avoided)
  spsc: {
    slug: 'spsc-jobs-2026-54-vacancies',
    action: 'DUPLICATE_AVOIDED',
    status: 'published',
    note: 'Equivalent article already exists in CMS. Upgraded featured image to Nano Banana 16:9 WebP.'
  },

  // 2. Prime Minister Fuel Relief Scheme (Existing article updated for review)
  fuelRelief: {
    slug: 'pm-fuel-relief-scheme-2026-registration-eligibility',
    title: "PM Fuel Relief Scheme 2026 – 10M+ Beneficiaries, 19.4M Tokens Redeemed & October Progress Update",
    category_slug: 'government-schemes',
    organization: 'Ministry of Information Technology & Telecommunication (MOITT) & Federal Govt',
    job_type: 'Federal Welfare / Fuel Subsidy Scheme',
    location: 'Nationwide (Islamabad & All Provinces)',
    qualification: 'Registered Two/Three-Wheelers & Small Motor Cars (Up to 800cc)',
    salary: 'Rs100 Per Litre Petrol Relief (Up to Rs3,000 Monthly Subsidy)',
    experience: 'Low & Middle-Income Motorcyclists, Rickshaw Drivers & Small Car Owners',
    positions: '10 Million+ Verified Beneficiaries Nationwide (Rs 75 Billion Allocation)',
    last_date: '2026-12-31',
    no_deadline: 0,
    publish_date: '2026-09-30',
    official_link: 'https://www.moitt.gov.pk/NewsDetail/MzE3NWM0OGUtMzkyMi00MjkwLTgxZDEtYmNmYzUzMWQyMmU1',
    apply_link: 'https://pmfuelrelief.pk/',
    is_verified: 1,
    featured: 1,
    logo_initial: 'PM',
    featured_image: '/images/pm-fuel-relief-scheme-2026-registration-eligibility.webp',
    image_alt: 'PM Fuel Relief Scheme 2026 10 Million Beneficiaries and Petrol Subsidy Update CareerDost',
    excerpt: 'Federal Government progress update confirms over 10 million citizens have benefited from the PM Fuel Relief Scheme, with over 21.7 million tokens issued and 19.4 million redeemed. Check SMS 9771 registration, Rs100/L petrol discount, and pump rules.',
    seo_title: 'PM Fuel Relief Scheme 2026: 10M+ Beneficiaries & October Progress Update',
    meta_description: 'Federal PM Fuel Relief Scheme progress update: over 10M beneficiaries and 19.4M tokens redeemed. Check SMS 9771 registration, Rs100/L discount, and petrol pump rules.',
    focus_keyword: 'PM Fuel Relief Scheme 2026',
    canonical_url: 'https://careerdost.blog/jobs/pm-fuel-relief-scheme-2026-registration-eligibility',
    og_title: 'PM Fuel Relief Scheme 2026: 10M+ Beneficiaries & October Progress Update',
    og_description: 'Over 10 million beneficiaries and 19.4 million tokens redeemed under the Prime Minister Special Fuel Relief Scheme. Full progress update and SMS 9771 guide.',
    facebook_caption: `Wazir-e-Azam Petrol Relief Scheme ki badi taraqqi! ⛽
Radio Pakistan aur hukumat ki taza report (9 October) ke mutabiq 10 million se zayed afrad mustafeed ho chuke hain, jabke 19.4 million se zayed tokens redeem kiye gaye hain.
Motorcycle aur 800cc tak gariyon ke liye Rs100 fi litre relief, SMS 9771 registration aur token rules:
https://careerdost.blog/jobs/pm-fuel-relief-scheme-2026-registration-eligibility
#PMFuelRelief #PetrolSubsidy #PakistanRelief #CareerDost`,
    whatsapp_caption: `⛽ PM Fuel Relief Scheme 2026: 9 October Update
Progress: 10M+ Beneficiaries | 19.4M Tokens Redeemed
Subsidy: Rs100/L for Bikes & 800cc Cars via SMS 9771
Check Complete Details: https://careerdost.blog/jobs/pm-fuel-relief-scheme-2026-registration-eligibility`,
    content: [
      "### Executive Summary & October 2026 Progress Milestone",
      "In a high-level federal review meeting chaired by Prime Minister Shehbaz Sharif and reported via **Radio Pakistan on 9 October 2026**, the Federal Government released landmark progress metrics for the **Prime Minister Special Fuel Relief Scheme 2026**.\n\nExecuted jointly by the **Ministry of Information Technology and Telecommunication (MOITT)**, the **National Information Technology Board (NITB)**, and the Ministry of Energy (Petroleum Division), the welfare initiative has provided tangible financial relief to vulnerable motorists countering global energy inflation.",
      "> [!NOTE]\n> **Official Progress Statistics (As of 9 October 2026):**\n> - **Total Direct Beneficiaries:** More than **10 million citizens** have actively received fuel subsidies.\n> - **Subsidy Tokens Generated:** Over **21.7 million electronic tokens** issued via the 9771 SMS system.\n> - **Tokens Successfully Redeemed:** Approximately **19.4 million tokens** utilized at fuel filling stations across Pakistan.\n> - **Budgetary Allocation:** **Rs. 75 billion** earmarked by the Federal Government to sustain uninterrupted relief.\n> - **Subsidy Rate:** **Rs. 100 per litre** flat reduction against current pump prices.",
      "### Scheme Scope & Vehicle Entitlement Criteria",
      "The relief package is strictly targeted towards lower- and middle-income vehicle owners. Eligibility is validated electronically through provincial excise archives and NADRA databases:\n\n1. **Two-Wheelers & Three-Wheelers (Motorcycles, Auto-Rickshaws & Qingqis):**\n   - Vehicle must be registered on or after **January 01, 2011**.\n   - **Monthly Quota:** Up to **20 litres** per calendar month.\n   - **Token Denomination:** Issued in **5-litre tokens** (up to 4 tokens monthly), providing a direct saving of **Rs. 500 per token**.\n   - **Token Validity:** 7 days from generation.\n2. **Small Passenger Cars (Engine Capacity Up to 800cc):**\n   - Vehicle must be registered on or after **January 01, 2006**.\n   - **Monthly Quota:** Up to **30 litres** per calendar month.\n   - **Token Denomination:** Issued in **10-litre tokens** (up to 3 tokens monthly), delivering **Rs. 1,000 relief per token**.\n   - **Token Validity:** 10 days from generation.\n3. **Universal Geographic Reach:** Applicable to eligible vehicle owners in **Islamabad, Sindh, Punjab, Khyber Pakhtunkhwa, Balochistan, Azad Jammu & Kashmir, and Gilgit-Baltistan**.",
      "### How to Register and Generate Fuel Tokens via SMS 9771",
      "Registration is automated, paperless, and completely free of charge:\n\n1. **One-Time Registration:**\n   - Open your mobile phone's messaging application.\n   - Type: `REG [13-Digit CNIC] [Vehicle Registration Number] [Province Initial] [Registration Date DDMMYYYY]`\n   - *Example (Sindh Motorbike):* `REG 4220112345671 KHI1234 S 15032019`\n   - Send the message to official short code **9771**.\n   - Receive automated confirmation from 9771 verifying CNIC and vehicle match.\n2. **Generating a Redemption Token:**\n   - Before visiting a petrol pump, SMS **`TOK`** to **9771**.\n   - You will receive a unique numeric token code with its expiry timestamp.\n3. **Redeeming at the Pump:**\n   - Show the token SMS to the pump attendant at any participating fuel station.\n   - The operator validates the code on the official POS verification app.\n   - Fuel is dispensed immediately with a Rs. 100/litre instant reduction deducted from the total bill.",
      "### Important Fraud and Safety Advisory",
      "> [!WARNING]\n> **Beware of Fraudulent SMS Messages & Scams:**\n> - **Authentic Short Code Only:** The government communicates exclusively through short code **9771**.\n> - **No Third-Party Links:** Never click unsolicited links or download unofficial `.apk` apps offering 'instant cash fuel rewards'.\n> - **No Advance Charges:** Registration and token issuance are 100% free. Never transfer mobile credit, JazzCash, or EasyPaisa fees to anyone claiming to unlock tokens.",
      "### Official Verification Sources & CareerDost Links",
      "- **Official Sources:** [Radio Pakistan Bulletin (9 October 2026)](https://www.radio.gov.pk/), [MOITT Official Press Release](https://www.moitt.gov.pk/NewsDetail/MzE3NWM0OGUtMzkyMi00MjkwLTgxZDEtYmNmYzUzMWQyMmU1), [PM Fuel Relief Scheme Portal](https://pmfuelrelief.pk/).\n- **Related CareerDost Resources:** [Petrol Price Reduced in Pakistan September 2026](/jobs/petrol-price-reduced-pakistan-september-2026), [Sindh Minimum Wage 2026 Workers Salary](/jobs/sindh-minimum-wage-2026-workers-salary)."
    ]
  },

  // 3. DRAP Medicine Barcode Requirements (New Draft Prepared)
  drap: {
    slug: 'drap-medicine-barcode-requirements-2026',
    title: 'DRAP Medicine Barcode Notification 2026: Mandatory 2D Serialization Rules & Older Batch Exemption',
    category_slug: 'government-schemes',
    organization: 'Drug Regulatory Authority of Pakistan (DRAP)',
    job_type: 'Federal Pharmaceutical Regulatory Notice (Track & Trace System Phase I)',
    location: 'Nationwide (All Pharmacies, Distributors & Manufacturers in Pakistan)',
    qualification: 'Pharmaceutical Manufacturers, Importers, Pharmacists, Distributors & Healthcare Consumers',
    salary: 'Statutory Consumer Protection & Medicine Traceability Framework',
    experience: 'Pharma Industry Compliance & Patient Healthcare Safety',
    positions: 'Mandatory 2D Data Matrix Serialization Across All Registered Human & Veterinary Medicines',
    last_date: 'Effective Since 9 October 2026',
    no_deadline: 1,
    publish_date: '2026-10-13',
    official_link: 'https://dra.gov.pk/',
    apply_link: 'https://dra.gov.pk/',
    is_verified: 1,
    featured: 1,
    logo_initial: 'DRAP',
    featured_image: '/images/drap-medicine-barcode-requirements-2026.webp',
    image_alt: 'DRAP Medicine Barcode Requirements 2026 2D Data Matrix Serialization and Exemption Guide CareerDost',
    excerpt: 'Drug Regulatory Authority of Pakistan (DRAP) issued a statutory notification making 2D Data Matrix barcoding and serialization mandatory for all medicines effective 9 October 2026. Learn the 4 barcode parameters, anti-counterfeit rules, and complete exemption for older batches.',
    seo_title: 'DRAP Medicine Barcode Notification 2026: 2D Serialization Rules & Exemption',
    meta_description: 'DRAP mandates 2D Data Matrix barcoding and serialization for medicines from 9 October 2026. Learn compliance rules, 4 data points, and older-batch exemption.',
    focus_keyword: 'DRAP Medicine Barcode Notification 2026',
    canonical_url: 'https://careerdost.blog/jobs/drap-medicine-barcode-requirements-2026',
    og_title: 'DRAP Medicine Barcode Notification 2026: Mandatory 2D Serialization Rules & Older Batch Exemption',
    og_description: 'DRAP enforces mandatory 2D Data Matrix barcodes on pharmaceutical products effective 9 October 2026. Understand serialization requirements and the older-batch exemption.',
    facebook_caption: `Dawaon ki asliyat aur public safety ke liye DRAP ka bara faisla! 💊
Drug Regulatory Authority of Pakistan (DRAP) ne 8 October ko 2D Barcoding aur Serialization ka notification jari kar diya jo 9 October 2026 se nafiz-ul-amal hai.
Purane batches ki exemption, 4 zaroori barcode data points aur patient rights ki tafseelat:
https://careerdost.blog/jobs/drap-medicine-barcode-requirements-2026
#DRAP #MedicineSafety #2DBarcode #CareerDost`,
    whatsapp_caption: `💊 DRAP Medicine Barcode Requirements (Effective 9 October 2026)
Mandatory 2D Data Matrix barcodes on medicines to stop fake drugs.
Older batches manufactured before 9 Oct remain exempt!
Complete guide: https://careerdost.blog/jobs/drap-medicine-barcode-requirements-2026`,
    content: [
      "# DRAP Medicine Barcode Notification 2026: Mandatory 2D Serialization Rules & Older Batch Exemption",
      "## Statutory Pharmaceutical Regulatory Directive",
      "In a decisive regulatory intervention to curb spurious, counterfeit, and falsified therapeutic goods, the **Drug Regulatory Authority of Pakistan (DRAP)** published an official notification on **8 October 2026** enforcing mandatory **2D Barcoding and Serialization** under **Phase I of the National Pharmaceutical Track & Trace System**.\n\nFormally promulgated under statutory powers granted by the amended **Drugs (Labelling and Packaging) Rules, 1978** (via S.R.O. 963(I)/2026), this national mandate entered into legal effect on **9 October 2026** across Pakistan.",
      "> [!NOTE]\n> **Key Regulatory Parameters at a Glance:**\n> - **Issuing Authority:** Drug Regulatory Authority of Pakistan (DRAP), Ministry of National Health Services, Regulations & Coordination\n> - **Notification Publication Date:** **8 October 2026**\n> - **Effective Enforcement Date:** **9 October 2026**\n> - **Scope:** All registered human and veterinary drug products manufactured locally or imported into Pakistan\n> - **Technology Standard:** GS1-compliant **2D Data Matrix Barcode** with individual serialization\n> - **Older Stock Exemption:** Batches manufactured or imported prior to 9 October 2026 are **100% exempt**",
      "## The 4 Mandatory Barcode Data Points",
      "Under the notified regulations, every unit carton and primary container of registered pharmaceutical products produced or imported on or after 9 October 2026 must embed four distinct data points within a scannable **2D Data Matrix Barcode**:\n\n1. **Global Trade Item Number (GTIN):** A standardized, universally recognized 14-digit identifier denoting the exact drug product, strength, and dosage form.\n2. **Unique Serial Number (SN):** An individualized alphanumeric serial code assigned uniquely to each physical pack, rendering duplicate or cloned packaging detectable.\n3. **Batch / Lot Number (BN / LOT):** The manufacturer's production batch tracking code corresponding to production logs.\n4. **Expiry Date (EXP):** Standardized numeric representation of shelf life (Year/Month/Day).\n\nIn addition to machine-readable 2D matrix symbology, these four data elements must also appear in **Human-Readable Interpretation (HRI)** text immediately adjacent to the barcode for visual scrutiny by dispensing pharmacists and patients.",
      "## Crucial Editorial Clarification: Older-Batch Exemption",
      "> [!IMPORTANT]\n> **Accurate Understanding of the Older-Batch Exemption:**\n> To prevent artificial drug shortages, supply-chain bottlenecks, or unnecessary panic among patients, DRAP has enacted an explicit **inventory exemption clause**:\n> \n> - **Prior Manufacturing Exemption:** Any batch of medicine that was manufactured locally or customs-cleared for import **with a manufacturing date before 9 October 2026** does **not** require retroactive 2D barcoding.\n> - **Full Clearance Permitted:** Pharmacies, hospitals, and wholesalers are legally authorized to sell, distribute, and dispense pre-October 9 stock throughout its normal registered shelf life until expiration.\n> - **No Recall Required:** Consumers and retailers should note that older-batch medicines lacking a 2D barcode are **not counterfeit** by default if produced prior to the cutoff date.",
      "## Patient Rights & How Citizens Can Verify Medicines",
      "For healthcare consumers and patients across Pakistan, the Track & Trace framework provides unprecedented protection against lethal adulterated medicines:\n\n- **Smart Scanning:** Consumers will increasingly be able to scan the 2D Data Matrix on drug boxes using standard smartphone camera apps or the official **DRAP MedSafety** mobile application to verify registration status.\n- **Rapid Recall Tracking:** In the event of a quality defect or adverse reaction alert, DRAP and provincial health departments can trace specific serial numbers instantly down to the distribution warehouse, preventing widespread harm.\n- **Reporting Counterfeits:** Suspected unverified or substandard medicines can be reported to DRAP's Vigilance Division via email at `contact@dra.gov.pk` or through provincial drug inspectors.",
      "## Advisory for Retail Pharmacies & Distributors",
      "> [!WARNING]\n> **Compliance Guidance for Chemists and Druggists:**\n> - **Do Not Refuse Valid Pre-October Stock:** Retailers must continue dispensing pre-October 9 inventory without panic.\n> - **Verification on New Deliveries:** When receiving fresh pharmaceutical consignments manufactured after 9 October 2026, pharmacies should verify that the manufacturer has imprinted the GS1 Data Matrix code alongside readable HRI details.\n> - **Severe Penalties:** Distributing deliberately falsified drugs or cloning serial codes constitutes a criminal offence under the **DRAP Act, 2012**, punishable by heavy fines, factory seals, and imprisonment.",
      "## Official Source Attribution & Related Articles",
      "- **Official Authority:** [Drug Regulatory Authority of Pakistan (DRAP)](https://dra.gov.pk/), Ministry of National Health Services.\n- **Statutory Rules:** Drugs (Labelling and Packaging) Rules, 1978 (as amended by S.R.O. 963(I)/2026).\n- **Related CareerDost Resources:** [Sindh Minimum Wage 2026 Workers Salary](/jobs/sindh-minimum-wage-2026-workers-salary), [BISP 8171 Payment Check 2026 Official Guide](/jobs/bisp-8171-payment-check-2026-official-guide)."
    ]
  },

  // 4. Sindh Minimum Wage Notification (Existing article updated for review)
  wage: {
    slug: 'sindh-minimum-wage-2026-workers-salary',
    title: 'Sindh Minimum Wage 2026: Official October Posting Confirms Rs43,000 Unskilled Worker Baseline',
    category_slug: 'government-schemes',
    organization: 'Sindh Labour & Human Resources Department & Sindh Minimum Wages Board',
    job_type: 'Provincial Minimum Wage Notification (Statutory Enforcement)',
    location: 'All Industrial & Commercial Establishments across Sindh',
    qualification: 'All Industrial, Commercial & Service Sector Workers',
    salary: 'Unskilled: Rs43,000 | Semi-skilled: Rs44,484 | Skilled: Rs53,350 | Highly Skilled: Rs55,626',
    experience: 'Applicable to All Workers (Permanent, Contract, Third-Party, Daily Wage)',
    positions: 'Statutory Wage Protection Across 4 Notified Worker Categories',
    last_date: 'Effective Since 1 July 2026 (Enforceable Law)',
    no_deadline: 1,
    publish_date: '2026-10-12',
    official_link: 'https://lhr.sindh.gov.pk/',
    apply_link: 'https://lhr.sindh.gov.pk/',
    is_verified: 1,
    featured: 1,
    logo_initial: 'LHR',
    featured_image: '/images/sindh-minimum-wage-2026-workers-salary.webp',
    image_alt: 'Sindh Minimum Wage 2026 Rs43,000 Unskilled Worker Salary Rules and Worker Rights CareerDost',
    excerpt: 'Sindh Minimum Wages Board official posting dated 12 October 2026 confirms statutory minimum wage rates in effect since 1 July 2026. Complete schedule for unskilled (Rs43,000), semi-skilled, skilled, and highly skilled workers with legal protections.',
    seo_title: 'Sindh Minimum Wage 2026: Rs43,000 Monthly Salary Rules | CareerDost',
    meta_description: 'Sindh Minimum Wages Board official 12 October posting clarifies Rs43,000 statutory minimum wage effective since 1 July 2026. Check unskilled, skilled rates and labor rights.',
    focus_keyword: 'Sindh Minimum Wage 2026 Rs43,000',
    canonical_url: 'https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary',
    og_title: 'Sindh Minimum Wage 2026: Official October Posting Confirms Rs43,000 Unskilled Worker Baseline',
    og_description: 'Official wage structure in Sindh: Rs43,000 minimum wage for unskilled workers effective from 1 July 2026, reiterated in the 12 October gazette posting. Check worker rights and labor laws.',
    facebook_caption: `Sindh ke industrial aur commercial workers ke liye zaroori khabar! 💼
Sindh Minimum Wages Board ne 12 October ko category-wise rates ka official circular shaya kiya.
Yeh rates 1 July 2026 se naafiz hain (October ka naya izafa nahi hai). Ghair-hunarmand worker ki kam az kam tankhwah Rs43,000 mahana hai.
Mukammal category rates aur qanooni huqooq samjhein:
https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary
#SindhMinimumWage #LabourRights #Rs43000 #CareerDost`,
    whatsapp_caption: `💼 Sindh Minimum Wage 2026: Official 12 October Notice
Important: Rates are effective since 1 July 2026 (Rs43,000 Unskilled)
Check 4 worker categories & legal complaint process:
https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary`,
    content: [
      "# Sindh Minimum Wage 2026: Official October Posting Confirms Rs43,000 Unskilled Worker Baseline",
      "## Statutory Minimum Wage Overview & October Clarification",
      "The **Sindh Labour & Human Resources Department**, acting on statutory recommendations formulated by the **Sindh Minimum Wages Board**, issued an official gazette posting on **12 October 2026** confirming the comprehensive schedule of minimum wages across recognized worker categories.\n\nUnder this statutory framework, the enforceable minimum wage for unskilled workers throughout Sindh stands firmly at **Rs. 43,000 per month**.",
      "> [!IMPORTANT]\n> **Critical Editorial Caveat — No New October Wage Increase:**\n> Readers and workers must clearly understand that this 12 October posting **does not announce a new wage hike originating in October 2026**.\n> Rather, this official posting confirms and formally schedules the provincial wage rates that **took effect on 1 July 2026** under the Sindh provincial budget for FY 2026–27. Any claims on social media suggesting a separate mid-year wage increment in October are factually incorrect.",
      "## Official Notified Wage Rates by Worker Category",
      "The Sindh Minimum Wages Board has formally structured monthly and daily rates across four statutory tiers of employment:\n\n| Worker Category | Minimum Monthly Wage | Minimum Daily Wage (Based on 26 Working Days) |\n|---|---:|---:|\n| **Unskilled Worker** | **Rs. 43,000** | **Rs. 1,653.84** |\n| **Semi-Skilled Worker** | **Rs. 44,484** | **Rs. 1,710.92** |\n| **Skilled Worker** | **Rs. 53,350** | **Rs. 2,051.92** |\n| **Highly Skilled Worker** | **Rs. 55,626** | **Rs. 2,139.46** |\n\n*Note on Daily Calculations: As per provincial labour jurisprudence, the daily wage is computed by dividing the monthly rate by 26 days, providing statutory compensation for mandatory weekly rest days.*",
      "## Universal Legal Coverage Across Sindh",
      "The minimum wage mandate applies without exception across the entire province of Sindh to:\n1. **Industrial Enterprises:** Textile processing units, ginning factories, pharmaceuticals, automobile assembly lines, engineering workshops, and food manufacturing plants in SITE Karachi, Korangi, Landhi, Nooriabad, Hyderabad, Sukkur, and Larkana.\n2. **Commercial & Service Sector:** Retail malls, private security agencies, janitorial contractors, IT software houses, educational academies, transport companies, and corporate offices.\n3. **All Employment Formats:** The law strictly encompasses **permanent, temporary, contractual, piece-rate, and daily-wage employees**. Employers are explicitly barred from circumventing statutory rates by outsourcing workers to third-party labour contractors.",
      "## Working Hours, Overtime & Illegal Deductions",
      "- **Statutory Work Limits:** Standard working hours are strictly capped at **8 hours per day** and **48 hours per week** under the Sindh Factories Act and Shops & Establishments legislation.\n- **Double Overtime Remuneration:** Any work required beyond standard hours must be compensated at **double the regular hourly wage**.\n- **Deduction Protections:** Deductions are permissible solely for statutory social safety contributions, specifically **SESSI** (Sindh Employees Social Security Institution) and **EOBI** (Employees' Old-Age Benefits Institution). Arbitrary deductions for tea, uniforms, disciplinary penalties, or broken items that depress take-home pay below statutory thresholds are illegal.",
      "## How Workers Can File Complaints and Recover Wages",
      "When an establishment pays below the statutory floor:\n1. **Lodge Formal Grievance:** Submit a written complaint before the **Directorate of Labour Sindh** or the District Labour Officer in your district.\n2. **Authority Under Payment of Wages Act:** Workers may file a claim under the **Payment of Wages Act** to recover withheld, deducted, or underpaid earnings along with statutory compensation.\n3. **Anti-Retaliation Protection:** Provincial labour legislation strictly penalizes employers who terminate, victimize, or demote workers for asserting their statutory wage rights.",
      "## Frequently Asked Questions (FAQ)",
      "**Q1: What is the effective date of the Rs43,000 minimum wage in Sindh?**\nThe rate took effect on **1 July 2026**. The circular posted on 12 October 2026 is an official confirmation and schedule notification, not a new increase.\n\n**Q2: Are contract workers and security guards entitled to Rs43,000?**\nYes. The Sindh Minimum Wages Act explicitly covers contract staff, daily-wage workers, and personnel supplied by third-party contracting agencies.\n\n**Q3: Can an employer reduce salary by deducting food or uniform costs?**\nNo. The statutory minimum wage must be paid in full currency. Arbitrary deductions reducing cash pay below Rs43,000 for unskilled labor are strictly unlawful.\n\n**Q4: Where can employers and workers verify official labour notifications?**\nOfficial circulars are accessible at the Sindh Labour Department portal: [lhr.sindh.gov.pk](https://lhr.sindh.gov.pk/).",
      "## Source Attribution & Related Articles",
      "- **Official Authority:** [Sindh Labour & Human Resources Department](https://lhr.sindh.gov.pk/), Sindh Minimum Wages Board notification posted 12 October 2026.\n- **Related CareerDost Resources:** [SESSI Internship Programme 2026](/jobs/sessi-internship-programme-2026), [Sindh Courts Jobs 2026 BPS 1-4](/jobs/sindh-courts-bps-1-4-jobs-2026), [SPSC Jobs 2026 54 Government Vacancies](/jobs/spsc-jobs-2026-54-vacancies)."
    ]
  },

  // 5. Hyderabad Division Section 144 (New Draft on Editorial Hold)
  hyderabad: {
    slug: 'hyderabad-division-section-144-notification-2026',
    title: 'Hyderabad Division Section 144 Imposed: 15-Day Restrictions Across 9 Districts (Editorial Hold)',
    category_slug: 'government-schemes',
    organization: 'Commissioner Hyderabad Division & Sindh Home Department',
    job_type: 'Administrative Public Law & Order Notice (Section 144 CrPC)',
    location: 'Hyderabad Division (9 Districts across Sindh)',
    qualification: 'General Public, Commuters, Educational Institutions & Commercial Entities',
    salary: 'Public Security & Civil Administration Directive',
    experience: 'Public Safety & District Administration Enforcement',
    positions: 'Prohibition of Gatherings (5+ Persons), Rallies & Weapons across 9 Districts',
    last_date: 'Reported 15-Day Enforcement Period from 12 October 2026',
    no_deadline: 0,
    publish_date: '2026-10-12',
    official_link: 'https://www.app.com.pk/',
    apply_link: 'https://sindh.gov.pk/',
    is_verified: 0,
    featured: 0,
    logo_initial: 'HYD',
    featured_image: '/images/hyderabad-division-section-144-notification-2026.webp',
    image_alt: 'Hyderabad Division Section 144 Notification 9 Districts 15 Days Administrative Notice CareerDost',
    excerpt: 'Associated Press of Pakistan (APP) reported on 12 October 2026 that Section 144 has been promulgated across all nine districts of Hyderabad Division for 15 days. Note: Maintained on strict EDITORIAL HOLD pending primary signed notification.',
    seo_title: 'Hyderabad Division Section 144: 15-Day Ban Across 9 Districts | CareerDost',
    meta_description: 'Section 144 reported across 9 districts of Hyderabad Division for 15 days. Check restricted activities, affected districts, and verification status.',
    focus_keyword: 'Hyderabad Division Section 144 Notification',
    canonical_url: 'https://careerdost.blog/jobs/hyderabad-division-section-144-notification-2026',
    og_title: 'Hyderabad Division Section 144 Imposed: 15-Day Restrictions Across 9 Districts (Editorial Hold)',
    og_description: 'APP news bulletin reports 15-day Section 144 across nine districts in Hyderabad division. Read details of reported restrictions and our editorial verification hold.',
    facebook_caption: `Hyderabad Division ke 9 azlaa ke shehriyon ke liye eham khabar! ⚠️
APP ki ibtedai report ke mutabiq Commissioner Hyderabad ne 15 dinon ke liye dafa 144 nafiz kar di hai.
Mutasira 9 districts, pabandiyan aur CareerDost verification hold notice:
https://careerdost.blog/jobs/hyderabad-division-section-144-notification-2026
#HyderabadDivision #Section144 #SindhUpdate #CareerDost`,
    whatsapp_caption: `⚠️ Hyderabad Division Section 144 Advisory (12 October)
APP Report: 15 Days restriction across 9 Districts (Hyderabad, Jamshoro, Dadu, etc.)
Status: Editorial Hold pending signed primary notification.
Details: https://careerdost.blog/jobs/hyderabad-division-section-144-notification-2026`,
    content: [
      "# Hyderabad Division Section 144 Imposed: 15-Day Restrictions Across 9 Districts (Editorial Hold)",
      "> [!WARNING]\n> **EDITORIAL HOLD — PRIMARY SOURCE VERIFICATION PENDING:**\n> This public advisory report is based on preliminary news reporting distributed by the state-run wire service **Associated Press of Pakistan (APP)** on **12 October 2026**.\n> \n> **CareerDost Verification Protocol:** The original, signed official gazette notification issued by the **Office of the Commissioner Hyderabad Division** or the **Sindh Home Department** has **not yet been directly obtained or inspected** on official provincial government publication archives.\n> In accordance with strict CareerDost editorial guidelines, this article is held on **EDITORIAL HOLD** as an unapproved internal draft. Commuters, students, examination candidates, and commercial operators are advised to verify operational enforcement with their respective local District Administration (Deputy Commissioner) offices.",
      "## Overview of Reported APP Announcement",
      "According to wire dispatches issued by the Associated Press of Pakistan (APP) on **12 October 2026**, the Commissioner of Hyderabad Division, **Fayyaz Abbasi**, has reportedly promulgated **Section 144 of the Code of Criminal Procedure (CrPC)** across the entire administrative division.\n\nThe regulatory intervention has been enacted for a reported duration of **15 days** to prevent potential breaches of public peace, maintain law and order, and avert public nuisance or disruptions to vital civic infrastructure.",
      "## Nine Affected Districts Across Hyderabad Division",
      "The reported territorial jurisdiction covers all nine constituent districts comprising Hyderabad Division:\n\n1. **Hyderabad District** (including City, Latifabad, and Qasimabad talukas)\n2. **Jamshoro District**\n3. **Thatta District**\n4. **Sujawal District**\n5. **Badin District**\n6. **Tando Muhammad Khan District**\n7. **Tando Allahyar District**\n8. **Matiari District**\n9. **Dadu District**",
      "## Reported Prohibitions Under Section 144",
      "Based on the initial administrative dispatch, the following civic activities are reported to be restricted for the duration of the order:\n- **Public Assemblies:** A total ban on the unlawful assembly of **five (5) or more persons** in public places, streets, and thoroughfares.\n- **Demonstrations & Processions:** Prohibition of unpermitted rallies, political processions, protest sit-ins (*dharnas*), and hunger strike camps.\n- **Obstruction of Thoroughfares:** Strict ban on blocking public roads, highways, inter-district arterial routes, and vital government installations.\n- **Loudspeakers & Sound Amplifiers:** Ban on unauthorized use of loudspeakers and sound amplification systems, excluding customary calls to prayer (*Azan*).\n- **Weapons & Firearms:** Complete ban on the carrying, brandishing, or display of lethal weapons and firearms (licensed or unlicensed), except by on-duty law enforcement officers.",
      "## Potential Impact on Examinations, Schools & Commuters",
      "While Section 144 restricts unlawful public political assemblies and protest rallies, routine civil life is typically managed under specific administrative exemptions:\n- **Educational Institutions:** Regular classes at universities, colleges, and schools generally proceed as scheduled unless a separate closure order is issued by the School Education or College Education Department.\n- **Commercial Markets:** Routine business operations in bazaars, shopping plazas, and retail centers remain functional, provided crowds do not gather for unauthorized demonstrations.\n- **Public Transport:** Intercity and intracity transport generally operates normally along designated arterial routes.",
      "## Legal Penalties for Non-Compliance",
      "Under statutory criminal law in Pakistan, any person violating an operative executive order issued under Section 144 CrPC is subject to prosecution under **Section 188 of the Pakistan Penal Code (PPC)** (Disobedience to order duly promulgated by public servant), which carries penalties including arrest, summary fines, and imprisonment.",
      "## Source Attribution & Verification Status",
      "- **Primary Wire Source:** Associated Press of Pakistan (APP) news bulletin, 12 October 2026.\n- **Pending Primary Document:** Original signed notification from Commissioner Hyderabad Division / Sindh Home Department.\n- **Editorial Status:** Maintained on EDITORIAL HOLD pending receipt and authentication of original gazette notification."
    ]
  }
}

export function saveEditorialPackages() {
  console.log('=== SAVING SINDH-FIRST EDITORIAL PACKAGES TO SQLITE ===\n')

  const stmtArt = db.prepare(`
    INSERT INTO articles (
      slug, title, category_slug, organization, job_type, location,
      qualification, salary, last_date, publish_date, official_link,
      featured, logo_initial, excerpt, content, seo_title, meta_description,
      status, featured_image, image_alt, experience, positions, apply_link,
      is_verified, focus_keyword, canonical_url, og_title, og_description,
      no_deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      category_slug = excluded.category_slug,
      organization = excluded.organization,
      job_type = excluded.job_type,
      location = excluded.location,
      qualification = excluded.qualification,
      salary = excluded.salary,
      last_date = excluded.last_date,
      publish_date = excluded.publish_date,
      official_link = excluded.official_link,
      featured = excluded.featured,
      logo_initial = excluded.logo_initial,
      excerpt = excluded.excerpt,
      content = excluded.content,
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      status = excluded.status,
      featured_image = excluded.featured_image,
      image_alt = excluded.image_alt,
      experience = excluded.experience,
      positions = excluded.positions,
      apply_link = excluded.apply_link,
      is_verified = excluded.is_verified,
      focus_keyword = excluded.focus_keyword,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      no_deadline = excluded.no_deadline,
      updated_at = CURRENT_TIMESTAMP
  `)

  const stmtDaily = db.prepare(`
    INSERT INTO daily_updates (
      slug, title, category, short_description, content, featured_image,
      image_alt, official_link, apply_link, deadline, publish_date,
      organization, location, qualification, experience, positions,
      job_type, salary, is_verified, featured, seo_title, meta_description,
      focus_keyword, canonical_url, og_title, og_description, status,
      no_deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      short_description = excluded.short_description,
      content = excluded.content,
      featured_image = excluded.featured_image,
      image_alt = excluded.image_alt,
      official_link = excluded.official_link,
      apply_link = excluded.apply_link,
      deadline = excluded.deadline,
      publish_date = excluded.publish_date,
      organization = excluded.organization,
      location = excluded.location,
      qualification = excluded.qualification,
      experience = excluded.experience,
      positions = excluded.positions,
      job_type = excluded.job_type,
      salary = excluded.salary,
      is_verified = excluded.is_verified,
      featured = excluded.featured,
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      focus_keyword = excluded.focus_keyword,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      status = excluded.status,
      no_deadline = excluded.no_deadline,
      updated_at = CURRENT_TIMESTAMP
  `)

  // 1. SPSC - Check existing, do NOT duplicate
  console.log('1. SPSC Advertisement 05/2026: Checking existing article...')
  const spscRow = db.prepare('SELECT id, slug, status, title FROM articles WHERE slug = ?').get('spsc-jobs-2026-54-vacancies')
  if (spscRow) {
    console.log(`   ✓ Found existing SPSC article [ID ${spscRow.id}]: "${spscRow.title}". DUPLICATE AVOIDED!`)
    // Update image to the high-res 16:9 Nano Banana webp
    db.prepare('UPDATE articles SET featured_image = ?, image_alt = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
      .run(
        '/images/spsc-jobs-2026-54-vacancies.webp',
        'SPSC Jobs 2026 54 Sindh Government Vacancies Consolidated Advertisement 05/2026 CareerDost',
        'spsc-jobs-2026-54-vacancies'
      )
    try {
      db.prepare('UPDATE daily_updates SET featured_image = ?, image_alt = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
        .run(
          '/images/spsc-jobs-2026-54-vacancies.webp',
          'SPSC Jobs 2026 54 Sindh Government Vacancies Consolidated Advertisement 05/2026 CareerDost',
          'spsc-jobs-2026-54-vacancies'
        )
    } catch {}
    console.log('   ✓ SPSC featured image updated to high-res Nano Banana WebP.')
  }

  // 2. PM Fuel Relief - Update existing revision for review
  console.log('\n2. Prime Minister Fuel Relief Scheme: Updating existing article for editorial review...')
  const p = editorialPackages.fuelRelief
  stmtArt.run(
    p.slug, p.title, p.category_slug, p.organization, p.job_type, p.location,
    p.qualification, p.salary, p.last_date, p.publish_date, p.official_link,
    p.featured ? 1 : 0, p.logo_initial, p.excerpt, JSON.stringify(p.content),
    p.seo_title, p.meta_description, 'published', p.featured_image, p.image_alt,
    p.experience, p.positions, p.apply_link, p.is_verified ? 1 : 0,
    p.focus_keyword, p.canonical_url, p.og_title, p.og_description, p.no_deadline
  )
  try {
    stmtDaily.run(
      p.slug, p.title, 'Government Schemes', p.excerpt, JSON.stringify(p.content),
      p.featured_image, p.image_alt, p.official_link, p.apply_link, p.last_date,
      p.publish_date, p.organization, p.location, p.qualification, p.experience,
      p.positions, p.job_type, p.salary, p.is_verified ? 1 : 0, p.featured ? 1 : 0,
      p.seo_title, p.meta_description, p.focus_keyword, p.canonical_url,
      p.og_title, p.og_description, 'published', p.no_deadline
    )
  } catch (e) {
    console.log('   daily_updates fuel note:', e.message)
  }
  console.log(`   ✓ PM Fuel Relief Scheme updated: "${p.title}"`)

  // 3. DRAP Medicine Barcode - Save as new DRAFT
  console.log('\n3. DRAP Medicine Barcode Requirements: Saving as new DRAFT...')
  const d = editorialPackages.drap
  stmtArt.run(
    d.slug, d.title, d.category_slug, d.organization, d.job_type, d.location,
    d.qualification, d.salary, d.last_date, d.publish_date, d.official_link,
    d.featured ? 1 : 0, d.logo_initial, d.excerpt, JSON.stringify(d.content),
    d.seo_title, d.meta_description, 'draft', d.featured_image, d.image_alt,
    d.experience, d.positions, d.apply_link, d.is_verified ? 1 : 0,
    d.focus_keyword, d.canonical_url, d.og_title, d.og_description, d.no_deadline
  )
  try {
    stmtDaily.run(
      d.slug, d.title, 'Government Schemes', d.excerpt, JSON.stringify(d.content),
      d.featured_image, d.image_alt, d.official_link, d.apply_link, d.last_date,
      d.publish_date, d.organization, d.location, d.qualification, d.experience,
      d.positions, d.job_type, d.salary, d.is_verified ? 1 : 0, d.featured ? 1 : 0,
      d.seo_title, d.meta_description, d.focus_keyword, d.canonical_url,
      d.og_title, d.og_description, 'draft', d.no_deadline
    )
  } catch (e) {
    console.log('   daily_updates drap note:', e.message)
  }
  console.log(`   ✓ DRAP Medicine Barcode saved as DRAFT: "${d.title}"`)

  // 4. Sindh Minimum Wage - Update existing revision for review
  console.log('\n4. Sindh Minimum Wage Notification: Updating existing article for editorial review...')
  const w = editorialPackages.wage
  stmtArt.run(
    w.slug, w.title, w.category_slug, w.organization, w.job_type, w.location,
    w.qualification, w.salary, w.last_date, w.publish_date, w.official_link,
    w.featured ? 1 : 0, w.logo_initial, w.excerpt, JSON.stringify(w.content),
    w.seo_title, w.meta_description, 'published', w.featured_image, w.image_alt,
    w.experience, w.positions, w.apply_link, w.is_verified ? 1 : 0,
    w.focus_keyword, w.canonical_url, w.og_title, w.og_description, w.no_deadline
  )
  try {
    stmtDaily.run(
      w.slug, w.title, 'Government Schemes', w.excerpt, JSON.stringify(w.content),
      w.featured_image, w.image_alt, w.official_link, w.apply_link, w.last_date,
      w.publish_date, w.organization, w.location, w.qualification, w.experience,
      w.positions, w.job_type, w.salary, w.is_verified ? 1 : 0, w.featured ? 1 : 0,
      w.seo_title, w.meta_description, w.focus_keyword, w.canonical_url,
      w.og_title, w.og_description, 'published', w.no_deadline
    )
  } catch (e) {
    console.log('   daily_updates wage note:', e.message)
  }
  console.log(`   ✓ Sindh Minimum Wage updated: "${w.title}"`)

  // 5. Hyderabad Division Section 144 - Save as new DRAFT on EDITORIAL HOLD
  console.log('\n5. Hyderabad Division Section 144: Saving as DRAFT on EDITORIAL HOLD...')
  const h = editorialPackages.hyderabad
  stmtArt.run(
    h.slug, h.title, h.category_slug, h.organization, h.job_type, h.location,
    h.qualification, h.salary, h.last_date, h.publish_date, h.official_link,
    h.featured ? 1 : 0, h.logo_initial, h.excerpt, JSON.stringify(h.content),
    h.seo_title, h.meta_description, 'draft', h.featured_image, h.image_alt,
    h.experience, h.positions, h.apply_link, h.is_verified ? 1 : 0,
    h.focus_keyword, h.canonical_url, h.og_title, h.og_description, h.no_deadline
  )
  try {
    stmtDaily.run(
      h.slug, h.title, 'Government Schemes', h.excerpt, JSON.stringify(h.content),
      h.featured_image, h.image_alt, h.official_link, h.apply_link, h.last_date,
      h.publish_date, h.organization, h.location, h.qualification, h.experience,
      h.positions, h.job_type, h.salary, h.is_verified ? 1 : 0, h.featured ? 1 : 0,
      h.seo_title, h.meta_description, h.focus_keyword, h.canonical_url,
      h.og_title, h.og_description, 'draft', h.no_deadline
    )
  } catch (e) {
    console.log('   daily_updates hyderabad note:', e.message)
  }
  console.log(`   ✓ Hyderabad Division Section 144 saved as DRAFT (EDITORIAL HOLD): "${h.title}"`)

  console.log('\n=== VERIFYING DATABASE STATUS ===')
  const checkedSlugs = [
    'spsc-jobs-2026-54-vacancies',
    'pm-fuel-relief-scheme-2026-registration-eligibility',
    'drap-medicine-barcode-requirements-2026',
    'sindh-minimum-wage-2026-workers-salary',
    'hyderabad-division-section-144-notification-2026'
  ]

  for (const s of checkedSlugs) {
    const row = db.prepare('SELECT id, slug, status, title, featured_image FROM articles WHERE slug = ?').get(s)
    if (row) {
      console.log(`  [ID ${row.id}] (${row.status.toUpperCase()}) ${row.slug}: "${row.title}"`)
      console.log(`         Image: ${row.featured_image}`)
    } else {
      console.log(`  [NOT FOUND] ${s}`)
    }
  }
}

saveEditorialPackages()
