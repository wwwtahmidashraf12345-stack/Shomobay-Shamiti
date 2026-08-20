const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI সেট করা নেই। .env ফাইলে এটি বসান (উদাহরণ .env.example দেখুন)।');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB সংযুক্ত হয়েছে');
}

module.exports = connectDB;
