import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mood, score } = await req.json();
    if (!mood || score === undefined) {
      return NextResponse.json({ error: 'Mood and score are required' }, { status: 400 });
    }

    await dbConnect();

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMoodEntry = {
      mood,
      score,
      date: now,
      time
    };

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.moodHistory) {
      user.moodHistory = [];
    }

    user.moodHistory.push(newMoodEntry);
    await user.save();

    return NextResponse.json({ message: 'Mood saved successfully', entry: newMoodEntry }, { status: 201 });
  } catch (error: any) {
    console.error('Mood save error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select('moodHistory');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ moodHistory: user.moodHistory || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Mood fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
