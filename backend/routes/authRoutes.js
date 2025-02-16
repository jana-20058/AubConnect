const express = require('express');
const router = express.Router();
const { signup, login, sendVerificationCode, verifyCode } = require('../controllers/authController');

// Route to send verification code
router.post('/send-verification-code', sendVerificationCode);

// Route to verify the code
router.post('/verify-code', verifyCode);

// Route to sign up
router.post('/signup', signup);

// Route to log in
router.post('/login', login);

module.exports = router;