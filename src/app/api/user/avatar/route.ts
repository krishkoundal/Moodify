import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      session.user.id, 
      { image: imageUrl }, 
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Avatar updated successfully', image: user.image }, { status: 200 });
  } catch (error: any) {
    console.error('Avatar update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
