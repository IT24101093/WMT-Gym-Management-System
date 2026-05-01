const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: [true, 'Please add weight']
    },
    workoutDone: {
        type: String
    },
    date: {
        type: Date,
        required: [true, 'Please add date']
    },
    notes: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);