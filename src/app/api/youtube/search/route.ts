import { NextResponse } from 'next/server';
const ytSearch = require('yt-search');

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 5;
    const safeLimit = Math.min(Math.max(limit, 1), 20); // Cap at 20

    const searchQuery = query.toLowerCase().includes('song') || query.toLowerCase().includes('audio') || query.toLowerCase().includes('music')
      ? query
      : `${query} song`;

    console.log(`[YouTube API] Searching for: "${searchQuery}" with limit: ${safeLimit}`);
    const r = await ytSearch(searchQuery);
    const videos = r.videos.slice(0, safeLimit);

    const tracks = videos.map((video: any) => ({
      id: video.videoId,
      title: video.title,
      artist: video.author.name,
      album: 'Moodify',
      duration: video.timestamp,
      cover: video.thumbnail,
      color: '#ef4444',
      url: video.url,
      views: video.views,
    }));

    console.log(`[YouTube API] Returning ${tracks.length} tracks`);
    return NextResponse.json({ tracks });
  } catch (error: any) {
    console.error('[YouTube API] Server Error:', error.message);
    return NextResponse.json({ error: 'YouTube Search Failed' }, { status: 500 });
  }
}
