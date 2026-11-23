import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.portfolio_token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email role');
    if (!user || user.role !== 'admin') return res.status(401).json({ message: 'Invalid session' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }
}
