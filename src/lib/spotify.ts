const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

console.log('[Spotify Lib] Credentials check:', !!CLIENT_ID, !!CLIENT_SECRET);

let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiresAt) {
    console.log('[Spotify Lib] Using cached token');
    return accessToken;
  }

  console.log('[Spotify Lib] Requesting new token...');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Moodify/1.0',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  if (data.error) {
    console.error('[Spotify Lib] Token Error:', data.error, data.error_description);
    throw new Error(`Failed to get Spotify token: ${data.error}`);
  }

  accessToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000 - 60000;
  console.log('[Spotify Lib] Token received successfully');
  return accessToken;
}

export async function spotifyFetch(endpoint: string) {
  try {
    const token = await getAccessToken();
    const url = `https://api.spotify.com/v1${endpoint}`;
    console.log(`[Spotify Fetch] URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Moodify/1.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      const fs = require('fs');
      fs.appendFileSync('spotify_errors.log', `[${new Date().toISOString()}] Error [${endpoint}]: ${JSON.stringify(error)}\n`);
      console.error(`Spotify API Error [${endpoint}]:`, error);
      return null;
    }

    return response.json();
  } catch (error: any) {
    const fs = require('fs');
    fs.appendFileSync('spotify_errors.log', `[${new Date().toISOString()}] Fetch Error [${endpoint}]: ${error.message}\n`);
    console.error(`Spotify Fetch Error [${endpoint}]:`, error);
    return null;
  }
}

export async function searchSongs(query: string) {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: '10',
    market: 'IN'
  });
  return spotifyFetch(`/search?${params.toString()}`);
}

export async function getRecommendations(seed_genres: string) {
  return spotifyFetch(`/recommendations?seed_genres=${seed_genres}&limit=10&market=IN`);
}

export async function getNewReleases() {
  return spotifyFetch('/browse/new-releases?limit=10&country=IN');
}

export async function getFeaturedPlaylists() {
  return spotifyFetch('/browse/featured-playlists?limit=10&country=IN');
}
