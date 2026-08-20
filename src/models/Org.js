const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  name: { type: String, default: 'স্বপ্ন সঞ্চয় সমবায় সমিতি' },
  tagline: { type: String, default: 'আজকের সঞ্চয়, আগামীর শক্তি' },
  established: { type: String, default: '' },
  address: { type: String, default: '' },
  contact: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  heroImageUrl: { type: String, default: '' },
  ratePerShare: { type: Number, default: 0 },
  onetimeRatePerShare: { type: Number, default: 2000 },
  adminPasswordHash: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Org', orgSchema);
