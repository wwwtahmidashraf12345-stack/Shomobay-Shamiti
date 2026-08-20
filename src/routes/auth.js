const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Org = require('../models/Org');
const requireAdmin = require('../middleware/auth');

function signToken() {
  return jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// প্রথমবার এডমিন পাসওয়ার্ড সেট করা (একবারই কাজ করবে, তারপর /login ব্যবহার হবে)
router.post('/setup', async (req, res) => {
  let org = await Org.findOne();
  if (org && org.adminPasswordHash) {
    return res.status(400).json({ error: 'পাসওয়ার্ড আগেই সেট করা আছে — লগইন করুন' });
  }
  const { password } = req.body;
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন' });
  }
  const hash = await bcrypt.hash(password, 10);
  if (!org) org = new Org();
  org.adminPasswordHash = hash;
  await org.save();
  res.json({ token: signToken() });
});

// এডিট মোডে লগইন
router.post('/login', async (req, res) => {
  const org = await Org.findOne();
  if (!org || !org.adminPasswordHash) {
    return res.status(400).json({ error: 'এডমিন পাসওয়ার্ড এখনো সেট করা হয়নি' });
  }
  const { password } = req.body;
  const match = await bcrypt.compare(password || '', org.adminPasswordHash);
  if (!match) return res.status(401).json({ error: 'পাসওয়ার্ড ভুল হয়েছে' });
  res.json({ token: signToken() });
});

// টোকেন এখনো বৈধ কিনা যাচাই (পেজ রিফ্রেশের পর এডিট মোড ধরে রাখতে ব্যবহৃত)
router.get('/verify', requireAdmin, (req, res) => res.json({ ok: true }));

// পাসওয়ার্ড আছে কিনা (ফ্রন্টএন্ড প্রথমবার সেটআপ দেখাবে নাকি লগইন ফর্ম, সেটা ঠিক করতে)
router.get('/status', async (req, res) => {
  const org = await Org.findOne();
  res.json({ setupDone: !!(org && org.adminPasswordHash) });
});

router.post('/change-password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const org = await Org.findOne();
  const match = await bcrypt.compare(currentPassword || '', org.adminPasswordHash);
  if (!match) return res.status(401).json({ error: 'বর্তমান পাসওয়ার্ড ভুল' });
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড দিন' });
  }
  org.adminPasswordHash = await bcrypt.hash(newPassword, 10);
  await org.save();
  res.json({ ok: true });
});

module.exports = router;
