const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Register user (admin only)
router.post('/register', verifyToken, authController.registerUser);

// ✅ Verify role
router.get('/verify-role', verifyToken, authController.verifyUserRole);

module.exports = router;
