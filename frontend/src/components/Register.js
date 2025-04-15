import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: ''});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Try creating Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
  
      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);
  
      // Send user data to Firestore via backend
      const response = await axios.post('http://localhost:5000/auth/register', {
        name: form.name,
        email: form.email,
        role: 'user',
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
  
      setMsg(`✅ Registered successfully. Redirecting to login...`);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('❌ Registration failed:', error);
  
      const errorCode = error.code;
  
      // Firebase error for existing user
      if (errorCode === 'auth/email-already-in-use') {
        setMsg('⚠️ This email is already registered. Please login or use another.');
      } else if (error.response?.data?.error === 'User already exists') {
        setMsg('⚠️ User already exists in our database.');
      } else {
        setMsg('❌ Registration failed.');
      }
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Register
            </button>
            <p className="mt-2">Already Have an Account ?<a href='/login'> Sign in</a></p>
          </form>
          <p className="mt-3 text-center">{msg}</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
