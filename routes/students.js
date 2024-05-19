const express = require('express');
const router = express.Router();
const { searchLostObject } = require('../controllers/studentController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.post('/search', ensureAuthenticated, searchLostObject);

module.exports = router;
