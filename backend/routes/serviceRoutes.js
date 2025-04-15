const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const {
  createService,
  getAllServices,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Only admins can manage services
router.post('/', authMiddleware, adminOnly, createService);
router.get('/', authMiddleware, getAllServices);
router.put('/:id', authMiddleware, adminOnly, updateService);
router.delete('/:id', authMiddleware, adminOnly, deleteService);

module.exports = router;
