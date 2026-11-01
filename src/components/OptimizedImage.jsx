import React, { useState } from 'react'

/**
 * Optimized responsive image with native WebP format negotiation,
 * responsive srcset for admin uploads and static images,
 * explicit dimensions to prevent CLS, and async decoding.
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  width = 640,
  height = 360,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}) {
  const [useFallback, setUseFallback] = useState(false)

  if (!src) return null

  const isApiUpload = typeof src === 'string' && src.includes('/api/uploads/')
  const isJpgOrPng = typeof src === 'string' && /\.(jpe?g|png)$/i.test(src)
  const isStaticWebp = typeof src === 'string' && !isApiUpload && /\.webp$/i.test(src)

  let webpSrcSet = null
  let webpSingleSrc = null
  let resolvedImgSrc = src

  if (!useFallback) {
    if (isApiUpload) {
      // Remove any existing query params or extensions to get the clean upload ID URL
      const cleanSrc = src.split('?')[0].replace(/\.(webp|jpe?g|png)$/i, '')
      // Deliver responsive variants for cards (640w) and high-res/display (1200w)
      webpSrcSet = `${cleanSrc}?w=640&v=card 640w, ${cleanSrc}?w=1200&v=display 1200w`
      webpSingleSrc = `${cleanSrc}?w=640&v=card`
    } else if (isJpgOrPng) {
      webpSingleSrc = src.replace(/\.(jpe?g|png)$/i, '.webp')
    }
  } else if (isStaticWebp) {
    resolvedImgSrc = src.replace(/\.webp$/i, '.jpg')
  }

  return (
    <picture>
      {webpSrcSet ? (
        <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      ) : webpSingleSrc ? (
        <source srcSet={webpSingleSrc} sizes={sizes} type="image/webp" />
      ) : null}
      <img
        src={resolvedImgSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        onError={() => {
          if (!useFallback && (webpSrcSet || webpSingleSrc || isStaticWebp)) {
            setUseFallback(true)
          }
        }}
      />
    </picture>
  )
}
