const express = require('express');
const router = express.Router();

const {register, login, forgotPassword, resetPassword,} = require('../controllers/authControllers');


router.post('/signup', register);
router.post('/signin', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);




module.exports = router;