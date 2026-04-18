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

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires Token)
const getUserProfile = async (req, res) => {
    try {
        // req.user is set by our 'protect' middleware
        const user = await User.findById(req.user._id);

        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                age: user.age,
                nic: user.nic,
                height: user.height,
                weight: user.weight,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (Requires Token)
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Check if the logged-in user matches the user they are trying to update
            if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this profile' });
            }

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.age = req.body.age || user.age;
            user.height = req.body.height || user.height;
            user.weight = req.body.weight || user.weight;

            // If the user wants to update their password, it will be hashed automatically by the pre-save hook
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                message: 'Profile updated successfully'
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Requires Token)
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Requires Token)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password } = req.body; // <--- The frontend will send the typed password here

        if (user) {
            // Check if the person is the owner or an admin
            const isOwner = user._id.toString() === req.user._id.toString();
            const isAdmin = req.user.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(401).json({ message: 'Not authorized to delete this profile' });
            }

            // IF it is a regular user trying to delete their OWN account, verify password
            if (isOwner && !isAdmin) {
                if (!password) {
                    return res.status(400).json({ message: 'Please provide your password to confirm deletion' });
                }
                
                // Compare the typed password with the hashed password in the DB
                const bcrypt = require('bcryptjs');
                const isMatch = await bcrypt.compare(password, user.password);
                
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid password. Account deletion failed.' });
                }
            }

            await user.deleteOne();
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUser, deleteUser };