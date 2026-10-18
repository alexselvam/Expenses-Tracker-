const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const qrcode = require('qrcode');
const crypto = require('crypto');

const common = require("../oafcgeodfrnnlritoi/sVRIDgBfxFRRGrd");

const users = require('../abamcSehal/ueldstiaessr');

const secFile = require("../oafcgeodfrnnlritoi/BGErFrcRFTW");
const key = CryptoJS.enc.Base64.parse(secFile.key);
const iv = CryptoJS.enc.Base64.parse(secFile.iv);

const frontFile = require("../oafcgeodfrnnlritoi/JfvtfEerYrHU");
const DeBackkey = CryptoJS.enc.Base64.parse(frontFile.key)
const DeBackiv = CryptoJS.enc.Base64.parse(frontFile.iv)

const s3File = require("../oafcgeodfrnnlritoi/nedtpsnctpyic");
const s3key = CryptoJS.enc.Base64.parse(s3File.key);
const s3iv = CryptoJS.enc.Base64.parse(s3File.iv);

const dbFile = require("../oafcgeodfrnnlritoi/ytsiepdpnntcc");
const dbkey = CryptoJS.enc.Base64.parse(dbFile.key);
const dbiv = CryptoJS.enc.Base64.parse(dbFile.iv);

const smtpFile = require("../oafcgeodfrnnlritoi/ponielmrtsdmae");
const smtpkey = CryptoJS.enc.Base64.parse(smtpFile.key);
const smtpiv = CryptoJS.enc.Base64.parse(smtpFile.iv);

module.exports = {
    encryption: (value) => {
        const cipher = (CryptoJS.AES.encrypt(value, key, { iv: iv })).toString();
        return cipher;
    },
    decryption: (value) => {
        const decipher = CryptoJS.AES.decrypt(value, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
        return decipher;
    },
    s3encryption: (value) => {
        const cipher = (CryptoJS.AES.encrypt(value, s3key, { iv: s3iv })).toString();
        return cipher;
    },
    s3decryption: (value) => {
        const decipher = CryptoJS.AES.decrypt(value, s3key, { iv: s3iv }).toString(CryptoJS.enc.Utf8);
        return decipher;
    },
    dbencryption: (value) => {
        const cipher = (CryptoJS.AES.encrypt(value, dbkey, { iv: dbiv })).toString();
        return cipher;
    },
    dbdecryption: (value) => {
        const decipher = CryptoJS.AES.decrypt(value, dbkey, { iv: dbiv }).toString(CryptoJS.enc.Utf8);
        return decipher;
    },
    smtpencryption: (value) => {
        const cipher = (CryptoJS.AES.encrypt(value, smtpkey, { iv: smtpiv })).toString();
        return cipher;
    },
    smtpdecryption: (value) => {
        const decipher = CryptoJS.AES.decrypt(value, smtpkey, { iv: smtpiv }).toString(CryptoJS.enc.Utf8);
        return decipher;
    },
    admin_payload: (key) => {
        const payload = { subject: key };
        const token = jwt.sign(payload, common.admin_jwtToken);
        return token;
    },
    get_ipAddress: (req) => {
        let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        ip = ip.replace('::ffff:', '');
        ip = ip.split(",")
        ip = ip[0];
        return ip;
    },
    origin_middleware: async (req, res, next) => {
        try {
            const origin_data = require('../oafcgeodfrnnlritoi/ffBRrUJQT')
            if (!origin_data) {
                return sendResponse(res, { status: false, message: "Server Error" });
            }
            const origin = req.headers["origin"];
            const check_origin = origin_data.includes(origin);
            if (!check_origin) {
                return sendResponse(res, { status: false, message: "Unauthorized Request!!", code: 1 });
            }
            const referer = req.headers["referer"]
            const check_referer = origin_data.includes(referer);
            if (!check_referer) {
                return sendResponse(res, { status: false, message: "Unauthorized Request.", code: 1 });
            }
            const originRe = req.headers["origin"];
            const recheck_origin = origin_data.includes(originRe);
            if (!recheck_origin) {
                return sendResponse(res, { status: false, message: "Unauthorized Request!", code: 1 });
            }
            await requestDataDecryption(req, res)
            next();
        } catch (error) {
            return sendResponse(res, { status: false, message: "Unauthorized Request!!.", error: error, code: 1 });
        }
    },
    admin_tokenMiddleware: (req, res, next) => {
        if (!req.headers.authorization) {
            return sendResponse(res, { status: false, message: 'unauthorized', code: 0 })
        }
        const token = req.headers.authorization.split(' ')[1];
        if (token == 'null') {
            return sendResponse(res, { status: false, message: 'unauthorized', code: 0 })
        } else {
            jwt.verify(token, common.admin_jwtToken, (error, user) => {
                if (!error && user) {
                    req.user = user.subject;
                    next();
                } else {
                    return sendResponse(res, { status: false, message: 'unauthorized', code: 0 })
                }
            })
        }
    },
    generateMathCaptcha() {
        return new Promise((resolve) => {
            const captcha = {}
            const operation = ['+', '-', '*']

            captcha.first = random(10)
            captcha.second = random(10)
            const symbols = random(3)
            captcha.captchaImage = captcha.first + operation[symbols] + captcha.second
            switch (operation[symbols]) {
                case '+':
                    captcha.result = +(captcha.first) + +(captcha.second);
                    break;
                case '-':
                    captcha.result = +(captcha.first) - +(captcha.second);
                    break;

                case '*':
                    captcha.result = +(captcha.first) * +(captcha.second);
                    break;
            }

            resolve(captcha)
        })
    },
    getQrUrl(url) {
        return new Promise((resolve, reject) => {
            qrcode.toDataURL(url, function (err, urlREs) {
                if (urlREs) {
                    resolve(urlREs)
                } else {
                    reject(err)
                }
            })
        })
    },
    APIVerify: (req, res, next) => {
        try {
            const token = req.headers['gdvuduh-hfayfla'];
            const authverify = req.headers['ybdgfug-fhjsyhb'];

            const bytes = CryptoJS.AES.decrypt(authverify.toString(), DeBackkey, { iv: DeBackiv });
            const htht = bytes.toString(CryptoJS.enc.Utf8);

            const url = req.protocol + '://' + req.get('host') + req.originalUrl
            const secret = url + '/' + htht
            if (!token || !secret) {
                return sendResponse(res, { status: false, message: 'unauthorized User', code: 0 });
            }

            const payload = jwt.verify(token, secret)
            if (!payload) {
                return sendResponse(res, { status: false, message: 'unauthorized User', code: 0 });
            }
            next();
        } catch (err) {
            return sendResponse(res, { status: false, message: 'unauthorized User', code: 0, error: err });
        }
    },
    generateRandomNumber: () => {
        const now = Date.now(); // current timestamp in milliseconds
        const seed = now.toString().split('').reverse().join('');
        let hash = 0;

        for (let i = 0; i < seed.length; i++) {
            hash = (hash << 5) - hash + seed.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }

        const sixDigit = Math.abs(hash % 900000) + 100000; // ensures it's between 100000–999999        
        return sixDigit;
    },
    sendResponse: async (res, responseObj) => {
        console.log("🔥 ~ msjoromicnveesc.js:179 ~ responseObj:", responseObj);
        if (typeof responseObj != 'string') {
            responseObj = JSON.stringify(responseObj)
        }
        const result = CryptoJS.AES.encrypt(responseObj, DeBackkey, { iv: DeBackiv }).toString();
        return res.json(result);
    },
    decimalplaces: (value) => {
        return Number(parseFloat(value).toFixed(6));
    },
    buildSearchQuery: (keyword, fields) => {
        if (!keyword || keyword.trim() === '') {
            return {};
        }

        const searchValue = keyword.trim();

        return {
            $or: fields.map(field => ({
                $expr: {
                    $regexMatch: {
                        input: {
                            $toString: {
                                $ifNull: [`$${field}`, '']
                            }
                        },
                        regex: searchValue,
                        options: 'i'
                    }
                }
            }))
        };
    },
    user_payload: (key) => {
        const payload = { subject: key };
        const token = jwt.sign(payload, common.user_jwtToken);
        return token;
    },
    user_tokenMiddleware: async (req, res, next) => {
        if (!req.headers.authorization) {
            sendResponse(res, { status: false, error: 'Unauthorised Request!', code: 2 })
        }
        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            sendResponse(res, { status: false, error: 'Unauthorised Request!', code: 2 })
        } else {
            try {
                const payload = jwt.verify(token, common.user_jwtToken)
                req.userId = payload.subject;

                if (!payload) {
                    return sendResponse(res, { status: false, message: 'unauthorized Request!', code: 2 })
                }

                const userData = await users.findById(req.userId).select('_id');

                if (!userData) {
                    return sendResponse(res, { status: false, message: "This user doesn't exist!" })
                }

                next();
            } catch (err) {
                return sendResponse(res, { status: false, message: 'unauthorized Request!!', error: err, code: 2 })
            }
        }
    }
};

async function requestDataDecryption(req, res) {
    try {
        const isGet = req.method === 'GET';
        const isMultipart = req.headers['content-type']?.includes('multipart/form-data');

        // Skip multipart/form-data requests
        if (!isGet && isMultipart) {
            return;
        }

        const encryptedData = req.body?.data;

        // Handle empty data
        if (!encryptedData) {
            req.body = {};
            return;
        }

        // Decrypt data
        const bytes = CryptoJS.AES.decrypt(encryptedData, DeBackkey, { iv: DeBackiv });

        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        // Parse JSON safely
        try {
            req.body = JSON.parse(decryptedText);
        } catch {
            req.body = decryptedText;
        }
    } catch (error) {
        return sendResponse(res, { status: false, message: error.message });
    }
}

function sendResponse(res, responseObj) {
    console.log("🔥 ~ msjoromicnveesc.js:240 ~ responseObj:", responseObj);
    if (typeof responseObj != 'string') {
        responseObj = JSON.stringify(responseObj)
    }
    const result = CryptoJS.AES.encrypt(responseObj, DeBackkey, { iv: DeBackiv }).toString();
    return res.json(result);
}

function random(number) {
    return Math.floor((randomMath() * (number - 1)) + 1)
}

function randomMath() {
    const typedArray = new Uint8Array(1)
    const randomValue = crypto.getRandomValues(typedArray)[0]
    const randomFloat = randomValue / Math.pow(2, 8)
    return randomFloat
}