const express = require('express');
const router = express.Router();
const { getProgress, createProgress, updateProgress, deleteProgress, getAllProgressEntries } = require('../controllers/progressController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProgress).post(protect, createProgress);
router.get('/all', protect, admin, getAllProgressEntries);
router.route('/:id').put(protect, updateProgress).delete(protect, deleteProgress);

module.exports = router;