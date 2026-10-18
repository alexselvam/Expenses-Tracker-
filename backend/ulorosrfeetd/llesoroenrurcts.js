// Packages
const express = require("express");
const router = express.Router();

// Controller
const userController = require("../tllAioronaaMnlCB/sruoretreuss");
const commonService = require("../config/msjoromicnveesc");
const validator = require("../aladtrAoSnaRKvi/iodarEsvrlatU");
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Common API

// User Login & Register
router.post('/user_register', commonService.origin_middleware, validator.registerValidator, userController.usersRegister);
router.post('/user_login', commonService.origin_middleware, validator.loginValidator, userController.usersLogin);

// User Forgot Password
router.post('/user_forgot', commonService.origin_middleware, validator.forgotValidator, userController.usersForgot);
router.post('/forgot_update', commonService.origin_middleware, validator.forgotUpdateValidator, userController.forgotUpdate);

// Profile
router.get('/profile', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.profile);

// Update Income 
router.post('/addIncome', commonService.origin_middleware, commonService.user_tokenMiddleware, validator.addincome, userController.addIncome);
router.post('/updateIncome', commonService.origin_middleware, commonService.user_tokenMiddleware, validator.addincome, userController.updateIncome);
router.post('/deleteIncome', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.deleteIncome);
router.get('/incomeDashboard', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.incomeDashboard);


// Update Expanses
router.post('/addExpenses', commonService.origin_middleware, commonService.user_tokenMiddleware, validator.addincome, userController.addExpense);
router.post('/updateExpenses', commonService.origin_middleware, commonService.user_tokenMiddleware, validator.addincome, userController.updateExpense);
router.post('/deleteExpenses', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.deleteExpense);
router.get('/expansesDashboard', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.getExpenseSummary);


////Transactions
router.get('/getTransactions', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.getTransactions);


///Dashboard data
router.get('/dashboard_data', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.dashboard);

////Report
router.post('/report_data', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.report);


router.post('/upload', upload.single('file'), commonService.origin_middleware, commonService.user_tokenMiddleware, userController.upload);

router.get('/metrics', commonService.origin_middleware, commonService.user_tokenMiddleware, userController.metrics);







module.exports = router