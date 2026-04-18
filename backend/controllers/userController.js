const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT Helper Function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        // 1. Destructure the new fields from the request
        const { name, email, password, phone, age, nic, height, weight } = req.body;

        // 2. Update Validation
        if (!name || !email || !password || !phone || !age || !nic || !height || !weight) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { nic }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or NIC' });
        }

        // 3. Create user with the new fields
        const user = await User.create({
            name, email, password, phone, age, nic, height, weight
        });

        if (user) {
            // 4. Calculate BMI (Convert height from cm to meters)
            const heightInMeters = user.height / 100;
            const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(2);

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                bmi: bmi, // Send the calculated BMI back!
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check password using the method from our model
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };