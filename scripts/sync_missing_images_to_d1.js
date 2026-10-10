import fs from 'fs'

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml'
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query'

async function refreshToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8')
  const rt = toml.match(/refresh_token\s*=\s*"([^"]+)"/)[1]
  console.log('Refreshing Cloudflare OAuth token...')
  const res = await fetch('https://dash.cloudflare.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: '54d11594-84e4-41aa-b438-e81b8fa78ee7',
      refresh_token: rt
    })
  })
  const data = await res.json()
  if (data.access_token) {
    const newExpiration = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString()
    let updatedToml = toml.replace(/oauth_token\s*=\s*"[^"]+"/, `oauth_token = "${data.access_token}"`)
    updatedToml = updatedToml.replace(/expiration_time\s*=\s*"[^"]+"/, `expiration_time = "${newExpiration}"`)
    if (data.refresh_token) {
      updatedToml = updatedToml.replace(/refresh_token\s*=\s*"[^"]+"/, `refresh_token = "${data.refresh_token}"`)
    }
    fs.writeFileSync(tomlPath, updatedToml, 'utf8')
    console.log('Successfully refreshed token. Expires:', newExpiration)
    return data.access_token
  }
  throw new Error(`Failed to refresh token: ${JSON.stringify(data)}`)
}

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8')
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/)
  return tokenMatch ? tokenMatch[1] : null
}

async function queryD1(sql, params = []) {
  let token = getToken()
  let res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  })

  let json = await res.json()
  if (!json.success && json.errors && json.errors.some(e => e.code === 10000)) {
    console.log('Token expired or unauthorized. Refreshing...')
    token = await refreshToken()
    res = await fetch(d1QueryUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params })
    })
    json = await res.json()
  }

  if (!json.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(json.errors)}`)
  }
  return json.result[0]
}

const missingSlugs = [
  'fpsc-assistant-director-2026',
  'punjab-police-constable-recruitment-2026',
  'nadra-data-entry-operator-2026',
  'systems-limited-hiring-software-engineers',
  'devsinc-remote-qa-engineer',
  'hbl-management-trainee-officer-2026',
  'meezan-bank-teller-2026',
  'phec-phd-scholarship-2026',
  'turkiye-burslari-scholarship-2026',
  'ufone-summer-internship-2026',
  'planning-commission-internship-2026',
  'nust-undergraduate-admissions-fall-2026',
  'punjab-medical-university-admissions-2026',
  'benazir-income-support-programme-2026',
  'punjab-rozgar-scheme-2026',
  'bise-lahore-matric-result-2026',
  'nts-nat-result-september-2026',
  'wapda-junior-engineer-2026',
  'unilever-future-leaders-2026'
]

async function run() {
  console.log('Syncing image updates to remote Cloudflare D1...')
  for (const slug of missingSlugs) {
    const imagePath = `/images/${slug}.jpg`
    const imageAlt = `${slug.replace(/-/g, ' ')} CareerDost`
    await queryD1('UPDATE articles SET featured_image = ?, image_alt = ? WHERE slug = ?', [imagePath, imageAlt, slug])
    await queryD1('UPDATE daily_updates SET featured_image = ?, image_alt = ? WHERE slug = ?', [imagePath, imageAlt, slug])
    console.log(`✓ D1 updated: ${slug}`)
  }
  console.log('All 19 image references successfully synced to remote Cloudflare D1!')
}

run().catch(console.error)
