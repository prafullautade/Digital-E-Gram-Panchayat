const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// POST /requests/apply
router.post('/apply', authMiddleware, async (req, res) => {
  const { serviceId } = req.body;
  const uid = req.user.uid;

  try {
    const serviceRef = admin.firestore().collection('services').doc(serviceId);
    const serviceSnap = await serviceRef.get();

    if (!serviceSnap.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await admin.firestore().collection('requests').add({
      userId: uid,
      serviceId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Applied successfully' });
  } catch (err) {
    console.error('Error applying:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /requests/my
router.get('/my', authMiddleware, async (req, res) => {
  const uid = req.user.uid;

  try {
    const snapshot = await admin.firestore()
      .collection('requests')
      .where('userId', '==', uid)
      .get();

    const requests = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      let serviceName = 'Unknown';
      const serviceDoc = await admin.firestore().collection('services').doc(data.serviceId).get();
      if (serviceDoc.exists) {
        serviceName = serviceDoc.data().name;
      }

      requests.push({
        id: doc.id,
        ...data,
        serviceName,
      });
    }

    res.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /requests/all - Admin view
router.get('/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('requests').get();
    const requests = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const userDoc = await admin.firestore().collection('users').doc(data.userId).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      const serviceDoc = await admin.firestore().collection('services').doc(data.serviceId).get();
      const serviceData = serviceDoc.exists ? serviceDoc.data() : {};

      requests.push({
        id: doc.id,
        status: data.status,
        appliedAt: data.appliedAt,
        userEmail: userData.email || 'Unknown',
        serviceName: serviceData.name || 'Unknown',
      });
    }

    res.json(requests);
  } catch (err) {
    console.error('Error fetching all requests:', err);
    res.status(500).json({ error: 'Failed to fetch all requests' });
  }
});

// POST /requests/:id/approve - Approve request
router.post('/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  const requestId = req.params.id;

  try {
    const requestRef = admin.firestore().collection('requests').doc(requestId);
    const requestSnap = await requestRef.get();

    if (!requestSnap.exists) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await requestRef.update({
      status: 'approved',
    });

    res.json({ message: 'Request approved successfully' });
  } catch (err) {
    console.error('Error approving request:', err);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

module.exports = router;
