// src/components/Dashboard/UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [services, setServices] = useState([]);
  const [appliedServiceIds, setAppliedServiceIds] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchServices();
    fetchAppliedRequests();
    fetchNotifications();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err.message);
    }
  };

  const fetchAppliedRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/requests/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const applied = res.data.map(req => req.serviceId);
      setAppliedServiceIds(applied);
    } catch (err) {
      console.error('Error fetching applied requests:', err.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    }
  };

  const handleApply = async (serviceId) => {
    try {
      await axios.post(
        'http://localhost:5000/requests/apply',
        { serviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppliedRequests();
    } catch (err) {
      console.error('Error applying for service:', err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Welcome to the User Dashboard</h2>

      <div className="card mb-4 p-3">
        <h5>🔔 Notifications</h5>
        {notifications.length === 0 ? (
          <p>No new notifications.</p>
        ) : (
          <ul className="list-group">
            {notifications.map((note, index) => (
              <li key={index} className="list-group-item">
                {note.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-3">
        <h5>📋 Available Services</h5>
        {services.length === 0 ? (
          <p>No services available.</p>
        ) : (
          <ul className="list-group">
            {services.map(service => (
              <li key={service.id} className="list-group-item">
                <strong>{service.name}</strong><br />
                <strong>Description:</strong> {service.description || 'N/A'}<br />
                <strong>Status:</strong> {service.status || 'N/A'}<br />
                <strong>Created by:</strong> {service.createdBy || 'N/A'}<br />
                {!appliedServiceIds.includes(service.id) ? (
                  <button className="btn btn-primary btn-sm mt-2" onClick={() => handleApply(service.id)}>
                    Apply
                  </button>
                ) : (
                  <span className="badge bg-success mt-2">Already Applied</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
