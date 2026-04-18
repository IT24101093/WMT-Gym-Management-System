const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (No token needed)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (Token MUST be sent in the headers)
router.get('/profile', protect, getUserProfile);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;