// services/refreshToken.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');

  try {
    const response = await axios.post(`${API_URL}token/refresh/`, { refresh: refresh_token });
    localStorage.setItem('access_token', response.data.access);
    return response.data.access; // Return new access token
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error; // Handle token refresh failure
  }
};

export default refreshToken;
