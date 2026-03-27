import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select('songsPlayed listeningTime');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      songsPlayed: user.songsPlayed || 0,
      listeningTime: user.listeningTime || 0
    }, { status: 200 });
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { incrementSongs, incrementTime } = await req.json();

    await dbConnect();
    
    const update: any = {};
    if (incrementSongs) {
      update.$inc = { ...update.$inc, songsPlayed: 1 };
    }
    if (incrementTime) {
      update.$inc = { ...update.$inc, listeningTime: incrementTime };
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No update parameters provided' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      update,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      songsPlayed: user.songsPlayed,
      listeningTime: user.listeningTime
    }, { status: 200 });
  } catch (error: any) {
    console.error('Stats update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
