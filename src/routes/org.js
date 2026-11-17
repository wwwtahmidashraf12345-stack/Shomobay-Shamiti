const router = require('express').Router();
const Org = require('../models/Org');
const requireAdmin = require('../middleware/auth');

function safe(orgDoc) {
  const obj = orgDoc.toObject();
  delete obj.adminPasswordHash;
  return obj;
}

router.get('/', async (req, res) => {
  let org = await Org.findOne();
  if (!org) org = await Org.create({});
  res.json(safe(org));
});

router.put('/', requireAdmin, async (req, res) => {
  let org = await Org.findOne();
  if (!org) org = new Org();
  const fields = ['name', 'tagline', 'established', 'address', 'contact', 'contactPhone',
    'heroImageUrl', 'ratePerShare', 'onetimeRatePerShare'];
  fields.forEach(f => { if (req.body[f] !== undefined) org[f] = req.body[f]; });
  if (req.body.notices !== undefined) {
    if (!Array.isArray(req.body.notices) || req.body.notices.some(notice => typeof notice !== 'string')) {
      return res.status(400).json({ error: 'নোটিশের তালিকা সঠিক নয়' });
    }
    org.notices = req.body.notices.map(notice => notice.trim()).filter(Boolean);
  }
  await org.save();
  res.json(safe(org));
});

module.exports = router;
