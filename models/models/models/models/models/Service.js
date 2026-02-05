const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },        // e.g., Instagram Likes
  platform: { type: String, required: true },    // e.g., Instagram, TikTok
  pricePerUnit: { type: Number, required: true },// Price per like/follower
  minQuantity: { type: Number, default: 1 },    // Minimum allowed order
  maxQuantity: { type: Number, default: 10000 },// Maximum allowed order
  active: { type: Boolean, default: true }      // Service availability
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
