const router = require('express').Router();
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
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

// Get user wallet balance and transactions
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ wallet: user.wallet, transactions });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Deposit to wallet (minimum 2000)
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, reference } = req.body;
    if (amount < 2000) return res.status(400).json({ error: 'Minimum deposit is 2000' });

    const user = await User.findById(req.user.id);
    user.wallet += amount;
    await user.save();

    const transaction = new Transaction({
      user: req.user.id,
      type: 'deposit',
      amount,
      reference,
      status: 'completed'
    });
    await transaction.save();

    res.json({ message: 'Deposit successful', wallet: user.wallet });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
