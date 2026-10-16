const fs = require('fs');
const path = require('path');

const tomlPath = path.join(process.env.APPDATA, 'xdg.config', '.wrangler', 'config', 'default.toml');

async function inspect() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const token = toml.match(/oauth_token\s*=\s*"([^"]+)"/)[1];
  const zoneId = '592fa0f50e1a5754aa91706800fc0d99';

  console.log('=== INSPECTING CLOUDFLARE AI BOT & WAF CONFIGURATION ===\n');

  // 1. Check all zone settings
  const settingsRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/settings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const settings = await settingsRes.json();
  if (settings.result) {
    const aiSetting = settings.result.find(s => s.id.includes('ai') || s.id.includes('bot'));
    console.log('Bot/AI Zone settings found:', aiSetting || 'None directly in settings array');
    const interesting = settings.result.filter(s => ['security_level', 'challenge_ttl', 'browser_check', 'waf'].includes(s.id));
    console.log('Key Security Settings:', interesting.map(s => ({ id: s.id, value: s.value })));
  }

  // 2. Check Custom Rulesets
  const phases = [
    'http_request_firewall_custom',
    'http_request_firewall_managed',
    'http_request_sanitize'
  ];
  for (const phase of phases) {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/${phase}/entrypoint`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log(`\nPhase [${phase}]:`, data.result?.rules?.length ? data.result.rules.map(r => ({ desc: r.description, action: r.action, expr: r.expression, enabled: r.enabled })) : 'No rules');
  }

  // 3. Check Bot Management / AI Crawlers setting via zone settings API
  const aiBotRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/settings/ai_bots_protection`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const aiBotData = await aiBotRes.json();
  console.log('\nAI Bots Protection Setting:', aiBotData);

  // 4. Query GraphQL for recent 403 events with ray IDs from our test
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600 * 1000);
  const gqlQuery = {
    query: `
      query GetRayEvents($zoneTag: String!, $since: String!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            firewallEventsAdaptive(
              filter: {
                datetime_geq: $since,
                edgeResponseStatus: 403
              },
              limit: 10,
              orderBy: [datetime_DESC]
            ) {
              action
              source
              ruleId
              userAgent
              edgeResponseStatus
              clientASNDescription
            }
          }
        }
      }
    `,
    variables: {
      zoneTag: zoneId,
      since: oneHourAgo.toISOString()
    }
  };
  const gqlRes = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gqlQuery)
  });
  const gqlData = await gqlRes.json();
  console.log('\nRecent 403 Firewall Events:', gqlData.data?.viewer?.zones?.[0]?.firewallEventsAdaptive || []);
}

inspect().catch(console.error);
