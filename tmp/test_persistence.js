const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function runTest() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  // Define Schema exactly as in User.ts
  const UserSchema = new mongoose.Schema({
    email: String,
    moodHistory: [
      {
        mood: String,
        score: Number,
        date: { type: Date, default: Date.now },
        time: String,
      }
    ],
  });

  const TestUser = mongoose.models.TestUser || mongoose.model('TestUser', UserSchema);

  // 1. Create a test user
  const email = 'test-' + Date.now() + '@example.com';
  const user = await TestUser.create({ email });
  console.log('Created user:', user._id);

  // 2. Push to moodHistory
  const entry = { mood: 'Happy', score: 99, date: new Date(), time: '12:00 PM' };
  const updatedUser = await TestUser.findByIdAndUpdate(
    user._id,
    { $push: { moodHistory: entry } },
    { new: true }
  );

  console.log('Updated History Length:', updatedUser.moodHistory.length);
  console.log('Last Entry Mood:', updatedUser.moodHistory[0].mood);

  if (updatedUser.moodHistory.length > 0) {
    console.log('✅ PERSISTENCE WORKING IN STANDALONE SCRIPT');
  } else {
    console.log('❌ PERSISTENCE FAILED');
  }

  await mongoose.disconnect();
}

runTest().catch(console.error);
