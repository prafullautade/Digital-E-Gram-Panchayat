const admin = require('firebase-admin');
const db = admin.firestore();

const createService = async (req, res) => {
  try {
    const { name, description, status, createdBy } = req.body;
    if (!name || !description || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const serviceData = {
      name,
      description,
      status: status || 'active',
      createdBy,
      createdAt: new Date()
    };

    const serviceRef = await db.collection('services').add(serviceData);
    res.status(201).json({ id: serviceRef.id, ...serviceData });
  } catch (error) {
    console.error('Create Service Error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

const getAllServices = async (req, res) => {
  try {
    const snapshot = await db.collection('services').get();
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceDoc = await db.collection('services').doc(id).get();

    if (!serviceDoc.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ id: serviceDoc.id, ...serviceDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (!name || !description || !status) {
      return res.status(400).json({ error: 'Name, description, and status are required' });
    }

    const serviceRef = db.collection('services').doc(id);
    const serviceSnap = await serviceRef.get();

    if (!serviceSnap.exists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await serviceRef.update({ name, description, status });

    res.status(200).json({ id, name, description, status });
  } catch (error) {
    console.error('Update Service Error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};


const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('services').doc(id).delete();
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
