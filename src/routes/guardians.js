const router = require('express').Router();
const Guardian = require('../models/Guardian');
const Member = require('../models/Member');
const requireAdmin = require('../middleware/auth');

router.get('/', async (req, res) => {
  res.json(await Guardian.find().sort({ createdAt: 1 }));
});

router.post('/', requireAdmin, async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'নাম লিখুন' });
  const g = await Guardian.create({ name, phone: (req.body.phone || '').trim() });
  res.json(g);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const update = {};
  if (req.body.name !== undefined) update.name = req.body.name.trim();
  if (req.body.phone !== undefined) update.phone = req.body.phone.trim();
  const g = await Guardian.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!g) return res.status(404).json({ error: 'জিম্মাদার খুঁজে পাওয়া যায়নি' });
  res.json(g);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await Guardian.findByIdAndDelete(req.params.id);
  await Member.updateMany({ guardianId: req.params.id }, { guardianId: null });
  res.json({ ok: true });
});

module.exports = router;
