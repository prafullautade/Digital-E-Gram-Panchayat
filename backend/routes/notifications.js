const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('notifications').orderBy('createdAt', 'desc').get();
    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
