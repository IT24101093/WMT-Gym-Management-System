const express = require('express');
const router = express.Router();
const { 
    getMemberships, 
    createMembership, 
    updateMembership, 
    deleteMembership 
} = require('../controllers/membershipController');

// Import your awesome security middleware!
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to view plans (No token needed to just look)
router.get('/', getMemberships);

// Protected Admin routes (Requires Token AND Admin role)
router.post('/', protect, admin, createMembership);
router.put('/:id', protect, admin, updateMembership);
router.delete('/:id', protect, admin, deleteMembership);

module.exports = router;