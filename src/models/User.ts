import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  image: String,
  otp: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  moodHistory: [
    {
      mood: String,
      score: Number,
      date: { type: Date, default: Date.now },
      time: String,
    }
  ],
  songsPlayed: {
    type: Number,
    default: 0,
  },
  listeningTime: {
    type: Number,
    default: 0, // In seconds
  },
});

// Clear existing model in development to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development' && mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
