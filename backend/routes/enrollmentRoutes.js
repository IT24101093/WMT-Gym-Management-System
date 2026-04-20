const express = require('express');
const router = express.Router();
const { 
    enrollInPlan, 
    getAllEnrollments, 
    updateEnrollmentStatus,
    getMyEnrollments,
    deleteEnrollment
} = require('../controllers/enrollmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- NEW: Import the Multer upload middleware ---
const { upload } = require('../config/cloudinaryConfig');
// Add upload.single('receipt') right after protect
// 'receipt' is the exact key name you must use in Postman/React Native
router.post('/', protect, upload.single('receipt'), enrollInPlan);

router.post('/', protect, enrollInPlan);
router.get('/', protect, admin, getAllEnrollments);
router.get('/my-enrollments', protect, getMyEnrollments); // For the user's "My Plan" screen
router.put('/:id', protect, admin, updateEnrollmentStatus); // For Admin to Approve
router.delete('/:id', protect, deleteEnrollment);// For users to cancel their enrollment
module.exports = router;