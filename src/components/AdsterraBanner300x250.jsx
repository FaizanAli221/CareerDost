import { useEffect, useRef } from 'react'

/**
 * Adsterra 300x250 Banner Component
 * Ad Code 2: https://bauval.org/22/10caa118a1ae7f7bbec24c69459aa192
 * Uses an isolated sandbox iframe to execute atOptions cleanly, avoiding DOM collisions
 * and preventing Cumulative Layout Shift (CLS).
 */
export default function AdsterraBanner300x250({ className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clean any prior children
    container.innerHTML = ''

    const iframe = document.createElement('iframe')
    iframe.width = '300'
    iframe.height = '250'
    iframe.title = 'Advertisement'
    iframe.style.border = '0'
    iframe.style.width = '300px'
    iframe.style.height = '250px'
    iframe.style.overflow = 'hidden'
    iframe.scrolling = 'no'
    iframe.loading = 'lazy'

    container.appendChild(iframe)

    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '10caa118a1ae7f7bbec24c69459aa192',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://bauval.org/22/10caa118a1ae7f7bbec24c69459aa192"></script>
  </body>
</html>`)
      doc.close()
    }

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className={`no-print flex flex-col items-center my-6 ${className}`}>
      <div className="w-[300px] text-left mb-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-inksoft/70">
          Advertisement
        </span>
      </div>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-w-[300px] min-h-[250px] bg-stone-50 border border-line/60 rounded-xs flex items-center justify-center overflow-hidden shadow-xs"
      />
    </div>
  )
}
