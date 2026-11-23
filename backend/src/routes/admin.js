import { Router } from 'express';
import PortfolioItem from '../models/PortfolioItem.js';
import Profile from '../models/Profile.js';
import Message from '../models/Message.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

const profileFields = ['name', 'headline', 'location', 'email', 'summary', 'about', 'avatarUrl', 'resumeUrl'];
const itemFields = ['type', 'title', 'subtitle', 'description', 'imageUrl', 'link', 'technologies', 'startDate', 'endDate', 'category', 'level', 'featured', 'sortOrder', 'published'];
function pick(source, fields) {
  return Object.fromEntries(fields.filter(field => Object.hasOwn(source || {}, field)).map(field => [field, source[field]]));
}
function isSafeWebUrl(value) {
  if (value === '' || value == null) return true;
  if (typeof value !== 'string' || value.length > 2048) return false;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch { return false; }
}
function validateUrls(payload, fields) {
  for (const field of fields) if (Object.hasOwn(payload, field) && !isSafeWebUrl(payload[field])) return `${field} must be a valid http or https URL`;
  return '';
}
function profilePayload(body = {}) {
  const result = pick(body, profileFields);
  if (body.socialLinks && typeof body.socialLinks === 'object' && !Array.isArray(body.socialLinks)) result.socialLinks = pick(body.socialLinks, ['github', 'linkedin', 'website']);
  return result;
}

router.get('/overview', async (req, res, next) => {
  try {
    const [items, messages, unreadMessages] = await Promise.all([
      PortfolioItem.countDocuments(), Message.countDocuments(), Message.countDocuments({ status: 'new' })
    ]);
    res.json({ items, messages, unreadMessages });
  } catch (err) { next(err); }
});

router.get('/profile', async (req, res, next) => {
  try { res.json(await Profile.findOne().lean() || {}); }
  catch (err) { next(err); }
});

router.put('/profile', async (req, res, next) => {
  try {
    const payload = profilePayload(req.body);
    const urlError = validateUrls(payload, ['avatarUrl', 'resumeUrl']);
    const socialError = payload.socialLinks ? validateUrls(payload.socialLinks, ['github', 'linkedin', 'website']) : '';
    if (urlError || socialError) return res.status(400).json({ message: urlError || socialError });
    if (payload.name && payload.name.length > 120) return res.status(400).json({ message: 'Name must be 120 characters or fewer' });
    if (payload.headline && payload.headline.length > 180) return res.status(400).json({ message: 'Headline must be 180 characters or fewer' });
    const profile = await Profile.findOneAndUpdate({}, { $set: payload }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    res.json(profile);
  } catch (err) { next(err); }
});

router.route('/items')
  .get(async (req, res, next) => {
    try { res.json(await PortfolioItem.find().sort({ type: 1, sortOrder: 1, createdAt: -1 })); }
    catch (err) { next(err); }
  })
  .post(async (req, res, next) => {
    try {
      const payload = pick(req.body, itemFields);
      const urlError = validateUrls(payload, ['imageUrl', 'link']);
      if (urlError) return res.status(400).json({ message: urlError });
      if (payload.title && payload.title.length > 180) return res.status(400).json({ message: 'Title must be 180 characters or fewer' });
      const item = await PortfolioItem.create(payload);
      res.status(201).json(item);
    } catch (err) { next(err); }
  });

router.route('/items/:id')
  .put(async (req, res, next) => {
    try {
      const payload = pick(req.body, itemFields);
      const urlError = validateUrls(payload, ['imageUrl', 'link']);
      if (urlError) return res.status(400).json({ message: urlError });
      if (payload.title && payload.title.length > 180) return res.status(400).json({ message: 'Title must be 180 characters or fewer' });
      const item = await PortfolioItem.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.json(item);
    } catch (err) { next(err); }
  })
  .delete(async (req, res, next) => {
    try {
      const item = await PortfolioItem.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.json({ message: 'Item deleted' });
    } catch (err) { next(err); }
  });

router.get('/messages', async (req, res, next) => {
  try { res.json(await Message.find().sort({ createdAt: -1 })); }
  catch (err) { next(err); }
});

router.patch('/messages/:id', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!['new', 'read', 'archived'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) { next(err); }
});

router.delete('/messages/:id', async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) { next(err); }
});

export default router;
