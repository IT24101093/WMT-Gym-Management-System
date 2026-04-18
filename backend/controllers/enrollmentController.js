const Enrollment = require('../models/enrollmentModel');

// @desc    Enroll in a membership
// @route   POST /api/enrollments
// @access  Private
const enrollInPlan = async (req, res) => {
    try {
        const { membershipId } = req.body;

        // Check if user is already enrolled in an active plan
        const existingEnrollment = await Enrollment.findOne({ 
            user: req.user._id, 
            status: 'Active' 
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'You already have an active membership' });
        }

        const enrollment = await Enrollment.create({
            user: req.user._id,
            membership: membershipId,
            status: 'Pending' // Default until admin approves
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all enrollments (For Admin Dashboard)
// @route   GET /api/enrollments
// @access  Private/Admin
const getAllEnrollments = async (req, res) => {
    try {
        // .populate helps us see the User Name and Plan Name instead of just IDs
        const enrollments = await Enrollment.find()
            .populate('user', 'name email')
            .populate('membership', 'planName price');
        
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { enrollInPlan, getAllEnrollments };