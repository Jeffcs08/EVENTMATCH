import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // URL do Django
});

// Adicionar token de autenticação em todas as requisições
api.interceptors.request.use(async config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;