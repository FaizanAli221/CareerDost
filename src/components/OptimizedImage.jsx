import React from 'react'

/**
 * Optimized responsive image with native WebP format negotiation,
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
  if (!src) return null

  const isJpg = /\.(jpe?g|png)$/i.test(src)
  const webpSrc = isJpg ? src.replace(/\.(jpe?g|png)$/i, '.webp') : null

  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  )
}
