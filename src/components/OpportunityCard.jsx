import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate, getOpportunityStatus } from '../lib/format'
import CategoryFallbackImage from './CategoryFallbackImage'

export default function OpportunityCard({ opportunity, showDeadlineBadge = true }) {
  if (!opportunity) return null

  const oppStatus = getOpportunityStatus(opportunity.lastDate, opportunity.noDeadline)
  const hasImage = opportunity.featuredImage && opportunity.featuredImage.trim().length > 0

  return (
    <div className="border border-line bg-white rounded-xs overflow-hidden flex flex-col justify-between hover:border-green hover:shadow-md transition-all group">
      <div>
        {/* Aspect Ratio Container for Featured Image or Fallback */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          {hasImage ? (
            <img
              src={opportunity.featuredImage}
              alt={opportunity.imageAlt || opportunity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <CategoryFallbackImage
              category={opportunity.categoryLabel || opportunity.category}
              title={opportunity.title}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 flex-wrap">
            {opportunity.featured && (
              <span className="bg-gold text-slate-950 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                ⭐ Featured
              </span>
            )}
            {opportunity.isVerified && (
              <span className="bg-emerald-600 text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                ✓ Verified
              </span>
            )}
            <span className="bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-xs border border-white/20 capitalize">
              {opportunity.category?.replace('-', ' ')}
            </span>
          </div>

          {/* Dynamic Deadline / Status Badge */}
          {showDeadlineBadge && (
            <div
              className={`absolute bottom-2 right-2 text-[10px] font-sans font-bold px-2.5 py-1 rounded-xs shadow-xs z-10 border ${oppStatus.badgeClass}`}
            >
              ⏰ {oppStatus.label}
            </div>
          )}
        </div>

        {/* Info Content */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-sans text-inksoft mb-2 flex items-center justify-between">
            <span className="font-semibold text-green truncate max-w-[60%]">
              {opportunity.organization || 'Verified Department'}
            </span>
            {opportunity.location && (
              <span className="truncate max-w-[35%]">📍 {opportunity.location}</span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-ink group-hover:text-green transition-colors leading-snug mb-2 line-clamp-2">
            <Link to={`/jobs/${opportunity.slug}`}>{opportunity.title}</Link>
          </h3>

          <p className="font-sans text-xs text-inksoft leading-relaxed line-clamp-2 mb-4">
            {opportunity.excerpt || opportunity.metaDescription}
          </p>
        </div>
      </div>

      {/* Footer Meta & Action */}
      <div className="p-4 sm:p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-sans text-inksoft border-t border-line/60 pt-3 mb-3">
          <span>Posted: {formatDate(opportunity.publishDate)}</span>
          <span className="font-medium text-ink">Last Date: {opportunity.lastDate || 'N/A'}</span>
        </div>

        <Link
          to={`/jobs/${opportunity.slug}`}
          className="inline-flex items-center justify-center w-full border border-line bg-paper text-ink font-sans text-xs font-semibold py-2 px-3 rounded-xs hover:bg-green hover:text-white hover:border-green transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
