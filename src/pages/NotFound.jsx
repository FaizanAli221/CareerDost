import { Link } from 'react-router-dom'
import { useSeo } from '../lib/useSeo'

export default function NotFound() {
  useSeo('Page not found — CareerDost')
  return (
    <div className="container-x py-20 text-center">
      <h1 className="font-serif text-3xl text-ink mb-3">Page not found</h1>
      <p className="font-sans text-inksoft mb-6">
        This listing may have closed and been removed, or the link is incorrect.
      </p>
      <Link to="/" className="inline-block border border-green bg-green text-white px-5 py-2.5 font-sans text-sm hover:bg-green-dark">
        Back to home
      </Link>
    </div>
  )
}
