import { Link } from 'react-router-dom'
import { categoryBySlug, toneClasses } from '../data/categories'

export default function CategoryTag({ slug, linked = true }) {
  const cat = categoryBySlug(slug)
  if (!cat) return null
  const tone = toneClasses[cat.tone]
  const el = (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-sans font-medium ${tone.tag}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
      {cat.short}
    </span>
  )
  if (!linked) return el
  return (
    <Link to={`/category/${cat.slug}`} className="no-underline">
      {el}
    </Link>
  )
}
