const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: [true, 'Please add trainer']
    },
    className: {
        type: String,
        required: [true, 'Please add class name']
    },
    date: {
        type: Date,
        required: [true, 'Please add date']
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);