const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Middleware to check admin JWT
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update order status
router.patch('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: 'Order status updated', order });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all payments
router.get('/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Transaction.find({ type: 'deposit' }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
