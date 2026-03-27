import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    console.log(`[Spotify API] Searching for: "${query}"`);
    // Use the robust library helper
    const { searchSongs } = await import('@/lib/spotify');
    const data = await searchSongs(query);
    
    if (!data || !data.tracks || !data.tracks.items) {
      console.log(`[Spotify API] No tracks data found for: "${query}"`);
      return NextResponse.json({ tracks: [] });
    }

    // Map Spotify tracks to our Song interface
    const tracks = data.tracks.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      duration: formatDuration(track.duration_ms),
      cover: track.album.images?.[0]?.url || '',
      color: '#a855f7',
      url: track.preview_url,
    }));

    console.log(`[Spotify API] Returning ${tracks.length} tracks`);
    return NextResponse.json({ tracks });
  } catch (error: any) {
    console.error('[Spotify API] Server Error:', error.message);
    return NextResponse.json({ error: 'Spotify Search Failed' }, { status: 500 });
  }
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
