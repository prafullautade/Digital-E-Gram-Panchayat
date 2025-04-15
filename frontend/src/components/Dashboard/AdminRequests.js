// src/components/Admin/AdminRequests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/requests/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/requests/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Manage Service Requests</h3>

      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate('/admin/dashboard')}
      >
        ← Back to Dashboard
      </button>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Service</th>
              <th>User</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.serviceName}</td>
                <td>{req.userEmail || 'Unknown'}</td>
                <td>{req.status}</td>
                <td>{new Date(req.appliedAt).toLocaleString()}</td>
                <td>
                  {req.status === 'pending' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminRequests;
