const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String
    },
    details: {
        type: String
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration in minutes']
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    },
    caloriesBurned: {
        type: Number,
        required: [true, 'Please add calories burned']
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1517836357463-d25dfeac00ad?w=800'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);
