import axios from 'axios';
import { safeGetItem, safeRemoveItem } from './safeLocalStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
});

api.interceptors.request.use((config) => {
  const token = safeGetItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      safeRemoveItem('token');
      safeRemoveItem('admin-auth');
      window.location.href = '/kaleythankful';
      // Return a never-resolving promise so the caller's catch block
      // doesn't fire — the page is navigating away anyway.
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
