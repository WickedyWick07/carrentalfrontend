import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL||"https://carrentalbackend-0zuw.onrender.com/api",
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    // Add Accept header
    'Accept': 'application/json',
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
