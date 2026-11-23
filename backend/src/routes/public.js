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

router.get('/profile', async (req, res, next) => {
  try {
    const profile = await Profile.findOne().lean();
    res.json(profile || {});
  } catch (err) { next(err); }
});

router.get('/items', async (req, res, next) => {
  try {
    const filter = { published: true };
    if (req.query.type) filter.type = req.query.type;
    const items = await PortfolioItem.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json(items);
  } catch (err) { next(err); }
});

router.post('/messages', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject = '', message } = req.body || {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    if (name.length > 100 || email.length > 160 || subject.length > 160 || message.length > 5000) {
      return res.status(400).json({ message: 'One or more fields exceed the allowed length' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }

    // Save first so the admin inbox retains the message even if SMTP is temporarily down.
    const savedMessage = await Message.create({
      name: name.trim(),
      email: normalizedEmail,
      subject: typeof subject === 'string' ? subject.trim() : '',
      message: message.trim()
    });

    let emailNotificationSent = false;
    try {
      emailNotificationSent = await sendContactNotification(savedMessage);
    } catch (mailError) {
      console.error('Contact email delivery failed:', mailError.message);
    }

    return res.status(201).json({
      message: emailNotificationSent
        ? 'Your message has been sent. Thank you!'
        : 'Your message was saved, but the email notification could not be sent right now.',
      emailNotificationSent
    });
  } catch (err) { next(err); }
});

export default router;
