import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOTP } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      // If user exists but not verified, update OTP and allow signup flow to continue
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingUser.otp = otp;
      existingUser.name = name;
      existingUser.password = hashedPassword;
      await existingUser.save();
      await sendOTP(email, otp);
      return NextResponse.json({ message: 'OTP resent. Please verify.', email }, { status: 201 });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    // Send the real email
    await sendOTP(email, otp);

    return NextResponse.json({ 
      message: 'User created. Please verify OTP.',
      email 
    }, { status: 201 });


  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
