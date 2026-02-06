const router = require('express').Router();
const Payment = require('../models/Transaction'); // Using Transaction model for payments
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check JWT
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Make payment (record in wallet)
router.post('/pay', auth, async (req, res) => {
  try {
    const { amount, reference } = req.body;
    if (!amount || !reference) return res.status(400).json({ error: 'Amount and reference required' });

    const user = await User.findById(req.user.id);
    const transaction = await Payment.create({
      user: req.user.id,
      type: 'deposit',
      amount,
      reference,
      status: 'completed',
      details: 'Pesapal payment'
    });

    user.wallet += amount;
    await user.save();

    res.json({ message: 'Payment successful', wallet: user.wallet });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get user payments
router.get('/user', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id, type: 'deposit' }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: get all payments
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const payments = await Payment.find({ type: 'deposit' }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
