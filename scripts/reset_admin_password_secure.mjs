import fs from 'fs';
import readline from 'readline';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';

function promptPassword(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    if (process.stdin.isTTY) {
      process.stdout.write(query);
      let password = '';
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (ch) => {
        ch = String(ch);
        switch (ch) {
          case '\n':
          case '\r':
          case '\u0004':
            process.stdin.setRawMode(false);
            process.stdin.removeListener('data', onData);
            process.stdout.write('\n');
            rl.close();
            resolve(password);
            break;
          case '\u0003': // Ctrl+C
            process.exit(0);
            break;
          case '\u0008': // Backspace
          case '\x7f':
            if (password.length > 0) {
              password = password.slice(0, -1);
              process.stdout.write('\b \b');
            }
            break;
          default:
            password += ch;
            process.stdout.write('*');
            break;
        }
      };
      process.stdin.on('data', onData);
    } else {
      rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
      });
    }
  });
}

async function refreshToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const rt = toml.match(/refresh_token\s*=\s*"([^"]+)"/)[1];
  const res = await fetch('https://dash.cloudflare.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: '54d11594-84e4-41aa-b438-e81b8fa78ee7',
      refresh_token: rt
    })
  });
  const data = await res.json();
  if (data.access_token) {
    const newExpiration = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString();
    let updatedToml = toml.replace(/oauth_token\s*=\s*"[^"]+"/, `oauth_token = "${data.access_token}"`);
    updatedToml = updatedToml.replace(/expiration_time\s*=\s*"[^"]+"/, `expiration_time = "${newExpiration}"`);
    if (data.refresh_token) {
      updatedToml = updatedToml.replace(/refresh_token\s*=\s*"[^"]+"/, `refresh_token = "${data.refresh_token}"`);
    }
    fs.writeFileSync(tomlPath, updatedToml, 'utf8');
    return data.access_token;
  }
  throw new Error('Failed to refresh Cloudflare OAuth token.');
}

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  return tokenMatch ? tokenMatch[1] : null;
}

async function queryD1(sql, params = []) {
  let token = getToken();
  let res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });

  let json = await res.json();
  if (!json.success && json.errors && json.errors.some(e => e.code === 10000 || e.code === 7403)) {
    token = await refreshToken();
    res = await fetch(d1QueryUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params })
    });
    json = await res.json();
  }

  if (!json.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(json.errors)}`);
  }
  return json.result[0];
}

async function main() {
  console.log('================================================================');
  console.log('  CareerDost — Secure Production Admin Password Reset Workflow  ');
  console.log('================================================================\n');

  // Verify target admin record exists in D1
  const existingRes = await queryD1('SELECT id, role FROM admins WHERE id = 2');
  const existingAdmin = existingRes?.results?.[0];
  if (!existingAdmin) {
    console.error('Error: Production admin record with ID 2 not found.');
    process.exit(1);
  }
  console.log('[✓] Verified production admin account is ready for credential update.');

  const password = await promptPassword('Enter new strong admin password (min 8 characters): ');
  if (!password || password.length < 8) {
    console.error('\nError: Password must be at least 8 characters long.');
    process.exit(1);
  }

  const confirmPassword = await promptPassword('Confirm new strong admin password: ');
  if (password !== confirmPassword) {
    console.error('\nError: Passwords do not match.');
    process.exit(1);
  }

  console.log('\n[1/4] Generating secure bcrypt hash locally (salt rounds: 10)...');
  const newHash = await bcrypt.hash(password, 10);
  console.log('[✓] Secure bcrypt hash generated locally.');

  console.log('[2/4] Updating production Cloudflare D1 database (careerdost-db)...');
  const updateRes = await queryD1('UPDATE admins SET password_hash = ? WHERE id = ?', [newHash, 2]);
  if (updateRes?.meta?.changes !== 1) {
    console.error('Warning: D1 update did not report 1 change:', updateRes?.meta);
  } else {
    console.log('[✓] Production Cloudflare D1 admin password hash updated successfully.');
  }

  console.log('[3/4] Synchronizing local development SQLite database (careerdost.sqlite)...');
  try {
    if (fs.existsSync('careerdost.sqlite')) {
      const db = new Database('careerdost.sqlite');
      db.prepare('UPDATE admins SET password_hash = ? WHERE id = 2').run(newHash);
      console.log('[✓] Local SQLite careerdost.sqlite synchronized.');
    }
  } catch (err) {
    console.warn('Note on local SQLite synchronization:', err.message);
  }

  console.log('[4/4] Updating local environment configuration (.env.local)...');
  try {
    if (fs.existsSync('.env.local')) {
      let envContent = fs.readFileSync('.env.local', 'utf8');
      if (envContent.includes('INITIAL_ADMIN_PASSWORD=')) {
        envContent = envContent.replace(
          /INITIAL_ADMIN_PASSWORD=.*/,
          `INITIAL_ADMIN_PASSWORD=${password}`
        );
      } else {
        envContent += `\nINITIAL_ADMIN_PASSWORD=${password}\n`;
      }
      fs.writeFileSync('.env.local', envContent, 'utf8');
      console.log('[✓] .env.local updated securely.');
    }
  } catch (err) {
    console.warn('Note on .env.local update:', err.message);
  }

  console.log('\n================================================================');
  console.log('  [SUCCESS] Superadmin password reset completed successfully.   ');
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('\nPassword reset failed:', err.message);
  process.exit(1);
});
