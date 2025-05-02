import React, { useState } from 'react';
import { register } from '../app/services/authService.js';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { id } = await register(credentials);
      if (id) {
        navigate('/login');
      } else {
        console.error('Registration cannot be done:', err);
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
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
          label="Username"
          type="text"
          fullWidth
          margin="normal"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
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
          Register
        </Button>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
