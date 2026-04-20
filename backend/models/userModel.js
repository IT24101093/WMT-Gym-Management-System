const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    age: {
        type: Number,
        required: [true, 'Please add an age']
    },
    nic: {
        type: String,
        required: [true, 'Please add a National Identity Card (NIC) number'],
        unique: true
    },
    height: {
        type: Number,
        required: [true, 'Please add height in cm']
    },
    weight: {
        type: Number,
        required: [true, 'Please add weight in kg']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' // Everyone registers as a regular user initially
    }
}, {
    timestamps: true 
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);