const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, 'Please add a plan name']
    },
    description: {
        type: String
    },
    details: {
        type: String
    },
    calories: {
        type: Number,
        required: [true, 'Please add calories']
    },
    meals: [{
        name: {
            type: String,
            required: true
        },
        kcal: {
            type: Number
        },
        items: {
            type: String,
            required: true
        }
    }],
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1490645935967-10de6ba170a1?w=800'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Diet', dietSchema);