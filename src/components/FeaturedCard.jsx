import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import { deadlineLabel, formatDate } from '../lib/format'
import { categoryBySlug, toneClasses } from '../data/categories'

const borderTone = {
  green: 'border-l-green',
  gold: 'border-l-gold',
  brick: 'border-l-brick',
  slate: 'border-l-slate',
}

export default function FeaturedCard({ listing }) {
  if (!listing || !listing.slug) return null

  const cat = categoryBySlug(listing.category) || { tone: 'slate', label: listing.category || 'General' }
  const toneKey = cat && cat.tone && toneClasses[cat.tone] ? cat.tone : 'slate'
  const dl = deadlineLabel(listing.lastDate)

  return (
    <Link
      to={`/jobs/${listing.slug}`}
      className={`group block border border-line bg-white border-l-4 p-5 h-full hover:shadow-sm transition-all ${borderTone[toneKey] || 'border-l-slate'}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        {listing.category && <CategoryTag slug={listing.category} linked={false} />}
        {listing.location && (
          <span className="text-xs font-sans text-inksoft flex items-center gap-1">
            📍 {listing.location}
          </span>
        )}
      </div>

      <h3 className="font-serif text-xl leading-snug text-ink group-hover:text-green transition-colors mb-2">
        {listing.title || 'Featured Opportunity'}
      </h3>

      <p className="text-sm text-inksoft font-sans line-clamp-2 mb-4 leading-relaxed">
        {listing.excerpt || (Array.isArray(listing.content) ? listing.content[0] : listing.content) || ''}
      </p>

      <div className="pt-3 border-t border-line space-y-1.5 font-sans text-xs">
        <div className="flex items-center justify-between text-inksoft">
          <span className="font-medium text-ink">{listing.organization}</span>
          {listing.publishDate && <span>Posted: {formatDate(listing.publishDate)}</span>}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-inksoft">Deadline</span>
          <span className={`font-medium ${dl.closed ? 'text-inksoft' : dl.urgent ? 'text-brick' : 'text-green'}`}>
            {dl.closed ? `Closed on ${formatDate(listing.lastDate)}` : `${formatDate(listing.lastDate)} (${dl.text})`}
          </span>
        </div>
      </div>
    </Link>
  )
}
