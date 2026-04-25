const Membership = require('../models/membershipModel');

// @desc    Get all membership plans
// @route   GET /api/memberships
// @access  Public (Anyone can see the prices)
const getMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find();
        res.status(200).json(memberships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a membership plan
// @route   POST /api/memberships
// @access  Private/Admin (Only Admins can create plans)
const createMembership = async (req, res) => {
    try {
        const { planName, price, duration } = req.body;

        if (!planName || !price || !duration) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const membership = await Membership.create({ planName, price, duration });
        res.status(201).json(membership);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a membership plan
// @route   PUT /api/memberships/:id
// @access  Private/Admin
const updateMembership = async (req, res) => {
    try {
        const membership = await Membership.findById(req.params.id);

        if (!membership) {
            return res.status(404).json({ message: 'Membership plan not found' });
        }

        const updatedMembership = await Membership.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // This returns the updated document
        );

        res.status(200).json(updatedMembership);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a membership plan
// @route   DELETE /api/memberships/:id
// @access  Private/Admin
const deleteMembership = async (req, res) => {
    try {
        const membership = await Membership.findById(req.params.id);

        if (!membership) {
            return res.status(404).json({ message: 'Membership plan not found' });
        }

        await membership.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getMemberships, 
    createMembership, 
    updateMembership, 
    deleteMembership 
};