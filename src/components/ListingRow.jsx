import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import { deadlineLabel, formatDate } from '../lib/format'
import { categoryBySlug, toneClasses } from '../data/categories'

export default function ListingRow({ listing }) {
  const cat = categoryBySlug(listing.category) || { tone: 'slate', label: listing.category }
  const tone = toneClasses[cat.tone] || toneClasses.slate
  const dl = deadlineLabel(listing.lastDate)

  return (
    <Link
      to={`/jobs/${listing.slug}`}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-line last:border-b-0 hover:bg-paper/50 transition-colors px-2 -mx-2"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div
          className={`shrink-0 w-10 h-10 flex items-center justify-center border font-sans text-xs font-bold rounded-xs ${tone.tag}`}
          aria-hidden="true"
        >
          {listing.logoInitial || 'CD'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <CategoryTag slug={listing.category} linked={false} />
            {listing.publishDate && (
              <span className="text-xs font-sans text-inksoft/80">
                Posted {formatDate(listing.publishDate)}
              </span>
            )}
            {dl.urgent && !dl.closed && (
              <span className="text-xs font-sans font-medium text-brick bg-brick-light px-1.5 py-0.5 border border-brick/20">
                {dl.text}
              </span>
            )}
            {dl.closed && (
              <span className="text-xs font-sans text-inksoft bg-paper px-1.5 py-0.5 border border-line">
                Closed
              </span>
            )}
          </div>

          <h3 className="font-serif text-base sm:text-lg leading-snug text-ink group-hover:text-green transition-colors font-medium">
            {listing.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-inksoft font-sans mt-1">
            <span className="font-medium text-ink/80">{listing.organization}</span>
            {listing.location && <span>• 📍 {listing.location}</span>}
            {listing.qualification && <span className="hidden md:inline">• 🎓 {listing.qualification}</span>}
          </div>
        </div>
      </div>

      <div className="shrink-0 text-left sm:text-right font-sans text-xs border-t sm:border-t-0 border-line pt-2 sm:pt-0">
        <div className="text-inksoft">Apply Before</div>
        <div className={`font-semibold ${dl.closed ? 'text-inksoft' : dl.urgent ? 'text-brick' : 'text-ink'}`}>
          {formatDate(listing.lastDate)}
        </div>
      </div>
    </Link>
  )
}
