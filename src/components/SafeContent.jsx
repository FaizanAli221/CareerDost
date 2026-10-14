import React from 'react'
import { parseMarkdownToHtml } from '../lib/markdown'

export default function SafeContent({ content, stripTitle = '', className = '' }) {
  if (!content) return null

  const html = parseMarkdownToHtml(content, { stripTitle })

  return (
    <div
      className={`prose-content font-sans text-ink leading-relaxed space-y-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
