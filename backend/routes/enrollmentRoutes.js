const express = require('express');
const router = express.Router();
const { 
    enrollInPlan, 
    getAllEnrollments, 
    updateEnrollmentStatus,
    getMyEnrollments 
} = require('../controllers/enrollmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, enrollInPlan);
router.get('/', protect, admin, getAllEnrollments);
router.get('/my-enrollments', protect, getMyEnrollments); // For the user's "My Plan" screen
router.put('/:id', protect, admin, updateEnrollmentStatus); // For Admin to Approve

module.exports = router;