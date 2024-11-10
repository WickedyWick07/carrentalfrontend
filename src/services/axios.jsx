import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:process.env.VITE_API_URL || "https://carrentalbackend-27ee820fd956.herokuapp.com/api",
  timeout: 5000, // Adjust as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
