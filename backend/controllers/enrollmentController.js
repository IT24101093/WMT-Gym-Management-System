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
// @desc    Update enrollment status (Approve/Activate)
// @route   PUT /api/enrollments/:id
// @access  Private/Admin
const updateEnrollmentStatus = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        // Add a check to see if req.body exists
        if (req.body && req.body.status) {
            enrollment.status = req.body.status;
        } else {
            return res.status(400).json({ message: 'Please provide a status in the request body' });
        }

        const updatedEnrollment = await enrollment.save();
        res.status(200).json(updatedEnrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's memberships
// @route   GET /api/enrollments/my-enrollments
// @access  Private
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate('membership', 'planName price duration');
        
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { 
    enrollInPlan, 
    getAllEnrollments,  
    updateEnrollmentStatus, 
    getMyEnrollments 
};