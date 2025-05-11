const express = require('express');
const router = express.Router();

const {getUserProfileHandler} = require('../controllers/userController');
const {authenticate} = require('../middleware/authentication');




router.get('/profile', authenticate, getUserProfileHandler);

module.exports = router;
