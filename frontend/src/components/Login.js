// client/src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg(''); // Reset message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);
      localStorage.setItem('userName', user.displayName || user.email);

      // ✅ Fetch role from backend
      const res = await axios.get('http://localhost:5000/auth/verify-role', {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      const role = res.data.role;
      console.log('✅ Role fetched:', role);
      localStorage.setItem('role', role);

      // ✅ Navigate based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'staff') {
        navigate('/staff/dashboard');
      } else if (role === 'user') {
        navigate('/user/dashboard');
      } else {
        setMsg('❌ Unknown role');
      }

    } catch (error) {
      console.error('❌ Login error:', error.message);
      setMsg('❌ Login failed. Please check credentials.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-dark w-100">Login</button>
              <p className="mt-2 text-center">Don't have an account? <a href='/register'>Sign Up</a></p>
            </form>
            {msg && <p className="text-danger text-center mt-3">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
