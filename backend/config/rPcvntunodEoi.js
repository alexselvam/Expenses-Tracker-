// Bring Mongoose into the app
const mongoose = require('mongoose');
// Create the database connection
const common = require('./msjoromicnveesc')

const { connection_url } = require('./geosbonosdm');

// const dbconnection = common.dbdecryption(connection_url);
const dbconnection ='mongodb://salexselvams5603_db_user:b8Sw3BwIMtedKD3H@ac-vwvn9ge-shard-00-00.zlw06ae.mongodb.net:27017,ac-vwvn9ge-shard-00-01.zlw06ae.mongodb.net:27017,ac-vwvn9ge-shard-00-02.zlw06ae.mongodb.net:27017/?ssl=true&replicaSet=atlas-zhb0zk-shard-0&authSource=admin';
// mongodb://localhost:27017/

mongoose.connect(dbconnection, {})
    .then(() => console.log('Connected successfully.'))
    .catch((err) => console.error(err));

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to DATE ' + new Date());
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected', new Date());
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close().then(() => {
        console.log('Mongoose default connection disconnected through app termination');
    })
});

// BRING IN YOUR SCHEMAS & MODELS
require('../abamcSehal/odminaldlegtias');
require('../abamcSehal/mpsntiottglea');
require('../abamcSehal/ueldstiaessr');
require('../abamcSehal/laimtmteplaee');
require('../abamcSehal/sslerugos');