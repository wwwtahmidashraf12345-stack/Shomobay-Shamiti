const mongoose = require('mongoose');

// key examples: "2024-10" (monthly), "2025-OT1"/"2025-OT2" (জুলাই/ডিসেম্বর এককালীন),
// "levy:<levyId>" (বিশেষ এককালীন চাঁদা)
const entrySchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  key: { type: String, required: true },
  date: { type: String, default: '' },
  amount: { type: Number, required: true },
  bookNo: { type: String, default: '' },
}, { timestamps: true });

entrySchema.index({ memberId: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Entry', entrySchema);
