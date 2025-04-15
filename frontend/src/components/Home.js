import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';

const Home = () => {
  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
      })
      .catch((err) => console.error('Error during auto-logout:', err));
  }, []);

  return (
    <div className="text-center mt-5">
      <h1>Welcome to E-Gram</h1>
      <p>Please login or register to continue.</p>
      <div className="d-flex justify-content-center mt-4 gap-3">
        <a href="/login" className="btn btn-success">Login</a>
        <a href="/register" className="btn btn-outline-success">Register</a>
      </div>
    </div>
  );
};

export default Home;
