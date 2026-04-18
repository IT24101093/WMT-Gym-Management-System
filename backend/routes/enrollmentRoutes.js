const express = require('express');
const router = express.Router();
const { enrollInPlan, getAllEnrollments } = require('../controllers/enrollmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, enrollInPlan); // Any logged in user can enroll
router.get('/', protect, admin, getAllEnrollments); // Only admin can see the list

module.exports = router;