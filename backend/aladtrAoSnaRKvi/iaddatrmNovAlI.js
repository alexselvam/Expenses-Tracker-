// Admin validation middleware
const { body, validationResult } = require('express-validator');

const common = require("../config/msjoromicnveesc");

// Common validation middleware
const validate = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return common.sendResponse(res, { status: false, message: errors.array()[0].msg });
    }

    next();
};

// Admin Login Page TFA validation
exports.pageloginTFAValidator = [
    body('tfa_code')
        .trim()
        .notEmpty()
        .withMessage('TFA Code is required')
        .isInt()
        .withMessage('Enter valid TFA Code'),

    validate
];

// Admin Login validation
exports.loginValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('paoswrsd')
        .trim()
        .notEmpty()
        .withMessage('Password is required'),

    body('pattern')
        .trim()
        .notEmpty()
        .withMessage('Pattern is required'),

    validate
];

// Admin Login TFA validation
exports.loginTFAValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('tfa_code')
        .trim()
        .notEmpty()
        .withMessage('TFA Code is required')
        .isInt()
        .withMessage('Enter valid TFA Code'),

    validate
];

// Admin Update TFA validation
exports.updateTFAValidator = [
    body('status')
        .trim()
        .notEmpty()
        .withMessage('Status is required'),

    body('secretCode')
        .trim()
        .notEmpty()
        .withMessage('TFA Code is required')
        .isInt()
        .withMessage('Enter valid TFA Code'),

    body('tfa_code')
        .trim()
        .notEmpty()
        .withMessage('TFA Code is required')
        .isInt()
        .withMessage('Enter valid TFA Code'),

    body('tfa_url')
        .trim()
        .notEmpty()
        .withMessage('TFA URL is required'),

    validate
];

// Admin Update Password validation
exports.updatePasswordValidator = [
    body('oldPassword')
        .trim()
        .notEmpty()
        .withMessage('Old Password is required'),

    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('New Password is required'),

    validate
];

// Admin Update Pattern validation
exports.updatePatternValidator = [
    body('oldPattern')
        .trim()
        .notEmpty()
        .withMessage('Old Pattern is required'),

    body('newPattern')
        .trim()
        .notEmpty()
        .withMessage('New Pattern is required'),

    validate
];