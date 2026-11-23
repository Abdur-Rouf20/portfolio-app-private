import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['project', 'experience', 'certification', 'skill'], required: true, index: true },
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  technologies: [{ type: String }],
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  category: { type: String, default: '' },
  level: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PortfolioItem', portfolioItemSchema);
