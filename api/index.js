require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const app = require('../server');

let connectionPromise;

module.exports = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!connectionPromise) {
        connectionPromise = connectDB().catch((err) => {
          connectionPromise = null;
          throw err;
        });
      }

      await connectionPromise;
    }

    return app(req, res);
  } catch (error) {
    console.error('Vercel Function Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server অথবা Database Connection সমস্যা হয়েছে।'
    });
  }
};