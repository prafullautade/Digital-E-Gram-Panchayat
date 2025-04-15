import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching applied requests:', err.message);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Service Requests</h2>

      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate('/user/dashboard')}
      >
        ← Back to Dashboard
      </button>
      <div className="card p-3">
        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <ul className="list-group">
            {requests.map((req) => (
              <li key={req.id} className="list-group-item">
                <strong>Service:</strong> {req.serviceName}<br />
                <strong>Service ID:</strong> {req.serviceId}<br />
                <strong>Status:</strong> {req.status}<br />
                <strong>Applied At:</strong> {new Date(req.appliedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
