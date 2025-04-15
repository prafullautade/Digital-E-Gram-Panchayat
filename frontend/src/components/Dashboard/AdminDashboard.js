import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('active');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const createdBy = localStorage.getItem('email') || 'admin';

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err.message);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService || !description || !status) return;

    try {
      await axios.post(
        'http://localhost:5000/services',
        { name: newService, description, status, createdBy },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      setNewService('');
      setDescription('');
      setStatus('active');
      fetchServices();
    } catch (err) {
      console.error('Error creating service:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err.message);
    }
  };

  const handleEdit = (service) => {
    setEditId(service.id);
    setEditName(service.name);
    setEditDescription(service.description);
    setEditStatus(service.status);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/services/${id}`,
        {
          name: editName,
          description: editDescription,
          status: editStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      fetchServices();
    } catch (err) {
      console.error('Error updating service:', err.message);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="container mt-5 text-center">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <form onSubmit={handleCreateService} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Service name"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100">Add Service</button>
      </form>

      <div className="card p-3">
        <h5>Available Services</h5>
        {services.length === 0 ? (
          <p>No services available.</p>
        ) : (
          <ul className="list-group">
            {services.map((service) => (
              <li key={service.id} className="list-group-item">
                {editId === service.id ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Service Name"
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                    />
                    <select
                      className="form-control mb-2"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdate(service.id)}>Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{service.name}</strong> <br />
                    <small><strong>Description:</strong> {service.description}</small><br />
                    <small><strong>Status:</strong> {service.status}</small><br />
                    <small><strong>Created by:</strong> {service.createdBy}</small>
                    <div className="mt-2">
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(service)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(service.id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
