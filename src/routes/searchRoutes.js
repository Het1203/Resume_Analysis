const express = require('express');
const { searchResume } = require('../controllers/searchController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/user', authenticate, searchResume);

module.exports = router;