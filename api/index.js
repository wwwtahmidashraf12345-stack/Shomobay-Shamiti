require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const app = require('../server');

let connectionPromise;

module.exports = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    connectionPromise ||= connectDB();
    await connectionPromise;
  }
  return app(req, res);
};
