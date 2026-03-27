require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testSpotify() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  console.log(`Testing Spotify with ID: ${SPOTIFY_CLIENT_ID}`);

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    console.log('Token Response:', JSON.stringify(tokenData).substring(0, 50));

    if (!tokenData.access_token) {
      console.error('Failed to get token:', tokenData);
      return;
    }

    const searchResponse = await fetch('https://api.spotify.com/v1/search?q=hindi&type=track&limit=5&market=IN', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      }
    });

    const searchData = await searchResponse.json();
    if (searchData.tracks && searchData.tracks.items.length > 0) {
      console.log(`Success! Found ${searchData.tracks.items.length} tracks.`);
      console.log('First track:', searchData.tracks.items[0].name);
    } else {
      console.log('No tracks found.', JSON.stringify(searchData));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testSpotify();
