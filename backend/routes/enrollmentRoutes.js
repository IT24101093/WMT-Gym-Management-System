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
const { upload } = require('../config/cloudinaryConfig');

// 🚀 THE BULLETPROOF UPLOAD ROUTE
router.post('/', protect, (req, res, next) => {
    const uploadMiddleware = upload.single('receipt');
    
    uploadMiddleware(req, res, (err) => {
        if (err) {
            // This finally unmasks the [object Object] crash!
            console.error("🔥 CLOUDINARY/MULTER CRASH REVEALED:");
            console.dir(err, { depth: null });
            
            // Send JSON back to the phone so it doesn't choke on HTML!
            return res.status(400).json({ 
                message: "Image upload failed! Check backend terminal.", 
                errorDetails: err.message 
            });
        }
        // If the upload succeeds, move on to the Controller
        next();
    });
}, enrollInPlan);

// (Deleted the duplicate router.post here!)

router.get('/', protect, admin, getAllEnrollments);
router.get('/my-enrollments', protect, getMyEnrollments); 
router.put('/:id', protect, admin, updateEnrollmentStatus); 
router.delete('/:id', protect, deleteEnrollment);

module.exports = router;