import React from 'react'
import { Link } from 'react-router-dom'
import CategoryFallbackImage from './CategoryFallbackImage'
import { getOpportunityStatus } from '../lib/format'

function isRecent(publishDate, hours = 48) {
  if (!publishDate) return false
  const diff = Date.now() - new Date(publishDate).getTime()
  return diff >= 0 && diff <= hours * 60 * 60 * 1000
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`

  return date.toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function UpdateCard({ updateItem }) {
  if (!updateItem) return null

  const isNew = isRecent(updateItem.publishDate)
  const oppStatus = getOpportunityStatus(updateItem.deadline, updateItem.noDeadline)
  const hasImage = updateItem.featuredImage && updateItem.featuredImage.trim().length > 0

  return (
    <article className="border border-line bg-white rounded-xs overflow-hidden flex flex-col justify-between hover:border-green hover:shadow-md transition-all group">
      <div>
        {/* Aspect Ratio Container for Image / Fallback */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          {hasImage ? (
            <img
              src={updateItem.featuredImage}
              alt={updateItem.imageAlt || updateItem.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <CategoryFallbackImage
              category={updateItem.category}
              title={updateItem.title}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 flex-wrap">
            {isNew && (
              <span className="bg-red-600 text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                New
              </span>
            )}
            {updateItem.isVerified && (
              <span className="bg-emerald-600 text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                ✓ Verified
              </span>
            )}
            <span className="bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-xs border border-white/20">
              {updateItem.category}
            </span>
          </div>

          {(updateItem.deadline || updateItem.noDeadline) && (
            <div className={`absolute bottom-2 right-2 text-[10px] font-sans font-bold px-2 py-0.5 rounded-xs shadow-xs z-10 border ${oppStatus.badgeClass}`}>
              {oppStatus.label}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-sans text-inksoft mb-2 flex items-center justify-between">
            <span>📅 {formatDate(updateItem.publishDate)}</span>
            {updateItem.status === 'draft' && (
              <span className="text-amber-600 font-semibold">[Draft]</span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-ink group-hover:text-green transition-colors leading-snug mb-2 line-clamp-2">
            <Link to={`/daily-updates/${updateItem.slug}`}>{updateItem.title}</Link>
          </h3>

          <p className="font-sans text-xs text-inksoft leading-relaxed line-clamp-3 mb-4">
            {updateItem.shortDescription}
          </p>
        </div>
      </div>

      {/* View Details Footer */}
      <div className="p-4 sm:p-5 pt-0 mt-auto">
        <Link
          to={`/daily-updates/${updateItem.slug}`}
          className="inline-flex items-center justify-center w-full border border-line bg-paper text-ink font-sans text-xs font-semibold py-2 px-3 rounded-xs hover:bg-green hover:text-white hover:border-green transition-colors"
        >
          View Details →
        </Link>
      </div>
    </article>
  )
}
