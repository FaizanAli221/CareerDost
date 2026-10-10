import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import CategoryFallbackImage from './CategoryFallbackImage'
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
  const hasImage = Boolean(listing.featuredImage && listing.featuredImage.trim().length > 0)

  return (
    <Link
      to={`/jobs/${listing.slug}`}
      className={`group flex flex-col border border-line bg-white border-l-4 overflow-hidden rounded-xs hover:shadow-md hover:border-green transition-all ${borderTone[toneKey] || 'border-l-slate'}`}
    >
      {hasImage && (
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          <img
            src={listing.featuredImage}
            alt={listing.imageAlt || listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
            <span className="bg-gold text-slate-950 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              ⭐ Featured
            </span>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            {listing.category && <CategoryTag slug={listing.category} linked={false} />}
            {listing.location && (
              <span className="text-xs font-sans text-inksoft flex items-center gap-1">
                📍 {listing.location}
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg sm:text-xl leading-snug text-ink group-hover:text-green transition-colors mb-2 line-clamp-2">
            {listing.title || 'Featured Opportunity'}
          </h3>

          <p className="text-xs sm:text-sm text-inksoft font-sans line-clamp-2 mb-4 leading-relaxed">
            {listing.excerpt || (Array.isArray(listing.content) ? listing.content[0] : listing.content) || ''}
          </p>
        </div>

        <div className="pt-3 border-t border-line space-y-1.5 font-sans text-xs mt-auto">
          <div className="flex items-center justify-between text-inksoft">
            <span className="font-semibold text-green truncate max-w-[60%]">{listing.organization}</span>
            {listing.publishDate && <span>Posted: {formatDate(listing.publishDate)}</span>}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-inksoft">Deadline</span>
            <span className={`font-medium ${dl.closed ? 'text-inksoft' : dl.urgent ? 'text-brick font-bold' : 'text-green'}`}>
              {dl.closed ? `Closed on ${formatDate(listing.lastDate)}` : `${formatDate(listing.lastDate)} (${dl.text})`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
