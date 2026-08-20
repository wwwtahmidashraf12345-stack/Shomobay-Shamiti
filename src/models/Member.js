const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  guardianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian', default: null },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  shares: { type: Number, default: 0 },
  memberNo: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
