const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: { type: String, default: '' },
  desc: { type: String, default: '' },
  amount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
