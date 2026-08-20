require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/org', require('./src/routes/org'));
app.use('/api/guardians', require('./src/routes/guardians'));
app.use('/api/members', require('./src/routes/members'));
app.use('/api/ledger', require('./src/routes/ledger'));
app.use('/api/levies', require('./src/routes/levies'));
app.use('/api/summary', require('./src/routes/summary'));

// ফ্রন্টএন্ড (public/index.html) স্ট্যাটিক ফাইল হিসেবে সার্ভ করা
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 সার্ভার চলছে: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB সংযোগ ব্যর্থ:', err.message);
    process.exit(1);
  });
