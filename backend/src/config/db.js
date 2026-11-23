import mongoose from 'mongoose';

export async function connectDB() {
  // Prefer the current app's Atlas variable. Support the legacy name as fallback.
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI (or legacy MONGO_URI) is missing');
  }

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
