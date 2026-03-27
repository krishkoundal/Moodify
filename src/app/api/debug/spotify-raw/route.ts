import { NextResponse } from 'next/server';
import { spotifyFetch } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || 'hindi';
  
  // Use a different limit to see if it changes the 400 error
  const endpoint = `/search?q=${encodeURIComponent(q)}&type=track&limit=10`;
  
  try {
    const data = await spotifyFetch(endpoint);
    return NextResponse.json({ 
      debug: {
        endpoint,
        timestamp: new Date().toISOString()
      },
      data 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
