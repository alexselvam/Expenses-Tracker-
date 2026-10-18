const nodemailer = require('nodemailer');
const common = require('./msjoromicnveesc')

const emailtemplate = require('../abamcSehal/laimtmteplaee');

const result = require('../oafcgeodfrnnlritoi/lensmmipeartod')

exports.sendMail = async (to, tempName, specialVar, callback) => {
    try {
        const from_mail = common.smtpdecryption(result.mail['o23Cu=wyjpS4C0gw=uf2pP'])
        const transporter = nodemailer.createTransport({
            name: common.smtpdecryption(result.mail['gjyC4up3CfP2=owu=w0S2p']),
            host: common.smtpdecryption(result.mail['gjyC4up3CfP2=owu=w0S2p']),
            port: common.smtpdecryption(result.mail['4=f2w0pCPwyujuSCp23g=o']),
            secure: false,
            auth: {
                user: common.smtpdecryption(result.mail['=3=S2Puy4gp0wCf2puoCwj']),
                pass: common.smtpdecryption(result.mail['fw=232Cjpoy0wupCgS4P=u'])
            }
        });

        const templateData = await emailtemplate.findOne({ title: tempName });
        const settingsData = await sitesetting.findOne({});

        const siteInfo = {
            '###COPYRIGHTS###': settingsData.copyrights,
            '###SITENAME###': settingsData.site_name,
        };

        const specialVars = Object.assign(specialVar, siteInfo);
        let subject = templateData.mailsubject;
        let html = templateData.mailcontent;

        for (const key in specialVars) {
            if (specialVars.hasOwnProperty(key)) {
                const regex = new RegExp(escapeRegex(key), 'g');
                subject = subject.replace(regex, specialVars[key]);
                html = html.replace(regex, specialVars[key]);
            }
        }

        const mailOptions = {
            from: `${settingsData.site_name} ${from_mail}`,
            to: to,
            subject: subject,
            html: html
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                callback(false);
            } else {
                console.log('Email sent:', info.response);
                callback(true);
            }
        });
    } catch (err) {
        console.log('smtp_error 1', err)
        callback(false);
    }
};

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}