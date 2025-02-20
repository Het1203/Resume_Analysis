const express = require('express');
const { enrichResume } = require('../controllers/resumeController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/enrich', authenticate, enrichResume);

module.exports = router;