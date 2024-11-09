import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(username, password);
      if (success) {
        console.log("Log in successful.")
        navigate('/cars');
      }
    } catch (error) {
      console.error('Failed to login', error);
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded shadow-2xl mt-20 my-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl uppercase font-semibold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-600">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Enter Your Username'
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-600">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Enter Your Password'
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </form>
      {message && <p className="text-red-600 text-center mt-2">{message}</p>}
      <p className="text-center font-semibold mt-4">
        Don't have an account yet?{' '}
        <a href="/register" className="text-blue-600 hover:underline font-semibold">Register</a>
      </p>
    </div>
  );
};

export default Login;
