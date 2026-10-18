// User validation middleware
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

// Register validation
exports.registerValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter valid email.')
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    validate
];

// Login validation
exports.loginValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter valid email.')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required'),

    validate
];



// Forgot validation
exports.forgotValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter valid email.')
        .normalizeEmail()
        .custom((value, { req }) => {

            console.log("Email:", value);
            console.log("Request Body:", req.body);
            console.log("Headers:", req.headers);

            return true;
        }),

    validate
];

// Forgot update validation
exports.forgotUpdateValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter valid email.')
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    validate
];

// Update Password validation
exports.updatePassValidator = [
    body('old_pass')
        .trim()
        .notEmpty()
        .withMessage('Old password is required'),

    body('new_pass')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('confirm_pass')
        .custom((value, { req }) => {
            if (value !== req.body.new_pass) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    validate
];

// Update Profile validation
exports.updateProfileValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),

    body('surname')
        .trim()
        .notEmpty()
        .withMessage('Surname is required'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    validate
];

// Update Address validation
exports.addincome = [
    body('source')
        .trim()
        .notEmpty()
        .withMessage('Source is required'),

    body('paymentType')
        .trim()
        .notEmpty()
        .withMessage('PaymentType is required'),

    body('source')
        .trim()
        .notEmpty()
        .withMessage('Source is required'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),

    body('date')
        .trim()
        .notEmpty()
        .withMessage('Date is required'),

    validate
];

// Cart validation
exports.cartValidator = [
    body('productId')
        .trim()
        .notEmpty()
        .withMessage('Product id is required'),

    validate
];

// Paypal Success validation
exports.paypalValidator = [
    body('productId')
        .trim()
        .notEmpty()
        .withMessage('Product id is required'),

    body('transactionId')
        .notEmpty()
        .withMessage('Transaction id is required')
        .isObject()
        .withMessage('Transaction id is required'),

    validate
];

// MyCart validation
exports.mycartValidator = [
    body('cartId')
        .trim()
        .notEmpty()
        .withMessage('Cart id is required'),

    validate
];

// Paypal Cart Success validation
exports.paypalCartValidator = [
    body('cartId')
        .trim()
        .notEmpty()
        .withMessage('Cart is required'),

    body('transactionId')
        .notEmpty()
        .withMessage('Transaction id is required')
        .isObject()
        .withMessage('Transaction id is required'),

    validate
];