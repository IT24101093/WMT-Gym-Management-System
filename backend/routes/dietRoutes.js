const express = require('express');
const router = express.Router();
const { getDiets, createDiet, deleteDiet, updateDiet } = require('../controllers/dietController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDiets).post(protect, admin, createDiet);
router.route('/:id').delete(protect, admin, deleteDiet).put(protect, admin, updateDiet);

module.exports = router;