const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { collection_prefix } = require("../config/geosbonosdm");

const loginattemptsSchema = new Schema({
    "ip_address": { type: String, default: "", useCreateIndex: true },
    "browser": { type: String, default: "" },
    "deviceinfo": { type: String, default: "" },
    "attemptCount": { type: Number, default: 0 },
    "lockedAt": { type: Date, default: "" },
    "is_blocked": { type: Boolean, default: false },
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('loginattempts', loginattemptsSchema, collection_prefix + 'agtliotmtesnp')