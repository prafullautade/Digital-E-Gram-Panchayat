// src/components/Dashboard/StaffDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffDashboard = () => {
  const [services, setServices] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
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

    fetchServices();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Staff Dashboard</h2>

      <div className="card p-3">
        <h5>Available Services</h5>
        {services.length === 0 ? (
          <p>No services available.</p>
        ) : (
          <ul className="list-group">
            {services.map(service => (
              <li key={service.id} className="list-group-item">
                <strong>{service.name}</strong><br />
                <strong>Description:</strong> {service.description || 'N/A'}<br />
                <strong>Status:</strong> {service.status || 'N/A'}<br />
                <strong>Created by:</strong> {service.createdBy || 'N/A'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
