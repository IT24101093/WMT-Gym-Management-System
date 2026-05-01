const Workout = require('../models/workoutModel');
const User = require('../models/userModel'); // Ensure User model is registered for populate

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Public
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({}).populate('user', 'name');
        res.status(200).json(workouts);
    } catch (error) {
        console.error('❌ Error fetching workouts:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private/Admin
const createWorkout = async (req, res) => {
    const { title, description, details, duration, difficulty, caloriesBurned, imageUrl } = req.body;

    if (!title || !duration || !caloriesBurned) {
        return res.status(400).json({ message: 'Title, duration, and caloriesBurned are required' });
    }

    try {
        const workout = await Workout.create({
            title,
            description,
            details,
            duration,
            difficulty,
            caloriesBurned,
            imageUrl,
            user: req.user._id
        });
        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private/Admin
const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        workout.title = req.body.title || workout.title;
        workout.description = req.body.description || workout.description;
        workout.details = req.body.details || workout.details;
        workout.duration = req.body.duration || workout.duration;
        workout.difficulty = req.body.difficulty || workout.difficulty;
        workout.caloriesBurned = req.body.caloriesBurned || workout.caloriesBurned;
        workout.imageUrl = req.body.imageUrl || workout.imageUrl;

        const updatedWorkout = await workout.save();

        res.status(200).json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private/Admin
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        await workout.deleteOne();

        res.status(200).json({ message: 'Workout removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout
};