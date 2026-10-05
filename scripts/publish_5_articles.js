import fs from 'fs'
import path from 'path'
import { newArticles } from 'file:///C:/Users/Faizan%20Ali/.gemini/antigravity/brain/7d3c64eb-a002-4480-bc63-a582e7531ef4/scratch/new_articles.js'

const listingsFilePath = path.resolve('src/data/listings.js')
const listingsFileContent = fs.readFileSync(listingsFilePath, 'utf8')

// Parse existing listings by importing or regex
// Let's dynamically import src/data/listings.js
const { listings: currentListings } = await import('../src/data/listings.js')

const slugsToRemove = new Set([
  'sessi-internship-programme-2026',
  'sessi-internship-programme-2026-karachi',
  'uet-reciprocal-admissions-2026',
  'virtual-university-fall-2026-admissions',
  'virtual-university-admissions-2026-deadline-tomorrow',
  'punjab-cbd-youth-career-program-2026-internship',
  'swiss-government-excellence-scholarships-2027-pakistan'
])

const filteredExisting = currentListings.filter(item => !slugsToRemove.has(item.slug))

// Combine: newArticles first, then existing
const updatedListings = [...newArticles, ...filteredExisting]

const outputContent = `// CareerDost Opportunities & Career Listings Dataset
// Updated: 2026-10-05

export const listings = ${JSON.stringify(updatedListings, null, 2)};

export const getListingBySlug = (slug) => {
  if (slug === 'virtual-university-admissions-2026-deadline-tomorrow') {
    return listings.find((l) => l.slug === 'virtual-university-fall-2026-admissions') || listings.find((l) => l.slug === slug)
  }
  if (slug === 'sessi-internship-programme-2026-karachi') {
    return listings.find((l) => l.slug === 'sessi-internship-programme-2026') || listings.find((l) => l.slug === slug)
  }
  return listings.find((l) => l.slug === slug)
}

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
`

fs.writeFileSync(listingsFilePath, outputContent, 'utf8')
console.log(`Successfully updated src/data/listings.js with ${updatedListings.length} listings!`)
