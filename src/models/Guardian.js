const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Guardian', guardianSchema);
