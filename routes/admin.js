const express = require('express');
const router = express.Router();
const { registerLostObject, listLostObjects } = require('../controllers/adminController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

router.post('/register', ensureAuthenticated, ensureAdmin, registerLostObject);
router.get('/list', ensureAuthenticated, ensureAdmin, listLostObjects);

module.exports = router;
