const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { collection_prefix } = require("../config/geosbonosdm");

const emailtemplateSchema = new Schema({
    "title": { type: String, default: "" },
    "mailsubject": { type: String, default: "" },
    "mailcontent": { type: String, default: "" },
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('emailtemplate', emailtemplateSchema, collection_prefix + 'imtpeaemaellt')