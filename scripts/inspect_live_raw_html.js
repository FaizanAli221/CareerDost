async function inspect() {
  const url = 'https://careerdost.blog/jobs/zarkhez-e-asaan-digital-zarai-qarza-guide-2026'
  const res = await fetch(url)
  console.log('HTTP Status:', res.status)
  const text = await res.text()
  console.log('Total HTML Length:', text.length)
  console.log('Has <h1:', text.includes('<h1'))
  console.log('Has </h1>:', text.includes('</h1>'))
  const h1Match = text.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi)
  console.log('H1 Match:', h1Match)
  console.log('Preload image tags:', text.match(/<link[^>]*rel="preload"[^>]*>/gi))
  console.log('Title tag:', text.match(/<title>[\s\S]*?<\/title>/gi))
}

inspect()
