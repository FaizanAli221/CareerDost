import fs from 'fs';

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const toml = fs.readFileSync(tomlPath, 'utf8');
const token = toml.match(/oauth_token\s*=\s*"([^"]+)"/)[1];

async function checkVars() {
  const res = await fetch('https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/pages/projects/careerdost', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const json = await res.json();
  const envVars = json.result?.deployment_configs?.production?.env_vars;
  console.log('Production env var keys in Cloudflare Pages:', Object.keys(envVars || {}));
  for (const k of Object.keys(envVars || {})) {
    console.log(`  ${k}: type=${envVars[k]?.type}`);
  }
}
checkVars().catch(console.error);
