import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listingsFilePath = path.join(__dirname, '../src/data/listings.js');

const imageUpdates = {
  'commonwealth-scholarships-2027-28-pakistan-hec-csc-uk': '/images/commonwealth-scholarship-2027-28.jpg',
  'ntisb-cyber-security-jobs-2026-national-job-portal': '/images/ntisb-cyber-security-jobs-2026.jpg',
  'phsa-kp-bs-nursing-admissions-2026': '/images/phsa-kp-bs-nursing-admissions-2026.jpg',
  'shaikh-ayaz-university-spring-2027-admissions-apply-online': '/images/shaikh-ayaz-university-admissions-2027.jpg'
};

import(`file://${listingsFilePath}`).then(({ listings }) => {
  listings.forEach(item => {
    if (imageUpdates[item.slug]) {
      item.featuredImage = imageUpdates[item.slug];
      console.log(`Updated image for ${item.slug} -> ${item.featuredImage}`);
    }
  });

  const helperFunctions = `

export const getListingBySlug = (slug) => listings.find((l) => l.slug === slug)

export const getListingsByCategory = (categorySlug) =>
  listings
    .filter((l) => l.category === categorySlug)
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))

export const getFeaturedListings = () =>
  listings.filter((l) => l.featured).sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))

export const getLatestListings = (limit = 12) =>
  [...listings]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, limit)

export const searchListings = (query) => {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return listings.filter((l) =>
    [l.title, l.organization, l.location, l.category]
      .join(' ')
      .toLowerCase()
      .includes(q)
  )
}
`;

  const newFileContent = `// Sample content only — no backend yet. Shape mirrors the fields the admin
// panel will eventually write: title, slug, category, organization, jobType,
// location, qualification, salary, lastDate, officialLink, content, seo.
export const listings = ${JSON.stringify(listings, null, 2)};
${helperFunctions}`;

  fs.writeFileSync(listingsFilePath, newFileContent, 'utf8');
  console.log('Successfully updated listings.js with uploaded JPG image paths!');
}).catch(err => {
  console.error('Error updating listings.js:', err);
  process.exit(1);
});
