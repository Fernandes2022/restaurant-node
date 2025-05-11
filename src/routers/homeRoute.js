const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
 res.status(200).send('<h1>welcome to Food restaurant</h1><br><img src="https://images.pexels.com/photos/5531434/pexels-photo-5531434.jpeg?auto=compress&cs=tinysrgb&w=400" alt="">')
})

module.exports = router