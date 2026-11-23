import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import PortfolioItem from '../models/PortfolioItem.js';
import Profile from '../models/Profile.js';
import Message from '../models/Message.js';
import { sendContactNotification } from '../config/mailer.js';

const router = Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages have been submitted. Please try again later.' }
});
const allowedItemTypes = ['project', 'experience', 'certification', 'skill'];

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await Profile.findOne().lean();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(profile || {});
  } catch (err) { next(err); }
});

router.get('/items', async (req, res, next) => {
  try {
    const filter = { published: true };
    if (req.query.type) {
      if (!allowedItemTypes.includes(req.query.type)) return res.status(400).json({ message: 'Invalid portfolio item type' });
      filter.type = req.query.type;
    }
    const items = await PortfolioItem.find(filter).sort({ featured: -1, sortOrder: 1, createdAt: -1 }).lean();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(items);
  } catch (err) { next(err); }
});

router.post('/messages', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};
    const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim() : '';

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string' ||
        !name.trim() || !email.trim() || !message.trim()) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    if (name.trim().length > 100 || email.trim().length > 160 || subject.length > 160 || message.trim().length > 5000) {
      return res.status(400).json({ message: 'One or more fields exceed the allowed length' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }

    // Persist first: the admin inbox remains reliable even if SMTP is unavailable.
    const savedMessage = await Message.create({
      name: name.trim(), email: normalizedEmail, subject, message: message.trim()
    });

    let emailNotificationSent = false;
    try { emailNotificationSent = await sendContactNotification(savedMessage); }
    catch (mailError) { console.error('Contact email delivery failed:', mailError.message); }

    return res.status(201).json({
      message: emailNotificationSent
        ? 'Your message has been sent. Thank you!'
        : 'Your message was saved to the portfolio inbox. Email notification is temporarily unavailable.',
      emailNotificationSent
    });
  } catch (err) { next(err); }
});

export default router;
