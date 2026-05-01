const Diet = require('../models/dietModel');

// @desc    Get all diets for a user
// @route   GET /api/diets
// @access  Private
const getDiets = async (req, res) => {
    try {
        const diets = await Diet.find({}).sort({ createdAt: -1 });
        res.status(200).json(diets);
    } catch (error) {
        console.error('❌ Error fetching diets:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new diet
// @route   POST /api/diets
// @access  Private/Admin
const createDiet = async (req, res) => {
    const { planName, description, details, calories, meals, imageUrl } = req.body;

    if (!planName || !calories) {
        return res.status(400).json({ message: 'Plan name and calories are required' });
    }

    try {
        const diet = await Diet.create({
            planName,
            description,
            details,
            calories,
            meals,
            imageUrl,
            user: req.user._id
        });
        res.status(201).json(diet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a diet
// @route   DELETE /api/diets/:id
// @access  Private/Admin
const deleteDiet = async (req, res) => {
    try {
        const diet = await Diet.findById(req.params.id);
        if (!diet) return res.status(404).json({ message: 'Diet not found' });
        await diet.deleteOne();
        res.status(200).json({ message: 'Diet removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDiets,
    createDiet,
    deleteDiet
};