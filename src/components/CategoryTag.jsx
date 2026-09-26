import { Link } from 'react-router-dom'
import { categoryBySlug, toneClasses } from '../data/categories'

export default function CategoryTag({ slug, linked = true }) {
  if (!slug) return null
  const cat = categoryBySlug(slug) || { short: slug, tone: 'slate', slug }
  const toneKey = cat && cat.tone && toneClasses[cat.tone] ? cat.tone : 'slate'
  const tone = toneClasses[toneKey] || toneClasses.slate

  const el = (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-sans font-medium ${tone.tag}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
      {cat.short || slug}
    </span>
  )

  if (!linked) return el

  return (
    <Link to={`/category/${cat.slug || slug}`} className="no-underline">
      {el}
    </Link>
  )
}
