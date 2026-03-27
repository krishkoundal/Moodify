import { NextResponse } from 'next/server';
const ytSearch = require('yt-search');

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const title = searchParams.get('title');

  if (!artist || !title) {
    return NextResponse.json({ error: 'Parameters "artist" and "title" are required' }, { status: 400 });
  }

  try {
    // Search using dynamic queries to get similar vibe/genre (e.g. other Punjabi artists)
    const queries = [
      `${artist} radio track`,
      `similar songs to ${title} ${artist}`,
      `${artist} mix`,
      `songs like ${artist}`
    ];
    const query = queries[Math.floor(Math.random() * queries.length)];
    console.log(`[YouTube API] Searching for related track: "${query}"`);
    
    // We fetch a few results to pick a non-duplicate one
    const r = await ytSearch(query);
    const videos = r.videos.slice(0, 10);

    // Filter out the exact same track
    const filteredVideos = videos.filter((v: any) => 
      !v.title.toLowerCase().includes(title.toLowerCase())
    );

    // Pick a random track from the remaining
    if (filteredVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredVideos.length);
      const video = filteredVideos[randomIndex];

      const track = {
        id: video.videoId,
        title: video.title,
        artist: video.author.name || artist,
        album: 'Moodify AutoPlay',
        duration: video.timestamp,
        cover: video.thumbnail,
        color: '#8b5cf6', // Indigo-ish color
        url: video.url,
        views: video.views,
      };

      console.log(`[YouTube API] Fetched related track: ${track.title}`);
      return NextResponse.json({ track });
    }

    return NextResponse.json({ error: 'No related track found' }, { status: 404 });
  } catch (error: any) {
    console.error('[YouTube API] Server Error:', error.message);
    return NextResponse.json({ error: 'YouTube Search Failed' }, { status: 500 });
  }
}
