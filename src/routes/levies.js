const router = require('express').Router();
const Levy = require('../models/Levy');
const requireAdmin = require('../middleware/auth');

router.get('/', async (req, res) => {
  res.json(await Levy.find().sort({ createdAt: 1 }));
});

router.post('/', requireAdmin, async (req, res) => {
  const title = (req.body.title || '').trim();
  const amount = Number(req.body.amount);
  if (!title) return res.status(400).json({ error: 'শিরোনাম লিখুন' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'সঠিক পরিমাণ দিন' });
  const lv = await Levy.create({ title, amount, date: req.body.date || '' });
  res.json(lv);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await Levy.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
