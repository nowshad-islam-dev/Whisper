import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../app/services/authService.js';
import { setCredentials as setAuthCredentials } from '../app/features/authSlice.js';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user, accessToken, refreshToken } = await login(credentials);
      dispatch(setAuthCredentials({ user, accessToken, refreshToken }));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
        >
          Login
        </Button>
        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-500">
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
