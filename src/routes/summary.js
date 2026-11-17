const router = require('express').Router();
const Entry = require('../models/Entry');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Guardian = require('../models/Guardian');
const Member = require('../models/Member');
const Levy = require('../models/Levy');
const Org = require('../models/Org');

router.get('/', async (req, res) => {
  const [entries, income, expense, guardians, members, levies, org] = await Promise.all([
    Entry.find({}, 'memberId amount'),
    Income.find({}, 'amount'),
    Expense.find({}, 'amount'),
    Guardian.countDocuments(),
    Member.find({}, 'shares'),
    Levy.find({}, 'amount'),
    Org.findOne(),
  ]);
  const savingsTotal = entries.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalIncome = income.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalExpense = expense.reduce((s, e) => s + Number(e.amount || 0), 0);
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (year > 2030 || (year === 2030 && month > 12)) {
    year = 2030;
    month = 12;
  }
  const regularMonths = year < 2024 || (year === 2024 && month < 10)
    ? 0
    : (year - 2024) * 12 + month - 10 + 1;
  let onetimeCount = 0;
  for (let y = 2025; y <= 2030; y++) {
    if (year > y || (year === y && month >= 7)) onetimeCount++;
    if (year > y || (year === y && month >= 12)) onetimeCount++;
  }
  const ratePerShare = Number(org && org.ratePerShare || 0);
  const onetimeRatePerShare = org && org.onetimeRatePerShare !== undefined
    ? Number(org.onetimeRatePerShare)
    : 2000;
  const levyRatePerShare = levies.reduce((sum, levy) => sum + Number(levy.amount || 0), 0);
  const expectedPerShare = ratePerShare * regularMonths
    + onetimeRatePerShare * onetimeCount
    + levyRatePerShare;
  const totalShares = members.reduce((sum, member) => sum + Number(member.shares || 0), 0);
  const totalExpected = totalShares * expectedPerShare;
  const actualByMember = new Map();
  entries.forEach(entry => {
    const memberId = String(entry.memberId);
    actualByMember.set(memberId, (actualByMember.get(memberId) || 0) + Number(entry.amount || 0));
  });
  const dueByMember = members.map(member => Math.max(
    0,
    Number(member.shares || 0) * expectedPerShare - (actualByMember.get(String(member._id)) || 0)
  ));
  const totalDue = dueByMember.reduce((sum, due) => sum + due, 0);
  const dueCount = dueByMember.filter(due => due > 0).length;
  res.json({
    guardianCount: guardians,
    memberCount: members.length,
    savingsTotal,
    totalIncome,
    totalExpense,
    totalExpected,
    totalDue,
    paidCount: members.length - dueCount,
    dueCount,
    balance: savingsTotal + totalIncome - totalExpense,
  });
});

module.exports = router;
