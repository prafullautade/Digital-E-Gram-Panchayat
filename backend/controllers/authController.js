const { admin, db } = require('../firebaseAdmin');

exports.registerUser = async (req, res) => {
  console.log('🚀 Backend hit with:', req.body);
  const { email, name, role } = req.body;
  const uid = req.user?.uid;

  if (!email || !name || !role || !uid) {
    console.log('❌ Missing one or more required fields');
    return res.status(400).json({ message: 'Missing fields' });
  }

  if (role !== 'user') {
    return res.status(403).json({ error: 'Only user role is allowed to register' });
  }

  const existingUserSnap = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUserSnap.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
  try {
    await db.collection('users').doc(uid).set({
      uid,
      name,
      email,
      role,
      createdAt: new Date()
    });

    console.log(`✅ Saved ${email} to Firestore`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Backend error:', err);
    res.status(500).send('Error registering user');
  }
};

// ✅ ADD THIS FUNCTION BELOW
exports.verifyUserRole = async (req, res) => {
  const uid = req.user?.uid;

  if (!uid) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    return res.status(200).json({ role: userData.role });
  } catch (err) {
    console.error('Error fetching user role:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
