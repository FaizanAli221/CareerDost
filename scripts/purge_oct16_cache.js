import fs from 'fs'
import path from 'path'

const tomlPath = path.join(process.env.APPDATA, 'xdg.config', '.wrangler', 'config', 'default.toml')

async function refreshToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8')
  const rtMatch = toml.match(/refresh_token\s*=\s*"([^"]+)"/)
  if (!rtMatch) throw new Error('No refresh_token found in toml')
  const rt = rtMatch[1]
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

async function purgeCache() {
  console.log('=== PURGING CLOUDFLARE EDGE CACHE FOR OCT 16 FEATURED IMAGES ===\n')

  let token = getToken()
  let zoneRes = await fetch('https://api.cloudflare.com/client/v4/zones?name=careerdost.blog', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  let zoneData = await zoneRes.json()

  if (!zoneData.success && zoneData.errors && zoneData.errors.some(e => e.code === 9109 || e.code === 10000)) {
    console.log('Token expired. Refreshing...')
    token = await refreshToken()
    console.log('Waiting 3s for token propagation...')
    await new Promise(r => setTimeout(r, 3000))
    zoneRes = await fetch('https://api.cloudflare.com/client/v4/zones?name=careerdost.blog', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    zoneData = await zoneRes.json()
  }

  if (!zoneData.success || !zoneData.result.length) {
    throw new Error('Zone careerdost.blog not found: ' + JSON.stringify(zoneData))
  }
  const zoneId = zoneData.result[0].id
  console.log(`Found Zone: careerdost.blog (${zoneId})`)

  const filesToPurge = [
    'https://careerdost.blog/images/kp-government-project-associate-internship-2026.webp',
    'https://careerdost.blog/images/kp-government-project-associate-internship-2026.jpg',
    'https://careerdost.blog/images/aku-karachi-jobs-traineeships-2026.webp',
    'https://careerdost.blog/images/aku-karachi-jobs-traineeships-2026.jpg',
    'https://careerdost.blog/images/systems-limited-associate-software-engineer-jobs-2026.webp',
    'https://careerdost.blog/images/systems-limited-associate-software-engineer-jobs-2026.jpg',
    'https://careerdost.blog/images/hbl-jobs-internships-the-league-2026.webp',
    'https://careerdost.blog/images/hbl-jobs-internships-the-league-2026.jpg',
    'https://careerdost.blog/images/jazz-careers-ai-associate-programme-2026.webp',
    'https://careerdost.blog/images/jazz-careers-ai-associate-programme-2026.jpg',
    'https://careerdost.blog/sitemap.xml'
  ]

  console.log('Purging files:', filesToPurge)

  const purgeRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ files: filesToPurge })
  })

  const purgeData = await purgeRes.json()
  console.log('Purge response:', purgeData)
  if (purgeData.success) {
    console.log('✓ Successfully purged files from Cloudflare cache!')
  } else {
    console.error('✗ Purge failed:', purgeData.errors)
  }
}

purgeCache().catch(err => {
  console.error('Purge error:', err)
  process.exit(1)
})
