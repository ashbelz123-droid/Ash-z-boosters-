const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'order'], required: true },
  amount: { type: Number, required: true },
  reference: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  details: { type: String } // Optional details like order ID or notes
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
