const fs = require('fs');
const path = require('path');

async function checkSecurityEvents() {
  const tomlPath = path.join(process.env.APPDATA, 'xdg.config', '.wrangler', 'config', 'default.toml');
  if (!fs.existsSync(tomlPath)) {
    console.log('No wrangler default.toml found at:', tomlPath);
    return;
  }

  const toml = fs.readFileSync(tomlPath, 'utf8');
  const oauthMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!oauthMatch) {
    console.log('No oauth_token found in toml');
    return;
  }

  const token = oauthMatch[1];
  console.log('Found OAuth token. Querying zones for careerdost.blog...');

  const zoneRes = await fetch('https://api.cloudflare.com/client/v4/zones?name=careerdost.blog', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const zoneData = await zoneRes.json();

  if (!zoneData.success || !zoneData.result || zoneData.result.length === 0) {
    console.log('Zone not directly found in account or response:', zoneData);
    // Try listing all zones
    const allZonesRes = await fetch('https://api.cloudflare.com/client/v4/zones', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const allZones = await allZonesRes.json();
    console.log('All zones:', allZones.result?.map(z => ({ name: z.name, id: z.id })));
    return;
  }

  const zone = zoneData.result[0];
  const zoneId = zone.id;
  console.log(`Zone found: ${zone.name} (ID: ${zoneId})`);

  // Query GraphQL for firewall events in the last 72 hours
  console.log('Querying Cloudflare GraphQL firewallEventsAdaptive...');
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 72 * 3600 * 1000);

  const graphqlQuery = {
    query: `
      query GetFirewallEvents($zoneTag: String!, $since: String!, $until: String!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            firewallEventsAdaptive(
              filter: {
                datetime_geq: $since,
                datetime_leq: $until
              },
              limit: 50,
              orderBy: [datetime_DESC]
            ) {
              action
              clientAsn
              clientASNDescription
              clientCountryName
              clientIP
              datetime
              edgeResponseStatus
              kind
              originResponseStatus
              rayName
              ruleId
              source
              userAgent
            }
          }
        }
      }
    `,
    variables: {
      zoneTag: zoneId,
      since: threeDaysAgo.toISOString(),
      until: now.toISOString()
    }
  };

  const gqlRes = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(graphqlQuery)
  });
  const gqlData = await gqlRes.json();
  console.log('GraphQL errors:', gqlData.errors);

  const events = gqlData.data?.viewer?.zones?.[0]?.firewallEventsAdaptive || [];
  console.log(`Retrieved ${events.length} firewall events in the last 72 hours.`);
  
  const googleBlocks = events.filter(e => 
    (e.userAgent && e.userAgent.toLowerCase().includes('google')) ||
    (e.clientASNDescription && e.clientASNDescription.toLowerCase().includes('google'))
  );

  console.log(`Verified Googlebot 403 / Blocks count: ${googleBlocks.length}`);
  if (googleBlocks.length > 0) {
    console.log('Googlebot block events:', JSON.stringify(googleBlocks, null, 2));
  } else {
    console.log('No Googlebot blocks or 403 responses detected in Cloudflare firewall events.');
  }

  // Check Security Level
  const secLevelRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/settings/security_level`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const secLevelData = await secLevelRes.json();
  console.log('\nZone Security Level:', secLevelData.result?.value || secLevelData);

  // Check firewall rules / custom rules
  const rulesRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/http_request_firewall_custom/entrypoint`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const rulesData = await rulesRes.json();
  console.log('\nCustom Firewall Rules count:', rulesData.result?.rules?.length || 0);
  if (rulesData.result?.rules) {
    console.log('Rules:', rulesData.result.rules.map(r => ({ description: r.description, action: r.action, expression: r.expression })));
  }
}

checkSecurityEvents().catch(console.error);
