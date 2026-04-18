const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links to your User model
    },
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Membership' // Links to your Membership model
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Active', 'Expired'],
        default: 'Pending'
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);