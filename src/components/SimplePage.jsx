export default function SimplePage({ title, updated, children }) {
  return (
    <div className="container-x py-10 max-w-[720px]">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink mb-1">{title}</h1>
      {updated && <p className="font-sans text-xs text-inksoft mb-8">Last updated: {updated}</p>}
      <div className="font-sans text-ink leading-relaxed space-y-5 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-ink [&_h2]:pt-3 [&_h2]:mb-1 [&_p]:text-[15px] [&_li]:text-[15px]">
        {children}
      </div>
    </div>
  )
}
