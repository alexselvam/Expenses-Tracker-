import * as CryptoJS from 'crypto-js';
let encrt = require('./bnfYJgt')
let decry = CryptoJS.enc.Base64.parse(encrt.UYChBYkey)
let encry = CryptoJS.enc.Base64.parse(encrt.YRiQvNfxUb)

const fdefdDhc = function (val) {
    if (val != undefined) {
        let bytes = CryptoJS.AES.decrypt(val.toString(), decry, { iv: encry });
        return bytes.toString(CryptoJS.enc.Utf8);
    } else {
        return ''
    }
}

const ruQErcretenYgn = function (val) {
    if (typeof val != 'string') {
        val = JSON.stringify(val)
    }
    return CryptoJS.AES.encrypt(val, decry, { iv: encry }).toString();
}

export { fdefdDhc, ruQErcretenYgn }