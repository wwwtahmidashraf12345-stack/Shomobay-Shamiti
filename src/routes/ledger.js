const router = require('express').Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const requireAdmin = require('../middleware/auth');

const MODELS = { income: Income, expense: Expense };

function getModel(req, res) {
  const M = MODELS[req.params.type];
  if (!M) { res.status(404).json({ error: 'ভুল ধরন — income অথবা expense হতে হবে' }); return null; }
  return M;
}

router.get('/:type', async (req, res) => {
  const M = getModel(req, res); if (!M) return;
  res.json(await M.find().sort({ date: -1 }));
});

router.post('/:type', requireAdmin, async (req, res) => {
  const M = getModel(req, res); if (!M) return;
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) return res.status(400).json({ error: 'সঠিক পরিমাণ দিন' });
  const doc = await M.create({ date: req.body.date || '', desc: (req.body.desc || '').trim(), amount });
  res.json(doc);
});

router.delete('/:type/:id', requireAdmin, async (req, res) => {
  const M = getModel(req, res); if (!M) return;
  await M.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
