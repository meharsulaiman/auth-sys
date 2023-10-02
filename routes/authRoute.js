const express = require('express');

const {
  signup,
  login,
  getMe,
  protect,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetToken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
