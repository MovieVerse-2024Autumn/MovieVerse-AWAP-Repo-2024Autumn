import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API}api/auth`, // Your backend base URL
});

export default axiosInstance;
