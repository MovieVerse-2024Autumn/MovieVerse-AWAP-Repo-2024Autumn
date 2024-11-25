import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/auth', // Your backend base URL
});

export default axiosInstance;
