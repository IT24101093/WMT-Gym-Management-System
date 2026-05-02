const express = require('express');
const router = express.Router();
const { getWorkouts, createWorkout, updateWorkout, deleteWorkout } = require('../controllers/workoutController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getWorkouts)
    .post(protect, admin, createWorkout);

router.route('/:id')
     .put(protect, admin, updateWorkout)
     .delete(protect, admin, deleteWorkout);

module.exports = router;
