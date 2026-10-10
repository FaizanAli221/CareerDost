import fs from 'fs'

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml'
const toml = fs.readFileSync(tomlPath, 'utf8')
const rt = toml.match(/refresh_token\s*=\s*"([^"]+)"/)[1]

console.log('Requesting new access token with client_id = 54d11594-84e4-41aa-b438-e81b8fa78ee7...')

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
console.log('Response status:', res.status)
console.log('Response keys:', Object.keys(data))

if (data.access_token) {
  const newExpiration = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString()
  let updatedToml = toml.replace(/oauth_token\s*=\s*"[^"]+"/, `oauth_token = "${data.access_token}"`)
  updatedToml = updatedToml.replace(/expiration_time\s*=\s*"[^"]+"/, `expiration_time = "${newExpiration}"`)
  if (data.refresh_token) {
    updatedToml = updatedToml.replace(/refresh_token\s*=\s*"[^"]+"/, `refresh_token = "${data.refresh_token}"`)
  }
  fs.writeFileSync(tomlPath, updatedToml, 'utf8')
  console.log('SUCCESS! Updated default.toml with fresh token. Expires:', newExpiration)
} else {
  console.error('Error response:', data)
}
