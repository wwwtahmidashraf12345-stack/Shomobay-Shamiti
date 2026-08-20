const mongoose = require('mongoose');

const levySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true }, // প্রতি শেয়ারে হার
  date: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Levy', levySchema);
