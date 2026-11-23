import './config/env.js';
import app from './app.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || 5500;
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a random value of at least 32 characters');
}

await connectDB();
app.listen(port, () => console.log(`Portfolio API running on http://localhost:${port}`));
