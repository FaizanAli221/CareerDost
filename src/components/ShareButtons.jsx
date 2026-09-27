import React, { useState, useEffect } from 'react'
import { getAbsoluteUrl, trackShareEvent } from '../lib/config'

export default function ShareButtons({
  title = 'Opportunity on CareerDost',
  url = '',
  variant = 'default',
  className = '',
}) {
  const [copied, setCopied] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  // Determine full absolute URL dynamically
  const shareUrl = typeof window !== 'undefined'
    ? (url ? getAbsoluteUrl(url) : window.location.href)
    : getAbsoluteUrl(url)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setHasNativeShare(true)
    }
  }, [])

  // Safely copy URL to clipboard
  const handleCopyLink = async () => {
    trackShareEvent('copy', title, shareUrl)
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        // Fallback for older browsers
        const input = document.createElement('input')
        input.value = shareUrl
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('Failed to copy share link:', err)
    }
  }

  // Handle native mobile Web Share API
  const handleNativeShare = async () => {
    trackShareEvent('native', title, shareUrl)
    try {
      await navigator.share({
        title: title,
        text: `${title}\n\nCheck complete details on CareerDost:`,
        url: shareUrl,
      })
    } catch (err) {
      // Ignore user cancellation
      if (err.name !== 'AbortError') {
        console.warn('Native share failed:', err)
      }
    }
  }

  // WhatsApp share link & handler
  const whatsappText = `${title}\n\nCheck complete details on CareerDost:\n${shareUrl}`
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`

  // Facebook share link
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  // LinkedIn share link
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  return (
    <div className={`select-none ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-paper border border-line rounded-xs">
        <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-inksoft">
          <svg className="w-4 h-4 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share this opportunity</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Native Share (Mobile) */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xs transition-colors shadow-2xs active:scale-95 min-h-[36px]"
              aria-label="Share via device options"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Share</span>
            </button>
          )}

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackShareEvent('whatsapp', title, shareUrl)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xs transition-colors shadow-2xs active:scale-95 min-h-[36px]"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Facebook Button */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackShareEvent('facebook', title, shareUrl)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-[#1877F2] hover:bg-[#166fe5] rounded-xs transition-colors shadow-2xs active:scale-95 min-h-[36px]"
            aria-label="Share on Facebook"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </a>

          {/* LinkedIn Button */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackShareEvent('linkedin', title, shareUrl)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-[#0A66C2] hover:bg-[#09519a] rounded-xs transition-colors shadow-2xs active:scale-95 min-h-[36px]"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LinkedIn</span>
          </a>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            type="button"
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold border rounded-xs transition-colors shadow-2xs active:scale-95 min-h-[36px] ${
              copied
                ? 'bg-green text-white border-green font-bold'
                : 'bg-white text-ink border-line hover:bg-slate-50'
            }`}
            aria-label="Copy Link to Clipboard"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-inksoft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
