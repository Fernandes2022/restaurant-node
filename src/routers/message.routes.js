const express = require('express');
const { sendMessageHandler } = require('../controllers/messageController');

const router = express.Router();

router.post('/', sendMessageHandler);

module.exports = router; 