const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const SPOTIFY_CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;

console.log(`Testing Spotify with ID: ${SPOTIFY_CLIENT_ID}`);

async function getToken() {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
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

async function search(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.spotify.com',
      path: '/v1/search?q=hindi&type=track&limit=5&market=IN',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const tokenData = await getToken();
    if (!tokenData.access_token) return console.error('Failed to get token:', tokenData);
    console.log('Token acquired.');
    const searchData = await search(tokenData.access_token);
    if (searchData.tracks && searchData.tracks.items.length > 0) {
      console.log(`Success! Found ${searchData.tracks.items.length} tracks.`);
      console.log('First track:', searchData.tracks.items[0].name);
    } else {
      console.log('No tracks found.', JSON.stringify(searchData));
    }
  } catch (err) {
    console.error('Error:', err);
  }
})();
