import fs from 'fs';

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const toml = fs.readFileSync(tomlPath, 'utf8');
const token = toml.match(/oauth_token\s*=\s*"([^"]+)"/)[1];

async function checkDeployments() {
  const res = await fetch('https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/pages/projects/careerdost/deployments', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const json = await res.json();
  const deployments = json.result || [];
  console.log(`Found ${deployments.length} deployments:`);
  deployments.slice(0, 5).forEach((d, i) => {
    console.log(`[${i}] ID: ${d.id}`);
    console.log(`    URL: ${d.url}`);
    console.log(`    Created: ${d.created_on}`);
    console.log(`    Env: ${d.environment}`);
    console.log(`    Commit Hash: ${d.deployment_trigger?.metadata?.commit_hash || 'N/A'}`);
    console.log(`    Commit Message: ${d.deployment_trigger?.metadata?.commit_message || 'N/A'}`);
    console.log(`    Aliases: ${JSON.stringify(d.aliases)}`);
  });

  // Check domains
  const domRes = await fetch('https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/pages/projects/careerdost/domains', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const domJson = await domRes.json();
  console.log('\nCustom Domains:', JSON.stringify(domJson.result, null, 2));
}

checkDeployments().catch(console.error);
