const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  reference: { type: String }, // Unique reference for transaction
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
