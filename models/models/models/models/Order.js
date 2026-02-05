const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true }, // e.g., Instagram likes
  platform: { type: String, required: true }, // e.g., Instagram, TikTok
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  price: { type: Number, required: true }, // price calculated dynamically
  reference: { type: String }, // unique order ID
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
