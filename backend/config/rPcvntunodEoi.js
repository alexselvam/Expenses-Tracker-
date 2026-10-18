const mongoose = require('mongoose');
const common = require('./msjoromicnveesc');
const { connection_url } = require('./geosbonosdm');

// Connection URL Decryption
let dbconnection = '';
try {
  dbconnection = common.dbdecryption(connection_url);
} catch (e) {
  console.error('Decryption failed, check connection_url:', e.message);
}

// Global cached connection for Serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Already connected aagirundhaa adhaiye reuse pannum
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Queries-ai buffer panni connect aana udan run panna
      serverSelectionTimeoutMS: 10000, // 10s-kulla server kedaikalana error throw panna
      socketTimeoutMS: 45000,
    };

    console.log('Initiating MongoDB Connection to Atlas...');

    cached.promise = mongoose.connect(dbconnection, opts).then((mongooseInstance) => {
      console.log('MongoDB Connected successfully to Atlas:', new Date());
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null; // Error vandhaa cache reset pannanum
      console.error('MongoDB Connection Error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Initial connection trigger
connectDB().catch((err) => console.error('Initial DB connect attempt error:', err));

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open at ' + new Date());
});

mongoose.connection.on('error', function (err) {
  console.error('Mongoose default connection error:', err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected at', new Date());
});

// Process termination
process.on('SIGINT', function () {
  mongoose.connection.close().then(() => {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
require('../abamcSehal/odminaldlegtias');
require('../abamcSehal/mpsntiottglea');
require('../abamcSehal/ueldstiaessr');
require('../abamcSehal/laimtmteplaee');
require('../abamcSehal/sslerugos');

module.exports = connectDB;