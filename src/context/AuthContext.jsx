import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE_URL = "https://carrentalbackend-0zuw.onrender.com/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/`);
      setCurrentUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired, refreshing...");
        try {
          const newToken = await refreshToken();
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          await fetchCurrentUser();
        } catch (error) {
          console.error("Token refresh failed...", error);
          logout();
        }
      } else {
        console.error("Failed to fetch current user", error);
      }
    }
  };

  const fetchUserRentals = async () => {
    try {
      const accessToken = localStorage.getItem('access_token'); // Changed variable name
      const headers = {
        Authorization: `Bearer ${accessToken}`, // Fixed syntax error by adding backticks
      };
      const response = await axios.get(`${API_BASE_URL}/rental-details/`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching user rentals:', error);
      throw error; // Handle error appropriately in your component
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setCurrentUser(null);
  };

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) throw new Error("No refresh token available");

    try {
      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refresh_token });
      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);
      setToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed', error);
      throw new Error("Token refresh failed");
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, fetchUserRentals, currentUser, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
