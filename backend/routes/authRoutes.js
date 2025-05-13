const express = require('express');
const router = express.Router();
const {sendOtp, verifyOtp, resetPassword, resendOtp} = require("../controllers/passwordController");

//Sending OTP & Reset password
router.post('/sendotp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resetpassword', resetPassword);
router.post('/resendotp', resendOtp);

module.exports = router