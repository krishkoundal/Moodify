import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 });
    }

    const user = await User.findOne({ email, otp });

    if (!user) {
      return NextResponse.json({ error: 'Invalid OTP or email' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification
    await user.save();

    return NextResponse.json({ message: 'Account verified successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
