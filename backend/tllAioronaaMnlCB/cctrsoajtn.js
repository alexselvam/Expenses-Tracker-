const useragent = require('ua-parser-js');
const async = require('async');
const speakeasy = require('speakeasy');
const upload_control = require('../config/srolonlaulotdcpjre')
const moment = require('moment');
const bcrypt = require('bcryptjs');
const path = require("path");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;

// Models
const adminloghis = require('../abamcSehal/odminaldlegtias');
const loginAttempts = require('../abamcSehal/mpsntiottglea');
const users = require('../abamcSehal/ueldstiaessr');

const common = require("../config/msjoromicnveesc");

const { loginTFA } = require("../oafcgeodfrnnlritoi/yoinsLMigitr");

exports.getCaptcha = async (req, res) => {
    common.generateMathCaptcha().then((captcha) => {
        common.sendResponse(res, { status: true, data: captcha })
    })
}

function bcryptEncrypt(val) {
    const salt = bcrypt.genSaltSync(10);
    val = val.toString();
    const hash = bcrypt.hashSync(val, salt);
    return hash
}

exports.getSiteSetting = async (req, res) => {
    try {
        const settingsData = await sitesetting.find({});
        return common.sendResponse(res, { status: true, message: 'Successfully Updated', data: settingsData[0] })
    } catch (e) {
        common.sendResponse(res, { status: false, message: "Server error, please try again later !", error: e })
    }
}
