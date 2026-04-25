const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, 'Please add a plan name']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    duration: {
        type: String,
        required: [true, 'Please add a duration (e.g., 1 Month, 1 Year)']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);