import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Your Name' },
  headline: { type: String, default: 'Software Quality & Full-Stack Engineer' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },
  summary: { type: String, default: '' },
  about: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
