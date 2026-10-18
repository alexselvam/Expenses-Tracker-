const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { collection_prefix } = require("../config/geosbonosdm");

const adminlogSchema = new Schema({
    "user_id": { type: mongoose.Schema.Types.ObjectId, ref: 'admin', useCreateIndex: true },
    "type": { type: String, default: "" },
    "ip_address": { type: String, default: "", useCreateIndex: true },
    "browser": { type: String, default: "" },
    "deviceinfo": { type: String, default: "" },
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('adminlog', adminlogSchema, collection_prefix + 'egtmloinsiladda')