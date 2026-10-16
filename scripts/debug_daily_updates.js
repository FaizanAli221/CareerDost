async function test() {
  const res = await fetch('https://careerdost.blog/daily-updates')
  console.log('Status:', res.status)
  console.log('Content-Type:', res.headers.get('content-type'))
  const html = await res.text()
  console.log('Length:', html.length)
  const rootIdx = html.indexOf('id="root"')
  console.log('Root snippet:', html.slice(rootIdx, rootIdx + 150))
  console.log('Has articles in SSR HTML:', html.includes('<article'))
  console.log('Has H1 in SSR HTML:', html.includes('<h1'))
  console.log('Has Schema in SSR HTML:', html.includes('application/ld+json'))
}

test().catch(console.error)
