const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;

async function getToken() {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write('grant_type=client_credentials');
    req.end();
  });
}

async function spotifyFetch(token, endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spotify.com',
      path: `/v1${endpoint}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const tokenData = await getToken();
    const token = tokenData.access_token;
    console.log('Token acquired.');

    const testEndpoints = [
      '/search?q=hindi&type=track&limit=10&market=IN',
      '/search?q=hindi&type=track&limit=11&market=IN',
      '/search?q=hindi&type=track&limit=20&market=IN',
    ];

    for (const endpoint of testEndpoints) {
      console.log(`Testing: ${endpoint}`);
      const res = await spotifyFetch(token, endpoint);
      console.log(`Status: ${res.status}`);
      if (res.status !== 200) {
        console.log(`Error: ${JSON.stringify(res.data)}`);
      } else {
        console.log(`Success! Found ${res.data.tracks.items.length} tracks.`);
      }
    }
  } catch (err) {
    console.error('Test script failed:', err);
  }
})();
