import React from 'react'

export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDnzwFF1YlIkJax2P1o'

export function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  )
}

export default function WhatsAppCTA({ variant = 'banner', className = '' }) {
  if (variant === 'compact' || variant === 'sidebar') {
    return (
      <div className={`p-4 bg-emerald-900 text-white rounded font-sans border-l-4 border-[#25D366] shadow-sm ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-[#25D366] text-white rounded-full shrink-0">
            <WhatsAppIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-white">Join CareerDost WhatsApp</h4>
            <p className="text-xs text-emerald-100 mt-1">
              Get instant alerts for Government Jobs, Scholarships & Admissions directly on WhatsApp.
            </p>
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded tracking-wide transition-all shadow hover:shadow-md"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Join Channel Now</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'button-only') {
    return (
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-bold px-3.5 py-1.5 rounded text-xs transition-colors shadow-xs ${className}`}
      >
        <WhatsAppIcon className="w-4 h-4" />
        <span>Join WhatsApp</span>
      </a>
    )
  }

  // Default 'banner' variant
  return (
    <div className={`bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-lg shadow-md border border-emerald-700/50 relative overflow-hidden font-sans my-8 ${className}`}>
      {/* Background Decorative Blob */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#25D366]/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-white/20">
            <WhatsAppIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
              <span>Official Channel</span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Want Daily Opportunity Alerts?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1">
              Join CareerDost on WhatsApp. Get official Pakistan government &amp; private job postings, university admissions, and international scholarship alerts delivered directly to your phone.
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center space-x-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3 rounded-md text-sm transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-98"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>Join CareerDost WhatsApp Channel →</span>
          </a>
        </div>
      </div>
    </div>
  )
}
