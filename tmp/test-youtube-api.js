async function test() {
  const query = 'Arijit Singh';
  console.log(`Testing YouTube search with query: ${query}`);
  try {
    const res = await fetch(`http://localhost:3000/api/youtube/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    console.log('Results:', JSON.stringify(data, null, 2));
    if (data.tracks && data.tracks.length > 0) {
      console.log('SUCCESS: Found YouTube tracks.');
    } else {
      console.log('FAILURE: No tracks found.');
    }
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

test();
