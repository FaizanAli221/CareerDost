import React from 'react'

export const CATEGORY_THEMES = {
  'Government Jobs': {
    bg: 'from-emerald-800 to-slate-900',
    accent: 'border-emerald-400',
    tagBg: 'bg-emerald-500/20 text-emerald-200',
    icon: '🏛️',
  },
  'Latest Jobs': {
    bg: 'from-blue-800 to-indigo-950',
    accent: 'border-blue-400',
    tagBg: 'bg-blue-500/20 text-blue-200',
    icon: '💼',
  },
  'Private Jobs': {
    bg: 'from-slate-800 to-zinc-950',
    accent: 'border-cyan-400',
    tagBg: 'bg-cyan-500/20 text-cyan-200',
    icon: '🏢',
  },
  'Bank Jobs': {
    bg: 'from-amber-800 to-stone-900',
    accent: 'border-amber-400',
    tagBg: 'bg-amber-500/20 text-amber-200',
    icon: '🏦',
  },
  'Internships': {
    bg: 'from-violet-800 to-purple-950',
    accent: 'border-purple-400',
    tagBg: 'bg-purple-500/20 text-purple-200',
    icon: '🎓',
  },
  'Scholarships': {
    bg: 'from-teal-800 to-emerald-950',
    accent: 'border-teal-400',
    tagBg: 'bg-teal-500/20 text-teal-200',
    icon: '📜',
  },
  'Admissions': {
    bg: 'from-rose-800 to-slate-950',
    accent: 'border-rose-400',
    tagBg: 'bg-rose-500/20 text-rose-200',
    icon: '🏫',
  },
  'Results / Test Updates': {
    bg: 'from-cyan-800 to-blue-950',
    accent: 'border-cyan-300',
    tagBg: 'bg-cyan-500/20 text-cyan-200',
    icon: '📊',
  },
  'Deadline Alerts': {
    bg: 'from-red-800 to-stone-950',
    accent: 'border-red-400',
    tagBg: 'bg-red-500/20 text-red-200',
    icon: '⏰',
  },
  'Career News': {
    bg: 'from-emerald-900 to-slate-950',
    accent: 'border-green-400',
    tagBg: 'bg-green-500/20 text-green-200',
    icon: '📰',
  },
}

export default function CategoryFallbackImage({ category, title, className = '' }) {
  const theme = CATEGORY_THEMES[category] || {
    bg: 'from-slate-800 to-slate-950',
    accent: 'border-emerald-400',
    tagBg: 'bg-slate-700 text-slate-200',
    icon: '📢',
  }

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${theme.bg} text-white flex flex-col justify-between p-4 sm:p-5 select-none overflow-hidden ${className}`}
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <span className="font-serif text-sm font-bold tracking-tight text-white/90">
          CareerDost<span className="text-emerald-400">.pk</span>
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-sans font-semibold ${theme.tagBg}`}>
          {category}
        </span>
      </div>

      {/* Center Icon & Title Preview */}
      <div className="my-auto z-10 flex flex-col items-center text-center px-2">
        <div className="text-3xl sm:text-4xl mb-2 drop-shadow-md">{theme.icon}</div>
        <div className="font-sans font-semibold text-xs sm:text-sm text-white/90 line-clamp-2 max-w-xs leading-snug">
          {title || category}
        </div>
      </div>

      {/* Bottom Footer Accent */}
      <div className="flex items-center justify-between z-10 border-t border-white/10 pt-2 text-[10px] font-sans text-white/60">
        <span>Verified Portal Update</span>
        <span className="font-semibold text-emerald-300">Daily Updates</span>
      </div>
    </div>
  )
}
