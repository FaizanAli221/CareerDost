import React from 'react'
import { safeUrl } from '../lib/security'
import { formatDate } from '../lib/format'

export default function KeyInfoSummary({ item, type, labels, statusInfo }) {
  if (!item || !labels) return null

  const org = item.organization || ''
  const location = item.location || ''
  const qual = item.qualification || ''
  const salary = item.salary || ''
  const positions = item.positions || ''
  const lastDate = item.lastDate || item.last_date || item.deadline || ''
  const officialLink = item.officialLink || item.official_link || ''

  // Only render if we have at least some specifications
  const hasSpecs = org || location || qual || salary || positions || lastDate

  if (!hasSpecs) return null

  return (
    <div className="border border-line bg-paper/60 rounded-xs p-4 sm:p-5 mb-8 font-sans">
      <div className="flex items-center justify-between gap-3 border-b border-line/70 pb-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">📋</span>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-ink">
            {labels.summaryTitle || 'Key Information Summary'}
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${labels.badgeClass}`}>
            {labels.badge}
          </span>
          {item.isVerified || item.is_verified ? (
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              ✓ Verified Official Source
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs sm:text-sm">
        {org && (
          <div className="bg-white p-3 border border-line/60 rounded-xs">
            <span className="text-inksoft block text-[11px] uppercase tracking-wider mb-0.5">
              {labels.orgLabel}
            </span>
            <strong className="text-ink font-semibold line-clamp-2">{org}</strong>
          </div>
        )}

        {location && (
          <div className="bg-white p-3 border border-line/60 rounded-xs">
            <span className="text-inksoft block text-[11px] uppercase tracking-wider mb-0.5">
              {labels.locLabel}
            </span>
            <strong className="text-ink font-semibold line-clamp-2">{location}</strong>
          </div>
        )}

        {qual && (
          <div className="bg-white p-3 border border-line/60 rounded-xs">
            <span className="text-inksoft block text-[11px] uppercase tracking-wider mb-0.5">
              {labels.qualLabel}
            </span>
            <strong className="text-ink font-semibold line-clamp-2">{qual}</strong>
          </div>
        )}

        {salary && (
          <div className="bg-white p-3 border border-line/60 rounded-xs">
            <span className="text-inksoft block text-[11px] uppercase tracking-wider mb-0.5">
              {labels.salLabel}
            </span>
            <strong className="text-ink font-semibold line-clamp-2">{salary}</strong>
          </div>
        )}

        {positions && (
          <div className="bg-white p-3 border border-line/60 rounded-xs">
            <span className="text-inksoft block text-[11px] uppercase tracking-wider mb-0.5">
              {labels.posLabel}
            </span>
            <strong className="text-ink font-semibold line-clamp-2">{positions}</strong>
          </div>
        )}

        {lastDate && (
          <div className="bg-white p-3 border border-line/60 rounded-xs">
            <span className="text-inksoft block text-[11px] uppercase tracking-wider mb-0.5">
              {labels.dateLabel}
            </span>
            <strong className="text-ink font-semibold line-clamp-2">
              {type === 'job' && !isNaN(new Date(lastDate.split('T')[0] + 'T00:00:00').getTime())
                ? formatDate(lastDate)
                : lastDate}
            </strong>
          </div>
        )}
      </div>

      {/* Official Facts vs Editorial Policy Transparency Banner */}
      <div className="mt-4 pt-3 border-t border-line/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-inksoft">
        <div className="flex items-center gap-1.5">
          <span className="text-green font-bold">●</span>
          <span>
            <strong>Official Facts:</strong> Sourced from official gazettes &amp; government portals. CareerDost provides independent public analysis.
          </span>
        </div>
        {officialLink && (
          <a
            href={safeUrl(officialLink)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-green hover:underline font-semibold shrink-0"
          >
            Direct Official Link ↗
          </a>
        )}
      </div>
    </div>
  )
}
