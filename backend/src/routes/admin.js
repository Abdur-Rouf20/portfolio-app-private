import { Router } from 'express';
import PortfolioItem from '../models/PortfolioItem.js';
import Profile from '../models/Profile.js';
import Message from '../models/Message.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

router.get('/overview', async (req, res, next) => {
  try {
    const [items, messages, unreadMessages] = await Promise.all([
      PortfolioItem.countDocuments(), Message.countDocuments(), Message.countDocuments({ status: 'new' })
    ]);
    res.json({ items, messages, unreadMessages });
  } catch (err) { next(err); }
});

router.put('/profile', async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json(profile);
  } catch (err) { next(err); }
});

router.route('/items')
  .get(async (req, res, next) => {
    try {
      const items = await PortfolioItem.find().sort({ type: 1, sortOrder: 1, createdAt: -1 });
      res.json(items);
    } catch (err) { next(err); }
  })
  .post(async (req, res, next) => {
    try {
      const item = await PortfolioItem.create(req.body);
      res.status(201).json(item);
    } catch (err) { next(err); }
  });

router.route('/items/:id')
  .put(async (req, res, next) => {
    try {
      const item = await PortfolioItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    const { status } = req.body;
    if (!['new', 'read', 'archived'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true });
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
