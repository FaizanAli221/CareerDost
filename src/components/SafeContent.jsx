import React from 'react'
import DOMPurify from 'dompurify'

export default function SafeContent({ content, className = '' }) {
  if (!content) return null

  const contentList = Array.isArray(content) ? content : [content]

  return (
    <div className={`space-y-4 font-sans text-ink leading-relaxed ${className}`}>
      {contentList.map((item, idx) => {
        if (!item || typeof item !== 'string') return null
        const hasHtml = /<[a-z][\s\S]*>/i.test(item)

        if (hasHtml) {
          const cleanHtml = DOMPurify.sanitize(item, {
            ADD_ATTR: ['target', 'rel'],
            ALLOWED_TAGS: [
              'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
              'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote',
              'div', 'span', 'br', 'hr', 'code', 'pre', 'img'
            ],
          })
          return (
            <div
              key={idx}
              className="prose-content font-sans space-y-3"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          )
        }

        return <p key={idx}>{item}</p>
      })}
    </div>
  )
}
