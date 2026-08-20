const router = require('express').Router();
const Member = require('../models/Member');
const Entry = require('../models/Entry');
const requireAdmin = require('../middleware/auth');

router.get('/', async (req, res) => {
  res.json(await Member.find().sort({ memberNo: 1 }));
});

router.post('/', requireAdmin, async (req, res) => {
  const last = await Member.findOne().sort({ memberNo: -1 });
  const memberNo = (last ? last.memberNo : 0) + 1;
  const m = await Member.create({
    name: (req.body.name || '').trim(),
    guardianId: req.body.guardianId || null,
    phone: (req.body.phone || '').trim(),
    address: (req.body.address || '').trim(),
    shares: Number(req.body.shares) || 0,
    memberNo,
  });
  res.json(m);
});

// একসাথে অনেকজন যোগ করা (bulk add) — প্রতি লাইনে একটি নাম
router.post('/bulk', requireAdmin, async (req, res) => {
  const names = Array.isArray(req.body.names) ? req.body.names.map(n => String(n).trim()).filter(Boolean) : [];
  if (!names.length) return res.status(400).json({ error: 'কমপক্ষে একটি নাম দিন' });
  const last = await Member.findOne().sort({ memberNo: -1 });
  let n = (last ? last.memberNo : 0) + 1;
  const docs = names.map(name => ({
    name, guardianId: req.body.guardianId || null, phone: '', address: '', shares: 1, memberNo: n++,
  }));
  const created = await Member.insertMany(docs);
  res.json(created);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const update = {};
  const fields = ['name', 'guardianId', 'phone', 'address', 'shares'];
  fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
  const m = await Member.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!m) return res.status(404).json({ error: 'সদস্য খুঁজে পাওয়া যায়নি' });
  res.json(m);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  await Entry.deleteMany({ memberId: req.params.id });
  res.json({ ok: true });
});

// এই সদস্যের সব জমার এন্ট্রি (মাসিক + এককালীন + লেভি), key -> {date, amount, bookNo} আকারে
router.get('/:id/entries', async (req, res) => {
  const entries = await Entry.find({ memberId: req.params.id });
  const map = {};
  entries.forEach(e => { map[e.key] = { date: e.date, amount: e.amount, bookNo: e.bookNo }; });
  res.json(map);
});

// একটা নির্দিষ্ট key (মাস/এককালীন/লেভি) এর জমা যোগ বা পরিবর্তন করা
router.put('/:id/entries/:key', requireAdmin, async (req, res) => {
  const { date, amount, bookNo } = req.body;
  if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'সঠিক পরিমাণ দিন' });
  const e = await Entry.findOneAndUpdate(
    { memberId: req.params.id, key: req.params.key },
    { date, amount: Number(amount), bookNo, memberId: req.params.id, key: req.params.key },
    { upsert: true, new: true }
  );
  res.json(e);
});

router.delete('/:id/entries/:key', requireAdmin, async (req, res) => {
  await Entry.findOneAndDelete({ memberId: req.params.id, key: req.params.key });
  res.json({ ok: true });
});

module.exports = router;
