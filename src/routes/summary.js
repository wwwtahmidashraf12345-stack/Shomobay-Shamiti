const router = require('express').Router();
const Entry = require('../models/Entry');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Guardian = require('../models/Guardian');
const Member = require('../models/Member');

router.get('/', async (req, res) => {
  const [entries, income, expense, guardianCount, memberCount] = await Promise.all([
    Entry.find({}, 'amount'),
    Income.find({}, 'amount'),
    Expense.find({}, 'amount'),
    Guardian.countDocuments(),
    Member.countDocuments(),
  ]);
  const savingsTotal = entries.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalIncome = income.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalExpense = expense.reduce((s, e) => s + Number(e.amount || 0), 0);
  res.json({
    guardianCount,
    memberCount,
    savingsTotal,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  });
});

module.exports = router;
