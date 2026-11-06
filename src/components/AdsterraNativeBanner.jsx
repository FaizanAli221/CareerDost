import { useEffect, useRef } from 'react'

/**
 * Adsterra Responsive Native Banner Component
 * Ad Code 1: https://bauval.org/21/287aa9e0e23e64ce3c5755183719bdd0
 * Integrates responsive native recommendations below the article body.
 */
export default function AdsterraNativeBanner({ className = '' }) {
  const containerId = 'container-287aa9e0e23e64ce3c5755183719bdd0'
  const wrapperRef = useRef(null)

  useEffect(() => {
    const scriptSrc = 'https://bauval.org/21/287aa9e0e23e64ce3c5755183719bdd0'

    // Clean up any stale script element before inserting
    const existing = document.querySelector(`script[src="${scriptSrc}"]`)
    if (existing) {
      existing.remove()
    }

    const script = document.createElement('script')
    script.src = scriptSrc
    script.async = true
    script.setAttribute('data-cfasync', 'false')

    if (wrapperRef.current) {
      wrapperRef.current.appendChild(script)
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className={`no-print my-8 ${className}`}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-inksoft/70">
          Sponsored &amp; Recommended
        </span>
      </div>
      <div
        ref={wrapperRef}
        className="min-h-[160px] bg-stone-50/60 border border-line/60 rounded-xs p-3 flex flex-col items-center justify-center overflow-hidden shadow-xs"
      >
        <div id={containerId} className="w-full"></div>
      </div>
    </div>
  )
}
