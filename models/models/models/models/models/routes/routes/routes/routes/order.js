const router = require('express').Router();
const Order = require('../models/Order');
const Service = require('../models/Service');
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

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, quantity } = req.body;
    const service = await Service.findById(serviceId);
    if (!service || !service.active) return res.status(400).json({ error: 'Invalid service' });

    const price = service.pricePerUnit * quantity;
    const user = await User.findById(req.user.id);
    if (user.wallet < price) return res.status(400).json({ error: 'Insufficient wallet balance' });

    user.wallet -= price;
    await user.save();

    const order = new Order({
      user: req.user.id,
      service: service.name,
      platform: service.platform,
      quantity,
      price,
      status: 'pending',
      reference: `ORD-${Date.now()}`
    });
    await order.save();

    res.json({ message: 'Order placed', order, wallet: user.wallet });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
