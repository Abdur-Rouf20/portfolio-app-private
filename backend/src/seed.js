import './config/env.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Profile from './models/Profile.js';
import PortfolioItem from './models/PortfolioItem.js';

await connectDB();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) in backend/.env before seeding');
}

const existing = await User.findOne({ email: email.toLowerCase() });
if (!existing) {
  await User.create({
    name: process.env.ADMIN_NAME || 'Portfolio Administrator',
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 12)
  });
  console.log('Admin account created');
} else {
  console.log('Admin account already exists; it was not changed');
}

await Profile.findOneAndUpdate({}, {
  name: 'Your Name',
  headline: 'Software Quality Assurance & Full-Stack Engineer',
  location: 'Bangladesh',
  email,
  summary: 'I build reliable software experiences through quality engineering, automation and full-stack development.',
  about: 'Replace this sample biography with your own professional story, experience and career goals.',
  socialLinks: { github: 'https://github.com/your-username', linkedin: 'https://linkedin.com/in/your-profile' }
}, { upsert: true, new: true });

if (await PortfolioItem.countDocuments() === 0) {
  await PortfolioItem.insertMany([
    { type: 'project', title: 'Engineering Portfolio Platform', subtitle: 'Full-stack portfolio CMS', description: 'A portfolio platform with a protected content management dashboard.', technologies: ['React', 'Node.js', 'Express', 'MongoDB'], featured: true, sortOrder: 1 },
    { type: 'experience', title: 'Software Quality Assurance Intern', subtitle: 'Company name', description: 'Replace with your verified responsibilities and achievements.', startDate: '2025', endDate: 'Present', sortOrder: 1 },
    { type: 'skill', title: 'Software Testing', category: 'Quality Engineering', level: 'Working knowledge', sortOrder: 1 },
    { type: 'skill', title: 'React & Node.js', category: 'Full-Stack Development', level: 'Working knowledge', sortOrder: 2 },
    { type: 'certification', title: 'Software Testing Certification', subtitle: 'Issuing organization', description: 'Replace with the exact certification title and issuer.', sortOrder: 1 }
  ]);
  console.log('Sample portfolio content created');
}

await mongoose.disconnect();
console.log('Seed completed');
