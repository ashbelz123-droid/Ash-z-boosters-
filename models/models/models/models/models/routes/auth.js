const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const user = new User({ username, email, password });
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
