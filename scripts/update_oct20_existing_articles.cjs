const fs = require('fs');

const file = 'src/data/listings.js';
let content = fs.readFileSync(file, 'utf8');

// Parse the listings array
const startIndex = content.indexOf('[');
const endIndex = content.lastIndexOf(']');
const prefix = content.slice(0, startIndex);
const suffix = content.slice(endIndex + 1);
const listings = eval(content.slice(startIndex, endIndex + 1));

console.log('Total listings parsed:', listings.length);

// 1. SPSC Article ID 335
const spsc = listings.find(l => l.slug === 'spsc-jobs-2026-54-vacancies');
if (spsc) {
  console.log('Found SPSC article:', spsc.id, spsc.slug);
  spsc.featuredImage = '/images/spsc-jobs-2026-54-vacancies.webp';
  spsc.imageAlt = 'SPSC Jobs 2026 Advertisement No 05/2026 Apply by 23 October CareerDost';
  spsc.ogTitle = 'SPSC Jobs 2026: Advertisement No. 05/2026 – Apply Before 23 October | CareerDost';
  spsc.ogDescription = 'Sindh Public Service Commission (SPSC) Consolidated Advertisement No. 05/2026 with 54 gazetted vacancies in BPS-16 to BPS-18. Online applications close 23 October 2026 at 5:00 PM via 1Bill PSID.';
  spsc.lastDate = '2026-10-23';

  // Ensure content has final 72-hour alert at the top
  const alertText = '> [!IMPORTANT]\n> **Final Application Alert: SPSC Advertisement No. 05/2026 Closing 23 October**\n> Online registration on the official SPSC portal (`spsc.gov.pk`) closes on **Friday, 23 October 2026 at 5:00 PM**. Candidates must generate their Rs. 500 1Bill Payment Slip ID (PSID) challan and complete their online application before the cutoff time. No manual or paper submissions are accepted.';
  if (Array.isArray(spsc.content)) {
    if (!spsc.content[0].includes('Final Application Alert')) {
      spsc.content.unshift(alertText);
    }
  } else if (typeof spsc.content === 'string') {
    if (!spsc.content.includes('Final Application Alert')) {
      spsc.content = alertText + '\n\n' + spsc.content;
    }
  }
}

// 2. RSU Article ID 500
const rsu = listings.find(l => l.slug === 'sindh-education-rsu-consultant-jobs-2026');
if (rsu) {
  console.log('Found RSU article:', rsu.id, rsu.slug);
  rsu.featuredImage = '/images/rsu-sindh-social-safeguard-specialist-2026.webp';
  rsu.imageAlt = 'Sindh Education Jobs 2026 Social Safeguard Specialist RSU PECHS Karachi CareerDost';
  rsu.ogTitle = 'Sindh Education RSU Consultant Jobs 2026: Social Safeguard & Foundational Learning | CareerDost';
  rsu.ogDescription = 'Reform Support Unit (RSU) Sindh ASPIRE-AF World Bank Project jobs 2026 for Social Safeguard Specialist and Foundational Learning Specialist. Apply before 25 October 2026.';
  rsu.lastDate = '2026-10-25';

  // Embed the second image (Foundational Learning Specialist) into the content
  const flnImageMarkdown = '![RSU Sindh Foundational Learning Specialist Jobs 2026 CareerDost](/images/rsu-sindh-foundational-learning-specialist-2026.webp)';
  if (Array.isArray(rsu.content)) {
    const flnIdx = rsu.content.findIndex(c => typeof c === 'string' && (c.includes('Foundational Learning Specialist') || c.includes('Position 2') || c.includes('Role 2')));
    if (flnIdx !== -1 && !rsu.content.some(c => typeof c === 'string' && c.includes('rsu-sindh-foundational-learning-specialist-2026.webp'))) {
      rsu.content.splice(flnIdx, 0, flnImageMarkdown);
      console.log('Inserted Foundational Learning image before section index:', flnIdx);
    }
  }
}

// 3. Sindh Courts Article ID 333
const courts = listings.find(l => l.slug === 'sindh-courts-bps-1-4-jobs-2026');
if (courts) {
  console.log('Found Courts article:', courts.id, courts.slug);
  courts.featuredImage = '/images/sindh-courts-bps-1-4-jobs-2026.webp';
  courts.imageAlt = 'Sindh District Courts Jobs 2026 BPS-01 to BPS-04 Walk-in Interviews High Court Karachi CareerDost';
  courts.ogTitle = 'Sindh District Courts Jobs 2026: BPS-01 to BPS-04 Walk-in Interview Schedule | CareerDost';
  courts.ogDescription = 'Criminal Prosecution Services Department Sindh Circular 000000221 for 232 Head Office posts at High Court Karachi and 28 District Courts. Walk-in interviews 19–31 October 2026.';
  courts.lastDate = '2026-10-31';
}

// Serialize listings back to JS
const updatedJs = prefix + JSON.stringify(listings, null, 2) + suffix;
fs.writeFileSync(file, updatedJs, 'utf8');
console.log('Successfully updated src/data/listings.js with all verified details and images!');
