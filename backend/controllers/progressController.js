const Progress = require('../models/progressModel');

// @desc    Get all progress entries for a user
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new progress entry
// @route   POST /api/progress
// @access  Private
const createProgress = async (req, res) => {
    const { weight, workoutDone, date, notes } = req.body;

    if (!weight || !date) {
        return res.status(400).json({ message: 'Weight and date are required' });
    }

    try {
        const progress = await Progress.create({
            weight,
            workoutDone,
            date,
            notes,
            user: req.user._id
        });
        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a progress entry
// @route   PUT /api/progress/:id
// @access  Private
const updateProgress = async (req, res) => {
    const { weight, workoutDone, date, notes } = req.body;

    try {
        const progress = await Progress.findById(req.params.id);

        if (!progress) {
            return res.status(404).json({ message: 'Progress entry not found' });
        }

        if (progress.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        progress.weight = weight || progress.weight;
        progress.workoutDone = workoutDone;
        progress.date = date || progress.date;
        progress.notes = notes;

        const updatedProgress = await progress.save();
        res.status(200).json(updatedProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a progress entry
// @route   DELETE /api/progress/:id
// @access  Private
const deleteProgress = async (req, res) => {
    try {
        const progress = await Progress.findById(req.params.id);

        if (!progress) {
            return res.status(404).json({ message: 'Progress entry not found' });
        }

        if (progress.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await progress.deleteOne();
        res.status(200).json({ message: 'Progress entry removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all progress entries (Admin only)
// @route   GET /api/progress/all
// @access  Private/Admin
const getAllProgressEntries = async (req, res) => {
    try {
        const progress = await Progress.find({}).populate('user', 'name email').sort({ date: -1 });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProgress,
    createProgress,
    updateProgress,
    deleteProgress,
    getAllProgressEntries
};