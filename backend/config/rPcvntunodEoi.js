// // Bring Mongoose into the app
// const mongoose = require('mongoose');
// // Create the database connection
// const common = require('./msjoromicnveesc')

// const { connection_url } = require('./geosbonosdm');

// const dbconnection = connection_url;
// // const dbconnection ='mongodb://salexselvams5603_db_user:JE6X6zZJdvIAfi57@ac-ma36q5s-shard-00-00.hl3exoq.mongodb.net:27017,ac-ma36q5s-shard-00-01.hl3exoq.mongodb.net:27017,ac-ma36q5s-shard-00-02.hl3exoq.mongodb.net:27017/?ssl=true&replicaSet=atlas-lal1ft-shard-0&authSource=admin&appName=StudentManagement';
// // mongodb://localhost:27017/

// mongoose.connect(dbconnection, {
//     bufferCommands: false,
//     serverSelectionTimeoutMS: 5000,
// })
//     .then(() => console.log('Connected successfully.'))
//     .catch((err) => console.error(err));

// // CONNECTION EVENTS
// // When successfully connected
// mongoose.connection.on('connected', function () {
//     console.log('Mongoose default connection open to DATE ' + new Date());
// });

// // If the connection throws an error
// mongoose.connection.on('error', function (err) {
//     console.log('Mongoose default connection error: ' + err);
// });

// // When the connection is disconnected
// mongoose.connection.on('disconnected', function () {
//     console.log('Mongoose default connection disconnected', new Date());
// });

// // If the Node process ends, close the Mongoose connection
// process.on('SIGINT', function () {
//     mongoose.connection.close().then(() => {
//         console.log('Mongoose default connection disconnected through app termination');
//     })
// });

// // BRING IN YOUR SCHEMAS & MODELS
// require('../abamcSehal/ueldstiaessr');



const mongoose = require('mongoose');
const { connection_url } = require('./geosbonosdm');

const dbconnection = connection_url;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(dbconnection, opts).then((mongooseInstance) => {
      console.log('MongoDB Connected successfully.');
      return mongooseInstance;
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

// Schemas & Models
// BRING IN YOUR SCHEMAS & MODELS
require('../abamcSehal/odminaldlegtias');
require('../abamcSehal/mpsntiottglea');
require('../abamcSehal/ueldstiaessr');
require('../abamcSehal/laimtmteplaee');
require('../abamcSehal/sslerugos');

module.exports = connectDB;
