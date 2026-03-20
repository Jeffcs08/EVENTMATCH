import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('URL:', config.url);
    console.log('Token existe?', token ? 'Sim' : 'Não');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Header Authorization adicionado');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;