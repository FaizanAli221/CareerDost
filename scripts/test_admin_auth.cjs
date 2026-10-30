const fs = require('fs');
const crypto = require('crypto');

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  return tokenMatch ? tokenMatch[1] : null;
}

function base64UrlEncode(strOrBuffer) {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateJwt(admin, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encHeader}.${encPayload}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest());
  return `${dataToSign}.${signature}`;
}

async function queryD1(sql, params = []) {
  const token = getToken();
  const res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params })
  });
  const data = await res.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result[0].results;
}

async function run() {
  const admins = await queryD1('SELECT id, username, email, role FROM admins;');
  console.log('Production admins in D1:', admins);

  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const secretMatch = envLocal.match(/ADMIN_JWT_SECRET=(.+)/);
  const secret = secretMatch ? secretMatch[1].trim() : null;
  console.log('Local secret found:', secret ? secret.substring(0, 8) + '...' : 'none');

  if (admins.length > 0 && secret) {
    const admin = admins[0];
    const jwt = generateJwt(admin, secret);
    console.log('Testing JWT with production /api/admin/me ...');
    const meRes = await fetch('https://careerdost.blog/api/admin/me', {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    console.log('Status from /api/admin/me:', meRes.status);
    const meBody = await meRes.text();
    console.log('Body:', meBody);
  }
}

run().catch(console.error);
